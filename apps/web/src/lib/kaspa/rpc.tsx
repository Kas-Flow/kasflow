'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { NetworkId } from '@/types';
import {
  DEFAULT_NETWORK,
  RPC_TIMEOUT_MS,
  RPC_RETRY_INTERVAL_MS,
  MAX_RPC_RETRIES,
  RPC_URLS,
} from '@/lib/constants';

// Dynamic import to avoid WASM loading at build time
// The SDK will be loaded only when needed on the client
type RpcClient = any; // We'll type this properly after dynamic import

/**
 * RPC Context interface
 * Follows pattern from kaspa-js/apps/react-starter-kit/src/context/RpcContext.tsx
 */
interface IRpcContext {
  rpc: RpcClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  network: NetworkId;
  url: string | null;
  connect: (network?: NetworkId) => Promise<void>;
  disconnect: () => Promise<void>;
}

// Create context with undefined default
const RpcContext = createContext<IRpcContext | undefined>(undefined);

interface RpcProviderProps {
  children: ReactNode;
  defaultNetwork?: NetworkId;
  autoConnect?: boolean;
}

/**
 * RPC Provider Component
 * Manages Kaspa RPC connection lifecycle with auto-reconnect
 */
export function RpcProvider({
  children,
  defaultNetwork = DEFAULT_NETWORK,
  autoConnect = false,
}: RpcProviderProps) {
  const [rpc, setRpc] = useState<RpcClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkId>(defaultNetwork);
  const [url, setUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Connect to Kaspa RPC
   * Uses Resolver for automatic node discovery
   */
  const connect = useCallback(
    async (targetNetwork?: NetworkId) => {
      // Prevent duplicate connections
      if (isConnected || isConnecting) {
        console.log('[RpcProvider] Already connected or connecting');
        return;
      }

      const networkToUse = targetNetwork || network;
      setIsConnecting(true);
      setError(null);

      try {
        console.log(`[RpcProvider] Connecting to ${networkToUse}...`);

        // Dynamically import SDK to avoid WASM loading at build time
        const { KaspaRpc } = await import('@kasflow/passkey-wallet');

        // Create new RPC client
        const client = new KaspaRpc();

        // Connect with timeout
        await Promise.race([
          client.connect({ network: networkToUse }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), RPC_TIMEOUT_MS)
          ),
        ]);

        // Get connected URL from network
        const connectedUrl = RPC_URLS[networkToUse];

        // Update state
        setRpc(client);
        setIsConnected(true);
        setNetwork(networkToUse);
        setUrl(connectedUrl);
        setRetryCount(0);

        console.log(`[RpcProvider] Connected to ${connectedUrl}`);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to connect to RPC';
        console.error('[RpcProvider] Connection error:', errorMessage);

        setError(errorMessage);
        setIsConnected(false);

        // Retry with exponential backoff
        if (retryCount < MAX_RPC_RETRIES) {
          const delay = RPC_RETRY_INTERVAL_MS * Math.pow(2, retryCount);
          console.log(`[RpcProvider] Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RPC_RETRIES})`);

          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connect(networkToUse);
          }, delay);
        }
      } finally {
        setIsConnecting(false);
      }
    },
    [isConnected, isConnecting, network, retryCount]
  );

  /**
   * Disconnect from RPC
   */
  const disconnect = useCallback(async () => {
    if (!rpc) return;

    try {
      console.log('[RpcProvider] Disconnecting...');
      await rpc.disconnect();

      setRpc(null);
      setIsConnected(false);
      setUrl(null);
      setError(null);

      console.log('[RpcProvider] Disconnected');
    } catch (err: any) {
      console.error('[RpcProvider] Disconnect error:', err?.message);
    }
  }, [rpc]);

  /**
   * Auto-connect on mount if enabled
   */
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, isConnected, isConnecting, connect]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (rpc && isConnected) {
        console.log('[RpcProvider] Cleaning up on unmount');
        rpc.disconnect().catch(console.error);
      }
    };
  }, [rpc, isConnected]);

  const value: IRpcContext = {
    rpc,
    isConnected,
    isConnecting,
    error,
    network,
    url,
    connect,
    disconnect,
  };

  return <RpcContext.Provider value={value}>{children}</RpcContext.Provider>;
}

/**
 * Custom hook to consume RPC context
 * Throws error if used outside provider
 */
export function useRpc(): IRpcContext {
  const context = useContext(RpcContext);

  if (context === undefined) {
    throw new Error('useRpc must be used within an RpcProvider');
  }

  return context;
}

/**
 * Helper hook to get connected RPC client
 * Returns null if not connected
 */
export function useRpcClient(): RpcClient | null {
  const { rpc, isConnected } = useRpc();
  return isConnected ? rpc : null;
}
