import Link from 'next/link';
import { CodeBlock } from '@/components/docs/code-block';

export function SdkWalletConnectorContent() {
  return (
    <>
      <p className="lead text-xl">
        Connect to multiple Kaspa wallets with pre-built React hooks and components. Supports passkey wallets and browser extensions.
      </p>

      <div className="my-6 p-4 bg-card border border-border rounded-lg not-prose flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <span className="font-semibold">@kasflow/wallet-connector</span>
          <span className="text-muted-foreground ml-2">on npm</span>
        </div>
        <a
          href="https://www.npmjs.com/package/@kasflow/wallet-connector"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          View on npm
        </a>
      </div>

      <h2>Installation</h2>
      <CodeBlock
        code="npm install @kasflow/wallet-connector"
        language="bash"
        filename="terminal"
      />

      <h2>Quick Start</h2>

      <h3>1. Set Up Provider</h3>
      <CodeBlock
        code={`import {
  KaspaWalletProvider,
  passkeyAdapter,
  kaswareAdapter,
  WalletModal,
} from '@kasflow/wallet-connector/react';

function App() {
  return (
    <KaspaWalletProvider
      config={{
        appName: 'My App',
        network: 'mainnet',
        autoConnect: true,
        adapters: [passkeyAdapter(), kaswareAdapter()],
      }}
    >
      <YourApp />
      <WalletModal />
    </KaspaWalletProvider>
  );
}`}
        filename="App.tsx"
      />

      <h3>2. Add Connect Button</h3>
      <CodeBlock
        code={`import { ConnectButton } from '@kasflow/wallet-connector/react';

function Navbar() {
  return (
    <nav>
      <ConnectButton showBalance showNetwork />
    </nav>
  );
}`}
        filename="Navbar.tsx"
      />

      <h3>3. Use Wallet Hook</h3>
      <CodeBlock
        code={`import { useWallet } from '@kasflow/wallet-connector/react';

function PaymentPage() {
  const { connected, address, sendTransaction } = useWallet();

  if (!connected) {
    return <p>Please connect your wallet</p>;
  }

  const handlePay = async () => {
    const result = await sendTransaction({
      to: 'kaspa:qr...',
      amount: BigInt(100000000), // 1 KAS
    });
    console.log('TX:', result.txId);
  };

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={handlePay}>Pay 1 KAS</button>
    </div>
  );
}`}
        filename="PaymentPage.tsx"
      />

      <h2>Available Adapters</h2>

      <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
        <div className="p-6 bg-card rounded-xl border border-border">
          <h4 className="font-bold text-lg mb-2">Passkey Adapter</h4>
          <p className="text-muted-foreground mb-4">
            Biometric authentication with Face ID, Touch ID, or Windows Hello.
          </p>
          <CodeBlock code="passkeyAdapter()" filename="adapter.ts" />
        </div>

        <div className="p-6 bg-card rounded-xl border border-border">
          <h4 className="font-bold text-lg mb-2">KasWare Adapter</h4>
          <p className="text-muted-foreground mb-4">
            Connect to KasWare browser extension wallet.
          </p>
          <CodeBlock code="kaswareAdapter()" filename="adapter.ts" />
        </div>
      </div>

      <h2>React Hooks</h2>

      <h3>useWallet</h3>
      <p>Main hook for wallet state and actions.</p>
      <CodeBlock
        code={`const {
  // State
  connected,        // boolean
  connecting,       // boolean
  address,          // string | null
  balance,          // { available, pending, total }
  network,          // 'mainnet' | 'testnet-10' | 'testnet-11'

  // Actions
  connect,          // (adapterName?) => Promise<void>
  disconnect,       // () => Promise<void>
  sendTransaction,  // (params) => Promise<{ txId, fee }>
  signMessage,      // (params) => Promise<{ signature }>
  switchNetwork,    // (network) => Promise<void>
  openModal,        // () => void
} = useWallet();`}
        filename="useWallet.ts"
      />

      <h3>useBalance</h3>
      <p>Balance with formatting utilities.</p>
      <CodeBlock
        code={`const {
  available,          // bigint
  pending,            // bigint
  total,              // bigint
  formattedAvailable, // "1.2345 KAS"
  formattedPending,
  formattedTotal,
  loading,
  refresh,
} = useBalance();`}
        filename="useBalance.ts"
      />

      <h3>useAccount</h3>
      <p>Account utilities with clipboard support.</p>
      <CodeBlock
        code={`const {
  address,      // full address
  shortAddress, // "kaspa:qr...xyz"
  publicKey,
  copy,         // () => Promise<boolean>
  copied,       // boolean (recently copied)
} = useAccount();`}
        filename="useAccount.ts"
      />

      <h3>useNetwork</h3>
      <p>Network information and switching.</p>
      <CodeBlock
        code={`const {
  network,       // current network ID
  networkConfig, // { id, name, rpcUrl, explorerUrl }
  isMainnet,     // boolean
  isTestnet,     // boolean
  switchNetwork, // (network) => Promise<void>
} = useNetwork();`}
        filename="useNetwork.ts"
      />

      <h3>useConnect</h3>
      <p>Connection controls and modal state.</p>
      <CodeBlock
        code={`const {
  adapters,       // available wallet adapters
  currentAdapter, // currently connected adapter
  isModalOpen,
  openModal,
  closeModal,
} = useConnect();`}
        filename="useConnect.ts"
      />

      <h2>Components</h2>

      <h3>ConnectButton</h3>
      <p>Smart button that adapts to connection state.</p>
      <CodeBlock
        code={`<ConnectButton
  label="Connect Wallet"  // button text when disconnected
  showBalance={true}      // show balance when connected
  showNetwork={true}      // show network badge
  className="my-class"
/>`}
        filename="ConnectButton.tsx"
      />

      <h4>Custom Rendering</h4>
      <CodeBlock
        code={`<ConnectButton.Custom>
  {({ connected, address, openModal, disconnect }) => (
    connected ? (
      <button onClick={disconnect}>{address}</button>
    ) : (
      <button onClick={openModal}>Connect</button>
    )
  )}
</ConnectButton.Custom>`}
        filename="CustomButton.tsx"
      />

      <h3>WalletModal</h3>
      <p>Wallet selection modal with automatic state management.</p>
      <CodeBlock
        code={`<WalletModal title="Connect Wallet" />`}
        filename="WalletModal.tsx"
      />

      <h2>Provider Config</h2>
      <CodeBlock
        code={`<KaspaWalletProvider
  config={{
    appName: 'My App',           // shown in wallet prompts
    network: 'mainnet',          // default network
    autoConnect: true,           // reconnect on page load
    adapters: [                  // wallets to support
      passkeyAdapter({
        network: 'mainnet',
        autoConnectRpc: true,
      }),
      kaswareAdapter({
        network: 'mainnet',
      }),
    ],
  }}
>
  {children}
</KaspaWalletProvider>`}
        filename="App.tsx"
      />

      <h2>Error Handling</h2>
      <CodeBlock
        code={`import { WalletError, WalletErrorCode } from '@kasflow/wallet-connector';

try {
  await sendTransaction({ to, amount });
} catch (error) {
  if (error instanceof WalletError) {
    switch (error.code) {
      case WalletErrorCode.INSUFFICIENT_BALANCE:
        alert('Not enough funds');
        break;
      case WalletErrorCode.TRANSACTION_REJECTED:
        alert('Transaction rejected');
        break;
    }
  }
}`}
        filename="error-handling.ts"
      />

      <h2>TypeScript Types</h2>
      <CodeBlock
        code={`import type {
  NetworkId,            // 'mainnet' | 'testnet-10' | 'testnet-11'
  WalletBalance,        // { available, pending, total }
  SendTransactionParams,
  TransactionResult,    // { txId, network, fee }
  WalletError,
  WalletErrorCode,
} from '@kasflow/wallet-connector';`}
        filename="types.ts"
      />

      <div className="my-12 p-6 md:p-8 bg-gradient-to-r from-neo-purple/10 to-neo-pink/10 rounded-xl border border-border/50 not-prose">
        <h3 className="text-2xl font-bold mb-3">Using without React?</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Use the Passkey Wallet SDK directly for framework-agnostic integration.
        </p>
        <Link
          href="/docs/sdk-passkey-wallet"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Passkey Wallet SDK
        </Link>
      </div>
    </>
  );
}
