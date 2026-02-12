import { DocImage } from '../doc-image';

export function QuickstartContent() {
  return (
    <>
      <p className="lead text-xl">
        Get started with KasFlow in under 5 minutes. This guide walks you through creating your first payment link and setting up your passkey wallet.
      </p>

      <div className="my-8 p-6 bg-amber-500/10 border border-amber-500/50 rounded-xl not-prose">
        <p className="font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
          <span className="text-xl">⚠️</span> Before you start
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Make sure you're using a modern browser (Chrome, Safari, Edge, or Firefox) with a device that supports biometric authentication (Face ID, Touch ID, or Windows Hello).
        </p>
      </div>

      <h2>Option 1: Create a Payment Link (For Merchants)</h2>

      <p>
        If you want to <strong>receive payments</strong>, follow these steps to create a shareable payment link:
      </p>

      <h3>Step 1: Navigate to Create Payment</h3>
      <ol>
        <li>Go to <a href="/create" className="text-primary font-medium hover:underline">kasflow.app/create</a></li>
        <li>You'll see a step-by-step wizard to guide you</li>
      </ol>

      <h3>Step 2: Enter Your Kaspa Address</h3>
      <ol>
        <li>Paste your Kaspa address (starts with <code>kaspa:</code> or <code>kaspatest:</code>)</li>
        <li>Select your network (Mainnet for real payments, Testnet for testing)</li>
        <li>Click <strong>Continue</strong></li>
      </ol>

      <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">💡</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Tip:</strong> Don't have a Kaspa address yet? You can create one by following Option 2 below or use any Kaspa wallet app (Kaspium, Kasware, etc.).
        </div>
      </div>

      <h3>Step 3: Set Payment Amount</h3>
      <ol>
        <li>Enter the amount you want to receive in KAS</li>
        <li>Example: <code>10</code> for 10 KAS</li>
        <li>Click <strong>Continue</strong></li>
      </ol>

      <h3>Step 4: Add Optional Memo</h3>
      <ol>
        <li>Add a note like "Coffee Payment" or "Freelance Invoice #123"</li>
        <li>This helps you track what the payment is for</li>
        <li>Click <strong>Continue</strong></li>
      </ol>

      <h3>Step 5: Share Your Payment Link</h3>
      <ol>
        <li>You'll get a unique payment link like <code>kasflow.app/pay/abc123...</code></li>
        <li>Copy the link or scan the QR code</li>
        <li>Share via text, email, or social media</li>
      </ol>

      <DocImage
        src="/3_create-payment-link.png"
        alt="Payment link created with QR code"
        caption="Your generated payment link with shareable QR code"
        className="max-w-lg mx-auto"
      />

      <p>
        <strong>That's it!</strong> When someone pays, you'll see real-time confirmation on the payment page.
      </p>

      <hr className="my-12 border-border" />

      <h2>Option 2: Send a Payment (For Customers)</h2>

      <p>
        If you want to <strong>send payments</strong>, you'll need to set up your KasFlow passkey wallet first:
      </p>

      <h3>Step 1: Open a Payment Link</h3>
      <ol>
        <li>Click on any KasFlow payment link (or visit <a href="/docs/create-payment" className="text-primary font-medium hover:underline">Create Payment</a> to make a test one)</li>
        <li>You'll see the payment details with a QR code</li>
      </ol>

      <h3>Step 2: Click "Pay with Wallet"</h3>
      <ol>
        <li>Look for the <strong>"Pay with Wallet"</strong> button</li>
        <li>Click it to open the wallet authentication modal</li>
      </ol>

      <DocImage
        src="/4_pay-link.png"
        alt="Payment page with QR code and payment status"
        caption="The payment page showing QR code and real-time status"
        className="max-w-2xl mx-auto"
      />

      <h3>Step 3: Create Your Passkey Wallet</h3>
      <ol>
        <li>Select <strong>"Passkey Wallet"</strong> (recommended)</li>
        <li>Click <strong>"Create Wallet"</strong> or <strong>"Unlock Wallet"</strong> if returning</li>
        <li>Your device will prompt for biometric authentication (Face ID, Touch ID, or device password)</li>
        <li>Authenticate to create your wallet</li>
      </ol>

      <DocImage
        src="/2_connet-wallet-modal.png"
        alt="Wallet connection modal showing Passkey and KasWare options"
        caption="Choose Passkey Wallet for biometric authentication"
        className="max-w-md mx-auto"
      />

      <div className="my-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">✅</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>Security Note:</strong> Your wallet is secured by your device's biometric authentication. No seed phrases, no passwords to remember. Your keys never leave your device.
        </div>
      </div>

      <h3>Step 4: Send the Payment</h3>
      <ol>
        <li>After unlocking, the button changes to <strong>"Send Payment"</strong></li>
        <li>Click <strong>"Send Payment"</strong></li>
        <li>Authenticate again to approve this specific transaction</li>
        <li>Your payment will be sent instantly!</li>
      </ol>

      <h3>Step 5: Get Your Receipt</h3>
      <ol>
        <li>A receipt modal appears with transaction details</li>
        <li>Click <strong>"View Explorer"</strong> to see on blockchain</li>
        <li>Click <strong>"Download Receipt"</strong> to save a PDF-style receipt</li>
      </ol>

      <div className="grid md:grid-cols-2 gap-6 not-prose">
        <DocImage
          src="/7_payment-sucess-modal.png"
          alt="Payment successful modal with transaction details"
          caption="Payment confirmation with details"
        />
        <DocImage
          src="/8_reciept.png"
          alt="Payment receipt with QR code"
          caption="Downloadable receipt for your records"
        />
      </div>

      <hr className="my-12 border-border" />

      <h2>Next Steps</h2>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <a
          href="/docs/create-payment"
          className="group p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
        >
          <div className="text-3xl mb-4">🔗</div>
          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Learn More About Payment Links</h4>
          <p className="text-muted-foreground leading-relaxed">
            Advanced features like custom memos and network selection.
          </p>
        </a>

        <a
          href="/docs/passkey-wallet"
          className="group p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
        >
          <div className="text-3xl mb-4">🔐</div>
          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Understanding Passkey Wallets</h4>
          <p className="text-muted-foreground leading-relaxed">
            How passkeys work and why they're more secure.
          </p>
        </a>

        <a
          href="/docs/networks"
          className="group p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
        >
          <div className="text-3xl mb-4">🌐</div>
          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Networks Explained</h4>
          <p className="text-muted-foreground leading-relaxed">
            When to use mainnet vs testnet.
          </p>
        </a>

        <a
          href="/docs/faq"
          className="group p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
        >
          <div className="text-3xl mb-4">❓</div>
          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">FAQ</h4>
          <p className="text-muted-foreground leading-relaxed">
            Common questions and answers.
          </p>
        </a>
      </div>
    </>
  );
}
