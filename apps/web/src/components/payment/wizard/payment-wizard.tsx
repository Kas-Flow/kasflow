'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AddressStep } from './address-step';
import { AmountStep } from './amount-step';
import { MemoStep } from './memo-step';
import { SuccessStep } from './success-step';
import { pageTransition } from '@/lib/constants/animations';

type WizardStep = 'address' | 'amount' | 'memo' | 'success';

interface PaymentData {
  address: string;
  amount: string;
  memo: string;
}

export function PaymentWizard() {
  const [step, setStep] = useState<WizardStep>('address');
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<PaymentData>({
    address: '',
    amount: '',
    memo: ''
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {['address', 'amount', 'memo', 'success'].map((s, i) => {
          const isActive = s === step;
          const isDone = ['address', 'amount', 'memo', 'success'].indexOf(step) > i;
          return (
            <motion.div
              key={s}
              animate={{ 
                scale: isActive ? 1.2 : 1,
                backgroundColor: isActive || isDone ? '#bef264' : '#e5e7eb',
                borderColor: isActive || isDone ? '#000' : '#d1d5db'
              }}
              className="w-3 h-3 rounded-full border-2 transition-colors"
            />
          );
        })}
      </div>

      <div className="relative min-h-[400px] overflow-hidden bg-card border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] p-6">
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
              className="absolute inset-0 p-6"
            >
              <AddressStep 
                value={data.address}
                onChange={(val) => updateData('address', val)}
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
              className="absolute inset-0 p-6"
            >
              <AmountStep 
                value={data.amount}
                recipientAddress={data.address}
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
              className="absolute inset-0 p-6"
            >
              <MemoStep 
                value={data.memo}
                recipientAddress={data.address}
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
              className="absolute inset-0 p-6"
            >
              <SuccessStep 
                data={data}
                onReset={() => {
                  setData({ address: '', amount: '', memo: '' });
                  nextStep('address');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
