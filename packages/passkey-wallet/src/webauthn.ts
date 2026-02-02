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
import { generateRandomBytes, uint8ArrayToBase64, base64ToUint8Array } from './crypto';
import type { StoredCredential, RegistrationResult, AuthenticationResult } from './types';

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
  if (!isWebAuthnSupported()) {
    return {
      success: false,
      error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
    };
  }

  try {
    // Generate a unique user ID for this wallet
    const userId = generateRandomBytes(32);
    const userIdBase64 = uint8ArrayToBase64(userId);

    // Generate a challenge for the registration ceremony
    const challenge = generateRandomBytes(32);
    const challengeBase64 = uint8ArrayToBase64(challenge);

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

    // Start the registration ceremony
    const credential = await startRegistration({ optionsJSON: registrationOptions });

    // Extract the credential public key from the attestation response
    const publicKeyBytes = credential.response.publicKey
      ? credential.response.publicKey
      : '';

    // Create stored credential object
    const storedCredential: StoredCredential = {
      id: credential.id,
      rawId: base64ToUint8Array(credential.rawId),
      publicKey: publicKeyBytes,
      counter: 0,
      transports: credential.response.transports as AuthenticatorTransport[] | undefined,
    };

    return {
      success: true,
      credential: storedCredential,
    };
  } catch (error) {
    // Handle user cancellation
    if (error instanceof Error && error.name === 'NotAllowedError') {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_CANCELLED,
      };
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
 * Returns data needed to derive the encryption key
 */
export const authenticateWithPasskey = async (
  credentialId?: string
): Promise<AuthenticationResult> => {
  if (!isWebAuthnSupported()) {
    return {
      success: false,
      error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
    };
  }

  try {
    // Generate a challenge for the authentication ceremony
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

    // Start the authentication ceremony
    const assertion = await startAuthentication({ optionsJSON: authenticationOptions });

    // Convert response data to Uint8Array for key derivation
    const authenticatorData = base64ToUint8Array(assertion.response.authenticatorData);
    const clientDataJSON = base64ToUint8Array(assertion.response.clientDataJSON);
    const signature = base64ToUint8Array(assertion.response.signature);

    return {
      success: true,
      authenticatorData,
      clientDataJSON,
      signature,
    };
  } catch (error) {
    // Handle user cancellation
    if (error instanceof Error && error.name === 'NotAllowedError') {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_CANCELLED,
      };
    }

    return {
      success: false,
      error: ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED,
    };
  }
};

/**
 * Authenticate and get key material for encryption/decryption
 * This is used when unlocking the wallet
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
