// ───────────────────────────────────────────────────────────────
// MODULE: Cross Encoder
// ───────────────────────────────────────────────────────────────
// Feature catalog: Local GGUF reranker via node-llama-cpp
//
// Neural reranking via external APIs (Voyage rerank-2.5, Cohere
// Rerank-english-v3.0) or a local cross-encoder model
// (ms-marco-MiniLM-L-6-v2). When no provider is configured the
// Module returns a positional fallback (scored 0–0.5) and marks
// Results with scoringMethod:'fallback' so callers can distinguish
// Real model scores from synthetic ones.
//
// T204 / OQ-02 DECISION (2026-02-10):
// The filename "cross-encoder.ts" is ACCURATE.  All three
// Providers invoke real ML-based reranking — either cloud APIs
// That run neural rerankers server-side (Voyage, Cohere) or a
// Local cross-encoder model.  The positional fallback is NOT a
// Cross-encoder, but is already clearly separated via the
// ScoringMethod discriminator.  No rename required.
/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
----------------------------------------------------------------*/

import { isCrossEncoderEnabled } from './search-flags.js';

interface ProviderConfigEntry {
  name: string;
  model: string;
  endpoint: string;
  apiKeyEnv: string;
  maxDocuments: number;
  timeout: number;
}

const PROVIDER_CONFIG: Record<string, ProviderConfigEntry> = {
  voyage: {
    name: 'voyage',
    model: 'rerank-2.5',
    endpoint: 'https://api.voyageai.com/v1/rerank',
    apiKeyEnv: 'VOYAGE_API_KEY',
    maxDocuments: 100,
    timeout: 15000,
  },
  cohere: {
    name: 'cohere',
    model: 'rerank-english-v3.0',
    endpoint: 'https://api.cohere.ai/v1/rerank',
    apiKeyEnv: 'COHERE_API_KEY',
    maxDocuments: 100,
    timeout: 15000,
  },
  local: {
    name: 'local',
    model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
    endpoint: 'http://localhost:8765/rerank',
    apiKeyEnv: '',
    maxDocuments: 50,
    timeout: 30000,
  },
} as const;

const LENGTH_PENALTY = {
  shortThreshold: 50,
  longThreshold: 2000,
  shortPenalty: 1.0,
  longPenalty: 1.0,
} as const;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface RerankDocument {
  id: number | string;
  content: string;
  title?: string;
  [key: string]: unknown;
}

interface RerankApiResult {
  index: number;
  relevance_score: number;
}

interface RerankResult {
  id: number | string;
  score: number;
  originalRank: number;
  rerankerScore: number;
  provider: string;
  /**
   * P3-16: Discriminator for score origin.
   *   'cross-encoder'      — score from a neural reranker (Voyage / Cohere API or local model)
   *   'cross-encoder-tail' — F-011-C1-03: candidate fell outside the provider
   *                          maxDocuments window; original ordering preserved,
   *                          synthetic positional score appended after the
   *                          reranked head
   *   'fallback'           — synthetic positional score (0–0.5) when no provider is available
   */
  scoringMethod: 'cross-encoder' | 'cross-encoder-tail' | 'fallback';
  [key: string]: unknown;
}

interface RerankerStatus {
  available: boolean;
  provider: string | null;
  model: string | null;
  latency: {
    avg: number;
    p95: number;
    count: number;
  };
  cache: {
    hits: number;
    misses: number;
    staleHits: number;
    evictions: number;
    entries: number;
    maxEntries: number;
    ttlMs: number;
  };
}

type CacheKeyDocumentInput = RerankDocument | number | string;

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

const cache = new Map<string, { results: RerankResult[]; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes
const MAX_CACHE_ENTRIES = 200;
const cacheTelemetry = {
  hits: 0,
  misses: 0,
  staleHits: 0,
  evictions: 0,
};

/**
 * Phase C: Enforce cache size bound.
 * Follows the enforceCacheBound() pattern from graph-signals.ts.
 * When the cache exceeds MAX_CACHE_ENTRIES, evicts the oldest entry
 * by timestamp to prevent unbounded memory growth.
 */
function enforceCacheBound(): void {
  if (cache.size <= MAX_CACHE_ENTRIES) return;
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of cache) {
    if (entry.timestamp < oldestTime) {
      oldestTime = entry.timestamp;
      oldestKey = key;
    }
  }
  if (oldestKey) {
    cache.delete(oldestKey);
    cacheTelemetry.evictions++;
  }
}

const latencyTracker: { durations: number[] } = { durations: [] };
const MAX_LATENCY_SAMPLES = 100;

