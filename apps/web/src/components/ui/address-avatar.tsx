'use client';

import React from 'react';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { motion } from 'framer-motion';
import { avatarVariants } from '@/lib/constants/animations';
import { cn } from '@/lib/utils';

interface AddressAvatarProps {
  address: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

export function AddressAvatar({ 
  address, 
  size = 48, 
  className,
  animated = true 
}: AddressAvatarProps) {
  // Ensure we have a valid address string for the library
  // The library slices from index 2, so we make sure it's long enough
  const displayAddress = address || 'kaspa:000000000000000000000000';

    const AvatarComponent = (
      <div 
        className={cn(
          "rounded-full border-4 border-border bg-white overflow-hidden shadow-[4px_4px_0px_0px_var(--shadow-color)] flex items-center justify-center shrink-0", 
          className
        )}
        style={{ width: size, height: size }}
      >      <div style={{ width: '100%', height: '100%' }}>
        <Jazzicon address={displayAddress} />
      </div>
    </div>
  );

  if (!animated) return AvatarComponent;

  return (
    <motion.div
      variants={avatarVariants}
      initial="hidden"
      animate="visible"
      className="shrink-0"
    >
      {AvatarComponent}
    </motion.div>
  );
}