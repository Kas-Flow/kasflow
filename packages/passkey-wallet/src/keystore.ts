/**
 * Keystore for @kasflow/passkey-wallet
 * Handles encrypted storage using IndexedDB
 */

import { get, set, del, createStore, type UseStore } from 'idb-keyval';

import {
  IDB_DATABASE_NAME,
  IDB_STORE_NAME,
  STORAGE_KEY_WALLET,
  STORAGE_KEY_CREDENTIAL_ID,
  STORAGE_KEY_USER_ID,
  ERROR_MESSAGES,
} from './constants';
import type { EncryptedWalletData } from './types';

// =============================================================================
// Store Initialization
// =============================================================================

/** Current storage version for migrations */
const STORAGE_VERSION = 1;

/** Custom IndexedDB store instance */
let customStore: UseStore | null = null;

/**
 * Get or create the IndexedDB store
 */
const getStore = (): UseStore => {
  if (!customStore) {
    customStore = createStore(IDB_DATABASE_NAME, IDB_STORE_NAME);
  }
  return customStore;
};

// =============================================================================
// Wallet Data Operations
// =============================================================================

/**
 * Check if a wallet exists in storage
 */
export const hasStoredWallet = async (): Promise<boolean> => {
  try {
    const data = await get<EncryptedWalletData>(STORAGE_KEY_WALLET, getStore());
    return data !== undefined;
  } catch {
    return false;
  }
};

/**
 * Store encrypted wallet data
 */
export const storeWalletData = async (
  encryptedData: EncryptedWalletData
): Promise<void> => {
  await set(STORAGE_KEY_WALLET, encryptedData, getStore());
};

/**
 * Retrieve encrypted wallet data
 */
export const getWalletData = async (): Promise<EncryptedWalletData | null> => {
  try {
    const data = await get<EncryptedWalletData>(STORAGE_KEY_WALLET, getStore());
    return data ?? null;
  } catch {
    return null;
  }
};

/**
 * Delete wallet data from storage
 */
export const deleteWalletData = async (): Promise<void> => {
  await del(STORAGE_KEY_WALLET, getStore());
};

// =============================================================================
// Credential ID Operations
// =============================================================================

/**
 * Store the credential ID for faster passkey lookup
 */
export const storeCredentialId = async (credentialId: string): Promise<void> => {
  await set(STORAGE_KEY_CREDENTIAL_ID, credentialId, getStore());
};

/**
 * Retrieve the stored credential ID
 */
export const getCredentialId = async (): Promise<string | null> => {
  try {
    const id = await get<string>(STORAGE_KEY_CREDENTIAL_ID, getStore());
    return id ?? null;
  } catch {
    return null;
  }
};

/**
 * Delete the credential ID from storage
 */
export const deleteCredentialId = async (): Promise<void> => {
  await del(STORAGE_KEY_CREDENTIAL_ID, getStore());
};

// =============================================================================
// User ID Operations (for stable key derivation)
// =============================================================================

/**
 * Store the user ID for stable key derivation
 */
export const storeUserId = async (userId: string): Promise<void> => {
  await set(STORAGE_KEY_USER_ID, userId, getStore());
};

/**
 * Retrieve the stored user ID
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    const id = await get<string>(STORAGE_KEY_USER_ID, getStore());
    return id ?? null;
  } catch {
    return null;
  }
};

/**
 * Delete the user ID from storage
 */
export const deleteUserId = async (): Promise<void> => {
  await del(STORAGE_KEY_USER_ID, getStore());
};

// =============================================================================
// Full Cleanup
// =============================================================================

/**
 * Delete all wallet-related data from storage
 * Used when resetting the wallet
 */
export const clearAllData = async (): Promise<void> => {
  await Promise.all([deleteWalletData(), deleteCredentialId(), deleteUserId()]);
};

// =============================================================================
// Storage Utilities
// =============================================================================

/**
 * Create encrypted wallet data object with version
 */
export const createEncryptedWalletData = (
  ciphertext: string,
  iv: string,
  salt: string
): EncryptedWalletData => {
  return {
    ciphertext,
    iv,
    salt,
    version: STORAGE_VERSION,
  };
};
