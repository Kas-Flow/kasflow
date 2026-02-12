'use client';

/**
 * Navbar - Main navigation bar with wallet button
 * Neo-brutalism styled with balanced layout
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, BookOpen, Menu, X } from 'lucide-react';
import { WalletButton } from '@/components/wallet';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/create', label: 'Create', icon: PlusCircle },
  { href: '/docs', label: 'Docs', icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b-4 border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-neo-green rounded-lg flex items-center justify-center border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] group-hover:shadow-[4px_4px_0px_0px_var(--border)] group-hover:-translate-y-0.5 transition-all">
                <span className="text-black font-black text-lg">K</span>
              </div>
              <span className="text-xl font-black tracking-tight hidden sm:block">KasFlow</span>
            </Link>

            {/* Navigation Links - Center (Desktop) */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center bg-muted/50 rounded-full p-1 border-2 border-border">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                        isActive
                          ? "bg-neo-green text-black shadow-[2px_2px_0px_0px_var(--border)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-card z-50 transform transition-transform duration-300 ease-in-out md:hidden border-r-4 border-border',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-border">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-neo-green rounded-lg flex items-center justify-center border-2 border-border">
              <span className="text-black font-black text-lg">K</span>
            </div>
            <span className="text-xl font-black tracking-tight">KasFlow</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all",
                  isActive
                    ? "bg-neo-green text-black"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
