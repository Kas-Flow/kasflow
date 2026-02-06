'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { generateKaspaUri } from '@/lib/payment';
import type { PaymentData } from '@/types';

interface QRCodeDisplayProps {
  paymentData: PaymentData;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({
  paymentData,
  size = 256,
  className,
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate QR code
  useEffect(() => {
    const uri = generateKaspaUri(paymentData);

    QRCode.toDataURL(uri, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch((err) => {
        console.error('QR code generation error:', err);
        toast.error('Failed to generate QR code');
      });
  }, [paymentData, size]);

  // Copy address to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.to);
      setCopied(true);
      toast.success('Address copied to clipboard');

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* QR Code */}
      {qrDataUrl ? (
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <img
            src={qrDataUrl}
            alt="Payment QR Code"
            width={size}
            height={size}
            className="block"
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-lg bg-card border border-border"
          style={{ width: size + 32, height: size + 32 }}
        >
          <div className="animate-pulse text-muted-foreground">
            Generating QR code...
          </div>
        </div>
      )}

      {/* Address with Copy Button */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <code className="flex-1 text-xs font-mono bg-card border border-border rounded px-3 py-2 truncate">
          {paymentData.to}
        </code>
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Scan instruction */}
      <p className="text-sm text-muted-foreground text-center">
        Scan with your Kaspa wallet or copy the address above
      </p>
    </div>
  );
}
