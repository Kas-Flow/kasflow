/**
 * High-precision timer for payment confirmation tracking
 * Uses performance.now() for sub-millisecond accuracy
 */
export class PaymentTimer {
  private startTime: number | null = null;
  private detectionTime: number | null = null;

  /**
   * Start timer when payment page loads
   */
  start(): void {
    this.startTime = performance.now();
    this.detectionTime = null;
  }

  /**
   * Record detection time when UTXO change is received
   * @returns Elapsed time in milliseconds
   */
  detect(): number {
    if (!this.startTime) {
      throw new Error('Timer not started');
    }

    this.detectionTime = performance.now();
    return this.getElapsedMs();
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedMs(): number {
    if (!this.startTime || !this.detectionTime) {
      return 0;
    }

    return Math.round(this.detectionTime - this.startTime);
  }

  /**
   * Get human-readable time (e.g., "142ms", "1.2s")
   */
  getFormattedTime(): string {
    const ms = this.getElapsedMs();

    if (ms < 1000) {
      return `${ms}ms`;
    }

    return `${(ms / 1000).toFixed(1)}s`;
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.startTime !== null && this.detectionTime === null;
  }

  /**
   * Check if timer has completed
   */
  isComplete(): boolean {
    return this.startTime !== null && this.detectionTime !== null;
  }

  /**
   * Reset timer for new payment
   */
  reset(): void {
    this.startTime = null;
    this.detectionTime = null;
  }

  /**
   * Get current elapsed time (even if not detected yet)
   * Useful for showing "waiting for X seconds..."
   */
  getCurrentElapsedMs(): number {
    if (!this.startTime) {
      return 0;
    }

    if (this.detectionTime) {
      return this.getElapsedMs();
    }

    return Math.round(performance.now() - this.startTime);
  }
}
