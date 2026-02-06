/**
 * Wallet Store - Zustand store for wallet state management
 * Manages PasskeyWallet instance, connection, balance, and user actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PasskeyWallet,
  type BalanceInfo,
  type NetworkId,
  NETWORK_ID,
  DEFAULT_NETWORK,
} from '@kasflow/passkey-wallet';

// =============================================================================
// Types
// =============================================================================

export type WalletStatus =
  | 'disconnected'    // No wallet
  | 'connecting'      // Creating or unlocking wallet
  | 'connected'       // Wallet ready
  | 'error';          // Error state

export interface WalletState {
  // Wallet instance
  wallet: PasskeyWallet | null;

  // Status
  status: WalletStatus;
  error: string | null;

  // Wallet info
  address: string | null;
  publicKey: string | null;
  network: NetworkId;

  // Balance
  balance: BalanceInfo | null;
  balanceLoading: boolean;

  // RPC connection
  rpcConnected: boolean;

  // Actions
  createWallet: (name?: string) => Promise<void>;
  unlockWallet: () => Promise<void>;
  disconnectWallet: () => void;
  deleteWallet: () => Promise<void>;

  // Network actions
  connectToNetwork: () => Promise<void>;
  disconnectFromNetwork: () => Promise<void>;

  // Balance actions
  refreshBalance: () => Promise<void>;

  // Utils
  checkWalletExists: () => Promise<boolean>;
  reset: () => void;
}

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  wallet: null,
  status: 'disconnected' as WalletStatus,
  error: null,
  address: null,
  publicKey: null,
  network: DEFAULT_NETWORK,
  balance: null,
  balanceLoading: false,
  rpcConnected: false,
};

// =============================================================================
// Wallet Store
// =============================================================================

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Create a new wallet with passkey
       */
      createWallet: async (name = 'KasFlow Wallet') => {
        try {
          console.log('[WalletStore] Starting wallet creation...', { name, network: get().network });
          set({ status: 'connecting', error: null });

          // Check if wallet already exists
          console.log('[WalletStore] Checking if wallet exists...');
          const exists = await PasskeyWallet.exists();
          console.log('[WalletStore] Wallet exists check result:', exists);

          if (exists) {
            console.warn('[WalletStore] Wallet already exists');
            set({
              status: 'error',
              error: 'Wallet already exists. Please unlock instead.'
            });
            return;
          }

          // Create wallet
          console.log('[WalletStore] Calling PasskeyWallet.create()...');
          const result = await PasskeyWallet.create({
            name,
            network: get().network
          });
          console.log('[WalletStore] PasskeyWallet.create() result:', {
            success: result.success,
            hasData: !!result.data,
            error: result.error
          });

          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to create wallet');
          }

          const wallet = result.data;
          console.log('[WalletStore] Wallet created successfully, updating state...');

          // Update state
          set({
            wallet,
            status: 'connected',
            address: wallet.getAddress(),
            publicKey: wallet.getPublicKey(),
            error: null,
          });

          console.log('[WalletStore] State updated, connecting to network...');
          // Auto-connect to network
          await get().connectToNetwork();
          console.log('[WalletStore] Connected to network successfully');

        } catch (error) {
          console.error('[WalletStore] Failed to create wallet:', error);
          const message = error instanceof Error ? error.message : 'Failed to create wallet';
          set({
            status: 'error',
            error: message,
            wallet: null,
            address: null,
            publicKey: null,
          });
          throw error;
        }
      },

      /**
       * Unlock existing wallet with passkey
       */
      unlockWallet: async () => {
        try {
          set({ status: 'connecting', error: null });

          // Check if wallet exists
          const exists = await PasskeyWallet.exists();
          if (!exists) {
            set({
              status: 'error',
              error: 'No wallet found. Please create one first.'
            });
            return;
          }

          // Unlock wallet
          const result = await PasskeyWallet.unlock({
            network: get().network,
          });

          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to unlock wallet');
          }

          const wallet = result.data;

          // Update state
          set({
            wallet,
            status: 'connected',
            address: wallet.getAddress(),
            publicKey: wallet.getPublicKey(),
            error: null,
          });

          // Auto-connect to network
          await get().connectToNetwork();

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to unlock wallet';
          set({
            status: 'error',
            error: message,
            wallet: null,
            address: null,
            publicKey: null,
          });
          throw error;
        }
      },

      /**
       * Disconnect wallet (clear from state, keep in storage)
       */
      disconnectWallet: () => {
        const { wallet } = get();
        if (wallet) {
          wallet.disconnectNetwork();
        }
        set({
          wallet: null,
          status: 'disconnected',
          address: null,
          publicKey: null,
          balance: null,
          rpcConnected: false,
          error: null,
        });
      },

      /**
       * Delete wallet permanently (requires confirmation!)
       */
      deleteWallet: async () => {
        try {
          const { wallet } = get();
          if (wallet) {
            await wallet.disconnectNetwork();
          }

          await PasskeyWallet.delete();

          set({
            ...initialState,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete wallet';
          set({ error: message });
          throw error;
        }
      },

      /**
       * Connect to Kaspa network
       */
      connectToNetwork: async () => {
        try {
          const { wallet } = get();
          if (!wallet) {
            throw new Error('No wallet available');
          }

          await wallet.connect();

          set({ rpcConnected: true });

          // Refresh balance after connecting
          await get().refreshBalance();

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to connect to network';
          set({
            rpcConnected: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Disconnect from Kaspa network
       */
      disconnectFromNetwork: async () => {
        try {
          const { wallet } = get();
          if (wallet) {
            await wallet.disconnectNetwork();
          }
          set({
            rpcConnected: false,
            balance: null,
          });
        } catch (error) {
          console.error('Failed to disconnect from network:', error);
        }
      },

      /**
       * Refresh wallet balance
       */
      refreshBalance: async () => {
        try {
          const { wallet, rpcConnected } = get();

          if (!wallet) {
            throw new Error('No wallet available');
          }

          if (!rpcConnected) {
            throw new Error('Not connected to network');
          }

          set({ balanceLoading: true });

          const balance = await wallet.getBalance();

          set({
            balance,
            balanceLoading: false,
            error: null,
          });

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to refresh balance';
          set({
            balanceLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Check if wallet exists in storage
       */
      checkWalletExists: async () => {
        return await PasskeyWallet.exists();
      },

      /**
       * Reset store to initial state
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'kasflow-wallet-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({
        network: state.network,
        // Don't persist: wallet, address, publicKey, balance (security)
      }),
    }
  )
);

// =============================================================================
// Selectors (for performance optimization)
// =============================================================================

export const selectWallet = (state: WalletState) => state.wallet;
export const selectAddress = (state: WalletState) => state.address;
export const selectBalance = (state: WalletState) => state.balance;
export const selectStatus = (state: WalletState) => state.status;
export const selectIsConnected = (state: WalletState) => state.status === 'connected';
export const selectError = (state: WalletState) => state.error;
