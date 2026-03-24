// ───────────────────────────────────────────────────────────────
// MODULE: Retry Manager
// ───────────────────────────────────────────────────────────────
// Feature catalog: Embedding retry orchestrator
// Node stdlib
import * as fsPromises from 'fs/promises';

// Internal modules
import * as vectorIndex from '../search/vector-index';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
import { generateDocumentEmbedding, getModelName } from './embeddings';

// Type imports
import type { MemoryDbRow } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

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

type RetryHealthSnapshot = EmbeddingRetryStats;

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

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Backoff delays in milliseconds (1min, 5min, 15min)
const BACKOFF_DELAYS: number[] = [
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
];

const MAX_RETRIES = 3;

// Background retry job configuration (REQ-031, CHK-179)
const BACKGROUND_JOB_CONFIG: BackgroundJobConfig = {
  intervalMs: 5 * 60 * 1000,
  batchSize: 5,
  enabled: true,
};

// Background job state
let backgroundJobInterval: ReturnType<typeof setInterval> | null = null;
let backgroundJobRunning = false;

// In-memory retry telemetry (never persisted to DB — read by getEmbeddingRetryStats)
let lastBackgroundRunAt: string | null = null;
let totalRetryAttempts = 0;
const retryHealthSnapshot: RetryHealthSnapshot = {
  pending: 0,
  failed: 0,
  retryAttempts: 0,
  circuitBreakerOpen: false,
  lastRun: null,
  queueDepth: 0,
};

// T3-15 circuit breaker — prevents the background retry job from
// Hammering the embedding API when the provider is entirely down. After
// PROVIDER_FAILURE_THRESHOLD consecutive failures across any items, the
// Circuit opens for PROVIDER_COOLDOWN_MS, causing retryEmbedding to skip
// The API call and return a transient error instead.
const PROVIDER_FAILURE_THRESHOLD = 5;
const PROVIDER_COOLDOWN_MS = 120_000; // 2 minutes

let providerFailures = 0;
let providerCircuitOpenedAt: number | null = null;

function isProviderCircuitOpen(): boolean {
  if (providerCircuitOpenedAt === null) return false;
  if (Date.now() - providerCircuitOpenedAt >= PROVIDER_COOLDOWN_MS) {
    providerCircuitOpenedAt = null;
    providerFailures = 0;
    return false;
  }
  return true;
}

function recordProviderSuccess(): void {
  providerFailures = 0;
  providerCircuitOpenedAt = null;
  retryHealthSnapshot.circuitBreakerOpen = false;
}

function recordProviderFailure(): void {
  providerFailures++;
  if (providerFailures >= PROVIDER_FAILURE_THRESHOLD && providerCircuitOpenedAt === null) {
    providerCircuitOpenedAt = Date.now();
    console.warn(`[retry-manager] Embedding provider circuit breaker OPEN after ${providerFailures} consecutive failures. Cooldown: ${PROVIDER_COOLDOWN_MS}ms`);
  }
  retryHealthSnapshot.circuitBreakerOpen = isProviderCircuitOpen();
}

function applyRetryHealthTransition(previousStatus: string | null | undefined, nextStatus: string): void {
  if (previousStatus === 'pending') {
    retryHealthSnapshot.pending = Math.max(0, retryHealthSnapshot.pending - 1);
  }

  if (previousStatus === 'pending' || previousStatus === 'retry') {
    retryHealthSnapshot.queueDepth = Math.max(0, retryHealthSnapshot.queueDepth - 1);
  }

  if (nextStatus === 'pending') {
    retryHealthSnapshot.pending++;
    retryHealthSnapshot.queueDepth++;
  }

  if (nextStatus === 'retry') {
    retryHealthSnapshot.queueDepth++;
  }

  if (previousStatus === 'failed') {
    retryHealthSnapshot.failed = Math.max(0, retryHealthSnapshot.failed - 1);
  }

  if (nextStatus === 'failed') {
    retryHealthSnapshot.failed++;
  }
}

function refreshRetryHealthSnapshot(stats: RetryStats): void {
  retryHealthSnapshot.pending = stats.pending;
  retryHealthSnapshot.failed = stats.failed;
  retryHealthSnapshot.retryAttempts = totalRetryAttempts;
  retryHealthSnapshot.circuitBreakerOpen = isProviderCircuitOpen();
  retryHealthSnapshot.lastRun = lastBackgroundRunAt;
  retryHealthSnapshot.queueDepth = stats.queue_size;
}

/* ───────────────────────────────────────────────────────────────
   3. RETRY QUEUE
──────────────────────────────────────────────────────────────── */

