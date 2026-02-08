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

export type WalletType = 'passkey' | 'kip12' | null;

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
  walletType: WalletType;

  // User detection
  isFirstTimeUser: boolean;
  walletExists: boolean;
  kip12Available: boolean;

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

  // User detection actions
  detectUserState: () => Promise<void>;
  markOnboardingComplete: () => void;

  // KIP-12 actions
  connectKIP12: (address: string) => Promise<void>;

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
  walletType: null as WalletType,
  isFirstTimeUser: false,
  walletExists: false,
  kip12Available: false,
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
            walletType: 'passkey',
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
          console.log('[WalletStore] Starting wallet unlock...');
          set({ status: 'connecting', error: null });

          // Check if wallet exists
          console.log('[WalletStore] Checking if wallet exists...');
          const exists = await PasskeyWallet.exists();
          console.log('[WalletStore] Wallet exists check result:', exists);

          if (!exists) {
            console.warn('[WalletStore] No wallet found');
            set({
              status: 'error',
              error: 'No wallet found. Please create one first.'
            });
            return;
          }

          // Unlock wallet
          console.log('[WalletStore] Calling PasskeyWallet.unlock()...');
          const result = await PasskeyWallet.unlock({
            network: get().network,
          });
          console.log('[WalletStore] PasskeyWallet.unlock() result:', {
            success: result.success,
            hasData: !!result.data,
            error: result.error
          });

          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to unlock wallet');
          }

          const wallet = result.data;
          console.log('[WalletStore] Wallet unlocked successfully, updating state...');

          // Update state
          set({
            wallet,
            status: 'connected',
            address: wallet.getAddress(),
            publicKey: wallet.getPublicKey(),
            walletType: 'passkey',
            error: null,
          });

          console.log('[WalletStore] State updated, connecting to network...');
          // Auto-connect to network
          await get().connectToNetwork();
          console.log('[WalletStore] Connected to network successfully');

        } catch (error) {
          console.error('[WalletStore] Failed to unlock wallet:', error);
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
       * Detect user state (first-time vs returning, wallet exists, KIP-12 available)
       */
      detectUserState: async () => {
        try {
          // Check if passkey wallet exists
          const walletExists = await PasskeyWallet.exists();

          // Check if KIP-12 extension is available
          const kip12Available = typeof window !== 'undefined' && 'kaspa' in window;

          // Check localStorage for onboarding flag
          const hasSeenWelcome = typeof window !== 'undefined' &&
                                 localStorage.getItem('kasflow_onboarding_seen') === 'true';

          set({
            walletExists,
            kip12Available,
            isFirstTimeUser: !walletExists && !hasSeenWelcome,
          });

          console.log('[WalletStore] User state detected:', {
            walletExists,
            kip12Available,
            isFirstTimeUser: !walletExists && !hasSeenWelcome,
          });
        } catch (error) {
          console.error('[WalletStore] Failed to detect user state:', error);
        }
      },

      /**
       * Mark onboarding as complete (user has seen welcome screen)
       */
      markOnboardingComplete: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kasflow_onboarding_seen', 'true');
        }
        set({ isFirstTimeUser: false });
      },

      /**
       * Connect KIP-12 wallet extension
       */
      connectKIP12: async (address: string) => {
        try {
          console.log('[WalletStore] Connecting KIP-12 wallet...');
          set({
            status: 'connecting',
            error: null,
            walletType: 'kip12',
          });

          // Validate address format
          // TODO: Add proper address validation when KIP-12 is fully implemented
          if (!address || !address.startsWith('kaspa:')) {
            throw new Error('Invalid Kaspa address');
          }

          // Update state (no wallet instance for KIP-12, extension handles signing)
          set({
            status: 'connected',
            address,
            publicKey: null, // KIP-12 doesn't expose public key
            walletType: 'kip12',
            error: null,
          });

          console.log('[WalletStore] KIP-12 wallet connected:', address);
        } catch (error) {
          console.error('[WalletStore] Failed to connect KIP-12 wallet:', error);
          const message = error instanceof Error ? error.message : 'Failed to connect KIP-12 wallet';
          set({
            status: 'error',
            error: message,
            walletType: null,
          });
          throw error;
        }
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
