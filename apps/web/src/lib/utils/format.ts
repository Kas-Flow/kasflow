// Define formatting functions locally to avoid WASM loading at build time
// These implementations are copied from @kasflow/passkey-wallet/kaspa.ts

import { SOMPI_PER_KAS } from '@/lib/constants';

/**
 * Convert sompi to KAS as a number
 */
export const sompiToKas = (sompi: bigint): number => {
  return Number(sompi) / Number(SOMPI_PER_KAS);
};

/**
 * Convert KAS to sompi
 */
export const kasToSompi = (kas: number): bigint => {
  return BigInt(Math.floor(kas * Number(SOMPI_PER_KAS)));
};

/**
 * Format KAS amount for display
 */
export const formatKas = (sompi: bigint, decimals: number = 8): string => {
  const kas = sompiToKas(sompi);
  return kas.toFixed(decimals).replace(/\.?0+$/, '');
};

/**
 * Convert sompi to a KAS string representation
 */
export const sompiToKasString = (sompi: bigint | number): string => {
  return sompiToKas(BigInt(sompi)).toString();
};

// KAS to USD conversion
import { KAS_TO_USD_RATE } from '@/lib/constants';

export function kasToUsd(kas: number): string {
  return (kas * KAS_TO_USD_RATE).toFixed(2);
}

export function sompiToUsd(sompi: bigint): string {
  const kas = sompiToKas(sompi);
  return kasToUsd(kas);
}

// Address formatting
export function truncateAddress(address: string, startChars = 8, endChars = 8): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Time formatting
export function formatConfirmationTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

// Number formatting with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format large numbers with abbreviations (1.5K, 2.3M)
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}
