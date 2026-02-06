'use client';

/**
 * WalletButton - Button to open wallet modal or show wallet info
 * Shows different states based on wallet connection status
 */

import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletStore, selectStatus, selectIsConnected } from '@/stores/wallet-store';
import { WalletModal } from './wallet-modal';
import { WalletPopover } from './wallet-popover';

// =============================================================================
// WalletButton Component
// =============================================================================

export function WalletButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const status = useWalletStore(selectStatus);
  const isConnected = useWalletStore(selectIsConnected);

  // If connected, show popover with wallet info
  if (isConnected) {
    return (
      <>
        <WalletPopover />
        <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  // Show loading state
  if (status === 'connecting') {
    return (
      <Button disabled variant="outline">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // Show connect button
  return (
    <>
      <Button onClick={() => setModalOpen(true)} variant="default">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
      <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
