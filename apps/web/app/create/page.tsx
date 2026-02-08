'use client';

import { PaymentWizard } from '@/components/payment/wizard/payment-wizard';
import { Navbar } from '@/components/navbar';

export default function CreatePaymentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Create Payment</h1>
          <p className="text-xl text-muted-foreground">Generate a secure payment link in seconds.</p>
        </div>
        
        <PaymentWizard />
      </main>
    </div>
  );
}