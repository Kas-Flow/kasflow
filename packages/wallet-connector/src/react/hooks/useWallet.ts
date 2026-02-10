/**
 * @kasflow/wallet-connector - useWallet Hook
 *
 * Main hook for wallet state and actions.
 */

'use client';

import { useWalletContext } from '../context';

/**
 * Main hook for wallet interaction
 *
 * Provides access to wallet state and all actions.
 *
 * @example
 * ```tsx
 * function WalletButton() {
 *   const {
 *     connected,
 *     connecting,
 *     address,
 *     balance,
 *     connect,
 *     disconnect,
 *     sendTransaction,
 *   } = useWallet();
 *
 *   if (connecting) return <button disabled>Connecting...</button>;
 *
 *   if (connected) {
 *     return (
 *       <div>
 *         <p>Connected: {address}</p>
 *         <p>Balance: {balance?.available.toString()} sompi</p>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     );
 *   }
 *
 *   return <button onClick={() => connect()}>Connect Wallet</button>;
 * }
 * ```
 */
export function useWallet() {
  return useWalletContext();
}
