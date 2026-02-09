/**
 * Kaspa utilities for @kasflow/passkey-wallet
 * Uses @onekeyfe/kaspa-wasm for all Kaspa operations
 */

import {
  PrivateKey,
  PublicKey,
  Address,
  NetworkType,
  signTransaction as wasmSignTransaction,
  signMessage as wasmSignMessage,
  kaspaToSompi as wasmKaspaToSompi,
  sompiToKaspaString as wasmSompiToKaspaString,
  sompiToKaspaStringWithSuffix as wasmSompiToKaspaStringWithSuffix,
  createAddress,
} from '@onekeyfe/kaspa-wasm';

import { KaspaAddress, KaspaAddressVersion, KaspaPrefix } from '@kluster/kaspa-address';
import { NETWORK_ID, SOMPI_PER_KAS, ERROR_MESSAGES, type NetworkId } from './constants';
import { generateRandomBytes, uint8ArrayToHex, hexToUint8Array } from './crypto';
import { ensureWasmInitialized } from './wasm-init';

// =============================================================================
// Re-export WASM types for convenience
// =============================================================================

export { PrivateKey, PublicKey, Address, NetworkType };

// =============================================================================
// Network Utilities
// =============================================================================

/**
 * Get the network type string for WASM SDK
 * The WASM SDK accepts: 'mainnet', 'testnet-10', 'testnet-11', etc.
 */
export const getNetworkType = (network: NetworkId): string => {
  switch (network) {
    case NETWORK_ID.MAINNET:
      return 'mainnet';
    case NETWORK_ID.TESTNET_10:
      return 'testnet-10';
    case NETWORK_ID.TESTNET_11:
      return 'testnet-11';
    default:
      return 'testnet-11';
  }
};

/**
 * Get the network ID string (same as getNetworkType, for API consistency)
 */
export const getNetworkIdString = (network: NetworkId): string => getNetworkType(network);

// =============================================================================
// Key Generation
// =============================================================================

/**
 * Generate a new random private key hex string
 */
export const generatePrivateKey = (): string => {
  const randomBytes = generateRandomBytes(32);
  return uint8ArrayToHex(randomBytes);
};

/**
 * Create a PrivateKey instance from hex string
 */
export const createPrivateKey = async (privateKeyHex: string): Promise<PrivateKey> => {
  await ensureWasmInitialized();
  return new PrivateKey(privateKeyHex);
};

/**
 * Get public key hex from private key hex
 */
export const getPublicKeyHex = async (privateKeyHex: string): Promise<string> => {
  await ensureWasmInitialized();
  const privateKey = new PrivateKey(privateKeyHex);
  return privateKey.toPublicKey().toString();
};

/**
 * Get Kaspa address from private key
 */
export const getAddressFromPrivateKey = async (privateKeyHex: string, network: NetworkId): Promise<string> => {
  await ensureWasmInitialized();
  const privateKey = new PrivateKey(privateKeyHex);
  const networkType = getNetworkType(network);
  return privateKey.toAddress(networkType).toString();
};

/**
 * Validate a private key hex string
 */
