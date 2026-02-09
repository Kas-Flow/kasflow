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
import { useWalletStore } from '@/stores/wallet-store';
import { NETWORK_ID, type NetworkId } from '@kasflow/passkey-wallet';
import { NETWORK_NAMES } from '@/lib/constants/kaspa';
import { toast } from 'sonner';

export function NetworkSwitcher() {
  const [open, setOpen] = useState(false);
  const network = useWalletStore((state) => state.network);
  const switching = useWalletStore((state) => state.switching);
  const { switchNetwork } = useWalletStore();

  const handleSwitchNetwork = async (newNetwork: string) => {
    if (switching) return;

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
    }
  };

  // Network options: Mainnet and Testnet only (simplified)
  const networks = [
    { id: NETWORK_ID.MAINNET, name: NETWORK_NAMES[NETWORK_ID.MAINNET] },
    { id: NETWORK_ID.TESTNET_10, name: 'Testnet' },
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