// T3-15 circuit breaker — prevents cascading failures when external
// Rerank APIs (Voyage, Cohere) are down. After FAILURE_THRESHOLD consecutive
// Failures, the circuit opens and calls skip the API for COOLDOWN_MS, returning
// Positional fallback scores instead.
const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 60_000; // 1 minute

interface CircuitState {
  failures: number;
  openedAt: number | null;
}

const circuitBreakers = new Map<string, CircuitState>();

function getCircuit(provider: string): CircuitState {
  let state = circuitBreakers.get(provider);
  if (!state) {
    state = { failures: 0, openedAt: null };
    circuitBreakers.set(provider, state);
  }
  return state;
}

function isCircuitOpen(provider: string): boolean {
  const state = getCircuit(provider);
  if (state.openedAt === null) return false;
  if (Date.now() - state.openedAt >= CIRCUIT_COOLDOWN_MS) {
    // Cooldown elapsed — half-open: allow one attempt
    state.openedAt = null;
    state.failures = 0;
    return false;
  }
  return true;
}

function recordSuccess(provider: string): void {
  const state = getCircuit(provider);
  state.failures = 0;
  state.openedAt = null;
}

function recordFailure(provider: string): void {
  const state = getCircuit(provider);
  state.failures++;
  if (state.failures >= CIRCUIT_FAILURE_THRESHOLD) {
    state.openedAt = Date.now();
    console.warn(`[cross-encoder] Circuit breaker OPEN for ${provider} after ${state.failures} consecutive failures. Cooldown: ${CIRCUIT_COOLDOWN_MS}ms`);
  }
}

/* ───────────────────────────────────────────────────────────────
   4. PROVIDER RESOLUTION
----------------------------------------------------------------*/

function resolveProvider(): string | null {
  if (!isCrossEncoderEnabled()) {
    return null;
  }

  // Check API keys in priority order
  if (process.env.VOYAGE_API_KEY) return 'voyage';
  if (process.env.COHERE_API_KEY) return 'cohere';
  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() === 'true') return 'local';

  return null;
}

/* ───────────────────────────────────────────────────────────────
   5. LENGTH PENALTY
----------------------------------------------------------------*/

function calculateLengthPenalty(contentLength: number): number {
  void contentLength;
  return 1.0;
}

function applyLengthPenalty(
  results: RerankResult[]
): RerankResult[] {
  // Length penalty removed - in an embedded RAG system, penalizing docs for natural size is counterproductive (78.6% of spec docs exceed 2000 chars)
  return [...results];
}

/* ───────────────────────────────────────────────────────────────
   6. CACHE
----------------------------------------------------------------*/

// H19 FIX: Include provider and option bits in the cache key while
// canonicalizing document identity so equivalent document sets hit the same cache entry.
function generateCacheKey(
  query: string,
  documents: CacheKeyDocumentInput[],
  provider?: string,
  optionBits?: string,
): string {
  void optionBits;
  const sortedDocuments = [...documents]
    .map(document => {
      if (typeof document === 'object' && document !== null && 'id' in document) {
        return `${String(document.id)}:${hashString(document.content)}`;
      }
      return String(document);
    })
    .sort();
  const key = `${provider || 'default'}:${query}:${sortedDocuments.join(',')}`;
  return `rerank-${hashString(key)}`;
}

function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/* ───────────────────────────────────────────────────────────────
   7. PROVIDER-SPECIFIC RERANKING
----------------------------------------------------------------*/

