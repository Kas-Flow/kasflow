'use client';

/**
 * WalletInitializer - Auto-restores wallet session on page load
 *
 * Behavior:
 * - Detects if a wallet exists in storage
 * - If a session was active (sessionStorage flag), automatically unlocks wallet
 * - This prompts for passkey authentication once per browser session
 * - After successful unlock, wallet stays connected across page navigations
 */

import { useEffect, useState } from 'react';
import { useWalletStore } from '@/stores/wallet-store';

const SESSION_KEY = 'kasflow-session-active';

export function WalletInitializer() {
  const { detectUserState, unlockWallet, status, walletExists } = useWalletStore();
  const [hasAttemptedRestore, setHasAttemptedRestore] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      // First, detect wallet state
      await detectUserState();

      // Check if we had an active session
      const hadActiveSession = sessionStorage.getItem(SESSION_KEY) === 'true';

      console.log('[WalletInitializer] State:', {
        walletExists,
        hadActiveSession,
        status,
        hasAttemptedRestore,
      });

      // If wallet exists AND we had an active session AND not currently connected
      // AND we haven't attempted restore yet
      if (
        walletExists &&
        hadActiveSession &&
        status !== 'connected' &&
        status !== 'connecting' &&
        !hasAttemptedRestore
      ) {
        console.log('[WalletInitializer] Attempting to restore wallet session...');
        setHasAttemptedRestore(true);

        try {
          // Auto-unlock wallet (will prompt for passkey)
          await unlockWallet();
          console.log('[WalletInitializer] Wallet session restored successfully');
        } catch (error) {
          console.error('[WalletInitializer] Failed to restore session:', error);
          // Clear session flag if restore fails
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    };

    initializeWallet().catch((error) => {
      console.error('[WalletInitializer] Initialization error:', error);
    });
  }, [detectUserState, unlockWallet, status, walletExists, hasAttemptedRestore]);

  // Set session flag when wallet connects
  useEffect(() => {
    if (status === 'connected') {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }, [status]);

  // This component doesn't render anything
  return null;
}
