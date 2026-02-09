'use client';

/**
 * TransactionReceiptModal - Shows transaction confirmation with download/share
 * Displays after successful payment with explorer link and receipt download
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Download, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NETWORK_NAMES, getExplorerTxUrl } from '@/lib/constants/kaspa';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { ReceiptTemplate } from './receipt-template';

// =============================================================================
// Types
// =============================================================================

interface TransactionReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  amount: string;
  network: string;
  recipientAddress: string;
  fee?: bigint;
}

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  copyValue?: string; // Optional: value to copy (if different from displayed value)
}

// =============================================================================
// Helper Components
// =============================================================================

function DetailRow({ label, value, copyable, copyValue }: DetailRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Use copyValue if provided, otherwise use displayed value
    navigator.clipboard.writeText(copyValue ?? value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold font-mono">{value}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-neo-green" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Utility Functions
// =============================================================================

function truncateTxId(txId: string): string {
  if (txId.length <= 16) return txId;
  return `${txId.slice(0, 8)}...${txId.slice(-8)}`;
}

function formatFee(fee?: bigint): string {
  if (!fee) return '—';
  // Convert sompi to KAS (1 KAS = 100,000,000 sompi)
  const kasAmount = Number(fee) / 100_000_000;
  return `${kasAmount.toFixed(8)} KAS`;
}

// =============================================================================
// TransactionReceiptModal Component
// =============================================================================

export function TransactionReceiptModal({
  open,
  onOpenChange,
  transactionId,
  amount,
  network,
  recipientAddress,
  fee,
}: TransactionReceiptModalProps) {
  const explorerUrl = getExplorerTxUrl(transactionId, network);
  const networkName = NETWORK_NAMES[network as keyof typeof NETWORK_NAMES] || network;

  // Trigger confetti when modal opens
  useEffect(() => {
    if (open && transactionId) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#49EACB', '#bef264', '#f472b6'],
      });
    }
  }, [open, transactionId]);

  const handleOpenExplorer = () => {
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = async () => {
    const receiptElement = document.getElementById('receipt-template');
    if (!receiptElement) {
      toast.error('Failed to generate receipt');
      return;
    }

    try {
      toast.loading('Generating receipt...');

      const dataUrl = await toPng(receiptElement, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Higher quality
      });

      const link = document.createElement('a');
      link.download = `kasflow-receipt-${transactionId.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss();
      toast.success('Receipt downloaded!');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.dismiss();
      toast.error('Failed to download receipt');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kaspa Transaction',
          text: `Payment of ${amount} KAS sent successfully!`,
          url: explorerUrl,
        });
      } catch (error) {
        // User cancelled share or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(explorerUrl);
      toast.success('Transaction link copied!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-4 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black">Payment Successful!</DialogTitle>
          <DialogDescription>
            Your transaction has been sent to the network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 bg-neo-green rounded-full flex items-center justify-center border-4 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              <CheckCircle2 className="w-12 h-12 text-black" />
            </div>
          </motion.div>

          {/* Transaction Details */}
          <div className="bg-muted/30 rounded-xl border-2 border-border p-4 space-y-1">
            <DetailRow label="Amount" value={`${amount} KAS`} />
            <DetailRow label="Network" value={networkName} />
            <DetailRow label="Fee" value={formatFee(fee)} />
            <Separator className="my-3" />
            <DetailRow
              label="Transaction ID"
              value={truncateTxId(transactionId)}
              copyValue={transactionId}
              copyable
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleOpenExplorer}
              className="border-2 border-border hover:bg-muted font-bold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Explorer
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-2 border-border hover:bg-muted font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Done Button */}
          <Button
            className="w-full h-12 text-lg bg-neo-green text-black hover:bg-neo-green/90 border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all font-bold"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>

        {/* Hidden receipt template for download */}
        <ReceiptTemplate
          transactionId={transactionId}
          amount={amount}
          network={network}
          recipientAddress={recipientAddress}
          date={new Date().toLocaleString()}
          fee={fee}
        />
      </DialogContent>
    </Dialog>
  );
}
