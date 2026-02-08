'use client';

import { useState } from 'react';
import { PaymentWizard } from '@/components/payment/wizard/payment-wizard';
import { NetworkSelector } from '@/components/payment/network-selector';
import { Navbar } from '@/components/navbar';
import { DEFAULT_NETWORK } from '@/lib/constants/kaspa';

export default function CreatePaymentPage() {
  const [network, setNetwork] = useState<string>(DEFAULT_NETWORK);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-64px)] flex items-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-center">
          {/* Left Side: Info + Network Selector */}
          <div className="flex flex-col gap-6">
            <div className="text-left">
              <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-kaspa-blue to-kaspa-teal bg-clip-text text-transparent">
                Create Payment
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Generate a secure payment link in seconds.
              </p>
            </div>

            <NetworkSelector value={network} onChange={setNetwork} />

            {/* Additional Info */}
            <div className="hidden lg:block bg-card border-4 border-border rounded-xl p-6 shadow-[6px_6px_0px_0px_var(--shadow-color)]">
              <h3 className="font-black text-lg mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neo-green font-bold mt-0.5">1.</span>
                  <span>Enter recipient address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neo-green font-bold mt-0.5">2.</span>
                  <span>Set payment amount</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neo-green font-bold mt-0.5">3.</span>
                  <span>Add optional memo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neo-green font-bold mt-0.5">4.</span>
                  <span>Share QR or link</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Wizard */}
          <div className="w-full">
            <PaymentWizard network={network} />
          </div>
        </div>
      </main>
    </div>
  );
}