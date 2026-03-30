import { get_error_message } from '../search/vector-index-types.js';

/** Run a shutdown cleanup step and log failures without aborting the sequence. */
export function runCleanupStep(label: string, cleanupFn: () => void): void {
  try {
    cleanupFn();
  } catch (error: unknown) {
    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
  }
}

/** Await a shutdown cleanup step and log failures without aborting the sequence. */
export async function runAsyncCleanupStep(label: string, cleanupFn: () => Promise<void>): Promise<void> {
  try {
    await cleanupFn();
  } catch (error: unknown) {
    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
  }
}
