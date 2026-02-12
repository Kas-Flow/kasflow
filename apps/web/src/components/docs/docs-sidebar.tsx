'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCS_NAVIGATION } from '@/lib/constants/docs';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronLeft } from 'lucide-react';

const HINT_STORAGE_KEY = 'kasflow_docs_menu_hint_seen';

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-8">
      {DOCS_NAVIGATION.map((section) => (
        <div key={section.title}>
          <h4 className="font-semibold text-sm tracking-tight text-foreground mb-3 px-3">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.pages.map((page) => {
              const href = `/docs/${page.slug}`;
              const isActive = pathname === href;

              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <span>{page.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem(HINT_STORAGE_KEY);
    if (!hasSeenHint) {
      // Small delay before showing hint
      const showTimer = setTimeout(() => setShowHint(true), 500);
      // Hide hint after 3 seconds and mark as seen
      const hideTimer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem(HINT_STORAGE_KEY, 'true');
      }, 3500);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleOpenMenu = () => {
    setIsOpen(true);
    setShowHint(false);
    localStorage.setItem(HINT_STORAGE_KEY, 'true');
  };

  return (
    <>
      {/* Mobile Menu Hint - slides in from left edge */}
      <div
        className={cn(
          'fixed top-1/2 -translate-y-1/2 left-0 z-40 md:hidden transition-transform duration-300 ease-out',
          showHint ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={handleOpenMenu}
          className="flex items-center gap-1 bg-primary text-primary-foreground pl-3 pr-2 py-3 rounded-r-lg shadow-lg text-sm font-medium"
        >
          <span>Menu</span>
          <ChevronLeft className="w-4 h-4 animate-pulse" />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={handleOpenMenu}
        className={cn(
          'fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-all',
          showHint && 'animate-bounce'
        )}
        aria-label="Open documentation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg">Documentation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <SidebarContent onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-border/40 p-6 hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
}
