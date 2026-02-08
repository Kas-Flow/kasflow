'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressAvatar } from '@/components/ui/address-avatar';
import { ArrowRight, Check } from 'lucide-react';
import { isValidAddress } from '@kasflow/passkey-wallet';

interface AddressStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function AddressStep({ value, onChange, onNext }: AddressStepProps) {
  const [isValid, setIsValid] = useState(false);

  // Validate using real SDK validation
  useEffect(() => {
    // Skip validation for empty string
    if (!value.trim()) {
      if (isValid) {
        const timer = setTimeout(() => setIsValid(false), 0);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Use SDK's isValidAddress function for proper validation
    try {
      const valid = isValidAddress(value);
      if (valid !== isValid) {
        // Use timeout to avoid sync state update during render cycle if called from effect
        const timer = setTimeout(() => setIsValid(valid), 0);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // Invalid address throws error
      if (isValid) {
        const timer = setTimeout(() => setIsValid(false), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [value, isValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <h2 className="text-2xl font-black mb-6">Enter Recipient Address</h2>
      
      <div className="flex-1 space-y-6">
        <div className="relative">
          <Input
            placeholder="kaspa:qr..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-12"
            autoFocus
          />
          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-green"
              >
                <Check className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center h-[140px] items-center">
          <AnimatePresence>
            {isValid && (
              <AddressAvatar 
                address={value} 
                size={120} 
                className="border-neo-green"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isValid ? 1 : 0.5, y: 0 }}
        className="mt-auto"
      >
        <Button 
          type="submit" 
          disabled={!isValid} 
          className="w-full text-lg h-12"
        >
          Continue <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </form>
  );
}
