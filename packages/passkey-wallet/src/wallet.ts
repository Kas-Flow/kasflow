/**
 * PasskeyWallet - Main wallet class for @kasflow/passkey-wallet
 * Provides a simple API for creating and managing passkey-protected Kaspa wallets
 */

import { DEFAULT_NETWORK, ERROR_MESSAGES, type NetworkId } from './constants';
import { uint8ArrayToBase64, base64ToUint8Array } from './crypto';
import { deriveKaspaKeysFromPasskey } from './deterministic-keys';
import {
  getAddressFromPrivateKey,
  getPublicKeyHex,
  signMessageWithKey,
} from './kaspa';
import { registerPasskey, authenticateWithPasskey, isWebAuthnSupported } from './webauthn';
import {
  hasStoredWallet,
  clearAllData,
  storeCredentialId,
  getCredentialId,
  storeWalletMetadata,
  getWalletMetadata,
} from './keystore';
import { createLogger } from './logger';

const logger = createLogger('PasskeyWallet');
import { KaspaRpc, type RpcConnectionOptions } from './rpc';
import {
  sendTransaction,
  estimateFee,
  type SendOptions,
  type SendResult,
  type TransactionEstimate,
} from './transaction';
import type {
  CreateWalletOptions,
  UnlockWalletOptions,
  Result,
  WalletEvent,
  WalletEventHandler,
  BalanceInfo,
} from './types';

// =============================================================================
// PasskeyWallet Class
// =============================================================================

/**
 * PasskeyWallet provides a simple interface for passkey-protected Kaspa wallets
 *
 * @example
 * ```typescript
 * // Create a new wallet
 * const result = await PasskeyWallet.create({ name: 'My Wallet' });
 * if (result.success) {
 *   const wallet = result.data;
 *   console.log('Address:', wallet.getAddress());
 *
 *   // Connect to network
 *   await wallet.connect();
 *
 *   // Get balance
 *   const balance = await wallet.getBalance();
 *   console.log('Balance:', balance.available);
 *
 *   // Send KAS
 *   const tx = await wallet.send({
 *     to: 'kaspatest:...',
 *     amount: 100000000n, // 1 KAS in sompi
 *   });
 *   console.log('Transaction ID:', tx.transactionId);
 * }
 *
 * // Unlock existing wallet
 * const result = await PasskeyWallet.unlock();
 * ```
 */
export class PasskeyWallet {
  private privateKeyHex: string;
  private publicKeyHex: string;
  private address: string;
  private network: NetworkId;
  private eventHandlers: Set<WalletEventHandler> = new Set();
  private rpc: KaspaRpc;

  private constructor(
    privateKeyHex: string,
    publicKeyHex: string,
    address: string,
    network: NetworkId
  ) {
    this.privateKeyHex = privateKeyHex;
    this.publicKeyHex = publicKeyHex;
    this.address = address;
    this.network = network;
    this.rpc = new KaspaRpc();

    // Set up RPC event handlers
    this.rpc.setEventHandlers({
      onConnect: (url) => {
        logger.info(`Connected to Kaspa network: ${url}`);
      },
      onDisconnect: () => {
        logger.info('Disconnected from Kaspa network');
      },
      onError: (error) => {
        logger.error('RPC error:', error);
      },
    });
  }

  // ===========================================================================
  // Static Factory Methods
  // ===========================================================================

  /**
   * Check if WebAuthn/passkeys are supported in the current browser
   */
  static isSupported(): boolean {
    return isWebAuthnSupported();
  }

  /**
   * Check if a wallet already exists in storage
   */
  static async exists(): Promise<boolean> {
    return hasStoredWallet();
  }

  /**
   * Create a new passkey-protected wallet
   *
   * @param options - Configuration options
   * @returns Result containing the wallet instance or error
   */
  static async create(options: CreateWalletOptions = {}): Promise<Result<PasskeyWallet>> {
    logger.info('create() called with options:', options);
    const { name = 'KasFlow Wallet', network = DEFAULT_NETWORK } = options;

    // Check if wallet already exists
    logger.debug('Checking if wallet already exists...');
    if (await hasStoredWallet()) {
      logger.warn('Wallet already exists in storage');
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_ALREADY_EXISTS,
      };
    }

    // Check WebAuthn support
    logger.debug('Checking WebAuthn support...');
    if (!isWebAuthnSupported()) {
      logger.error('WebAuthn not supported');
      return {
        success: false,
        error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
      };
    }
    logger.debug('WebAuthn is supported');

