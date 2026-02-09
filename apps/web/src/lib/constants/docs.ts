/**
 * Documentation navigation structure and metadata
 */

export interface DocPage {
  title: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}

export const DOCS_NAVIGATION: DocSection[] = [
  {
    title: 'Getting Started',
    pages: [
      {
        title: 'What is KasFlow?',
        slug: 'introduction',
        description: 'Learn about KasFlow and instant Kaspa payments',
        icon: '🚀',
      },
      {
        title: 'Quick Start',
        slug: 'quickstart',
        description: 'Get started in under 5 minutes',
        icon: '⚡',
      },
    ],
  },
  {
    title: 'Payment Guides',
    pages: [
      {
        title: 'Create Payment Links',
        slug: 'create-payment',
        description: 'Generate payment links and QR codes for your business',
        icon: '🔗',
      },
      {
        title: 'Send a Payment',
        slug: 'send-payment',
        description: 'Pay anyone with your KasFlow wallet',
        icon: '💸',
      },
      {
        title: 'Receive Payments',
        slug: 'receive-payment',
        description: 'Accept Kaspa payments instantly',
        icon: '📥',
      },
    ],
  },
  {
    title: 'Wallet',
    pages: [
      {
        title: 'Passkey Wallet Guide',
        slug: 'passkey-wallet',
        description: 'Biometric authentication made simple',
        icon: '🔐',
      },
      {
        title: 'Networks',
        slug: 'networks',
        description: 'Understanding mainnet and testnet',
        icon: '🌐',
      },
    ],
  },
  {
    title: 'Help',
    pages: [
      {
        title: 'FAQ',
        slug: 'faq',
        description: 'Frequently asked questions',
        icon: '❓',
      },
      {
        title: 'Security & Privacy',
        slug: 'security',
        description: 'How we keep your funds safe',
        icon: '🛡️',
      },
      {
        title: 'Troubleshooting',
        slug: 'troubleshooting',
        description: 'Common issues and solutions',
        icon: '🔧',
      },
    ],
  },
];

// Flatten all pages for easy lookup
export const ALL_DOC_PAGES = DOCS_NAVIGATION.flatMap((section) => section.pages);

// Helper to get page by slug
export function getDocPage(slug: string): DocPage | undefined {
  return ALL_DOC_PAGES.find((page) => page.slug === slug);
}

// Helper to get next/previous pages
export function getAdjacentPages(slug: string): {
  previous: DocPage | null;
  next: DocPage | null;
} {
  const index = ALL_DOC_PAGES.findIndex((page) => page.slug === slug);

  return {
    previous: index > 0 ? ALL_DOC_PAGES[index - 1] : null,
    next: index < ALL_DOC_PAGES.length - 1 ? ALL_DOC_PAGES[index + 1] : null,
  };
}
