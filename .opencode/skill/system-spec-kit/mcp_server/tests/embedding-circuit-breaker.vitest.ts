// ───────────────────────────────────────────────────────────────
// TEST: Embedding Circuit Breaker
// ───────────────────────────────────────────────────────────────
// Verifies the embedding API circuit breaker behaves correctly:
// opens after threshold failures, auto-resets after cooldown (half-open),
// resets on success, and can be disabled via env var.
// Mirrors the cross-encoder circuit breaker test pattern.
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { __embeddingCircuitTestables } from '../../shared/embeddings';

const {
  embeddingCircuit,
  isEmbeddingCircuitOpen,
  isEmbeddingCircuitBreakerEnabled,
  recordEmbeddingSuccess,
  recordEmbeddingFailure,
  EMBEDDING_CB_THRESHOLD,
  EMBEDDING_CB_COOLDOWN_MS,
} = __embeddingCircuitTestables;

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('embedding circuit breaker', () => {
  beforeEach(() => {
    // Reset circuit state
    embeddingCircuit.failures = 0;
    embeddingCircuit.openedAt = null;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clean up env overrides
    delete process.env.SPECKIT_EMBEDDING_CIRCUIT_BREAKER;
  });

  it('starts with circuit closed (0 failures)', () => {
    expect(embeddingCircuit.failures).toBe(0);
    expect(embeddingCircuit.openedAt).toBeNull();
    expect(isEmbeddingCircuitOpen()).toBe(false);
  });

  it('is enabled by default', () => {
    expect(isEmbeddingCircuitBreakerEnabled()).toBe(true);
  });

  it('can be disabled via SPECKIT_EMBEDDING_CIRCUIT_BREAKER=false', () => {
    process.env.SPECKIT_EMBEDDING_CIRCUIT_BREAKER = 'false';
    expect(isEmbeddingCircuitBreakerEnabled()).toBe(false);

    // Even with failures recorded, circuit should not open when disabled
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD + 1; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(false);
  });

  it('recordEmbeddingFailure increments failure count', () => {
    recordEmbeddingFailure();
    expect(embeddingCircuit.failures).toBe(1);
    recordEmbeddingFailure();
    expect(embeddingCircuit.failures).toBe(2);
  });

  it(`opens circuit at EMBEDDING_CB_THRESHOLD (${EMBEDDING_CB_THRESHOLD}) failures`, () => {
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(embeddingCircuit.openedAt).not.toBeNull();
    expect(isEmbeddingCircuitOpen()).toBe(true);
  });

  it('isEmbeddingCircuitOpen returns true when opened', () => {
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);
  });

  it('isEmbeddingCircuitOpen returns false after EMBEDDING_CB_COOLDOWN_MS elapses (half-open)', () => {
    // Open the circuit
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);

    // Advance time past cooldown
    vi.advanceTimersByTime(EMBEDDING_CB_COOLDOWN_MS);

    // Half-open: first check after cooldown resets and returns false
    expect(isEmbeddingCircuitOpen()).toBe(false);
  });

  it('recordEmbeddingSuccess resets failures to 0 and closes circuit', () => {
    recordEmbeddingFailure();
    recordEmbeddingFailure();
    expect(embeddingCircuit.failures).toBe(2);

    recordEmbeddingSuccess();
    expect(embeddingCircuit.failures).toBe(0);
    expect(embeddingCircuit.openedAt).toBeNull();
  });

  it('half-open: first check after cooldown resets openedAt and failures', () => {
    // Open the circuit
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);
    expect(embeddingCircuit.openedAt).not.toBeNull();

    // Advance past cooldown
    vi.advanceTimersByTime(EMBEDDING_CB_COOLDOWN_MS);

    // isEmbeddingCircuitOpen triggers half-open reset
    expect(isEmbeddingCircuitOpen()).toBe(false);
    expect(embeddingCircuit.failures).toBe(0);
    expect(embeddingCircuit.openedAt).toBeNull();
  });

  it('circuit stays open within cooldown window', () => {
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    // Advance to just before cooldown expires
    vi.advanceTimersByTime(EMBEDDING_CB_COOLDOWN_MS - 1);
    expect(isEmbeddingCircuitOpen()).toBe(true);
  });

  it('re-opens after half-open probe fails', () => {
    // Open the circuit
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);

    // Advance past cooldown — half-open
    vi.advanceTimersByTime(EMBEDDING_CB_COOLDOWN_MS);
    expect(isEmbeddingCircuitOpen()).toBe(false);

    // Probe fails — record failures again to threshold
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);
  });

  it('half-open probe success fully closes circuit', () => {
    // Open the circuit
    for (let i = 0; i < EMBEDDING_CB_THRESHOLD; i++) {
      recordEmbeddingFailure();
    }
    expect(isEmbeddingCircuitOpen()).toBe(true);

    // Advance past cooldown — half-open
    vi.advanceTimersByTime(EMBEDDING_CB_COOLDOWN_MS);
    expect(isEmbeddingCircuitOpen()).toBe(false);

    // Probe succeeds
    recordEmbeddingSuccess();
    expect(embeddingCircuit.failures).toBe(0);
    expect(embeddingCircuit.openedAt).toBeNull();
    expect(isEmbeddingCircuitOpen()).toBe(false);
  });

  it('defaults: threshold is 3, cooldown is 60000ms', () => {
    expect(EMBEDDING_CB_THRESHOLD).toBe(3);
    expect(EMBEDDING_CB_COOLDOWN_MS).toBe(60_000);
  });
});
