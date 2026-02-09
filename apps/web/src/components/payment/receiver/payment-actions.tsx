'use client';

/**
 * PaymentActions - Action buttons for payment receiver page
 * Handles wallet auth THEN explicit transaction signing
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { WalletAuthModal } from '@/components/wallet/wallet-auth-modal';
import { TransactionReceiptModal } from '@/components/payment/transaction-receipt-modal';
import { Wallet, Copy, Check, Loader2, Send } from 'lucide-react';
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
  const [walletReady, setWalletReady] = useState(false);
  const [completedTxId, setCompletedTxId] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [transactionFee, setTransactionFee] = useState<bigint | undefined>();

  const { wallet, status, balance } = useWalletStore();

  // Reset when opening auth modal (allow new payment attempt)
  useEffect(() => {
    if (isAuthOpen) {
      setCompletedTxId(null);
      setWalletReady(false);
    }
  }, [isAuthOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Called when wallet auth completes (passkey/extension)
  const handleWalletConnected = useCallback(() => {
    console.log('[PaymentActions] Wallet authenticated, enabling Send button');
    setWalletReady(true);  // Enable "Send Payment" button
    setIsAuthOpen(false);  // Close auth modal
  }, []);

  // Called when user explicitly clicks "Send Payment"
  const handleSendPayment = useCallback(async () => {
    if (isSending) {
      console.log('[PaymentActions] Already sending');
      return;
    }

    try {
      setIsSending(true);

      if (!wallet) {
        throw new Error('No wallet available');
      }

      // Convert amount to sompi
      const amountInSompi = kasToSompi(parseFloat(amount));

      // Check balance BEFORE attempting to send
      if (balance) {
        const availableBalance = BigInt(balance.available);
        console.log('[PaymentActions] Balance check:', {
          available: availableBalance.toString(),
          required: amountInSompi.toString(),
          sufficient: availableBalance >= amountInSompi
        });

        if (availableBalance < amountInSompi) {
          throw new Error(`Insufficient balance. You need ${amount} KAS but only have ${(Number(availableBalance) / 100000000).toFixed(4)} KAS`);
        }
      }

      console.log('[PaymentActions] Sending payment...', { address, amount });

      // Send transaction with per-transaction passkey authentication
      const result = await wallet.sendWithAuth({
        to: address,
        amount: amountInSompi,
      });

      console.log('[PaymentActions] Payment sent successfully:', result);

      // Store transaction details
      setCompletedTxId(result.transactionId);
      setTransactionFee(result.fee);

      // Show receipt modal
      setReceiptOpen(true);

      // Notify parent
      onPaymentSent();

    } catch (error) {
      console.error('[PaymentActions] Failed to send payment:', error);
      const message = error instanceof Error ? error.message : 'Failed to send payment';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  }, [wallet, address, amount, balance, onPaymentSent]);

  return (
    <div className="w-full space-y-4">
      {!walletReady ? (
        // Show "Pay with Wallet" button
        <Button
          size="lg"
          className="w-full h-16 text-xl bg-neo-green text-black hover:bg-neo-green/90 border-border shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all"
          onClick={() => setIsAuthOpen(true)}
          disabled={isSending}
        >
          <Wallet className="mr-2 w-6 h-6" /> Pay with Wallet
        </Button>
      ) : (
        // After auth, show "Send Payment" button
        <Button
          size="lg"
          className="w-full h-16 text-xl bg-neo-green text-black hover:bg-neo-green/90 border-border shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all"
          onClick={handleSendPayment}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Approve Transaction
            </>
          ) : (
            <>
              <Send className="mr-2 w-6 h-6" /> Send Payment
            </>
          )}
        </Button>
      )}

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

      <TransactionReceiptModal
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        transactionId={completedTxId || ''}
        amount={amount}
        network={network}
        recipientAddress={address}
        fee={transactionFee}
      />
    </div>
  );
}
