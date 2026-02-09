'use client';

/**
 * NetworkDisplay - Read-only network badge component
 * Shows current network with icon in neobrutalist style
 */

import { Network } from 'lucide-react';
import { NETWORK_NAMES, type NetworkId } from '@/lib/constants/kaspa';
import { cn } from '@/lib/utils';

interface NetworkDisplayProps {
  network: NetworkId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NetworkDisplay({ network, className, size = 'md' }: NetworkDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 bg-neo-cyan text-black font-bold rounded-lg border-2 border-border shadow-[2px_2px_0px_0px_var(--shadow-color)] uppercase tracking-wider',
        sizeClasses[size],
        className
      )}
    >
      <Network className={iconSizes[size]} />
      <span>{NETWORK_NAMES[network]}</span>
    </div>
  );
}
