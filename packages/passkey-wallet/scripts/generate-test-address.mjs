#!/usr/bin/env node
/**
 * Generate a test wallet address for funding via faucet
 * Usage: node scripts/generate-test-address.mjs
 */

import { PrivateKey } from 'kaspa-wasm32-sdk';
import crypto from 'crypto';

// Generate a random 32-byte private key
const privateKeyHex = crypto.randomBytes(32).toString('hex');

try {
  // Create PrivateKey and derive address
  const privateKey = new PrivateKey(privateKeyHex);
  const publicKey = privateKey.toPublicKey();
  const address = privateKey.toAddress('testnet-11');

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  TEST WALLET GENERATED (testnet-11)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Private Key (KEEP SECRET):');
  console.log(`  ${privateKeyHex}`);
  console.log('');
  console.log('  Public Key:');
  console.log(`  ${publicKey.toString()}`);
  console.log('');
  console.log('  Address (fund this via faucet):');
  console.log(`  ${address.toString()}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Faucet: https://faucet.kaspatest.net/');
  console.log('');
  console.log('  To use this key in your app:');
  console.log('');
  console.log('  import { createPrivateKey, getAddressFromPrivateKey } from "@kasflow/passkey-wallet";');
  console.log(`  const pk = createPrivateKey("${privateKeyHex}");`);
  console.log('');
} catch (error) {
  console.error('Error:', error.message);
  console.log('');
  console.log('Note: kaspa-wasm32-sdk may need browser environment.');
  console.log('Try running in a browser or use the manual method below:');
  console.log('');
  console.log('Private Key:', privateKeyHex);
  console.log('');
  console.log('To get the address, create a simple HTML file and open in browser.');
}
