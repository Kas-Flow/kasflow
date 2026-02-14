'use client';

/**
 * WalletButton - Button to open wallet modal or show wallet info
 * Shows different states based on wallet connection status
 *
 * Now uses @kasflow/wallet-connector hooks for state management
 */

import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnect } from '@kasflow/wallet-connector/react';
import { WalletPopover } from './wallet-popover';
import { LogoSpinner } from '@/components/ui/logo-spinner';

// =============================================================================
// WalletButton Component
// =============================================================================

export function WalletButton() {
  const { connected, connecting, openModal } = useConnect();

  // If connected, show popover with wallet info
  if (connected) {
    return <WalletPopover />;
  }

  // Show loading state
  if (connecting) {
    return (
      <Button disabled variant="outline">
        <LogoSpinner size="sm" className="mr-2" />
        Connecting...
      </Button>
    );
  }

  // Show connect button - openModal triggers the WalletModal from wallet-connector
  return (
    <Button onClick={openModal} variant="default">
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
