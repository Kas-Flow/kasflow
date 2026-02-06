/**
 * Payment Link Encoding/Decoding
 * Encodes payment data into URL-safe base64 strings
 */

// =============================================================================
// Types
// =============================================================================

export interface PaymentData {
  address: string;
  amount: bigint;
  memo?: string;
}

// =============================================================================
// Encoding/Decoding Functions
// =============================================================================

/**
 * Encode payment data into a URL-safe base64 string
 */
export function encodePaymentData(data: PaymentData): string {
  const payload = {
    a: data.address,
    v: data.amount.toString(), // Convert bigint to string for JSON
    m: data.memo,
  };

  const json = JSON.stringify(payload);

  // Convert to base64 and make URL-safe
  if (typeof window !== 'undefined') {
    // Browser environment
    return btoa(json)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } else {
    // Node environment (SSR)
    return Buffer.from(json)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

/**
 * Decode payment data from a URL-safe base64 string
 */
export function decodePaymentData(encoded: string): PaymentData {
  try {
    // Convert back from URL-safe base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    // Decode base64
    let json: string;
    if (typeof window !== 'undefined') {
      // Browser environment
      json = atob(base64);
    } else {
      // Node environment (SSR)
      json = Buffer.from(base64, 'base64').toString();
    }

    const payload = JSON.parse(json);

    return {
      address: payload.a,
      amount: BigInt(payload.v), // Convert string back to bigint
      memo: payload.m,
    };
  } catch (error) {
    throw new Error('Invalid payment link');
  }
}

/**
 * Create a full payment URL
 */
export function createPaymentUrl(data: PaymentData, baseUrl?: string): string {
  const encoded = encodePaymentData(data);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/pay/${encoded}`;
}