async function rerankVoyage(
  query: string,
  documents: RerankDocument[]
): Promise<RerankResult[]> {
  const config = PROVIDER_CONFIG.voyage;
  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error('VOYAGE_API_KEY not set');

  // P3-13: Build map of document ID → input position (pre-rerank rank)
  const inputRankMap = new Map<number | string, number>();
  documents.forEach((d, i) => inputRankMap.set(d.id, i));

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      query,
      documents: documents.map(d => d.content),
    }),
    signal: AbortSignal.timeout(config.timeout),
  });

  if (!response.ok) {
    throw new Error(`Voyage rerank failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { data: RerankApiResult[] };

  return data.data.map((item: RerankApiResult) => ({
    ...documents[item.index],
    rerankerScore: item.relevance_score,
    score: item.relevance_score,
    originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
    provider: 'voyage',
    scoringMethod: 'cross-encoder' as const,
  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
}

async function rerankCohere(
  query: string,
  documents: RerankDocument[]
): Promise<RerankResult[]> {
  const config = PROVIDER_CONFIG.cohere;
  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error('COHERE_API_KEY not set');

  // P3-13: Build map of document ID → input position (pre-rerank rank)
  const inputRankMap = new Map<number | string, number>();
  documents.forEach((d, i) => inputRankMap.set(d.id, i));

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      query,
      documents: documents.map(d => d.content),
    }),
    signal: AbortSignal.timeout(config.timeout),
  });

  if (!response.ok) {
    throw new Error(`Cohere rerank failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { results: RerankApiResult[] };

  return data.results.map((item: RerankApiResult) => ({
    ...documents[item.index],
    rerankerScore: item.relevance_score,
    score: item.relevance_score,
    originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
    provider: 'cohere',
    scoringMethod: 'cross-encoder' as const,
  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
}

async function rerankLocal(
  query: string,
  documents: RerankDocument[]
): Promise<RerankResult[]> {
  const config = PROVIDER_CONFIG.local;

  // P3-13: Build map of document ID → input position (pre-rerank rank)
  const inputRankMap = new Map<number | string, number>();
  documents.forEach((d, i) => inputRankMap.set(d.id, i));

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      documents: documents.map(d => d.content),
    }),
    signal: AbortSignal.timeout(config.timeout),
  });

  if (!response.ok) {
    throw new Error(`Local rerank failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { results: RerankApiResult[] };

  return data.results.map((item: RerankApiResult) => ({
    ...documents[item.index],
    rerankerScore: item.relevance_score,
    score: item.relevance_score,
    originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
    provider: 'local',
    scoringMethod: 'cross-encoder' as const,
  })).sort((a: RerankResult, b: RerankResult) => b.rerankerScore - a.rerankerScore);
}

/* ───────────────────────────────────────────────────────────────
   8. MAIN RERANK FUNCTION
----------------------------------------------------------------*/

async function rerankResults(
  query: string,
  documents: RerankDocument[],
  options: { limit?: number; useCache?: boolean; applyLengthPenalty?: boolean } = {}
): Promise<RerankResult[]> {
  const { limit = 10, useCache = true, applyLengthPenalty: shouldApplyLengthPenalty = true } = options;

  if (!documents || documents.length === 0) return [];

  const provider = resolveProvider();
  if (!provider) {
    // No reranker available — P3-16: use 'fallback' scoringMethod and distinct score range
    return documents.slice(0, limit).map((d, i) => ({
      ...d,
      rerankerScore: 0.5 - (i / (documents.length * 2)),
      score: 0.5 - (i / (documents.length * 2)),
      originalRank: i,
      provider: 'none',
      scoringMethod: 'fallback' as const,
    }));
  }

  // T3-15 — Circuit breaker check. When the provider has failed
  // Consecutively, skip the API call and return positional fallback.
  if (isCircuitOpen(provider)) {
    return documents.slice(0, limit).map((d, i) => ({
      ...d,
      rerankerScore: 0.5 - (i / (documents.length * 2)),
      score: 0.5 - (i / (documents.length * 2)),
      originalRank: i,
      provider: 'fallback',
      scoringMethod: 'fallback' as const,
    }));
  }

  // Check cache — length penalty is now a no-op, so cache keys only vary by
  // provider + query + canonicalized document ids and content fingerprints.
  if (useCache) {
    const cacheKey = generateCacheKey(query, documents, provider);
    const cached = cache.get(cacheKey);
    if (cached) {
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        cacheTelemetry.hits++;
        return cached.results.slice(0, limit);
      }

      cacheTelemetry.misses++;
      cacheTelemetry.staleHits++;
      cacheTelemetry.evictions++;
      cache.delete(cacheKey);
    } else {
      cacheTelemetry.misses++;
    }
  }

  const start = Date.now();

  // F-011-C1-03: enforce provider maxDocuments BEFORE the API call. The
  // PROVIDER_CONFIG declared a per-provider cap (Voyage / Cohere = 100,
  // local = 50) but the previous code never applied it — providers received
  // the entire candidate list, inflating API quota usage and payload size.
  // We split into head (top-N for the provider) and tail (remainder, kept
  // in original order with `cross-encoder-tail` marker so callers can audit
  // that those rows did NOT receive a neural score). Documents arrive in
  // upstream-ranked order (Stage 3 sorts by effective score before calling),
  // so the natural head is the higher-quality slice.
  const providerCap = PROVIDER_CONFIG[provider]?.maxDocuments ?? documents.length;
  const head = documents.length > providerCap
    ? documents.slice(0, providerCap)
    : documents;
  const tail = documents.length > providerCap
    ? documents.slice(providerCap)
    : [];

  try {
    let results: RerankResult[];

    switch (provider) {
      case 'voyage':
        results = await rerankVoyage(query, head);
        break;
      case 'cohere':
        results = await rerankCohere(query, head);
        break;
      case 'local':
        results = await rerankLocal(query, head);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    // F-011-C1-03: append the un-reranked tail in original order. Tail rows
    // get a deterministic positional score below the head's minimum so they
    // sort cleanly after the reranked head when the caller slices to `limit`.
    if (tail.length > 0) {
      const tailBaseScore = 0.4; // below typical neural rerank scores (~0.5+)
      const tailResults: RerankResult[] = tail.map((document, index) => ({
        ...document,
        rerankerScore: tailBaseScore - (index / (tail.length * 4)),
        score: tailBaseScore - (index / (tail.length * 4)),
        originalRank: providerCap + index,
        provider,
        scoringMethod: 'cross-encoder-tail' as const,
      }));
      results = [...results, ...tailResults];
    }

    // Apply length penalty only when requested
    if (shouldApplyLengthPenalty) {
      results = applyLengthPenalty(results);
    }

    // Track latency
    const duration = Date.now() - start;
    latencyTracker.durations.push(duration);
    if (latencyTracker.durations.length > MAX_LATENCY_SAMPLES) {
      latencyTracker.durations.shift();
    }

    // Cache results — length penalty is retired, so cache keys ignore that flag.
    // Phase C: enforceCacheBound() ensures MAX_CACHE_ENTRIES limit.
    if (useCache) {
      const cacheKey = generateCacheKey(query, documents, provider);
      cache.set(cacheKey, { results, timestamp: Date.now() });
      enforceCacheBound();
    }

    recordSuccess(provider);
    return results.slice(0, limit);
  } catch (error: unknown) {
    recordFailure(provider);
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[cross-encoder] Reranking failed (${provider}): ${msg} — falling back to positional scoring`);
    // Fallback scores use distinct range (0–0.5) and scoringMethod marker
    return documents.slice(0, limit).map((d, i) => ({
      ...d,
      rerankerScore: 0.5 - (i / (documents.length * 2)),
      score: 0.5 - (i / (documents.length * 2)),
      originalRank: i,
      provider: 'fallback',
      scoringMethod: 'fallback' as const,
    }));
  }
}

