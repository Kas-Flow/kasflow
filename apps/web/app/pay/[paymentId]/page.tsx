'use client';

/**
 * Payment Page - Display payment request with QR code and real-time status
 */

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { PaymentCard } from '@/components/payment/payment-card';
import { PaymentStatus } from '@/components/payment/payment-status';
import { decodePaymentLink } from '@/lib/payment';
import { usePaymentDetection } from '@/hooks/use-payment-detection';
import { useWalletStore, selectWallet, selectIsConnected } from '@/stores/wallet-store';
import { toast } from 'sonner';
import { kasToSompi } from '@kasflow/passkey-wallet';
import type { PaymentData } from '@/types';

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wallet = useWalletStore(selectWallet);
  const isConnected = useWalletStore(selectIsConnected);

  // Decode payment data from URL
  useEffect(() => {
    const result = decodePaymentLink(`/pay/${resolvedParams.paymentId}`);
    if (result.success) {
      setPaymentData(result.data);
    } else {
      const errorMsg = result.error || 'Invalid payment link';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [resolvedParams.paymentId]);

  // Set up payment detection
  const {
    paymentState,
    transactionId,
    confirmations,
    startMonitoring,
    stopMonitoring,
  } = usePaymentDetection(paymentData?.to || '');

  // Start monitoring when component mounts
  useEffect(() => {
    if (paymentData) {
      startMonitoring();
    }
    return () => stopMonitoring();
  }, [paymentData, startMonitoring, stopMonitoring]);

  // Handle payment with wallet
  const handlePay = async () => {
    if (!isConnected || !wallet || !paymentData) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // TODO: Implement wallet payment flow
      // 1. Check balance
      // 2. Build transaction
      // 3. Sign and submit
      // 4. Monitor confirmation
      toast.info('Wallet payment coming soon!');
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed');
    }
  };

  // =============================================================================
  // Render
  // =============================================================================

  if (error) {
    return (
      <div className="min-h-screen bg-background">
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-pulse">Loading payment details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-4xl py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Payment Card */}
          <div className="flex flex-col items-center">
            <PaymentCard
              paymentData={paymentData}
              onPay={isConnected ? handlePay : undefined}
            />
          </div>

          {/* Right Column - Payment Status */}
          <div className="flex flex-col">
            <PaymentStatus
              state={paymentState}
              transactionId={transactionId}
              confirmations={confirmations}
              amount={kasToSompi(parseFloat(paymentData.amount))}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-lg border bg-muted/50 p-6">
            <h3 className="font-semibold mb-3">How to pay</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Option 1:</span> Scan the QR code
                with your Kaspa wallet app
              </li>
              <li>
                <span className="font-medium text-foreground">Option 2:</span> Copy the address
                and paste it into your wallet
              </li>
              <li>
                <span className="font-medium text-foreground">Option 3:</span> Connect your
                passkey wallet and pay directly from this page
              </li>
            </ol>
            <div className="mt-4 text-xs text-muted-foreground">
              Payment detection is automatic - you'll see real-time updates as soon as the
              transaction is broadcast to the network.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
