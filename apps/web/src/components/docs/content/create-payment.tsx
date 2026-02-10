import Link from 'next/link';

export function CreatePaymentContent() {
  return (
    <>
      <p className="lead text-xl">
        Learn how to create professional payment links and QR codes to accept Kaspa payments from anyone, anywhere.
      </p>

      <h2>Overview</h2>
      <p>
        Payment links are the easiest way to request payments. Simply create a link with the amount and your address, then share it via text, email, or social media. Your customers can pay by scanning a QR code or clicking the link.
      </p>

      <h2>Creating Your First Payment Link</h2>

      <h3>1. Navigate to Create Payment</h3>
      <p>
        Click <strong>&quot;Create Payment&quot;</strong> in the navigation bar, or visit{' '}
        <a href="/create" className="text-neo-cyan hover:underline">
          kasflow.app/create
        </a>
      </p>

      <h3>2. Enter Recipient Address</h3>
      <p>
        Paste the Kaspa address where you want to receive funds. This should be:
      </p>
      <ul>
        <li>
          <strong>Mainnet:</strong> Starts with <code>kaspa:</code>
        </li>
        <li>
          <strong>Testnet:</strong> Starts with <code>kaspatest:</code>
        </li>
      </ul>

      <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">💡</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Tip:</strong> If you&apos;re connected to a wallet, KasFlow will auto-fill your wallet address and match the network.
        </div>
      </div>

      <h3>3. Set the Amount</h3>
      <p>Enter the payment amount in KAS (Kaspa&apos;s native currency). Examples:</p>
      <ul>
        <li>
          <code>10</code> - 10 KAS
        </li>
        <li>
          <code>0.5</code> - Half a KAS
        </li>
        <li>
          <code>100.25</code> - 100.25 KAS
        </li>
      </ul>

      <h3>4. Add a Memo (Optional)</h3>
      <p>Include a note to help track what this payment is for:</p>
      <ul>
        <li>&quot;Coffee - Order #42&quot;</li>
        <li>&quot;Freelance Invoice - January 2026&quot;</li>
        <li>&quot;Birthday Gift from Sarah&quot;</li>
      </ul>

      <h3>5. Generate Link</h3>
      <p>Click <strong>&quot;Generate Payment Link&quot;</strong> to create your unique payment URL.</p>

      <h2>Sharing Your Payment Link</h2>

      <p>Once generated, you have multiple ways to share your payment link:</p>

      <h3>📋 Copy Link</h3>
      <p>Click the <strong>&quot;Copy Link&quot;</strong> button to copy the full URL. Share via:</p>
      <ul>
        <li>Text message / SMS</li>
        <li>Email</li>
        <li>Social media (Twitter, Discord, Telegram)</li>
        <li>Website payment button</li>
      </ul>

      <h3>📱 QR Code</h3>
      <p>Display the QR code for in-person payments:</p>
      <ul>
        <li>Show on your phone screen</li>
        <li>Print for your physical store</li>
        <li>Include on invoices</li>
      </ul>

      <div className="my-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">⚠️</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Note:</strong> The QR code contains a Kaspa payment URI. Customers need to scan it with a Kaspa wallet app (like Kaspium or Kasware) or use the KasFlow web interface.
        </div>
      </div>

      <h2>Understanding Payment URLs</h2>

      <p>KasFlow payment links look like this:</p>
      <pre className="text-sm"><code>https://kasflow.app/pay/eyJ0byI6Imthc3BhOnFyLi4uIn0</code></pre>

      <p>The URL encodes:</p>
      <ul>
        <li>Recipient address</li>
        <li>Payment amount</li>
        <li>Network (mainnet/testnet)</li>
        <li>Optional memo</li>
      </ul>

      <p>
        <strong>Everything is client-side</strong> - no data is stored on servers. The payment details are encoded directly in the URL.
      </p>

      <h2>Best Practices</h2>

      <h3>✅ Dos</h3>
      <ul>
        <li>Double-check the recipient address before sharing</li>
        <li>Use descriptive memos for easy tracking</li>
        <li>Test with small amounts on testnet first</li>
        <li>Save payment links for recurring invoices</li>
      </ul>

      <h3>❌ Donts</h3>
      <ul>
        <li>Avoid sharing mainnet links when testing</li>
        <li>Avoid reusing payment links for different amounts</li>
        <li>Never accept payments to addresses you don&apos;t control</li>
      </ul>

      <h2>Advanced: Network Selection</h2>

      <p>Choose the right network for your use case:</p>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🌍 Mainnet</h4>
          <p className="text-muted-foreground mb-4">
            Use for real payments with actual value.
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Production payments</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Customer transactions</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Business invoices</li>
          </ul>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🧪 Testnet</h4>
          <p className="text-muted-foreground mb-4">
            Use for testing without risking real funds.
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Development & testing</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Integration testing</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Demo purposes</li>
          </ul>
        </div>
      </div>

      <h2>What Happens Next?</h2>

      <ol>
        <li>Customer opens your payment link</li>
        <li>They see payment details and QR code</li>
        <li>They scan QR with wallet OR pay with KasFlow wallet</li>
        <li>Payment confirms in seconds</li>
        <li>You receive funds at your address</li>
      </ol>

      <div className="my-12 p-8 bg-gradient-to-r from-neo-pink/10 to-neo-yellow/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Need help with sending payments?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Learn how to pay with your KasFlow wallet or external wallet apps.
        </p>
        <Link
          href="/docs/send-payment"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Send Payment Guide →
        </Link>
      </div>
    </>
  );
}
