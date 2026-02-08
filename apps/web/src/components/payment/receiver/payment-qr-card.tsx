'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { cardGlowVariants } from '@/lib/constants/animations';

interface PaymentQRCardProps {
  address: string;
  amount: string;
}

export function PaymentQRCard({ address, amount }: PaymentQRCardProps) {
  // Construct payment URI (BIP-21 style but for Kaspa)
  // kaspa:<address>?amount=<amount>
  const uri = `kaspa:${address}?amount=${amount}`;

  return (
    <motion.div
      variants={cardGlowVariants}
      initial="initial"
      whileHover="hover"
      className="bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col items-center gap-4 mb-8"
    >
      <div className="bg-white p-2">
        <QRCodeSVG value={uri} size={200} />
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Scan to Pay
      </p>
    </motion.div>
  );
}
