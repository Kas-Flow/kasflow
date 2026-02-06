import Link from 'next/link';
import { ArrowRight, Zap, Shield, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-20">
        <div className="flex flex-col items-center space-y-8 text-center max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <Zap className="w-4 h-4 mr-2 text-kaspa-blue" />
            Instant Kaspa Payments
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Accept{' '}
            <span className="bg-gradient-to-r from-kaspa-blue to-kaspa-teal bg-clip-text text-transparent">
              Kaspa
            </span>{' '}
            Payments in Milliseconds
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl">
            Create payment links, showcase Kaspa's speed with real-time confirmations,
            and get paid instantly. No backend required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/create">
                Create Payment Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-2xl">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl font-bold text-kaspa-blue">~1s</div>
              <div className="text-sm text-muted-foreground">Confirmation Time</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl font-bold text-kaspa-blue">0</div>
              <div className="text-sm text-muted-foreground">Backend Setup</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl font-bold text-kaspa-blue">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 border-t">
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why KasFlow?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            The fastest way to accept Kaspa payments for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-kaspa-blue/10">
              <Zap className="w-6 h-6 text-kaspa-blue" />
            </div>
            <h3 className="text-xl font-semibold">Instant Confirmations</h3>
            <p className="text-muted-foreground">
              Kaspa's blockDAG technology delivers confirmations in ~1 second.
              Showcase the speed advantage.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-kaspa-teal/10">
              <Shield className="w-6 h-6 text-kaspa-teal" />
            </div>
            <h3 className="text-xl font-semibold">Passkey Wallets</h3>
            <p className="text-muted-foreground">
              Create secure wallets with your device biometrics. No seed phrases to manage.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-kaspa-blue/10">
              <LinkIcon className="w-6 h-6 text-kaspa-blue" />
            </div>
            <h3 className="text-xl font-semibold">Simple Payment Links</h3>
            <p className="text-muted-foreground">
              Generate shareable payment links with QR codes. No backend infrastructure needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 border-t">
        <div className="flex flex-col items-center space-y-6 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground">
            Create your first payment link in seconds
          </p>
          <Button size="lg" asChild>
            <Link href="/create">
              Create Payment Link
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built for the Kaspa ecosystem
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/yourusername/kasflow"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
