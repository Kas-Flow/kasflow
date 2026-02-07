/**
 * Keystore for @kasflow/passkey-wallet
 * Handles storage using IndexedDB
 */

import { get, set, del, createStore, type UseStore } from 'idb-keyval';

import {
  IDB_DATABASE_NAME,
  IDB_STORE_NAME,
  STORAGE_KEY_CREDENTIAL_ID,
  STORAGE_KEY_METADATA,
} from './constants';
import type { WalletMetadata } from './types';

// =============================================================================
// Store Initialization
// =============================================================================

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
// Wallet Metadata Operations
// =============================================================================

/**
 * Check if a wallet exists in storage
 */
export const hasStoredWallet = async (): Promise<boolean> => {
  try {
    const metadata = await get<WalletMetadata>(STORAGE_KEY_METADATA, getStore());
    return metadata !== undefined;
  } catch {
    return false;
  }
};

/**
 * Store wallet metadata (passkey public key, address, network)
 */
export const storeWalletMetadata = async (
  metadata: WalletMetadata
): Promise<void> => {
  await set(STORAGE_KEY_METADATA, metadata, getStore());
};

/**
 * Retrieve wallet metadata
 */
export const getWalletMetadata = async (): Promise<WalletMetadata | null> => {
  try {
    const data = await get<WalletMetadata>(STORAGE_KEY_METADATA, getStore());
    return data ?? null;
  } catch {
    return null;
  }
};

/**
 * Delete wallet metadata
 */
export const deleteWalletMetadata = async (): Promise<void> => {
  await del(STORAGE_KEY_METADATA, getStore());
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
// Full Cleanup
// =============================================================================

/**
 * Delete all wallet-related data from storage
 */
export const clearAllData = async (): Promise<void> => {
  await Promise.all([
    deleteWalletMetadata(),
    deleteCredentialId(),
  ]);
};
