import { COPY_SUCCESS_MESSAGE, COPY_ERROR_MESSAGE } from '@/lib/constants';

/**
 * Copy text to clipboard
 * Returns a promise that resolves with success message or rejects with error message
 */
export async function copyToClipboard(text: string): Promise<string> {
  try {
    await navigator.clipboard.writeText(text);
    return COPY_SUCCESS_MESSAGE;
  } catch (error) {
    throw new Error(COPY_ERROR_MESSAGE);
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!navigator.clipboard;
}
