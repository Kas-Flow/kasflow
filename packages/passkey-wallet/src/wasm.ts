/**
 * WASM SDK re-exports for @kasflow/passkey-wallet
 * Re-exports commonly used types and functions from kaspa-wasm32-sdk
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
} from 'kaspa-wasm32-sdk';

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
} from 'kaspa-wasm32-sdk';

/**
 * Initialize console panic hook for better debugging
 * Call this in development to see WASM panic messages
 */
export const initDebugMode = async (): Promise<void> => {
  const { initConsolePanicHook } = await import('kaspa-wasm32-sdk');
  initConsolePanicHook();
};
