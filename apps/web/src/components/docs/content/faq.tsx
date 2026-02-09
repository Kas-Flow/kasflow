export function FaqContent() {
  return (
    <>
      <p className="lead text-xl">
        Find answers to the most common questions about using KasFlow for instant Kaspa payments.
      </p>

      <div className="space-y-6">
        {/* General */}
        <section>
          <h2 className="text-2xl font-black mb-4">General Questions</h2>

          <div className="space-y-4">
            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What is KasFlow?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                KasFlow is an open-source payment toolkit that makes it easy to send and receive Kaspa (KAS) payments. It features the first passkey-powered Kaspa wallet and instant payment confirmations through QR codes and payment links.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Is KasFlow free to use?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! KasFlow is completely free. You only pay standard Kaspa network fees (~0.001 KAS per transaction). There are no platform fees, subscriptions, or hidden costs.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Do I need to download anything?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No downloads required! KasFlow works entirely in your web browser. Just visit the website and you're ready to create payment links or set up your wallet.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What browsers are supported?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                KasFlow works on all modern browsers that support WebAuthn (passkeys): Chrome 67+, Safari 14+, Firefox 60+, and Edge 18+. For the best experience, use the latest version of your browser.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Can I use KasFlow on mobile?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! KasFlow is fully responsive and works great on mobile browsers. You can create payment links, send payments, and manage your wallet on iPhone, iPad, and Android devices.
              </p>
            </details>
          </div>
        </section>

        {/* Passkey Wallet */}
        <section>
          <h2 className="text-2xl font-black mb-4">Passkey Wallet</h2>

          <div className="space-y-4">
            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What is a passkey wallet?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                A passkey wallet uses your device's biometric authentication (Face ID, Touch ID, or Windows Hello) instead of seed phrases or passwords. Your private keys are secured by your device's Secure Enclave and can only be accessed with your biometric.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Is it secure?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! Passkey wallets use hardware-backed security through your device's Secure Enclave or TPM. Your keys never leave your device and require biometric authentication for every transaction. This is more secure than traditional seed phrase wallets which can be written down, photographed, or phished.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What if I lose my phone?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Your passkeys sync across your devices via iCloud Keychain (Apple) or Google Password Manager (Android). Simply sign in on a new device with your Apple ID or Google account, and your wallet will be accessible. No seed phrase backup needed!
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Can someone access my wallet if they steal my device?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No. Even with physical access, an attacker would need YOUR biometric (fingerprint or face) to unlock the wallet. Passkeys cannot be extracted, copied, or used without biometric authentication.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Why do I need to authenticate twice when sending?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                The first authentication unlocks your wallet. The second authentication approves the specific transaction you're about to send. This per-transaction approval protects you from unauthorized spending even if your device is momentarily unlocked.
              </p>
            </details>
          </div>
        </section>

        {/* Payments */}
        <section>
          <h2 className="text-2xl font-black mb-4">Payments</h2>

          <div className="space-y-4">
            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">How do payment links work?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Payment links encode the recipient address, amount, network, and optional memo directly in the URL. When someone opens the link, they see the payment details and can pay instantly. No backend server or database is involved - everything is client-side.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">How fast are payments?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Kaspa's BlockDAG technology enables confirmations in 1-3 seconds on average. That's 200-600x faster than Bitcoin and 4-15x faster than Ethereum. Perfect for point-of-sale and instant payments!
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What are the transaction fees?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Kaspa network fees are typically ~0.001 KAS per transaction. KasFlow automatically includes the optimal fee for fast confirmation. There are no additional platform fees.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Can I cancel a payment after sending?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No. Blockchain transactions are irreversible once confirmed. Always double-check the recipient address and amount before approving a payment.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">How do I get a receipt?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                After sending a payment, a receipt modal appears automatically. Click "Download Receipt" to save a professional PDF-style receipt with transaction details, QR code, and explorer link.
              </p>
            </details>
          </div>
        </section>

        {/* Networks */}
        <section>
          <h2 className="text-2xl font-black mb-4">Networks</h2>

          <div className="space-y-4">
            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">What's the difference between mainnet and testnet?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Mainnet uses real KAS tokens with actual monetary value - use it for production payments. Testnet uses worthless test tokens - use it for development, testing, and learning. Never send mainnet KAS to testnet addresses or vice versa.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">How do I get testnet KAS?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Join the Kaspa Discord server and use the faucet bot in the #testnet channel. Paste your testnet address (starts with kaspatest:) and receive free testnet KAS instantly. See our <a href="/docs/networks" className="text-neo-cyan hover:underline">Networks guide</a> for details.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Can I switch networks?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! If using a KasFlow wallet, click your wallet button and select a different network from the dropdown. Your wallet has separate addresses and balances for each network.
              </p>
            </details>
          </div>
        </section>

        {/* Technical */}
        <section>
          <h2 className="text-2xl font-black mb-4">Technical</h2>

          <div className="space-y-4">
            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Is KasFlow open source?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! KasFlow is fully open source. The code is available on GitHub for transparency, security audits, and community contributions.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Does KasFlow store my private keys?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No. Your private keys never leave your device. KasFlow is a client-side application - all cryptographic operations happen in your browser. We cannot access your keys or funds.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Does KasFlow store payment data?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                No. Payment data is encoded directly in URLs. There is no backend database. This makes KasFlow completely decentralized and privacy-preserving.
              </p>
            </details>

            <details className="p-4 bg-card rounded-lg border-2 border-border">
              <summary className="font-bold cursor-pointer">Can I integrate KasFlow into my app?</summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes! The @kasflow/passkey-wallet SDK is available as an npm package. It provides a complete Kaspa wallet with passkey authentication that you can integrate into any web application. Documentation coming soon!
              </p>
            </details>
          </div>
        </section>
      </div>

      <div className="p-6 bg-gradient-to-r from-neo-pink/20 to-neo-purple/20 rounded-xl border-2 border-border not-prose mt-8">
        <p className="text-lg font-bold mb-2">Still have questions?</p>
        <p className="text-muted-foreground mb-4">
          Check our troubleshooting guide or open an issue on GitHub.
        </p>
        <div className="flex gap-3">
          <a
            href="/docs/troubleshooting"
            className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
          >
            Troubleshooting →
          </a>
          <a
            href="https://github.com/yourusername/kasflow/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-card font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
          >
            GitHub Issues →
          </a>
        </div>
      </div>
    </>
  );
}
