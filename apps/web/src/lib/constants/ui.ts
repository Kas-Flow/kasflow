// Brand colors
export const COLORS = {
  KASPA_CYAN: '#49EACB',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  BACKGROUND: '#0a0a0a',
  FOREGROUND: '#ffffff',
} as const;

// QR code sizes
export const QR_CODE_SIZE = {
  SMALL: 128,
  MEDIUM: 256,
  LARGE: 512,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Toast notification durations
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

// Copy feedback
export const COPY_SUCCESS_MESSAGE = 'Copied to clipboard!';
export const COPY_ERROR_MESSAGE = 'Failed to copy';

// Loading messages
export const LOADING_MESSAGES = {
  CONNECTING: 'Connecting to network...',
  CREATING_WALLET: 'Creating wallet...',
  UNLOCKING_WALLET: 'Unlocking wallet...',
  SIGNING_TRANSACTION: 'Signing transaction...',
  BROADCASTING: 'Broadcasting transaction...',
  DETECTING_PAYMENT: 'Waiting for payment...',
} as const;
