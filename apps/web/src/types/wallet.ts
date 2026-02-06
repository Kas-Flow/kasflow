import type { PasskeyWallet, BalanceInfo } from '@kasflow/passkey-wallet';

// Auth method
export type AuthMethod = 'passkey' | 'kip12';

// KIP-12 provider interface (EIP-1193 style)
export interface KaspaProvider {
  request: (method: string, args: any[]) => Promise<any>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on?: (event: string, handler: Function) => void;
  removeListener?: (event: string, handler: Function) => void;
}

// Unified wallet instance (either PasskeyWallet or KIP-12)
export type WalletInstance = PasskeyWallet | KaspaProvider;

// Wallet modal states
export type WalletModalState =
  | 'choice'           // Choose passkey or KIP-12
  | 'passkey_create'   // Creating new passkey wallet
  | 'passkey_unlock'   // Unlocking existing wallet
  | 'kip12_connect'    // Connecting KIP-12 extension
  | 'wallet_ready'     // Wallet connected, show balance
  | 'tx_preview'       // Transaction approval
  | 'tx_signing'       // Signing in progress
  | 'tx_complete'      // Transaction sent
  | 'error';           // Error state

// Transaction preview data
export interface TransactionPreview {
  from: string;
  to: string;
  amount: bigint;
  fee: bigint;
  total: bigint;
  balanceAfter: bigint;
}

// Wallet connection result
export interface WalletConnectionResult {
  address: string;
  balance: BalanceInfo;
  method: AuthMethod;
}

// Extend window for KIP-12
declare global {
  interface Window {
    kaspaProvider?: KaspaProvider;
  }
}