    // Register passkey
    logger.info('Starting passkey registration...');
    const registration = await registerPasskey(name);
    logger.debug('Registration result:', {
      success: registration.success,
      hasCredential: !!registration.credential,
      hasPasskeyPublicKey: !!registration.passkeyPublicKey,
      error: registration.error
    });

    if (!registration.success || !registration.credential || !registration.passkeyPublicKey) {
      logger.error('Passkey registration failed:', registration.error);
      return {
        success: false,
        error: registration.error ?? ERROR_MESSAGES.PASSKEY_REGISTRATION_FAILED,
      };
    }

    // Derive Kaspa keys deterministically from passkey public key
    logger.info('Deriving Kaspa keys from passkey public key...');
    const { privateKeyHex } = deriveKaspaKeysFromPasskey(registration.passkeyPublicKey);

    logger.debug('Getting public key and address...');
    const publicKeyHex = await getPublicKeyHex(privateKeyHex);
    const address = await getAddressFromPrivateKey(privateKeyHex, network);

    logger.info('Wallet derived deterministically:', {
      address,
      publicKeyPrefix: publicKeyHex.substring(0, 10) + '...',
    });

    // Store passkey public key for unlock on other devices
    const passkeyPublicKeyBase64 = uint8ArrayToBase64(registration.passkeyPublicKey);

    // Store wallet metadata (no encryption needed - keys derived on-demand)
    logger.debug('Storing wallet metadata...');
    await storeWalletMetadata({
      passkeyPublicKey: passkeyPublicKeyBase64,
      address,
      network,
      createdAt: Date.now(),
    });
    await storeCredentialId(registration.credential.id);
    logger.debug('Wallet metadata stored successfully');

    // Create and return wallet instance
    logger.debug('Creating wallet instance...');
    const wallet = new PasskeyWallet(privateKeyHex, publicKeyHex, address, network);
    wallet.emit({ type: 'connected', address });

