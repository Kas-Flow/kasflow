/**
 * @kasflow/wallet-connector - React Provider
 *
 * Main provider component for wallet integration.
 */

'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { WalletContext } from './context';
import type {
  WalletAdapter,
  WalletProviderConfig,
  WalletState,
  WalletBalance,
  WalletError,
  NetworkId,
  SendTransactionParams,
  TransactionResult,
  SignMessageParams,
  SignedMessage,
} from '../core/types';

// Storage keys
const STORAGE_KEY_PREFIX = 'kasflow_wallet';
const LAST_WALLET_KEY = `${STORAGE_KEY_PREFIX}_last`;
const LAST_NETWORK_KEY = `${STORAGE_KEY_PREFIX}_network`;

/**
 * Props for KaspaWalletProvider
 */
export interface KaspaWalletProviderProps {
  /** Wallet configuration */
  config: WalletProviderConfig;
  /** Child components */
  children: ReactNode;
}

/**
 * Get stored last wallet name
 */
function getStoredWalletName(storageKey: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(`${storageKey}_last`);
  } catch {
    return null;
  }
}

/**
 * Store last wallet name
 */
function storeWalletName(storageKey: string, name: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${storageKey}_last`, name);
  } catch {
    // Storage not available
  }
}

/**
 * Clear stored wallet name
 */
function clearStoredWalletName(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${storageKey}_last`);
  } catch {
    // Storage not available
  }
}

/**
 * KaspaWalletProvider - Main provider for wallet integration
 *
 * Provides wallet state and actions to all child components.
 *
 * @example
 * ```tsx
 * import { KaspaWalletProvider, passkeyAdapter, kaswareAdapter } from '@kasflow/wallet-connector/react';
 *
 * function App() {
 *   return (
 *     <KaspaWalletProvider
 *       config={{
 *         appName: 'My Kaspa App',
 *         network: 'mainnet',
 *         autoConnect: true,
 *         adapters: [passkeyAdapter(), kaswareAdapter()],
 *       }}
 *     >
 *       <MyApp />
 *     </KaspaWalletProvider>
 *   );
 * }
 * ```
 */
