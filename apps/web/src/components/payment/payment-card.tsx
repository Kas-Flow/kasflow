'use client';

/**
 * PaymentCard - Display payment details with QR code and actions
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, Wallet, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { PaymentData } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface PaymentCardProps {
  paymentData: PaymentData;
  onPay?: () => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 13)}...${address.slice(-8)}`;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// PaymentCard Component
// =============================================================================

export function PaymentCard({ paymentData, onPay }: PaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Get current URL on mount
  useEffect(() => {
    const timer = setTimeout(() => setCurrentUrl(window.location.href), 0);
    return () => clearTimeout(timer);
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Convert amount string (KAS) to number for display
  const amountKas = parseFloat(paymentData.amount).toFixed(8).replace(/\.?0+$/, '');

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(paymentData.to);
    if (success) {
      setCopied(true);
      toast.success('Address copied to clipboard');
    } else {
      toast.error('Failed to copy address');
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      toast.success('Payment link copied to clipboard');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kaspa Payment Request',
          text: `Pay ${amountKas} KAS${paymentData.memo ? ` - ${paymentData.memo}` : ''}`,
          url: currentUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleExplorer = () => {
    const explorerUrl = `https://explorer.kaspa.org/addresses/${paymentData.to}`;
    window.open(explorerUrl, '_blank');
  };

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Payment Request</CardTitle>
        <CardDescription>
          Scan the QR code or copy the address to send payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center p-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
          <QRCodeSVG
            value={paymentData.to}
            size={256}
            level="H"
            includeMargin
          />
        </div>

        <Separator />

        {/* Payment Details */}
        <div className="space-y-4">
          {/* Amount */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="text-3xl font-bold">
              {amountKas}{' '}
              <span className="text-lg font-normal text-muted-foreground">KAS</span>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Recipient Address</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                {truncateAddress(paymentData.to)}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Memo (if exists) */}
          {paymentData.memo && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Memo</div>
              <div className="text-sm bg-muted px-3 py-2 rounded">
                {paymentData.memo}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          {/* Pay Button */}
          {onPay && (
            <Button onClick={onPay} className="w-full" size="lg">
              <Wallet className="w-4 h-4 mr-2" />
              Pay with Wallet
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-1" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExplorer}>
              <ExternalLink className="w-4 h-4 mr-1" />
              Explorer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
