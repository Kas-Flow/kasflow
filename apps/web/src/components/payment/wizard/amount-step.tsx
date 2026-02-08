'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressAvatar } from '@/components/ui/address-avatar';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface AmountStepProps {
  value: string;
  recipientAddress: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QUICK_AMOUNTS = ['10', '50', '100', '500'];

export function AmountStep({ value, recipientAddress, onChange, onNext, onBack }: AmountStepProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && parseFloat(value) > 0) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 p-2 bg-muted/20 rounded-lg border-2 border-transparent">
        <AddressAvatar address={recipientAddress} size={32} animated={false} />
        <span className="text-sm font-mono text-muted-foreground truncate">
          {recipientAddress.slice(0, 12)}...{recipientAddress.slice(-8)}
        </span>
      </div>

      <h2 className="text-2xl font-black mb-4">How much to send?</h2>

      <div className="flex-1 space-y-6">
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-2xl h-14 font-mono pl-4 pr-16"
            autoFocus
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">
            KAS
          </span>
        </div>

        <div className="flex gap-2 justify-between">
          {QUICK_AMOUNTS.map((amt, i) => (
            <motion.button
              key={amt}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onChange(amt)}
              className="flex-1 py-2 text-sm font-bold border-2 border-border rounded-md hover:bg-neo-yellow transition-colors shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-y-1 active:shadow-none"
            >
              {amt}
            </motion.button>
          ))}
        </div>

        {value && parseFloat(value) > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 border-2 border-border rounded-xl bg-neo-cyan/20"
          >
            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Preview</div>
            <div className="flex items-center justify-between">
              <span className="font-black text-xl">{value} KAS</span>
              <span className="text-sm">≈ ${(parseFloat(value) * 0.15).toFixed(2)}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-auto flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="w-1/3"
        >
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button 
          type="submit" 
          disabled={!value || parseFloat(value) <= 0} 
          className="flex-1 text-lg"
        >
          Continue <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
