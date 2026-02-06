'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getExplorerTxUrl } from '@/lib/constants';
import type { NetworkId } from '@/types';

interface SuccessScreenProps {
  confirmationTime: number;
  transactionId: string;
  network: NetworkId;
  onDone?: () => void;
  className?: string;
}

export function SuccessScreen({
  confirmationTime,
  transactionId,
  network,
  onDone,
  className,
}: SuccessScreenProps) {
  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from both sides
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ['#49EACB', '#22c55e', '#ffffff'],
      });

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#49EACB', '#22c55e', '#ffffff'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const explorerUrl = getExplorerTxUrl(transactionId, network);

  return (
    <div className={cn('flex flex-col items-center gap-6 py-8', className)}>
      {/* Success Icon */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-75">
          <CheckCircle className="h-24 w-24 text-success" />
        </div>
        <CheckCircle className="relative h-24 w-24 text-success" />
      </div>

      {/* Success Message */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold text-foreground">Payment Confirmed!</h2>
        <p className="text-muted-foreground">
          Transaction successfully processed
        </p>
      </div>

      {/* Confirmation Time - The Star of the Show! */}
      <div className="flex flex-col items-center gap-1 p-6 rounded-lg bg-card border border-kaspa-cyan/20">
        <span className="text-sm text-muted-foreground uppercase tracking-wide">
          Confirmed in
        </span>
        <span className="text-5xl font-bold text-kaspa-cyan animate-pulse">
          {confirmationTime}ms
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          ⚡ Faster than a blink!
        </span>
      </div>

      {/* Transaction Details */}
      <div className="flex flex-col items-center gap-2 w-full max-w-md">
        <span className="text-sm text-muted-foreground">Transaction ID:</span>
        <code className="text-xs font-mono bg-card border border-border rounded px-3 py-2 w-full truncate text-center">
          {transactionId}
        </code>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.open(explorerUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </Button>

        {onDone && (
          <Button size="lg" onClick={onDone}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
