/**
 * @kasflow/wallet-connector - useNetwork Hook
 *
 * Hook for network information and switching.
 */

'use client';

import { useMemo } from 'react';
import { useWalletContext } from '../context';
import { NETWORKS, type NetworkId, type NetworkConfig } from '../../core/types';

/**
 * Return type for useNetwork hook
 */
export interface UseNetworkReturn {
  /** Current network ID */
  network: NetworkId;
  /** Current network configuration */
  networkConfig: NetworkConfig;
  /** All available networks */
  networks: typeof NETWORKS;
  /** Whether current network is mainnet */
  isMainnet: boolean;
  /** Whether current network is testnet */
  isTestnet: boolean;
  /** Switch to a different network */
  switchNetwork: (network: NetworkId) => Promise<void>;
}

/**
 * Hook for network information and switching
 *
 * Provides current network info and switching functionality.
 *
 * @example
 * ```tsx
 * function NetworkBadge() {
 *   const { network, isTestnet, switchNetwork, networks } = useNetwork();
 *
 *   return (
 *     <select
 *       value={network}
 *       onChange={(e) => switchNetwork(e.target.value as NetworkId)}
 *     >
 *       {Object.values(networks).map((n) => (
 *         <option key={n.id} value={n.id}>
 *           {n.name}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useNetwork(): UseNetworkReturn {
  const { network, switchNetwork } = useWalletContext();

  const networkConfig = useMemo(() => NETWORKS[network], [network]);

  const isMainnet = network === 'mainnet';
  const isTestnet = network === 'testnet-10' || network === 'testnet-11';

  return {
    network,
    networkConfig,
    networks: NETWORKS,
    isMainnet,
    isTestnet,
    switchNetwork,
  };
}
