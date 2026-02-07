/**
 * COSE (CBOR Object Signing and Encryption) Parser
 * Extracts public keys from WebAuthn attestation objects
 */

import { decode } from 'cbor-x';
import { base64urlToUint8Array } from './crypto';
import { createLogger } from './logger';

const logger = createLogger('COSEParser');

// =============================================================================
// COSE Public Key Parsing
// =============================================================================

/**
 * Extract public key from WebAuthn attestation object
 *
 * @param attestationObjectBase64 - Base64url-encoded attestation object from WebAuthn
 * @returns Uncompressed secp256k1 public key (65 bytes: 0x04 + x + y)
 * @throws Error if attestation object is invalid or public key cannot be extracted
 */
export function extractPublicKeyFromAttestation(
  attestationObjectBase64: string
): Uint8Array {
  logger.info('[COSEParser] Extracting public key from attestation object');

  try {
    // Step 1: Decode base64url attestation object
    const attestationBuffer = base64urlToUint8Array(attestationObjectBase64);
    logger.info('[COSEParser] Attestation buffer length:', attestationBuffer.length);

    // Step 2: Decode CBOR to get attestation structure
    const attestation = decode(attestationBuffer) as AttestationObject;
    logger.info('[COSEParser] Attestation decoded:', {
      fmt: attestation.fmt,
      authDataLength: attestation.authData?.length,
    });

    if (!attestation.authData) {
      throw new Error('Attestation object missing authData');
    }

    // Step 3: Parse authenticator data to extract public key
    const publicKey = parseAuthenticatorData(attestation.authData);
    logger.info('[COSEParser] Public key extracted:', {
      length: publicKey.length,
      prefix: publicKey[0],
    });

    return publicKey;
  } catch (error) {
    logger.error('[COSEParser] Failed to extract public key:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract public key: ${error.message}`);
    }
    throw new Error('Failed to extract public key from attestation object');
  }
}

/**
 * Parse authenticator data to extract COSE public key
 *
 * Authenticator data structure (variable length):
 * - [0-31]   RP ID Hash (32 bytes)
 * - [32]     Flags (1 byte)
 * - [33-36]  Sign Count (4 bytes)
 * - [37-52]  AAGUID (16 bytes) [OPTIONAL - only if AT flag set]
 * - [53-54]  Credential ID Length (2 bytes, big-endian) [OPTIONAL]
 * - [55+]    Credential ID (variable length) [OPTIONAL]
 * - [...]    COSE Public Key (CBOR-encoded) [OPTIONAL]
 *
 * @param authData - Authenticator data from attestation
 * @returns Uncompressed public key
 */
