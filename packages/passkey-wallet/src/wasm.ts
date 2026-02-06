/**
 * WASM SDK re-exports for @kasflow/passkey-wallet
 * Re-exports commonly used types and functions from @onekeyfe/kaspa-wasm
 */

// Re-export core classes
export {
  PrivateKey,
  PublicKey,
  Address,
  NetworkType,
  NetworkId as WasmNetworkId,
  RpcClient,
  Resolver,
  UtxoProcessor,
  UtxoContext,
  Generator,
  PendingTransaction,
  Transaction,
  UtxoEntryReference,
  // Utility functions
  kaspaToSompi,
  sompiToKaspaString,
  sompiToKaspaStringWithSuffix,
  signMessage,
  verifyMessage,
  signTransaction,
  createAddress,
  payToAddressScript,
  addressFromScriptPublicKey,
  // Panic hooks for debugging
  initConsolePanicHook,
  initBrowserPanicHook,
} from '@onekeyfe/kaspa-wasm';

// Type exports
export type {
  IGeneratorSettingsObject,
  IUtxoEntry,
  IPaymentOutput,
  ISubmitTransactionRequest,
  ISubmitTransactionResponse,
  IGetBalanceByAddressRequest,
  IGetBalanceByAddressResponse,
  IGetUtxosByAddressesRequest,
  IGetUtxosByAddressesResponse,
} from '@onekeyfe/kaspa-wasm';

// Export WASM initialization utilities
export { ensureWasmInitialized, isWasmInitialized } from './wasm-init';

/**
 * Initialize console panic hook for better debugging
 * Call this in development to see WASM panic messages
 */
export const initDebugMode = async (): Promise<void> => {
  const { initConsolePanicHook } = await import('@onekeyfe/kaspa-wasm');
  initConsolePanicHook();
};
