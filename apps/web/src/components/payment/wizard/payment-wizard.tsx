'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AddressStep } from './address-step';
import { AmountStep } from './amount-step';
import { MemoStep } from './memo-step';
import { SuccessStep } from './success-step';
import { pageTransition } from '@/lib/constants/animations';

type WizardStep = 'address' | 'amount' | 'memo' | 'success';

interface PaymentData {
  to: string;
  amount: string;
  memo: string;
  network: string;
}

interface PaymentWizardProps {
  network: string;
}

export function PaymentWizard({ network }: PaymentWizardProps) {
  const [step, setStep] = useState<WizardStep>('address');
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<PaymentData>({
    to: '',
    amount: '',
    memo: '',
    network
  });

  const nextStep = (next: WizardStep) => {
    setDirection(1);
    setStep(next);
  };

  const prevStep = (prev: WizardStep) => {
    setDirection(-1);
    setStep(prev);
  };

  const updateData = (key: keyof PaymentData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Sync network prop to state when it changes
  useEffect(() => {
    setData(prev => ({ ...prev, network }));
  }, [network]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator - Enhanced */}
      <div className="flex justify-center gap-3 mb-6 bg-muted/30 border-2 border-border rounded-full p-3 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
        {['address', 'amount', 'memo', 'success'].map((s, i) => {
          const isActive = s === step;
          const isDone = ['address', 'amount', 'memo', 'success'].indexOf(step) > i;
          return (
            <motion.div
              key={s}
              animate={{
                scale: isActive ? 1.3 : 1,
                backgroundColor: isActive || isDone ? '#bef264' : '#d1d5db',
                borderColor: isActive || isDone ? '#000000' : '#9ca3af'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-4 h-4 rounded-full border-2"
            />
          );
        })}
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="relative h-full min-h-[480px] max-h-[calc(100vh-200px)] overflow-hidden bg-card border-4 border-border rounded-2xl shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-[10px_10px_0px_0px_var(--shadow-color)] transition-all p-8"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {step === 'address' && (
            <motion.div
              key="address"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 p-4 flex flex-col"
            >
              <AddressStep
                value={data.to}
                onChange={(val) => updateData('to', val)}
                onNext={() => nextStep('amount')}
              />
            </motion.div>
          )}

          {step === 'amount' && (
            <motion.div
              key="amount"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 p-4 flex flex-col"
            >
              <AmountStep
                value={data.amount}
                recipientAddress={data.to}
                onChange={(val) => updateData('amount', val)}
                onNext={() => nextStep('memo')}
                onBack={() => prevStep('address')}
              />
            </motion.div>
          )}

          {step === 'memo' && (
            <motion.div
              key="memo"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 p-4 flex flex-col"
            >
              <MemoStep
                value={data.memo}
                recipientAddress={data.to}
                amount={data.amount}
                onChange={(val) => updateData('memo', val)}
                onNext={() => nextStep('success')}
                onBack={() => prevStep('amount')}
              />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 p-4 flex flex-col"
            >
              <SuccessStep
                data={data}
                onReset={() => {
                  setData({ to: '', amount: '', memo: '', network });
                  nextStep('address');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
