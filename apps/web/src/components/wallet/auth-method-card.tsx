'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cardGlowVariants } from '@/lib/constants/animations';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthMethodCard({
  title,
  description,
  icon,
  recommended,
  onClick,
  loading,
  disabled
}: AuthMethodCardProps) {
  return (
    <motion.div
      variants={cardGlowVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      onClick={!disabled && !loading ? onClick : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 bg-white border-2 border-black rounded-xl cursor-pointer transition-all",
        "h-[200px] w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        recommended && "border-neo-cyan"
      )}
    >
      {recommended && (
        <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-black bg-neo-cyan border-b-2 border-l-2 border-black rounded-bl-xl rounded-tr-lg">
          Recommended
        </div>
      )}

      <div className="mb-4 p-4 rounded-full bg-background border-2 border-black">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-center mb-1">{title}</h3>
      <p className="text-sm text-center text-muted-foreground">{description}</p>
    </motion.div>
  );
}
