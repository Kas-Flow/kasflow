#!/usr/bin/env node
/**
 * Comprehensive SDK verification script
 * Tests all major functionality before frontend integration
 */

import {
  // Key generation & management
  generatePrivateKey,
  createPrivateKey,
  getPublicKeyHex,
  getAddressFromPrivateKey,
  isValidPrivateKey,

  // Address utilities
  isValidAddress,
  parseAddress,
  getNetworkFromAddress,

  // Unit conversion
  kasStringToSompi,
  sompiToKasString,
  sompiToKas,
  kasToSompi,
  formatKas,

  // Network
  NETWORK_ID,
  getNetworkType,

  // RPC
  KaspaRpc,

  // Transaction
  buildTransactions,
  signTransactions,

  // Message signing
  signMessageWithKey,
} from '../dist/index.mjs';

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  @kasflow/passkey-wallet - SDK Verification');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

// ============================================================================
// Key Generation Tests
// ============================================================================
console.log('📦 Key Generation');
console.log('');

test('generatePrivateKey() returns 64-char hex', () => {
  const pk = generatePrivateKey();
  if (pk.length !== 64) throw new Error(`Expected 64 chars, got ${pk.length}`);
  if (!/^[a-f0-9]+$/.test(pk)) throw new Error('Not valid hex');
});

test('createPrivateKey() creates PrivateKey instance', () => {
  const pk = generatePrivateKey();
  const instance = createPrivateKey(pk);
  if (!instance) throw new Error('Failed to create instance');
});

test('getPublicKeyHex() derives public key', () => {
  const pk = generatePrivateKey();
  const pubKey = getPublicKeyHex(pk);
  if (!pubKey || pubKey.length < 60) throw new Error('Invalid public key');
});

test('getAddressFromPrivateKey() generates valid address', () => {
  const pk = generatePrivateKey();
  const address = getAddressFromPrivateKey(pk, NETWORK_ID.TESTNET_10);
  if (!address.startsWith('kaspatest:')) throw new Error('Wrong prefix');
  if (!isValidAddress(address)) throw new Error('Invalid address');
});

test('isValidPrivateKey() validates keys', () => {
  const pk = generatePrivateKey();
  if (!isValidPrivateKey(pk)) throw new Error('Should be valid');
  if (isValidPrivateKey('invalid')) throw new Error('Should be invalid');
});

console.log('');

// ============================================================================
// Address Tests
// ============================================================================
console.log('📍 Address Utilities');
console.log('');

const testAddress = 'kaspatest:qzlemqqh6vraf66mzh5g3vtw8neepvm3xsl4ltg9efltc20zrkfsqtas9cml9';

test('isValidAddress() validates addresses', () => {
  if (!isValidAddress(testAddress)) throw new Error('Should be valid');
  if (isValidAddress('invalid')) throw new Error('Should be invalid');
});

test('parseAddress() extracts components', () => {
  const parsed = parseAddress(testAddress);
  if (!parsed.prefix) throw new Error('Missing prefix');
  if (!parsed.payload) throw new Error('Missing payload');
});

test('getNetworkFromAddress() detects network', () => {
  const network = getNetworkFromAddress(testAddress);
  if (network !== NETWORK_ID.TESTNET_11 && network !== NETWORK_ID.TESTNET_10) {
    throw new Error(`Wrong network: ${network}`);
  }
});

console.log('');

// ============================================================================
// Unit Conversion Tests
// ============================================================================
console.log('💰 Unit Conversion');
console.log('');

test('kasStringToSompi() converts correctly', () => {
  const sompi = kasStringToSompi('1.5');
  if (sompi !== 150000000n) throw new Error(`Expected 150000000n, got ${sompi}`);
});

test('sompiToKasString() converts correctly', () => {
  const kas = sompiToKasString(150000000n);
  if (kas !== '1.5') throw new Error(`Expected "1.5", got "${kas}"`);
});

test('sompiToKas() returns number', () => {
  const kas = sompiToKas(100000000n);
  if (kas !== 1) throw new Error(`Expected 1, got ${kas}`);
});

