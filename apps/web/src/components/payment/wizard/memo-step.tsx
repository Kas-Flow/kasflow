'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressAvatar } from '@/components/ui/address-avatar';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface MemoStepProps {
  value: string;
  recipientAddress: string;
  amount: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MemoStep({ value, recipientAddress, amount, onChange, onNext, onBack }: MemoStepProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 p-4 bg-neo-yellow/20 rounded-lg border-2 border-border">
        <AddressAvatar address={recipientAddress} size={48} animated={false} />
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase">Sending</div>
          <div className="font-black text-xl">{amount} KAS</div>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-6">Add a memo (optional)</h2>

      <div className="flex-1 space-y-6">
        <Input
          placeholder="For pizza 🍕"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 text-lg"
          autoFocus
        />
        
        <div className="text-sm text-muted-foreground">
          Recipients will see this memo when they scan the payment link.
        </div>
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
          className="flex-1 text-lg bg-neo-pink text-black hover:bg-neo-pink/90 border-border"
        >
          Create Link <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
