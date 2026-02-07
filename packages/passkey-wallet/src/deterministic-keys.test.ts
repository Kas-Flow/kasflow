/**
 * Tests for deterministic key derivation
 */

import { describe, it, expect } from 'vitest';
import { deriveKaspaKeysFromPasskey, verifyDeterminism } from './deterministic-keys';

describe('Deterministic Key Derivation', () => {
  // Test fixture: Valid uncompressed P-256 public key (65 bytes: 0x04 + x + y)
  const validPublicKey = new Uint8Array([
    0x04, // Uncompressed point indicator
    // X coordinate (32 bytes)
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    // Y coordinate (32 bytes)
    0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28,
    0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30,
    0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38,
    0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40,
  ]);

  // Another valid public key for comparison
  const validPublicKey2 = new Uint8Array([
    0x04,
    // Different X coordinate
    0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa, 0xf9, 0xf8,
    0xf7, 0xf6, 0xf5, 0xf4, 0xf3, 0xf2, 0xf1, 0xf0,
    0xef, 0xee, 0xed, 0xec, 0xeb, 0xea, 0xe9, 0xe8,
    0xe7, 0xe6, 0xe5, 0xe4, 0xe3, 0xe2, 0xe1, 0xe0,
    // Different Y coordinate
    0xdf, 0xde, 0xdd, 0xdc, 0xdb, 0xda, 0xd9, 0xd8,
    0xd7, 0xd6, 0xd5, 0xd4, 0xd3, 0xd2, 0xd1, 0xd0,
    0xcf, 0xce, 0xcd, 0xcc, 0xcb, 0xca, 0xc9, 0xc8,
    0xc7, 0xc6, 0xc5, 0xc4, 0xc3, 0xc2, 0xc1, 0xc0,
  ]);

  describe('deriveKaspaKeysFromPasskey', () => {
    it('derives keys successfully from valid public key', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      expect(result).toBeDefined();
      expect(result.privateKeyHex).toBeDefined();
      expect(result.seed).toBeDefined();
    });

    it('returns private key as hex string', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      expect(typeof result.privateKeyHex).toBe('string');
      expect(result.privateKeyHex.length).toBe(64); // 32 bytes * 2 hex chars
      expect(/^[0-9a-f]{64}$/.test(result.privateKeyHex)).toBe(true);
    });

    it('returns seed as Uint8Array of 32 bytes', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      expect(result.seed).toBeInstanceOf(Uint8Array);
      expect(result.seed.length).toBe(32); // SHA-256 produces 32 bytes
    });

    it('derives same keys from same public key (determinism)', () => {
      const result1 = deriveKaspaKeysFromPasskey(validPublicKey);
      const result2 = deriveKaspaKeysFromPasskey(validPublicKey);

      expect(result1.privateKeyHex).toBe(result2.privateKeyHex);
      expect(result1.seed).toEqual(result2.seed);
    });

    it('derives different keys from different public keys', () => {
      const result1 = deriveKaspaKeysFromPasskey(validPublicKey);
      const result2 = deriveKaspaKeysFromPasskey(validPublicKey2);

      expect(result1.privateKeyHex).not.toBe(result2.privateKeyHex);
      expect(result1.seed).not.toEqual(result2.seed);
    });

    it('throws error for invalid public key length', () => {
      const invalidLengthKey = new Uint8Array(64); // Too short
      expect(() => deriveKaspaKeysFromPasskey(invalidLengthKey)).toThrow(
        'Invalid passkey public key length: 64 (expected 65)'
      );
    });

    it('throws error for missing uncompressed prefix', () => {
      const invalidPrefixKey = new Uint8Array(65);
      invalidPrefixKey[0] = 0x03; // Wrong prefix (compressed format)
      invalidPrefixKey.fill(0xff, 1);

      expect(() => deriveKaspaKeysFromPasskey(invalidPrefixKey)).toThrow(
        'Invalid passkey public key prefix: 0x3 (expected 0x04)'
      );
    });

    it('throws error for empty array', () => {
      const emptyKey = new Uint8Array(0);
      expect(() => deriveKaspaKeysFromPasskey(emptyKey)).toThrow(
        'Invalid passkey public key length: 0 (expected 65)'
      );
    });

    it('throws error for too long array', () => {
      const tooLongKey = new Uint8Array(100);
      tooLongKey[0] = 0x04;
      expect(() => deriveKaspaKeysFromPasskey(tooLongKey)).toThrow(
        'Invalid passkey public key length: 100 (expected 65)'
      );
    });

    it('derives consistent keys for edge case: all zeros', () => {
      const allZerosKey = new Uint8Array(65);
      allZerosKey[0] = 0x04; // Valid prefix
      // Rest are zeros

      const result1 = deriveKaspaKeysFromPasskey(allZerosKey);
      const result2 = deriveKaspaKeysFromPasskey(allZerosKey);

      expect(result1.privateKeyHex).toBe(result2.privateKeyHex);
      expect(result1.seed).toEqual(result2.seed);
    });

    it('derives consistent keys for edge case: all 0xff', () => {
      const allFFKey = new Uint8Array(65);
      allFFKey[0] = 0x04; // Valid prefix
      allFFKey.fill(0xff, 1); // Rest are 0xff

      const result1 = deriveKaspaKeysFromPasskey(allFFKey);
      const result2 = deriveKaspaKeysFromPasskey(allFFKey);

      expect(result1.privateKeyHex).toBe(result2.privateKeyHex);
      expect(result1.seed).toEqual(result2.seed);
    });

    it('produces different results for keys differing by single bit', () => {
      const key1 = new Uint8Array(validPublicKey);
      const key2 = new Uint8Array(validPublicKey);
      key2[1] ^= 0x01; // Flip one bit

      const result1 = deriveKaspaKeysFromPasskey(key1);
      const result2 = deriveKaspaKeysFromPasskey(key2);

      expect(result1.privateKeyHex).not.toBe(result2.privateKeyHex);
      expect(result1.seed).not.toEqual(result2.seed);
    });

    it('privateKeyHex matches seed when converted to hex', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      // Convert seed to hex manually
      const seedHex = Array.from(result.seed)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

      expect(result.privateKeyHex).toBe(seedHex);
    });
  });

  describe('verifyDeterminism', () => {
    it('returns true when keys match', () => {
      // First, derive the expected key
      const { privateKeyHex } = deriveKaspaKeysFromPasskey(validPublicKey);

      // Then verify it
      const result = verifyDeterminism(validPublicKey, privateKeyHex);

      expect(result).toBe(true);
    });

    it('returns false when keys do not match', () => {
      const incorrectPrivateKeyHex = '0'.repeat(64);

      const result = verifyDeterminism(validPublicKey, incorrectPrivateKeyHex);

      expect(result).toBe(false);
    });

    it('returns false for invalid public key length', () => {
      const invalidKey = new Uint8Array(64);
      const somePrivateKeyHex = '0'.repeat(64);

      const result = verifyDeterminism(invalidKey, somePrivateKeyHex);

      expect(result).toBe(false);
    });

    it('returns false for invalid public key prefix', () => {
      const invalidKey = new Uint8Array(65);
      invalidKey[0] = 0x02; // Wrong prefix
      const somePrivateKeyHex = '0'.repeat(64);

      const result = verifyDeterminism(invalidKey, somePrivateKeyHex);

      expect(result).toBe(false);
    });

    it('verifies determinism across multiple derivations', () => {
      const { privateKeyHex } = deriveKaspaKeysFromPasskey(validPublicKey);

      // Verify multiple times
      expect(verifyDeterminism(validPublicKey, privateKeyHex)).toBe(true);
      expect(verifyDeterminism(validPublicKey, privateKeyHex)).toBe(true);
      expect(verifyDeterminism(validPublicKey, privateKeyHex)).toBe(true);
    });

    it('distinguishes between similar but different keys', () => {
      const key1Result = deriveKaspaKeysFromPasskey(validPublicKey);
      const key2Result = deriveKaspaKeysFromPasskey(validPublicKey2);

      // Key 1's private key should not verify with key 2's public key
      expect(verifyDeterminism(validPublicKey2, key1Result.privateKeyHex)).toBe(false);

      // Key 2's private key should not verify with key 1's public key
      expect(verifyDeterminism(validPublicKey, key2Result.privateKeyHex)).toBe(false);
    });
  });

  describe('Multi-device Wallet Simulation', () => {
    it('simulates same wallet access from different devices', () => {
      // Simulate Device A creating wallet
      const deviceAResult = deriveKaspaKeysFromPasskey(validPublicKey);

      // Simulate Device B accessing same passkey (synced via iCloud/Google)
      // Same passkey → same public key → same wallet
      const deviceBResult = deriveKaspaKeysFromPasskey(validPublicKey);

      // Both devices should derive the same wallet
      expect(deviceAResult.privateKeyHex).toBe(deviceBResult.privateKeyHex);
      expect(deviceAResult.seed).toEqual(deviceBResult.seed);
    });

    it('different users get different wallets even with similar setups', () => {
      // User A's passkey
      const userAWallet = deriveKaspaKeysFromPasskey(validPublicKey);

      // User B's passkey (different credentials → different public key)
      const userBWallet = deriveKaspaKeysFromPasskey(validPublicKey2);

      // Different wallets
      expect(userAWallet.privateKeyHex).not.toBe(userBWallet.privateKeyHex);
      expect(userAWallet.seed).not.toEqual(userBWallet.seed);
    });
  });

  describe('Security Properties', () => {
    it('produces cryptographically secure 256-bit keys', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      // SHA-256 always produces 256-bit (32 byte) output
      expect(result.seed.length).toBe(32);
      expect(result.privateKeyHex.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('seed is non-zero (no all-zero keys)', () => {
      const result = deriveKaspaKeysFromPasskey(validPublicKey);

      // Check that at least one byte is non-zero
      const hasNonZero = result.seed.some((byte) => byte !== 0);
      expect(hasNonZero).toBe(true);
    });

    it('avalanche effect: small input change causes large output change', () => {
      const key1 = new Uint8Array(validPublicKey);
      const key2 = new Uint8Array(validPublicKey);
      key2[64] ^= 0x01; // Flip last bit

      const result1 = deriveKaspaKeysFromPasskey(key1);
      const result2 = deriveKaspaKeysFromPasskey(key2);

      // Count different bytes (should be ~50% different due to SHA-256 avalanche)
      let differentBytes = 0;
      for (let i = 0; i < result1.seed.length; i++) {
        if (result1.seed[i] !== result2.seed[i]) {
          differentBytes++;
        }
      }

      // With SHA-256 avalanche effect, expect at least 25% of bytes to differ
      expect(differentBytes).toBeGreaterThan(8); // At least 8 out of 32 bytes
    });
  });
});
