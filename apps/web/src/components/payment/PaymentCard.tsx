'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PaymentCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PaymentCard({
  title,
  description,
  children,
  className,
}: PaymentCardProps) {
  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      {(title || description) && (
        <CardHeader className="text-center">
          {title && <CardTitle className="text-2xl">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-base">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
