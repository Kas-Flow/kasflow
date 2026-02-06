/**
 * RPC client for Kaspa network operations
 * Wraps @onekeyfe/kaspa-wasm RpcClient with a simpler API
 */

import {
  RpcClient,
  Resolver,
  UtxoEntryReference,
} from '@onekeyfe/kaspa-wasm';

import type {
  ISubmitTransactionRequest,
  ISubmitTransactionResponse,
} from '@onekeyfe/kaspa-wasm';

import {
  ERROR_MESSAGES,
  RPC_TIMEOUT_MS,
  type NetworkId,
} from './constants';
import { getNetworkType } from './kaspa';
import type { BalanceInfo } from './types';
import { ensureWasmInitialized } from './wasm-init';

// =============================================================================
// Types
// =============================================================================

export interface RpcConnectionOptions {
  /** Network to connect to */
  network: NetworkId;
  /** Optional custom RPC URL (defaults to public resolver) */
  url?: string;
  /** Connection timeout in ms (defaults to RPC_TIMEOUT_MS) */
  timeout?: number;
}

export interface RpcEventHandlers {
  onConnect?: (url: string) => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

// =============================================================================
// KaspaRpc Class
// =============================================================================

/**
 * RPC client for Kaspa network operations
 *
 * @example
 * ```typescript
 * const rpc = new KaspaRpc();
 *
 * await rpc.connect({ network: 'testnet-11' });
 *
 * const balance = await rpc.getBalance('kaspatest:...');
 * console.log('Balance:', balance.available);
 *
 * await rpc.disconnect();
 * ```
 */
export class KaspaRpc {
  private rpc: RpcClient | null = null;
  private network: NetworkId | null = null;
  private eventHandlers: RpcEventHandlers = {};

  /**
   * Check if connected to the network
   */
  get isConnected(): boolean {
    return this.rpc !== null;
  }

  /**
   * Get the current network
   */
  get currentNetwork(): NetworkId | null {
    return this.network;
  }

  /**
   * Get the underlying RpcClient instance
   * Only use for advanced operations
   */
  get client(): RpcClient | null {
    return this.rpc;
  }

  /**
   * Set event handlers for connection events
   */
  setEventHandlers(handlers: RpcEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Connect to the Kaspa network
   *
   * @param options - Connection options
   * @throws Error if connection fails
   */
  async connect(options: RpcConnectionOptions): Promise<void> {
    await ensureWasmInitialized();

    const { network, url, timeout = RPC_TIMEOUT_MS } = options;
    const networkType = getNetworkType(network);

    // Disconnect if already connected
    if (this.rpc) {
      await this.disconnect();
    }

    try {
      // Create RPC client
      if (url) {
        // Connect to specific URL
        this.rpc = new RpcClient({
          url,
          networkId: networkType,
        });
      } else {
        // Use public resolver to find a node
        this.rpc = new RpcClient({
          resolver: new Resolver(),
          networkId: networkType,
        });
      }

      // Set up event listeners
      this.rpc.addEventListener('connect', (event: any) => {
        this.eventHandlers.onConnect?.(event?.url || 'unknown');
      });

      this.rpc.addEventListener('disconnect', () => {
        this.eventHandlers.onDisconnect?.();
      });

      // Connect with timeout
      await Promise.race([
        this.rpc.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), timeout)
        ),
      ]);

