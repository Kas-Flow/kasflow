<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/kasflow-logo.png" alt="KasFlow Logo" width="120" height="120"/>

  # KasFlow

  **Open-source payment toolkit for Kaspa blockchain featuring the first passkey-powered wallet SDK.**

  [![npm](https://img.shields.io/npm/v/@kasflow/passkey-wallet)](https://www.npmjs.com/package/@kasflow/passkey-wallet)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Website](https://kasflow.app) • [Demo](https://kasflow.app) • [Documentation](https://kasflow.app/docs)

</div>

---

## Technical Overview

![Technical Deep Dive](https://raw.githubusercontent.com/Kas-Flow/assets/master/technical-deep-dive.svg)

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [@kasflow/passkey-wallet](./packages/passkey-wallet) | Passkey-powered wallet SDK | [![npm](https://img.shields.io/npm/v/@kasflow/passkey-wallet)](https://www.npmjs.com/package/@kasflow/passkey-wallet) |
| [@kasflow/wallet-connector](./packages/wallet-connector) | Multi-wallet connector with React hooks | [![npm](https://img.shields.io/npm/v/@kasflow/wallet-connector)](https://www.npmjs.com/package/@kasflow/wallet-connector) |

## Installation

```bash
# Passkey wallet SDK
npm install @kasflow/passkey-wallet

# Wallet connector (includes React components)
npm install @kasflow/wallet-connector
```

## Quick Start

### Passkey Wallet

Create and manage Kaspa wallets using device biometrics (Face ID, Touch ID, Windows Hello):

```typescript
import { PasskeyWallet } from '@kasflow/passkey-wallet';

// Create a new wallet
const result = await PasskeyWallet.create({ network: 'mainnet' });
const wallet = result.data;

// Get address and send KAS
console.log('Address:', wallet.getAddress());
await wallet.sendWithAuth({ to: 'kaspa:qr...', amount: 100000000n });
```

### Wallet Connector (React)

Connect to multiple wallet types with pre-built components:

```tsx
import {
  KaspaWalletProvider,
  passkeyAdapter,
  kaswareAdapter,
  ConnectButton,
  WalletModal,
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
      <WalletModal />
    </KaspaWalletProvider>
  );
}
```

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

## License

MIT
