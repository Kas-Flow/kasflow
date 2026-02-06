'use client';

/**
 * Navbar - Main navigation bar with wallet button
 */

import Link from 'next/link';
import { WalletButton } from '@/components/wallet';
import { ModeToggle } from '@/components/mode-toggle';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kaspa-blue to-kaspa-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-kaspa-blue to-kaspa-teal bg-clip-text text-transparent">
              KasFlow
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Payment
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
