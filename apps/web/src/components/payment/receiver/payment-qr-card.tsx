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
      className="bg-white p-8 rounded-xl border-4 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)] flex flex-col items-center gap-4"
    >
      <div className="bg-white p-2">
        <QRCodeSVG value={uri} size={240} />
      </div>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        Scan to Pay
      </p>
    </motion.div>
  );
}
