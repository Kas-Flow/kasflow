'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function DocImage({ src, alt, caption, className }: DocImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <figure className="my-8">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'block w-full cursor-zoom-in group relative',
            className
          )}
        >
          <img
            src={src}
            alt={alt}
            className="rounded-xl border border-border shadow-lg w-full transition-all group-hover:shadow-xl group-hover:border-primary/50"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              Click to enlarge
            </span>
          </div>
        </button>
        {caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-3">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
