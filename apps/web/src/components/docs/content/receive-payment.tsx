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
        <li>Go to <a href="/create" className="text-neo-cyan hover:underline">Create Payment</a></li>
        <li>Enter YOUR Kaspa address (where you want to receive funds)</li>
        <li>Set the amount you're requesting</li>
        <li>Add a memo for tracking (optional)</li>
        <li>Generate and share the payment link</li>
      </ol>

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

      <div className="space-y-4 not-prose">
        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">1</div>
            <h4 className="font-bold">⏳ Waiting for Payment</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Initial state. KasFlow polls the blockchain every 2 seconds for your address.
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">2</div>
            <h4 className="font-bold">🔄 Confirming</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Payment detected! Transaction is being confirmed by the network (~1-3 seconds).
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
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
        <li>Visit <a href="https://explorer.kaspa.org" target="_blank" rel="noopener noreferrer" className="text-neo-cyan hover:underline">kaspa.org explorer</a></li>
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

      <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>💡 Testnet Resources:</strong>
        </p>
        <ul className="text-sm space-y-1 mt-2">
          <li>• Testnet-10 Faucet: Available on Kaspa Discord</li>
          <li>• Testnet-11 Explorer: <a href="https://tn11.kaspa.stream" target="_blank" rel="noopener noreferrer" className="text-neo-cyan hover:underline">tn11.kaspa.stream</a></li>
        </ul>
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

      <div className="space-y-3">
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>🔒 Verify addresses</strong> - Always double-check the address matches yours</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>🌐 Check network</strong> - Mainnet for real payments, testnet for testing</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>💰 Confirm amount</strong> - Ensure the amount in the link matches your invoice</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>📊 Monitor confirmations</strong> - Wait for "Payment Complete" before fulfilling orders</p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-neo-green/20 to-neo-yellow/20 rounded-xl border-2 border-border not-prose mt-8">
        <p className="text-lg font-bold mb-2">Ready to create your first payment link?</p>
        <p className="text-muted-foreground mb-4">
          Start accepting Kaspa payments in under a minute.
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
