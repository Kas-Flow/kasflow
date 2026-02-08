'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { slideInUp } from '@/lib/constants/animations';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideInUp}
        className="w-full max-w-sm space-y-8"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-neo-green blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-24 h-24 bg-black rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
            <span className="text-4xl font-black text-white">K</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-2">Welcome to KasFlow</h2>
          <p className="text-muted-foreground">The fastest way to use Kaspa</p>
        </div>

        <div className="space-y-4 text-left bg-muted/30 p-6 rounded-xl border-2 border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-neo-cyan" />
            <div>
              <div className="font-bold">Secure Biometrics</div>
              <div className="text-xs text-muted-foreground">Keys stay on your device</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-neo-yellow" />
            <div>
              <div className="font-bold">Instant Speed</div>
              <div className="text-xs text-muted-foreground">Transactions in seconds</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-neo-pink" />
            <div>
              <div className="font-bold">Non-Custodial</div>
              <div className="text-xs text-muted-foreground">You own your funds</div>
            </div>
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full text-lg h-12"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}
