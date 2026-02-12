import { DocImage } from '../doc-image';

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

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">✨ Passkey Authentication</h4>
          <p className="text-muted-foreground leading-relaxed">
            WebAuthn-based security with biometric authentication on every transaction.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">📱 Mobile-First Design</h4>
          <p className="text-muted-foreground leading-relaxed">
            Fully responsive interface optimized for mobile payments.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🌐 Multi-Network Support</h4>
          <p className="text-muted-foreground leading-relaxed">
            Seamlessly switch between mainnet and testnet networks.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🧾 Transaction Receipts</h4>
          <p className="text-muted-foreground leading-relaxed">
            Download professional receipts with QR codes and explorer links.
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

      <DocImage
        src="/1_connect-wallet.jpg"
        alt="KasFlow homepage with Connect Wallet button highlighted"
        caption="Get started by connecting your wallet from the homepage"
      />

      <div className="my-12 p-8 bg-gradient-to-r from-neo-cyan/10 to-neo-green/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Follow our Quick Start guide to create your first payment in under 5 minutes.
        </p>
        <a
          href="/docs/quickstart"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Quick Start Guide →
        </a>
      </div>
    </>
  );
}
