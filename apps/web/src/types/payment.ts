import type { PaymentStatus } from '@/lib/constants';

// Payment data structure (encoded in URL)
export interface PaymentData {
  to: string;           // Recipient Kaspa address
  amount: string;       // Amount in KAS (string for URL encoding)
  network: string;      // Network (mainnet, testnet-10, testnet-11)
  memo?: string;        // Optional memo/note
  label?: string;       // Optional label (e.g., "Buy me a coffee")
  expiresAt?: number;   // Optional expiration timestamp
}

// Payment state (for real-time detection)
export interface PaymentState {
  status: PaymentStatus;
  startTime: number | null;
  detectionTime: number | null;
  confirmationTime: number | null;
  transactionId: string | null;
  error: string | null;

  // Connection health
  isConnected: boolean;
  connectionAttempts: number;
  lastConnectionError: string | null;
}

// UTXO entry from WebSocket notification
export interface UtxoEntry {
  address: string;
  amount: bigint;
  outpoint: {
    transactionId: string;
    index: number;
  };
  scriptPublicKey: string;
  isCoinbase: boolean;
  blockDaaScore: string;
}

// UTXO changed notification
export interface UtxosChangedNotification {
  added: UtxoEntry[];
  removed: UtxoEntry[];
}

// Result type (matches SDK pattern)
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
