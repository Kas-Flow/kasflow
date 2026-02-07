/**
 * WebAuthn utilities for @kasflow/passkey-wallet
 * Handles passkey registration and authentication
 */

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';

import {
  WEBAUTHN_RP_NAME,
  WEBAUTHN_RP_ID,
  WEBAUTHN_TIMEOUT_MS,
  WEBAUTHN_PUB_KEY_CRED_PARAMS,
  WEBAUTHN_USER_VERIFICATION,
  WEBAUTHN_AUTHENTICATOR_ATTACHMENT,
  ERROR_MESSAGES,
} from './constants';
import { generateRandomBytes, uint8ArrayToBase64, base64ToUint8Array, base64urlToUint8Array } from './crypto';
import { extractPublicKeyFromAttestation } from './cose-parser';
import { createLogger } from './logger';
import type { StoredCredential, RegistrationResult, AuthenticationResult } from './types';

const logger = createLogger('WebAuthn');

// =============================================================================
// Browser Support Check
// =============================================================================

/**
 * Check if WebAuthn is supported in the current browser
 */
export const isWebAuthnSupported = (): boolean => {
  return browserSupportsWebAuthn();
};

// =============================================================================
// Registration (Create Passkey)
// =============================================================================

/**
 * Register a new passkey for the wallet
 * This creates a new credential tied to the user's device biometrics
 */
