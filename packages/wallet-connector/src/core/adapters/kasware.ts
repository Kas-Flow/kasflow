/**
 * @kasflow/wallet-connector - KasWare Wallet Adapter
 *
 * Adapter for the KasWare browser extension wallet.
 * KasWare is a popular Kaspa wallet extension for Chrome/Brave.
 */

import { KaspaRpc } from '@kasflow/passkey-wallet';
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
 * KasWare uses format: kaspa_mainnet, kaspa_testnet_10, kaspa_testnet_11
 */
function kaswareNetworkToNetworkId(kaswareNetwork: string): NetworkId {
  const network = kaswareNetwork.toLowerCase();

  // KasWare specific formats (with underscores)
  if (network === 'kaspa_mainnet' || network === 'mainnet') {
    return 'mainnet';
  }
  if (network === 'kaspa_testnet_10' || network === 'testnet-10') {
    return 'testnet-10';
  }
  if (network === 'kaspa_testnet_11' || network === 'testnet-11') {
    return 'testnet-11';
  }

  console.warn('[KasWare] Unknown network format:', kaswareNetwork, '- defaulting to mainnet');
  return 'mainnet';
}

/**
 * Convert our NetworkId to KasWare network string
 * KasWare uses format: kaspa_mainnet, kaspa_testnet_10, kaspa_testnet_11
 */
function networkIdToKaswareNetwork(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'kaspa_mainnet';
    case 'testnet-10':
      return 'kaspa_testnet_10';
    case 'testnet-11':
      return 'kaspa_testnet_11';
    default:
      return 'kaspa_mainnet';
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
  private rpc: KaspaRpc | null = null;

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
      console.log('[KasWare] Wallet returned network:', kaswareNetwork);
      this._network = kaswareNetworkToNetworkId(kaswareNetwork);
      console.log('[KasWare] Mapped to NetworkId:', this._network);

      // Set up event listeners
      this.provider.on('accountsChanged', this.handleAccountsChanged);
      this.provider.on('networkChanged', this.handleNetworkChanged);

      // Connect to RPC for reliable balance fetching
      try {
        this.rpc = new KaspaRpc();
        await this.rpc.connect({ network: this._network });
        console.log('[KasWare] RPC connected for balance fetching');
      } catch (rpcError) {
        console.warn('[KasWare] RPC connection failed, balance may be unreliable:', rpcError);
        // Don't fail the whole connection if RPC fails
      }

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

    // Disconnect RPC
    if (this.rpc) {
      try {
        await this.rpc.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.rpc = null;
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
    console.log('[KasWare] Network changed event received:', networkStr);
    const networkId = kaswareNetworkToNetworkId(networkStr);
    console.log('[KasWare] Mapped to NetworkId:', networkId);
    this.setNetwork(networkId);
  }

  // =========================================================================
  // Balance
  // =========================================================================

  /**
   * Get wallet balance via RPC (more reliable than wallet extension)
   */
  async getBalance(): Promise<WalletBalance> {
    if (!this._connected || !this._address) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    try {
      // Prefer RPC for reliable balance (wallet extension getBalance is unreliable)
      if (this.rpc && this.rpc.isConnected) {
        console.log('[KasWareAdapter] Fetching balance via RPC for:', this._address);
        const balance = await this.rpc.getBalance(this._address);
        console.log('[KasWareAdapter] RPC balance:', {
          available: balance.available.toString(),
          pending: balance.pending.toString(),
          total: balance.total.toString(),
        });
        return {
          available: balance.available,
          pending: balance.pending,
          total: balance.total,
        };
      }

      // Fallback to wallet extension if RPC not available
      if (this.provider) {
        console.log('[KasWareAdapter] Fallback: fetching balance from extension');
        const balance = await this.provider.getBalance();
        console.log('[KasWareAdapter] Extension balance:', balance);

        // KasWare may return total but not confirmed - use total as available if confirmed is missing
        const available = BigInt(balance.confirmed || balance.total || 0);
        const pending = BigInt(balance.unconfirmed || 0);
        const total = BigInt(balance.total || 0);

        return { available, pending, total };
      }

      throw new Error('No balance source available');
    } catch (error) {
      console.error('[KasWareAdapter] getBalance error:', error);
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

      const result = await this.provider.sendKaspa(params.to, amountNumber, {
        priorityFee: params.priorityFee ? Number(params.priorityFee) : undefined,
      });

      console.log('[KasWareAdapter] sendKaspa result:', result);

      // KasWare returns a JSON string containing the full transaction object
      // We need to parse it and extract the 'id' field and calculate fee
      let txId: string;
      let fee: bigint | undefined;

      if (typeof result === 'string') {
        // Check if it's a JSON string (starts with '{')
        if (result.startsWith('{')) {
          try {
            const parsed = JSON.parse(result);
            txId = parsed.id || result;

            // Calculate fee from inputs and outputs
            // fee = sum(inputs) - sum(outputs)
            if (parsed.inputs && parsed.outputs) {
              const inputSum = (parsed.inputs as Array<{ utxo?: { amount?: string } }>).reduce(
                (sum, input) => sum + BigInt(input.utxo?.amount || '0'),
                0n
              );

              const outputSum = (parsed.outputs as Array<{ value?: string }>).reduce(
                (sum, output) => sum + BigInt(output.value || '0'),
                0n
              );

              fee = inputSum - outputSum;
              console.log('[KasWareAdapter] Calculated fee:', fee?.toString(), 'sompi');
            }
          } catch {
            txId = result; // If parse fails, use as-is
          }
        } else {
          txId = result; // Plain transaction ID string
        }
      } else if (result && typeof result === 'object' && 'id' in result) {
        txId = (result as { id: string }).id;
      } else {
        throw new Error('Unexpected response format from KasWare');
      }

      console.log('[KasWareAdapter] Extracted txId:', txId);

      return {
        txId,
        network: this._network,
        fee,
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
    console.log('[KasWare] switchNetwork called with:', network);

    if (!this.provider || !this._connected) {
      console.log('[KasWare] Not connected, just updating internal state');
      this.setNetwork(network);
      return;
    }

    try {
      const kaswareNetwork = networkIdToKaswareNetwork(network);
      console.log('[KasWare] Requesting wallet to switch to:', kaswareNetwork);
      await this.provider.switchNetwork(kaswareNetwork);
      console.log('[KasWare] Network switch request completed');

      // Get updated account info after network switch
      const accounts = await this.provider.getAccounts();
      if (accounts && accounts.length > 0) {
        const newAddress = accounts[0];
        console.log('[KasWare] Address after network switch:', newAddress);
        if (newAddress !== this._address) {
          this._address = newAddress;
          this.emitAccountChange(newAddress);
        }
      }

      // Reconnect RPC to new network
      if (this.rpc) {
        try {
          await this.rpc.disconnect();
          await this.rpc.connect({ network });
          console.log('[KasWare] RPC reconnected for new network:', network);
        } catch (rpcError) {
          console.warn('[KasWare] RPC reconnection failed:', rpcError);
        }
      }

      // Update internal network state
      this.setNetwork(network);
    } catch (error) {
      console.error('[KasWare] Network switch failed:', error);
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
