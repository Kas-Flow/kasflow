/**
 * Logger utility for @kasflow/passkey-wallet
 * Centralized logging with module prefixes
 */

// =============================================================================
// Logger Configuration
// =============================================================================

/** Enable/disable debug logs */
const DEBUG_ENABLED = typeof process !== 'undefined'
  ? process.env.NODE_ENV === 'development'
  : true;

// =============================================================================
// Logger Class
// =============================================================================

class Logger {
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private formatMessage(level: string, ...args: unknown[]): unknown[] {
    return [`[${this.module}] ${level}:`, ...args];
  }

  /**
   * Log info message
   */
  info(...args: unknown[]): void {
    console.log(...this.formatMessage('INFO', ...args));
  }

  /**
   * Log warning message
   */
  warn(...args: unknown[]): void {
    console.warn(...this.formatMessage('WARN', ...args));
  }

  /**
   * Log error message
   */
  error(...args: unknown[]): void {
    console.error(...this.formatMessage('ERROR', ...args));
  }

  /**
   * Log debug message (only in development)
   */
  debug(...args: unknown[]): void {
    if (DEBUG_ENABLED) {
      console.log(...this.formatMessage('DEBUG', ...args));
    }
  }
}

// =============================================================================
// Logger Factory
// =============================================================================

/**
 * Create a logger instance for a module
 *
 * @param module - Module name (e.g., 'WebAuthn', 'Wallet', 'RPC')
 * @returns Logger instance
 *
 * @example
 * ```typescript
 * import { createLogger } from './logger';
 *
 * const logger = createLogger('WebAuthn');
 * logger.info('Starting registration...');
 * logger.error('Registration failed:', error);
 * ```
 */
export function createLogger(module: string): Logger {
  return new Logger(module);
}
