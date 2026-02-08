'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthErrorProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export function AuthError({ message, onRetry, onDismiss }: AuthErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">Connection Failed</h3>
      <p className="text-muted-foreground mb-6 max-w-xs">{message}</p>
      
      <div className="flex gap-4 w-full">
        <Button variant="outline" onClick={onDismiss} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onRetry} className="flex-1 bg-black text-white hover:bg-gray-800">
          Try Again
        </Button>
      </div>
    </div>
  );
}
