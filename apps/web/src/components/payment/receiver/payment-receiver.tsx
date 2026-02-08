'use client';

import React, { useState } from 'react';
import { PaymentHeader } from './payment-header';
import { PaymentQRCard } from './payment-qr-card';
import { PaymentActions } from './payment-actions';
import { PaymentTimeline } from './payment-timeline';
import confetti from 'canvas-confetti';

interface PaymentData {
  address: string;
  amount: string;
  memo: string;
}

interface PaymentReceiverProps {
  data: PaymentData;
}

export function PaymentReceiver({ data }: PaymentReceiverProps) {
  const [status, setStatus] = useState<'pending' | 'confirming' | 'confirmed'>('pending');

  const handlePaymentSent = () => {
    setStatus('confirming');
    
    // Simulate confirmation
    setTimeout(() => {
      setStatus('confirmed');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#49EACB', '#bef264', '#f472b6']
      });
    }, 2000);
  };

  if (!data) return null;

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4">
      <PaymentHeader 
        amount={data.amount} 
        recipientAddress={data.address} 
        memo={data.memo} 
      />
      
      <PaymentQRCard 
        address={data.address} 
        amount={data.amount} 
      />

      <PaymentActions
        address={data.address}
        amount={data.amount}
        memo={data.memo}
        onPaymentSent={handlePaymentSent}
      />

      <PaymentTimeline status={status} />
    </div>
  );
}
