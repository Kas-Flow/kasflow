/**
 * @kasflow/wallet-connector - Wallet Adapters
 *
 * Export all wallet adapters and their factory functions.
 */

export { BaseWalletAdapter } from './base';

export {
  PasskeyWalletAdapter,
  passkeyAdapter,
  type PasskeyAdapterOptions,
} from './passkey';

export {
  KaswareWalletAdapter,
  kaswareAdapter,
  type KaswareAdapterOptions,
} from './kasware';
