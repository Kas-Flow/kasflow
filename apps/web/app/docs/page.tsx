import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DOCS_NAVIGATION } from '@/lib/constants/docs';

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tight">
          KasFlow Documentation
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about using KasFlow for instant Kaspa payments.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {DOCS_NAVIGATION.map((section) =>
          section.pages.map((page) => (
            <Link
              key={page.slug}
              href={`/docs/${page.slug}`}
              className="group p-6 bg-card rounded-xl border-4 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="flex items-start gap-4">
                {page.icon && (
                  <span className="text-4xl flex-shrink-0">{page.icon}</span>
                )}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold group-hover:text-neo-cyan transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-neo-cyan group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Getting Started CTA */}
      <div className="p-8 bg-gradient-to-br from-neo-cyan/20 to-neo-green/20 rounded-xl border-4 border-border shadow-[6px_6px_0px_0px_var(--shadow-color)]">
        <div className="space-y-4">
          <h2 className="text-2xl font-black">New to KasFlow?</h2>
          <p className="text-muted-foreground">
            Start with our Quick Start guide to create your first payment in under 5 minutes.
          </p>
          <Link
            href="/docs/quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-2xl font-black mb-6">Need Help?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/docs/faq"
            className="p-4 bg-card rounded-lg border-2 border-border hover:border-neo-cyan transition-colors"
          >
            <div className="text-2xl mb-2">❓</div>
            <h3 className="font-bold">FAQ</h3>
            <p className="text-sm text-muted-foreground">Common questions</p>
          </Link>
          <Link
            href="/docs/troubleshooting"
            className="p-4 bg-card rounded-lg border-2 border-border hover:border-neo-pink transition-colors"
          >
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-bold">Troubleshooting</h3>
            <p className="text-sm text-muted-foreground">Fix common issues</p>
          </Link>
          <a
            href="https://github.com/yourusername/kasflow/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-card rounded-lg border-2 border-border hover:border-neo-yellow transition-colors"
          >
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-bold">Get Support</h3>
            <p className="text-sm text-muted-foreground">Open an issue</p>
          </a>
        </div>
      </div>
    </div>
  );
}
