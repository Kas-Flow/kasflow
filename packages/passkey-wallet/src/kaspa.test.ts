/**
 * Tests for Kaspa utilities
 * Note: Functions that require WASM initialization are tested in browser integration tests
 */

import { describe, it, expect } from 'vitest';
import {
  getNetworkType,
  getNetworkIdString,
  isValidAddress,
  parseAddress,
  getNetworkFromAddress,
  sompiToKas,
  kasToSompi,
  formatKas,
  uint8ArrayToHex,
  hexToUint8Array,
} from './kaspa';
import { NETWORK_ID, SOMPI_PER_KAS } from './constants';
import { KaspaPrefix } from '@kluster/kaspa-address';

describe('Network Utilities', () => {
  describe('getNetworkType', () => {
    it('returns mainnet for MAINNET', () => {
      expect(getNetworkType(NETWORK_ID.MAINNET)).toBe('mainnet');
    });

    it('returns testnet-10 for TESTNET_10', () => {
      expect(getNetworkType(NETWORK_ID.TESTNET_10)).toBe('testnet-10');
    });

    it('returns testnet-11 for TESTNET_11', () => {
      expect(getNetworkType(NETWORK_ID.TESTNET_11)).toBe('testnet-11');
    });

    it('defaults to testnet-11 for unknown network', () => {
      expect(getNetworkType('unknown' as any)).toBe('testnet-11');
    });
  });

  describe('getNetworkIdString', () => {
    it('is an alias for getNetworkType', () => {
      expect(getNetworkIdString(NETWORK_ID.MAINNET)).toBe(getNetworkType(NETWORK_ID.MAINNET));
      expect(getNetworkIdString(NETWORK_ID.TESTNET_11)).toBe(getNetworkType(NETWORK_ID.TESTNET_11));
    });
  });
});

describe('Address Utilities', () => {
  // Valid addresses from rusty-kaspa test suite
  const validMainnetAddress = 'kaspa:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkx9awp4e';
  const validTestnetAddress = 'kaspatest:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhqrxplya';

  describe('isValidAddress', () => {
    it('returns true for valid mainnet address', () => {
      expect(isValidAddress(validMainnetAddress)).toBe(true);
    });

    it('returns true for valid testnet address', () => {
      expect(isValidAddress(validTestnetAddress)).toBe(true);
    });

    it('returns false for invalid address', () => {
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('kaspa:invalid')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('parseAddress', () => {
    it('parses mainnet address correctly', () => {
      const parsed = parseAddress(validMainnetAddress);
      expect(parsed.prefix).toBe(KaspaPrefix.MAINNET);
      expect(parsed.payload).toBeInstanceOf(Uint8Array);
    });

    it('parses testnet address correctly', () => {
      const parsed = parseAddress(validTestnetAddress);
      expect(parsed.prefix).toBe(KaspaPrefix.TESTNET);
      expect(parsed.payload).toBeInstanceOf(Uint8Array);
    });

    it('throws for invalid address', () => {
      expect(() => parseAddress('invalid')).toThrow();
    });
  });

  describe('getNetworkFromAddress', () => {
    it('returns MAINNET for mainnet address', () => {
      expect(getNetworkFromAddress(validMainnetAddress)).toBe(NETWORK_ID.MAINNET);
    });

    it('returns TESTNET_11 for testnet address', () => {
      expect(getNetworkFromAddress(validTestnetAddress)).toBe(NETWORK_ID.TESTNET_11);
    });
  });
});

describe('Unit Conversion', () => {
  describe('sompiToKas', () => {
    it('converts 100000000 sompi to 1 KAS', () => {
      expect(sompiToKas(100000000n)).toBe(1);
    });

    it('converts 50000000 sompi to 0.5 KAS', () => {
      expect(sompiToKas(50000000n)).toBe(0.5);
    });

    it('converts 0 sompi to 0 KAS', () => {
      expect(sompiToKas(0n)).toBe(0);
    });

    it('handles large amounts', () => {
      const oneMillionKas = 1000000n * SOMPI_PER_KAS;
      expect(sompiToKas(oneMillionKas)).toBe(1000000);
    });
  });

  describe('kasToSompi', () => {
    it('converts 1 KAS to 100000000 sompi', () => {
      expect(kasToSompi(1)).toBe(100000000n);
    });

    it('converts 0.5 KAS to 50000000 sompi', () => {
      expect(kasToSompi(0.5)).toBe(50000000n);
    });

    it('converts 0 KAS to 0 sompi', () => {
      expect(kasToSompi(0)).toBe(0n);
    });

    it('handles decimal amounts', () => {
      expect(kasToSompi(1.5)).toBe(150000000n);
    });
  });

  describe('formatKas', () => {
    it('formats with default decimals', () => {
      expect(formatKas(100000000n)).toBe('1');
      expect(formatKas(150000000n)).toBe('1.5');
      expect(formatKas(123456789n)).toBe('1.23456789');
    });

    it('formats with specified decimals', () => {
      expect(formatKas(123456789n, 2)).toBe('1.23');
      expect(formatKas(100000000n, 4)).toBe('1');
    });

    it('handles zero', () => {
      expect(formatKas(0n)).toBe('0');
    });
  });
});

describe('Hex Utilities', () => {
  describe('uint8ArrayToHex', () => {
    it('converts empty array to empty string', () => {
      expect(uint8ArrayToHex(new Uint8Array([]))).toBe('');
    });

    it('converts single byte', () => {
      expect(uint8ArrayToHex(new Uint8Array([255]))).toBe('ff');
      expect(uint8ArrayToHex(new Uint8Array([0]))).toBe('00');
      expect(uint8ArrayToHex(new Uint8Array([15]))).toBe('0f');
    });

    it('converts multiple bytes', () => {
      expect(uint8ArrayToHex(new Uint8Array([0, 1, 2, 255]))).toBe('000102ff');
    });
  });

  describe('hexToUint8Array', () => {
    it('throws for empty string', () => {
      expect(() => hexToUint8Array('')).toThrow('Invalid hex string');
    });

    it('converts single byte hex', () => {
      expect(hexToUint8Array('ff')).toEqual(new Uint8Array([255]));
      expect(hexToUint8Array('00')).toEqual(new Uint8Array([0]));
      expect(hexToUint8Array('0f')).toEqual(new Uint8Array([15]));
    });

    it('converts multiple bytes hex', () => {
      expect(hexToUint8Array('000102ff')).toEqual(new Uint8Array([0, 1, 2, 255]));
    });

    it('is inverse of uint8ArrayToHex', () => {
      const original = new Uint8Array([0, 127, 255, 1, 128]);
      expect(hexToUint8Array(uint8ArrayToHex(original))).toEqual(original);
    });
  });
});
