'use client';

import { useState } from 'react';
import { Network, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNetwork, type NetworkId } from '@kasflow/wallet-connector/react';
import { NETWORK_NAMES } from '@/lib/constants/kaspa';
import { toast } from 'sonner';

export function NetworkSwitcher() {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { network, switchNetwork } = useNetwork();

  const handleSwitchNetwork = async (newNetwork: string) => {
    if (switching) return;

    setSwitching(true);
    const loadingToast = toast.loading(`Switching to ${NETWORK_NAMES[newNetwork as NetworkId]}...`);

    try {
      await switchNetwork(newNetwork as NetworkId);
      toast.success(`Switched to ${NETWORK_NAMES[newNetwork as NetworkId]}`, {
        id: loadingToast,
        description: 'Balance refreshed successfully',
      });
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to switch network', {
        id: loadingToast,
        description: message.includes('cancel')
          ? 'Authentication was cancelled'
          : `Could not connect. Reverted to ${NETWORK_NAMES[network]}.`,
      });
    } finally {
      setSwitching(false);
    }
  };

  // Network options: Mainnet and Testnet only (simplified)
  const networks = [
    { id: 'mainnet' as NetworkId, name: NETWORK_NAMES['mainnet'] },
    { id: 'testnet-10' as NetworkId, name: 'Testnet' },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          disabled={switching}
        >
          <div className="flex items-center">
            <Network className="w-4 h-4 mr-2" />
            <span className="text-sm">{NETWORK_NAMES[network]}</span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={network} onValueChange={handleSwitchNetwork}>
          {networks.map((net) => (
            <DropdownMenuRadioItem
              key={net.id}
              value={net.id}
              disabled={switching}
            >
              {net.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