export const isValidPrivateKey = async (privateKeyHex: string): Promise<boolean> => {
  await ensureWasmInitialized();
  try {
    new PrivateKey(privateKeyHex);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// Address Operations
// =============================================================================

/**
 * Create a Kaspa address from a public key
 */
export const publicKeyToAddress = async (publicKeyHex: string, network: NetworkId): Promise<string> => {
  await ensureWasmInitialized();
  const networkType = getNetworkType(network);
  const address = createAddress(publicKeyHex, networkType);
  return address.toString();
};

/**
 * Validate a Kaspa address using @kluster/kaspa-address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    KaspaAddress.fromString(address);
    return true;
  } catch {
    return false;
  }
};

/**
 * Parse a Kaspa address and extract components
 */
export const parseAddress = (address: string): {
  prefix: KaspaPrefix;
  version: KaspaAddressVersion;
  payload: Uint8Array;
} => {
  const parsed = KaspaAddress.fromString(address);
  return {
    prefix: parsed.prefix,
    version: parsed.version,
    payload: parsed.payload,
  };
};

/**
 * Get the network from an address
 */
export const getNetworkFromAddress = (address: string): NetworkId => {
  const parsed = KaspaAddress.fromString(address);
  switch (parsed.prefix) {
    case KaspaPrefix.MAINNET:
      return NETWORK_ID.MAINNET;
    case KaspaPrefix.TESTNET:
      return NETWORK_ID.TESTNET_11;
    default:
      return NETWORK_ID.TESTNET_11;
  }
};

// =============================================================================
// Message Signing
// =============================================================================

/**
 * Sign a message with a private key
 * Uses Kaspa's message signing scheme
 *
 * @param message - The message to sign
 * @param privateKeyHex - Private key as hex string
 * @returns Signature as hex string
 */
export const signMessageWithKey = async (message: string, privateKeyHex: string): Promise<string> => {
  await ensureWasmInitialized();
  const privateKey = new PrivateKey(privateKeyHex);
  return wasmSignMessage({
    message,
    privateKey,
  });
};

// =============================================================================
// Transaction Signing
// =============================================================================

/**
 * Sign a transaction with private keys
 * Returns the signed transaction
 *
 * @param transaction - The transaction to sign
 * @param privateKeys - Array of private key hex strings or PrivateKey instances
 * @param verifySig - Whether to verify signatures after signing
 */
export const signTransaction = async (
  transaction: any,
  privateKeys: (string | PrivateKey)[],
  verifySig: boolean = true
): Promise<any> => {
  await ensureWasmInitialized();
  const keys = privateKeys.map((k) => (typeof k === 'string' ? new PrivateKey(k) : k));
  return wasmSignTransaction(transaction, keys, verifySig);
};

// =============================================================================
// Unit Conversion - Using WASM SDK functions
// =============================================================================

/**
 * Convert a KAS string to sompi (bigint)
 * This function provides correct precision handling
 */
export const kasStringToSompi = (kasString: string): bigint => {
  const result = wasmKaspaToSompi(kasString);
  if (result === undefined) {
    throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
  }
  return result;
};

/**
 * Convert sompi to a KAS string representation
 */
export const sompiToKasString = (sompi: bigint | number): string => {
  return wasmSompiToKaspaString(sompi);
};

/**
 * Convert sompi to KAS string with network suffix (KAS, TKAS, etc.)
 */
export const sompiToKasStringWithSuffix = (
  sompi: bigint | number,
  network: NetworkId
): string => {
  return wasmSompiToKaspaStringWithSuffix(sompi, getNetworkType(network));
};

/**
 * Convert sompi to KAS as a number
 */
export const sompiToKas = (sompi: bigint): number => {
  return Number(sompi) / Number(SOMPI_PER_KAS);
};

/**
 * Convert KAS to sompi
 */
export const kasToSompi = (kas: number): bigint => {
  return BigInt(Math.floor(kas * Number(SOMPI_PER_KAS)));
};

/**
 * Format KAS amount for display
 */
export const formatKas = (sompi: bigint, decimals: number = 8): string => {
  const kas = sompiToKas(sompi);
  return kas.toFixed(decimals).replace(/\.?0+$/, '');
};

/**
 * Parse KAS string to sompi (alias for kasStringToSompi)
 */
export const parseKas = kasStringToSompi;

// =============================================================================
// Transaction Hash Computation
// =============================================================================

/**
 * Compute transaction hash for use as WebAuthn challenge
 *
 * This function extracts the transaction ID (hash) from a PendingTransaction
 * and converts it to a Uint8Array suitable for use as a WebAuthn challenge.
 *
 * The transaction ID is the BLAKE2b-256 hash of the transaction data, which
 * uniquely identifies the transaction and can be used to cryptographically
 * bind a WebAuthn signature to a specific transaction.
 *
 * @param tx - PendingTransaction from WASM SDK
 * @returns 32-byte transaction hash as Uint8Array
 *
 * @example
 * ```typescript
 * const tx = await buildTransaction(options);
 * const txHash = computeTransactionHash(tx);
 * const authResult = await authenticateWithChallenge(credentialId, txHash);
 * ```
 */
export const computeTransactionHash = (tx: any): Uint8Array => {
  // PendingTransaction has a readonly `id` property (transaction hash as hex string)
  const txId = tx.id as string;

  if (!txId || typeof txId !== 'string') {
    throw new Error('Invalid transaction: missing transaction ID');
  }

  // Convert hex string to Uint8Array
  // Transaction ID is already the BLAKE2b-256 hash (32 bytes)
  const hashBytes = hexToUint8Array(txId);

  if (hashBytes.length !== 32) {
    throw new Error(`Invalid transaction hash length: expected 32 bytes, got ${hashBytes.length}`);
  }

  return hashBytes;
};

// =============================================================================
// Hex Utilities (re-export for convenience)
// =============================================================================

export { uint8ArrayToHex, hexToUint8Array };
