export function PasskeyWalletContent() {
  return (
    <>
      <p className="lead text-xl">
        Discover how KasFlow's passkey wallet uses biometric authentication to secure your Kaspa without seed phrases or passwords.
      </p>

      <h2>What is a Passkey Wallet?</h2>

      <p>
        A passkey wallet is a non-custodial cryptocurrency wallet secured by your device's biometric authentication system (Face ID, Touch ID, Windows Hello). Instead of memorizing seed phrases or passwords, you simply use your fingerprint or face to access your funds.
      </p>

      <div className="my-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg not-prose flex gap-3">
        <div className="text-xl">✅</div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong>The Best of Both Worlds:</strong> You get the security of self-custody (you control your keys) with the convenience of biometric authentication (no seed phrases to write down).
        </div>
      </div>

      <h2>How It Works</h2>

      <h3>1. Wallet Creation</h3>
      <ol>
        <li>Click "Create Wallet" in KasFlow</li>
        <li>Your device generates a cryptographic key pair</li>
        <li>The private key is stored in your device's Secure Enclave</li>
        <li>A passkey is created and linked to this private key</li>
        <li>You authenticate with biometric to finalize</li>
      </ol>

      <figure className="my-8">
        <img
          src="/2_connet-wallet-modal.png"
          alt="Wallet connection modal showing Passkey Wallet option"
          className="rounded-xl border border-border shadow-lg w-full max-w-md mx-auto"
        />
        <figcaption className="text-center text-sm text-muted-foreground mt-3">
          Select Passkey Wallet to create or unlock your biometric wallet
        </figcaption>
      </figure>

      <h3>2. Wallet Unlock</h3>
      <ol>
        <li>Click "Unlock Wallet"</li>
        <li>Your device prompts for biometric authentication</li>
        <li>Upon successful auth, your passkey unlocks the private key</li>
        <li>Your wallet is now accessible for transactions</li>
      </ol>

      <h3>3. Transaction Signing</h3>
      <ol>
        <li>You initiate a payment</li>
        <li>Device prompts for biometric again (per-transaction auth)</li>
        <li>Your approval cryptographically signs the transaction</li>
        <li>Transaction broadcasts to blockchain</li>
      </ol>

      <figure className="my-8">
        <img
          src="/6_sign-with-passkey.png"
          alt="Touch ID prompt for transaction signing"
          className="rounded-xl border border-border shadow-lg w-full max-w-lg mx-auto"
        />
        <figcaption className="text-center text-sm text-muted-foreground mt-3">
          Biometric authentication for each transaction
        </figcaption>
      </figure>

      <h2>Why Passkeys are Better</h2>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
            <span className="text-muted-foreground line-through opacity-70">Traditional Wallets</span>
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <span>12-24 word seed phrases to memorize</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <span>Risk of writing down seed insecurely</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <span>Lost seed = lost funds forever</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <span>Password fatigue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <span>Phishing attacks on seeds</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow ring-1 ring-primary/20">
          <h4 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
            <span>Passkey Wallets</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Recommended</span>
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>No seed phrases needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Biometric authentication only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Keys sync across your devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Phishing-resistant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Hardware-backed security</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Security Features</h2>

      <h3>🔒 Secure Enclave Storage</h3>
      <p>
        Your private keys are stored in your device's Secure Enclave (iPhone) or TPM (Windows) - specialized hardware designed to protect cryptographic keys. Even if your device is compromised, attackers cannot extract your keys.
      </p>

      <h3>🔐 Per-Transaction Authentication</h3>
      <p>
        Unlike traditional wallets where unlocking gives full access, KasFlow requires biometric approval for EACH transaction. This prevents unauthorized spending even if your device is momentarily unlocked.
      </p>

      <h3>🌐 Multi-Device Sync</h3>
      <p>
        Your passkeys sync via iCloud Keychain (Apple) or Google Password Manager (Android). Access your wallet on any of your devices without manually backing up seeds.
      </p>

      <h3>🚫 Phishing Protection</h3>
      <p>
        Passkeys are domain-bound. Even if you're tricked into visiting a fake KasFlow site, your passkey won't work there. This makes phishing attacks nearly impossible.
      </p>

      <h2>Supported Devices</h2>

      <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-3">
          <span className="text-2xl">🍎</span>
          <div>
            <div className="font-bold text-sm">iOS/iPadOS</div>
            <div className="text-xs text-muted-foreground">Face ID, Touch ID (iOS 16+)</div>
          </div>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-3">
          <span className="text-2xl">💻</span>
          <div>
            <div className="font-bold text-sm">macOS</div>
            <div className="text-xs text-muted-foreground">Touch ID, Face ID (Ventura+)</div>
          </div>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-3">
          <span className="text-2xl">🪟</span>
          <div>
            <div className="font-bold text-sm">Windows</div>
            <div className="text-xs text-muted-foreground">Windows Hello (fingerprint, face)</div>
          </div>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="font-bold text-sm">Android</div>
            <div className="text-xs text-muted-foreground">Fingerprint, Face Unlock (Android 9+)</div>
          </div>
        </div>
      </div>

      <h2>Common Questions</h2>

      <h3>What if I lose my device?</h3>
      <p>
        Your passkeys sync across your devices via iCloud or Google. Simply sign in on a new device with your Apple ID or Google account, and your passkeys (and wallet) will be available.
      </p>

      <h3>Can someone access my wallet if they steal my phone?</h3>
      <p>
        No. Even with physical access to your device, an attacker would need YOUR biometric (fingerprint/face) to unlock the wallet. Passkeys cannot be extracted or copied.
      </p>

      <h3>What if biometric authentication fails?</h3>
      <p>
        You can use your device password as a fallback. Most devices allow password authentication if biometric fails after several attempts.
      </p>

      <h3>Is this as secure as a hardware wallet?</h3>
      <p>
        Passkey wallets offer excellent security for most users. Hardware wallets provide slightly more security for very large holdings, but passkey wallets are more convenient for everyday transactions.
      </p>

      <h3>Can I export my private key?</h3>
      <p>
        The private key is derived deterministically from your passkey. You can access it through your KasFlow wallet settings, but we recommend keeping it secured by your passkey rather than exporting it.
      </p>

      <h2>Best Practices</h2>

      <ul>
        <li>
          <strong>Enable device backups</strong> - Keep iCloud Keychain or Google Password Manager enabled
        </li>
        <li>
          <strong>Use strong device password</strong> - This is your fallback if biometric fails
        </li>
        <li>
          <strong>Keep devices updated</strong> - Security patches improve passkey protection
        </li>
        <li>
          <strong>Don't share devices</strong> - Anyone with biometric access can use your wallet
        </li>
        <li>
          <strong>Test on testnet first</strong> - Practice with test funds before using real KAS
        </li>
      </ul>

      <div className="my-12 p-8 bg-gradient-to-r from-neo-purple/10 to-neo-pink/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Ready to create your passkey wallet?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Get started in seconds with biometric authentication.
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
