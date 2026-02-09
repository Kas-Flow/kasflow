'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCS_NAVIGATION } from '@/lib/constants/docs';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-border p-6">
      <nav className="space-y-8">
        {DOCS_NAVIGATION.map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
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
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-neo-cyan text-black font-bold border-2 border-border shadow-[2px_2px_0px_0px_var(--shadow-color)]'
                      )}
                    >
                      {page.icon && <span className="text-lg">{page.icon}</span>}
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