export const registerPasskey = async (
  walletName: string
): Promise<RegistrationResult> => {
  logger.info('[WebAuthn] registerPasskey() called with name:', walletName);

  if (!isWebAuthnSupported()) {
    logger.error('[WebAuthn] WebAuthn not supported');
    return {
      success: false,
      error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
    };
  }

  try {
    // Generate a challenge for the registration ceremony
    logger.info('[WebAuthn] Generating challenge...');
    const challenge = generateRandomBytes(32);
    const challengeBase64 = uint8ArrayToBase64(challenge);

    // Generate a unique user ID for this wallet (required by WebAuthn spec)
    const userId = generateRandomBytes(32);
    const userIdBase64 = uint8ArrayToBase64(userId);

    // Create registration options
    const registrationOptions = {
      challenge: challengeBase64,
      rp: {
        name: WEBAUTHN_RP_NAME,
        id: WEBAUTHN_RP_ID,
      },
      user: {
        id: userIdBase64,
        name: walletName,
        displayName: walletName,
      },
      pubKeyCredParams: WEBAUTHN_PUB_KEY_CRED_PARAMS,
      timeout: WEBAUTHN_TIMEOUT_MS,
      authenticatorSelection: {
        authenticatorAttachment: WEBAUTHN_AUTHENTICATOR_ATTACHMENT,
        userVerification: WEBAUTHN_USER_VERIFICATION,
        residentKey: 'required' as const,
        requireResidentKey: true,
      },
      attestation: 'none' as const,
    };

    logger.info('[WebAuthn] Registration options:', {
      rpName: registrationOptions.rp.name,
      rpId: registrationOptions.rp.id,
      userName: registrationOptions.user.name,
      timeout: registrationOptions.timeout,
    });

    // Start the registration ceremony
    logger.info('[WebAuthn] Starting WebAuthn registration ceremony...');
    const credential = await startRegistration({ optionsJSON: registrationOptions });
    logger.info('[WebAuthn] Registration ceremony completed, credential received:', {
      id: credential.id,
      type: credential.type,
      hasPublicKey: !!credential.response.publicKey,
      hasAttestationObject: !!credential.response.attestationObject,
      rawId: credential.rawId,
    });

    // Extract the credential public key from the attestation response
    const publicKeyBytes = credential.response.publicKey
      ? credential.response.publicKey
      : '';

    // Extract passkey's public key from attestation object for deterministic key derivation
    logger.info('[WebAuthn] Extracting passkey public key from attestation object...');
    let passkeyPublicKey: Uint8Array | undefined;
    try {
      passkeyPublicKey = extractPublicKeyFromAttestation(credential.response.attestationObject);
      logger.info('[WebAuthn] Passkey public key extracted successfully:', {
        length: passkeyPublicKey.length,
        prefix: passkeyPublicKey[0], // Should be 0x04 for uncompressed
      });
    } catch (error) {
      logger.error('[WebAuthn] Failed to extract passkey public key:', error);
      // Registration will fail if we can't extract the public key
    }

    // Create stored credential object
    // Note: credential.rawId from @simplewebauthn/browser is base64url encoded
    const storedCredential: StoredCredential = {
      id: credential.id,
      rawId: base64urlToUint8Array(credential.rawId),
      publicKey: publicKeyBytes,
      counter: 0,
      transports: credential.response.transports as AuthenticatorTransport[] | undefined,
    };

    logger.info('[WebAuthn] Passkey registered successfully');
    return {
      success: true,
      credential: storedCredential,
      userId: userId, // Included for WebAuthn spec compliance (not used for key derivation)
      passkeyPublicKey: passkeyPublicKey, // Used for deterministic key derivation
    };
  } catch (error) {
    logger.error('[WebAuthn] Registration failed with error:', error);

    // Handle user cancellation
    if (error instanceof Error && error.name === 'NotAllowedError') {
      logger.warn('[WebAuthn] User cancelled the registration');
      return {
        success: false,
        error: ERROR_MESSAGES.USER_CANCELLED,
      };
    }

    if (error instanceof Error) {
      logger.error('[WebAuthn] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return {
      success: false,
      error: ERROR_MESSAGES.PASSKEY_REGISTRATION_FAILED,
    };
  }
};

// =============================================================================
// Authentication (Use Passkey)
// =============================================================================

/**
 * Authenticate with an existing passkey
 * Verifies user has access to the wallet via biometric authentication
 */
export const authenticateWithPasskey = async (
  credentialId?: string
): Promise<AuthenticationResult> => {
  logger.info('[WebAuthn] authenticateWithPasskey() called with credentialId:', credentialId);

  if (!isWebAuthnSupported()) {
    logger.error('[WebAuthn] WebAuthn not supported');
    return {
      success: false,
      error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
    };
  }

  try {
    // Generate a challenge for the authentication ceremony
    logger.info('[WebAuthn] Generating challenge for authentication...');
    const challenge = generateRandomBytes(32);
    const challengeBase64 = uint8ArrayToBase64(challenge);

    // Build allowed credentials list (if we have a specific credential ID)
    const allowCredentials = credentialId
      ? [
          {
            id: credentialId,
            type: 'public-key' as const,
          },
        ]
      : undefined;

    // Create authentication options
    const authenticationOptions = {
      challenge: challengeBase64,
      rpId: WEBAUTHN_RP_ID,
      timeout: WEBAUTHN_TIMEOUT_MS,
      userVerification: WEBAUTHN_USER_VERIFICATION,
      allowCredentials,
    };

    logger.info('[WebAuthn] Authentication options:', {
      rpId: authenticationOptions.rpId,
      timeout: authenticationOptions.timeout,
      hasAllowedCredentials: !!allowCredentials,
    });

    // Start the authentication ceremony
    logger.info('[WebAuthn] Starting WebAuthn authentication ceremony...');
    const assertion = await startAuthentication({ optionsJSON: authenticationOptions });
    logger.info('[WebAuthn] Authentication ceremony completed, assertion received');

    // Convert response data to Uint8Array for key derivation
    // Note: @simplewebauthn/browser returns all response data as base64url encoded
    const authenticatorData = base64urlToUint8Array(assertion.response.authenticatorData);
    const clientDataJSON = base64urlToUint8Array(assertion.response.clientDataJSON);
    const signature = base64urlToUint8Array(assertion.response.signature);

    logger.info('[WebAuthn] Authentication successful');
    return {
      success: true,
      authenticatorData,
      clientDataJSON,
      signature,
    };
  } catch (error) {
    logger.error('[WebAuthn] Authentication failed with error:', error);

    // Handle user cancellation
    if (error instanceof Error && error.name === 'NotAllowedError') {
      logger.warn('[WebAuthn] User cancelled the authentication');
      return {
        success: false,
        error: ERROR_MESSAGES.USER_CANCELLED,
      };
    }

    if (error instanceof Error) {
      logger.error('[WebAuthn] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return {
      success: false,
      error: ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED,
    };
  }
};

/**
 * Authenticate with passkey to verify user access
 * Returns authenticator data for wallet unlock verification
 */
export const getKeyMaterial = async (
  credentialId?: string
): Promise<{
  success: boolean;
  authenticatorData?: Uint8Array;
  clientDataJSON?: Uint8Array;
  error?: string;
}> => {
  const result = await authenticateWithPasskey(credentialId);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    authenticatorData: result.authenticatorData,
    clientDataJSON: result.clientDataJSON,
  };
};
