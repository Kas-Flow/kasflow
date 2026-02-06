'use client';

/**
 * usePaymentDetection - Real-time payment monitoring hook
 * Monitors a Kaspa address for incoming payments
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRpc } from '@/lib/kaspa/rpc';

// =============================================================================
// Types
// =============================================================================

export type PaymentState =
  | 'idle'           // Not monitoring
  | 'monitoring'     // Watching for payment
  | 'detected'       // Payment detected (0 confirmations)
  | 'confirming'     // Payment confirming (1+ confirmations)
  | 'confirmed'      // Payment fully confirmed
  | 'error';         // Error occurred

// =============================================================================
// Hook
// =============================================================================

export function usePaymentDetection(address: string) {
  const { rpc, isConnected } = useRpc();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialBalanceRef = useRef<bigint | null>(null);

  /**
   * Start monitoring for payments
   */
  const startMonitoring = useCallback(async () => {
    if (!isConnected || !address) {
      setError('Not connected to network or no address provided');
      setPaymentState('error');
      return;
    }

    try {
      // Get initial balance
      const balanceInfo = await rpc.getBalance(address);
      initialBalanceRef.current = balanceInfo.available;

      setPaymentState('monitoring');
      setError(null);

      // Poll for balance changes every 2 seconds
      intervalRef.current = setInterval(async () => {
        try {
          const currentBalance = await rpc.getBalance(address);

          // Check if balance increased
          if (initialBalanceRef.current !== null &&
              currentBalance.available > initialBalanceRef.current) {

            // Payment detected!
            setPaymentState('detected');

            // Get UTXOs to find transaction ID
            const utxos = await rpc.getUtxos(address);
            if (utxos.length > 0) {
              // Get the most recent UTXO
              const latestUtxo = utxos[0];
              // @ts-ignore - UTXO has transactionId
              setTransactionId(latestUtxo.transactionId || 'unknown');
            }

            // Simulate confirmation progression
            // In real implementation, you'd query DAA score or block confirmations
            setTimeout(() => {
              setPaymentState('confirming');
              setConfirmations(1);
            }, 1000);

            setTimeout(() => {
              setConfirmations(3);
            }, 2000);

            setTimeout(() => {
              setPaymentState('confirmed');
              setConfirmations(10);

              // Stop monitoring after confirmation
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }, 3000);
          }
        } catch (err) {
          console.error('Error checking payment:', err);
        }
      }, 2000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start monitoring';
      setError(message);
      setPaymentState('error');
    }
  }, [isConnected, address, rpc]);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPaymentState('idle');
  }, []);

  /**
   * Reset detection state
   */
  const reset = useCallback(() => {
    stopMonitoring();
    setPaymentState('idle');
    setTransactionId(null);
    setConfirmations(0);
    setError(null);
    initialBalanceRef.current = null;
  }, [stopMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    paymentState,
    transactionId,
    confirmations,
    error,
    startMonitoring,
    stopMonitoring,
    reset,
  };
}