function getRetryQueue(limit = 10): RetryMemoryRow[] {
  vectorIndex.initializeDb();
  const db = vectorIndex.getDb();
  if (!db) {
    console.warn('[retry-manager] Database not initialized. Server may still be starting up.');
    return [];
  }
  const now = Date.now();

  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE embedding_status IN ('pending', 'retry')
      AND retry_count < ?
    ORDER BY
      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
      retry_count ASC,
      created_at ASC
    LIMIT ?
  `).all(MAX_RETRIES, limit * 2) as RetryMemoryRow[];

  const eligible: RetryMemoryRow[] = [];
  for (const row of rows) {
    if (isEligibleForRetry(row, now)) {
      eligible.push(parseRow(row));
      if (eligible.length >= limit) break;
    }
  }

  return eligible;
}

function isEligibleForRetry(row: RetryMemoryRow, now: number): boolean {
  // Note: better-sqlite3 returns snake_case column names from SELECT *
  if (row.embedding_status === 'pending') return true;

  if (row.embedding_status === 'retry' && row.last_retry_at) {
    const lastRetry = new Date(row.last_retry_at).getTime();
    const retryCount = (row.retry_count as number) ?? (row.retryCount as number) ?? 0;
    // Off-by-one fix: retryCount is already incremented after the failure that triggered
    // The retry status, so use (retryCount - 1) for the backoff index. First retry (retryCount=1)
    // Should use BACKOFF_DELAYS[0] (1 minute), not BACKOFF_DELAYS[1] (5 minutes).
    const backoffIndex = Math.max(0, retryCount - 1);
    const requiredDelay = BACKOFF_DELAYS[Math.min(backoffIndex, BACKOFF_DELAYS.length - 1)];
    return (now - lastRetry) >= requiredDelay;
  }

  return row.embedding_status === 'retry';
}

function getFailedEmbeddings(): RetryMemoryRow[] {
  const db = vectorIndex.getDb();
  if (!db) {
    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Returning empty array.');
    return [];
  }

  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE embedding_status = 'failed'
    ORDER BY updated_at DESC
  `).all() as RetryMemoryRow[];

  return rows.map(parseRow);
}

function getRetryStats(): RetryStats {
  const db = vectorIndex.getDb();
  if (!db) {
    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Returning default stats.');
    return { pending: 0, retry: 0, failed: 0, success: 0, total: 0, queue_size: 0 };
  }

  const stats = db.prepare(`
    SELECT
      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
      SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as success,
      COUNT(*) as total
    FROM memory_index
  `).get() as Record<string, number>;

  const result = {
    pending: stats.pending || 0,
    retry: stats.retry || 0,
    failed: stats.failed || 0,
    success: stats.success || 0,
    total: stats.total || 0,
    queue_size: (stats.pending || 0) + (stats.retry || 0),
  };

  refreshRetryHealthSnapshot(result);
  return result;
}

/**
 * Return a lightweight in-memory snapshot of embedding retry health.
 * PULL accessor — synchronous, zero DB access, always safe to call.
 * Returns zero-state when the retry manager has not yet been initialized.
 */
