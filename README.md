<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/kasflow-logo.png" alt="KasFlow Logo" width="120" height="120"/>

  # KasFlow

  **Open-source payment toolkit for Kaspa blockchain featuring the first passkey-powered wallet SDK.**

  [![npm](https://img.shields.io/npm/v/@kasflow/passkey-wallet)](https://www.npmjs.com/package/@kasflow/passkey-wallet)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Website](https://kas-flow.xyz) • [Demo](https://kas-flow.xyz) • [Documentation](https://kas-flow.xyz/docs)

</div>

---

## Problem & Solution

<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/problem-diagram.svg" alt="Problem Diagram" width="100%"/>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/solution-architecture.svg" alt="Solution Architecture" width="100%"/>
</div>

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [@kasflow/passkey-wallet](./packages/passkey-wallet) | Passkey-powered wallet SDK | [![npm](https://img.shields.io/npm/v/@kasflow/passkey-wallet)](https://www.npmjs.com/package/@kasflow/passkey-wallet) |
| [@kasflow/wallet-connector](./packages/wallet-connector) | Multi-wallet connector with React hooks | [![npm](https://img.shields.io/npm/v/@kasflow/wallet-connector)](https://www.npmjs.com/package/@kasflow/wallet-connector) |

## Architecture

### Passkey Wallet SDK

<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/passkey-wallet-architecture.svg" alt="Passkey Wallet Architecture" width="100%"/>
</div>

### Wallet Connector

<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/wallet-connector-architecture.svg" alt="Wallet Connector Architecture" width="100%"/>
</div>

## Installation

```bash
# Passkey wallet SDK
npm install @kasflow/passkey-wallet

# Wallet connector (includes React components)
npm install @kasflow/wallet-connector
```

## Quick Start

### Passkey Wallet

```typescript
import { PasskeyWallet } from '@kasflow/passkey-wallet';

const result = await PasskeyWallet.create({ network: 'mainnet' });
const wallet = result.data;

console.log('Address:', wallet.getAddress());
await wallet.sendWithAuth({ to: 'kaspa:qr...', amount: 100000000n });
```

### Wallet Connector (React)

```tsx
import {
  KaspaWalletProvider,
  passkeyAdapter,
  kaswareAdapter,
  ConnectButton,
} from '@kasflow/wallet-connector/react';

function App() {
  return (
    <KaspaWalletProvider
      config={{
        appName: 'My App',
        network: 'mainnet',
        adapters: [passkeyAdapter(), kaswareAdapter()],
      }}
    >
      <ConnectButton />
    </KaspaWalletProvider>
  );
}
```

## Technical Deep Dive

<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/technical-deep-dive.svg" alt="Technical Deep Dive" width="100%"/>
</div>

## Key Features

- **Passkey Authentication**: WebAuthn-based wallet using device biometrics (Face ID, Touch ID, Windows Hello)
- **Deterministic Key Derivation**: SHA-256 from passkey credentials to secp256k1 private keys
- **Multi-Wallet Support**: Unified interface for passkey wallets and browser extensions (KasWare)
- **React Integration**: Pre-built hooks and components for wallet connection
- **Instant Confirmations**: Real-time payment detection using WebSocket connections
- **Type-Safe**: Full TypeScript support with strict mode
- **No Backend Required**: Client-side only, no data stored on servers

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- TailwindCSS v4
- Framer Motion
- WebAuthn (FIDO2)
- @kluster/kaspa-wasm-web
- @noble/curves (secp256k1)

## Project Structure

```
kasflow/
├── packages/
│   ├── passkey-wallet/      # @kasflow/passkey-wallet
│   └── wallet-connector/    # @kasflow/wallet-connector
└── apps/
    └── web/                 # Demo application
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run development server
pnpm run dev

# Type check
pnpm run typecheck
```

## Documentation

Full documentation available at [kas-flow.xyz/docs](https://kas-flow.xyz/docs):

- Getting Started
- Create Payment Links
- Send Payments
- Passkey Wallet SDK
- Wallet Connector SDK

## AI Attribution

Claude (Anthropic) assisted with code generation, debugging WASM bundling issues, and documentation.

**Methodology**: Iterative development with AI pair programming - human-driven design decisions, AI-assisted implementation and debugging.

## License

MIT