/* ───────────────────────────────────────────────────────────────
   9. STATUS & CLEANUP
----------------------------------------------------------------*/

function isRerankerAvailable(): boolean {
  return resolveProvider() !== null;
}

function getRerankerStatus(): RerankerStatus {
  const provider = resolveProvider();
  const durations = latencyTracker.durations;

  let avg = 0;
  let p95 = 0;

  if (durations.length > 0) {
    avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const sorted = [...durations].sort((a, b) => a - b);
    // L3 FIX: Correct p95 percentile index with bounds clamping
    p95 = sorted[Math.min(Math.ceil(sorted.length * 0.95) - 1, sorted.length - 1)] || 0;
  }

  return {
    available: provider !== null,
    provider,
    model: provider ? PROVIDER_CONFIG[provider]?.model || null : null,
    latency: {
      avg: Math.round(avg),
      p95: Math.round(p95),
      count: durations.length,
    },
    cache: {
      hits: cacheTelemetry.hits,
      misses: cacheTelemetry.misses,
      staleHits: cacheTelemetry.staleHits,
      evictions: cacheTelemetry.evictions,
      entries: cache.size,
      maxEntries: MAX_CACHE_ENTRIES,
      ttlMs: CACHE_TTL,
    },
  };
}

function resetSession(): void {
  cache.clear();
  cacheTelemetry.hits = 0;
  cacheTelemetry.misses = 0;
  cacheTelemetry.staleHits = 0;
  cacheTelemetry.evictions = 0;
  latencyTracker.durations = [];
  circuitBreakers.clear();
}

function resetProvider(): void {
  // No-op: activeProvider cache removed (was never populated)
}

/* ───────────────────────────────────────────────────────────────
   10. EXPORTS
----------------------------------------------------------------*/

export {
  PROVIDER_CONFIG,
  LENGTH_PENALTY,

  // Provider
  resolveProvider,
  calculateLengthPenalty,
  applyLengthPenalty,
  generateCacheKey,

  // Reranking
  rerankVoyage,
  rerankCohere,
  rerankLocal,
  rerankResults,

  // Status
  isRerankerAvailable,
  getRerankerStatus,
  resetSession,
  resetProvider,
};

export type {
  RerankDocument,
  RerankResult,
  RerankerStatus,
  ProviderConfigEntry,
};

/**
 * G3: Internal circuit breaker functions exposed for unit testing.
 * Not intended for production use outside the test harness.
 */
export const __testables = {
  getCircuit,
  isCircuitOpen,
  recordSuccess,
  recordFailure,
  circuitBreakers,
  CIRCUIT_FAILURE_THRESHOLD,
  CIRCUIT_COOLDOWN_MS,
  enforceCacheBound,
  MAX_CACHE_ENTRIES,
  cache,
};