function getEmbeddingRetryStats(): EmbeddingRetryStats {
  return {
    pending: retryHealthSnapshot.pending,
    failed: retryHealthSnapshot.failed,
    retryAttempts: totalRetryAttempts,
    circuitBreakerOpen: isProviderCircuitOpen(),
    lastRun: lastBackgroundRunAt,
    queueDepth: retryHealthSnapshot.queueDepth,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. RETRY OPERATIONS
──────────────────────────────────────────────────────────────── */

async function retryEmbedding(id: number, content: string): Promise<RetryResult> {
  const db = vectorIndex.getDb();
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };

  const now = new Date().toISOString();

  try {
    const memory = vectorIndex.getMemory(id);
    if (!memory) return { success: false, error: 'Memory not found' };
    const previousStatus = typeof memory.embedding_status === 'string'
      ? memory.embedding_status
      : typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
        ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
        : null;

    if ((memory.retry_count as number) >= MAX_RETRIES) {
      markAsFailed(id, 'Maximum retry attempts exceeded');
      return { success: false, error: 'Maximum retries exceeded', permanent: true };
    }

    // BUG-1 fix: Normalize content before embedding to match sync save path (memory-save.ts:1119).
    // Without this, async-saved memories get embeddings from raw markdown (YAML frontmatter, HTML
    // Comments, code fences) while sync-saved memories get clean normalized embeddings.
    const normalizedContent = normalizeContentForEmbedding(content);
    const modelId = getModelName();
    const contentHash = computeContentHash(normalizedContent);
    const cachedEmbedding = lookupEmbedding(db, contentHash, modelId);

    let embedding: Float32Array | null = null;

    if (cachedEmbedding) {
      embedding = new Float32Array(
        cachedEmbedding.buffer,
        cachedEmbedding.byteOffset,
        Math.floor(cachedEmbedding.byteLength / Float32Array.BYTES_PER_ELEMENT),
      );
    } else {
      // T3-15: Skip API call if provider circuit breaker is open
      if (isProviderCircuitOpen()) {
        return { success: false, error: 'Embedding provider circuit breaker open — skipping API call' };
      }

      embedding = await generateDocumentEmbedding(normalizedContent);
      if (embedding) {
        recordProviderSuccess();
        storeEmbedding(
          db,
          contentHash,
          modelId,
          Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
          embedding.length,
        );
      } else {
        recordProviderFailure();
      }
    }

    if (!embedding) {
      incrementRetryCount(id, 'Embedding generation returned null');
      return { success: false, error: 'Embedding returned null' };
    }

    const updateTx = db.transaction(() => {
      db.prepare(`
        UPDATE memory_index
        SET embedding_status = 'success',
            embedding_generated_at = ?,
            updated_at = ?,
            failure_reason = NULL
        WHERE id = ?
      `).run(now, now, id);

      try {
        db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (_error: unknown) {
        // Ignore if doesn't exist
      }

      const embeddingBuffer = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
      db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embeddingBuffer);
    });

    try {
      updateTx();
      applyRetryHealthTransition(previousStatus, 'success');
      return { success: true, id, dimensions: embedding.length };
    } catch (tx_error: unknown) {
      const message = tx_error instanceof Error ? tx_error.message : String(tx_error);
      incrementRetryCount(id, `Transaction failed: ${message}`);
      return { success: false, error: `Transaction failed: ${message}` };
    }
  } catch (error: unknown) {
    recordProviderFailure();
    const message = error instanceof Error ? error.message : String(error);
    incrementRetryCount(id, message);
    return { success: false, error: message };
  }
}

function incrementRetryCount(id: number, reason: string): void {
  totalRetryAttempts++;
  const db = vectorIndex.getDb();
  if (!db) return;

  const now = new Date().toISOString();
  const memory = vectorIndex.getMemory(id);
  if (!memory) {
    console.warn(`[retry-manager] Memory ${id} not found during retry count increment`);
    return;
  }

  const newRetryCount = (Number(memory.retry_count) || 0) + 1;
  const previousStatus = typeof memory.embedding_status === 'string'
    ? memory.embedding_status
    : typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
      : null;

  if (newRetryCount >= MAX_RETRIES) {
    markAsFailed(id, reason);
  } else {
    db.prepare(`
      UPDATE memory_index
      SET embedding_status = 'retry',
          retry_count = ?,
          last_retry_at = ?,
          failure_reason = ?,
          updated_at = ?
      WHERE id = ?
    `).run(newRetryCount, now, reason, now, id);
    applyRetryHealthTransition(previousStatus, 'retry');
  }
}

function markAsFailed(id: number, reason: string): void {
  const db = vectorIndex.getDb();
  if (!db) {
    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Cannot mark as failed.');
    return;
  }
  const now = new Date().toISOString();
  const memory = vectorIndex.getMemory(id);
  const previousStatus = memory && typeof memory.embedding_status === 'string'
    ? memory.embedding_status
    : memory && typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
      : null;

  db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'failed',
        failure_reason = ?,
        updated_at = ?
    WHERE id = ?
  `).run(reason, now, id);
  applyRetryHealthTransition(previousStatus, 'failed');
}

function resetForRetry(id: number): boolean {
  const db = vectorIndex.getDb();
  if (!db) return false;
  const now = new Date().toISOString();
  const memory = vectorIndex.getMemory(id);
  const previousStatus = memory && typeof memory.embedding_status === 'string'
    ? memory.embedding_status
    : memory && typeof (memory as { embeddingStatus?: unknown }).embeddingStatus === 'string'
      ? (memory as { embeddingStatus?: string }).embeddingStatus ?? null
      : null;

  const result = db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'retry',
        retry_count = 0,
        last_retry_at = NULL,
        failure_reason = NULL,
        updated_at = ?
    WHERE id = ? AND embedding_status = 'failed'
  `).run(now, id);

  if (result.changes > 0) {
    applyRetryHealthTransition(previousStatus, 'retry');
  }

  return result.changes > 0;
}

/* ───────────────────────────────────────────────────────────────
   5. BATCH PROCESSING
──────────────────────────────────────────────────────────────── */

