/**
 * Tests for constants
 */

import { describe, it, expect } from 'vitest';
import {
  NETWORK_ID,
  DEFAULT_NETWORK,
  SOMPI_PER_KAS,
  MIN_FEE_SOMPI,
  DEFAULT_PRIORITY_FEE_SOMPI,
  ERROR_MESSAGES,
  WEBAUTHN_TIMEOUT_MS,
  RPC_TIMEOUT_MS,
} from './constants';

describe('Network Constants', () => {
  it('defines all network IDs', () => {
    expect(NETWORK_ID.MAINNET).toBe('mainnet');
    expect(NETWORK_ID.TESTNET_10).toBe('testnet-10');
    expect(NETWORK_ID.TESTNET_11).toBe('testnet-11');
  });

  it('has testnet-10 as default network', () => {
    expect(DEFAULT_NETWORK).toBe(NETWORK_ID.TESTNET_10);
  });
});

describe('Kaspa Units', () => {
  it('defines SOMPI_PER_KAS correctly', () => {
    expect(SOMPI_PER_KAS).toBe(100_000_000n);
  });

  it('defines MIN_FEE_SOMPI', () => {
    expect(MIN_FEE_SOMPI).toBe(1000n);
  });

  it('defines DEFAULT_PRIORITY_FEE_SOMPI', () => {
    expect(DEFAULT_PRIORITY_FEE_SOMPI).toBe(100_000n);
  });
});

describe('Timeout Constants', () => {
  it('defines WebAuthn timeout', () => {
    expect(WEBAUTHN_TIMEOUT_MS).toBe(60_000);
  });

  it('defines RPC timeout', () => {
    expect(RPC_TIMEOUT_MS).toBe(30_000);
  });
});

describe('Error Messages', () => {
  it('defines all error messages', () => {
    expect(ERROR_MESSAGES.WALLET_NOT_FOUND).toBeDefined();
    expect(ERROR_MESSAGES.WALLET_ALREADY_EXISTS).toBeDefined();
    expect(ERROR_MESSAGES.PASSKEY_REGISTRATION_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.INVALID_ADDRESS).toBeDefined();
    expect(ERROR_MESSAGES.INSUFFICIENT_BALANCE).toBeDefined();
    expect(ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED).toBeDefined();
    expect(ERROR_MESSAGES.USER_CANCELLED).toBeDefined();
    expect(ERROR_MESSAGES.WASM_NOT_INITIALIZED).toBeDefined();
    expect(ERROR_MESSAGES.RPC_NOT_CONNECTED).toBeDefined();
    expect(ERROR_MESSAGES.RPC_CONNECTION_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.TRANSACTION_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.INVALID_AMOUNT).toBeDefined();
  });

  it('error messages are non-empty strings', () => {
    Object.values(ERROR_MESSAGES).forEach((message) => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});
