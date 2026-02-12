import { DocImage } from '../doc-image';

export function SendPaymentContent() {
  return (
    <>
      <p className="lead text-xl">
        Learn how to send Kaspa payments using your KasFlow passkey wallet or external wallet apps.
      </p>

      <h2>Two Ways to Pay</h2>

      <p>When you open a KasFlow payment link, you have two options:</p>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🔐 KasFlow Passkey Wallet</h4>
          <p className="text-muted-foreground leading-relaxed">
            Built-in wallet secured by biometrics. No extensions needed.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">📱 External Wallet App</h4>
          <p className="text-muted-foreground leading-relaxed">
            Scan QR code with Kaspium, Kasware, or any Kaspa wallet.
          </p>
        </div>
      </div>

      <DocImage
        src="/4_pay-link.png"
        alt="Payment page with QR code, send button, and payment status"
        caption="The payment page with QR code and wallet connection options"
        className="max-w-2xl mx-auto"
      />

      <hr className="my-12 border-border" />

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

      <DocImage
        src="/2_connet-wallet-modal.png"
        alt="Wallet modal showing Passkey Wallet and KasWare options"
        caption="Select Passkey Wallet for biometric authentication"
        className="max-w-md mx-auto"
      />

      <div className="my-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">✅</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>What just happened?</strong> A cryptographic key was generated and secured by your device's Secure Enclave. Your private key never leaves your device and can only be accessed with your biometric authentication.
        </div>
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
        <li><strong>Authenticate again</strong> - This second authentication approves THIS specific transaction</li>
        <li>Transaction broadcasts to the Kaspa network</li>
        <li>Confirmation appears in seconds!</li>
      </ol>

      <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">💡</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Why authenticate twice?</strong> The first authentication unlocks your wallet. The second authentication proves you approve this specific transaction. This two-step process protects you from unauthorized payments.
        </div>
      </div>

      <DocImage
        src="/6_sign-with-passkey.png"
        alt="Touch ID prompt for transaction signing"
        caption="Authenticate with Touch ID or Face ID to approve the transaction"
        className="max-w-lg mx-auto"
      />

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

      <div className="grid md:grid-cols-2 gap-6 not-prose">
        <DocImage
          src="/7_payment-sucess-modal.png"
          alt="Payment successful modal"
          caption="Payment confirmation with transaction details"
        />
        <DocImage
          src="/8_reciept.png"
          alt="Payment receipt"
          caption="Downloadable receipt for your records"
        />
      </div>

      <hr className="my-12 border-border" />

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

      <DocImage
        src="/5_sign-with-wallet.png"
        alt="KasWare wallet transaction signing popup"
        caption="KasWare browser extension transaction confirmation"
        className="max-w-md mx-auto"
      />

      <h3>Manual Entry</h3>

      <ol>
        <li>Click <strong>"Copy Address"</strong> on the payment page</li>
        <li>Open your wallet app</li>
        <li>Paste the address</li>
        <li>Enter the amount manually</li>
        <li>Send</li>
      </ol>

      <div className="my-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">⚠️</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Important:</strong> Make sure your external wallet is on the same network (mainnet or testnet) as the payment link. Check the network badge on the payment page.
        </div>
      </div>

      <hr className="my-12 border-border" />

      <h2>Transaction Fees</h2>

      <p>All Kaspa transactions require a small network fee:</p>

      <ul>
        <li><strong>Default fee:</strong> ~0.001 KAS (1,000 sompi)</li>
        <li><strong>Fee purpose:</strong> Compensates miners/validators</li>
        <li><strong>Speed:</strong> Standard fees confirm in 1-3 seconds</li>
      </ul>

      <p>KasFlow automatically calculates and includes the optimal fee for fast confirmation.</p>

      <hr className="my-12 border-border" />

      <h2>Common Questions</h2>

      <h3>What if I don't have enough balance?</h3>
      <p>
        KasFlow will show an error if your balance is insufficient. You'll need to add funds to your wallet before sending. See our{' '}
        <a href="/docs/receive-payment" className="text-primary font-medium hover:underline">Receive Payment guide</a>{' '}
        to learn how to get testnet KAS.
      </p>

      <h3>Can I cancel a payment after sending?</h3>
      <p>
        No. Blockchain transactions are irreversible once confirmed. Always double-check the recipient address and amount before authenticating.
      </p>

      <h3>How long does confirmation take?</h3>
      <p>
        Kaspa's BlockDAG technology confirms transactions in 1-3 seconds on average. Much faster than Bitcoin (10 minutes) or Ethereum (12-15 seconds).
      </p>

      <h3>What if my payment fails?</h3>
      <p>If a payment fails, check:</p>
      <ul>
        <li>Sufficient balance (including fees)</li>
        <li>Correct network selection</li>
        <li>Internet connection</li>
        <li>Try refreshing and sending again</li>
      </ul>

      <p>
        Still having issues? Visit our{' '}
        <a href="/docs/troubleshooting" className="text-primary font-medium hover:underline">Troubleshooting guide</a>.
      </p>

      <div className="my-12 p-8 bg-gradient-to-r from-neo-cyan/10 to-neo-purple/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Want to understand passkey wallets better?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Learn about the security and benefits of biometric authentication.
        </p>
        <a
          href="/docs/passkey-wallet"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Passkey Wallet Guide →
        </a>
      </div>
    </>
  );
}
