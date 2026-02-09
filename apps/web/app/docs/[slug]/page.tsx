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

export function generateMetadata({ params }: { params: { slug: string } }) {
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

export default function DocPageContent({ params }: { params: { slug: string } }) {
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        {page.icon && <div className="text-5xl">{page.icon}</div>}
        <h1 className="text-5xl font-black tracking-tight">{page.title}</h1>
        <p className="text-xl text-muted-foreground">{page.description}</p>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ContentComponent />
      </div>

      {/* Navigation */}
      <DocNavigation previous={previous} next={next} />
    </div>
  );
}
