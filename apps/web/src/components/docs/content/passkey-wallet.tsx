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

      <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg not-prose">
        <p className="text-sm">
          <strong>✅ The Best of Both Worlds:</strong> You get the security of self-custody (you control your keys) with the convenience of biometric authentication (no seed phrases to write down).
        </p>
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

      <h2>Why Passkeys are Better</h2>

      <div className="grid md:grid-cols-2 gap-4 not-prose">
        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold text-neo-cyan mb-2">Traditional Wallets</h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>❌ 12-24 word seed phrases to memorize</li>
            <li>❌ Risk of writing down seed insecurely</li>
            <li>❌ Lost seed = lost funds forever</li>
            <li>❌ Password fatigue</li>
            <li>❌ Phishing attacks on seeds</li>
          </ul>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold text-neo-green mb-2">Passkey Wallets</h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>✅ No seed phrases needed</li>
            <li>✅ Biometric authentication only</li>
            <li>✅ Keys sync across your devices</li>
            <li>✅ Phishing-resistant</li>
            <li>✅ Hardware-backed security</li>
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

      <div className="space-y-3 not-prose">
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>🍎 iOS/iPadOS:</strong> Face ID, Touch ID (iOS 16+)</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>💻 macOS:</strong> Touch ID, Face ID (macOS Ventura+)</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>🪟 Windows:</strong> Windows Hello (fingerprint, face, PIN)</p>
        </div>
        <div className="p-3 bg-card rounded-lg border-2 border-border">
          <p className="text-sm"><strong>🤖 Android:</strong> Fingerprint, Face Unlock (Android 9+)</p>
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

      <div className="p-6 bg-gradient-to-r from-neo-purple/20 to-neo-pink/20 rounded-xl border-2 border-border not-prose mt-8">
        <p className="text-lg font-bold mb-2">Ready to create your passkey wallet?</p>
        <p className="text-muted-foreground mb-4">
          Get started in seconds with biometric authentication.
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
