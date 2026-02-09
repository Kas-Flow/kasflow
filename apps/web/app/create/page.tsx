'use client';

import { useState, useEffect } from 'react';
import { PaymentWizard } from '@/components/payment/wizard/payment-wizard';
import { NetworkSelector } from '@/components/payment/network-selector';
import { NetworkDisplay } from '@/components/wallet/network-display';
import { Navbar } from '@/components/navbar';
import { DEFAULT_NETWORK } from '@/lib/constants/kaspa';
import { useWalletStore, selectIsConnected } from '@/stores/wallet-store';

export default function CreatePaymentPage() {
  const isConnected = useWalletStore(selectIsConnected);
  const walletNetwork = useWalletStore((state) => state.network);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(DEFAULT_NETWORK);

  // Sync with wallet network when connected
  useEffect(() => {
    if (isConnected) {
      setSelectedNetwork(walletNetwork);
    }
  }, [isConnected, walletNetwork]);

  // Use wallet network if connected, otherwise use user selection
  const activeNetwork = isConnected ? walletNetwork : selectedNetwork;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Page Header - Compact */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl font-black mb-2">
            Create Payment
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Generate a secure payment link in seconds.
          </p>
        </div>

        {/* Two-Column Grid Layout (Desktop) / Stacked (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-6 lg:gap-8 items-start">
          {/* Left Column: Network Display (if connected) or Selector (if not) */}
          {isConnected ? (
            <div className="w-full lg:sticky lg:top-6 lg:self-start">
              <div className="bg-card border-4 border-border rounded-xl shadow-[6px_6px_0px_0px_var(--shadow-color)] p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Wallet Connected</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Payment Network</p>
                    <NetworkDisplay network={walletNetwork} size="lg" className="w-full justify-center" />
                  </div>

                  <p className="text-xs text-muted-foreground italic pt-2 border-t-2 border-border">
                    Switch network from the wallet menu to create payments on a different network.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <NetworkSelector value={selectedNetwork} onChange={setSelectedNetwork} />
          )}

          {/* Right Column: Payment Wizard (Flexible Width) */}
          <div className="w-full">
            <PaymentWizard network={activeNetwork} />
          </div>
        </div>
      </main>
    </div>
  );
}