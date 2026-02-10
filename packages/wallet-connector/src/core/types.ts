/**
 * @kasflow/wallet-connector - Core Types
 *
 * Type definitions for the Kaspa wallet connection library.
 */

// ============================================================================
// Network Types
// ============================================================================

/**
 * Supported Kaspa networks
 */
export type NetworkId = 'mainnet' | 'testnet-10' | 'testnet-11';

/**
 * Network configuration
 */
export interface NetworkConfig {
  id: NetworkId;
  name: string;
  addressPrefix: 'kaspa' | 'kaspatest';
  rpcUrl: string;
  explorerUrl: string;
}

/**
 * Default network configurations
 */
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  mainnet: {
    id: 'mainnet',
    name: 'Mainnet',
    addressPrefix: 'kaspa',
    rpcUrl: 'wss://rpc.kaspa.stream',
    explorerUrl: 'https://explorer.kaspa.org',
  },
  'testnet-10': {
    id: 'testnet-10',
    name: 'Testnet 10',
    addressPrefix: 'kaspatest',
    rpcUrl: 'wss://tn10-rpc.kaspa.stream',
    explorerUrl: 'https://tn10.kaspa.stream',
  },
  'testnet-11': {
    id: 'testnet-11',
    name: 'Testnet 11',
    addressPrefix: 'kaspatest',
    rpcUrl: 'wss://tn11-rpc.kaspa.stream',
    explorerUrl: 'https://tn11.kaspa.stream',
  },
};

// ============================================================================
// Wallet Types
// ============================================================================

/**
 * Wallet ready state - indicates if wallet is available
 */
export type WalletReadyState =
  | 'installed'      // Wallet is installed and ready
  | 'not-detected'   // Wallet not found
  | 'loadable';      // Wallet can be loaded (e.g., passkey exists)

/**
 * Wallet type identifier
 */
export type WalletType = 'passkey' | 'kasware' | 'kastle' | 'external';

/**
 * Wallet metadata for display
 */
export interface WalletMetadata {
  /** Unique identifier for this wallet type */
  name: string;
  /** Display name shown in UI */
  displayName: string;
  /** Wallet type category */
  type: WalletType;
  /** Icon URL or data URI */
  icon: string;
  /** Website URL for installation/info */
  url: string;
  /** Brief description */
  description?: string;
}

/**
 * Wallet balance information
 */
export interface WalletBalance {
  /** Available balance in sompi */
  available: bigint;
  /** Pending balance in sompi */
  pending: bigint;
  /** Total balance (available + pending) in sompi */
  total: bigint;
}

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Parameters for sending a transaction
 */
export interface SendTransactionParams {
  /** Recipient address */
  to: string;
  /** Amount in sompi */
  amount: bigint;
  /** Optional memo/note */
  memo?: string;
  /** Priority fee in sompi (optional) */
  priorityFee?: bigint;
}

/**
 * Transaction result after sending
 */
export interface TransactionResult {
  /** Transaction ID (hash) */
  txId: string;
  /** Network the transaction was sent on */
  network: NetworkId;
  /** Transaction fee in sompi (optional) */
  fee?: bigint;
}

/**
 * Sign message parameters
 */
export interface SignMessageParams {
  /** Message to sign */
  message: string;
  /** Optional: specify address to sign with */
  address?: string;
}

/**
 * Signed message result
 */
export interface SignedMessage {
  /** Original message */
  message: string;
  /** Signature */
  signature: string;
  /** Address that signed */
  address: string;
}

// ============================================================================
// Adapter Events
// ============================================================================

/**
 * Events emitted by wallet adapters
 */
export type WalletAdapterEvents = {
  /** Emitted when wallet connects */
  connect: (address: string) => void;
  /** Emitted when wallet disconnects */
  disconnect: () => void;
  /** Emitted when an error occurs */
  error: (error: WalletError) => void;
  /** Emitted when ready state changes */
  readyStateChange: (readyState: WalletReadyState) => void;
  /** Emitted when account changes (for extension wallets) */
  accountChange: (address: string | null) => void;
  /** Emitted when network changes */
  networkChange: (network: NetworkId) => void;
  /** Index signature for extensibility */
  [key: string]: (...args: any[]) => void;
};

