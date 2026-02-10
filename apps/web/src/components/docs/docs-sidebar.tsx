'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCS_NAVIGATION } from '@/lib/constants/docs';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-border/40 p-6 hidden md:block">
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
    </aside>
  );
}
