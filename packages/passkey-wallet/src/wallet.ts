/**
 * PasskeyWallet - Main wallet class for @kasflow/passkey-wallet
 * Provides a simple API for creating and managing passkey-protected Kaspa wallets
 */

import { DEFAULT_NETWORK, ERROR_MESSAGES, type NetworkId } from './constants';
import { encryptWalletData, decryptWalletData } from './crypto';
import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPublicKeyHex,
  signMessageWithKey,
} from './kaspa';
import { registerPasskey, authenticateWithPasskey, isWebAuthnSupported } from './webauthn';
import {
  hasStoredWallet,
  storeWalletData,
  getWalletData,
  clearAllData,
  storeCredentialId,
  getCredentialId,
  createEncryptedWalletData,
} from './keystore';
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
  WalletData,
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
        console.log(`Connected to Kaspa network: ${url}`);
      },
      onDisconnect: () => {
        console.log('Disconnected from Kaspa network');
      },
      onError: (error) => {
        console.error('RPC error:', error);
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
    console.log('[PasskeyWallet] create() called with options:', options);
    const { name = 'KasFlow Wallet', network = DEFAULT_NETWORK } = options;

    // Check if wallet already exists
    console.log('[PasskeyWallet] Checking if wallet already exists...');
    if (await hasStoredWallet()) {
      console.warn('[PasskeyWallet] Wallet already exists in storage');
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_ALREADY_EXISTS,
      };
    }

    // Check WebAuthn support
    console.log('[PasskeyWallet] Checking WebAuthn support...');
    if (!isWebAuthnSupported()) {
      console.error('[PasskeyWallet] WebAuthn not supported');
      return {
        success: false,
        error: ERROR_MESSAGES.WEBAUTHN_NOT_SUPPORTED,
      };
    }
    console.log('[PasskeyWallet] WebAuthn is supported');

    // Register passkey
    console.log('[PasskeyWallet] Starting passkey registration...');
    const registration = await registerPasskey(name);
    console.log('[PasskeyWallet] Registration result:', {
      success: registration.success,
      hasCredential: !!registration.credential,
      error: registration.error
    });

    if (!registration.success || !registration.credential) {
      console.error('[PasskeyWallet] Passkey registration failed:', registration.error);
      return {
        success: false,
        error: registration.error ?? ERROR_MESSAGES.PASSKEY_REGISTRATION_FAILED,
      };
    }

    // Authenticate immediately to get key material for encryption
    console.log('[PasskeyWallet] Authenticating with newly created passkey...');
    const auth = await authenticateWithPasskey(registration.credential.id);
    console.log('[PasskeyWallet] Authentication result:', {
      success: auth.success,
      hasAuthData: !!auth.authenticatorData,
      hasClientData: !!auth.clientDataJSON,
      error: auth.error
    });

    if (!auth.success || !auth.authenticatorData || !auth.clientDataJSON) {
      console.error('[PasskeyWallet] Passkey authentication failed:', auth.error);
      return {
        success: false,
        error: auth.error ?? ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED,
      };
    }

    // Generate Kaspa keypair
    console.log('[PasskeyWallet] Generating Kaspa keypair...');
    const privateKeyHex = generatePrivateKey();
    console.log('[PasskeyWallet] Private key generated, deriving public key...');
    const publicKeyHex = await getPublicKeyHex(privateKeyHex);
    console.log('[PasskeyWallet] Public key derived, generating address...');
    const address = await getAddressFromPrivateKey(privateKeyHex, network);
    console.log('[PasskeyWallet] Address generated:', address);

    // Create wallet data
    const walletData: WalletData = {
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
      address,
      network,
      createdAt: Date.now(),
    };

    // Encrypt and store wallet data
    console.log('[PasskeyWallet] Encrypting wallet data...');
    const encrypted = await encryptWalletData(
      JSON.stringify(walletData),
      auth.authenticatorData,
      auth.clientDataJSON
    );
    console.log('[PasskeyWallet] Wallet data encrypted, storing...');

    await storeWalletData(
      createEncryptedWalletData(encrypted.ciphertext, encrypted.iv, encrypted.salt)
    );
    await storeCredentialId(registration.credential.id);
    console.log('[PasskeyWallet] Wallet data stored successfully');

    // Create and return wallet instance
    console.log('[PasskeyWallet] Creating wallet instance...');
    const wallet = new PasskeyWallet(privateKeyHex, publicKeyHex, address, network);
    wallet.emit({ type: 'connected', address });

    console.log('[PasskeyWallet] Wallet created successfully!');
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
    // Check if wallet exists
    if (!(await hasStoredWallet())) {
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_FOUND,
      };
    }

    // Get stored credential ID for faster lookup
    const credentialId = await getCredentialId();

    // Authenticate with passkey
    const auth = await authenticateWithPasskey(credentialId ?? undefined);
    if (!auth.success || !auth.authenticatorData || !auth.clientDataJSON) {
      return {
        success: false,
        error: auth.error ?? ERROR_MESSAGES.PASSKEY_AUTHENTICATION_FAILED,
      };
    }

    // Get encrypted wallet data
    const encryptedData = await getWalletData();
    if (!encryptedData) {
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_FOUND,
      };
    }

    // Decrypt wallet data
    try {
      const decrypted = await decryptWalletData(
        encryptedData,
        auth.authenticatorData,
        auth.clientDataJSON
      );

      const walletData: WalletData = JSON.parse(decrypted);
      const network = options.network ?? walletData.network;

      // Create wallet instance
      const wallet = new PasskeyWallet(
        walletData.privateKey,
        walletData.publicKey,
        walletData.address,
        network
      );
      wallet.emit({ type: 'connected', address: walletData.address });

      return {
        success: true,
        data: wallet,
      };
    } catch {
      return {
        success: false,
        error: ERROR_MESSAGES.DECRYPTION_FAILED,
      };
    }
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
        console.error('Event handler error:', error);
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
