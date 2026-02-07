/**
 * Frontend-specific formatting utilities
 * Note: Use @kasflow/passkey-wallet for Kaspa-related conversions
 */

import { sompiToKas } from '@kasflow/passkey-wallet';
import { KAS_TO_USD_RATE } from '@/lib/constants';

// =============================================================================
// USD Conversion
// =============================================================================

export function kasToUsd(kas: number): string {
  return (kas * KAS_TO_USD_RATE).toFixed(2);
}

export function sompiToUsd(sompi: bigint): string {
  const kas = sompiToKas(sompi);
  return kasToUsd(kas);
}

// =============================================================================
// Address Formatting
// =============================================================================

export function truncateAddress(address: string, startChars = 8, endChars = 8): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// =============================================================================
// Time Formatting
// =============================================================================

export function formatConfirmationTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

// =============================================================================
// Number Formatting
// =============================================================================

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}
