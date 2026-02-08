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

      <main className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Create Payment</h1>
          <p className="text-xl text-muted-foreground">Generate a secure payment link in seconds.</p>
        </div>

        <NetworkSelector value={network} onChange={setNetwork} />
        <PaymentWizard network={network} />
      </main>
    </div>
  );
}