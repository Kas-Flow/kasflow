export function NetworksContent() {
  return (
    <>
      <p className="lead text-xl">
        Understand the difference between Kaspa's mainnet and testnet, and when to use each network.
      </p>

      <h2>What are Networks?</h2>

      <p>
        Kaspa has multiple networks that run in parallel. Each network is a separate blockchain with its own transactions, addresses, and tokens. The main networks you'll interact with in KasFlow are:
      </p>

      <div className="grid md:grid-cols-2 gap-6 not-prose">
        <div className="p-6 bg-card rounded-xl border-4 border-neo-cyan shadow-[6px_6px_0px_0px_var(--shadow-color)]">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="text-xl font-black mb-2">Mainnet</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The production network with real KAS tokens that have real value.
          </p>
          <div className="space-y-1 text-sm">
            <p><strong>Address prefix:</strong> <code>kaspa:</code></p>
            <p><strong>Explorer:</strong> <a href="https://kaspa.stream" target="_blank" rel="noopener noreferrer" className="text-neo-cyan hover:underline">kaspa.stream</a></p>
            <p><strong>Use for:</strong> Real payments, production apps</p>
          </div>
        </div>

        <div className="p-6 bg-card rounded-xl border-4 border-neo-yellow shadow-[6px_6px_0px_0px_var(--shadow-color)]">
          <div className="text-4xl mb-3">🧪</div>
          <h3 className="text-xl font-black mb-2">Testnet</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Testing networks with free test tokens that have no real value.
          </p>
          <div className="space-y-1 text-sm">
            <p><strong>Address prefix:</strong> <code>kaspatest:</code></p>
            <p><strong>Networks:</strong> Testnet-10, Testnet-11</p>
            <p><strong>Use for:</strong> Development, testing, learning</p>
          </div>
        </div>
      </div>

      <h2>When to Use Each Network</h2>

      <h3>✅ Use Mainnet When:</h3>
      <ul>
        <li>Accepting real payments from customers</li>
        <li>Sending actual KAS with monetary value</li>
        <li>Running a production application or service</li>
        <li>Creating invoices for goods/services</li>
      </ul>

      <h3>🧪 Use Testnet When:</h3>
      <ul>
        <li>Learning how KasFlow works (recommended for beginners)</li>
        <li>Testing your payment integration</li>
        <li>Developing applications</li>
        <li>Experimenting with features</li>
        <li>Creating demos or tutorials</li>
      </ul>

      <div className="p-4 bg-amber-500/10 border-2 border-amber-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>⚠️ Important:</strong> Testnet tokens have NO real value and cannot be converted to mainnet KAS. Never send mainnet KAS to a testnet address or vice versa - they are incompatible.
        </p>
      </div>

      <h2>Network Differences</h2>

      <table className="w-full text-sm border-2 border-border not-prose">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left border-b-2 border-border">Feature</th>
            <th className="p-3 text-left border-b-2 border-border">Mainnet</th>
            <th className="p-3 text-left border-b-2 border-border">Testnet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Token Value</td>
            <td className="p-3 border-b border-border">Real (tradeable)</td>
            <td className="p-3 border-b border-border">None (free)</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Address Prefix</td>
            <td className="p-3 border-b border-border"><code>kaspa:</code></td>
            <td className="p-3 border-b border-border"><code>kaspatest:</code></td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Get Funds</td>
            <td className="p-3 border-b border-border">Buy on exchanges</td>
            <td className="p-3 border-b border-border">Free faucets</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Stability</td>
            <td className="p-3 border-b border-border">Stable</td>
            <td className="p-3 border-b border-border">May reset</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Use Case</td>
            <td className="p-3 border-b border-border">Production</td>
            <td className="p-3 border-b border-border">Development</td>
          </tr>
        </tbody>
      </table>

      <h2>Switching Networks in KasFlow</h2>

      <h3>When Creating Payment Links</h3>
      <ol>
        <li>Go to <a href="/create" className="text-neo-cyan hover:underline">Create Payment</a></li>
        <li>If NOT connected to a wallet, you'll see a network selector</li>
        <li>Choose between Mainnet, Testnet-10, or Testnet-11</li>
        <li>Your payment link will use that network</li>
      </ol>

      <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>💡 Tip:</strong> If you're connected to a wallet, KasFlow automatically uses your wallet's network. Disconnect to manually choose a different network.
        </p>
      </div>

      <h3>With Your Wallet</h3>
      <ol>
        <li>Click your wallet button in the navbar</li>
        <li>Click the network dropdown (shows current network)</li>
        <li>Select a different network</li>
        <li>Your wallet switches instantly</li>
      </ol>

      <p>
        <strong>Note:</strong> Your wallet has different addresses for each network. Funds on one network don't affect the other.
      </p>

      <h2>Getting Testnet Funds</h2>

      <p>To get free testnet KAS for testing:</p>

      <ol>
        <li>Create or unlock your KasFlow wallet on testnet</li>
        <li>Copy your testnet address (starts with <code>kaspatest:</code>)</li>
        <li>Visit a Kaspa testnet faucet:
          <ul className="list-none pl-4 mt-2">
            <li>• Join <a href="https://discord.gg/kaspa" target="_blank" rel="noopener noreferrer" className="text-neo-cyan hover:underline">Kaspa Discord</a></li>
            <li>• Use the faucet bot in #testnet channel</li>
          </ul>
        </li>
        <li>Paste your address and request testnet KAS</li>
        <li>Receive testnet funds in seconds!</li>
      </ol>

      <h2>Common Mistakes to Avoid</h2>

      <div className="space-y-3 not-prose">
        <div className="p-3 bg-red-500/10 border-2 border-red-500 rounded-lg">
          <p className="text-sm"><strong>❌ Wrong:</strong> Sending mainnet KAS to a testnet address</p>
          <p className="text-xs text-muted-foreground mt-1">Result: Funds lost permanently</p>
        </div>

        <div className="p-3 bg-red-500/10 border-2 border-red-500 rounded-lg">
          <p className="text-sm"><strong>❌ Wrong:</strong> Sharing a testnet payment link when you want real payment</p>
          <p className="text-xs text-muted-foreground mt-1">Result: Customer pays with worthless testnet tokens</p>
        </div>

        <div className="p-3 bg-red-500/10 border-2 border-red-500 rounded-lg">
          <p className="text-sm"><strong>❌ Wrong:</strong> Testing on mainnet with real funds</p>
          <p className="text-xs text-muted-foreground mt-1">Result: Wasted money on failed test transactions</p>
        </div>
      </div>

      <h2>Best Practices</h2>

      <ul>
        <li>
          <strong>Always test on testnet first</strong> - Verify your integration works before using mainnet
        </li>
        <li>
          <strong>Check the network badge</strong> - KasFlow shows the network prominently on all pages
        </li>
        <li>
          <strong>Use testnet for demos</strong> - Don't risk real funds when showing features
        </li>
        <li>
          <strong>Double-check addresses</strong> - Mainnet addresses start with <code>kaspa:</code>, testnet with <code>kaspatest:</code>
        </li>
        <li>
          <strong>Keep networks separate</strong> - Use different browser profiles or devices for mainnet vs testnet if needed
        </li>
      </ul>

      <div className="p-6 bg-gradient-to-r from-neo-yellow/20 to-neo-green/20 rounded-xl border-2 border-border not-prose mt-8">
        <p className="text-lg font-bold mb-2">Ready to start testing?</p>
        <p className="text-muted-foreground mb-4">
          Create your first testnet payment link with free testnet KAS.
        </p>
        <a
          href="/create"
          className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
        >
          Create Payment Link →
        </a>
      </div>
    </>
  );
}
