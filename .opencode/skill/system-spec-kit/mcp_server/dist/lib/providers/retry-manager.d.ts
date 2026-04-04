import type { MemoryDbRow } from '@spec-kit/shared/types';
interface BackgroundJobConfig {
    intervalMs: number;
    batchSize: number;
    enabled: boolean;
}
interface RetryStats {
    pending: number;
    retry: number;
    failed: number;
    success: number;
    total: number;
    queue_size: number;
}
/** In-memory-only snapshot of embedding retry health — no DB access. */
export interface EmbeddingRetryStats {
    pending: number;
    failed: number;
    retryAttempts: number;
    circuitBreakerOpen: boolean;
    lastRun: string | null;
    queueDepth: number;
}
interface RetryResult {
    success: boolean;
    id?: number;
    dimensions?: number;
    error?: string;
    permanent?: boolean;
}
interface BatchResult {
    processed: number;
    succeeded: number;
    failed: number;
    details?: RetryDetailEntry[];
}
interface RetryDetailEntry {
    id: number;
    success: boolean;
    error?: string;
    dimensions?: number;
}
interface BackgroundJobResult {
    processed?: number;
    succeeded?: number;
    failed?: number;
    details?: RetryDetailEntry[];
    skipped?: boolean;
    reason?: string;
    queue_empty?: boolean;
    error?: string;
}
/**
 * Retry-specific memory row with required id and file_path.
 * Uses MemoryDbRow as the base type with Record<string, unknown>
 * for camelCase fallback fields (e.g. retryCount, triggerPhrases).
 */
type RetryMemoryRow = Partial<MemoryDbRow> & Record<string, unknown> & {
    id: number;
    file_path: string;
};
type ContentLoader = (memory: RetryMemoryRow) => Promise<string | null>;
type RetryQueueStatus = 'pending' | 'retry';
interface SanitizeEmbeddingFailureOptions {
    provider?: string | null;
    force?: boolean;
}
export declare function sanitizeEmbeddingFailureMessage(raw: unknown, options?: SanitizeEmbeddingFailureOptions): string | null;
export declare function sanitizeAndLogEmbeddingFailure(context: string, raw: unknown, options?: SanitizeEmbeddingFailureOptions): string | null;
declare const BACKOFF_DELAYS: number[];
declare const MAX_RETRIES = 3;
declare const BACKGROUND_JOB_CONFIG: BackgroundJobConfig;
declare function getRetryQueue(limit?: number): RetryMemoryRow[];
declare function getFailedEmbeddings(): RetryMemoryRow[];
declare function getRetryStats(): RetryStats;
/**
 * Return a lightweight in-memory snapshot of embedding retry health.
 * PULL accessor — synchronous, zero DB access, always safe to call.
 * Returns zero-state when the retry manager has not yet been initialized.
 */
declare function getEmbeddingRetryStats(): EmbeddingRetryStats;
declare function retryEmbedding(id: number, content: string, claimedPreviousStatus?: RetryQueueStatus | null): Promise<RetryResult>;
declare function markAsFailed(id: number, reason: string): void;
declare function resetForRetry(id: number): boolean;
declare function processRetryQueue(limit?: number, contentLoader?: ContentLoader | null): Promise<BatchResult>;
declare function startBackgroundJob(options?: Partial<BackgroundJobConfig>): boolean;
declare function stopBackgroundJob(): boolean;
declare function isBackgroundJobRunning(): boolean;
declare function runBackgroundJob(batchSize?: number): Promise<BackgroundJobResult>;
declare function claimAndRetryEmbedding(id: number, content: string, expectedStatus?: RetryQueueStatus): Promise<RetryResult | null>;
export { getRetryQueue, getFailedEmbeddings, getRetryStats, getEmbeddingRetryStats, retryEmbedding, claimAndRetryEmbedding, markAsFailed, resetForRetry, processRetryQueue, startBackgroundJob, stopBackgroundJob, isBackgroundJobRunning, runBackgroundJob, BACKGROUND_JOB_CONFIG, BACKOFF_DELAYS, MAX_RETRIES, };
//# sourceMappingURL=retry-manager.d.ts.map