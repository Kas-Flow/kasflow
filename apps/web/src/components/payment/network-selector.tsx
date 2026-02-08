'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NETWORK_ID, NETWORK_NAMES } from '@/lib/constants/kaspa';
import type { NetworkId } from '@/types';

interface NetworkSelectorProps {
  value: string;
  onChange: (network: string) => void;
}

export function NetworkSelector({ value, onChange }: NetworkSelectorProps) {
  const networks = [
    { id: NETWORK_ID.MAINNET, name: NETWORK_NAMES[NETWORK_ID.MAINNET] },
    { id: NETWORK_ID.TESTNET_11, name: NETWORK_NAMES[NETWORK_ID.TESTNET_11] },
  ];

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <div className="bg-card border-4 border-border rounded-xl shadow-[6px_6px_0px_0px_var(--shadow-color)] p-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 text-center">
          Select Network
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {networks.map((network) => {
            const isSelected = value === network.id;
            return (
              <motion.button
                key={network.id}
                onClick={() => onChange(network.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative px-4 py-3 rounded-lg border-2 font-bold transition-all',
                  isSelected
                    ? 'bg-neo-green text-black border-border shadow-[4px_4px_0px_0px_var(--shadow-color)]'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                )}
              >
                {network.name}
                {isSelected && (
                  <motion.div
                    layoutId="selected-network"
                    className="absolute -top-1 -right-1 w-3 h-3 bg-neo-cyan rounded-full border-2 border-border"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
