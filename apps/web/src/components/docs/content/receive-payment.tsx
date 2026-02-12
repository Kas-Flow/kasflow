import { DocImage } from '../doc-image';

export function ReceivePaymentContent() {
  return (
    <>
      <p className="lead text-xl">
        Learn how to receive Kaspa payments and monitor incoming transactions in real-time.
      </p>

      <h2>How Receiving Works</h2>

      <p>
        When someone pays you through KasFlow, the payment goes directly to your Kaspa address on the blockchain. KasFlow monitors the blockchain and shows you real-time payment status.
      </p>

      <h2>Creating a Receive Link</h2>

      <ol>
        <li>Go to <a href="/create" className="text-primary font-medium hover:underline">Create Payment</a></li>
        <li>Enter YOUR Kaspa address (where you want to receive funds)</li>
        <li>Set the amount you're requesting</li>
        <li>Add a memo for tracking (optional)</li>
        <li>Generate and share the payment link</li>
      </ol>

      <DocImage
        src="/3_create-payment-link.png"
        alt="Payment link created with QR code ready to share"
        caption="Your generated payment link with QR code"
        className="max-w-lg mx-auto"
      />

      <h2>Monitoring Incoming Payments</h2>

      <p>When a customer opens your payment link, they'll see:</p>

      <ul>
        <li>📱 Large QR code for scanning</li>
        <li>💰 Payment amount</li>
        <li>📍 Your recipient address</li>
        <li>🌐 Network (mainnet/testnet)</li>
        <li>📝 Your memo (if provided)</li>
      </ul>

      <h3>Real-Time Status Updates</h3>

      <p>The payment page automatically tracks three stages:</p>

      <DocImage
        src="/4_pay-link.png"
        alt="Payment page showing real-time status updates"
        caption="Real-time payment status tracking on the payment page"
        className="max-w-2xl mx-auto"
      />

      <div className="space-y-4 my-8 not-prose">
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">1</div>
            <h4 className="font-bold">⏳ Waiting for Payment</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Initial state. KasFlow polls the blockchain every 2 seconds for your address.
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">2</div>
            <h4 className="font-bold">🔄 Confirming</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Payment detected! Transaction is being confirmed by the network (~1-3 seconds).
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">3</div>
            <h4 className="font-bold">✅ Payment Complete</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Confirmed! Funds are now in your wallet. Confetti celebration! 🎉
          </p>
        </div>
      </div>

      <h2>Checking Your Balance</h2>

      <p>To verify you received the payment:</p>

      <h3>Option 1: KasFlow Wallet</h3>
      <ol>
        <li>Click your wallet button in the nav bar</li>
        <li>Your balance shows in the dropdown</li>
        <li>Refreshes automatically every few seconds</li>
      </ol>

      <h3>Option 2: External Wallet</h3>
      <ol>
        <li>Open your Kaspa wallet app (Kaspium, Kasware, etc.)</li>
        <li>Your balance updates automatically</li>
      </ol>

      <h3>Option 3: Block Explorer</h3>
      <ol>
        <li>Visit <a href="https://explorer.kaspa.org" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">kaspa.org explorer</a></li>
        <li>Paste your address in the search bar</li>
        <li>See all transactions and current balance</li>
      </ol>

      <h2>Getting Testnet KAS</h2>

      <p>If you're testing on testnet and need test funds:</p>

      <ol>
        <li>Visit a Kaspa testnet faucet</li>
        <li>Enter your testnet address (starts with <code>kaspatest:</code>)</li>
        <li>Complete any verification (captcha, etc.)</li>
        <li>Receive free testnet KAS within seconds</li>
      </ol>

      <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">💡</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Testnet Resources:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Testnet-10 Faucet: Available on Kaspa Discord</li>
            <li>• Testnet-11 Explorer: <a href="https://tn11.kaspa.stream" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">tn11.kaspa.stream</a></li>
          </ul>
        </div>
      </div>

      <h2>Payment Link Best Practices</h2>

      <h3>✅ Do's</h3>
      <ul>
        <li>Share links through secure channels (encrypted messaging, email)</li>
        <li>Include descriptive memos for invoices</li>
        <li>Keep the payment page open to see real-time confirmation</li>
        <li>Test with small amounts on testnet first</li>
      </ul>

      <h3>❌ Don'ts</h3>
      <ul>
        <li>Don't share mainnet payment links publicly if you don't want anyone to pay</li>
        <li>Don't close the payment page immediately - wait for confirmation</li>
        <li>Don't reuse the same link for multiple different payments</li>
      </ul>

      <h2>What Happens to My Funds?</h2>

      <p>
        <strong>Important:</strong> Payments go directly to the address you specified when creating the link. KasFlow doesn't hold your funds.
      </p>

      <ul>
        <li>If you used your KasFlow wallet address → funds appear in your KasFlow wallet</li>
        <li>If you used an external wallet address → funds go to that wallet</li>
        <li>If you used an exchange address → funds go to your exchange account</li>
      </ul>

      <h2>Security Tips</h2>

      <div className="space-y-3 my-6 not-prose">
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="text-sm"><strong>🔒 Verify addresses</strong> - Always double-check the address matches yours</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="text-sm"><strong>🌐 Check network</strong> - Mainnet for real payments, testnet for testing</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="text-sm"><strong>💰 Confirm amount</strong> - Ensure the amount in the link matches your invoice</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="text-sm"><strong>📊 Monitor confirmations</strong> - Wait for "Payment Complete" before fulfilling orders</p>
        </div>
      </div>

      <div className="my-12 p-8 bg-gradient-to-r from-neo-green/10 to-neo-yellow/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Ready to create your first payment link?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Start accepting Kaspa payments in under a minute.
        </p>
        <a
          href="/create"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Create Payment Link →
        </a>
      </div>
    </>
  );
}
