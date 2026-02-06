/**
 * Constants for @kasflow/passkey-wallet
 * All magic values should be defined here
 */

// =============================================================================
// WebAuthn Configuration
// =============================================================================

/** Relying Party name displayed to user during passkey registration */
export const WEBAUTHN_RP_NAME = 'KasFlow';

/** Relying Party ID - should match your domain in production */
export const WEBAUTHN_RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

/** Timeout for WebAuthn operations in milliseconds */
export const WEBAUTHN_TIMEOUT_MS = 60_000;

/** Supported public key algorithms (-7 = ES256, -257 = RS256) */
export const WEBAUTHN_PUB_KEY_CRED_PARAMS = [
  { alg: -7, type: 'public-key' as const },   // ES256 (recommended)
  { alg: -257, type: 'public-key' as const }, // RS256 (fallback)
];

/** User verification requirement */
export const WEBAUTHN_USER_VERIFICATION = 'required' as const;

/** Authenticator attachment - platform means device biometrics */
export const WEBAUTHN_AUTHENTICATOR_ATTACHMENT = 'platform' as const;

// =============================================================================
// Storage Keys
// =============================================================================

/** IndexedDB database name */
export const IDB_DATABASE_NAME = 'kasflow-wallet';

/** IndexedDB store name */
export const IDB_STORE_NAME = 'keystore';

/** Key for storing encrypted wallet data */
export const STORAGE_KEY_WALLET = 'wallet';

/** Key for storing credential ID */
export const STORAGE_KEY_CREDENTIAL_ID = 'credential-id';

/** Key for storing user ID (for key derivation) */
export const STORAGE_KEY_USER_ID = 'user-id';

// =============================================================================
// Kaspa Network
// =============================================================================

/** Kaspa network identifiers */
export const NETWORK_ID = {
  MAINNET: 'mainnet',
  TESTNET_10: 'testnet-10',
  TESTNET_11: 'testnet-11',
} as const;

export type NetworkId = (typeof NETWORK_ID)[keyof typeof NETWORK_ID];

/** Default network for development */
export const DEFAULT_NETWORK: NetworkId = NETWORK_ID.TESTNET_10;

// Note: Address prefixes are provided by @kluster/kaspa-address (KaspaPrefix enum)
// Do not redefine here - use KaspaPrefix.MAINNET, KaspaPrefix.TESTNET instead

// =============================================================================
// RPC Configuration
// =============================================================================

/** RPC connection timeout in milliseconds */
export const RPC_TIMEOUT_MS = 30_000;

/** RPC retry interval in milliseconds */
export const RPC_RETRY_INTERVAL_MS = 1_000;

/** Default priority fee in sompi (0.001 KAS) */
export const DEFAULT_PRIORITY_FEE_SOMPI = 100_000n;

// =============================================================================
// Kaspa Units
// =============================================================================

/** Number of sompi (smallest unit) per KAS */
export const SOMPI_PER_KAS = 100_000_000n;

/** Minimum transaction fee in sompi */
export const MIN_FEE_SOMPI = 1000n;

// =============================================================================
// Encryption
// =============================================================================

/** AES-GCM key length in bits */
export const ENCRYPTION_KEY_LENGTH = 256;

/** AES-GCM IV length in bytes */
export const ENCRYPTION_IV_LENGTH = 12;

/** PBKDF2 iterations for key derivation */
export const PBKDF2_ITERATIONS = 100_000;

/** Salt length in bytes for key derivation */
export const SALT_LENGTH = 16;

// =============================================================================
// Error Messages
// =============================================================================

export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: 'No wallet found. Please create a wallet first.',
  WALLET_ALREADY_EXISTS: 'A wallet already exists. Delete it before creating a new one.',
  PASSKEY_REGISTRATION_FAILED: 'Failed to register passkey. Please try again.',
  PASSKEY_AUTHENTICATION_FAILED: 'Failed to authenticate with passkey. Please try again.',
  DECRYPTION_FAILED: 'Failed to decrypt wallet data. Authentication may have failed.',
  INVALID_ADDRESS: 'Invalid Kaspa address format.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  WEBAUTHN_NOT_SUPPORTED: 'WebAuthn is not supported in this browser.',
  USER_CANCELLED: 'Operation was cancelled by the user.',
  WASM_NOT_INITIALIZED: 'Kaspa WASM module not initialized. Call initKaspa() first.',
  RPC_NOT_CONNECTED: 'Not connected to Kaspa network. Call connect() first.',
  RPC_CONNECTION_FAILED: 'Failed to connect to Kaspa network.',
  TRANSACTION_FAILED: 'Transaction failed to submit.',
  INVALID_AMOUNT: 'Invalid transaction amount.',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
