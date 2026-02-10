'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { DocPage } from '@/lib/constants/docs';
import { cn } from '@/lib/utils';

interface DocNavigationProps {
  previous: DocPage | null;
  next: DocPage | null;
}

export function DocNavigation({ previous, next }: DocNavigationProps) {
  if (!previous && !next) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-12 border-t border-border">
      {previous ? (
        <Link
          href={`/docs/${previous.slug}`}
          className={cn(
            "group flex items-center gap-3 px-4 py-3 w-full sm:w-auto rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent",
            "justify-start"
          )}
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Previous</div>
            <div className="text-sm font-semibold">{previous.title}</div>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className={cn(
            "group flex items-center gap-3 px-4 py-3 w-full sm:w-auto rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent",
            "justify-end sm:ml-auto"
          )}
        >
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Next</div>
            <div className="text-sm font-semibold">{next.title}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
