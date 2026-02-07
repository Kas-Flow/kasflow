'use client';

import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAYMENT_STATUS, type PaymentStatus } from '@/lib/constants';

interface StatusIndicatorProps {
  status: PaymentStatus;
  confirmationTime?: number | null;
  className?: string;
}

export function StatusIndicator({
  status,
  confirmationTime,
  className,
}: StatusIndicatorProps) {
  // Status configurations
  const statusConfig = {
    [PAYMENT_STATUS.IDLE]: {
      icon: <Loader2 className="h-6 w-6 text-muted" />,
      text: 'Initializing...',
      color: 'text-muted-foreground',
    },
    [PAYMENT_STATUS.INITIALIZING]: {
      icon: <Loader2 className="h-6 w-6 animate-spin text-kaspa-cyan" />,
      text: 'Connecting to network...',
      color: 'text-muted-foreground',
    },
    [PAYMENT_STATUS.WAITING]: {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="h-6 w-6 rounded-full bg-kaspa-cyan opacity-75" />
          </div>
          <div className="relative h-6 w-6 rounded-full bg-kaspa-cyan" />
        </div>
      ),
      text: 'Waiting for payment...',
      color: 'text-foreground',
    },
    [PAYMENT_STATUS.DETECTING]: {
      icon: (
        <CheckCircle2 className="h-6 w-6 text-warning animate-pulse" />
      ),
      text: 'Payment detected!',
      color: 'text-warning',
    },
    [PAYMENT_STATUS.CONFIRMING]: {
      icon: <Loader2 className="h-6 w-6 animate-spin text-success" />,
      text: 'Confirming...',
      color: 'text-success',
    },
    [PAYMENT_STATUS.CONFIRMED]: {
      icon: <CheckCircle2 className="h-8 w-8 text-success" />,
      text: 'Payment Confirmed!',
      color: 'text-success',
    },
    [PAYMENT_STATUS.ERROR]: {
      icon: <AlertCircle className="h-6 w-6 text-error" />,
      text: 'Error occurred',
      color: 'text-error',
    },
  };

  const config = statusConfig[status] || statusConfig[PAYMENT_STATUS.IDLE];

  return (
    <div className={cn('flex flex-col items-center gap-3 py-6', className)}>
      {/* Icon */}
      <div className="flex items-center justify-center">
        {config.icon}
      </div>

      {/* Status Text */}
      <div className={cn('text-lg font-medium', config.color)}>
        {config.text}
      </div>

      {/* Confirmation Time (only shown when confirmed) */}
      {status === PAYMENT_STATUS.CONFIRMED && confirmationTime !== null && (
        <div className="flex flex-col items-center gap-1 mt-2">
          <span className="text-sm text-muted-foreground">Confirmed in</span>
          <span className="text-3xl font-bold text-kaspa-cyan">
            {confirmationTime}ms
          </span>
        </div>
      )}
    </div>
  );
}
