/**
 * @kasflow/wallet-connector - Passkey Wallet Adapter
 *
 * Adapter for the @kasflow/passkey-wallet SDK.
 * Provides biometric authentication powered by WebAuthn.
 */

import { PasskeyWallet } from '@kasflow/passkey-wallet';
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
import { WalletError, NETWORKS } from '../types';

// Passkey wallet icon as SVG data URI
const PASSKEY_ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3Ccircle cx='12' cy='16' r='1'/%3E%3C/svg%3E`;

/**
 * Options for creating a PasskeyWalletAdapter
 */
export interface PasskeyAdapterOptions {
  /** Network to use (default: mainnet) */
  network?: NetworkId;
  /** Whether to auto-connect to RPC on wallet connect */
  autoConnectRpc?: boolean;
}

/**
 * PasskeyWalletAdapter - Adapter for passkey-based wallet authentication
 *
 * This adapter wraps the @kasflow/passkey-wallet SDK, providing:
 * - Biometric authentication (Face ID, Touch ID, Windows Hello)
 * - Hardware-backed key storage (Secure Enclave/TPM)
 * - Per-transaction authentication for enhanced security
 *
 * @example
 * ```typescript
 * import { PasskeyWalletAdapter } from '@kasflow/wallet-connector';
 *
 * const adapter = new PasskeyWalletAdapter({ network: 'testnet-10' });
 * await adapter.connect();
 * console.log('Address:', adapter.address);
 * ```
 */
export class PasskeyWalletAdapter extends BaseWalletAdapter {
  readonly metadata: WalletMetadata = {
    name: 'passkey',
    displayName: 'Passkey Wallet',
    type: 'passkey',
    icon: PASSKEY_ICON,
    url: 'https://kasflow.app',
    description: 'Biometric authentication with Face ID, Touch ID, or Windows Hello',
  };

  private wallet: PasskeyWallet | null = null;
  private autoConnectRpc: boolean;
  private _readyState: WalletReadyState = 'not-detected';

  constructor(options: PasskeyAdapterOptions = {}) {
    super();
    this._network = options.network ?? 'mainnet';
    this.autoConnectRpc = options.autoConnectRpc ?? true;
    this.detectReadyState();
  }

  // =========================================================================
  // Ready State Detection
  // =========================================================================

  get readyState(): WalletReadyState {
    return this._readyState;
  }

  /**
   * Detect if passkey wallet is available
   */
  private async detectReadyState(): Promise<void> {
    // Check WebAuthn support
    if (!PasskeyWallet.isSupported()) {
      this._readyState = 'not-detected';
      this.emitReadyStateChange('not-detected');
      return;
    }

    // Check if wallet already exists
    const exists = await PasskeyWallet.exists();
    this._readyState = exists ? 'loadable' : 'installed';
    this.emitReadyStateChange(this._readyState);
  }

  // =========================================================================
  // Connection
  // =========================================================================

  /**
   * Connect to the passkey wallet
   *
   * If a wallet already exists, it will be unlocked.
   * Otherwise, a new wallet will be created.
   */
  async connect(): Promise<void> {
    if (this._connected) {
      throw new WalletError(
        'ALREADY_CONNECTED' as WalletErrorCode,
        'Wallet is already connected'
      );
    }

    this.setConnecting(true);

    try {
      // Check if wallet exists
      const exists = await PasskeyWallet.exists();

      let result;
      if (exists) {
        // Unlock existing wallet
        result = await PasskeyWallet.unlock({ network: this._network });
      } else {
        // Create new wallet
        result = await PasskeyWallet.create({ network: this._network });
      }

      if (!result.success || !result.data) {
        throw new WalletError(
          'CONNECTION_REJECTED' as WalletErrorCode,
          result.error ?? 'Failed to connect wallet'
        );
      }

      this.wallet = result.data;

      // Auto-connect to RPC if enabled
      if (this.autoConnectRpc) {
        await this.wallet.connect({ network: this._network });
      }

      this.setConnected(
        this.wallet.getAddress(),
        this.wallet.getPublicKey()
      );

      // Update ready state
      this._readyState = 'loadable';
      this.emitReadyStateChange('loadable');
    } catch (error) {
      this.setConnecting(false);
      if (error instanceof WalletError) {
        this.emitError(error);
        throw error;
      }
      const walletError = new WalletError(
        'CONNECTION_REJECTED' as WalletErrorCode,
        error instanceof Error ? error.message : 'Connection failed',
        error instanceof Error ? error : undefined
      );
      this.emitError(walletError);
      throw walletError;
    }
  }

  /**
   * Disconnect from the wallet
   */
  async disconnect(): Promise<void> {
    if (!this._connected || !this.wallet) {
      return;
    }

    try {
      await this.wallet.disconnect();
    } finally {
      this.wallet = null;
      this.setDisconnected();
    }
  }

  // =========================================================================
  // Balance
  // =========================================================================

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<WalletBalance> {
    if (!this.wallet || !this._connected) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    // Ensure RPC is connected
    if (!this.wallet.isConnected) {
      await this.wallet.connect({ network: this._network });
    }

    const balance = await this.wallet.getBalance();

    return {
      available: balance.available,
      pending: balance.pending,
      total: balance.available + balance.pending,
    };
  }

  // =========================================================================
  // Transactions
  // =========================================================================

  /**
   * Send a transaction with per-transaction authentication
   */
  async sendTransaction(
    params: SendTransactionParams
  ): Promise<TransactionResult> {
    if (!this.wallet || !this._connected) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    // Ensure RPC is connected
    if (!this.wallet.isConnected) {
      await this.wallet.connect({ network: this._network });
    }

    try {
      // Use sendWithAuth for per-transaction authentication (more secure)
      const result = await this.wallet.sendWithAuth({
        to: params.to,
        amount: params.amount,
        priorityFee: params.priorityFee,
      });

      return {
        txId: result.transactionId,
        network: this._network,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('insufficient') || error.message.includes('balance')) {
          throw new WalletError(
            'INSUFFICIENT_BALANCE' as WalletErrorCode,
            error.message,
            error
          );
        }
        if (error.message.includes('authentication') || error.message.includes('passkey')) {
          throw new WalletError(
            'TRANSACTION_REJECTED' as WalletErrorCode,
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
   * Sign a message
   */
  async signMessage(params: SignMessageParams): Promise<SignedMessage> {
    if (!this.wallet || !this._connected) {
      throw new WalletError(
        'NOT_CONNECTED' as WalletErrorCode,
        'Wallet is not connected'
      );
    }

    try {
      const signature = await this.wallet.signMessage(params.message);

      return {
        message: params.message,
        signature,
        address: this.wallet.getAddress(),
      };
    } catch (error) {
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
   * Switch to a different network
   */
  async switchNetwork(network: NetworkId): Promise<void> {
    if (!this.wallet || !this._connected) {
      // Just update internal state if not connected
      this.setNetwork(network);
      return;
    }

    try {
      const result = await this.wallet.switchNetwork(network);

      if (!result.success) {
        throw new WalletError(
          'NETWORK_ERROR' as WalletErrorCode,
          result.error ?? 'Failed to switch network'
        );
      }

      // Update state
      this._address = this.wallet.getAddress();
      this.setNetwork(network);

      // Reconnect RPC to new network
      if (this.autoConnectRpc) {
        await this.wallet.connect({ network });
      }
    } catch (error) {
      if (error instanceof WalletError) {
        throw error;
      }
      throw new WalletError(
        'NETWORK_ERROR' as WalletErrorCode,
        error instanceof Error ? error.message : 'Network switch failed',
        error instanceof Error ? error : undefined
      );
    }
  }

  // =========================================================================
  // Static Factory
  // =========================================================================

  /**
   * Check if WebAuthn/passkeys are supported
   */
  static isSupported(): boolean {
    return PasskeyWallet.isSupported();
  }

  /**
   * Check if a passkey wallet already exists
   */
  static async exists(): Promise<boolean> {
    return PasskeyWallet.exists();
  }

  /**
   * Delete the stored passkey wallet
   */
  static async delete(): Promise<void> {
    await PasskeyWallet.delete();
  }
}

/**
 * Factory function to create a PasskeyWalletAdapter
 */
export function passkeyAdapter(
  options?: PasskeyAdapterOptions
): PasskeyWalletAdapter {
  return new PasskeyWalletAdapter(options);
}
