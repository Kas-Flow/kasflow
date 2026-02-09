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
        Click <strong>"Create Payment"</strong> in the navigation bar, or visit{' '}
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

      <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>💡 Tip:</strong> If you're connected to a wallet, KasFlow will auto-fill your wallet address and match the network.
        </p>
      </div>

      <h3>3. Set the Amount</h3>
      <p>Enter the payment amount in KAS (Kaspa's native currency). Examples:</p>
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
        <li>"Coffee - Order #42"</li>
        <li>"Freelance Invoice - January 2026"</li>
        <li>"Birthday Gift from Sarah"</li>
      </ul>

      <h3>5. Generate Link</h3>
      <p>Click <strong>"Generate Payment Link"</strong> to create your unique payment URL.</p>

      <h2>Sharing Your Payment Link</h2>

      <p>Once generated, you have multiple ways to share your payment link:</p>

      <h3>📋 Copy Link</h3>
      <p>Click the <strong>"Copy Link"</strong> button to copy the full URL. Share via:</p>
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

      <div className="p-4 bg-amber-500/10 border-2 border-amber-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>⚠️ Note:</strong> The QR code contains a Kaspa payment URI. Customers need to scan it with a Kaspa wallet app (like Kaspium or Kasware) or use the KasFlow web interface.
        </p>
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

      <h3>✅ Do's</h3>
      <ul>
        <li>Double-check the recipient address before sharing</li>
        <li>Use descriptive memos for easy tracking</li>
        <li>Test with small amounts on testnet first</li>
        <li>Save payment links for recurring invoices</li>
      </ul>

      <h3>❌ Don'ts</h3>
      <ul>
        <li>Don't share mainnet links when testing</li>
        <li>Don't reuse payment links for different amounts</li>
        <li>Don't accept payments to addresses you don't control</li>
      </ul>

      <h2>Advanced: Network Selection</h2>

      <p>Choose the right network for your use case:</p>

      <div className="grid md:grid-cols-2 gap-4 not-prose">
        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🌍 Mainnet</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Use for real payments with actual value
          </p>
          <ul className="text-sm space-y-1">
            <li>✓ Production payments</li>
            <li>✓ Customer transactions</li>
            <li>✓ Business invoices</li>
          </ul>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🧪 Testnet</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Use for testing without risking real funds
          </p>
          <ul className="text-sm space-y-1">
            <li>✓ Development & testing</li>
            <li>✓ Integration testing</li>
            <li>✓ Demo purposes</li>
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

      <div className="p-6 bg-gradient-to-r from-neo-pink/20 to-neo-yellow/20 rounded-xl border-2 border-border not-prose">
        <p className="text-lg font-bold mb-2">Need help with sending payments?</p>
        <p className="text-muted-foreground mb-4">
          Learn how to pay with your KasFlow wallet or external wallet apps.
        </p>
        <a
          href="/docs/send-payment"
          className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
        >
          Send Payment Guide →
        </a>
      </div>
    </>
  );
}
