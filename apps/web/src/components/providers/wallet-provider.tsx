'use client';

/**
 * WalletProvider - Wrapper for @kasflow/wallet-connector
 *
 * This provider integrates the wallet-connector library into the app.
 * It provides both the new hooks API and backward compatibility with
 * existing components through a bridge to the Zustand store.
 */

import React, { useEffect } from 'react';
import {
  KaspaWalletProvider,
  passkeyAdapter,
  kaswareAdapter,
  useWallet,
  WalletModal,
  type NetworkId,
} from '@kasflow/wallet-connector/react';
import { useWalletStore } from '@/stores/wallet-store';

// Default network from environment or fallback
const DEFAULT_NETWORK: NetworkId = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK as NetworkId) || 'testnet-10';

/**
 * Props for WalletProvider
 */
interface WalletProviderProps {
  children: React.ReactNode;
}

/**
 * Bridge component that syncs wallet-connector state to Zustand store
 * This enables existing components to continue working during migration
 */
function WalletStoreBridge() {
  const { connected, connecting, address, publicKey, network, balance, error } = useWallet();
  const store = useWalletStore();

  useEffect(() => {
    // Sync connection state
    if (connected && address) {
      // Only update if state actually changed
      if (store.status !== 'connected' || store.address !== address) {
        useWalletStore.setState({
          status: 'connected',
          address,
          publicKey,
          network,
          rpcConnected: true,
          error: null,
        });
      }
    } else if (connecting) {
      if (store.status !== 'connecting') {
        useWalletStore.setState({
          status: 'connecting',
          error: null,
        });
      }
    } else if (!connected && store.status === 'connected') {
      useWalletStore.setState({
        status: 'disconnected',
        address: null,
        publicKey: null,
        balance: null,
        rpcConnected: false,
      });
    }
  }, [connected, connecting, address, publicKey, network, store.status, store.address]);

  // Sync balance
  useEffect(() => {
    if (balance && connected) {
      useWalletStore.setState({
        balance: {
          available: balance.available,
          pending: balance.pending,
          total: balance.total,
        },
        balanceLoading: false,
      });
    }
  }, [balance, connected]);

  // Sync errors
  useEffect(() => {
    if (error) {
      useWalletStore.setState({
        error: error.message,
      });
    }
  }, [error]);

  return null;
}

/**
 * WalletProvider - Main wallet provider for the app
 *
 * Wraps the wallet-connector library and provides:
 * - Multi-wallet support (Passkey + KasWare)
 * - Auto-connect functionality
 * - Backward compatibility with existing Zustand store
 */
export function WalletProvider({ children }: WalletProviderProps) {
  // Get persisted network from store
  const persistedNetwork = useWalletStore((state) => state.network);

  return (
    <KaspaWalletProvider
      config={{
        appName: 'KasFlow',
        network: persistedNetwork || DEFAULT_NETWORK,
        autoConnect: true,
        adapters: [
          passkeyAdapter({ network: persistedNetwork || DEFAULT_NETWORK }),
          kaswareAdapter({ network: persistedNetwork || DEFAULT_NETWORK }),
        ],
      }}
    >
      <WalletStoreBridge />
      {children as any}
      <WalletModal title="Connect Wallet" />
    </KaspaWalletProvider>
  );
}
