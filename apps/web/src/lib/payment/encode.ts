import type { PaymentData, Result } from '@/types';
import { PAYMENT_LINK_VERSION } from '@/lib/constants';

/**
 * Encode payment data to base64url for URL-safe transmission
 *
 * @example
 * encodePaymentLink({ to: 'kaspa:qr...', amount: '10', memo: 'Coffee' })
 * // Returns: '/pay/eyJ0byI6Imthc3BhOnFyLi4uIiwiYW1vdW50IjoiMTAiLCJtZW1vIjoiQ29mZmVlIn0'
 */
export function encodePaymentLink(data: PaymentData): string {
  // Add version for future compatibility
  const payload = {
    v: PAYMENT_LINK_VERSION,
    ...data,
  };

  // JSON → base64 → base64url
  const json = JSON.stringify(payload);
  const base64 = btoa(json);

  // Make URL-safe: replace + with -, / with _, remove =
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `/pay/${base64url}`;
}

/**
 * Decode payment data from base64url
 * Validates all fields and returns Result type
 */
export function decodePaymentLink(encoded: string): Result<PaymentData> {
  try {
    // Remove /pay/ prefix if present
    const cleanEncoded = encoded.replace(/^\/pay\//, '');

    // base64url → base64
    let base64 = cleanEncoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    // base64 → JSON
    const json = atob(base64);
    const payload = JSON.parse(json);

    // Validate version
    if (payload.v !== PAYMENT_LINK_VERSION) {
      return {
        success: false,
        error: `Unsupported payment link version: ${payload.v}`,
      };
    }

    // Validate required fields
    if (!payload.to || typeof payload.to !== 'string') {
      return {
        success: false,
        error: 'Missing or invalid recipient address',
      };
    }

    if (!payload.amount || typeof payload.amount !== 'string') {
      return {
        success: false,
        error: 'Missing or invalid amount',
      };
    }

    // Extract payment data
    const data: PaymentData = {
      to: payload.to,
      amount: payload.amount,
      memo: payload.memo,
      label: payload.label,
      expiresAt: payload.expiresAt,
    };

    // Check expiration
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return {
        success: false,
        error: 'Payment link has expired',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid payment link',
    };
  }
}

/**
 * Generate full payment URL with domain
 */
export function getFullPaymentUrl(data: PaymentData, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const path = encodePaymentLink(data);
  return `${base}${path}`;
}

/**
 * Generate Kaspa payment URI for QR codes
 * Format: kaspa:address?amount=X&memo=Y
 */
export function generateKaspaUri(data: PaymentData): string {
  const params = new URLSearchParams();

  params.set('amount', data.amount);

  if (data.memo) {
    params.set('memo', data.memo);
  }

  if (data.label) {
    params.set('label', data.label);
  }

  return `kaspa:${data.to}?${params.toString()}`;
}
