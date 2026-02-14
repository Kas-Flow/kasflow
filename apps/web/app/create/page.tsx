'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PaymentWizard } from '@/components/payment/wizard/payment-wizard';
import { NetworkSelector } from '@/components/payment/network-selector';
import { NetworkDisplay } from '@/components/wallet/network-display';
import { Navbar } from '@/components/navbar';
import { DEFAULT_NETWORK } from '@/lib/constants/kaspa';
import { useWalletStore, selectIsConnected } from '@/stores/wallet-store';
import { Sparkles, Zap, Link as LinkIcon } from 'lucide-react';

export default function CreatePaymentPage() {
  const isConnected = useWalletStore(selectIsConnected);
  const walletNetwork = useWalletStore((state) => state.network);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(DEFAULT_NETWORK);

  // Use wallet network if connected, otherwise use user selection
  // Memoize to avoid unnecessary recalculations
  const activeNetwork = useMemo(
    () => (isConnected ? walletNetwork : selectedNetwork),
    [isConnected, walletNetwork, selectedNetwork]
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Page Header - Creative & Animated */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 lg:mb-8 relative"
        >
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 left-1/4 w-8 h-8 bg-neo-yellow border-2 border-border rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Zap className="w-4 h-4 fill-black" />
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute -top-4 right-1/4 w-8 h-8 bg-neo-pink border-2 border-border rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <LinkIcon className="w-4 h-4" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-neo-cyan border-2 border-border px-4 py-2 rounded-full mb-4 shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-black text-sm tracking-wide">INSTANT PAYMENT LINKS</span>
          </motion.div>

          <h1 className="text-3xl lg:text-5xl font-black mb-2">
            Create{' '}
            <span className="inline-block bg-neo-green px-3 py-1 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] transform -rotate-1">
              Payment
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground font-bold">
            Generate a secure payment link in{' '}
            <span className="text-neo-pink font-black">seconds</span>.
          </p>
        </motion.div>

        {/* Two-Column Grid Layout (Desktop) / Stacked (Mobile) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-10 items-start max-w-6xl mx-auto"
        >
          {/* Left Column: Compact Network Display (if connected) or Selector (if not) */}
          {isConnected ? (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:sticky lg:top-24 lg:self-start"
            >
              <div className="bg-card border-4 border-border rounded-xl shadow-[6px_6px_0px_0px_var(--shadow-color)] p-4 pb-6 hover:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <NetworkSelector value={selectedNetwork} onChange={setSelectedNetwork} />
            </motion.div>
          )}

          {/* Right Column: Payment Wizard (More Space) */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <PaymentWizard network={activeNetwork} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}