'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface SuccessStepProps {
  data: {
    address: string;
    amount: string;
    memo: string;
  };
  onReset: () => void;
}

export function SuccessStep({ data, onReset }: SuccessStepProps) {
  
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#49EACB', '#bef264', '#f472b6', '#fde68a']
    });
  }, []);

  const paymentLink = `https://kasflow.app/pay/${btoa(JSON.stringify(data))}`;

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success('Payment link copied!');
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Kaspa Payment Request',
        text: `Pay ${data.amount} KAS to ${data.address}`,
        url: paymentLink
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex flex-col h-full items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6 p-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]"
      >
        <QRCodeSVG value={paymentLink} size={160} />
      </motion.div>

      <h2 className="text-2xl font-black mb-2">Payment Link Created!</h2>
      <p className="text-muted-foreground mb-6 max-w-[260px]">
        Share this code or link to receive {data.amount} KAS instantly.
      </p>

      <div className="w-full space-y-3 mt-auto">
        <div className="flex gap-3">
          <Button onClick={copyLink} className="flex-1" variant="outline">
            <Copy className="mr-2 w-4 h-4" /> Copy Link
          </Button>
          <Button onClick={shareLink} className="flex-1" variant="outline">
            <Share2 className="mr-2 w-4 h-4" /> Share
          </Button>
        </div>
        
        <Button 
          onClick={onReset} 
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          Create Another <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
