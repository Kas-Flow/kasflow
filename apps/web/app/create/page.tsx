import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { PaymentForm } from '@/components/payment/payment-form';

export default function CreatePaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-2xl py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Payment Link
          </h1>
          <p className="text-muted-foreground">
            Generate a shareable payment link with QR code for instant Kaspa payments
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <PaymentForm />
        </div>

        {/* Info Card */}
        <div className="mt-6 rounded-lg border bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Enter the recipient address and amount</li>
            <li>2. Add an optional memo to describe the payment</li>
            <li>3. Get a shareable link with QR code</li>
            <li>4. Share with anyone to receive instant payments</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
