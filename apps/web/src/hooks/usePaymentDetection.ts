'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRpc } from '@/lib/kaspa/rpc';
import { PaymentTimer } from '@/lib/kaspa/payment-timer';
import type { PaymentStatus, NetworkId } from '@/types';
import { PAYMENT_STATUS, DETECTION_ANIMATION_MS, kasToSompi } from '@/lib/constants';

interface UsePaymentDetectionOptions {
  recipientAddress: string;
  expectedAmount: string; // Amount in KAS as string
  network: NetworkId;
  enabled?: boolean;
  onPaymentConfirmed?: (confirmationTime: number, txId: string) => void;
  onError?: (error: string) => void;
}

interface PaymentDetectionResult {
  status: PaymentStatus;
  confirmationTime: number | null;
  transactionId: string | null;
  error: string | null;
  isConnected: boolean;
  retry: () => void;
  formattedTime: string;
}

/**
 * Hook for real-time payment detection via WebSocket UTXO subscriptions
 *
 * State machine:
 * idle → initializing → waiting → detecting → confirming → confirmed
 *                                         ↓
 *                                      error
 */
export function usePaymentDetection({
  recipientAddress,
  expectedAmount,
  network,
  enabled = true,
  onPaymentConfirmed,
  onError,
}: UsePaymentDetectionOptions): PaymentDetectionResult {
  const { rpc, isConnected: rpcConnected, connect: connectRpc } = useRpc();

  const [status, setStatus] = useState<PaymentStatus>(PAYMENT_STATUS.IDLE);
  const [confirmationTime, setConfirmationTime] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const timerRef = useRef<PaymentTimer>(new PaymentTimer());
  const cleanupRef = useRef<(() => void) | null>(null);

  /**
   * Convert expected amount from KAS string to sompi bigint
   */
  const expectedSompi = useRef<bigint>(kasToSompi(parseFloat(expectedAmount)));

  /**
   * Handle payment detected
   */
  const handlePaymentDetected = useCallback(
    async (utxos: any[]) => {
      // Find UTXO matching our address and amount
      const matchingUtxo = utxos.find((utxo) => {
        const amount = BigInt(utxo.amount || utxo.utxoEntry?.amount || 0);
        return amount >= expectedSompi.current;
      });

      if (!matchingUtxo) {
        console.log('[PaymentDetection] UTXO detected but amount mismatch');
        return;
      }

      setStatus(PAYMENT_STATUS.DETECTING);

      // Record detection time
      const elapsedMs = timerRef.current.detect();

      console.log(`[PaymentDetection] Payment detected in ${elapsedMs}ms`);

      // Extract transaction ID
      const txId =
        matchingUtxo.outpoint?.transactionId ||
        matchingUtxo.transactionId ||
        'unknown';

      // Brief animation delay
      await new Promise((resolve) => setTimeout(resolve, DETECTION_ANIMATION_MS));

      // Update to confirmed state
      setStatus(PAYMENT_STATUS.CONFIRMING);
      await new Promise((resolve) => setTimeout(resolve, DETECTION_ANIMATION_MS));

      setStatus(PAYMENT_STATUS.CONFIRMED);
      setConfirmationTime(elapsedMs);
      setTransactionId(txId);

      // Trigger callback
      onPaymentConfirmed?.(elapsedMs, txId);

      // Cleanup subscription (payment complete)
      cleanup();
    },
    [expectedAmount, onPaymentConfirmed]
  );

  /**
   * Initialize payment detection
   */
  const initialize = useCallback(async () => {
    if (!enabled) return;

    setStatus(PAYMENT_STATUS.INITIALIZING);
    setError(null);

    try {
      // Ensure RPC is connected
      if (!rpcConnected) {
        console.log('[PaymentDetection] Connecting to RPC...');
        await connectRpc(network);
      }

      if (!rpc) {
        throw new Error('RPC client not available');
      }

      console.log(`[PaymentDetection] Watching address: ${recipientAddress}`);

      // Start high-precision timer
      timerRef.current.start();

      // Subscribe to UTXO changes
      const rpcClient = rpc.getRpcClient();
      if (!rpcClient) {
        throw new Error('RPC client not initialized');
      }

      // UTXO subscription
      await rpcClient.subscribeUtxosChanged([recipientAddress]);

      // Set up event listener
      const handleUtxosChanged = (event: any) => {
        console.log('[PaymentDetection] UTXO changed:', event);

        const addedUtxos = event.data?.added || event.added || [];
        if (addedUtxos.length > 0) {
          handlePaymentDetected(addedUtxos);
        }
      };

      rpcClient.addEventListener('utxos-changed', handleUtxosChanged);

      // Store cleanup function
      cleanupRef.current = () => {
        console.log('[PaymentDetection] Cleaning up subscription');
        rpcClient.removeEventListener('utxos-changed', handleUtxosChanged);
        rpcClient
          .unsubscribeUtxosChanged([recipientAddress])
          .catch((err: Error) => console.warn('Unsubscribe error:', err));
      };

      setStatus(PAYMENT_STATUS.WAITING);
      setIsConnected(true);

      console.log('[PaymentDetection] Successfully initialized');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to initialize payment detection';
      console.error('[PaymentDetection] Error:', errorMessage);

      setStatus(PAYMENT_STATUS.ERROR);
      setError(errorMessage);
      setIsConnected(false);

      onError?.(errorMessage);
    }
  }, [
    enabled,
    rpcConnected,
    rpc,
    network,
    recipientAddress,
    connectRpc,
    handlePaymentDetected,
    onError,
  ]);

  /**
   * Cleanup function
   */
  const cleanup = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  /**
   * Retry after error
   */
  const retry = useCallback(() => {
    cleanup();
    timerRef.current.reset();
    initialize();
  }, [cleanup, initialize]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initialize();

    // Cleanup on unmount
    return () => {
      console.log('[PaymentDetection] Component unmounting, cleaning up');
      cleanup();
    };
  }, [initialize, cleanup]);

  /**
   * Update expected amount if it changes
   */
  useEffect(() => {
    expectedSompi.current = kasToSompi(parseFloat(expectedAmount));
  }, [expectedAmount]);

  return {
    status,
    confirmationTime,
    transactionId,
    error,
    isConnected,
    retry,
    formattedTime: timerRef.current.getFormattedTime(),
  };
}