/**
 * Event handler function type
 */
export type WalletEventHandler<T extends keyof WalletAdapterEvents> =
  WalletAdapterEvents[T];

// ============================================================================
// Error Types
// ============================================================================

/**
 * Wallet error codes
 */
export enum WalletErrorCode {
  // Connection errors
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED',
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',

  // Transaction errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',

  // Signing errors
  SIGNING_REJECTED = 'SIGNING_REJECTED',
  SIGNING_FAILED = 'SIGNING_FAILED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',

  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

/**
 * Wallet error class
 */
export class WalletError extends Error {
  code: WalletErrorCode;
  cause?: Error;

  constructor(code: WalletErrorCode, message: string, cause?: Error) {
    super(message);
    this.name = 'WalletError';
    this.code = code;
    this.cause = cause;
  }
}

// ============================================================================
// Adapter Interface
// ============================================================================

/**
 * Base interface for all wallet adapters
 */
export interface WalletAdapter {
  // Metadata
  readonly metadata: WalletMetadata;

  // State (readonly to consumers)
  readonly readyState: WalletReadyState;
  readonly connected: boolean;
  readonly connecting: boolean;
  readonly address: string | null;
  readonly publicKey: string | null;
  readonly network: NetworkId;

  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Account
  getBalance(): Promise<WalletBalance>;

  // Transactions
  sendTransaction(params: SendTransactionParams): Promise<TransactionResult>;

  // Signing
  signMessage(params: SignMessageParams): Promise<SignedMessage>;

  // Network
  switchNetwork(network: NetworkId): Promise<void>;

  // Events
  on<T extends keyof WalletAdapterEvents>(
    event: T,
    handler: WalletEventHandler<T>
  ): void;
  off<T extends keyof WalletAdapterEvents>(
    event: T,
    handler: WalletEventHandler<T>
  ): void;
}

// ============================================================================
// Provider Configuration
// ============================================================================

/**
 * Configuration for KaspaWalletProvider
 */
export interface WalletProviderConfig {
  /** Application name (shown in wallet prompts) */
  appName: string;
  /** Default network to use */
  network?: NetworkId;
  /** Auto-connect to last used wallet on mount */
  autoConnect?: boolean;
  /** Wallet adapters to enable */
  adapters?: WalletAdapter[];
  /** Custom network configurations */
  networks?: Partial<Record<NetworkId, NetworkConfig>>;
  /** Storage key prefix for persistence */
  storageKey?: string;
}

/**
 * Theme configuration for UI components
 */
export interface WalletThemeConfig {
  /** Theme mode */
  mode?: 'light' | 'dark' | 'system';
  /** Accent color (CSS color value) */
  accentColor?: string;
  /** Border radius for components */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

// ============================================================================
// Context State
// ============================================================================

/**
 * State managed by the wallet provider
 */
export interface WalletState {
  // Available wallets
  adapters: WalletAdapter[];

  // Current wallet
  currentAdapter: WalletAdapter | null;

  // Connection state
  connected: boolean;
  connecting: boolean;

  // Account info
  address: string | null;
  publicKey: string | null;
  balance: WalletBalance | null;

  // Network
  network: NetworkId;

  // Modal state
  isModalOpen: boolean;

  // Errors
  error: WalletError | null;
}

/**
 * Actions available in the wallet context
 */
export interface WalletActions {
  /** Connect to a specific wallet */
  connect: (adapterName?: string) => Promise<void>;
  /** Disconnect current wallet */
  disconnect: () => Promise<void>;
  /** Switch network */
  switchNetwork: (network: NetworkId) => Promise<void>;
  /** Refresh balance */
  refreshBalance: () => Promise<void>;
  /** Send transaction */
  sendTransaction: (params: SendTransactionParams) => Promise<TransactionResult>;
  /** Sign message */
  signMessage: (params: SignMessageParams) => Promise<SignedMessage>;
  /** Select a different connected wallet */
  selectWallet: (adapterName: string) => void;
  /** Open the connect modal */
  openModal: () => void;
  /** Close the connect modal */
  closeModal: () => void;
}

/**
 * Combined context value
 */
export interface WalletContextValue extends WalletState, WalletActions {}
