// ───────────────────────────────────────────────────────────────
// MODULE: Cross Encoder
// ───────────────────────────────────────────────────────────────
// Feature catalog: Local GGUF reranker via node-llama-cpp
//
// Neural reranking via external APIs (Voyage rerank-2, Cohere
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
const PROVIDER_CONFIG = {
    voyage: {
        name: 'voyage',
        model: 'rerank-2',
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
};
const LENGTH_PENALTY = {
    shortThreshold: 50,
    longThreshold: 2000,
    shortPenalty: 0.9,
    longPenalty: 0.95,
};
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes
const MAX_CACHE_ENTRIES = 200;
/**
 * Phase C: Enforce cache size bound.
 * Follows the enforceCacheBound() pattern from graph-signals.ts.
 * When the cache exceeds MAX_CACHE_ENTRIES, evicts the oldest entry
 * by timestamp to prevent unbounded memory growth.
 */
function enforceCacheBound() {
    if (cache.size <= MAX_CACHE_ENTRIES)
        return;
    let oldestKey = null;
    let oldestTime = Infinity;
    for (const [key, entry] of cache) {
        if (entry.timestamp < oldestTime) {
            oldestTime = entry.timestamp;
            oldestKey = key;
        }
    }
    if (oldestKey)
        cache.delete(oldestKey);
}
const latencyTracker = { durations: [] };
const MAX_LATENCY_SAMPLES = 100;
// T3-15 circuit breaker — prevents cascading failures when external
// Rerank APIs (Voyage, Cohere) are down. After FAILURE_THRESHOLD consecutive
// Failures, the circuit opens and calls skip the API for COOLDOWN_MS, returning
// Positional fallback scores instead.
const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 60_000; // 1 minute
const circuitBreakers = new Map();
function getCircuit(provider) {
    let state = circuitBreakers.get(provider);
    if (!state) {
        state = { failures: 0, openedAt: null };
        circuitBreakers.set(provider, state);
    }
    return state;
}
function isCircuitOpen(provider) {
    const state = getCircuit(provider);
    if (state.openedAt === null)
        return false;
    if (Date.now() - state.openedAt >= CIRCUIT_COOLDOWN_MS) {
        // Cooldown elapsed — half-open: allow one attempt
        state.openedAt = null;
        state.failures = 0;
        return false;
    }
    return true;
}
function recordSuccess(provider) {
    const state = getCircuit(provider);
    state.failures = 0;
    state.openedAt = null;
}
function recordFailure(provider) {
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
function resolveProvider() {
    if (!isCrossEncoderEnabled()) {
        return null;
    }
    // Check API keys in priority order
    if (process.env.VOYAGE_API_KEY)
        return 'voyage';
    if (process.env.COHERE_API_KEY)
        return 'cohere';
    if (process.env.RERANKER_LOCAL?.toLowerCase().trim() === 'true')
        return 'local';
    return null;
}
/* ───────────────────────────────────────────────────────────────
   5. LENGTH PENALTY
----------------------------------------------------------------*/
function calculateLengthPenalty(contentLength) {
    if (contentLength < LENGTH_PENALTY.shortThreshold)
        return LENGTH_PENALTY.shortPenalty;
    if (contentLength > LENGTH_PENALTY.longThreshold)
        return LENGTH_PENALTY.longPenalty;
    return 1.0;
}
function applyLengthPenalty(results) {
    return results
        .map(r => {
        const content = r.content || '';
        const penalty = calculateLengthPenalty(content.length);
        const rerankerScore = r.rerankerScore * penalty;
        return {
            ...r,
            rerankerScore,
            score: rerankerScore,
        };
    })
        .sort((a, b) => b.score - a.score);
}
/* ───────────────────────────────────────────────────────────────
   6. CACHE
----------------------------------------------------------------*/
// H19 FIX: Include provider and option bits in the cache key while
// canonicalizing document IDs so equivalent document sets hit the same cache entry.
function generateCacheKey(query, docIds, provider, optionBits) {
    const sortedDocIds = [...docIds]
        .map(id => String(id))
        .sort();
    const key = `${provider || 'default'}:${optionBits || ''}:${query}:${sortedDocIds.join(',')}`;
    // Simple hash
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `rerank-${Math.abs(hash).toString(36)}`;
}
/* ───────────────────────────────────────────────────────────────
   7. PROVIDER-SPECIFIC RERANKING
----------------------------------------------------------------*/
async function rerankVoyage(query, documents) {
    const config = PROVIDER_CONFIG.voyage;
    const apiKey = process.env[config.apiKeyEnv];
    if (!apiKey)
        throw new Error('VOYAGE_API_KEY not set');
    // P3-13: Build map of document ID → input position (pre-rerank rank)
    const inputRankMap = new Map();
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
    const data = await response.json();
    return data.data.map((item) => ({
        ...documents[item.index],
        rerankerScore: item.relevance_score,
        score: item.relevance_score,
        originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
        provider: 'voyage',
        scoringMethod: 'cross-encoder',
    })).sort((a, b) => b.rerankerScore - a.rerankerScore);
}
async function rerankCohere(query, documents) {
    const config = PROVIDER_CONFIG.cohere;
    const apiKey = process.env[config.apiKeyEnv];
    if (!apiKey)
        throw new Error('COHERE_API_KEY not set');
    // P3-13: Build map of document ID → input position (pre-rerank rank)
    const inputRankMap = new Map();
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
    const data = await response.json();
    return data.results.map((item) => ({
        ...documents[item.index],
        rerankerScore: item.relevance_score,
        score: item.relevance_score,
        originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
        provider: 'cohere',
        scoringMethod: 'cross-encoder',
    })).sort((a, b) => b.rerankerScore - a.rerankerScore);
}
async function rerankLocal(query, documents) {
    const config = PROVIDER_CONFIG.local;
    // P3-13: Build map of document ID → input position (pre-rerank rank)
    const inputRankMap = new Map();
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
    const data = await response.json();
    return data.results.map((item) => ({
        ...documents[item.index],
        rerankerScore: item.relevance_score,
        score: item.relevance_score,
        originalRank: inputRankMap.get(documents[item.index].id) ?? item.index,
        provider: 'local',
        scoringMethod: 'cross-encoder',
    })).sort((a, b) => b.rerankerScore - a.rerankerScore);
}
/* ───────────────────────────────────────────────────────────────
   8. MAIN RERANK FUNCTION
----------------------------------------------------------------*/
async function rerankResults(query, documents, options = {}) {
    const { limit = 10, useCache = true, applyLengthPenalty: shouldApplyLengthPenalty = true } = options;
    if (!documents || documents.length === 0)
        return [];
    const provider = resolveProvider();
    if (!provider) {
        // No reranker available — P3-16: use 'fallback' scoringMethod and distinct score range
        return documents.slice(0, limit).map((d, i) => ({
            ...d,
            rerankerScore: 0.5 - (i / (documents.length * 2)),
            score: 0.5 - (i / (documents.length * 2)),
            originalRank: i,
            provider: 'none',
            scoringMethod: 'fallback',
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
            scoringMethod: 'fallback',
        }));
    }
    // Check cache — H19 FIX: include provider and options in cache key
    const optionBits = shouldApplyLengthPenalty ? 'lp' : '';
    if (useCache) {
        const cacheKey = generateCacheKey(query, documents.map(d => d.id), provider, optionBits);
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.results.slice(0, limit);
        }
    }
    const start = Date.now();
    try {
        let results;
        switch (provider) {
            case 'voyage':
                results = await rerankVoyage(query, documents);
                break;
            case 'cohere':
                results = await rerankCohere(query, documents);
                break;
            case 'local':
                results = await rerankLocal(query, documents);
                break;
            default:
                throw new Error(`Unknown provider: ${provider}`);
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
        // Cache results — H19 FIX: use provider+options-aware cache key
        // Phase C: enforceCacheBound() ensures MAX_CACHE_ENTRIES limit.
        if (useCache) {
            const cacheKey = generateCacheKey(query, documents.map(d => d.id), provider, optionBits);
            cache.set(cacheKey, { results, timestamp: Date.now() });
            enforceCacheBound();
        }
        recordSuccess(provider);
        return results.slice(0, limit);
    }
    catch (error) {
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
            scoringMethod: 'fallback',
        }));
    }
}
/* ───────────────────────────────────────────────────────────────
   9. STATUS & CLEANUP
----------------------------------------------------------------*/
function isRerankerAvailable() {
    return resolveProvider() !== null;
}
function getRerankerStatus() {
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
    };
}
function resetSession() {
    cache.clear();
    latencyTracker.durations = [];
    circuitBreakers.clear();
}
function resetProvider() {
    // No-op: activeProvider cache removed (was never populated)
}
/* ───────────────────────────────────────────────────────────────
   10. EXPORTS
----------------------------------------------------------------*/
export { PROVIDER_CONFIG, LENGTH_PENALTY, 
// Provider
resolveProvider, calculateLengthPenalty, applyLengthPenalty, generateCacheKey, 
// Reranking
rerankVoyage, rerankCohere, rerankLocal, rerankResults, 
// Status
isRerankerAvailable, getRerankerStatus, resetSession, resetProvider, };
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
//# sourceMappingURL=cross-encoder.js.map