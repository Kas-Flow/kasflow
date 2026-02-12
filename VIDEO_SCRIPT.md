# KasFlow - Hackathon Video Script
## "Instant Kaspa Payments with Passkey Wallets"
### Duration: ~6 minutes

---

## INTRO (0:00 - 0:30)

**[Show KasFlow homepage with animated hero]**

> "What if accepting crypto payments was as easy as sharing a link? What if you didn't need seed phrases, complicated wallet files, or a backend server?

> I'm [Your Name], and this is KasFlow - the first passkey-powered payment toolkit for Kaspa."

**[Show tagline: "Accept Kaspa in Milliseconds"]**

---

## THE PROBLEM (0:30 - 1:30)

**[Screen recording: show typical wallet setup flow - writing seed phrases]**

> "Let's talk about what's broken in crypto payments today.

> **Problem 1: Wallet UX is terrible.**
> Every wallet makes you write down 12 or 24 words. Lose them? Your funds are gone forever. This is a massive barrier for mainstream adoption.

> **Problem 2: No easy wallet libraries for Kaspa.**
> If you're a developer building on Kaspa, there's no simple way to add wallet connection to your app. No 'Connect Wallet' button. No React hooks. You're on your own.

> **Problem 3: Payment acceptance is complicated.**
> Want to accept Kaspa for your business? You need a backend, a database, webhook integrations... it's way too complex for simple payments."

**[Show frustrated developer meme or animation]**

> "We built KasFlow to fix ALL of this."

---

## THE SOLUTION (1:30 - 2:30)

**[Show KasFlow architecture diagram or split screen of the two packages]**

> "KasFlow is two things:

> **First: @kasflow/passkey-wallet**
> The first Kaspa wallet that uses passkeys instead of seed phrases. Just your fingerprint or Face ID. No words to write down. And here's the magic - it works across all your devices automatically.

> **Second: @kasflow/wallet-connector**
> A React library that gives developers what Ethereum has had for years - simple hooks and components. `useWallet()`, `ConnectButton`, done. Five minutes to add wallet connection to any app.

> **And the KasFlow App itself:**
> A complete payment solution. Create payment links, share QR codes, get instant confirmations. No backend required - everything runs client-side."

**[Show npm package pages briefly]**

---

## TECHNICAL DEEP DIVE (2:30 - 3:30)

**[Show code snippets or architecture diagram]**

> "Let me show you what makes this technically unique.

> **Deterministic Key Derivation:**
> When you create a passkey, your device generates a cryptographic key stored in the Secure Enclave - that's hardware-level security. We take that key, hash it, and derive your Kaspa private key deterministically.

> Same passkey equals same wallet. Every time. On every device.

> Your passkeys sync through iCloud or Google Password Manager. So you create a wallet on your iPhone, and it's automatically available on your MacBook, your iPad, even Windows with the same fingerprint.

> **Per-Transaction Authentication:**
> Unlike other wallets that stay unlocked, KasFlow requires biometric approval for EVERY transaction. We use the transaction hash as a WebAuthn challenge - cryptographically binding your fingerprint to that specific payment.

> **Zero Backend:**
> Payment links encode everything in the URL. Amount, recipient, network - all in the link. The payment page polls the Kaspa network directly. No database. No server. You can host this on GitHub Pages."

---

## LIVE DEMO (3:30 - 5:00)

**[Screen recording of full flow]**

> "Let me show you how fast this is.

> **Step 1: Create a Payment Link**"

**[Navigate to /create, enter address, amount, memo]**

> "I enter my Kaspa address, set the amount to 10 KAS, add a memo... and generate."

**[Show QR code and payment link]**

> "Instant. I can copy this link or scan this QR code.

> **Step 2: Pay with Passkey Wallet**"

**[Open payment link, click Connect Wallet]**

> "Now I'm the customer. I open the link, click 'Connect Wallet to Pay', select Passkey Wallet..."

**[Show Touch ID / Face ID prompt]**

> "One fingerprint to unlock. I see the payment details - 10 KAS to this address on Testnet.

> I click Send, authenticate again..."

**[Show second biometric prompt]**

> "And watch this."

**[Show payment confirming in ~1 second, confetti animation]**

> "BOOM. Payment confirmed in under 2 seconds. That's Kaspa's BlockDAG technology - instant finality.

> The merchant sees confirmation in real-time. Transaction ID, amount, fee - everything.

> **Step 3: Download Receipt**"

**[Show receipt modal, click download]**

> "Professional receipt with QR code linking to the block explorer. Done."

---

## FOR DEVELOPERS (5:00 - 5:30)

**[Show code editor with React code]**

> "For developers, integration is dead simple.

```jsx
import { KaspaWalletProvider, ConnectButton, useWallet } from '@kasflow/wallet-connector';

// Wrap your app
<KaspaWalletProvider config={{ appName: 'My Store' }}>
  <App />
</KaspaWalletProvider>

// Add a button
<ConnectButton showBalance />

// Use the hook
const { address, sendTransaction } = useWallet();
```

> "That's it. Full wallet functionality in 10 lines of code. TypeScript support, React hooks, all the utilities you need."

---

## CLOSING (5:30 - 6:00)

**[Show KasFlow logo and key stats]**

> "KasFlow solves real problems:

> - No more seed phrases - just biometrics
> - First wallet connector library for Kaspa developers
> - Instant payments with no backend required
> - Open source, MIT licensed, ready for production

> We're live on Kaspa Mainnet today.

> **npm install @kasflow/passkey-wallet**
> **npm install @kasflow/wallet-connector**

> This is the future of Kaspa payments. Fast. Simple. Secure.

> KasFlow - Accept Kaspa in Milliseconds.

> Thank you."

**[Show GitHub URL: github.com/Kas-Flow/kasflow]**

---

## B-ROLL SUGGESTIONS

- Fingerprint/Face ID animations
- QR code scanning
- Confetti on successful payment
- Side-by-side: seed phrase writing vs fingerprint tap
- Code editor with syntax highlighting
- Mobile wallet scanning QR
- Real-time payment status updating

---

## KEY PHRASES TO EMPHASIZE

1. "First passkey-powered Kaspa wallet"
2. "No seed phrases, just biometrics"
3. "Same wallet on all your devices - automatically"
4. "No backend required"
5. "Under 2 seconds to confirm"
6. "10 lines of code for developers"

---

## HACKATHON CATEGORIES THIS TARGETS

1. **Main Track** - Complete payment solution
2. **Payments & Commerce** - Instant payment acceptance
3. **Best UX/UI** - Revolutionary passkey wallet UX
4. **Most Creative Use** - Deterministic passkey derivation is novel

Good luck! This is a winning project.
