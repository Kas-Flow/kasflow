'use client';

/**
 * WalletModal - Modal for creating, unlocking, and connecting wallets
 * Supports passkey wallets and KIP-12 wallet extensions
 */

import { useState, useEffect } from 'react';
import { Fingerprint, Key, Wallet, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWalletStore } from '@/stores/wallet-store';
import { PasskeyWallet } from '@kasflow/passkey-wallet';

// =============================================================================
// Types
// =============================================================================

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// =============================================================================
// WalletModal Component
// =============================================================================

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'unlock' | 'connect'>('create');
  const [walletName, setWalletName] = useState('KasFlow Wallet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletExists, setWalletExists] = useState(false);

  const { createWallet, unlockWallet, status } = useWalletStore();

  // Check if wallet exists on mount
  useEffect(() => {
    const checkWallet = async () => {
      const exists = await PasskeyWallet.exists();
      setWalletExists(exists);

      // Auto-select unlock tab if wallet exists
      if (exists) {
        setActiveTab('unlock');
      }
    };
    checkWallet();
  }, [open]);

  // Close modal when wallet is connected
  useEffect(() => {
    if (status === 'connected') {
      onOpenChange(false);
      setError(null);
      setLoading(false);
    }
  }, [status, onOpenChange]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleCreateWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('[WalletModal] Creating wallet...', walletName);
      await createWallet(walletName || 'KasFlow Wallet');
      console.log('[WalletModal] Wallet created successfully');
    } catch (err) {
      console.error('[WalletModal] Failed to create wallet:', err);
      const message = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(message);
      setLoading(false);
    }
  };

  const handleUnlockWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      await unlockWallet();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unlock wallet';
      setError(message);
      setLoading(false);
    }
  };

  const handleConnectExtension = () => {
    // TODO: Implement KIP-12 wallet extension connection
    setError('KIP-12 wallet extension support coming soon!');
  };

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Create a passkey wallet or connect your existing wallet
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" disabled={walletExists}>
              Create
            </TabsTrigger>
            <TabsTrigger value="unlock">
              Unlock
            </TabsTrigger>
            <TabsTrigger value="connect">
              Connect
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Fingerprint className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Create Passkey Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Secure your wallet with your device biometrics (Face ID, Touch ID, etc.)
                </p>
              </div>
            </div>

            {walletExists && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Wallet already exists. Please unlock your existing wallet.
                </AlertDescription>
              </Alert>
            )}

            {!walletExists && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wallet-name">Wallet Name (Optional)</Label>
                  <Input
                    id="wallet-name"
                    placeholder="My Kaspa Wallet"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    This name helps you identify your passkey
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleCreateWallet}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Wallet...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Create Wallet
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          {/* Unlock Tab */}
          <TabsContent value="unlock" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Key className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Unlock Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Use your passkey to unlock your existing wallet
                </p>
              </div>
            </div>

            {!walletExists && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No wallet found. Please create a new wallet first.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleUnlockWallet}
              disabled={loading || !walletExists}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Unlock with Passkey
                </>
              )}
            </Button>
          </TabsContent>

          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Wallet className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Connect Extension</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your KIP-12 compatible wallet extension
                </p>
              </div>
            </div>

            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleConnectExtension} className="w-full" variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Connect KIP-12 Wallet
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              KIP-12 extension support coming soon
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
