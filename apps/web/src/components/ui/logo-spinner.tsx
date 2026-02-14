'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 60,
};

export function LogoSpinner({ size = 'md', className }: LogoSpinnerProps) {
  const dimension = sizeMap[size];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ width: dimension * 1.5, height: dimension * 1.5 }}
      >
        <div
          className="rounded-full border-4 border-transparent border-t-neo-green border-r-neo-cyan"
          style={{ width: dimension * 1.5, height: dimension * 1.5 }}
        />
      </motion.div>

      {/* Logo in center with pulse */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative z-10"
      >
        <Image
          src="/logo.svg"
          alt="Loading"
          width={dimension}
          height={dimension}
          className="w-auto h-auto"
        />
      </motion.div>
    </div>
  );
}