    logger.info('Wallet created successfully!');
    return {
      success: true,
      data: wallet,
    };
  }

  /**
   * Unlock an existing wallet using passkey authentication
   *
   * @param options - Configuration options
   * @returns Result containing the wallet instance or error
   */
  static async unlock(options: UnlockWalletOptions = {}): Promise<Result<PasskeyWallet>> {
    logger.info('unlock() called with options:', options);

    // Check if wallet exists
    logger.debug('Checking if wallet exists in storage...');
    if (!(await hasStoredWallet())) {
      logger.error('No wallet found in storage');
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_FOUND,
      };
    }
    logger.debug('Wallet exists in storage');

    // Get stored credential ID and wallet metadata
    logger.debug('Getting stored credential ID and wallet metadata...');
    const credentialId = await getCredentialId();
    const metadata = await getWalletMetadata();
    logger.debug('Stored credential ID:', credentialId);
    logger.debug('Wallet metadata:', metadata ? 'found' : 'not found');

    if (!metadata || !metadata.passkeyPublicKey) {
      logger.error('No passkey public key found in metadata');
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_FOUND,
      };
    }

    // Authenticate with passkey (verify user has access)
    logger.info('Authenticating with passkey...');
    const auth = await authenticateWithPasskey(credentialId ?? undefined);
    logger.debug('Authentication result:', {
      success: auth.success,
      error: auth.error
    });

    if (!auth.success) {
      logger.error('Passkey authentication failed:', auth.error);
      return {
        success: false,
        error: auth.error ?? ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED,
      };
    }

    // Derive same Kaspa keys from passkey public key
    logger.info('Deriving keys from passkey public key...');
    const passkeyPublicKey = base64ToUint8Array(metadata.passkeyPublicKey);
    const { privateKeyHex } = deriveKaspaKeysFromPasskey(passkeyPublicKey);

    const publicKeyHex = await getPublicKeyHex(privateKeyHex);
    const network = options.network ?? metadata.network;
    const address = await getAddressFromPrivateKey(privateKeyHex, network);

    // Verify address matches stored address
    if (address !== metadata.address) {
      logger.error('Derived address mismatch!', {
        expected: metadata.address,
        derived: address,
      });
      return {
        success: false,
        error: 'Failed to derive correct wallet address',
      };
    }

    logger.debug('Keys derived successfully, address verified');

    // Create wallet instance
    const wallet = new PasskeyWallet(
      privateKeyHex,
      publicKeyHex,
      address,
      network
    );
    wallet.emit({ type: 'connected', address });

    logger.info('Wallet unlocked successfully!');
    return {
      success: true,
      data: wallet,
    };
  }

  /**
   * Delete the wallet from storage
   * This is irreversible - make sure user has backed up their keys!
   */
  static async delete(): Promise<Result<void>> {
    await clearAllData();
    return { success: true };
  }

  // ===========================================================================
  // Instance Methods - Basic Info
  // ===========================================================================

  /**
   * Get the wallet's Kaspa address
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Get the wallet's public key as hex string
   */
  getPublicKey(): string {
    return this.publicKeyHex;
  }

  /**
   * Get the current network
   */
  getNetwork(): NetworkId {
    return this.network;
  }

  /**
   * Sign a message with the wallet's private key
   * Uses Kaspa's message signing scheme
   *
   * @param message - Message to sign
   * @returns Signature as hex string
   */
  async signMessage(message: string): Promise<string> {
    return await signMessageWithKey(message, this.privateKeyHex);
  }

  /**
   * Get the private key hex (for advanced usage like transaction signing)
   * WARNING: Handle with care - this is sensitive data
   */
  getPrivateKeyHex(): string {
    return this.privateKeyHex;
  }

  // ===========================================================================
  // Network Connection
  // ===========================================================================

  /**
   * Check if connected to the network
   */
  get isConnected(): boolean {
    return this.rpc.isConnected;
  }

  /**
   * Get the underlying RPC client for advanced usage
   */
  getRpcClient(): KaspaRpc {
    return this.rpc;
  }

  /**
   * Connect to the Kaspa network
   *
   * @param options - Optional connection options (defaults to current network with public resolver)
   */
  async connect(options?: Partial<RpcConnectionOptions>): Promise<void> {
    await this.rpc.connect({
      network: options?.network ?? this.network,
      url: options?.url,
      timeout: options?.timeout,
    });
  }

  /**
   * Disconnect from the Kaspa network
   */
  async disconnectNetwork(): Promise<void> {
    await this.rpc.disconnect();
  }

  // ===========================================================================
  // Balance & UTXOs
  // ===========================================================================

  /**
   * Get the wallet's balance
   *
   * @returns Balance info with available, pending, and total amounts
   * @throws Error if not connected to network
   */
  async getBalance(): Promise<BalanceInfo> {
    if (!this.rpc.isConnected) {
      throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
    }

    const balance = await this.rpc.getBalance(this.address);
    this.emit({ type: 'balance_updated', balance });
    return balance;
  }

  // ===========================================================================
  // Transactions
  // ===========================================================================

  /**
   * Send KAS to an address
   *
   * @param options - Send options (to, amount, priorityFee)
   * @returns Send result with transaction ID and details
   * @throws Error if not connected or insufficient balance
   *
   * @example
   * ```typescript
   * const result = await wallet.send({
   *   to: 'kaspatest:qz...',
   *   amount: 100000000n, // 1 KAS
   * });
   * console.log('Transaction ID:', result.transactionId);
   * ```
   */
  async send(options: SendOptions): Promise<SendResult> {
    if (!this.rpc.isConnected) {
      throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
    }

    // Get UTXOs
    const utxos = await this.rpc.getUtxos(this.address);

    // Calculate total available
    const totalAvailable = utxos.reduce((sum, utxo) => sum + utxo.amount, 0n);
    if (totalAvailable < options.amount) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
    }

    // Send transaction
    const result = await sendTransaction(
      options,
      utxos,
      this.address, // Use same address for change
      this.privateKeyHex,
      this.rpc,
      this.network
    );

    // Emit event
    this.emit({ type: 'transaction_sent', txId: result.transactionId });

    return result;
  }

  /**
   * Estimate the fee for a transaction
   *
   * @param options - Send options (to, amount, priorityFee)
   * @returns Transaction estimate with fees and UTXO count
   * @throws Error if not connected
   */
  async estimateFee(options: SendOptions): Promise<TransactionEstimate> {
    if (!this.rpc.isConnected) {
      throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
    }

    // Get UTXOs
    const utxos = await this.rpc.getUtxos(this.address);

    // Estimate
    return estimateFee(
      utxos,
      [{ address: options.to, amount: options.amount }],
      this.address,
      options.priorityFee,
      this.network
    );
  }

  // ===========================================================================
  // Event Handling
  // ===========================================================================

  /**
   * Subscribe to wallet events
   *
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  on(handler: WalletEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: WalletEvent): void {
    this.eventHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        logger.error('Event handler error:', error);
      }
    });
  }

  /**
   * Disconnect the wallet (clears in-memory keys and network connection)
   */
  async disconnect(): Promise<void> {
    // Disconnect from network
    await this.rpc.disconnect();

    // Clear sensitive data
    this.privateKeyHex = '';
    this.emit({ type: 'disconnected' });
    this.eventHandlers.clear();
  }
}
