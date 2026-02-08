'use client';

/**
 * Payment Page - Display payment request with QR code and real-time status
 */

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { PaymentReceiver } from '@/components/payment/receiver/payment-receiver';
import { decodePaymentLink } from '@/lib/payment';
import { toast } from 'sonner';
import type { PaymentData } from '@/types';

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Decode payment data from URL
  useEffect(() => {
    const result = decodePaymentLink(`/pay/${resolvedParams.paymentId}`);
    const timer = setTimeout(() => {
      if (result.success) {
        setPaymentData(result.data);
      } else {
        const errorMsg = result.error || 'Invalid payment link';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [resolvedParams.paymentId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-pulse font-mono">Loading payment details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Transform data to match PaymentReceiver interface
  const receiverData = {
    address: paymentData.to,
    amount: paymentData.amount,
    network: paymentData.network,
    memo: paymentData.memo || ''
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto">
        <PaymentReceiver data={receiverData} />
      </div>
    </div>
  );
}