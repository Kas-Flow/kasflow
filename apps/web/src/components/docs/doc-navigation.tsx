'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { DocPage } from '@/lib/constants/docs';

interface DocNavigationProps {
  previous: DocPage | null;
  next: DocPage | null;
}

export function DocNavigation({ previous, next }: DocNavigationProps) {
  if (!previous && !next) return null;

  return (
    <div className="flex items-center justify-between pt-8 mt-12 border-t border-border">
      {previous ? (
        <Link
          href={`/docs/${previous.slug}`}
          className="flex items-center gap-2 px-4 py-3 bg-card rounded-lg border-2 border-border hover:border-neo-cyan hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Previous</div>
            <div className="font-bold">{previous.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="flex items-center gap-2 px-4 py-3 bg-card rounded-lg border-2 border-border hover:border-neo-pink hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="font-bold">{next.title}</div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
