/**
 * @kasflow/passkey-wallet
 *
 * Passkey-powered wallet SDK for Kaspa blockchain
 * Create and manage Kaspa wallets using device biometrics (Face ID, Touch ID, etc.)
 *
 * @example
 * ```typescript
 * import { PasskeyWallet } from '@kasflow/passkey-wallet';
 *
 * // Create a new wallet
 * const result = await PasskeyWallet.create({ name: 'My Wallet' });
 * if (result.success) {
 *   const wallet = result.data;
 *
 *   // Connect to network
 *   await wallet.connect();
 *
 *   // Get balance
 *   const balance = await wallet.getBalance();
 *   console.log('Balance:', balance.available);
 *
 *   // Send KAS
 *   const tx = await wallet.send({
 *     to: 'kaspatest:...',
 *     amount: 100000000n,
 *   });
 * }
 *
 * // Unlock existing wallet
 * const result = await PasskeyWallet.unlock();
 * if (result.success) {
 *   const wallet = result.data;
 *   const signature = wallet.signMessage('Hello Kaspa!');
 * }
 * ```
 */

// Main wallet class
export { PasskeyWallet } from './wallet';

// RPC client
export { KaspaRpc, getDefaultRpc, resetDefaultRpc } from './rpc';
export type { RpcConnectionOptions, RpcEventHandlers } from './rpc';

// Transaction utilities
export {
  buildTransactions,
  signTransactions,
  submitTransactions,
  sendTransaction,
  estimateFee,
  createGenerator,
} from './transaction';
export type { SendOptions, SendResult, TransactionEstimate } from './transaction';

// Types
export type {
  CreateWalletOptions,
  UnlockWalletOptions,
  WalletMetadata,
  TransactionInput,
  TransactionOutput,
  UnsignedTransaction,
  SignedTransaction,
  StoredCredential,
  RegistrationResult,
  AuthenticationResult,
  Result,
  BalanceInfo,
  WalletEvent,
  WalletEventHandler,
} from './types';

// Constants
export {
  NETWORK_ID,
  DEFAULT_NETWORK,
  SOMPI_PER_KAS,
  MIN_FEE_SOMPI,
  DEFAULT_PRIORITY_FEE_SOMPI,
  ERROR_MESSAGES,
  type NetworkId,
  type ErrorMessage,
} from './constants';

// Kaspa utilities
export {
  // Key operations
  generatePrivateKey,
  createPrivateKey,
  getPublicKeyHex,
  getAddressFromPrivateKey,
  isValidPrivateKey,
  // Address operations
  publicKeyToAddress,
  isValidAddress,
  parseAddress,
  getNetworkFromAddress,
  // Network
  getNetworkType,
  getNetworkIdString,
  // Message signing
  signMessageWithKey,
  // Transaction signing
  signTransaction,
  // Unit conversion
  kasStringToSompi,
  sompiToKasString,
  sompiToKasStringWithSuffix,
  sompiToKas,
  kasToSompi,
  formatKas,
  parseKas,
  // Hex utilities
  uint8ArrayToHex,
  hexToUint8Array,
  // WASM types
  PrivateKey,
  PublicKey,
  Address,
  NetworkType,
} from './kaspa';

// WebAuthn utilities (for custom implementations)
export { isWebAuthnSupported } from './webauthn';

// COSE parser for extracting public keys from attestation
export { extractPublicKeyFromAttestation } from './cose-parser';

// Deterministic key derivation from passkey public keys
export { deriveKaspaKeysFromPasskey, verifyDeterminism } from './deterministic-keys';

// Logger utility
export { createLogger } from './logger';

// Re-export commonly used WASM SDK types for transaction building
export {
  RpcClient,
  Resolver,
  UtxoProcessor,
  UtxoContext,
  Generator,
  PendingTransaction,
  Transaction,
  UtxoEntryReference,
  initDebugMode,
} from './wasm';

// Re-export WASM types
export type {
  IGeneratorSettingsObject,
  IUtxoEntry,
  IPaymentOutput,
  ISubmitTransactionRequest,
  ISubmitTransactionResponse,
} from './wasm';
