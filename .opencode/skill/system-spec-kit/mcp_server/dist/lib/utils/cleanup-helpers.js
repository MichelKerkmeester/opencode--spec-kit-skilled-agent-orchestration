import { get_error_message } from '../search/vector-index-types.js';
/** Run a shutdown cleanup step and log failures without aborting the sequence. */
export function runCleanupStep(label, cleanupFn) {
    try {
        cleanupFn();
    }
    catch (error) {
        console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
    }
}
/** Await a shutdown cleanup step and log failures without aborting the sequence. */
export async function runAsyncCleanupStep(label, cleanupFn) {
    try {
        await cleanupFn();
    }
    catch (error) {
        console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
    }
}
//# sourceMappingURL=cleanup-helpers.js.map