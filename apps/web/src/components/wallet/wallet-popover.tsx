'use client';

/**
 * WalletPopover - Popover showing wallet info and actions
 * Displays address, balance, copy, refresh, and disconnect options
 *
 * Uses @kasflow/wallet-connector for wallet state
 */

import { useState, useEffect } from 'react';
import { Copy, LogOut, RefreshCw, Check, ExternalLink } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWallet, useAccount, useBalance, useNetwork } from '@kasflow/wallet-connector/react';
import { toast } from 'sonner';
import { getExplorerAddressUrl } from '@/lib/constants/kaspa';
import { NetworkSwitcher } from './network-switcher';

// =============================================================================
// WalletPopover Component
// =============================================================================

export function WalletPopover() {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use new wallet-connector hooks
  const { disconnect } = useWallet();
  const { address, shortAddress, copy: copyAddress } = useAccount();
  const { formattedAvailable, refresh: refreshBalance } = useBalance();
  const { network } = useNetwork();

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleCopy = async () => {
    if (!address) return;
    const success = await copyAddress();
    if (success) {
      setCopied(true);
      toast.success('Address copied to clipboard');
    } else {
      toast.error('Failed to copy address');
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshBalance();
      toast.success('Balance refreshed');
    } catch {
      toast.error('Failed to refresh balance');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast.info('Wallet disconnected');
  };

  const handleExplorer = () => {
    if (!address) return;
    const explorerUrl = getExplorerAddressUrl(address, network);
    window.open(explorerUrl, '_blank');
  };

  // =============================================================================
  // Render
  // =============================================================================

  if (!address) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="font-mono">
          {shortAddress}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Your Wallet</h4>
            <p className="text-sm text-muted-foreground font-mono">
              {shortAddress}
            </p>
          </div>

          <Separator />

          {/* Network Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Network</span>
              <NetworkSwitcher />
            </div>

            <p className="text-xs text-muted-foreground italic">
              Switch networks instantly - your addresses are pre-computed for all networks.
            </p>
          </div>

          <Separator />

          {/* Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="text-2xl font-bold">
              {formattedAvailable} <span className="text-sm font-normal text-muted-foreground">KAS</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExplorer}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Explorer
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="w-full text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
