'use client';

/**
 * PaymentActions - Action buttons for payment receiver page
 * Handles just-in-time wallet auth and actual transaction sending
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WalletAuthModal } from '@/components/wallet/wallet-auth-modal';
import { Wallet, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletStore } from '@/stores/wallet-store';
import { kasToSompi } from '@kasflow/passkey-wallet';

interface PaymentActionsProps {
  address: string;
  amount: string;
  network: string;
  memo?: string;
  onPaymentSent: () => void;
}

export function PaymentActions({ address, amount, network, memo, onPaymentSent }: PaymentActionsProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { wallet, status } = useWalletStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Called after wallet is successfully connected
  const handleWalletConnected = async () => {
    try {
      setIsSending(true);

      if (!wallet) {
        throw new Error('No wallet available');
      }

      console.log('[PaymentActions] Sending payment...', { address, amount, memo });

      // Convert amount to sompi
      const amountInSompi = kasToSompi(parseFloat(amount));

      // Send transaction using wallet
      const result = await wallet.send({
        to: address,
        amount: amountInSompi,
        // Note: memo is not yet supported in the SDK's send() method
        // This will be added when memo support is implemented
      });

      console.log('[PaymentActions] Payment sent successfully:', result);

      toast.success('Payment sent successfully!');
      onPaymentSent();

    } catch (error) {
      console.error('[PaymentActions] Failed to send payment:', error);
      const message = error instanceof Error ? error.message : 'Failed to send payment';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Button
        size="lg"
        className="w-full h-16 text-xl bg-neo-green text-black hover:bg-neo-green/90 border-border shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all"
        onClick={() => setIsAuthOpen(true)}
        disabled={isSending}
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Sending Payment...
          </>
        ) : (
          <>
            <Wallet className="mr-2 w-6 h-6" /> Pay with Wallet
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or send manually</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleCopy}
      >
        {copied ? <Check className="mr-2 w-4 h-4" /> : <Copy className="mr-2 w-4 h-4" />}
        {copied ? 'Copied' : 'Copy Address'}
      </Button>

      <WalletAuthModal
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        network={network}
        onSuccess={handleWalletConnected}
      />
    </div>
  );
}
