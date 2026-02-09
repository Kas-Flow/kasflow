export function SendPaymentContent() {
  return (
    <>
      <p className="lead text-xl">
        Learn how to send Kaspa payments using your KasFlow passkey wallet or external wallet apps.
      </p>

      <h2>Two Ways to Pay</h2>

      <p>When you open a KasFlow payment link, you have two options:</p>

      <div className="grid md:grid-cols-2 gap-4 not-prose">
        <div className="p-4 bg-card rounded-lg border-2 border-neo-cyan">
          <h4 className="font-bold mb-2">🔐 KasFlow Passkey Wallet</h4>
          <p className="text-sm text-muted-foreground">
            Built-in wallet secured by biometrics. No extensions needed.
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-neo-pink">
          <h4 className="font-bold mb-2">📱 External Wallet App</h4>
          <p className="text-sm text-muted-foreground">
            Scan QR code with Kaspium, Kasware, or any Kaspa wallet.
          </p>
        </div>
      </div>

      <hr />

      <h2>Option 1: Pay with KasFlow Passkey Wallet</h2>

      <h3>First Time Setup</h3>

      <p>If this is your first time using KasFlow, you'll need to create a wallet:</p>

      <ol>
        <li>Click <strong>"Pay with Wallet"</strong> on the payment page</li>
        <li>Select <strong>"Passkey Wallet"</strong> in the authentication modal</li>
        <li>Click <strong>"Create Wallet"</strong></li>
        <li>Your device will prompt for biometric authentication</li>
        <li>Authenticate with Face ID, Touch ID, or device password</li>
        <li>Your wallet is created instantly!</li>
      </ol>

      <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>✅ What just happened?</strong> A cryptographic key was generated and secured by your device's Secure Enclave. Your private key never leaves your device and can only be accessed with your biometric authentication.
        </p>
      </div>

      <h3>Returning Users</h3>

      <p>If you've used KasFlow before:</p>

      <ol>
        <li>Click <strong>"Pay with Wallet"</strong></li>
        <li>Select <strong>"Passkey Wallet"</strong></li>
        <li>Click <strong>"Unlock Wallet"</strong></li>
        <li>Authenticate with your biometric</li>
      </ol>

      <h3>Sending the Payment</h3>

      <p>Once your wallet is unlocked:</p>

      <ol>
        <li>Review the payment details (amount, recipient, network)</li>
        <li>Check your balance to ensure you have enough KAS + fees</li>
        <li>Click <strong>"Send Payment"</strong></li>
        <li>
          <strong>Authenticate again</strong> - This second authentication approves THIS specific
          transaction
        </li>
        <li>Transaction broadcasts to the Kaspa network</li>
        <li>Confirmation appears in seconds!</li>
      </ol>

      <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>💡 Why authenticate twice?</strong> The first authentication unlocks your wallet. The second authentication proves you approve this specific transaction. This two-step process protects you from unauthorized payments.
        </p>
      </div>

      <h3>After Payment</h3>

      <p>Once the transaction is sent, you'll see:</p>

      <ul>
        <li>✅ Transaction ID (click to copy full ID)</li>
        <li>💰 Amount sent</li>
        <li>🌐 Network confirmation</li>
        <li>📊 Transaction fee</li>
        <li>🔗 "View Explorer" button to see on blockchain</li>
        <li>📥 "Download Receipt" button for your records</li>
      </ul>

      <hr />

      <h2>Option 2: Pay with External Wallet</h2>

      <p>If you already use a Kaspa wallet app (Kaspium, Kasware, etc.):</p>

      <h3>Using QR Code</h3>

      <ol>
        <li>Open your Kaspa wallet app on your phone</li>
        <li>Tap "Send" or "Scan"</li>
        <li>Scan the QR code on the KasFlow payment page</li>
        <li>Wallet auto-fills recipient and amount</li>
        <li>Confirm and send</li>
      </ol>

      <h3>Manual Entry</h3>

      <ol>
        <li>Click <strong>"Copy Address"</strong> on the payment page</li>
        <li>Open your wallet app</li>
        <li>Paste the address</li>
        <li>Enter the amount manually</li>
        <li>Send</li>
      </ol>

      <div className="p-4 bg-amber-500/10 border-2 border-amber-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>⚠️ Important:</strong> Make sure your external wallet is on the same network (mainnet or testnet) as the payment link. Check the network badge on the payment page.
        </p>
      </div>

      <hr />

      <h2>Transaction Fees</h2>

      <p>All Kaspa transactions require a small network fee:</p>

      <ul>
        <li>
          <strong>Default fee:</strong> ~0.001 KAS (1,000 sompi)
        </li>
        <li>
          <strong>Fee purpose:</strong> Compensates miners/validators
        </li>
        <li>
          <strong>Speed:</strong> Standard fees confirm in 1-3 seconds
        </li>
      </ul>

      <p>
        KasFlow automatically calculates and includes the optimal fee for fast confirmation.
      </p>

      <hr />

      <h2>Common Questions</h2>

      <h3>What if I don't have enough balance?</h3>
      <p>
        KasFlow will show an error if your balance is insufficient. You'll need to add funds to
        your wallet before sending. See our{' '}
        <a href="/docs/receive-payment" className="text-neo-cyan hover:underline">
          Receive Payment guide
        </a>{' '}
        to learn how to get testnet KAS.
      </p>

      <h3>Can I cancel a payment after sending?</h3>
      <p>
        No. Blockchain transactions are irreversible once confirmed. Always double-check the
        recipient address and amount before authenticating.
      </p>

      <h3>How long does confirmation take?</h3>
      <p>
        Kaspa's BlockDAG technology confirms transactions in 1-3 seconds on average. Much faster
        than Bitcoin (10 minutes) or Ethereum (12-15 seconds).
      </p>

      <h3>What if my payment fails?</h3>
      <p>
        If a payment fails, check:
      </p>
      <ul>
        <li>Sufficient balance (including fees)</li>
        <li>Correct network selection</li>
        <li>Internet connection</li>
        <li>Try refreshing and sending again</li>
      </ul>

      <p>
        Still having issues? Visit our{' '}
        <a href="/docs/troubleshooting" className="text-neo-cyan hover:underline">
          Troubleshooting guide
        </a>.
      </p>

      <div className="p-6 bg-gradient-to-r from-neo-cyan/20 to-neo-purple/20 rounded-xl border-2 border-border not-prose">
        <p className="text-lg font-bold mb-2">Want to understand passkey wallets better?</p>
        <p className="text-muted-foreground mb-4">
          Learn about the security and benefits of biometric authentication.
        </p>
        <a
          href="/docs/passkey-wallet"
          className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
        >
          Passkey Wallet Guide →
        </a>
      </div>
    </>
  );
}
