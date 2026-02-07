import { z } from 'zod';
import { KaspaAddress } from '@kluster/kaspa-address';
import type { PaymentData, Result } from '@/types';
import { MIN_PAYMENT_AMOUNT_KAS, MAX_PAYMENT_AMOUNT_KAS } from '@/lib/constants';

/**
 * Custom Zod refinement for Kaspa address validation
 * Uses @kluster/kaspa-address directly to avoid WASM loading
 */
const kaspaAddressSchema = z.string().refine(
  (addr) => {
    try {
      KaspaAddress.fromString(addr);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid Kaspa address' }
);

/**
 * Payment data validation schema using Zod
 */
export const paymentDataSchema = z.object({
  to: kaspaAddressSchema,
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), { message: 'Amount must be a valid number' })
    .refine((val) => parseFloat(val) > 0, { message: 'Amount must be greater than 0' })
    .refine(
      (val) => parseFloat(val) >= MIN_PAYMENT_AMOUNT_KAS,
      { message: `Amount must be at least ${MIN_PAYMENT_AMOUNT_KAS} KAS` }
    )
    .refine(
      (val) => parseFloat(val) <= MAX_PAYMENT_AMOUNT_KAS,
      { message: `Amount must be less than ${MAX_PAYMENT_AMOUNT_KAS} KAS` }
    ),
  memo: z.string().max(500, 'Memo must be less than 500 characters').optional(),
  label: z.string().max(100, 'Label must be less than 100 characters').optional(),
  expiresAt: z
    .number()
    .refine((ts) => ts > Date.now(), { message: 'Expiration time must be in the future' })
    .optional(),
});

/**
 * Validate payment data using Zod schema
 * Returns Result type for consistency with SDK patterns
 */
export function validatePaymentData(data: unknown): Result<PaymentData> {
  const result = paymentDataSchema.safeParse(data);

  if (!result.success) {
    // Get first error message
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || 'Invalid payment data',
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Helper to validate just the address
 */
export function isValidAddress(address: string): boolean {
  return kaspaAddressSchema.safeParse(address).success;
}

/**
 * Pre-process and sanitize input (transform before validation)
 */
export const sanitizePaymentInput = z
  .object({
    to: z.string().trim(),
    amount: z.string().trim(),
    memo: z.string().trim().optional(),
    label: z.string().trim().optional(),
    expiresAt: z.number().optional(),
  })
  .transform((data) => ({
    to: data.to,
    amount: data.amount,
    ...(data.memo && { memo: data.memo }),
    ...(data.label && { label: data.label }),
    ...(data.expiresAt && { expiresAt: data.expiresAt }),
  }));

/**
 * Full validation pipeline: sanitize → validate
 */
export function sanitizeAndValidate(data: unknown): Result<PaymentData> {
  // First sanitize
  const sanitizeResult = sanitizePaymentInput.safeParse(data);
  if (!sanitizeResult.success) {
    return {
      success: false,
      error: 'Invalid input format',
    };
  }

  // Then validate
  return validatePaymentData(sanitizeResult.data);
}
