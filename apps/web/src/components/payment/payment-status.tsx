'use client';

/**
 * PaymentStatus - Display real-time payment status and confirmations
 */

import { CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatKas } from '@kasflow/passkey-wallet';
import type { PaymentState } from '@/hooks/use-payment-detection';

// =============================================================================
// Types
// =============================================================================

interface PaymentStatusProps {
  state: PaymentState;
  transactionId?: string | null;
  confirmations?: number;
  amount: bigint;
}

// =============================================================================
// Status Config
// =============================================================================

interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
  color: string;
  animate?: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  idle: {
    icon: Clock,
    iconColor: 'text-muted-foreground',
    title: 'Awaiting Payment',
    description: 'Monitoring address for incoming transactions',
    color: 'text-muted-foreground',
  },
  monitoring: {
    icon: Loader2,
    iconColor: 'text-blue-500',
    title: 'Monitoring',
    description: 'Watching for incoming payment...',
    color: 'text-blue-500',
    animate: 'animate-spin',
  },
  detected: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    title: 'Payment Detected!',
    description: 'Transaction broadcast to network',
    color: 'text-yellow-500',
  },
  confirming: {
    icon: Loader2,
    iconColor: 'text-kaspa-blue',
    title: 'Confirming',
    description: 'Transaction being confirmed...',
    color: 'text-kaspa-blue',
    animate: 'animate-spin',
  },
  confirmed: {
    icon: CheckCircle2,
    iconColor: 'text-green-500',
    title: 'Payment Confirmed!',
    description: 'Transaction fully confirmed on the network',
    color: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-destructive',
    title: 'Error',
    description: 'Failed to monitor payment',
    color: 'text-destructive',
  },
};

// =============================================================================
// PaymentStatus Component
// =============================================================================

export function PaymentStatus({
  state,
  transactionId,
  confirmations = 0,
  amount,
}: PaymentStatusProps) {
  const config = STATUS_CONFIG[state];
  const Icon = config.icon;
  const amountKas = formatKas(amount, 8);

  // Calculate progress (10 confirmations = 100%)
  const progress = state === 'confirmed' ? 100 : Math.min((confirmations / 10) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>Real-time transaction monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Icon & Title */}
        <div className="flex flex-col items-center space-y-4 py-6">
          <div className={`p-4 rounded-full bg-muted ${config.iconColor}`}>
            <Icon className={`w-12 h-12 ${config.animate || ''}`} />
          </div>
          <div className="text-center space-y-1">
            <h3 className={`text-2xl font-bold ${config.color}`}>
              {config.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Expected Amount</div>
          <div className="text-xl font-semibold">
            {amountKas}{' '}
            <span className="text-sm font-normal text-muted-foreground">KAS</span>
          </div>
        </div>

        {/* Confirmations Progress */}
        {(state === 'detected' || state === 'confirming' || state === 'confirmed') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confirmations</span>
              <span className="font-medium">
                {confirmations} / 10
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Transaction ID */}
        {transactionId && (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Transaction ID</div>
            <div className="text-xs font-mono bg-muted px-3 py-2 rounded break-all">
              {transactionId}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium">Timeline</div>
          <div className="space-y-2">
            <TimelineItem
              active={state !== 'idle'}
              completed={state !== 'idle' && state !== 'monitoring'}
              label="Monitoring started"
            />
            <TimelineItem
              active={state === 'detected' || state === 'confirming' || state === 'confirmed'}
              completed={state === 'confirming' || state === 'confirmed'}
              label="Payment detected"
            />
            <TimelineItem
              active={state === 'confirming' || state === 'confirmed'}
              completed={state === 'confirmed'}
              label="Confirming transaction"
            />
            <TimelineItem
              active={state === 'confirmed'}
              completed={state === 'confirmed'}
              label="Payment confirmed"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// TimelineItem Component
// =============================================================================

interface TimelineItemProps {
  active: boolean;
  completed: boolean;
  label: string;
}

function TimelineItem({ active, completed, label }: TimelineItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={`w-2 h-2 rounded-full ${
          completed
            ? 'bg-green-500'
            : active
            ? 'bg-kaspa-blue animate-pulse'
            : 'bg-muted'
        }`}
      />
      <span
        className={`text-sm ${
          active ? 'text-foreground font-medium' : 'text-muted-foreground'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
