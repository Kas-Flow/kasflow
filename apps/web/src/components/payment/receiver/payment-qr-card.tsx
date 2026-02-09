'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { cardGlowVariants } from '@/lib/constants/animations';
import { NETWORK_NAMES } from '@/lib/constants/kaspa';

interface PaymentQRCardProps {
  address: string;
  amount: string;
  network: string;
}

export function PaymentQRCard({ address, amount, network }: PaymentQRCardProps) {
  // Construct Kaspa payment URI per official spec (kaspad#2189)
  // Format: kaspa:<bech32_address>?amount=<amount>
  // Note: URI scheme is ALWAYS "kaspa:" regardless of network
  // Strip network prefix (kaspa: or kaspatest:) and use just bech32 part
  const bech32Address = address.includes(':') ? address.split(':')[1] : address;
  const uri = `kaspa:${bech32Address}?amount=${amount}`;

  // Get network display name
  const networkName = NETWORK_NAMES[network as keyof typeof NETWORK_NAMES] || network || 'Unknown Network';

  return (
    <motion.div
      variants={cardGlowVariants}
      initial="initial"
      whileHover="hover"
      className="bg-card p-8 rounded-xl border-4 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)] flex flex-col items-center gap-4"
    >
      {/* Network Badge */}
      <div className="w-full flex justify-center mb-2">
        <span className="px-3 py-1 bg-neo-cyan text-black text-xs font-bold rounded-lg border-2 border-border shadow-[2px_2px_0px_0px_var(--shadow-color)] uppercase tracking-wider">
          {networkName}
        </span>
      </div>

      <div className="bg-white dark:bg-white p-2 rounded">
        <QRCodeSVG value={uri} size={240} />
      </div>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        Scan to Pay
      </p>
    </motion.div>
  );
}
