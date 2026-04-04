// ───────────────────────────────────────────────────────────────
// MODULE: Batch Processor
// ───────────────────────────────────────────────────────────────
import { isTransientError, userFriendlyError } from '../lib/errors/core.js';
// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION CONSTANTS
// ───────────────────────────────────────────────────────────────
// Single source of truth for batch config — imported from core/config.ts
import { BATCH_SIZE, BATCH_DELAY_MS } from '../core/config.js';
export { BATCH_SIZE, BATCH_DELAY_MS };
export const MAX_BATCH_SIZE = 100;
/** Default retry configuration */
export const DEFAULT_RETRY_OPTIONS = {
    maxRetries: 2,
    retryDelay: 1000
};
function normalizeRetryValue(value, fallback) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return fallback;
    }
    return Math.floor(value);
}
// ───────────────────────────────────────────────────────────────
// 3. RETRY LOGIC
// ───────────────────────────────────────────────────────────────
/**
 * Process a single item with retry logic for transient failures.
 * Uses exponential backoff strategy for retries.
 */
export async function processWithRetry(item, processor, options = {}) {
    const maxRetries = normalizeRetryValue(options.maxRetries, DEFAULT_RETRY_OPTIONS.maxRetries);
    const retryDelay = normalizeRetryValue(options.retryDelay, DEFAULT_RETRY_OPTIONS.retryDelay);
    let last_error;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await processor(item);
        }
        catch (err) {
            last_error = err instanceof Error ? err : new Error(String(err));
            // Only retry transient errors
            if (attempt < maxRetries && isTransientError(last_error)) {
                const delay = retryDelay * (attempt + 1); // Exponential backoff
                console.error(`[batch-retry] Attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${delay}ms: ${last_error.message}`);
                await new Promise(r => setTimeout(r, delay));
            }
            else if (attempt < maxRetries) {
                // Non-transient error, don't retry
                break;
            }
        }
    }
    if (!last_error) {
        last_error = new Error('Retry loop exited without processor result');
    }
    return {
        error: userFriendlyError(last_error),
        errorDetail: last_error.message,
        item,
        retries_failed: true,
    };
}
// ───────────────────────────────────────────────────────────────
// 4. BATCH PROCESSING
// ───────────────────────────────────────────────────────────────
/**
 * Process items in batches with concurrency control and retry logic.
 * Provides controlled execution to prevent resource exhaustion.
 *
 * @throws {Error} If batchSize is not a positive finite integer.
 *   T105/P0-08: Validates batchSize BEFORE any processing to prevent
 *   infinite loops (batchSize=0) or nonsensical iteration (NaN, negative,
 *   Infinity, fractional values).
 */
export async function processBatches(items, processor, batchSize = BATCH_SIZE, delayMs = BATCH_DELAY_MS, retryOptions = {}) {
    // T105/P0-08: Validate batchSize before any processing.
    // NaN <= 0 is false, so the original <= 0 check alone would miss NaN.
    // Also reject Infinity and non-integer values for safety.
    if (typeof batchSize !== 'number' || !Number.isFinite(batchSize) || batchSize <= 0 || batchSize !== Math.floor(batchSize)) {
        throw new Error(`batchSize must be a positive integer, got: ${batchSize}`);
    }
    const effectiveBatchSize = Math.min(batchSize, MAX_BATCH_SIZE);
    if (effectiveBatchSize !== batchSize) {
        console.warn(`[batch-processor] Clamped batch size ${batchSize} to ${MAX_BATCH_SIZE} to avoid unbounded concurrency`);
    }
    const results = [];
    const totalBatches = Math.ceil(items.length / effectiveBatchSize);
    let currentBatch = 0;
    for (let i = 0; i < items.length; i += effectiveBatchSize) {
        currentBatch++;
        console.error(`[batch-processor] Processing batch ${currentBatch}/${totalBatches}`);
        const batch = items.slice(i, i + effectiveBatchSize);
        const batchResults = await Promise.all(batch.map(item => processWithRetry(item, processor, retryOptions)));
        results.push(...batchResults);
        // Small delay between batches to prevent resource exhaustion
        if (i + effectiveBatchSize < items.length && delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    return results;
}
/**
 * Process items sequentially (one at a time) with retry logic.
 * Use when order matters or for resource-constrained operations.
 */
export async function processSequentially(items, processor, retryOptions = {}) {
    const results = [];
    for (let i = 0; i < items.length; i++) {
        console.error(`[batch-processor] Processing item ${i + 1}/${items.length}`);
        const result = await processWithRetry(items[i], processor, retryOptions);
        results.push(result);
    }
    return results;
}
/* ───────────────────────────────────────────────────────────────
   5. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
//# sourceMappingURL=batch-processor.js.map