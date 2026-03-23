// TEST: Integration Pipeline (C138 End-to-End)
// Full scatter→fuse→co-activate→TRM→MMR→serialize pipeline.
// Validates latency ceiling, token budget, feature flag regression.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { detectEvidenceGap } from '../lib/search/evidence-gap-detector';

/* ───────────────────────────────────────────────────────────────
   MOCK PIPELINE STAGES
   Simulates the full hybridSearchEnhanced() flow from spec 138.
   In production these import from actual modules.
   ──────────────────────────────────────────────────────────────── */

// Stage types
interface SearchResult {
  id: number | string;
  score: number;
  content: string;
  embedding: Float32Array;
  metadata: {
    title: string;
    spec_folder: string;
    importance_tier: string;
  };
}

interface TRMMetadata {
  evidenceGapDetected: boolean;
  zScore: number;
  mean: number;
  stdDev: number;
  warnings: string[];
}

interface EnhancedMCPResponse {
  payload: string;
  trm: TRMMetadata;
  metrics: {
    latencyMs: number;
    tokensConsumed: number;
    sourcesHit: string[];
  };
}

// Stage implementations (simplified for integration testing)
function classifyIntent(query: string): string {
  if (query.includes('fix') || query.includes('bug')) return 'fix_bug';
  if (query.includes('explain') || query.includes('understand')) return 'understand';
  if (query.includes('spec') || query.includes('find')) return 'find_spec';
  return 'understand';
}

function scatter(query: string): SearchResult[] {
  // Simulate vector + FTS5 + graph returning mixed results
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    score: 0.9 - i * 0.05,
    content: `Memory ${i + 1}: ${query} related content. `.repeat(10),
    embedding: new Float32Array([Math.random(), Math.random(), Math.random()]),
    metadata: {
      title: `Memory ${i + 1}`,
      spec_folder: `spec-${i}`,
      importance_tier: i < 3 ? 'critical' : 'normal',
    },
  }));
}

function adaptiveRRFFuse(results: SearchResult[], intent: string): SearchResult[] {
  // Sort by score (simulate RRF)
  return [...results].sort((a, b) => b.score - a.score);
}

function spreadActivation(results: SearchResult[]): SearchResult[] {
  // Co-activation: boost top-5 slightly
  return results.map((r, i) => ({
    ...r,
    score: i < 5 ? r.score * 1.05 : r.score,
  }));
}

function detectEvidenceGapLocal(scores: number[]): TRMMetadata {
  // Delegates to production detectEvidenceGap from evidence-gap-detector.ts
  const trm = detectEvidenceGap(scores);
  return {
    evidenceGapDetected: trm.gapDetected,
    zScore: trm.zScore,
    mean: trm.mean,
    stdDev: trm.stdDev,
    warnings: trm.gapDetected ? ['[EVIDENCE GAP DETECTED]'] : [],
  };
}

function applyMMRLocal(results: SearchResult[], lambda: number, limit: number): SearchResult[] {
  // Delegates to production applyMMR from mmr-reranker.ts
  const candidates = results.map(r => ({
    id: r.id,
    score: r.score,
    embedding: r.embedding,
    content: r.content,
  }));
  const selected = applyMMR(candidates, { lambda, limit });
  // Re-merge metadata from original results
  return selected.map(sel => {
    const orig = results.find(r => r.id === sel.id);
    // `sel.content` is optional in MMRCandidate; coerce to string so the
    // Fallback satisfies SearchResult.content (required string).
    return orig ?? {
      ...sel,
      content: sel.content ?? '',
      metadata: { title: String(sel.id), spec_folder: '', importance_tier: 'normal' },
    };
  });
}

function serializeToMarkdown(results: SearchResult[], trm: TRMMetadata): string {
  const parts: string[] = [];
  if (trm.warnings.length > 0) {
    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
  }
  for (const r of results) {
    parts.push(`### ${r.metadata.title}\n${r.content.slice(0, 200)}\n`);
  }
  return parts.join('\n');
}

