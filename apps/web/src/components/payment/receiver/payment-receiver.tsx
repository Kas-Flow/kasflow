'use client';

import React, { useState, useRef } from 'react';
import { PaymentHeader } from './payment-header';
import { PaymentQRCard } from './payment-qr-card';
import { PaymentActions } from './payment-actions';
import { PaymentTimeline } from './payment-timeline';
import confetti from 'canvas-confetti';

interface PaymentData {
  address: string;
  amount: string;
  network: string;
  memo: string;
}

interface PaymentReceiverProps {
  data: PaymentData;
}

export function PaymentReceiver({ data }: PaymentReceiverProps) {
  const [status, setStatus] = useState<'pending' | 'confirming' | 'confirmed'>('pending');
  const confettiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasConfettiFiredRef = useRef(false);

  const handlePaymentSent = () => {
    // Prevent duplicate calls
    if (status !== 'pending') {
      console.log('[PaymentReceiver] Payment already sent, ignoring duplicate call');
      return;
    }

    setStatus('confirming');

    // Clear any existing timer
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
    }

    // Simulate confirmation
    confettiTimerRef.current = setTimeout(() => {
      setStatus('confirmed');

      // Fire confetti only once
      if (!hasConfettiFiredRef.current) {
        hasConfettiFiredRef.current = true;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#49EACB', '#bef264', '#f472b6']
        });
      }
    }, 2000);
  };

  if (!data) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 min-h-[calc(100vh-64px)] flex items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: QR Code + Actions */}
        <div className="flex flex-col gap-6">
          <PaymentQRCard
            address={data.address}
            amount={data.amount}
            network={data.network}
          />

          <PaymentActions
            address={data.address}
            amount={data.amount}
            network={data.network}
            memo={data.memo}
            onPaymentSent={handlePaymentSent}
          />
        </div>

        {/* Right Column: Header + Timeline */}
        <div className="flex flex-col gap-8">
          <PaymentHeader
            amount={data.amount}
            recipientAddress={data.address}
            network={data.network}
            memo={data.memo}
          />

          <PaymentTimeline status={status} />
        </div>
      </div>
    </div>
  );
}
