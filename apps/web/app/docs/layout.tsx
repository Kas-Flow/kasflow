import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Documentation - KasFlow',
  description: 'Learn how to use KasFlow for instant Kaspa payments',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <DocsSidebar />
        <main className="flex-1 px-4 py-8 md:px-8 md:py-12 max-w-4xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
