'use client';

import React from 'react';
import { AddressAvatar } from '@/components/ui/address-avatar';
import { motion } from 'framer-motion';

interface PaymentHeaderProps {
  amount: string;
  recipientAddress: string;
  memo?: string;
}

export function PaymentHeader({ amount, recipientAddress, memo }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white border-4 border-border p-8 rounded-xl shadow-[6px_6px_0px_0px_var(--shadow-color)]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6 relative"
      >
        <AddressAvatar
          address={recipientAddress}
          size={100}
          className="border-neo-cyan"
        />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border-2 border-white">
          Recipient
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <h1 className="text-4xl font-black mb-3 tracking-tighter">
          {amount} <span className="text-neo-cyan">KAS</span>
        </h1>

        {memo ? (
          <div className="bg-neo-yellow/20 border-2 border-border rounded-lg px-4 py-2 inline-block max-w-full">
            <p className="font-bold text-sm break-words">&quot;{memo}&quot;</p>
          </div>
        ) : (
          <p className="text-muted-foreground font-mono text-xs break-all px-4">
            {recipientAddress}
          </p>
        )}
      </motion.div>
    </div>
  );
}