function parseAuthenticatorData(authData: Uint8Array): Uint8Array {
  logger.info('[COSEParser] Parsing authenticator data:', {
    length: authData.length,
  });

  // Check minimum length (37 bytes for fixed header)
  if (authData.length < 37) {
    throw new Error(`Authenticator data too short: ${authData.length} bytes`);
  }

  // Parse flags byte to check if attested credential data is present
  const flags = authData[32];
  const attestedCredentialDataIncluded = (flags & 0x40) !== 0; // Bit 6 (AT flag)

  logger.info('[COSEParser] Flags:', {
    raw: flags.toString(2).padStart(8, '0'),
    attestedCredentialData: attestedCredentialDataIncluded,
  });

  if (!attestedCredentialDataIncluded) {
    throw new Error('Attested credential data not included in authenticator data');
  }

  // Try parsing with AAGUID first (WebAuthn spec compliant)
  // Structure: 32 (RP hash) + 1 (flags) + 4 (counter) + 16 (AAGUID) + 2 (cred ID len) = 55
  let offset = 37; // After RP hash, flags, and counter
  let publicKeyOffset = 0;
  let credIdLength = 0;

  // First attempt: with AAGUID (spec-compliant)
  if (authData.length >= 55) {
    // Skip AAGUID (16 bytes)
    offset = 53;

    // Read credential ID length
    const view = new DataView(authData.buffer, authData.byteOffset + offset, 2);
    credIdLength = view.getUint16(0, false); // big-endian

    logger.info('[COSEParser] Attempting parse WITH AAGUID - Credential ID length:', credIdLength);

    // Validate this looks reasonable
    if (credIdLength > 0 && credIdLength <= 1024) {
      publicKeyOffset = 55 + credIdLength;

      // Check if this puts us in a valid position
      if (authData.length > publicKeyOffset) {
        logger.info('[COSEParser] Successfully parsed with AAGUID');
      } else {
        // Fallback to no AAGUID
        logger.info('[COSEParser] AAGUID parse failed, trying without AAGUID');
        offset = 37;
      }
    } else {
      // Credential ID length is unreasonable, try without AAGUID
      logger.info('[COSEParser] Unreasonable cred ID length with AAGUID, trying without');
      offset = 37;
    }
  }

  // Second attempt: without AAGUID (some authenticators)
  if (offset === 37) {
    if (authData.length < 39) {
      throw new Error('Authenticator data too short for credential ID length');
    }

    const view = new DataView(authData.buffer, authData.byteOffset + offset, 2);
    credIdLength = view.getUint16(0, false);

    logger.info('[COSEParser] Attempting parse WITHOUT AAGUID - Credential ID length:', credIdLength);

    if (credIdLength > 1024) {
      throw new Error(`Credential ID length too large: ${credIdLength} bytes`);
    }

    publicKeyOffset = 39 + credIdLength;
  }

  logger.info('[COSEParser] Offset calculation:', {
    authDataLength: authData.length,
    credIdLength,
    publicKeyOffset,
    remainingBytes: authData.length - publicKeyOffset,
  });

  if (authData.length <= publicKeyOffset) {
    throw new Error(
      `Authenticator data missing COSE public key (authData length: ${authData.length}, expected offset: ${publicKeyOffset})`
    );
  }

  // Extract COSE public key (rest of the authData)
  const coseKey = authData.slice(publicKeyOffset);
  logger.info('[COSEParser] COSE key length:', coseKey.length);

  // Parse COSE key to get uncompressed public key
  return parseCOSEPublicKey(coseKey);
}

/**
 * Parse COSE public key to extract EC2 coordinates
 *
 * COSE EC2 key structure (CBOR map):
 * - 1:  kty (key type) - 2 for EC2
 * - 3:  alg (algorithm) - -7 for ES256, -8 for EdDSA, etc.
 * - -1: crv (curve) - 1 for P-256, 8 for secp256k1
 * - -2: x coordinate (32 bytes)
 * - -3: y coordinate (32 bytes)
 *
 * @param coseKey - CBOR-encoded COSE key
 * @returns Uncompressed public key (0x04 + x + y)
 */
function parseCOSEPublicKey(coseKey: Uint8Array): Uint8Array {
  logger.info('[COSEParser] Parsing COSE public key');

  try {
    // Decode CBOR-encoded COSE key
    const key = decode(coseKey) as COSEKey;

    logger.info('[COSEParser] COSE key decoded:', {
      kty: key[1],
      alg: key[3],
      crv: key[-1],
      hasX: !!key[-2],
      hasY: !!key[-3],
    });

    // Extract x and y coordinates
    const x = key[-2] as Uint8Array;
    const y = key[-3] as Uint8Array;

    if (!x || !y) {
      throw new Error('COSE key missing x or y coordinate');
    }

    if (x.length !== 32 || y.length !== 32) {
      throw new Error(`Invalid coordinate length: x=${x.length}, y=${y.length}`);
    }

    // Return uncompressed public key format: 0x04 + x + y (65 bytes total)
    const publicKey = new Uint8Array(65);
    publicKey[0] = 0x04; // Uncompressed point indicator
    publicKey.set(x, 1);
    publicKey.set(y, 33);

    logger.info('[COSEParser] Public key constructed successfully');

    return publicKey;
  } catch (error) {
    logger.error('[COSEParser] Failed to parse COSE key:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse COSE public key: ${error.message}`);
    }
    throw new Error('Failed to parse COSE public key');
  }
}

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * WebAuthn attestation object structure
 */
interface AttestationObject {
  /** Attestation statement format */
  fmt: string;
  /** Authenticator data */
  authData: Uint8Array;
  /** Attestation statement */
  attStmt: Record<string, unknown>;
}

/**
 * COSE key structure (CBOR map with integer keys)
 */
interface COSEKey {
  /** Key type (1) */
  [1]: number;
  /** Algorithm (3) */
  [3]: number;
  /** Curve (-1) */
  [-1]: number;
  /** X coordinate (-2) */
  [-2]: Uint8Array;
  /** Y coordinate (-3) */
  [-3]: Uint8Array;
}
