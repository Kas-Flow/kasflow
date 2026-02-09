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
        <main className="flex-1 px-8 py-12 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
