import Link from 'next/link';

export function SdkPasskeyWalletContent() {
  return (
    <>
      <p className="lead text-xl">
        Build Kaspa applications with passkey-powered wallets. No seed phrases, no passwords - just biometrics.
      </p>

      <div className="my-6 p-4 bg-card border border-border rounded-lg not-prose flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <span className="font-semibold">@kasflow/passkey-wallet</span>
          <span className="text-muted-foreground ml-2">on npm</span>
        </div>
        <a
          href="https://www.npmjs.com/package/@kasflow/passkey-wallet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          View on npm
        </a>
      </div>

      <h2>Installation</h2>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code>npm install @kasflow/passkey-wallet</code></pre>

      <h2>Quick Start</h2>

      <h3>Create a Wallet</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{`import { PasskeyWallet } from '@kasflow/passkey-wallet';

// Check if browser supports passkeys
if (!PasskeyWallet.isSupported()) {
  console.log('Passkeys not supported');
}

// Create a new wallet (triggers biometric prompt)
const result = await PasskeyWallet.create({
  name: 'My Wallet',
  network: 'mainnet'
});

if (result.success) {
  const wallet = result.data;
  console.log('Address:', wallet.getAddress());
}`}</code></pre>

      <h3>Unlock Existing Wallet</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{`// Check if wallet exists
const exists = await PasskeyWallet.exists();

if (exists) {
  const result = await PasskeyWallet.unlock({ network: 'mainnet' });
  if (result.success) {
    const wallet = result.data;
    console.log('Welcome back!', wallet.getAddress());
  }
}`}</code></pre>

      <h2>Sending Transactions</h2>

      <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">i</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Recommended:</strong> Use <code>sendWithAuth()</code> for per-transaction biometric confirmation - similar to hardware wallet security.
        </div>
      </div>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{`import { kasToSompi } from '@kasflow/passkey-wallet';

// Connect to network first
await wallet.connect({ network: 'mainnet' });

// Send with biometric confirmation (recommended)
const result = await wallet.sendWithAuth({
  to: 'kaspa:qr...',
  amount: kasToSompi(1.5), // 1.5 KAS
});

console.log('Transaction ID:', result.transactionId);
console.log('Fee paid:', result.fee);`}</code></pre>

      <h2>Balance and Network</h2>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{`// Get balance
const balance = await wallet.getBalance();
console.log('Available:', balance.available); // in sompi
console.log('Pending:', balance.pending);

// Switch network
await wallet.switchNetwork('testnet-10');
console.log('New address:', wallet.getAddress());`}</code></pre>

      <h2>Utility Functions</h2>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{`import {
  kasToSompi,
  sompiToKas,
  isValidAddress,
  formatKas,
  SOMPI_PER_KAS,
} from '@kasflow/passkey-wallet';

// Unit conversion
const sompi = kasToSompi(1.5);        // 150000000n
const kas = sompiToKas(150000000n);   // 1.5

// Address validation
if (isValidAddress('kaspa:qr...')) {
  console.log('Valid address');
}

// Format for display
const display = formatKas(150000000n); // "1.5"`}</code></pre>

      <h2>API Reference</h2>

      <h3>Static Methods</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Method</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4"><code>PasskeyWallet.isSupported()</code></td>
              <td className="py-2 px-4">Check WebAuthn support</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>PasskeyWallet.exists()</code></td>
              <td className="py-2 px-4">Check if wallet exists in storage</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>PasskeyWallet.create(options)</code></td>
              <td className="py-2 px-4">Create new passkey wallet</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>PasskeyWallet.unlock(options)</code></td>
              <td className="py-2 px-4">Unlock existing wallet</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>PasskeyWallet.delete()</code></td>
              <td className="py-2 px-4">Delete wallet from storage</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Instance Methods</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Method</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.getAddress()</code></td>
              <td className="py-2 px-4">Get Kaspa address</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.connect(options)</code></td>
              <td className="py-2 px-4">Connect to network RPC</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.getBalance()</code></td>
              <td className="py-2 px-4">Get wallet balance</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.sendWithAuth(options)</code></td>
              <td className="py-2 px-4">Send with biometric confirmation</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.send(options)</code></td>
              <td className="py-2 px-4">Send without extra confirmation</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.signMessage(message)</code></td>
              <td className="py-2 px-4">Sign arbitrary message</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.switchNetwork(network)</code></td>
              <td className="py-2 px-4">Switch between networks</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code>wallet.disconnect()</code></td>
              <td className="py-2 px-4">Disconnect and clear keys</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Networks</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Network</th>
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">Address Prefix</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Mainnet</td>
              <td className="py-2 px-4"><code>mainnet</code></td>
              <td className="py-2 px-4"><code>kaspa:</code></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Testnet 10</td>
              <td className="py-2 px-4"><code>testnet-10</code></td>
              <td className="py-2 px-4"><code>kaspatest:</code></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Testnet 11</td>
              <td className="py-2 px-4"><code>testnet-11</code></td>
              <td className="py-2 px-4"><code>kaspatest:</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Browser Requirements</h2>
      <ul>
        <li>WebAuthn support (Chrome 67+, Firefox 60+, Safari 13+, Edge 18+)</li>
        <li>Secure context (HTTPS or localhost)</li>
        <li>Platform authenticator (Touch ID, Face ID, Windows Hello)</li>
      </ul>

      <div className="my-12 p-6 md:p-8 bg-gradient-to-r from-neo-cyan/10 to-neo-green/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Need React integration?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Check out the Wallet Connector for pre-built React hooks and components.
        </p>
        <Link
          href="/docs/sdk-wallet-connector"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Wallet Connector SDK
        </Link>
      </div>
    </>
  );
}
