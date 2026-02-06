/**
 * Transaction building and signing utilities for @kasflow/passkey-wallet
 * Uses @onekeyfe/kaspa-wasm Generator and createTransactions
 */

import {
  createTransactions,
  estimateTransactions,
  PendingTransaction,
  Generator,
  UtxoEntryReference,
  type IGeneratorSettingsObject,
  type IPaymentOutput,
} from '@onekeyfe/kaspa-wasm';

import { DEFAULT_PRIORITY_FEE_SOMPI, ERROR_MESSAGES, type NetworkId } from './constants';
import { createPrivateKey, getNetworkType } from './kaspa';
import { KaspaRpc } from './rpc';
import { ensureWasmInitialized } from './wasm-init';

// =============================================================================
// Types
// =============================================================================

export interface SendOptions {
  /** Destination address */
  to: string;
  /** Amount to send in sompi */
  amount: bigint;
  /** Priority fee in sompi (defaults to DEFAULT_PRIORITY_FEE_SOMPI) */
  priorityFee?: bigint;
}

export interface SendResult {
  /** Transaction ID (hash) */
  transactionId: string;
  /** Amount sent in sompi */
  amount: bigint;
  /** Fee paid in sompi */
  fee: bigint;
}

export interface TransactionEstimate {
  /** Total number of transactions needed (1 for simple sends) */
  transactionCount: number;
  /** Total fees in sompi */
  fees: bigint;
  /** Number of UTXOs being consumed */
  utxoCount: number;
  /** Final amount including fees */
  finalAmount: bigint;
}

// =============================================================================
// Transaction Building
// =============================================================================

/**
 * Build transactions for sending KAS
 * Returns pending transactions ready for signing
 *
 * @param utxos - Array of UTXO entries from the wallet
 * @param outputs - Payment outputs (destination and amount)
 * @param changeAddress - Address to receive change
 * @param priorityFee - Priority fee in sompi
 * @param network - Network identifier
 */
export const buildTransactions = async (
  utxos: UtxoEntryReference[],
  outputs: IPaymentOutput[],
  changeAddress: string,
  priorityFee: bigint = DEFAULT_PRIORITY_FEE_SOMPI,
  network: NetworkId
): Promise<{
  transactions: PendingTransaction[];
  summary: {
    transactionCount: number;
    fees: bigint;
    utxoCount: number;
    finalAmount: bigint | undefined;
  };
}> => {
  await ensureWasmInitialized();

  const settings: IGeneratorSettingsObject = {
    outputs,
    changeAddress,
    priorityFee,
    entries: utxos,
    networkId: getNetworkType(network),
  };

  const result = await createTransactions(settings);

  return {
    transactions: result.transactions,
    summary: {
      transactionCount: result.summary.transactions,
      fees: result.summary.fees,
      utxoCount: result.summary.utxos,
      finalAmount: result.summary.finalAmount,
    },
  };
};

/**
 * Estimate fees for a transaction without building it
 *
 * @param utxos - Array of UTXO entries from the wallet
 * @param outputs - Payment outputs (destination and amount)
 * @param changeAddress - Address to receive change
 * @param priorityFee - Priority fee in sompi
 * @param network - Network identifier
 */
export const estimateFee = async (
  utxos: UtxoEntryReference[],
  outputs: IPaymentOutput[],
  changeAddress: string,
  priorityFee: bigint = DEFAULT_PRIORITY_FEE_SOMPI,
  network: NetworkId
): Promise<TransactionEstimate> => {
  await ensureWasmInitialized();

  const settings: IGeneratorSettingsObject = {
    outputs,
    changeAddress,
    priorityFee,
    entries: utxos,
    networkId: getNetworkType(network),
  };

  const summary = await estimateTransactions(settings);

  return {
    transactionCount: summary.transactions,
    fees: summary.fees,
    utxoCount: summary.utxos,
    finalAmount: summary.finalAmount ?? 0n,
  };
};

/**
 * Sign pending transactions with a private key
 * Uses PendingTransaction.sign() method for proper signature handling
 *
 * @param transactions - Array of pending transactions
 * @param privateKeyHex - Private key as hex string
 * @returns Array of signed transactions (same array, mutated)
 */
export const signTransactions = async (
  transactions: PendingTransaction[],
  privateKeyHex: string
): Promise<PendingTransaction[]> => {
  await ensureWasmInitialized();
  const privateKey = await createPrivateKey(privateKeyHex);

  // PendingTransaction.sign() modifies the transaction in place
  for (const tx of transactions) {
    tx.sign([privateKey]);
  }

  return transactions;
};

/**
 * Submit signed transactions to the network
 *
 * @param transactions - Array of signed pending transactions
 * @param rpc - RPC client instance
 * @returns Array of transaction IDs
 */
export const submitTransactions = async (
  transactions: PendingTransaction[],
  rpc: KaspaRpc
): Promise<string[]> => {
  if (!rpc.client) {
    throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
  }

  const transactionIds: string[] = [];

  for (const tx of transactions) {
    const txId = await tx.submit(rpc.client);
    transactionIds.push(txId);
  }

  return transactionIds;
};

// =============================================================================
// High-Level Send Function
// =============================================================================

/**
 * Complete send flow: build, sign, and submit a transaction
 *
 * @param options - Send options (to, amount, priorityFee)
 * @param utxos - UTXOs to spend from
 * @param changeAddress - Address to receive change
 * @param privateKeyHex - Private key for signing
 * @param rpc - Connected RPC client
 * @param network - Network identifier
 * @returns Send result with transaction ID and details
 */
export const sendTransaction = async (
  options: SendOptions,
  utxos: UtxoEntryReference[],
  changeAddress: string,
  privateKeyHex: string,
  rpc: KaspaRpc,
  network: NetworkId
): Promise<SendResult> => {
  await ensureWasmInitialized();

  const { to, amount, priorityFee = DEFAULT_PRIORITY_FEE_SOMPI } = options;

  // Validate we have a connected RPC
  if (!rpc.isConnected) {
    throw new Error(ERROR_MESSAGES.RPC_NOT_CONNECTED);
  }

  // Build the transaction
  const outputs: IPaymentOutput[] = [{ address: to, amount }];

  const { transactions, summary } = await buildTransactions(
    utxos,
    outputs,
    changeAddress,
    priorityFee,
    network
  );

  if (transactions.length === 0) {
    throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
  }

  // Sign the transactions
  const signedTransactions = await signTransactions(transactions, privateKeyHex);

  // Submit to network
  const transactionIds = await submitTransactions(signedTransactions, rpc);

  // Return the first transaction ID (for simple sends, there's typically only one)
  return {
    transactionId: transactionIds[0],
    amount,
    fee: summary.fees,
  };
};

// =============================================================================
// Generator for Advanced Usage
// =============================================================================

/**
 * Create a transaction generator for streaming transaction generation
 * Useful for complex transactions that may need multiple passes
 *
 * @param settings - Generator settings
 * @returns Generator instance
 */
export const createGenerator = async (settings: IGeneratorSettingsObject): Promise<Generator> => {
  await ensureWasmInitialized();
  return new Generator(settings);
};

// =============================================================================
// Re-exports
// =============================================================================

export { PendingTransaction, Generator } from '@onekeyfe/kaspa-wasm';
export type { IGeneratorSettingsObject, IPaymentOutput };
