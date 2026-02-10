'use client';

/**
 * PaymentActions - Action buttons for payment receiver page
 * Uses wallet-connector for unified wallet management
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TransactionReceiptModal } from '@/components/payment/transaction-receipt-modal';
import { Wallet, Copy, Check, Loader2, Send, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet, useConnect } from '@kasflow/wallet-connector/react';
import { kasToSompi } from '@kasflow/passkey-wallet';

interface PaymentActionsProps {
  address: string;
  amount: string;
  network: string;
  memo?: string;
  onPaymentSent: () => void;
}

export function PaymentActions({ address, amount, network, memo, onPaymentSent }: PaymentActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [completedTxId, setCompletedTxId] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [transactionFee, setTransactionFee] = useState<bigint | undefined>();

  // Use wallet-connector hooks
  const {
    connected,
    balance,
    currentAdapter,
    sendTransaction
  } = useWallet();

  const { openModal } = useConnect();

  // Get wallet type for display
  const walletType = currentAdapter?.metadata.type;
  const walletName = currentAdapter?.metadata.displayName;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle the pay button click
  const handlePayClick = useCallback(async () => {
    if (!connected) {
      // Not connected - open the wallet connect modal
      openModal();
      return;
    }

    // Already connected - proceed with payment
    if (isSending) {
      console.log('[PaymentActions] Already sending');
      return;
    }

    try {
      setIsSending(true);
      // Reset previous transaction data
      setCompletedTxId(null);
      setReceiptOpen(false);

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

      console.log('[PaymentActions] Sending payment via', walletType, '...', { address, amount });

      // Send transaction via wallet-connector
      // The adapter handles the signing (passkey auth or KasWare approval)
      const result = await sendTransaction({
        to: address,
        amount: amountInSompi,
        memo: memo,
      });

      console.log('[PaymentActions] Payment sent successfully:', result);
      console.log('[PaymentActions] Transaction ID from result:', result.txId);
      console.log('[PaymentActions] Fee from result:', result.fee?.toString());

      // Store transaction details - IMPORTANT: Set state before opening modal
      const txId = result.txId;
      console.log('[PaymentActions] Setting completedTxId to:', txId);
      setCompletedTxId(txId);

      // Set the fee if available
      if (result.fee) {
        setTransactionFee(result.fee);
      }

      // Small delay to ensure state is set before modal opens
      await new Promise(resolve => setTimeout(resolve, 50));

      // Show receipt modal
      setReceiptOpen(true);
      console.log('[PaymentActions] Receipt modal opened with txId:', txId);

      // Notify parent
      onPaymentSent();

    } catch (error) {
      console.error('[PaymentActions] Failed to send payment:', error);
      const message = error instanceof Error ? error.message : 'Failed to send payment';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  }, [connected, isSending, balance, amount, address, memo, walletType, sendTransaction, openModal, onPaymentSent]);

  // Get button content based on state
  const getButtonContent = () => {
    if (isSending) {
      return (
        <>
          <Loader2 className="mr-2 w-6 h-6 animate-spin" />
          {walletType === 'passkey' ? 'Authenticate to Send...' : 'Confirm in Wallet...'}
        </>
      );
    }

    if (connected) {
      return (
        <>
          {walletType === 'passkey' ? (
            <Fingerprint className="mr-2 w-6 h-6" />
          ) : (
            <Send className="mr-2 w-6 h-6" />
          )}
          Send {amount} KAS
        </>
      );
    }

    return (
      <>
        <Wallet className="mr-2 w-6 h-6" /> Connect Wallet to Pay
      </>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Main pay button */}
      <Button
        size="lg"
        className="w-full h-16 text-xl bg-neo-green text-black hover:bg-neo-green/90 border-border shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all"
        onClick={handlePayClick}
        disabled={isSending}
      >
        {getButtonContent()}
      </Button>

      {/* Show connected wallet info */}
      {connected && walletName && (
        <div className="text-center text-sm text-muted-foreground">
          Connected via <span className="font-semibold text-foreground">{walletName}</span>
        </div>
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
