/**
 * @kasflow/wallet-connector - React Context
 *
 * React context for wallet state and actions.
 */

import { createContext, useContext } from 'react';
import type { WalletContextValue } from '../core/types';

/**
 * Default context value (disconnected state)
 */
const defaultContextValue: WalletContextValue = {
  // State
  adapters: [],
  currentAdapter: null,
  connected: false,
  connecting: false,
  address: null,
  publicKey: null,
  balance: null,
  network: 'mainnet',
  isModalOpen: false,
  error: null,

  // Actions (throw if used outside provider)
  connect: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  disconnect: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  switchNetwork: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  refreshBalance: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  sendTransaction: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  signMessage: async () => {
    throw new Error('KaspaWalletProvider not found');
  },
  selectWallet: () => {
    throw new Error('KaspaWalletProvider not found');
  },
  openModal: () => {
    throw new Error('KaspaWalletProvider not found');
  },
  closeModal: () => {
    throw new Error('KaspaWalletProvider not found');
  },
};

/**
 * React context for wallet state and actions
 */
export const WalletContext = createContext<WalletContextValue>(defaultContextValue);

/**
 * Hook to access wallet context
 * Throws if used outside KaspaWalletProvider
 */
export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a KaspaWalletProvider');
  }
  return context;
}
