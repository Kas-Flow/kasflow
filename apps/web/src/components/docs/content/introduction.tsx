export function IntroductionContent() {
  return (
    <>
      <p className="lead text-xl">
        KasFlow is an open-source payment toolkit that makes accepting and sending Kaspa payments as easy as scanning a QR code. No seed phrases, no complicated wallet files—just your fingerprint and you're ready to go.
      </p>

      <h2>What makes KasFlow different?</h2>

      <h3>⚡ Instant Confirmations</h3>
      <p>
        Powered by Kaspa's BlockDAG technology, payments confirm in seconds, not minutes. Perfect for point-of-sale, e-commerce, and person-to-person transfers.
      </p>

      <h3>🔐 Passkey Wallet</h3>
      <p>
        The first Kaspa wallet secured by passkeys. Use Face ID, Touch ID, or your device password to authenticate—no seed phrases to write down or lose.
      </p>

      <h3>🔗 Simple Payment Links</h3>
      <p>
        Generate shareable payment links and QR codes in seconds. Share via text, email, social media, or display on your website.
      </p>

      <h3>💰 No Backend Required</h3>
      <p>
        Everything runs client-side. No databases, no servers, no API keys. Payment data is encoded directly in URLs—completely decentralized.
      </p>

      <h2>Who is KasFlow for?</h2>

      <ul>
        <li>
          <strong>Merchants & Businesses</strong> - Accept Kaspa payments online or in-person with QR codes
        </li>
        <li>
          <strong>Freelancers & Creators</strong> - Get paid in Kaspa with shareable payment links
        </li>
        <li>
          <strong>Everyday Users</strong> - Send Kaspa to friends and family without complicated wallet apps
        </li>
        <li>
          <strong>Developers</strong> - Build on our open-source passkey wallet SDK
        </li>
      </ul>

      <h2>Key Features</h2>

      <div className="grid md:grid-cols-2 gap-4 not-prose">
        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">✨ Passkey Authentication</h4>
          <p className="text-sm text-muted-foreground">
            WebAuthn-based security with biometric authentication on every transaction
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">📱 Mobile-First Design</h4>
          <p className="text-sm text-muted-foreground">
            Fully responsive interface optimized for mobile payments
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🌐 Multi-Network Support</h4>
          <p className="text-sm text-muted-foreground">
            Seamlessly switch between mainnet and testnet networks
          </p>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🧾 Transaction Receipts</h4>
          <p className="text-sm text-muted-foreground">
            Download professional receipts with QR codes and explorer links
          </p>
        </div>
      </div>

      <h2>How it works</h2>

      <ol>
        <li>
          <strong>Create Payment Link</strong> - Enter recipient address and amount, get a shareable link
        </li>
        <li>
          <strong>Share Link</strong> - Send via text, email, or display as QR code
        </li>
        <li>
          <strong>Customer Pays</strong> - Scan QR code with Kaspa wallet or pay with built-in passkey wallet
        </li>
        <li>
          <strong>Instant Confirmation</strong> - Payment confirms in seconds, receipt available immediately
        </li>
      </ol>

      <div className="p-6 bg-gradient-to-r from-neo-cyan/20 to-neo-green/20 rounded-xl border-2 border-border not-prose">
        <p className="text-lg font-bold mb-2">Ready to get started?</p>
        <p className="text-muted-foreground mb-4">
          Follow our Quick Start guide to create your first payment in under 5 minutes.
        </p>
        <a
          href="/docs/quickstart"
          className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
        >
          Quick Start Guide →
        </a>
      </div>
    </>
  );
}
