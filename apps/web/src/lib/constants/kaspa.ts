// Define constants locally to avoid WASM loading at build time
// These values are copied from @kasflow/passkey-wallet/constants.ts

/** Kaspa network identifiers */
export const NETWORK_ID = {
  MAINNET: 'mainnet',
  TESTNET_10: 'testnet-10',
  TESTNET_11: 'testnet-11',
} as const;

export type NetworkId = (typeof NETWORK_ID)[keyof typeof NETWORK_ID];

/** Number of sompi (smallest unit) per KAS */
export const SOMPI_PER_KAS = BigInt(100_000_000);

/**
 * Convert KAS to sompi
 * Copied from @kasflow/passkey-wallet to avoid WASM import at build time
 */
export const kasToSompi = (kas: number): bigint => {
  return BigInt(Math.floor(kas * Number(SOMPI_PER_KAS)));
};

// RPC URLs for different networks
export const RPC_URLS = {
  [NETWORK_ID.MAINNET]: 'wss://api.kaspa.org',
  [NETWORK_ID.TESTNET_10]: 'wss://api.testnet-10.kaspa.org',
  [NETWORK_ID.TESTNET_11]: 'wss://api.testnet-11.kaspa.org',
} as const;

// Block explorer URLs (kaspa.stream format)
export const EXPLORER_URLS = {
  [NETWORK_ID.MAINNET]: 'https://kaspa.stream',
  [NETWORK_ID.TESTNET_10]: 'https://tn10.kaspa.stream',
  [NETWORK_ID.TESTNET_11]: 'https://tn11.kaspa.stream',
} as const;

// Default network for development
export const DEFAULT_NETWORK = NETWORK_ID.TESTNET_10;

// RPC connection settings
export const RPC_TIMEOUT_MS = 30000; // 30 seconds
export const RPC_RETRY_INTERVAL_MS = 2000; // 2 seconds
export const MAX_RPC_RETRIES = 3;

// Fallback RPC nodes (in case resolver fails)
export const FALLBACK_RPC_NODES = {
  [NETWORK_ID.MAINNET]: [
    'wss://api.kaspa.org',
    'wss://kaspa.rpc.nodes.io',
  ],
  [NETWORK_ID.TESTNET_10]: [
    'wss://api.testnet-10.kaspa.org',
  ],
  [NETWORK_ID.TESTNET_11]: [
    'wss://api.testnet-11.kaspa.org',
  ],
} as const;

// Network display names
export const NETWORK_NAMES = {
  [NETWORK_ID.MAINNET]: 'Mainnet',
  [NETWORK_ID.TESTNET_10]: 'Testnet 10',
  [NETWORK_ID.TESTNET_11]: 'Testnet 11',
} as const;

// Helper to get explorer TX URL
export function getExplorerTxUrl(txId: string, network: string): string {
  const baseUrl = EXPLORER_URLS[network as keyof typeof EXPLORER_URLS] || EXPLORER_URLS[NETWORK_ID.MAINNET];
  return `${baseUrl}/transactions/${txId}`;
}

// Helper to get explorer address URL
export function getExplorerAddressUrl(address: string, network: string): string {
  const baseUrl = EXPLORER_URLS[network as keyof typeof EXPLORER_URLS] || EXPLORER_URLS[NETWORK_ID.MAINNET];
  return `${baseUrl}/address/${address}`;
}
