/**
 * Cryptographic utilities for @kasflow/passkey-wallet
 * Uses Web Crypto API for encryption/decryption
 */

import {
  ENCRYPTION_KEY_LENGTH,
  ENCRYPTION_IV_LENGTH,
  PBKDF2_ITERATIONS,
  SALT_LENGTH,
  ERROR_MESSAGES,
} from './constants';

// =============================================================================
// Type Definitions
// =============================================================================

interface EncryptedPayload {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  salt: Uint8Array;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate cryptographically secure random bytes
 */
export const generateRandomBytes = (length: number): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(length));
};

/**
 * Convert Uint8Array to base64 string
 */
export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
};

/**
 * Convert base64 string to Uint8Array
 */
export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Convert base64url string to Uint8Array
 * Base64url uses '-' and '_' instead of '+' and '/', and has no padding
 */
export const base64urlToUint8Array = (base64url: string): Uint8Array => {
  // Convert base64url to standard base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  // Decode using standard base64 decoder
  return base64ToUint8Array(base64);
};

/**
 * Convert Uint8Array to hex string
 */
export const uint8ArrayToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Convert hex string to Uint8Array
 */
export const hexToUint8Array = (hex: string): Uint8Array => {
  const matches = hex.match(/.{1,2}/g);
  if (!matches) {
    throw new Error('Invalid hex string');
  }
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

// =============================================================================
// Key Derivation
// =============================================================================

/**
 * Derive an encryption key from passkey authentication result
 * Uses PBKDF2 with the authenticator signature as input
 */
export const deriveKeyFromPasskey = async (
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array,
  salt: Uint8Array
): Promise<CryptoKey> => {
  // Combine authenticator data and client data for key material
  const keyMaterial = new Uint8Array([...authenticatorData, ...clientDataJSON]);

  // Import as raw key material
  const baseKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-GCM key using PBKDF2
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: ENCRYPTION_KEY_LENGTH,
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );

  return derivedKey;
};

// =============================================================================
// Encryption / Decryption
// =============================================================================

/**
 * Encrypt data using AES-GCM
 */
export const encrypt = async (
  data: string,
  key: CryptoKey
): Promise<EncryptedPayload> => {
  const iv = generateRandomBytes(ENCRYPTION_IV_LENGTH);
  const salt = generateRandomBytes(SALT_LENGTH);

  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    encodedData
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    salt,
  };
};

/**
 * Decrypt data using AES-GCM
 */
export const decrypt = async (
  encryptedPayload: EncryptedPayload,
  key: CryptoKey
): Promise<string> => {
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encryptedPayload.iv.buffer as ArrayBuffer,
      },
      key,
      encryptedPayload.ciphertext.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    throw new Error(ERROR_MESSAGES.DECRYPTION_FAILED);
  }
};

/**
 * Encrypt wallet data with passkey-derived key
 */
export const encryptWalletData = async (
  data: string,
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array
): Promise<{ ciphertext: string; iv: string; salt: string }> => {
  const salt = generateRandomBytes(SALT_LENGTH);
  const key = await deriveKeyFromPasskey(authenticatorData, clientDataJSON, salt);

  const iv = generateRandomBytes(ENCRYPTION_IV_LENGTH);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    encodedData
  );

  return {
    ciphertext: uint8ArrayToBase64(new Uint8Array(ciphertext)),
    iv: uint8ArrayToBase64(iv),
    salt: uint8ArrayToBase64(salt),
  };
};

/**
 * Decrypt wallet data with passkey-derived key
 */
export const decryptWalletData = async (
  encryptedData: { ciphertext: string; iv: string; salt: string },
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array
): Promise<string> => {
  const salt = base64ToUint8Array(encryptedData.salt);
  const key = await deriveKeyFromPasskey(authenticatorData, clientDataJSON, salt);

  const ciphertext = base64ToUint8Array(encryptedData.ciphertext);
  const iv = base64ToUint8Array(encryptedData.iv);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      key,
      ciphertext.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    throw new Error(ERROR_MESSAGES.DECRYPTION_FAILED);
  }
};
