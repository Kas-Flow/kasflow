/**
 * @kasflow/wallet-connector - useConnect Hook
 *
 * Hook for connection controls.
 */

'use client';

import { useCallback } from 'react';
import { useWalletContext } from '../context';
import type { WalletAdapter } from '../../core/types';

/**
 * Return type for useConnect hook
 */
export interface UseConnectReturn {
  /** Whether wallet is connected */
  connected: boolean;
  /** Whether connection is in progress */
  connecting: boolean;
  /** Available wallet adapters */
  adapters: WalletAdapter[];
  /** Connect to a wallet */
  connect: (adapterName?: string) => Promise<void>;
  /** Disconnect from wallet */
  disconnect: () => Promise<void>;
  /** Currently connected adapter */
  currentAdapter: WalletAdapter | null;
  /** Whether connect modal is open */
  isModalOpen: boolean;
  /** Open the connect modal */
  openModal: () => void;
  /** Close the connect modal */
  closeModal: () => void;
}

/**
 * Hook for wallet connection controls
 *
 * Provides connect/disconnect actions and modal state management.
 *
 * @example
 * ```tsx
 * function ConnectSection() {
 *   const {
 *     connected,
 *     connecting,
 *     adapters,
 *     connect,
 *     disconnect,
 *     isModalOpen,
 *     openModal,
 *     closeModal,
 *   } = useConnect();
 *
 *   return (
 *     <div>
 *       {connected ? (
 *         <button onClick={disconnect}>Disconnect</button>
 *       ) : (
 *         <button onClick={openModal}>Connect</button>
 *       )}
 *
 *       {isModalOpen && (
 *         <WalletSelectModal
 *           adapters={adapters}
 *           onSelect={(name) => {
 *             connect(name);
 *             closeModal();
 *           }}
 *           onClose={closeModal}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConnect(): UseConnectReturn {
  const context = useWalletContext();

  // Use modal state from context (shared across all hook instances)
  const { isModalOpen, openModal, closeModal } = context;

  const connect = useCallback(
    async (adapterName?: string): Promise<void> => {
      await context.connect(adapterName);
      closeModal();
    },
    [context, closeModal]
  );

  return {
    connected: context.connected,
    connecting: context.connecting,
    adapters: context.adapters,
    connect,
    disconnect: context.disconnect,
    currentAdapter: context.currentAdapter,
    isModalOpen,
    openModal,
    closeModal,
  };
}
