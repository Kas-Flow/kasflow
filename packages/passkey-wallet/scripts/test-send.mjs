#!/usr/bin/env node
/**
 * Test script to verify SDK works end-to-end
 * This tests the RPC and transaction logic (not passkeys - those need browser)
 *
 * Usage: node scripts/test-send.mjs
 */

import {
  KaspaRpc,
  getAddressFromPrivateKey,
  sompiToKasString,
  kasStringToSompi,
  buildTransactions,
  createPrivateKey,
  NETWORK_ID
} from '../dist/index.mjs';

// Test wallet funded via faucet
const TEST_PRIVATE_KEY = 'faf4e1865fe7f0daebf852856d66560b9bd2294acd4ea7e562b709c051f90f1c';
const NETWORK = NETWORK_ID.TESTNET_10;

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  @kasflow/passkey-wallet SDK Test');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // 1. Derive address from private key
  const address = getAddressFromPrivateKey(TEST_PRIVATE_KEY, NETWORK);
  console.log('📍 Test Address:', address);
  console.log('');

  // 2. Connect to testnet-10
  console.log('🔌 Connecting to testnet-10...');
  const rpc = new KaspaRpc();

  try {
    await rpc.connect({ network: NETWORK, timeout: 60000 });
    console.log('✅ Connected to Kaspa network!');
    console.log('');

    // 3. Get network info
    const info = await rpc.getNetworkInfo();
    console.log('📊 Network Info:');
    console.log('   Network:', info.network);
    console.log('   Block Count:', info.blockCount.toString());
    console.log('   DAA Score:', info.virtualDaaScore.toString());
    console.log('');

    // 4. Get balance
    const balance = await rpc.getBalance(address);
    console.log('💰 Balance:');
    console.log('   Available:', sompiToKasString(balance.available), 'KAS');
    console.log('   Total:', sompiToKasString(balance.total), 'KAS');
    console.log('');

    // 5. Get UTXOs
    const utxos = await rpc.getUtxos(address);
    console.log('📦 UTXOs:', utxos.length);
    console.log('');

    // 6. If we have balance, send a small test transaction
    if (balance.available > kasStringToSompi('1')) {
      console.log('📤 Sending test transaction (0.1 KAS to self)...');

      const sendAmount = kasStringToSompi('0.1');
      const priorityFee = kasStringToSompi('0.001');

      // Build transaction
      const { transactions, summary } = await buildTransactions(
        utxos,
        [{ address, amount: sendAmount }], // Send to self
        address, // Change address
        priorityFee,
        NETWORK
      );

      console.log('   Transactions built:', transactions.length);
      console.log('   Fee:', sompiToKasString(summary.fees), 'KAS');

      // Sign using PendingTransaction.sign() method
      const privateKey = createPrivateKey(TEST_PRIVATE_KEY);
      for (const tx of transactions) {
        tx.sign([privateKey]);
      }
      console.log('   ✅ Signed');

      // Submit using PendingTransaction.submit()
      console.log('   Submitting to network...');
      for (const tx of transactions) {
        const txId = await tx.submit(rpc.client);
        console.log('');
        console.log('🎉 Transaction submitted!');
        console.log('   TX ID:', txId);
      }
      console.log('');
    } else {
      console.log('⚠️  Balance too low for test transaction');
      console.log('   Please fund via: https://faucet-tn10.kaspanet.io/');
      console.log('');
    }

    // Disconnect
    await rpc.disconnect();
    console.log('✅ Test complete!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await rpc.disconnect();
    process.exit(1);
  }
}

main();
