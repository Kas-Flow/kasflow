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
    <div className="flex flex-col items-center text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6 relative"
      >
        <AddressAvatar 
          address={recipientAddress} 
          size={120} 
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
      >
        <h1 className="text-5xl font-black mb-2 tracking-tighter">
          {amount} <span className="text-neo-cyan">KAS</span>
        </h1>
        
        {memo ? (
          <div className="bg-neo-yellow/20 border-2 border-border rounded-lg px-4 py-2 inline-block max-w-sm">
            <p className="font-bold text-sm">&quot;{memo}&quot;</p>
          </div>
        ) : (
          <p className="text-muted-foreground font-mono text-sm">
            {recipientAddress.slice(0, 12)}...{recipientAddress.slice(-8)}
          </p>
        )}
      </motion.div>
    </div>
  );
}
