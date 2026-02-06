'use client';

import { formatKas, kasToUsd, kasToSompi } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AmountDisplayProps {
  amount: string; // Amount in KAS as string
  showFiat?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AmountDisplay({
  amount,
  showFiat = true,
  size = 'lg',
  className,
}: AmountDisplayProps) {
  const amountNum = parseFloat(amount);
  const sompi = kasToSompi(amountNum);
  const formattedKas = formatKas(sompi, 8);
  const usd = kasToUsd(amountNum);

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* KAS Amount */}
      <div className="flex items-baseline gap-2">
        <span className={cn('font-bold text-foreground', sizeClasses[size])}>
          {formattedKas}
        </span>
        <span className="text-xl font-medium text-muted-foreground">KAS</span>
      </div>

      {/* USD Equivalent */}
      {showFiat && (
        <div className="text-lg text-muted-foreground">
          ≈ ${usd} USD
        </div>
      )}
    </div>
  );
}
