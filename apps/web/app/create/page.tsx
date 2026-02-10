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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-10 items-start max-w-6xl mx-auto">
          {/* Left Column: Compact Network Display (if connected) or Selector (if not) */}
          {isConnected ? (
            <div className="w-full lg:sticky lg:top-24 lg:self-start">
              <div className="bg-card border-2 border-border rounded-lg shadow-[4px_4px_0px_0px_var(--shadow-color)] p-4 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neo-green animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Connected</span>
                  </div>

                  <NetworkDisplay network={walletNetwork} size="sm" />

                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-2">
                    Switch network from wallet menu.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <NetworkSelector value={selectedNetwork} onChange={setSelectedNetwork} />
          )}

          {/* Right Column: Payment Wizard (More Space) */}
          <div className="w-full">
            <PaymentWizard network={activeNetwork} />
          </div>
        </div>
      </main>
    </div>
  );
}