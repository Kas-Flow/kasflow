/**
 * TypeScript types for @kasflow/passkey-wallet
 */

import type { NetworkId } from './constants';

// =============================================================================
// Wallet Types
// =============================================================================

/** Configuration options for creating a new wallet */
export interface CreateWalletOptions {
  /** Display name for the wallet (shown during passkey registration) */
  name?: string;
  /** Network to use (defaults to testnet) */
  network?: NetworkId;
}

/** Configuration options for unlocking an existing wallet */
export interface UnlockWalletOptions {
  /** Network to use (should match the network used during creation) */
  network?: NetworkId;
}

/** Wallet data stored in encrypted form */
export interface WalletData {
  /** Private key as hex string */
  privateKey: string;
  /** Public key as hex string */
  publicKey: string;
  /** Kaspa address */
  address: string;
  /** Network the wallet was created for */
  network: NetworkId;
  /** Timestamp when wallet was created */
  createdAt: number;
}

/** Encrypted wallet storage format */
export interface EncryptedWalletData {
  /** Encrypted data as base64 */
  ciphertext: string;
  /** Initialization vector as base64 */
  iv: string;
  /** Salt used for key derivation as base64 */
  salt: string;
  /** Version for future migrations */
  version: number;
}

// =============================================================================
// Transaction Types
// =============================================================================

/** Input for a transaction */
export interface TransactionInput {
  /** Previous transaction ID */
  previousOutpoint: {
    transactionId: string;
    index: number;
  };
  /** Signature script (populated after signing) */
  signatureScript?: string;
  /** Sequence number */
  sequence: bigint;
}

/** Output for a transaction */
export interface TransactionOutput {
  /** Amount in sompi */
  amount: bigint;
  /** Script public key (address) */
  scriptPublicKey: string;
}

/** Unsigned transaction ready to be signed */
export interface UnsignedTransaction {
  /** Transaction inputs */
  inputs: TransactionInput[];
  /** Transaction outputs */
  outputs: TransactionOutput[];
  /** Lock time */
  lockTime: bigint;
  /** Subnetwork ID */
  subnetworkId: string;
  /** Transaction version */
  version: number;
}

/** Signed transaction ready to be broadcast */
export interface SignedTransaction extends UnsignedTransaction {
  /** Transaction ID (hash) */
  id: string;
}

// =============================================================================
// WebAuthn Types
// =============================================================================

/** WebAuthn credential stored after registration */
export interface StoredCredential {
  /** Credential ID as base64url */
  id: string;
  /** Raw credential ID as Uint8Array */
  rawId: Uint8Array;
  /** Public key as base64url (for verification) */
  publicKey: string;
  /** Counter for replay protection */
  counter: number;
  /** Transports supported by the authenticator */
  transports?: AuthenticatorTransport[];
}

/** Result of WebAuthn registration */
export interface RegistrationResult {
  /** Whether registration was successful */
  success: boolean;
  /** Stored credential (if successful) */
  credential?: StoredCredential;
  /** Error message (if failed) */
  error?: string;
}

/** Result of WebAuthn authentication */
export interface AuthenticationResult {
  /** Whether authentication was successful */
  success: boolean;
  /** Signature from the authenticator */
  signature?: Uint8Array;
  /** Client data JSON for key derivation */
  clientDataJSON?: Uint8Array;
  /** Authenticator data */
  authenticatorData?: Uint8Array;
  /** Error message (if failed) */
  error?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

/** Generic result type for SDK operations */
export interface Result<T> {
  /** Whether the operation was successful */
  success: boolean;
  /** Data returned on success */
  data?: T;
  /** Error message on failure */
  error?: string;
}

/** Balance information */
export interface BalanceInfo {
  /** Available balance in sompi */
  available: bigint;
  /** Pending balance in sompi */
  pending: bigint;
  /** Total balance in sompi */
  total: bigint;
}

// =============================================================================
// Event Types
// =============================================================================

/** Events emitted by the wallet */
export type WalletEvent =
  | { type: 'connected'; address: string }
  | { type: 'disconnected' }
  | { type: 'balance_updated'; balance: BalanceInfo }
  | { type: 'transaction_sent'; txId: string }
  | { type: 'transaction_confirmed'; txId: string };

/** Event handler function */
export type WalletEventHandler = (event: WalletEvent) => void;
