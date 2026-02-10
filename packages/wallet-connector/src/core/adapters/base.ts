/**
 * @kasflow/wallet-connector - Base Wallet Adapter
 *
 * Abstract base class for all wallet adapters.
 * Provides event handling and common functionality.
 */

import type {
  WalletAdapter,
  WalletMetadata,
  WalletReadyState,
  WalletBalance,
  WalletAdapterEvents,
  WalletEventHandler,
  SendTransactionParams,
  TransactionResult,
  SignMessageParams,
  SignedMessage,
  NetworkId,
  WalletError,
} from '../types';

/**
 * Type-safe event emitter for wallet adapters
 */
class EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  private listeners: Map<keyof Events, Set<(...args: any[]) => void>> =
    new Map();

  on<T extends keyof Events>(event: T, handler: Events[T]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off<T extends keyof Events>(event: T, handler: Events[T]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  protected emit<T extends keyof Events>(
    event: T,
    ...args: Parameters<Events[T]>
  ): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${String(event)}:`, error);
        }
      });
    }
  }

  protected removeAllListeners(): void {
    this.listeners.clear();
  }
}

/**
 * Abstract base class for wallet adapters
 *
 * Provides:
 * - Event handling infrastructure
 * - State management helpers
 * - Common error handling
 *
 * Subclasses must implement:
 * - metadata (wallet info)
 * - connect/disconnect logic
 * - balance fetching
 * - transaction signing/sending
 * - message signing
 * - network switching
 */
export abstract class BaseWalletAdapter
  extends EventEmitter<WalletAdapterEvents>
  implements WalletAdapter
{
  // =========================================================================
  // Abstract Properties (must be implemented by subclasses)
  // =========================================================================

  abstract readonly metadata: WalletMetadata;
  abstract get readyState(): WalletReadyState;

  // =========================================================================
  // Protected State (managed by subclasses)
  // =========================================================================

  protected _connected: boolean = false;
  protected _connecting: boolean = false;
  protected _address: string | null = null;
  protected _publicKey: string | null = null;
  protected _network: NetworkId = 'mainnet';

  // =========================================================================
  // Public State (readonly getters)
  // =========================================================================

  get connected(): boolean {
    return this._connected;
  }

  get connecting(): boolean {
    return this._connecting;
  }

  get address(): string | null {
    return this._address;
  }

  get publicKey(): string | null {
    return this._publicKey;
  }

  get network(): NetworkId {
    return this._network;
  }

  // =========================================================================
  // Abstract Methods (must be implemented by subclasses)
  // =========================================================================

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getBalance(): Promise<WalletBalance>;
  abstract sendTransaction(
    params: SendTransactionParams
  ): Promise<TransactionResult>;
  abstract signMessage(params: SignMessageParams): Promise<SignedMessage>;
  abstract switchNetwork(network: NetworkId): Promise<void>;

  // =========================================================================
  // Protected Helpers
  // =========================================================================

  /**
   * Set connected state and emit event
   */
  protected setConnected(address: string, publicKey: string | null): void {
    this._connected = true;
    this._connecting = false;
    this._address = address;
    this._publicKey = publicKey;
    this.emit('connect', address);
  }

  /**
   * Set disconnected state and emit event
   */
  protected setDisconnected(): void {
    this._connected = false;
    this._connecting = false;
    this._address = null;
    this._publicKey = null;
    this.emit('disconnect');
  }

  /**
   * Set connecting state
   */
  protected setConnecting(connecting: boolean): void {
    this._connecting = connecting;
  }

  /**
   * Set network and emit event
   */
  protected setNetwork(network: NetworkId): void {
    const previousNetwork = this._network;
    this._network = network;
    if (previousNetwork !== network) {
      this.emit('networkChange', network);
    }
  }

  /**
   * Emit an error event
   */
  protected emitError(error: WalletError): void {
    this.emit('error', error);
  }

  /**
   * Emit ready state change
   */
  protected emitReadyStateChange(readyState: WalletReadyState): void {
    this.emit('readyStateChange', readyState);
  }

  /**
   * Emit account change (for extension wallets)
   */
  protected emitAccountChange(address: string | null): void {
    this._address = address;
    this.emit('accountChange', address);
  }

  /**
   * Clean up resources (called on disconnect)
   */
  protected cleanup(): void {
    this.removeAllListeners();
  }
}
