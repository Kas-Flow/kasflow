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
      <PopoverContent className="w-80 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
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
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg cursor-pointer hover:bg-neo-cyan/20 hover:text-neo-cyan transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Refresh balance"
              >
                <RefreshCw className={`w-4 h-4 group-hover:scale-110 transition-transform ${refreshing ? 'animate-spin' : ''}`} />
              </button>
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
              className={`w-full cursor-pointer transition-all duration-200 ${
                copied
                  ? 'bg-neo-green text-black border-neo-green hover:bg-neo-green'
                  : 'hover:bg-neo-yellow/20 hover:border-neo-yellow hover:text-foreground'
              }`}
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
              className="w-full cursor-pointer hover:bg-neo-yellow/20 hover:border-neo-yellow hover:text-foreground transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Explorer
            </Button>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer text-muted-foreground hover:bg-neo-pink/20 hover:text-neo-pink transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Disconnect
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
