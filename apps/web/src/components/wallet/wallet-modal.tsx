'use client';

/**
 * WalletModal - Modern wallet connection modal
 * Auto-detects user state and shows appropriate auth flow
 */

import { useState, useEffect } from 'react';
import { Fingerprint, Wallet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useWalletStore } from '@/stores/wallet-store';
import { WelcomeScreen } from './welcome-screen';
import { AuthMethodCard } from './auth-method-card';
import { pageVariants, pageTransition, staggerContainer } from '@/lib/constants/animations';
import { NETWORK_ID, NETWORK_NAMES } from '@/lib/constants/kaspa';
import confetti from 'canvas-confetti';

// =============================================================================
// Types
// =============================================================================

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalView = 'welcome' | 'auth-selection' | 'authenticating' | 'success' | 'error';

// =============================================================================
// WalletModal Component
// =============================================================================

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const [view, setView] = useState<ModalView>('welcome');
  const [selectedMethod, setSelectedMethod] = useState<'passkey' | 'kip12' | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(NETWORK_ID.TESTNET_10);
  const [error, setError] = useState<string | null>(null);

  const {
    createWallet,
    unlockWallet,
    connectKIP12,
    detectUserState,
    markOnboardingComplete,
    setNetwork,
    isFirstTimeUser,
    walletExists,
    kip12Available,
    status,
  } = useWalletStore();

  // Detect user state when modal opens
  useEffect(() => {
    if (open) {
      detectUserState().then(() => {
        // Skip welcome if returning user
        if (!isFirstTimeUser) {
          setView('auth-selection');
        } else {
          setView('welcome');
        }
      });
    }
  }, [open, detectUserState, isFirstTimeUser]);

  // Auto-close on success
  useEffect(() => {
    if (status === 'connected' && view !== 'success') {
      setView('success');

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#49EACB', '#bef264', '#f472b6']
      });

      // Close after showing success
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 1500);
    }
  }, [status, view, onOpenChange]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setView('welcome');
    setSelectedMethod(null);
    setError(null);
  };

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleWelcomeContinue = () => {
    markOnboardingComplete();
    setView('auth-selection');
  };

  const handlePasskeyAuth = async () => {
    setSelectedMethod('passkey');
    setView('authenticating');
    setError(null);

    try {
      // Set network BEFORE creating/unlocking wallet
      console.log('[WalletModal] Setting network to:', selectedNetwork);
      setNetwork(selectedNetwork as any);

      // Smart detection: unlock if exists, create if doesn't
      if (walletExists) {
        console.log('[WalletModal] Unlocking existing wallet...');
        await unlockWallet();
      } else {
        console.log('[WalletModal] Creating new wallet...');
        await createWallet('KasFlow Wallet');
      }
      // Success handled by useEffect watching status
    } catch (err) {
      console.error('[WalletModal] Authentication failed:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
      setView('error');
    }
  };

  const handleKIP12Auth = async () => {
    setSelectedMethod('kip12');
    setView('authenticating');
    setError(null);

    try {
      // Set network BEFORE connecting
      console.log('[WalletModal] Setting network to:', selectedNetwork);
      setNetwork(selectedNetwork as any);

      // Check if window.kaspa exists
      if (typeof window === 'undefined' || !('kaspa' in window)) {
        throw new Error('No KIP-12 wallet extension detected');
      }

      console.log('[WalletModal] Connecting to KIP-12 wallet...');

      // Call the extension's connect method
      const kaspa = (window as any).kaspa;
      const result = await kaspa.request({ method: 'kas_requestAccounts' });

      if (!result || !result[0]) {
        throw new Error('No accounts returned from wallet');
      }

      const address = result[0];
      await connectKIP12(address);

      // Success handled by useEffect
    } catch (err) {
      console.error('[WalletModal] KIP-12 connection failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to connect wallet extension';
      setError(message);
      setView('error');
    }
  };

  const handleRetry = () => {
    setView('auth-selection');
    setSelectedMethod(null);
    setError(null);
  };

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-4 border-black shadow-[8px_8px_0px_0px_#000]">
        <div className="h-[600px] relative">
          <AnimatePresence mode="wait">
            {/* Welcome Screen */}
            {view === 'welcome' && (
              <motion.div
                key="welcome"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0"
              >
                <WelcomeScreen onGetStarted={handleWelcomeContinue} />
              </motion.div>
            )}

            {/* Auth Method Selection */}
            {view === 'auth-selection' && (
              <motion.div
                key="auth-selection"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0 p-8 flex flex-col justify-center"
              >
                <DialogHeader className="text-center mb-6">
                  <DialogTitle className="text-2xl font-black">Connect Wallet</DialogTitle>
                  <DialogDescription>
                    Select network and authentication method
                  </DialogDescription>
                </DialogHeader>

                {/* Network Selection */}
                <div className="mb-6 p-4 bg-muted/30 rounded-xl border-2 border-border">
                  <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {walletExists ? 'Connect on Network' : 'Start on Network'}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    {walletExists
                      ? 'Your wallet works on all networks - choose which to connect to now'
                      : 'Your wallet will work on all networks - choose which to start on'}
                  </p>
                  <RadioGroup
                    value={selectedNetwork}
                    onValueChange={setSelectedNetwork}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value={NETWORK_ID.MAINNET}
                        id="mainnet"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="mainnet"
                        className="flex items-center justify-center px-4 py-3 rounded-lg border-2 font-bold cursor-pointer transition-all
                                   peer-data-[state=checked]:bg-neo-green peer-data-[state=checked]:text-black peer-data-[state=checked]:border-border peer-data-[state=checked]:shadow-[4px_4px_0px_0px_var(--shadow-color)]
                                   peer-data-[state=unchecked]:bg-background peer-data-[state=unchecked]:border-border peer-data-[state=unchecked]:hover:bg-muted"
                      >
                        {NETWORK_NAMES[NETWORK_ID.MAINNET]}
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem
                        value={NETWORK_ID.TESTNET_10}
                        id="testnet"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="testnet"
                        className="flex items-center justify-center px-4 py-3 rounded-lg border-2 font-bold cursor-pointer transition-all
                                   peer-data-[state=checked]:bg-neo-green peer-data-[state=checked]:text-black peer-data-[state=checked]:border-border peer-data-[state=checked]:shadow-[4px_4px_0px_0px_var(--shadow-color)]
                                   peer-data-[state=unchecked]:bg-background peer-data-[state=unchecked]:border-border peer-data-[state=unchecked]:hover:bg-muted"
                      >
                        Testnet
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4"
                >
                  {/* Passkey Wallet */}
                  <AuthMethodCard
                    title="Passkey Wallet"
                    description="Use Face ID, Touch ID, or device password"
                    icon={<Fingerprint className="w-6 h-6" />}
                    recommended
                    onClick={handlePasskeyAuth}
                  />

                  {/* KIP-12 Extension */}
                  {kip12Available ? (
                    <AuthMethodCard
                      title="Wallet Extension"
                      description="Connect your KIP-12 compatible wallet"
                      icon={<Wallet className="w-6 h-6" />}
                      onClick={handleKIP12Auth}
                    />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground mt-4 p-4 border-2 border-border rounded-xl bg-muted/30">
                      <p className="font-semibold mb-1">No wallet extension detected</p>
                      <p className="text-xs">
                        Install Kasware or Kaspium to use extension wallets
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Authenticating */}
            {view === 'authenticating' && (
              <motion.div
                key="authenticating"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {selectedMethod === 'passkey'
                    ? (walletExists ? 'Unlocking Wallet...' : 'Creating Wallet...')
                    : 'Connecting Extension...'
                  }
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {selectedMethod === 'passkey'
                    ? 'Please complete the biometric authentication'
                    : 'Please approve the connection in your wallet extension'
                  }
                </p>
              </motion.div>
            )}

            {/* Success */}
            {view === 'success' && (
              <motion.div
                key="success"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-neo-green rounded-full flex items-center justify-center mb-4 border-4 border-black"
                >
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2">Connected!</h3>
                <p className="text-sm text-muted-foreground">
                  Your wallet is ready to use
                </p>
              </motion.div>
            )}

            {/* Error */}
            {view === 'error' && (
              <motion.div
                key="error"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4 border-4 border-destructive"
                >
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </motion.div>

                <h3 className="text-xl font-bold mb-4 text-center">Connection Failed</h3>

                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="px-6 py-2 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
