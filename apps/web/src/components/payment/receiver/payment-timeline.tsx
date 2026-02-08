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
    <div className="w-full max-w-sm mx-auto mt-12 bg-white border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_#000]">
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
                   borderColor: isPending ? '#d1d5db' : '#000'
                 }}
                 transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                 className={cn(
                   "w-8 h-8 rounded-full border-2 flex items-center justify-center z-10",
                   isPending && "bg-muted border-muted-foreground"
                 )}
               >
                 <step.icon className={cn("w-4 h-4 text-black", isPending && "text-muted-foreground")} />
               </motion.div>

               <div className={cn("font-bold", isPending && "text-muted-foreground")}>
                 {step.label}
                 {isActive && step.id === 'confirming' && (
                   <span className="ml-2 text-xs bg-neo-yellow px-2 py-0.5 rounded border border-black">
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
