/**
 * @kasflow/wallet-connector - KasWare Wallet Adapter
 *
 * Adapter for the KasWare browser extension wallet.
 * KasWare is a popular Kaspa wallet extension for Chrome/Brave.
 */

import { BaseWalletAdapter } from './base';
import type {
  WalletMetadata,
  WalletReadyState,
  WalletBalance,
  SendTransactionParams,
  TransactionResult,
  SignMessageParams,
  SignedMessage,
  NetworkId,
  WalletErrorCode,
} from '../types';
import { WalletError } from '../types';

// KasWare icon
const KASWARE_ICON = 'https://kasware.xyz/logo.png';

/**
 * KasWare provider interface (window.kasware)
 */
interface KaswareProvider {
  requestAccounts(): Promise<string[]>;
  getAccounts(): Promise<string[]>;
  getBalance(): Promise<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }>;
  sendKaspa(
    to: string,
    amount: number,
    options?: { priorityFee?: number }
  ): Promise<string>;
  signMessage(message: string, type?: string): Promise<string>;
  getNetwork(): Promise<string>;
  switchNetwork(network: string): Promise<void>;
  getPublicKey(): Promise<string>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
}

/**
 * Declare the window.kasware property
 */
declare global {
  interface Window {
    kasware?: KaswareProvider;
  }
}

/**
 * Options for creating a KaswareWalletAdapter
 */
export interface KaswareAdapterOptions {
  /** Network to use (default: mainnet) */
  network?: NetworkId;
}

/**
 * Convert KasWare network string to our NetworkId type
 */
function kaswareNetworkToNetworkId(kaswareNetwork: string): NetworkId {
  switch (kaswareNetwork.toLowerCase()) {
    case 'mainnet':
    case 'kaspa-mainnet':
      return 'mainnet';
    case 'testnet-10':
    case 'kaspa-testnet-10':
      return 'testnet-10';
    case 'testnet-11':
    case 'kaspa-testnet-11':
      return 'testnet-11';
    default:
      return 'mainnet';
  }
}

/**
 * Convert our NetworkId to KasWare network string
 */
function networkIdToKaswareNetwork(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'kaspa-mainnet';
    case 'testnet-10':
      return 'kaspa-testnet-10';
    case 'testnet-11':
      return 'kaspa-testnet-11';
    default:
      return 'kaspa-mainnet';
  }
}

/**
 * KaswareWalletAdapter - Adapter for KasWare browser extension
 *
 * This adapter connects to the KasWare browser extension, providing:
 * - Extension-based wallet management
 * - Transaction signing through the extension popup
 * - Account and network change events
 *
 * @example
 * ```typescript
 * import { KaswareWalletAdapter } from '@kasflow/wallet-connector';
 *
 * const adapter = new KaswareWalletAdapter();
 * if (adapter.readyState === 'installed') {
 *   await adapter.connect();
 *   console.log('Address:', adapter.address);
 * }
 * ```
 */
export class KaswareWalletAdapter extends BaseWalletAdapter {
  readonly metadata: WalletMetadata = {
    name: 'kasware',
    displayName: 'KasWare',
    type: 'kasware',
    icon: KASWARE_ICON,
    url: 'https://kasware.xyz',
    description: 'KasWare browser extension for Chrome and Brave',
  };

  private provider: KaswareProvider | null = null;
  private _readyState: WalletReadyState = 'not-detected';

  // Bound event handlers for cleanup
  private handleAccountsChanged = this.onAccountsChanged.bind(this);
  private handleNetworkChanged = this.onNetworkChanged.bind(this);

  constructor(options: KaswareAdapterOptions = {}) {
    super();
    this._network = options.network ?? 'mainnet';
    this.detectReadyState();

    // Listen for provider injection
    if (typeof window !== 'undefined') {
      this.setupProviderListener();
    }
  }

  // =========================================================================
  // Ready State Detection
  // =========================================================================

  get readyState(): WalletReadyState {
    return this._readyState;
  }

  /**
   * Detect if KasWare is installed
   */
  private detectReadyState(): void {
    if (typeof window === 'undefined') {
      this._readyState = 'not-detected';
      return;
    }

    // Check if kasware is injected
    if (window.kasware) {
      this.provider = window.kasware;
      this._readyState = 'installed';
      this.emitReadyStateChange('installed');
    } else {
      this._readyState = 'not-detected';
    }
  }

