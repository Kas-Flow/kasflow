'use client';

/**
 * PaymentForm - Form to create payment links
 * Collects recipient address, amount, and optional memo
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { isValidAddress } from '@kasflow/passkey-wallet';
import { encodePaymentLink } from '@/lib/payment';

// =============================================================================
// Schema
// =============================================================================

const paymentFormSchema = z.object({
  recipientAddress: z
    .string()
    .min(1, 'Recipient address is required')
    .refine((addr) => isValidAddress(addr), {
      message: 'Invalid Kaspa address',
    }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  memo: z.string().max(200, 'Memo must be 200 characters or less').optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// =============================================================================
// PaymentForm Component
// =============================================================================

export function PaymentForm() {
  const router = useRouter();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      recipientAddress: '',
      amount: '',
      memo: '',
    },
  });

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      // Detect network from address prefix
      const network = values.recipientAddress.startsWith('kaspatest:')
        ? 'testnet-10'
        : 'mainnet';

      // Encode payment data
      const encoded = encodePaymentLink({
        to: values.recipientAddress,
        amount: values.amount,
        network,
        memo: values.memo || undefined,
      });

      // Navigate to payment page
      router.push(`/pay/${encoded}`);
    } catch (error) {
      console.error('Failed to create payment link:', error);
      form.setError('root', {
        message: 'Failed to create payment link. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Address */}
        <FormField
          control={form.control}
          name="recipientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="kaspa:qr... or kaspatest:qr..."
                  {...field}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                The Kaspa address that will receive the payment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (KAS)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.00000001"
                  min="0"
                  placeholder="10.5"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Amount in KAS (e.g., 10.5 KAS)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Memo (Optional) */}
        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memo (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Payment for services..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional note about this payment (max 200 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Payment Link...
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 mr-2" />
              Create Payment Link
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
