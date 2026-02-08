'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentTimelineProps {
  status: 'pending' | 'confirming' | 'confirmed';
  confirmations?: number;
}

export function PaymentTimeline({ status, confirmations = 0 }: PaymentTimelineProps) {
  const steps = [
    { id: 'pending', label: 'Waiting for payment', icon: Radio },
    { id: 'confirming', label: 'Confirming (1s)', icon: Clock },
    { id: 'confirmed', label: 'Payment Complete', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="w-full bg-card border-4 border-border p-6 rounded-xl shadow-[6px_6px_0px_0px_var(--shadow-color)]">
      <h3 className="font-black text-lg mb-4">Payment Status</h3>
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-4 relative">
               {/* Line */}
               {index !== steps.length - 1 && (
                  <div className={cn(
                    "absolute left-4 top-8 w-1 h-8 bg-muted",
                    (isCompleted || isActive) && "bg-neo-green"
                  )} />
               )}

               <motion.div
                 initial={false}
                 animate={{
                   scale: isActive ? [1, 1.1, 1] : 1,
                   backgroundColor: isCompleted ? '#bef264' : isActive ? '#22d3ee' : '#e5e7eb',
                   borderColor: isPending ? '#d1d5db' : 'hsl(var(--foreground))'
                 }}
                 transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                 className={cn(
                   "w-8 h-8 rounded-full border-2 flex items-center justify-center z-10",
                   isPending && "bg-muted border-muted-foreground"
                 )}
               >
                 <step.icon className={cn("w-4 h-4", isCompleted || isActive ? "text-black dark:text-black" : "text-muted-foreground")} />
               </motion.div>

               <div className={cn("font-bold", isPending && "text-muted-foreground")}>
                 {step.label}
                 {isActive && step.id === 'confirming' && (
                   <span className="ml-2 text-xs bg-neo-yellow px-2 py-0.5 rounded border border-border">
                     {confirmations}/10
                   </span>
                 )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