      this.network = network;
    } catch (error) {
      this.rpc = null;
      this.network = null;
      const message = error instanceof Error ? error.message : String(error);
      this.eventHandlers.onError?.(message);
      throw new Error(`${ERROR_MESSAGES.RPC_CONNECTION_FAILED}: ${message}`);
    }
  }

  /**
   * Disconnect from the network
   */
  async disconnect(): Promise<void> {
    if (this.rpc) {
      try {
        await this.rpc.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.rpc = null;
      this.network = null;
    }
  }

  /**
   * Ensure RPC is connected, throw if not
   */
  private ensureConnected(): RpcClient {
    if (!this.rpc) {
      throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
    }
    return this.rpc;
  }

  /**
   * Get balance for an address
   *
   * @param address - Kaspa address
   * @returns Balance info with available, pending, and total amounts
   */
  async getBalance(address: string): Promise<BalanceInfo> {
    const rpc = this.ensureConnected();

    const response = await rpc.getBalanceByAddress({ address });
    const available = response.balance;

    // Note: The simple RPC doesn't distinguish pending/confirmed
    // For full pending tracking, use UtxoContext
    return {
      available,
      pending: 0n,
      total: available,
    };
  }

  /**
   * Get UTXOs for an address
   *
   * @param address - Kaspa address
   * @returns Array of UTXO entries
   */
  async getUtxos(address: string): Promise<UtxoEntryReference[]> {
    const rpc = this.ensureConnected();

    const response = await rpc.getUtxosByAddresses({ addresses: [address] });
    return response.entries;
  }

  /**
   * Get UTXOs for multiple addresses
   *
   * @param addresses - Array of Kaspa addresses
   * @returns Array of UTXO entries
   */
  async getUtxosForAddresses(addresses: string[]): Promise<UtxoEntryReference[]> {
    const rpc = this.ensureConnected();

    const response = await rpc.getUtxosByAddresses({ addresses });
    return response.entries;
  }

  /**
   * Submit a signed transaction to the network
   *
   * @param transaction - Signed transaction object
   * @param allowOrphan - Allow orphan transactions (default: false)
   * @returns Transaction ID
   */
  async submitTransaction(
    transaction: ISubmitTransactionRequest['transaction'],
    allowOrphan: boolean = false
  ): Promise<string> {
    const rpc = this.ensureConnected();

    const response: ISubmitTransactionResponse = await rpc.submitTransaction({
      transaction,
      allowOrphan,
    });

    return response.transactionId;
  }

  /**
   * Get the current block count
   */
  async getBlockCount(): Promise<bigint> {
    const rpc = this.ensureConnected();

    const response = await rpc.getBlockCount();
    return response.blockCount;
  }

  /**
   * Get network info (DAG info)
   */
  async getNetworkInfo(): Promise<{
    network: string;
    blockCount: bigint;
    headerCount: bigint;
    tipHashes: string[];
    difficulty: number;
    pastMedianTime: bigint;
    virtualParentHashes: string[];
    pruningPointHash: string;
    virtualDaaScore: bigint;
    sink: string;
  }> {
    const rpc = this.ensureConnected();

    const response = await rpc.getBlockDagInfo();
    return {
      network: response.network,
      blockCount: response.blockCount,
      headerCount: response.headerCount,
      tipHashes: response.tipHashes,
      difficulty: response.difficulty,
      pastMedianTime: response.pastMedianTime,
      virtualParentHashes: response.virtualParentHashes,
      pruningPointHash: response.pruningPointHash,
      virtualDaaScore: response.virtualDaaScore,
      sink: response.sink,
    };
  }

  /**
   * Get the current server info
   */
  async getServerInfo(): Promise<{
    serverVersion: string;
    rpcApiVersion: number[];
    isSynced: boolean;
    hasUtxoIndex: boolean;
  }> {
    const rpc = this.ensureConnected();

    const response = await rpc.getServerInfo();
    return {
      serverVersion: response.serverVersion,
      rpcApiVersion: response.rpcApiVersion,
      isSynced: response.isSynced,
      hasUtxoIndex: response.hasUtxoIndex,
    };
  }
}

// =============================================================================
// Singleton Instance (optional convenience)
// =============================================================================

let defaultRpcInstance: KaspaRpc | null = null;

/**
 * Get or create the default RPC instance
 */
export const getDefaultRpc = (): KaspaRpc => {
  if (!defaultRpcInstance) {
    defaultRpcInstance = new KaspaRpc();
  }
  return defaultRpcInstance;
};

/**
 * Reset the default RPC instance
 */
export const resetDefaultRpc = async (): Promise<void> => {
  if (defaultRpcInstance) {
    await defaultRpcInstance.disconnect();
    defaultRpcInstance = null;
  }
};
