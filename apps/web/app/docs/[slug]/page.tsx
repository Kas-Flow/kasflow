import { notFound } from 'next/navigation';
import { getDocPage, getAdjacentPages, ALL_DOC_PAGES } from '@/lib/constants/docs';
import { DocNavigation } from '@/components/docs/doc-navigation';

// Import all doc content components
import { IntroductionContent } from '@/components/docs/content/introduction';
import { QuickstartContent } from '@/components/docs/content/quickstart';
import { CreatePaymentContent } from '@/components/docs/content/create-payment';
import { SendPaymentContent } from '@/components/docs/content/send-payment';
import { ReceivePaymentContent } from '@/components/docs/content/receive-payment';
import { PasskeyWalletContent } from '@/components/docs/content/passkey-wallet';
import { NetworksContent } from '@/components/docs/content/networks';
import { FaqContent } from '@/components/docs/content/faq';
import { SecurityContent } from '@/components/docs/content/security';
import { TroubleshootingContent } from '@/components/docs/content/troubleshooting';

// Map slugs to their content components
const CONTENT_COMPONENTS: Record<string, React.ComponentType> = {
  introduction: IntroductionContent,
  quickstart: QuickstartContent,
  'create-payment': CreatePaymentContent,
  'send-payment': SendPaymentContent,
  'receive-payment': ReceivePaymentContent,
  'passkey-wallet': PasskeyWalletContent,
  networks: NetworksContent,
  faq: FaqContent,
  security: SecurityContent,
  troubleshooting: TroubleshootingContent,
};

export function generateStaticParams() {
  return ALL_DOC_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = getDocPage(params.slug);

  if (!page) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${page.title} - KasFlow Docs`,
    description: page.description,
  };
}

export default async function DocPageContent(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = getDocPage(params.slug);

  if (!page) {
    notFound();
  }

  const { previous, next } = getAdjacentPages(params.slug);
  const ContentComponent = CONTENT_COMPONENTS[params.slug];

  if (!ContentComponent) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-4 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{page.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{page.description}</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
        prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-3xl
        prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-2xl
        prose-p:leading-relaxed prose-p:text-foreground/80
        prose-strong:text-foreground prose-strong:font-bold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-li:text-foreground/80 prose-li:marker:text-primary
        prose-ul:text-foreground/80 prose-ol:text-foreground/80
        prose-img:rounded-xl prose-img:border prose-img:shadow-md
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-primary prose-blockquote:text-foreground/70">
        <ContentComponent />
      </div>

      {/* Navigation */}
      <DocNavigation previous={previous} next={next} />
    </div>
  );
}
