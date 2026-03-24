// ───────────────────────────────────────────────────────────────
// 1. TEST — FEATURE EVALUATION — QUERY INTELLIGENCE
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// T001: Query complexity classifier
import {
  classifyQueryComplexity,
  SIMPLE_TERM_THRESHOLD,
  COMPLEX_TERM_THRESHOLD,
  extractTerms,
  calculateStopWordRatio,
  hasTriggerMatch,
} from '../lib/search/query-classifier';

// T003: Channel min-representation R2
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
  QUALITY_FLOOR,
} from '../lib/search/channel-representation';

// T006: Confidence truncation
import {
  truncateByConfidence,
  computeGaps,
  computeMedian,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from '../lib/search/confidence-truncation';

// T007: Dynamic token budget
import {
  getDynamicTokenBudget,
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from '../lib/search/dynamic-token-budget';

/* --- HELPER: set env vars and restore after each test --- */

let envBackup: Record<string, string | undefined>;

beforeEach(() => {
  envBackup = {
    SPECKIT_COMPLEXITY_ROUTER: process.env.SPECKIT_COMPLEXITY_ROUTER,
    SPECKIT_RSF_FUSION: process.env.SPECKIT_RSF_FUSION,
    SPECKIT_CHANNEL_MIN_REP: process.env.SPECKIT_CHANNEL_MIN_REP,
    SPECKIT_CONFIDENCE_TRUNCATION: process.env.SPECKIT_CONFIDENCE_TRUNCATION,
    SPECKIT_DYNAMIC_TOKEN_BUDGET: process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET,
  };
});

afterEach(() => {
  for (const [key, val] of Object.entries(envBackup)) {
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
});

/* ═══════════════════════════════════════════════════════════════
   T001: Query Complexity Classifier
   ═══════════════════════════════════════════════════════════════ */

describe('T001: Query Complexity Classifier', () => {
  beforeEach(() => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
  });

  it('T001-01: "save" classifies as simple via trigger match', () => {
    const result = classifyQueryComplexity('save', ['save', 'load', 'find']);
    expect(result.tier).toBe('simple');
    expect(result.features.hasTriggerMatch).toBe(true);
  });

  it('T001-02: long natural-language query classifies as complex (>8 terms)', () => {
    const query = 'how does the authentication system handle OAuth token refresh in production';
    const result = classifyQueryComplexity(query);
    expect(result.tier).toBe('complex');
    expect(result.features.termCount).toBeGreaterThan(COMPLEX_TERM_THRESHOLD);
  });

  it('T001-03: 3-term query classifies as simple (at boundary), 4-term as moderate', () => {
    // 3 terms: termCount <= SIMPLE_TERM_THRESHOLD (3) → simple
    const atBoundary = classifyQueryComplexity('find API endpoints');
    expect(atBoundary.tier).toBe('simple');
    expect(atBoundary.features.termCount).toBe(3);

    // 5 terms: above simple threshold (3), below complex (>8) → moderate
    const aboveBoundary = classifyQueryComplexity('find all API endpoints now');
    expect(aboveBoundary.tier).toBe('moderate');
    expect(aboveBoundary.features.termCount).toBe(5);
  });

  it('T001-04: confidence is a valid label (high, medium, low, or fallback)', () => {
    const validLabels = ['high', 'medium', 'low', 'fallback'];
    const result = classifyQueryComplexity('tell me about database indexing strategies');
    expect(validLabels).toContain(result.confidence);
  });

  it('T001-05: feature flag disabled returns complex fallback', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    const result = classifyQueryComplexity('save', ['save']);
    expect(result.tier).toBe('complex');
    expect(result.confidence).toBe('fallback');
  });

  it('T001-06: empty query returns complex fallback', () => {
    const result = classifyQueryComplexity('');
    expect(result.tier).toBe('complex');
    expect(result.confidence).toBe('fallback');
  });
});

/* ═══════════════════════════════════════════════════════════════
   T003: Channel Min-Representation R2
   ═══════════════════════════════════════════════════════════════ */

describe('T003: Channel Min-Representation R2', () => {
  beforeEach(() => {
    process.env.SPECKIT_CHANNEL_MIN_REP = 'true';
  });

  it('T003-01: QUALITY_FLOOR constant is 0.005', () => {
    expect(QUALITY_FLOOR).toBe(0.005);
  });

  it('T003-02: vector-dominated results get padded with under-represented channels', () => {
    const topK = [
      { id: 1, score: 0.9, source: 'vector' },
      { id: 2, score: 0.85, source: 'vector' },
      { id: 3, score: 0.8, source: 'vector' },
    ];

    const allChannelResults = new Map([
      ['vector', [{ id: 1, score: 0.9 }, { id: 2, score: 0.85 }, { id: 3, score: 0.8 }]],
      ['bm25', [{ id: 10, score: 0.5 }, { id: 11, score: 0.3 }]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    // Bm25 was under-represented (0 in topK) and has results above QUALITY_FLOOR
    expect(result.underRepresentedChannels).toContain('bm25');
    expect(result.promoted.length).toBeGreaterThan(0);
    expect(result.promoted[0].promotedFrom).toBe('bm25');
    expect(result.topK.length).toBeGreaterThan(topK.length);
  });

  it('T003-03: already-balanced channels are not modified', () => {
    const topK = [
      { id: 1, score: 0.9, source: 'vector' },
      { id: 2, score: 0.85, source: 'bm25' },
      { id: 3, score: 0.8, source: 'graph' },
    ];

    const allChannelResults = new Map([
      ['vector', [{ id: 1, score: 0.9 }]],
      ['bm25', [{ id: 2, score: 0.85 }]],
      ['graph', [{ id: 3, score: 0.8 }]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.underRepresentedChannels).toHaveLength(0);
    expect(result.promoted).toHaveLength(0);
    expect(result.topK).toHaveLength(3);
  });

  it('T003-04: below QUALITY_FLOOR items are NOT promoted', () => {
    const topK = [
      { id: 1, score: 0.9, source: 'vector' },
    ];

    const allChannelResults = new Map([
      ['vector', [{ id: 1, score: 0.9 }]],
      ['bm25', [{ id: 10, score: 0.003 }]], // below 0.005 floor
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    // Bm25 is under-represented but its best result is below QUALITY_FLOOR
    expect(result.underRepresentedChannels).toContain('bm25');
    expect(result.promoted).toHaveLength(0); // nothing promoted — below floor
  });

  it('T003-05: feature flag disabled returns topK unchanged', () => {
    process.env.SPECKIT_CHANNEL_MIN_REP = 'false';

    const topK = [
      { id: 1, score: 0.9, source: 'vector' },
    ];
    const allChannelResults = new Map([
      ['vector', [{ id: 1, score: 0.9 }]],
      ['bm25', [{ id: 10, score: 0.5 }]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(0);
    expect(result.underRepresentedChannels).toHaveLength(0);
    expect(result.topK).toHaveLength(1);
  });
});

/* ═══════════════════════════════════════════════════════════════
   T006: Confidence Truncation
   ═══════════════════════════════════════════════════════════════ */

describe('T006: Confidence Truncation', () => {
  beforeEach(() => {
    process.env.SPECKIT_CONFIDENCE_TRUNCATION = 'true';
  });

  it('T006-01: scores [0.9, 0.85, 0.8, 0.3, 0.1] truncates after 0.8 (large gap)', () => {
    const results = [
      { id: 1, score: 0.9 },
      { id: 2, score: 0.85 },
      { id: 3, score: 0.8 },
      { id: 4, score: 0.3 },
      { id: 5, score: 0.1 },
    ];

    const output = truncateByConfidence(results);

    // Gaps: 0.05, 0.05, 0.50, 0.20
    // Median gap: median of [0.05, 0.05, 0.50, 0.20] = (0.05+0.20)/2 = 0.125
    // Threshold: 2 * 0.125 = 0.25
    // Gap at index 2 (between 0.8 and 0.3) = 0.50 > 0.25 → truncate after index 2
    expect(output.truncated).toBe(true);
    expect(output.results).toHaveLength(3);
    expect(output.results.map(r => r.id)).toEqual([1, 2, 3]);
  });

  it('T006-02: minimum 3 results kept even with large early gaps', () => {
    const results = [
      { id: 1, score: 0.9 },
      { id: 2, score: 0.1 }, // huge gap after #1
      { id: 3, score: 0.09 },
      { id: 4, score: 0.08 },
    ];

    const output = truncateByConfidence(results, { minResults: 3 });

    // Gap at index 0 = 0.8, but minResults=3 so we start scanning at index 2
    // Gap at index 2 = 0.01 — not significant
    expect(output.results.length).toBeGreaterThanOrEqual(3);
  });

  it('T006-03: NaN and Infinity values are filtered out', () => {
    const results = [
      { id: 1, score: 0.9 },
      { id: 2, score: NaN },
      { id: 3, score: Infinity },
      { id: 4, score: 0.8 },
      { id: 5, score: 0.7 },
    ];

    const output = truncateByConfidence(results);

    // NaN and Infinity should be removed
    const ids = output.results.map(r => r.id);
    expect(ids).not.toContain(2);
    expect(ids).not.toContain(3);
    // Valid items remain
    expect(ids).toContain(1);
    expect(ids).toContain(4);
    expect(ids).toContain(5);
  });

  it('T006-04: uniform scores (no gaps) returns all results', () => {
    const results = [
      { id: 1, score: 0.5 },
      { id: 2, score: 0.5 },
      { id: 3, score: 0.5 },
      { id: 4, score: 0.5 },
    ];

    const output = truncateByConfidence(results);

    expect(output.truncated).toBe(false);
    expect(output.results).toHaveLength(4);
  });

  it('T006-05: feature flag disabled passes through all results', () => {
    process.env.SPECKIT_CONFIDENCE_TRUNCATION = 'false';

    const results = [
      { id: 1, score: 0.9 },
      { id: 2, score: 0.1 }, // massive gap
    ];

    const output = truncateByConfidence(results);

    expect(output.truncated).toBe(false);
    expect(output.results).toHaveLength(2);
  });
});

/* ═══════════════════════════════════════════════════════════════
   T007: Dynamic Token Budget
   ═══════════════════════════════════════════════════════════════ */

describe('T007: Dynamic Token Budget', () => {
  beforeEach(() => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';
  });

  it('T007-01: simple tier returns 1500 tokens', () => {
    const result = getDynamicTokenBudget('simple');
    expect(result.budget).toBe(1500);
    expect(result.applied).toBe(true);
  });

  it('T007-02: moderate tier returns 2500 tokens', () => {
    const result = getDynamicTokenBudget('moderate');
    expect(result.budget).toBe(2500);
    expect(result.applied).toBe(true);
  });

  it('T007-03: complex tier returns 4000 tokens', () => {
    const result = getDynamicTokenBudget('complex');
    expect(result.budget).toBe(4000);
    expect(result.applied).toBe(true);
  });

  it('T007-04: feature flag disabled returns default 4000 budget with applied=false', () => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'false';

    const result = getDynamicTokenBudget('simple');
    expect(result.budget).toBe(DEFAULT_BUDGET);
    expect(result.applied).toBe(false);
  });
});