  /**
   * Listen for KasWare to be injected after page load
   */
  private setupProviderListener(): void {
    // Some extensions inject after DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.detectReadyState();
      });
    }

    // Also check after a short delay (some extensions inject later)
    setTimeout(() => {
      if (this._readyState === 'not-detected') {
        this.detectReadyState();
      }
    }, 1000);
  }

  // =========================================================================
  // Connection
  // =========================================================================

  /**
   * Connect to KasWare
   */
  async connect(): Promise<void> {
    if (this._connected) {
      throw new WalletError(
        'ALREADY_CONNECTED' as WalletErrorCode,
        'Wallet is already connected'
      );
    }

    if (!this.provider) {
      // Try to detect again
      this.detectReadyState();
      if (!this.provider) {
        throw new WalletError(
          'WALLET_NOT_FOUND' as WalletErrorCode,
          'KasWare wallet not found. Please install the extension.'
        );
      }
    }

    this.setConnecting(true);

    try {
      // Request accounts (triggers popup)
      const accounts = await this.provider.requestAccounts();

      if (!accounts || accounts.length === 0) {
        throw new WalletError(
          'CONNECTION_REJECTED' as WalletErrorCode,
          'No accounts returned from KasWare'
        );
      }

      const address = accounts[0];

      // Get public key
      let publicKey: string | null = null;
      try {
        publicKey = await this.provider.getPublicKey();
      } catch {
        // Public key not available - not all wallets expose this
      }

      // Get current network from wallet
      const kaswareNetwork = await this.provider.getNetwork();
      this._network = kaswareNetworkToNetworkId(kaswareNetwork);

      // Set up event listeners
      this.provider.on('accountsChanged', this.handleAccountsChanged);
      this.provider.on('networkChanged', this.handleNetworkChanged);

      this.setConnected(address, publicKey);
    } catch (error) {
      this.setConnecting(false);
      if (error instanceof WalletError) {
        this.emitError(error);
        throw error;
      }
      const walletError = new WalletError(
        'CONNECTION_REJECTED' as WalletErrorCode,
        error instanceof Error ? error.message : 'Connection rejected',
        error instanceof Error ? error : undefined
      );
      this.emitError(walletError);
      throw walletError;
    }
  }

  /**
   * Disconnect from KasWare
   */
  async disconnect(): Promise<void> {
    if (!this._connected) {
      return;
    }

    // Remove event listeners
    if (this.provider) {
      this.provider.removeListener('accountsChanged', this.handleAccountsChanged);
      this.provider.removeListener('networkChanged', this.handleNetworkChanged);
    }

    this.setDisconnected();
  }

  // =========================================================================
  // Event Handlers
  // =========================================================================

  private onAccountsChanged(accounts: unknown): void {
    const accountList = accounts as string[];
    if (!accountList || accountList.length === 0) {
      this.disconnect();
      return;
    }

    const newAddress = accountList[0];
    if (newAddress !== this._address) {
      this._address = newAddress;
      this.emitAccountChange(newAddress);
    }
  }

  private onNetworkChanged(network: unknown): void {
    const networkStr = network as string;
    const networkId = kaswareNetworkToNetworkId(networkStr);
    this.setNetwork(networkId);
  }

  // =========================================================================
  // Balance
  // =========================================================================

  /**
   * Get wallet balance from KasWare
   */
  async getBalance(): Promise<WalletBalance> {
    if (!this.provider || !this._connected) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    try {
      const balance = await this.provider.getBalance();

      // KasWare returns balance in sompi as numbers
      // Convert to bigint for consistency
      return {
        available: BigInt(balance.confirmed),
        pending: BigInt(balance.unconfirmed),
        total: BigInt(balance.total),
      };
    } catch (error) {
      throw new WalletError(
        'RPC_ERROR' as WalletErrorCode,
        error instanceof Error ? error.message : 'Failed to get balance',
        error instanceof Error ? error : undefined
      );
    }
  }

  // =========================================================================
  // Transactions
  // =========================================================================

  /**
   * Send a transaction via KasWare
   */
  async sendTransaction(
    params: SendTransactionParams
  ): Promise<TransactionResult> {
    if (!this.provider || !this._connected) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    try {
      // KasWare expects amount in sompi as number
      // Note: This may overflow for very large amounts (>2^53)
      const amountNumber = Number(params.amount);

      const txId = await this.provider.sendKaspa(params.to, amountNumber, {
        priorityFee: params.priorityFee ? Number(params.priorityFee) : undefined,
      });

      return {
        txId,
        network: this._network,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('rejected') || error.message.includes('denied')) {
          throw new WalletError(
            'TRANSACTION_REJECTED' as WalletErrorCode,
            error.message,
            error
          );
        }
        if (error.message.includes('insufficient') || error.message.includes('balance')) {
          throw new WalletError(
            'INSUFFICIENT_BALANCE' as WalletErrorCode,
            error.message,
            error
          );
        }
      }
      throw new WalletError(
        'TRANSACTION_FAILED' as WalletErrorCode,
        error instanceof Error ? error.message : 'Transaction failed',
        error instanceof Error ? error : undefined
      );
    }
  }

  // =========================================================================
  // Signing
  // =========================================================================

  /**
   * Sign a message via KasWare
   */
  async signMessage(params: SignMessageParams): Promise<SignedMessage> {
    if (!this.provider || !this._connected || !this._address) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    try {
      const signature = await this.provider.signMessage(params.message);

      return {
        message: params.message,
        signature,
        address: this._address,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('rejected') || error.message.includes('denied')) {
          throw new WalletError(
            'SIGNING_REJECTED' as WalletErrorCode,
            error.message,
            error
          );
        }
      }
      throw new WalletError(
        'SIGNING_FAILED' as WalletErrorCode,
        error instanceof Error ? error.message : 'Signing failed',
        error instanceof Error ? error : undefined
      );
    }
  }

  // =========================================================================
  // Network
  // =========================================================================

  /**
   * Switch network via KasWare
   */
  async switchNetwork(network: NetworkId): Promise<void> {
    if (!this.provider || !this._connected) {
      // Just update internal state if not connected
      this.setNetwork(network);
      return;
    }

    try {
      const kaswareNetwork = networkIdToKaswareNetwork(network);
      await this.provider.switchNetwork(kaswareNetwork);

      // Network change event handler will update internal state
    } catch (error) {
      throw new WalletError(
        'NETWORK_ERROR' as WalletErrorCode,
        error instanceof Error ? error.message : 'Network switch failed',
        error instanceof Error ? error : undefined
      );
    }
  }

  // =========================================================================
  // Static Helpers
  // =========================================================================

  /**
   * Check if KasWare is installed
   */
  static isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.kasware;
  }

  /**
   * Get the KasWare provider if available
   */
  static getProvider(): KaswareProvider | null {
    if (typeof window !== 'undefined' && window.kasware) {
      return window.kasware;
    }
    return null;
  }
}

/**
 * Factory function to create a KaswareWalletAdapter
 */
export function kaswareAdapter(
  options?: KaswareAdapterOptions
): KaswareWalletAdapter {
  return new KaswareWalletAdapter(options);
}
