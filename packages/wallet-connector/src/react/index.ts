/**
 * @kasflow/wallet-connector/react
 *
 * React integration for Kaspa wallet connection.
 *
 * @example
 * ```tsx
 * import {
 *   KaspaWalletProvider,
 *   ConnectButton,
 *   WalletModal,
 *   useWallet,
 *   useConnect,
 *   useBalance,
 *   passkeyAdapter,
 *   kaswareAdapter,
 * } from '@kasflow/wallet-connector/react';
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
 *       <Navbar />
 *       <MyApp />
 *       <WalletModal />
 *     </KaspaWalletProvider>
 *   );
 * }
 *
 * function Navbar() {
 *   return (
 *     <nav>
 *       <ConnectButton showBalance showNetwork />
 *     </nav>
 *   );
 * }
 *
 * function MyApp() {
 *   const { connected, address, sendTransaction } = useWallet();
 *   const { formattedAvailable } = useBalance();
 *
 *   if (!connected) {
 *     return <p>Please connect your wallet</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Address: {address}</p>
 *       <p>Balance: {formattedAvailable} KAS</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// Context
export { WalletContext, useWalletContext } from './context';

// Provider
export { KaspaWalletProvider, type KaspaWalletProviderProps } from './provider';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Re-export core types and adapters for convenience
export * from '../core/types';
export * from '../core/adapters';
