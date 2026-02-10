import Link from 'next/link';
import { 
  ArrowRight, 
  Book, 
  CreditCard, 
  Wallet, 
  Shield, 
  HelpCircle, 
  Zap,
  Globe,
  LifeBuoy,
  Github
} from 'lucide-react';
import { DOCS_NAVIGATION } from '@/lib/constants/docs';

// Helper to get an icon based on slug or section
const getIconForPage = (slug: string) => {
  switch (slug) {
    case 'introduction': return <Book className="w-5 h-5" />;
    case 'quickstart': return <Zap className="w-5 h-5" />;
    case 'create-payment': return <CreditCard className="w-5 h-5" />;
    case 'send-payment': return <ArrowRight className="w-5 h-5" />; // Or Send icon if available
    case 'receive-payment': return <CreditCard className="w-5 h-5" />;
    case 'passkey-wallet': return <Wallet className="w-5 h-5" />;
    case 'networks': return <Globe className="w-5 h-5" />;
    case 'faq': return <HelpCircle className="w-5 h-5" />;
    case 'security': return <Shield className="w-5 h-5" />;
    case 'troubleshooting': return <LifeBuoy className="w-5 h-5" />;
    default: return <Book className="w-5 h-5" />;
  }
};

export default function DocsPage() {
  return (
    <div className="space-y-16 pb-12">
      {/* Header */}
      <div className="space-y-6 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Learn how to integrate KasFlow, manage wallets, and process instant Kaspa payments securely.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
           <Link
            href="/docs/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Quick Start
          </Link>
          <a
            href="https://github.com/yourusername/kasflow" // Assuming this URL based on context, update if needed
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium rounded-md transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-16">
        {DOCS_NAVIGATION.map((section) => (
          <div key={section.title} className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/docs/${page.slug}`}
                  className="group relative flex flex-col gap-2 p-6 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                >
                  <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                    {getIconForPage(page.slug)}
                    <span className="font-semibold text-foreground">{page.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="rounded-xl border bg-muted/50 p-8 mt-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Need more help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our GitHub discussions or join the community.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/yourusername/kasflow/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Open an Issue <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}