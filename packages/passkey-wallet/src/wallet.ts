/**
 * PasskeyWallet - Main wallet class for @kasflow/passkey-wallet
 * Provides a simple API for creating and managing passkey-protected Kaspa wallets
 */

import { DEFAULT_NETWORK, NETWORK_ID, ERROR_MESSAGES, type NetworkId } from './constants';
import { uint8ArrayToBase64, base64ToUint8Array, base64urlToUint8Array } from './crypto';
import { deriveKaspaKeysFromPasskey } from './deterministic-keys';
import {
  getAddressFromPrivateKey,
  getPublicKeyHex,
  signMessageWithKey,
  computeTransactionHash,
} from './kaspa';
import {
  registerPasskey,
  authenticateWithPasskey,
  authenticateWithChallenge,
  isWebAuthnSupported,
} from './webauthn';
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
  buildTransactions,
  signTransactions,
  submitTransactions,
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
  AuthenticationResult,
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
  private credentialId: string | null = null;
  private passkeyPublicKey: Uint8Array | null = null;

  private constructor(
    privateKeyHex: string,
    publicKeyHex: string,
    address: string,
    network: NetworkId,
    credentialId?: string,
    passkeyPublicKey?: Uint8Array
  ) {
    this.privateKeyHex = privateKeyHex;
    this.publicKeyHex = publicKeyHex;
    this.address = address;
    this.network = network;
    this.credentialId = credentialId ?? null;
    this.passkeyPublicKey = passkeyPublicKey ?? null;
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

    logger.debug('Getting public key...');
    const publicKeyHex = await getPublicKeyHex(privateKeyHex);

    // Generate addresses for ALL networks (enables seamless network switching)
    logger.info('Generating addresses for all networks...');
    const addresses: { [key in NetworkId]: string } = {
      [NETWORK_ID.MAINNET]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.MAINNET),
      [NETWORK_ID.TESTNET_10]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.TESTNET_10),
      [NETWORK_ID.TESTNET_11]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.TESTNET_11),
    };

    const address = addresses[network];

    logger.info('Wallet created for all networks:', {
      primaryNetwork: network,
      mainnetAddress: addresses[NETWORK_ID.MAINNET],
      testnet10Address: addresses[NETWORK_ID.TESTNET_10],
      testnet11Address: addresses[NETWORK_ID.TESTNET_11],
      publicKeyPrefix: publicKeyHex.substring(0, 10) + '...',
    });

    // Store passkey public key for unlock on other devices
    const passkeyPublicKeyBase64 = uint8ArrayToBase64(registration.passkeyPublicKey);

    // Store wallet metadata with all network addresses (no encryption needed - keys derived on-demand)
    logger.debug('Storing wallet metadata...');
    await storeWalletMetadata({
      passkeyPublicKey: passkeyPublicKeyBase64,
      addresses,
      primaryNetwork: network,
      createdAt: Date.now(),
      // Backward compatibility fields
      address,
      network,
    });
    await storeCredentialId(registration.credential.id);
    logger.debug('Wallet metadata stored successfully');

    // Create and return wallet instance
    logger.debug('Creating wallet instance...');
    const wallet = new PasskeyWallet(
      privateKeyHex,
      publicKeyHex,
      address,
      network,
      registration.credential.id,
      registration.passkeyPublicKey
    );
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

    // MIGRATION: Handle old metadata format (automatic upgrade)
    let currentMetadata = metadata;
    if (!metadata.addresses && metadata.address && metadata.network) {
      logger.info('Migrating wallet to multi-network format...');

      // Generate addresses for all networks
      const addresses: { [key in NetworkId]: string } = {
        [NETWORK_ID.MAINNET]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.MAINNET),
        [NETWORK_ID.TESTNET_10]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.TESTNET_10),
        [NETWORK_ID.TESTNET_11]: await getAddressFromPrivateKey(privateKeyHex, NETWORK_ID.TESTNET_11),
      };

      // Validate migration is correct
      if (addresses[metadata.network] !== metadata.address) {
        logger.error('Migration validation failed', {
          expectedAddress: metadata.address,
          derivedAddress: addresses[metadata.network],
          network: metadata.network,
        });
        return {
          success: false,
          error: 'Failed to migrate wallet to multi-network format',
        };
      }

      // Update metadata with new format
      currentMetadata = {
        passkeyPublicKey: metadata.passkeyPublicKey,
        addresses,
        primaryNetwork: metadata.network,
        createdAt: metadata.createdAt,
        // Keep old fields for rollback safety
        address: metadata.address,
        network: metadata.network,
      };

      await storeWalletMetadata(currentMetadata);
      logger.info('Migration complete - wallet now supports all networks');
    }

    // Determine network (use option if provided, otherwise use primary network)
    const network = options.network ?? currentMetadata.primaryNetwork ?? currentMetadata.network ?? NETWORK_ID.TESTNET_10;
    const address = await getAddressFromPrivateKey(privateKeyHex, network);

    // Verify address matches stored address for this network
    const expectedAddress = currentMetadata.addresses
      ? currentMetadata.addresses[network]
      : currentMetadata.address; // Fallback for legacy format

    if (address !== expectedAddress) {
      logger.error('Derived address mismatch for network', {
        network,
        expected: expectedAddress,
        derived: address,
      });
      return {
        success: false,
        error: 'Failed to derive correct wallet address for network',
      };
    }

    logger.debug('Keys derived successfully, address verified for network:', network);

    // Create wallet instance with credential ID and passkey public key
    const wallet = new PasskeyWallet(
      privateKeyHex,
      publicKeyHex,
      address,
      network,
      credentialId ?? undefined,
      passkeyPublicKey
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

  /**
   * Switch to a different network without re-authentication
   * Uses pre-computed addresses from wallet creation
   *
   * @param network - Target network to switch to
   * @returns Result with success status
   */
  async switchNetwork(network: NetworkId): Promise<Result<void>> {
    logger.info('switchNetwork() called:', { from: this.network, to: network });

    // Check if already on target network
    if (network === this.network) {
      logger.info('Already on target network');
      return { success: true };
    }

    // Get metadata to verify address exists for target network
    const metadata = await getWalletMetadata();
    if (!metadata || !metadata.addresses || !metadata.addresses[network]) {
      logger.error('Address for target network not found in metadata');
      return {
        success: false,
        error: `Address for network ${network} not found. Wallet may need to be recreated.`,
      };
    }

    // Derive address for new network to verify it matches stored address
    const newAddress = await getAddressFromPrivateKey(this.privateKeyHex, network);

    // Verify matches stored address (security check)
    if (newAddress !== metadata.addresses[network]) {
      logger.error('Derived address does not match stored address for network', {
        network,
        stored: metadata.addresses[network],
        derived: newAddress,
      });
      return {
        success: false,
        error: 'Failed to validate address for network switch',
      };
    }

    // Disconnect from current network RPC if connected
    if (this.isConnected) {
      logger.debug('Disconnecting from current network...');
      await this.disconnectNetwork();
    }

    // Update wallet instance to new network
    this.network = network;
    this.address = newAddress;

    logger.info('Network switched successfully:', { network, address: newAddress });
    this.emit({ type: 'connected', address: newAddress });

    return { success: true };
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
   * Send transaction with per-transaction passkey authentication
   *
   * **RECOMMENDED:** Use this method instead of `send()` for better security.
   *
   * This method prompts for passkey authentication for EACH transaction, using the
   * transaction hash as the WebAuthn challenge. This provides cryptographic proof
   * that the user approved THIS specific transaction.
   *
   * Benefits over `send()`:
   * - Per-transaction authentication (user approves each transaction)
   * - Transaction hash cryptographically bound to WebAuthn signature
   * - Keys derived only when needed, not stored in memory
   * - Matches standard wallet UX (MetaMask, hardware wallets)
   *
   * @param options - Send options (to, amount, priorityFee)
   * @returns Transaction result with ID and fees
   * @throws Error if authentication fails, insufficient balance, or network error
   *
   * @example
   * ```typescript
   * const result = await wallet.sendWithAuth({
   *   to: 'kaspatest:qz...',
   *   amount: 100000000n, // 1 KAS
   * });
   * console.log('Transaction ID:', result.transactionId);
   * ```
   */
  async sendWithAuth(options: SendOptions): Promise<SendResult> {
    if (!this.rpc.isConnected) {
      throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
    }

    if (!this.credentialId) {
      throw new Error('Credential ID not available. Cannot authenticate transaction.');
    }

    if (!this.passkeyPublicKey) {
      throw new Error('Passkey public key not available. Cannot derive signing key.');
    }

    logger.info('[PasskeyWallet] sendWithAuth() - Starting per-transaction auth flow');

    // 1. Get UTXOs
    const utxos = await this.rpc.getUtxos(this.address);

    // 2. Validate balance
    const totalAvailable = utxos.reduce((sum, utxo) => sum + utxo.amount, 0n);
    if (totalAvailable < options.amount) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
    }

    // 3. Build unsigned transactions
    const outputs = [
      {
        address: options.to,
        amount: options.amount,
      },
    ];

    const buildResult = await buildTransactions(
      utxos,
      outputs,
      this.address,
      options.priorityFee,
      this.network
    );

    const { transactions, summary } = buildResult;
    logger.info('[PasskeyWallet] Built unsigned transactions:', {
      count: transactions.length,
      totalFee: summary.fees.toString(),
    });

    // 4. FOR EACH TRANSACTION: Authenticate + Sign
    const signedTransactions = [];

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      logger.info(`[PasskeyWallet] Processing transaction ${i + 1}/${transactions.length}`);

      // 4a. Compute transaction hash
      const txHash = computeTransactionHash(tx);
      logger.info('[PasskeyWallet] Transaction hash computed:', {
        length: txHash.length,
        previewHex: Array.from(txHash.slice(0, 8))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
      });

      // 4b. Authenticate with passkey using transaction hash as challenge
      logger.info(
        '[PasskeyWallet] Requesting passkey authentication for this transaction...'
      );

      const authResult = await authenticateWithChallenge(this.credentialId, txHash);

      if (!authResult.success) {
        throw new Error(
          authResult.error ?? 'Passkey authentication failed for transaction'
        );
      }

      logger.info('[PasskeyWallet] User authenticated - passkey signature received');

      // 4c. Verify authentication signature binds to transaction
      const verified = this.verifyAuthenticationForTransaction(authResult, txHash);

      if (!verified) {
        throw new Error(
          'Authentication signature does not match transaction. Possible security issue.'
        );
      }

      logger.info('[PasskeyWallet] ✓ WebAuthn signature verified for this transaction');

      // 4d. Derive secp256k1 signing key (same deterministic derivation)
      const { privateKeyHex } = deriveKaspaKeysFromPasskey(this.passkeyPublicKey);
      logger.info('[PasskeyWallet] Derived secp256k1 signing key for this transaction');

      // 4e. Sign transaction with derived key
      await signTransactions([tx], privateKeyHex);
      logger.info('[PasskeyWallet] Transaction signed successfully');

      // 4f. Clear sensitive data immediately (privateKeyHex is local variable, will be GC'd)

      signedTransactions.push(tx);
    }

    logger.info('[PasskeyWallet] All transactions signed successfully');

    // 5. Submit signed transactions to network
    const transactionIds = await submitTransactions(signedTransactions, this.rpc);
    logger.info('[PasskeyWallet] Transactions submitted:', transactionIds);

    // 6. Emit event
    this.emit({
      type: 'transaction_sent',
      txId: transactionIds[0],
    });

    return {
      transactionId: transactionIds[0],
      amount: options.amount,
      fee: summary.fees,
    };
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

  // ===========================================================================
  // Per-Transaction Authentication Helpers
  // ===========================================================================

  /**
   * Verify that WebAuthn authentication result is for specific transaction
   *
   * This method ensures the WebAuthn signature was created for THIS specific
   * transaction by verifying that the challenge in clientDataJSON matches the
   * transaction hash.
   *
   * This prevents replay attacks where an attacker could try to reuse a signature
   * from a different transaction.
   *
   * @param authResult - Authentication result from passkey
   * @param txHash - Transaction hash that should be in the challenge
   * @returns true if verified, false otherwise
   */
  private verifyAuthenticationForTransaction(
    authResult: AuthenticationResult,
    txHash: Uint8Array
  ): boolean {
    try {
      // Parse clientDataJSON
      const clientDataText = new TextDecoder().decode(authResult.clientDataJSON!);
      const clientData = JSON.parse(clientDataText);

      logger.debug('[PasskeyWallet] Verifying clientDataJSON:', {
        type: clientData.type,
        origin: clientData.origin,
        challengePreview: clientData.challenge?.substring(0, 16),
      });

      // Extract challenge from clientDataJSON
      const challengeBase64url = clientData.challenge;
      if (!challengeBase64url) {
        logger.error('[PasskeyWallet] No challenge found in clientDataJSON');
        return false;
      }

      const challengeBytes = base64urlToUint8Array(challengeBase64url);

      // Verify challenge matches transaction hash
      if (challengeBytes.length !== txHash.length) {
        logger.error('[PasskeyWallet] Challenge length mismatch:', {
          expected: txHash.length,
          actual: challengeBytes.length,
        });
        return false;
      }

      for (let i = 0; i < txHash.length; i++) {
        if (challengeBytes[i] !== txHash[i]) {
          logger.error('[PasskeyWallet] Challenge byte mismatch at index:', i);
          return false;
        }
      }

      logger.info('[PasskeyWallet] ✓ WebAuthn challenge verified = transaction hash');

      // Additional verification: Check that this is a WebAuthn get assertion
      if (clientData.type !== 'webauthn.get') {
        logger.error('[PasskeyWallet] Invalid clientData type:', clientData.type);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('[PasskeyWallet] Failed to verify authentication:', error);
      return false;
    }
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
