/**
 * @kasflow/wallet-connector - useBalance Hook
 *
 * Hook for balance information with formatting utilities.
 */

'use client';

import { useMemo } from 'react';
import { useWalletContext } from '../context';
import type { WalletBalance } from '../../core/types';

// Constants
const SOMPI_PER_KAS = 100_000_000n;

/**
 * Return type for useBalance hook
 */
export interface UseBalanceReturn {
  /** Raw balance in sompi */
  balance: WalletBalance | null;
  /** Available balance in sompi */
  available: bigint;
  /** Pending balance in sompi */
  pending: bigint;
  /** Total balance in sompi */
  total: bigint;
  /** Formatted available balance in KAS */
  formattedAvailable: string;
  /** Formatted pending balance in KAS */
  formattedPending: string;
  /** Formatted total balance in KAS */
  formattedTotal: string;
  /** Whether balance is loading */
  loading: boolean;
  /** Refresh balance */
  refresh: () => Promise<void>;
}

/**
 * Format sompi to KAS string
 */
function formatKas(sompi: bigint, decimals = 4): string {
  const kas = Number(sompi) / Number(SOMPI_PER_KAS);
  return kas.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Hook for balance information
 *
 * Provides balance data with formatting utilities.
 *
 * @example
 * ```tsx
 * function BalanceDisplay() {
 *   const { formattedAvailable, loading, refresh } = useBalance();
 *
 *   return (
 *     <div>
 *       <span>{loading ? 'Loading...' : `${formattedAvailable} KAS`}</span>
 *       <button onClick={refresh}>↻</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBalance(): UseBalanceReturn {
  const { balance, refreshBalance, connected, connecting } = useWalletContext();

  const available = balance?.available ?? 0n;
  const pending = balance?.pending ?? 0n;
  const total = balance?.total ?? 0n;

  const formattedAvailable = useMemo(() => formatKas(available), [available]);
  const formattedPending = useMemo(() => formatKas(pending), [pending]);
  const formattedTotal = useMemo(() => formatKas(total), [total]);

  // Loading state: connected but no balance yet, or connecting
  const loading = (connected && balance === null) || connecting;

  return {
    balance,
    available,
    pending,
    total,
    formattedAvailable,
    formattedPending,
    formattedTotal,
    loading,
    refresh: refreshBalance,
  };
}
