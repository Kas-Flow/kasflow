'use client';

/**
 * Navbar - Main navigation bar with wallet button
 * Neo-brutalism styled with balanced layout
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, BookOpen } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-neo-green rounded-lg flex items-center justify-center border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] group-hover:shadow-[4px_4px_0px_0px_var(--border)] group-hover:-translate-y-0.5 transition-all">
              <span className="text-black font-black text-lg">K</span>
            </div>
            <span className="text-xl font-black tracking-tight">KasFlow</span>
          </Link>

          {/* Navigation Links - Center */}
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
          <div className="flex items-center gap-3">
            <ModeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
