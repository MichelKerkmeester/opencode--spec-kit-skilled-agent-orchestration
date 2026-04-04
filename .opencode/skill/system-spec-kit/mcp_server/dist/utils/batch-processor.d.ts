/** Retry options for batch processing */
export interface RetryOptions {
    maxRetries?: number;
    retryDelay?: number;
}
/** Default retry configuration */
export interface RetryDefaults {
    maxRetries: number;
    retryDelay: number;
}
/** Error result from a failed retry operation */
export interface RetryErrorResult {
    error: string;
    errorDetail?: string;
    item: unknown;
    retries_failed: boolean;
}
/** Processor function type */
export type ItemProcessor<T, R> = (item: T) => Promise<R>;
import { BATCH_SIZE, BATCH_DELAY_MS } from '../core/config.js';
export { BATCH_SIZE, BATCH_DELAY_MS };
export declare const MAX_BATCH_SIZE = 100;
/** Default retry configuration */
export declare const DEFAULT_RETRY_OPTIONS: Readonly<RetryDefaults>;
/**
 * Process a single item with retry logic for transient failures.
 * Uses exponential backoff strategy for retries.
 */
export declare function processWithRetry<T, R>(item: T, processor: ItemProcessor<T, R>, options?: RetryOptions): Promise<R | RetryErrorResult>;
/**
 * Process items in batches with concurrency control and retry logic.
 * Provides controlled execution to prevent resource exhaustion.
 *
 * @throws {Error} If batchSize is not a positive finite integer.
 *   T105/P0-08: Validates batchSize BEFORE any processing to prevent
 *   infinite loops (batchSize=0) or nonsensical iteration (NaN, negative,
 *   Infinity, fractional values).
 */
export declare function processBatches<T, R>(items: T[], processor: ItemProcessor<T, R>, batchSize?: number, delayMs?: number, retryOptions?: RetryOptions): Promise<Array<R | RetryErrorResult>>;
/**
 * Process items sequentially (one at a time) with retry logic.
 * Use when order matters or for resource-constrained operations.
 */
export declare function processSequentially<T, R>(items: T[], processor: ItemProcessor<T, R>, retryOptions?: RetryOptions): Promise<Array<R | RetryErrorResult>>;
//# sourceMappingURL=batch-processor.d.ts.map