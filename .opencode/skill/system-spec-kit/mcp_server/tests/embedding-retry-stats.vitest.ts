// ───────────────────────────────────────────────────────────────
// TEST: Embedding Retry Stats — getEmbeddingRetryStats() zero-state and type contract
// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { getEmbeddingRetryStats } from '../lib/providers/retry-manager';
import type { EmbeddingRetryStats } from '../lib/providers/retry-manager';

describe('getEmbeddingRetryStats', () => {

  it('returns a valid EmbeddingRetryStats object', () => {
    const stats: EmbeddingRetryStats = getEmbeddingRetryStats();
    expect(stats).toBeDefined();
    expect(typeof stats.pending).toBe('number');
    expect(typeof stats.failed).toBe('number');
    expect(typeof stats.retryAttempts).toBe('number');
    expect(typeof stats.circuitBreakerOpen).toBe('boolean');
    expect(typeof stats.queueDepth).toBe('number');
    // lastRun is string | null
    expect(stats.lastRun === null || typeof stats.lastRun === 'string').toBe(true);
  });

  it('returns zero-state before any queue activity', () => {
    // In a fresh test environment, no retry queue has been populated
    const stats = getEmbeddingRetryStats();
    expect(stats.pending).toBe(0);
    expect(stats.failed).toBe(0);
    expect(stats.retryAttempts).toBe(0);
    expect(stats.circuitBreakerOpen).toBe(false);
    expect(stats.queueDepth).toBe(0);
    // lastRun should be null when no background job has executed
    expect(stats.lastRun).toBeNull();
  });

  it('is safe to call multiple times (pure in-memory read)', () => {
    const first = getEmbeddingRetryStats();
    const second = getEmbeddingRetryStats();
    expect(first).toEqual(second);
  });

  it('does not contain raw error messages or file paths', () => {
    const stats = getEmbeddingRetryStats();
    const serialized = JSON.stringify(stats);
    // CHK-070: No raw error messages leaking internal paths
    expect(serialized).not.toContain('/Users/');
    expect(serialized).not.toContain('Error:');
    expect(serialized).not.toContain('stack');
  });
});
