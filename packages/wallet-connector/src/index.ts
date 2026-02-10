/**
 * @kasflow/wallet-connector
 *
 * Wallet connection library for Kaspa blockchain.
 * Supports passkey wallets and browser extensions like KasWare.
 *
 * @example
 * ```tsx
 * import { KaspaWalletProvider, useWallet, passkeyAdapter, kaswareAdapter } from '@kasflow/wallet-connector/react';
 *
 * function App() {
 *   return (
 *     <KaspaWalletProvider
 *       config={{
 *         appName: 'My Kaspa App',
 *         network: 'mainnet',
 *         adapters: [passkeyAdapter(), kaswareAdapter()],
 *       }}
 *     >
 *       <MyApp />
 *     </KaspaWalletProvider>
 *   );
 * }
 *
 * function MyApp() {
 *   const { connected, address, connect, disconnect } = useWallet();
 *
 *   return (
 *     <button onClick={() => connected ? disconnect() : connect()}>
 *       {connected ? `Connected: ${address}` : 'Connect Wallet'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// Core exports (framework-agnostic)
export * from './core';
