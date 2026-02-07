/**
 * Deterministic Key Derivation
 * Derives Kaspa wallet keys from passkey public keys
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { createLogger } from './logger';

const logger = createLogger('DeterministicKeys');

// =============================================================================
// Deterministic Key Derivation
// =============================================================================

/**
 * Derive deterministic Kaspa private key from passkey public key
 *
 * How it works:
 * 1. Hash the passkey public key with SHA-256
 * 2. Use the hash as the Kaspa private key seed
 * 3. Same passkey public key → same hash → same Kaspa wallet
 *
 * This enables multi-device wallet access:
 * - Create wallet on Device A with fingerprint
 * - Passkey syncs via iCloud/Google
 * - Unlock on Device B with same fingerprint → same wallet!
 *
 * @param passkeyPublicKey - Uncompressed passkey public key (65 bytes: 0x04 + x + y)
 * @returns Private key hex and seed for Kaspa wallet
 */
export function deriveKaspaKeysFromPasskey(
  passkeyPublicKey: Uint8Array
): {
  privateKeyHex: string;
  seed: Uint8Array;
} {
  logger.info('[DeterministicKeys] Deriving Kaspa keys from passkey public key');

  // Validate public key format
  if (passkeyPublicKey.length !== 65) {
    throw new Error(`Invalid passkey public key length: ${passkeyPublicKey.length} (expected 65)`);
  }

  if (passkeyPublicKey[0] !== 0x04) {
    throw new Error(`Invalid passkey public key prefix: 0x${passkeyPublicKey[0].toString(16)} (expected 0x04)`);
  }

  // Step 1: Hash passkey public key with SHA-256
  const seed = sha256(passkeyPublicKey);

  logger.info('[DeterministicKeys] Seed derived:', {
    seedLength: seed.length,
    seedHex: bytesToHex(seed).substring(0, 16) + '...', // Log first 8 bytes only
  });

  // Step 2: Use seed directly as Kaspa private key (32 bytes)
  // Note: This is a simple approach. For production with multiple derivation paths,
  // consider using BIP32/BIP44 derivation from this seed
  const privateKeyHex = bytesToHex(seed);

  logger.info('[DeterministicKeys] Kaspa private key derived successfully');

  return {
    privateKeyHex,
    seed,
  };
}

/**
 * Verify that same passkey public key produces same Kaspa keys (determinism check)
 *
 * @param passkeyPublicKey - Passkey public key to test
 * @param expectedPrivateKeyHex - Expected private key hex
 * @returns True if derivation is deterministic
 */
export function verifyDeterminism(
  passkeyPublicKey: Uint8Array,
  expectedPrivateKeyHex: string
): boolean {
  try {
    const { privateKeyHex } = deriveKaspaKeysFromPasskey(passkeyPublicKey);
    return privateKeyHex === expectedPrivateKeyHex;
  } catch {
    return false;
  }
}