test('kasToSompi() converts correctly', () => {
  const sompi = kasToSompi(2.5);
  if (sompi !== 250000000n) throw new Error(`Expected 250000000n, got ${sompi}`);
});

test('formatKas() formats for display', () => {
  const formatted = formatKas(123456789n);
  if (!formatted.includes('1.23')) throw new Error(`Unexpected format: ${formatted}`);
});

console.log('');

// ============================================================================
// Message Signing Tests
// ============================================================================
console.log('✍️  Message Signing');
console.log('');

test('signMessageWithKey() returns signature', () => {
  const pk = generatePrivateKey();
  const sig = signMessageWithKey('Hello Kaspa!', pk);
  if (!sig || sig.length < 100) throw new Error('Invalid signature');
});

console.log('');

// ============================================================================
// Network Tests
// ============================================================================
console.log('🌐 Network');
console.log('');

test('getNetworkType() returns correct strings', () => {
  if (getNetworkType(NETWORK_ID.MAINNET) !== 'mainnet') throw new Error('Wrong mainnet');
  if (getNetworkType(NETWORK_ID.TESTNET_10) !== 'testnet-10') throw new Error('Wrong testnet-10');
  if (getNetworkType(NETWORK_ID.TESTNET_11) !== 'testnet-11') throw new Error('Wrong testnet-11');
});

await testAsync('KaspaRpc connects to testnet-10', async () => {
  const rpc = new KaspaRpc();
  await rpc.connect({ network: NETWORK_ID.TESTNET_10, timeout: 30000 });

  const info = await rpc.getNetworkInfo();
  if (info.network !== 'testnet-10') throw new Error(`Wrong network: ${info.network}`);

  await rpc.disconnect();
});

await testAsync('KaspaRpc.getBalance() works', async () => {
  const rpc = new KaspaRpc();
  await rpc.connect({ network: NETWORK_ID.TESTNET_10, timeout: 30000 });

  const balance = await rpc.getBalance(testAddress);
  if (typeof balance.available !== 'bigint') throw new Error('Balance should be bigint');

  await rpc.disconnect();
});

console.log('');

// ============================================================================
// Transaction Tests
// ============================================================================
console.log('📤 Transactions');
console.log('');

await testAsync('buildTransactions() creates pending transactions', async () => {
  const rpc = new KaspaRpc();
  await rpc.connect({ network: NETWORK_ID.TESTNET_10, timeout: 30000 });

  const utxos = await rpc.getUtxos(testAddress);
  if (utxos.length === 0) {
    console.log('     (Skipped - no UTXOs)');
    passed--; // Don't count as passed
    await rpc.disconnect();
    return;
  }

  const { transactions, summary } = await buildTransactions(
    utxos,
    [{ address: testAddress, amount: 10000000n }],
    testAddress,
    100000n,
    NETWORK_ID.TESTNET_10
  );

  if (transactions.length === 0) throw new Error('No transactions built');
  if (summary.fees <= 0n) throw new Error('Invalid fees');

  await rpc.disconnect();
});

await testAsync('signTransactions() signs correctly', async () => {
  const rpc = new KaspaRpc();
  await rpc.connect({ network: NETWORK_ID.TESTNET_10, timeout: 30000 });

  const testPk = 'faf4e1865fe7f0daebf852856d66560b9bd2294acd4ea7e562b709c051f90f1c';
  const utxos = await rpc.getUtxos(testAddress);

  if (utxos.length === 0) {
    console.log('     (Skipped - no UTXOs)');
    passed--;
    await rpc.disconnect();
    return;
  }

  const { transactions } = await buildTransactions(
    utxos,
    [{ address: testAddress, amount: 10000000n }],
    testAddress,
    100000n,
    NETWORK_ID.TESTNET_10
  );

  const signed = signTransactions(transactions, testPk);
  if (signed.length === 0) throw new Error('No signed transactions');

  await rpc.disconnect();
});

console.log('');

// ============================================================================
// Summary
// ============================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

if (failed > 0) {
  console.log('❌ SDK verification FAILED');
  process.exit(1);
} else {
  console.log('✅ SDK verification PASSED - Ready for frontend!');
  console.log('');
}
