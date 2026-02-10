export function SecurityContent() {
  return (
    <>
      <p className="lead text-xl">
        Learn how KasFlow protects your funds with hardware-backed security, biometric authentication, and client-side cryptography.
      </p>

      <h2>Security Architecture</h2>

      <p>
        KasFlow is designed with security as the top priority. Here's how we protect your funds:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🔒 Client-Side Only</h4>
          <p className="text-muted-foreground leading-relaxed">
            All cryptographic operations happen in your browser. No keys or sensitive data ever touch our servers.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🔐 Hardware Security</h4>
          <p className="text-muted-foreground leading-relaxed">
            Private keys stored in device Secure Enclave/TPM - impossible to extract even with physical access.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">👆 Biometric Auth</h4>
          <p className="text-muted-foreground leading-relaxed">
            Every transaction requires your fingerprint or face - no password reuse or phishing attacks.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🌐 Domain Binding</h4>
          <p className="text-muted-foreground leading-relaxed">
            Passkeys only work on kasflow.app - fake phishing sites can't steal your credentials.
          </p>
        </div>
      </div>

      <h2>How Your Keys are Protected</h2>

      <h3>1. Key Generation</h3>
      <p>When you create a wallet:</p>
      <ul>
        <li>Your device generates a WebAuthn passkey using hardware RNG</li>
        <li>A Kaspa private key is derived deterministically from the passkey</li>
        <li>The passkey is stored in Secure Enclave/TPM</li>
        <li>The private key is never stored - only derived when needed</li>
      </ul>

      <h3>2. Key Storage</h3>
      <p>What's stored where:</p>

      <div className="space-y-4 my-6 not-prose">
        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="font-bold mb-2">🔐 Secure Enclave (Hardware)</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Passkey private key</li>
            <li>✓ Cannot be extracted</li>
            <li>✓ Requires biometric to use</li>
          </ul>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="font-bold mb-2">💾 IndexedDB (Browser Storage)</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Passkey public key (not sensitive)</li>
            <li>✓ Wallet addresses (public information)</li>
            <li>✓ Credential ID (for faster lookup)</li>
          </ul>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <p className="font-bold mb-2">🧠 Memory (Temporary)</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Kaspa private key (only during transactions)</li>
            <li>✓ Cleared immediately after use</li>
            <li>✓ Never persisted to disk</li>
          </ul>
        </div>
      </div>

      <h3>3. Transaction Signing</h3>
      <p>Every transaction requires:</p>
      <ol>
        <li>Biometric authentication (proves it's you)</li>
        <li>Transaction hash as WebAuthn challenge (proves you approve THIS transaction)</li>
        <li>Private key derived on-demand from passkey</li>
        <li>Transaction signed with secp256k1</li>
        <li>Private key cleared from memory</li>
      </ol>

      <h2>Threat Model & Protection</h2>

      <div className="space-y-3 my-6">
        <details className="p-4 bg-card rounded-lg border border-border shadow-sm" open>
          <summary className="font-bold cursor-pointer">🎣 Phishing Attacks</summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p><strong>Attack:</strong> Fake website tries to steal your credentials</p>
            <p><strong>Protection:</strong> Passkeys are domain-bound. Your passkey will ONLY work on kasflow.app, never on fake sites.</p>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <summary className="font-bold cursor-pointer">📱 Device Theft</summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p><strong>Attack:</strong> Attacker steals your phone/computer</p>
            <p><strong>Protection:</strong> Cannot access wallet without YOUR biometric. Keys cannot be extracted from Secure Enclave.</p>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <summary className="font-bold cursor-pointer">💻 Malware</summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p><strong>Attack:</strong> Malicious software tries to steal keys</p>
            <p><strong>Protection:</strong> Keys in Secure Enclave cannot be accessed by software. Each transaction requires explicit biometric approval.</p>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <summary className="font-bold cursor-pointer">🔓 Session Hijacking</summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p><strong>Attack:</strong> Attacker tries to send unauthorized transactions from your session</p>
            <p><strong>Protection:</strong> Per-transaction authentication required. Even with an active session, attacker needs YOUR biometric.</p>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border border-border shadow-sm">
          <summary className="font-bold cursor-pointer">🌐 Man-in-the-Middle</summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p><strong>Attack:</strong> Attacker intercepts network traffic</p>
            <p><strong>Protection:</strong> HTTPS encryption + WebAuthn challenge-response prevents replay attacks.</p>
          </div>
        </details>
      </div>

      <h2>Privacy Considerations</h2>

      <h3>What KasFlow Knows</h3>
      <ul>
        <li><strong>Nothing.</strong> KasFlow has no backend servers. We don't collect IP addresses, user data, or transaction information.</li>
      </ul>

      <h3>What's Stored Locally</h3>
      <ul>
        <li>Passkey public key (deterministic, not sensitive)</li>
        <li>Wallet addresses (public blockchain information)</li>
        <li>Credential ID (just for faster passkey lookup)</li>
      </ul>

      <h3>What's on the Blockchain</h3>
      <ul>
        <li>All transactions are public (standard blockchain behavior)</li>
        <li>Your addresses are pseudonymous (not linked to identity)</li>
        <li>Transaction amounts and timestamps are public</li>
      </ul>

      <h2>Best Security Practices</h2>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-green-500/10 border border-green-500/50 rounded-xl">
          <h4 className="font-bold text-lg mb-4 text-green-600 dark:text-green-400">✅ Do This</h4>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>• Enable device lock (passcode/pattern)</li>
            <li>• Use strong device password</li>
            <li>• Keep browser updated</li>
            <li>• Enable iCloud Keychain or Google sync</li>
            <li>• Test on testnet first</li>
            <li>• Verify addresses before sending</li>
            <li>• Check network badge (mainnet vs testnet)</li>
          </ul>
        </div>

        <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
          <h4 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400">❌ Avoid This</h4>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>• Don't share your device with untrusted people</li>
            <li>• Don't disable device biometric auth</li>
            <li>• Don't use KasFlow on public/shared computers</li>
            <li>• Don't click suspicious payment links</li>
            <li>• Don't export private keys unnecessarily</li>
            <li>• Don't share screenshots of your wallet</li>
            <li>• Don't ignore browser security warnings</li>
          </ul>
        </div>
      </div>

      <h2>Comparing Security Models</h2>

      <table className="w-full text-sm border border-border rounded-lg overflow-hidden my-6 not-prose">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left border-b-2 border-border">Feature</th>
            <th className="p-3 text-left border-b-2 border-border">Passkey Wallet</th>
            <th className="p-3 text-left border-b-2 border-border">Seed Phrase Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Phishing</td>
            <td className="p-3 border-b border-border text-green-600">✅ Immune</td>
            <td className="p-3 border-b border-border text-red-600">❌ Vulnerable</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Physical Theft</td>
            <td className="p-3 border-b border-border text-green-600">✅ Protected (biometric)</td>
            <td className="p-3 border-b border-border text-red-600">❌ Vulnerable (if seed found)</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Backup</td>
            <td className="p-3 border-b border-border text-green-600">✅ Automatic (cloud sync)</td>
            <td className="p-3 border-b border-border text-yellow-600">⚠️ Manual (user must store)</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">Key Extraction</td>
            <td className="p-3 border-b border-border text-green-600">✅ Impossible</td>
            <td className="p-3 border-b border-border text-red-600">❌ Possible (malware)</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border font-semibold">User Experience</td>
            <td className="p-3 border-b border-border text-green-600">✅ Biometric (easy)</td>
            <td className="p-3 border-b border-border text-yellow-600">⚠️ Type seed (hard)</td>
          </tr>
        </tbody>
      </table>

      <div className="my-12 p-8 bg-gradient-to-r from-neo-cyan/10 to-neo-purple/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Questions about security?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Check our FAQ or review the open-source code on GitHub.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/docs/faq"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            FAQ →
          </a>
          <a
            href="https://github.com/yourusername/kasflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border font-bold rounded-lg hover:bg-muted transition-colors"
          >
            View Source →
          </a>
        </div>
      </div>
    </>
  );
}
