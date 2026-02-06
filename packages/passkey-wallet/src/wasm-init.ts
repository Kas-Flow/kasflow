/**
 * WASM Initialization Layer for @kasflow/passkey-wallet
 *
 * Provides singleton pattern for initializing the Kaspa WASM module.
 * The WASM module must be initialized before any WASM operations.
 *
 * Pattern: Lazy initialization with promise caching
 * - Only initializes once, even with concurrent calls
 * - Allows retry on failure
 * - Browser compatibility check
 */

import init, { initConsolePanicHook } from '@onekeyfe/kaspa-wasm';

let wasmInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Ensure WASM is initialized before any operations
 * Uses singleton pattern to prevent duplicate initialization
 *
 * @throws Error if WASM initialization fails or WebAssembly not supported
 */
export async function ensureWasmInitialized(): Promise<void> {
  // Return immediately if already initialized
  if (wasmInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      // Check browser support
      if (typeof WebAssembly === 'undefined') {
        throw new Error(
          'WebAssembly is not supported in this browser. ' +
          'Please use a modern browser (Chrome 57+, Firefox 52+, Safari 11+, Edge 16+)'
        );
      }

      console.log('[WASM] Initializing Kaspa WASM module...');

      // Initialize WASM module
      await init();

      // Enable better error messages in development
      if (process.env.NODE_ENV !== 'production') {
        try {
          initConsolePanicHook();
          console.log('[WASM] Console panic hook enabled for better error messages');
        } catch (error) {
          console.warn('[WASM] Failed to initialize console panic hook:', error);
          // Not fatal - continue without panic hook
        }
      }

      wasmInitialized = true;
      console.log('[WASM] Kaspa WASM module initialized successfully');
    } catch (error) {
      // Reset promise to allow retry
      initPromise = null;
      wasmInitialized = false;

      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[WASM] Initialization failed:', errorMessage);

      throw new Error(`WASM initialization failed: ${errorMessage}`);
    }
  })();

  return initPromise;
}

/**
 * Check if WASM has been successfully initialized
 * @returns true if WASM is ready to use
 */
export function isWasmInitialized(): boolean {
  return wasmInitialized;
}

/**
 * Reset WASM initialization state
 * Only use this for testing purposes
 * @internal
 */
export function resetWasmState(): void {
  wasmInitialized = false;
  initPromise = null;
}