export function KaspaWalletProvider({
  config,
  children,
}: KaspaWalletProviderProps) {
  const {
    appName,
    network: initialNetwork = 'mainnet',
    autoConnect = false,
    adapters: configAdapters = [],
    storageKey = STORAGE_KEY_PREFIX,
  } = config;

  // State
  const [adapters] = useState<WalletAdapter[]>(configAdapters);
  const [currentAdapter, setCurrentAdapter] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [network, setNetwork] = useState<NetworkId>(initialNetwork);
  const [error, setError] = useState<WalletError | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs for tracking
  const isAutoConnecting = useRef(false);
  const balanceInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // =========================================================================
  // Connection Logic
  // =========================================================================

  /**
   * Connect to a wallet adapter
   */
  const connect = useCallback(
    async (adapterName?: string): Promise<void> => {
      setConnecting(true);
      setError(null);

      try {
        // Find adapter
        let adapter: WalletAdapter | undefined;

        if (adapterName) {
          adapter = adapters.find((a) => a.metadata.name === adapterName);
        } else if (adapters.length === 1) {
          // If only one adapter, use it
          adapter = adapters[0];
        } else {
          // Try to find first available adapter
          for (const a of adapters) {
            if (a.readyState === 'installed' || a.readyState === 'loadable') {
              adapter = a;
              break;
            }
          }
        }

        if (!adapter) {
          throw new Error(
            adapterName
              ? `Adapter "${adapterName}" not found`
              : 'No available wallet adapter found'
          );
        }

        // Connect
        console.log('[WalletProvider] Connecting to adapter:', adapter.metadata.name);
        await adapter.connect();

        // Update state
        console.log('[WalletProvider] Connection successful');
        console.log('[WalletProvider] Adapter address:', adapter.address);
        console.log('[WalletProvider] Adapter network:', adapter.network);
        setCurrentAdapter(adapter);
        setConnected(true);
        setAddress(adapter.address);
        setPublicKey(adapter.publicKey);
        setNetwork(adapter.network);

        // Store for auto-connect
        storeWalletName(storageKey, adapter.metadata.name);

        // Set up event listeners
        adapter.on('disconnect', () => {
          handleDisconnect();
        });

        adapter.on('accountChange', (newAddress) => {
          setAddress(newAddress);
        });

        adapter.on('networkChange', (newNetwork) => {
          setNetwork(newNetwork);
        });

        adapter.on('error', (err) => {
          setError(err);
        });
      } catch (err) {
        const walletError = err instanceof Error ? err : new Error('Connection failed');
        setError(walletError as WalletError);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [adapters, storageKey]
  );

  /**
   * Handle disconnect (cleanup)
   */
  const handleDisconnect = useCallback(() => {
    setCurrentAdapter(null);
    setConnected(false);
    setAddress(null);
    setPublicKey(null);
    setBalance(null);
    clearStoredWalletName(storageKey);

    // Stop balance polling
    if (balanceInterval.current) {
      clearInterval(balanceInterval.current);
      balanceInterval.current = null;
    }
  }, [storageKey]);

  /**
   * Disconnect current wallet
   */
  const disconnect = useCallback(async (): Promise<void> => {
    if (currentAdapter) {
      await currentAdapter.disconnect();
    }
    handleDisconnect();
  }, [currentAdapter, handleDisconnect]);

  // =========================================================================
  // Auto-Connect
  // =========================================================================

  useEffect(() => {
    if (!autoConnect || isAutoConnecting.current) return;
    if (connected) return;

    const lastWallet = getStoredWalletName(storageKey);
    if (!lastWallet) return;

    // Check if the adapter exists and is available
    const adapter = adapters.find((a) => a.metadata.name === lastWallet);
    if (!adapter) return;
    if (adapter.readyState !== 'installed' && adapter.readyState !== 'loadable') return;

    isAutoConnecting.current = true;

    connect(lastWallet)
      .catch(() => {
        // Auto-connect failed silently
        clearStoredWalletName(storageKey);
      })
      .finally(() => {
        isAutoConnecting.current = false;
      });
  }, [autoConnect, adapters, connected, connect, storageKey]);

  // =========================================================================
  // Balance Polling
  // =========================================================================

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!currentAdapter || !connected) return;

    try {
      const newBalance = await currentAdapter.getBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [currentAdapter, connected]);

  // Start balance polling when connected
  useEffect(() => {
    if (connected && currentAdapter) {
      // Fetch balance immediately
      refreshBalance();

      // Poll every 10 seconds
      balanceInterval.current = setInterval(refreshBalance, 10000);
    }

    return () => {
      if (balanceInterval.current) {
        clearInterval(balanceInterval.current);
        balanceInterval.current = null;
      }
    };
  }, [connected, currentAdapter, refreshBalance]);

  // =========================================================================
  // Network
  // =========================================================================

  const switchNetwork = useCallback(
    async (newNetwork: NetworkId): Promise<void> => {
      console.log('[WalletProvider] switchNetwork called:', newNetwork);
      console.log('[WalletProvider] currentAdapter:', currentAdapter?.metadata.name);

      if (currentAdapter) {
        await currentAdapter.switchNetwork(newNetwork);
        console.log('[WalletProvider] Adapter switchNetwork completed');
        console.log('[WalletProvider] Adapter network after switch:', currentAdapter.network);
        setNetwork(newNetwork);
        // Refresh address in case it changed
        setAddress(currentAdapter.address);
        console.log('[WalletProvider] Address after switch:', currentAdapter.address);
        // Refresh balance for new network
        await refreshBalance();
      } else {
        console.log('[WalletProvider] No adapter, just setting network state');
        setNetwork(newNetwork);
      }
    },
    [currentAdapter, refreshBalance]
  );

  // =========================================================================
  // Transactions
  // =========================================================================

  const sendTransaction = useCallback(
    async (params: SendTransactionParams): Promise<TransactionResult> => {
      if (!currentAdapter || !connected) {
        throw new Error('Wallet not connected');
      }
      return currentAdapter.sendTransaction(params);
    },
    [currentAdapter, connected]
  );

  // =========================================================================
  // Signing
  // =========================================================================

  const signMessage = useCallback(
    async (params: SignMessageParams): Promise<SignedMessage> => {
      if (!currentAdapter || !connected) {
        throw new Error('Wallet not connected');
      }
      return currentAdapter.signMessage(params);
    },
    [currentAdapter, connected]
  );

  // =========================================================================
  // Wallet Selection
  // =========================================================================

  const selectWallet = useCallback(
    (adapterName: string): void => {
      const adapter = adapters.find((a) => a.metadata.name === adapterName);
      if (adapter && adapter.connected) {
        setCurrentAdapter(adapter);
        setAddress(adapter.address);
        setPublicKey(adapter.publicKey);
        setNetwork(adapter.network);
      }
    },
    [adapters]
  );

  // =========================================================================
  // Modal Controls
  // =========================================================================

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // =========================================================================
  // Context Value
  // =========================================================================

  const contextValue = useMemo(
    () => ({
      // State
      adapters,
      currentAdapter,
      connected,
      connecting,
      address,
      publicKey,
      balance,
      network,
      isModalOpen,
      error,

      // Actions
      connect,
      disconnect,
      switchNetwork,
      refreshBalance,
      sendTransaction,
      signMessage,
      selectWallet,
      openModal,
      closeModal,
    }),
    [
      adapters,
      currentAdapter,
      connected,
      connecting,
      address,
      publicKey,
      balance,
      network,
      isModalOpen,
      error,
      connect,
      disconnect,
      switchNetwork,
      refreshBalance,
      sendTransaction,
      signMessage,
      selectWallet,
      openModal,
      closeModal,
    ]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
