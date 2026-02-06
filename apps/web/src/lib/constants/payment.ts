// Payment status constants
export const PAYMENT_STATUS = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  WAITING: 'waiting',
  DETECTING: 'detecting',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  ERROR: 'error',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Payment timing constants
export const PAYMENT_TIMEOUT_MS = 300000; // 5 minutes
export const POLL_INTERVAL_MS = 1000; // 1 second (fallback polling)
export const DETECTION_ANIMATION_MS = 100; // Brief pause for animation

// Payment link encoding version
export const PAYMENT_LINK_VERSION = 1;

// Maximum payment amounts (for validation)
export const MAX_PAYMENT_AMOUNT_KAS = 1000000; // 1M KAS
export const MIN_PAYMENT_AMOUNT_KAS = 0.00000001; // 1 sompi

// USD price per KAS (TODO: fetch from API in production)
export const KAS_TO_USD_RATE = 0.15;

// QR code URI scheme
export const KASPA_URI_SCHEME = 'kaspa:';
