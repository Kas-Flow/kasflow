'use client';

/**
 * useKIP12 - Hook for interacting with KIP-12 wallet extensions
 * KIP-12 is the Kaspa Improvement Proposal for wallet extension APIs
 *
 * Supports: Kasware, Kaspium, and other KIP-12 compatible wallets
 */

import { useState, useEffect, useCallback } from 'react';

// =============================================================================
// Types
// =============================================================================

interface KIP12Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (data: unknown) => void) => void;
  removeListener?: (event: string, handler: (data: unknown) => void) => void;
}

interface UseKIP12Return {
  // State
  isAvailable: boolean;
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  connect: () => Promise<string>;
  disconnect: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useKIP12(): UseKIP12Return {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if KIP-12 provider is available
  useEffect(() => {
    const checkAvailability = () => {
      if (typeof window === 'undefined') {
        setIsAvailable(false);
        setLoading(false);
        return;
      }

      // Check for window.kaspa provider
      const provider = (window as any).kaspa as KIP12Provider | undefined;

      if (provider && typeof provider.request === 'function') {
        console.log('[useKIP12] KIP-12 provider detected');
        setIsAvailable(true);
      } else {
        console.log('[useKIP12] No KIP-12 provider found');
        setIsAvailable(false);
      }

      setLoading(false);
    };

    // Check immediately
    checkAvailability();

    // Also check after a delay (some extensions inject after page load)
    const timeout = setTimeout(checkAvailability, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Connect to KIP-12 wallet
  const connect = useCallback(async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === 'undefined') {
        throw new Error('Window is not available');
      }

      const provider = (window as any).kaspa as KIP12Provider | undefined;

      if (!provider || typeof provider.request !== 'function') {
        throw new Error('No KIP-12 wallet extension detected. Please install Kasware or Kaspium.');
      }

      console.log('[useKIP12] Requesting accounts...');

      // Request accounts from the wallet
      const result = await provider.request({
        method: 'kas_requestAccounts'
      });

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const walletAddress = result[0] as string;

      // Validate address format
      if (!walletAddress || !walletAddress.startsWith('kaspa:')) {
        throw new Error('Invalid address format returned from wallet');
      }

      console.log('[useKIP12] Connected to address:', walletAddress);

      setAddress(walletAddress);
      setIsConnected(true);
      setError(null);

      return walletAddress;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to wallet';
      console.error('[useKIP12] Connection failed:', message);
      setError(message);
      setIsConnected(false);
      setAddress(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect from KIP-12 wallet
  const disconnect = useCallback(() => {
    console.log('[useKIP12] Disconnecting...');
    setIsConnected(false);
    setAddress(null);
    setError(null);
  }, []);

  // Listen for account changes (if provider supports it)
  useEffect(() => {
    if (!isAvailable || typeof window === 'undefined') return;

    const provider = (window as any).kaspa as KIP12Provider | undefined;

    if (!provider?.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      console.log('[useKIP12] Accounts changed:', accounts);

      if (Array.isArray(accounts) && accounts.length > 0) {
        const newAddress = accounts[0] as string;
        setAddress(newAddress);
        setIsConnected(true);
      } else {
        // User disconnected from wallet extension
        disconnect();
      }
    };

    // Listen for account changes
    provider.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isAvailable, disconnect]);

  return {
    isAvailable,
    isConnected,
    address,
    loading,
    error,
    connect,
    disconnect,
  };
}