async function processRetryQueue(limit = 3, contentLoader: ContentLoader | null = null): Promise<BatchResult> {
  const queue = getRetryQueue(limit);

  if (queue.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  const results: BatchResult = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    details: [],
  };
  const details = results.details ?? (results.details = []);

  for (const memory of queue) {
    let content: string | null = null;

    if (contentLoader) {
      content = await contentLoader(memory);
    } else if (typeof memory.content_text === 'string' && memory.content_text.length > 0) {
      // Use stored content_text — critical for chunks which share file_path with parent
      content = memory.content_text;
    } else {
      content = await loadContentFromFile(memory.file_path);
    }

    if (!content) {
      // P2-08 FIX: Count content load failure as a retry attempt to prevent infinite retry loops
      incrementRetryCount(memory.id, 'Content load failed: file unreadable or missing');
      details.push({ id: memory.id, success: false, error: 'Could not load content (counted as retry)' });
      results.failed++;
      results.processed++;
      continue;
    }

    const result = await retryEmbedding(memory.id, content);
    results.processed++;

    if (result.success) {
      results.succeeded++;
    } else {
      results.failed++;
    }

    details.push({ id: memory.id, ...result } as RetryDetailEntry);
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   6. BACKGROUND RETRY JOB (T099, REQ-031, CHK-179)
──────────────────────────────────────────────────────────────── */

function startBackgroundJob(options: Partial<BackgroundJobConfig> = {}): boolean {
  if (backgroundJobInterval) {
    console.error('[retry-manager] Background job already running');
    return false;
  }

  const config = { ...BACKGROUND_JOB_CONFIG, ...options };

  if (!config.enabled) {
    console.error('[retry-manager] Background job is disabled');
    return false;
  }

  console.error(`[retry-manager] Starting background retry job (interval: ${config.intervalMs}ms, batch: ${config.batchSize})`);

  runBackgroundJob(config.batchSize).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[retry-manager] Initial background job failed:', message);
  });

  backgroundJobInterval = setInterval(() => {
    runBackgroundJob(config.batchSize).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[retry-manager] Background job iteration failed:', message);
    });
  }, config.intervalMs);
  backgroundJobInterval.unref();

  return true;
}

function stopBackgroundJob(): boolean {
  if (!backgroundJobInterval) return false;

  clearInterval(backgroundJobInterval);
  backgroundJobInterval = null;
  backgroundJobRunning = false;
  console.error('[retry-manager] Background retry job stopped');
  return true;
}

function isBackgroundJobRunning(): boolean {
  return backgroundJobInterval !== null;
}

async function runBackgroundJob(batchSize: number = BACKGROUND_JOB_CONFIG.batchSize): Promise<BackgroundJobResult> {
  if (backgroundJobRunning) {
    return { skipped: true, reason: 'Previous run still in progress' };
  }

  backgroundJobRunning = true;

  try {
    const stats = getRetryStats();

    if (stats.queue_size === 0) {
      return { processed: 0, queue_empty: true };
    }

    console.error(`[retry-manager] Background job: Processing up to ${batchSize} of ${stats.queue_size} pending embeddings`);

    const result = await processRetryQueue(batchSize);

    if (result.processed > 0) {
      console.error(`[retry-manager] Background job complete: ${result.succeeded}/${result.processed} succeeded`);
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[retry-manager] Background job error:', message);
    return { error: message };
  } finally {
    lastBackgroundRunAt = new Date().toISOString();
    retryHealthSnapshot.lastRun = lastBackgroundRunAt;
    retryHealthSnapshot.retryAttempts = totalRetryAttempts;
    retryHealthSnapshot.circuitBreakerOpen = isProviderCircuitOpen();
    backgroundJobRunning = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   7. UTILITIES
──────────────────────────────────────────────────────────────── */

function parseRow(row: RetryMemoryRow): RetryMemoryRow {
  if (row.triggerPhrases && typeof row.triggerPhrases === 'string') {
    try {
      return { ...row, triggerPhrases: JSON.parse(row.triggerPhrases) };
    } catch (_error: unknown) {
      return { ...row, triggerPhrases: [] };
    }
  }
  return { ...row };
}

async function loadContentFromFile(filePath: string): Promise<string | null> {
  try {
    return await fsPromises.readFile(filePath, 'utf-8');
  } catch (_error: unknown) {
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  getRetryQueue,
  getFailedEmbeddings,
  getRetryStats,
  getEmbeddingRetryStats,
  retryEmbedding,
  markAsFailed,
  resetForRetry,
  processRetryQueue,
  startBackgroundJob,
  stopBackgroundJob,
  isBackgroundJobRunning,
  runBackgroundJob,
  BACKGROUND_JOB_CONFIG,
  BACKOFF_DELAYS,
  MAX_RETRIES,
};
