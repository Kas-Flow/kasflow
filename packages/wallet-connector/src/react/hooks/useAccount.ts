/**
 * @kasflow/wallet-connector - useAccount Hook
 *
 * Hook for account information and utilities.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useWalletContext } from '../context';

/**
 * Return type for useAccount hook
 */
export interface UseAccountReturn {
  /** Full wallet address */
  address: string | null;
  /** Public key */
  publicKey: string | null;
  /** Whether wallet is connected */
  connected: boolean;
  /** Shortened address for display (e.g., "kaspa:qr...xyz") */
  shortAddress: string | null;
  /** Copy address to clipboard */
  copy: () => Promise<boolean>;
  /** Whether address was recently copied */
  copied: boolean;
}

/**
 * Shorten an address for display
 */
function shortenAddress(address: string, chars = 4): string {
  // Handle kaspa: or kaspatest: prefix
  const colonIndex = address.indexOf(':');
  if (colonIndex === -1) {
    // No prefix, just shorten
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }

  const prefix = address.slice(0, colonIndex + 1);
  const rest = address.slice(colonIndex + 1);
  return `${prefix}${rest.slice(0, chars)}...${rest.slice(-chars)}`;
}

/**
 * Hook for account information
 *
 * Provides address, utilities, and clipboard functionality.
 *
 * @example
 * ```tsx
 * function AccountDisplay() {
 *   const { shortAddress, copy, copied } = useAccount();
 *
 *   return (
 *     <div onClick={copy} style={{ cursor: 'pointer' }}>
 *       {shortAddress}
 *       {copied && <span> ✓</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccount(): UseAccountReturn {
  const { address, publicKey, connected } = useWalletContext();
  const [copied, setCopied] = useState(false);

  const shortAddress = useMemo(
    () => (address ? shortenAddress(address) : null),
    [address]
  );

  const copy = useCallback(async (): Promise<boolean> => {
    if (!address) return false;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, [address]);

  return {
    address,
    publicKey,
    connected,
    shortAddress,
    copy,
    copied,
  };
}