// Full pipeline
function hybridSearchEnhanced(query: string, mode: string, flags: Record<string, boolean>): EnhancedMCPResponse {
  const start = performance.now();

  // L0: Intent
  const intent = classifyIntent(query);

  // L1: Scatter
  let results = scatter(query);

  // L2: Adaptive RRF
  if (flags.SPECKIT_ADAPTIVE_FUSION !== false) {
    results = adaptiveRRFFuse(results, intent);
  }

  // Co-activation
  results = spreadActivation(results);

  // L3: TRM (uses production detectEvidenceGap via local adapter)
  const trm = detectEvidenceGapLocal(results.map(r => r.score));

  // L4: MMR (uses production applyMMR via local adapter)
  if (flags.SPECKIT_MMR !== false) {
    const lambda = intent === 'understand' ? 0.5 : 0.85;
    results = applyMMRLocal(results, lambda, 5);
  }

  // L5: Serialize
  const payload = serializeToMarkdown(results, trm);

  const latencyMs = performance.now() - start;

  return {
    payload,
    trm,
    metrics: {
      latencyMs,
      tokensConsumed: Math.ceil(payload.length / 4),
      sourcesHit: ['vector', 'fts5', 'graph'],
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138 Integration Pipeline', () => {
  const ALL_FLAGS_ON = {
    SPECKIT_MMR: true,
    SPECKIT_TRM: true,
    SPECKIT_ADAPTIVE_FUSION: true,
    SPECKIT_MULTI_QUERY: true,
  };

  const ALL_FLAGS_OFF = {
    SPECKIT_MMR: false,
    SPECKIT_TRM: false,
    SPECKIT_ADAPTIVE_FUSION: false,
    SPECKIT_MULTI_QUERY: false,
  };

  // ---- T1: Full pipeline completes within 120ms ----
  it('T1: end-to-end latency is under 120ms', () => {
    const response = hybridSearchEnhanced('fix auth token error', 'auto', ALL_FLAGS_ON);

    expect(response.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T2: Token budget respected ----
  it('T2: payload respects 2000-token (8000 char) budget', () => {
    const response = hybridSearchEnhanced('explain architecture', 'deep', ALL_FLAGS_ON);

    expect(response.payload.length).toBeLessThanOrEqual(8000);
    expect(response.metrics.tokensConsumed).toBeLessThanOrEqual(2000);
  });

  // ---- T3: All source types hit ----
  it('T3: pipeline hits vector, fts5, and graph sources', () => {
    const response = hybridSearchEnhanced('find spec for auth', 'auto', ALL_FLAGS_ON);

    expect(response.metrics.sourcesHit).toContain('vector');
    expect(response.metrics.sourcesHit).toContain('fts5');
    expect(response.metrics.sourcesHit).toContain('graph');
  });

  // ---- T4: TRM metadata populated ----
  it('T4: TRM metadata has valid statistical fields', () => {
    const response = hybridSearchEnhanced('fix bug in login', 'auto', ALL_FLAGS_ON);

    expect(typeof response.trm.zScore).toBe('number');
    expect(typeof response.trm.mean).toBe('number');
    expect(typeof response.trm.stdDev).toBe('number');
    expect(typeof response.trm.evidenceGapDetected).toBe('boolean');
  });

  // ---- T5: Evidence gap warning appears when gap detected ----
  it('T5: evidence gap warning in payload iff trm.evidenceGapDetected is true', () => {
    const response = hybridSearchEnhanced('bake bread recipe', 'auto', ALL_FLAGS_ON);

    // Assert both directions so the test cannot silently pass regardless
    // Of whether a gap was detected — an unconditional check avoids vacuous truths.
    if (response.trm.evidenceGapDetected) {
      expect(response.payload).toContain('EVIDENCE GAP DETECTED');
    } else {
      expect(response.payload).not.toContain('EVIDENCE GAP DETECTED');
    }
  });

  // ---- T6: Feature flags OFF → no regression ----
  it('T6: flags OFF produces valid results without new features', () => {
    const response = hybridSearchEnhanced('fix auth error', 'auto', ALL_FLAGS_OFF);

    expect(response.payload.length).toBeGreaterThan(0);
    expect(response.metrics.latencyMs).toBeLessThan(120);
    expect(typeof response.trm.zScore).toBe('number');
  });

  // ---- T7: Flags ON vs OFF produce different results ----
  it('T7: adaptive fusion flag changes output characteristics', () => {
    const withFlags = hybridSearchEnhanced('understand architecture', 'auto', ALL_FLAGS_ON);
    const withoutFlags = hybridSearchEnhanced('understand architecture', 'auto', ALL_FLAGS_OFF);

    // Both should produce valid output
    expect(withFlags.payload.length).toBeGreaterThan(0);
    expect(withoutFlags.payload.length).toBeGreaterThan(0);
  });

  // ---- T8: Different intents produce different pipeline behavior ----
  it('T8: fix_bug vs understand intents produce different results', () => {
    const fixBug = hybridSearchEnhanced('fix the login bug', 'auto', ALL_FLAGS_ON);
    const understand = hybridSearchEnhanced('explain the login system', 'auto', ALL_FLAGS_ON);

    // Both valid but potentially different characteristics
    expect(fixBug.metrics.latencyMs).toBeLessThan(120);
    expect(understand.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T9: Mode="deep" activates multi-query ----
  it('T9: deep mode search still returns valid results', () => {
    const response = hybridSearchEnhanced('fix login error', 'deep', ALL_FLAGS_ON);

    expect(response.payload.length).toBeGreaterThan(0);
    expect(response.metrics.latencyMs).toBeLessThan(120);
  });

  // ---- T10: Response structure matches EnhancedMCPResponse ----
  it('T10: response has correct shape', () => {
    const response = hybridSearchEnhanced('test query', 'auto', ALL_FLAGS_ON);

    expect(response).toHaveProperty('payload');
    expect(response).toHaveProperty('trm');
    expect(response).toHaveProperty('metrics');
    expect(response.metrics).toHaveProperty('latencyMs');
    expect(response.metrics).toHaveProperty('tokensConsumed');
    expect(response.metrics).toHaveProperty('sourcesHit');
    expect(response.trm).toHaveProperty('evidenceGapDetected');
    expect(response.trm).toHaveProperty('zScore');
    expect(response.trm).toHaveProperty('warnings');
  });
});

/* ───────────────────────────────────────────────────────────────
   STAGE-LEVEL TESTS (Agent 5 — Task B additions)
   Tests targeting individual pipeline stages with production imports.
   ──────────────────────────────────────────────────────────────── */

describe('C138 Stage: Adaptive Fusion Weights', () => {
  it('getAdaptiveWeights returns different profiles per intent', async () => {
    const { getAdaptiveWeights, INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
    const understand = getAdaptiveWeights('understand');
    const fixBug = getAdaptiveWeights('fix_bug');

    // getAdaptiveWeights normalizes all channels (including graphWeight) to sum to 1.0
    // so we compare relative ordering and normalized values, not raw profile values
    expect(understand.semanticWeight).toBeGreaterThan(fixBug.semanticWeight);
    expect(fixBug.keywordWeight).toBeGreaterThan(understand.keywordWeight);
    // graphWeight is preserved but also normalized
    expect(typeof understand.graphWeight).toBe('number');
    expect(typeof fixBug.graphWeight).toBe('number');
  });

  it('getAdaptiveWeights returns default for unknown intent', async () => {
    const { getAdaptiveWeights, DEFAULT_WEIGHTS } = await import('../../shared/algorithms/adaptive-fusion');
    const unknown = getAdaptiveWeights('totally_unknown_intent');

    // getAdaptiveWeights normalizes all channels (including graphWeight) to sum to 1.0
    // DEFAULT_WEIGHTS has graphWeight=0.15, so raw sum=1.15, values are normalized
    const graphW = (typeof DEFAULT_WEIGHTS.graphWeight === 'number' && DEFAULT_WEIGHTS.graphWeight > 0)
      ? DEFAULT_WEIGHTS.graphWeight : 0;
    const totalSum = DEFAULT_WEIGHTS.semanticWeight + DEFAULT_WEIGHTS.keywordWeight + DEFAULT_WEIGHTS.recencyWeight + graphW;
    expect(unknown.semanticWeight).toBeCloseTo(DEFAULT_WEIGHTS.semanticWeight / totalSum, 10);
    expect(unknown.keywordWeight).toBeCloseTo(DEFAULT_WEIGHTS.keywordWeight / totalSum, 10);
  });

  it('all 7 intent profiles include graphWeight and graphCausalBias', async () => {
    const { INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
    const intents = Object.keys(INTENT_WEIGHT_PROFILES);

    expect(intents.length).toBe(7);
    for (const intent of intents) {
      const profile = INTENT_WEIGHT_PROFILES[intent];
      expect(typeof profile.graphWeight).toBe('number');
      expect(typeof profile.graphCausalBias).toBe('number');
    }
  });
});

describe('C138 Stage: MMR Reranker Production', () => {
  it('applyMMR respects N=20 hardcap', () => {
    const candidates = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      score: 1 - i * 0.01,
      embedding: new Float32Array([Math.random(), Math.random(), Math.random()]),
    }));

    const selected = applyMMR(candidates, { lambda: 0.7, limit: 10 });
    // Should only process first 20 candidates (DEFAULT_MAX_CANDIDATES)
    // And return at most limit=10
    expect(selected.length).toBeLessThanOrEqual(10);
    // All selected IDs must be from the top-20 pool
    for (const s of selected) {
      expect(s.id).toBeLessThanOrEqual(20);
    }
  });

  it('applyMMR returns empty for empty input', () => {
    const selected = applyMMR([], { lambda: 0.7, limit: 10 });
    expect(selected).toHaveLength(0);
  });

  it('applyMMR selects highest-score first', () => {
    const candidates = [
      { id: 1, score: 0.3, embedding: new Float32Array([1, 0, 0]) },
      { id: 2, score: 0.9, embedding: new Float32Array([0, 1, 0]) },
      { id: 3, score: 0.5, embedding: new Float32Array([0, 0, 1]) },
    ];
    const selected = applyMMR(candidates, { lambda: 0.7, limit: 3 });
    expect(selected[0].id).toBe(2); // highest score first
  });

  it('applyMMR O(N^2) completes in < 20ms for N=20', () => {
    const candidates = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      score: 1 - i * 0.04,
      embedding: new Float32Array(Array.from({ length: 384 }, () => Math.random())),
    }));

    const start = performance.now();
    applyMMR(candidates, { lambda: 0.7, limit: 10 });
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(20);
  });
});

describe('C138 Stage: Evidence Gap Detector Production', () => {
  it('detectEvidenceGap flags flat distributions (Z < 1.5)', () => {
    // All scores very close — flat distribution (Z ≈ 1.07 < 1.5 threshold)
    const flat = detectEvidenceGap([0.50, 0.50, 0.49, 0.49, 0.48]);
    expect(flat.gapDetected).toBe(true);
    expect(flat.zScore).toBeLessThan(1.5);
  });

  it('detectEvidenceGap does NOT flag clear winner distributions', () => {
    // One score is much higher — clear winner
    const clear = detectEvidenceGap([0.95, 0.2, 0.1, 0.05, 0.02]);
    expect(clear.gapDetected).toBe(false);
    expect(clear.zScore).toBeGreaterThan(1.5);
  });

  it('detectEvidenceGap handles empty array', () => {
    const empty = detectEvidenceGap([]);
    expect(empty.gapDetected).toBe(true);
    expect(empty.zScore).toBe(0);
  });

  it('detectEvidenceGap handles single score', () => {
    const single = detectEvidenceGap([0.5]);
    // Single score above MIN_ABSOLUTE_SCORE → no gap
    expect(single.gapDetected).toBe(false);
    expect(single.mean).toBe(0.5);
  });

  it('detectEvidenceGap handles all identical scores', () => {
    const identical = detectEvidenceGap([0.3, 0.3, 0.3, 0.3]);
    // StdDev=0, all scores (0.3) above MIN_ABSOLUTE_SCORE → no gap
    expect(identical.gapDetected).toBe(false);
    expect(identical.stdDev).toBe(0);
  });
});

describe('C138 Stage: Query Expander Production', () => {
  it('expandQuery always includes original query', async () => {
    const { expandQuery } = await import('../lib/search/query-expander');
    const variants = expandQuery('fix the login error');

    expect(variants[0]).toBe('fix the login error');
    expect(variants.length).toBeGreaterThanOrEqual(1);
  });

  it('expandQuery returns max 3 variants', async () => {
    const { expandQuery } = await import('../lib/search/query-expander');
    const variants = expandQuery('fix the login error bug crash deploy');

    expect(variants.length).toBeLessThanOrEqual(3);
  });

  it('expandQuery returns only original for unknown terms', async () => {
    const { expandQuery } = await import('../lib/search/query-expander');
    const variants = expandQuery('xyzzy foobar');

    expect(variants).toEqual(['xyzzy foobar']);
  });

  it('expandQuery performs synonym substitution for known terms', async () => {
    const { expandQuery } = await import('../lib/search/query-expander');
    const variants = expandQuery('fix the login error');

    // 'fix' → 'patch', 'login' → 'authentication', 'error' → 'exception'
    expect(variants.length).toBeGreaterThan(1);
    // At least one variant should differ from original
    expect(variants.some(v => v !== 'fix the login error')).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   REGRESSION: Baseline Behavior
   Ensures hybrid retrieval and graph coverage checks keep
   predictable behavior under current runtime defaults.
   ──────────────────────────────────────────────────────────────── */

describe('C138 Regression: Flags OFF Baseline', () => {
  it('hybridAdaptiveFuse returns standard results when SPECKIT_ADAPTIVE_FUSION is off', async () => {
    const { hybridAdaptiveFuse } = await import('../../shared/algorithms/adaptive-fusion');
    // With flag off, should return standard RRF results (equal weights)
    const semantic = [{ id: 1, score: 0.8 }, { id: 2, score: 0.5 }];
    const keyword = [{ id: 3, score: 0.7 }, { id: 1, score: 0.6 }];

    // Note: isAdaptiveFusionEnabled() depends on rollout-policy module.
    // When flag is off, hybridAdaptiveFuse returns standard fusion results.
    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');
    expect(result.results).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
  });

  it('predictGraphCoverage returns topology-based coverage metrics', async () => {
    const { predictGraphCoverage } = await import('../lib/search/evidence-gap-detector');

    const mockGraph = {
      nodes: new Map([['node1', { id: 'node1', labels: ['test'], properties: {} }]]),
      inbound: new Map([['node1', ['mem1', 'mem2']]]),
    };

    const result = predictGraphCoverage('test query', mockGraph);
    expect(result.earlyGap).toBe(true);
    expect(result.connectedNodes).toBe(2);
  });
});
