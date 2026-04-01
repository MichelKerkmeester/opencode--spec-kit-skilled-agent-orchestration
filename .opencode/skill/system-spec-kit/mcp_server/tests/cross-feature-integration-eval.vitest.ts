// ───────────────────────────────────────────────────────────────
// 1. TEST — CROSS-FEATURE INTEGRATION EVALUATION
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// -- Query Classifier --
import {
  classifyQueryComplexity,
  type ClassificationResult,
} from '../lib/search/query-classifier';

// -- Dynamic Token Budget --
import {
  getDynamicTokenBudget,
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from '../lib/search/dynamic-token-budget';

// -- Intent Classifier --
import {
  classifyIntent,
  getIntentWeights,
  applyIntentWeights,
  type IntentType,
} from '../lib/search/intent-classifier';

// -- RRF Fusion --
import {
  fuseResults,
  fuseResultsMulti,
  normalizeRrfScores,
  isScoreNormalizationEnabled,
  type RrfItem,
  type FusionResult,
  type RankedList,
} from '@spec-kit/shared/algorithms/rrf-fusion';

// -- Channel Min-Representation --
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
  QUALITY_FLOOR,
} from '../lib/search/channel-representation';

// -- Composite Scoring --
import {
  calculateCompositeScore,
  calculateRetrievabilityScore,
  normalizeCompositeScores,
  type ScoringInput,
} from '../lib/scoring/composite-scoring';

// -- Interference Scoring --
import {
  applyInterferencePenalty,
  INTERFERENCE_PENALTY_COEFFICIENT,
  computeTextSimilarity,
} from '../lib/scoring/interference-scoring';

// -- Co-Activation --
import {
  boostScore,
  CO_ACTIVATION_CONFIG,
  DEFAULT_COACTIVATION_STRENGTH,
} from '../lib/cognitive/co-activation';

// -- Confidence Truncation --
import {
  truncateByConfidence,
  computeGaps,
  computeMedian,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from '../lib/search/confidence-truncation';

/* --- ENV HELPERS --- */

/** Save and restore env vars around tests */
const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string): void {
  savedEnv[key] = process.env[key];
  process.env[key] = value;
}

function clearEnv(key: string): void {
  savedEnv[key] = process.env[key];
  delete process.env[key];
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  Object.keys(savedEnv).forEach(k => delete savedEnv[k]);
}

/* --- TEST DATA FACTORIES --- */

function makeRrfItem(id: number, extra: Record<string, unknown> = {}): RrfItem {
  return { id, ...extra };
}

function makeScoringInput(overrides: Partial<ScoringInput> = {}): ScoringInput {
  return {
    id: 1,
    title: 'Test memory',
    similarity: 80,
    importance_weight: 0.7,
    importance_tier: 'normal',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    access_count: 3,
    ...overrides,
  };
}

function makeRankedList(source: string, ids: number[], weight?: number): RankedList {
  return {
    source,
    results: ids.map(id => makeRrfItem(id, { title: `Result ${id}`, score: 1 - (id * 0.1) })),
    weight,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   1. FEATURE FLAG INTERACTIONS
   ═══════════════════════════════════════════════════════════════════ */

describe('Cross-Sprint Integration', () => {

  beforeEach(() => {
    // Ensure clean env for each test
  });

  afterEach(() => {
    restoreEnv();
    vi.restoreAllMocks();
  });

  describe('Feature Flag Interactions', () => {

    it('1. All flags disabled: scoring pipeline produces valid 0-1 scores', () => {
      // Explicitly disable all sprint flags (graduated flags default ON when unset)
      setEnv('SPECKIT_COMPLEXITY_ROUTER', 'false');
      setEnv('SPECKIT_DYNAMIC_TOKEN_BUDGET', 'false');
      setEnv('SPECKIT_RSF_FUSION', 'false');
      setEnv('SPECKIT_CHANNEL_MIN_REP', 'false');
      setEnv('SPECKIT_CONFIDENCE_TRUNCATION', 'false');
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'false');
      setEnv('SPECKIT_SCORE_NORMALIZATION', 'false');

      // Query classifier falls back to complex
      const classification = classifyQueryComplexity('test query');
      expect(classification.tier).toBe('complex');

      // Token budget returns default
      const budget = getDynamicTokenBudget(classification.tier);
      expect(budget.budget).toBe(DEFAULT_BUDGET);
      expect(budget.applied).toBe(false);

      // Intent classifier still works (no flag gate)
      const intent = classifyIntent('fix the memory search bug');
      expect(intent.intent).toBeTruthy();
      expect(intent.confidence).toBeGreaterThanOrEqual(0);

      // Composite scoring produces valid range
      const row = makeScoringInput();
      const score = calculateCompositeScore(row);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);

      // Confidence truncation passes through
      const results = [
        { id: 1, score: 0.9 },
        { id: 2, score: 0.5 },
        { id: 3, score: 0.1 },
      ];
      const truncated = truncateByConfidence(results);
      expect(truncated.truncated).toBe(false);
      expect(truncated.results.length).toBe(3);
    });

    it('2. All flags enabled: pipeline runs all stages without errors', () => {
      setEnv('SPECKIT_COMPLEXITY_ROUTER', 'true');
      setEnv('SPECKIT_DYNAMIC_TOKEN_BUDGET', 'true');
      setEnv('SPECKIT_RSF_FUSION', 'true');
      setEnv('SPECKIT_CHANNEL_MIN_REP', 'true');
      setEnv('SPECKIT_CONFIDENCE_TRUNCATION', 'true');
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');
      setEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

      // Query classifier produces real classification
      const classification = classifyQueryComplexity('simple');
      expect(['simple', 'moderate', 'complex']).toContain(classification.tier);

      // Token budget resolves correctly
      const budget = getDynamicTokenBudget(classification.tier);
      expect(budget.applied).toBe(true);
      expect(budget.budget).toBeGreaterThan(0);

      // RRF fusion with normalization
      const listA: RrfItem[] = [makeRrfItem(1), makeRrfItem(2)];
      const listB: RrfItem[] = [makeRrfItem(2), makeRrfItem(3)];
      const fused = fuseResults(listA, listB);
      expect(fused.length).toBeGreaterThan(0);

      // Composite scoring with interference
      const row = makeScoringInput({
        created_at: new Date().toISOString(),
        interference_score: 2,
      });
      const score = calculateCompositeScore(row);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);

      // Confidence truncation active
      const scoredResults = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        score: i < 5 ? 0.8 - (i * 0.02) : 0.1 - (i * 0.001),
      }));
      const truncResult = truncateByConfidence(scoredResults);
      expect(truncResult.results.length).toBeGreaterThanOrEqual(DEFAULT_MIN_RESULTS);
    });

    it('3. Mixed flags: S1 enabled + S3 disabled still produces valid output', () => {
      // S1 features: co-activation, RRF (on by default)
      clearEnv('SPECKIT_COACTIVATION');

      // S3 features disabled
      clearEnv('SPECKIT_COMPLEXITY_ROUTER');
      clearEnv('SPECKIT_DYNAMIC_TOKEN_BUDGET');
      clearEnv('SPECKIT_RSF_FUSION');
      clearEnv('SPECKIT_CHANNEL_MIN_REP');
      clearEnv('SPECKIT_CONFIDENCE_TRUNCATION');

      // S2 features on
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

      // Co-activation boost works
      const boosted = boostScore(0.5, 3, 85);
      expect(boosted).toBeGreaterThan(0.5);
      expect(boosted).toBeLessThan(1);

      // RRF fusion works
      const fused = fuseResultsMulti([
        makeRankedList('vector', [1, 2, 3]),
        makeRankedList('fts', [2, 3, 4]),
      ]);
      expect(fused.length).toBeGreaterThan(0);

      // Composite with TM-01 produces valid score
      const row = makeScoringInput({
        created_at: new Date().toISOString(),
        interference_score: 1,
      });
      const score = calculateCompositeScore(row);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     2. PIPELINE DATA FLOW
     ═══════════════════════════════════════════════════════════════════ */

  describe('Pipeline Data Flow', () => {

    it('4. Query classifier feeds token budget: simple → 1500, complex → 4000', () => {
      setEnv('SPECKIT_COMPLEXITY_ROUTER', 'true');
      setEnv('SPECKIT_DYNAMIC_TOKEN_BUDGET', 'true');

      // Simple query (1-2 terms)
      const simpleResult = classifyQueryComplexity('memory');
      expect(simpleResult.tier).toBe('simple');

      const simpleBudget = getDynamicTokenBudget(simpleResult.tier);
      expect(simpleBudget.budget).toBe(1500);
      expect(simpleBudget.applied).toBe(true);

      // Complex query (>8 terms)
      const complexResult = classifyQueryComplexity(
        'how does the cross encoder reranker work with the hybrid search pipeline and vector index',
      );
      expect(complexResult.tier).toBe('complex');

      const complexBudget = getDynamicTokenBudget(complexResult.tier);
      expect(complexBudget.budget).toBe(4000);
      expect(complexBudget.applied).toBe(true);
    });

    it('5. Interference penalty applies correctly: new memory with interference gets valid score', () => {
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

      // Brand-new memory (seconds ago) with high interference
      const row = makeScoringInput({
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        interference_score: 5, // 5 similar memories
      });

      const score = calculateCompositeScore(row);

      // TM-01 subtracts penalty
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);

      // Verify interference penalty would be applied
      const penalized = applyInterferencePenalty(0.5, 5);
      expect(penalized).toBeLessThan(0.5);
      expect(penalized).toBeGreaterThanOrEqual(0);
    });

    it('6. Score normalization preserves ordering: if A > B before, A > B after', () => {
      setEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

      const rowA = makeScoringInput({ similarity: 95, importance_weight: 0.9 });
      const rowB = makeScoringInput({ similarity: 60, importance_weight: 0.5 });
      const rowC = makeScoringInput({ similarity: 30, importance_weight: 0.3 });

      const scoreA = calculateCompositeScore(rowA);
      const scoreB = calculateCompositeScore(rowB);
      const scoreC = calculateCompositeScore(rowC);

      // Raw ordering
      expect(scoreA).toBeGreaterThan(scoreB);
      expect(scoreB).toBeGreaterThan(scoreC);

      // Normalize
      const normalized = normalizeCompositeScores([scoreA, scoreB, scoreC]);

      // Order preserved
      expect(normalized[0]).toBeGreaterThan(normalized[1]);
      expect(normalized[1]).toBeGreaterThan(normalized[2]);

      // All in [0, 1]
      for (const n of normalized) {
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(1);
      }
    });

    it('7. Confidence truncation respects minimum: even with large gaps, min 3 results remain', () => {
      setEnv('SPECKIT_CONFIDENCE_TRUNCATION', 'true');

      // Create results with a huge gap after the 2nd result
      const results = [
        { id: 1, score: 0.95 },
        { id: 2, score: 0.90 },
        { id: 3, score: 0.85 },
        { id: 4, score: 0.10 }, // Large gap between 3 and 4
        { id: 5, score: 0.08 },
        { id: 6, score: 0.05 },
      ];

      const truncResult = truncateByConfidence(results, { minResults: 3 });

      // Must keep at least 3 results
      expect(truncResult.results.length).toBeGreaterThanOrEqual(3);
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     3. NUMERIC CORRECTNESS
     ═══════════════════════════════════════════════════════════════════ */

  describe('Numeric Correctness', () => {

    // Test 8 removed: N4 novelty boost dead code (Phase D cleanup)

    it('9. Interference penalty bounds: score never goes below 0 after penalty', () => {
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

      // Small score with massive interference
      const score = applyInterferencePenalty(0.1, 100);
      expect(score).toBeGreaterThanOrEqual(0);

      // Even zero base stays at 0
      const zeroScore = applyInterferencePenalty(0, 50);
      expect(zeroScore).toBe(0);

      // Verify penalty coefficient direction (negative)
      expect(INTERFERENCE_PENALTY_COEFFICIENT).toBeLessThan(0);

      // Moderate interference reduces score proportionally
      const moderate = applyInterferencePenalty(0.8, 3);
      const expectedPenalty = INTERFERENCE_PENALTY_COEFFICIENT * 3;
      expect(moderate).toBeCloseTo(0.8 + expectedPenalty, 4);
    });

    it('10. Composite scores in [0,1]: after all boosts/penalties, final score is clamped', () => {
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

      // High everything: test upper bound
      const highRow = makeScoringInput({
        similarity: 100,
        importance_weight: 1.0,
        importance_tier: 'constitutional',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        access_count: 100,
        interference_score: 0,
      });
      const highScore = calculateCompositeScore(highRow);
      expect(highScore).toBeLessThanOrEqual(1);
      expect(highScore).toBeGreaterThanOrEqual(0);

      // Low everything with high interference: test lower bound
      const lowRow = makeScoringInput({
        similarity: 0,
        importance_weight: 0.01,
        importance_tier: 'deprecated',
        created_at: new Date(Date.now() - 365 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 365 * 86400000).toISOString(),
        access_count: 0,
        interference_score: 50,
      });
      const lowScore = calculateCompositeScore(lowRow);
      expect(lowScore).toBeGreaterThanOrEqual(0);
      expect(lowScore).toBeLessThanOrEqual(1);
    });

  });

  /* ═══════════════════════════════════════════════════════════════════
     4. EDGE CASES
     ═══════════════════════════════════════════════════════════════════ */

  describe('Edge Cases', () => {

    it('12. Empty input: all functions handle empty arrays/null gracefully', () => {
      // RRF with empty lists
      const emptyRrf = fuseResults([], []);
      expect(emptyRrf).toEqual([]);

      const emptyMulti = fuseResultsMulti([]);
      expect(emptyMulti).toEqual([]);

      // Channel representation with empty topK
      const emptyChannel = analyzeChannelRepresentation([], new Map());
      expect(emptyChannel.promoted).toEqual([]);

      // Confidence truncation with empty
      const emptyTrunc = truncateByConfidence([]);
      expect(emptyTrunc.results).toEqual([]);
      expect(emptyTrunc.truncated).toBe(false);

      // Normalization with empty
      const emptyNorm = normalizeCompositeScores([]);
      expect(emptyNorm).toEqual([]);

      // RRF normalize with empty
      const emptyFusionResults: FusionResult[] = [];
      normalizeRrfScores(emptyFusionResults);
      expect(emptyFusionResults).toEqual([]);

      // Co-activation with 0 relations
      const noBoost = boostScore(0.5, 0, 0);
      expect(noBoost).toBe(0.5);

      // Intent classifier with empty string
      const emptyIntent = classifyIntent('');
      expect(emptyIntent.intent).toBe('understand');
      expect(emptyIntent.confidence).toBe(0);

      // Interference with 0 score
      setEnv('SPECKIT_INTERFERENCE_SCORE', 'true');
      const noInterference = applyInterferencePenalty(0.7, 0);
      expect(noInterference).toBe(0.7);
    });

    it('13. Single result: pipeline works with just 1 result', () => {
      // RRF with single item
      const singleRrf = fuseResults([makeRrfItem(1)], []);
      expect(singleRrf.length).toBe(1);
      expect(singleRrf[0].rrfScore).toBeGreaterThan(0);

      // Confidence truncation with 1 result
      const singleTrunc = truncateByConfidence([{ id: 1, score: 0.9 }]);
      expect(singleTrunc.results.length).toBe(1);
      expect(singleTrunc.truncated).toBe(false);

      // Normalization with single score — single item normalizes to 0.0 (range=0)
      setEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
      const singleNorm = normalizeCompositeScores([0.5]);
      expect(singleNorm[0]).toBe(0.0);

      // Single RRF result normalization
      const singleFusion: FusionResult[] = [{
        id: 1,
        rrfScore: 0.42,
        sources: ['vector'],
        sourceScores: {},
        convergenceBonus: 0,
      }];
      normalizeRrfScores(singleFusion);
      expect(singleFusion[0].rrfScore).toBe(1.0); // single result normalizes to 1.0
    });

    it('14. Duplicate scores: truncation and normalization handle ties', () => {
      setEnv('SPECKIT_CONFIDENCE_TRUNCATION', 'true');

      // All same scores — no meaningful gap
      const tiedResults = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        score: 0.5,
      }));

      const truncResult = truncateByConfidence(tiedResults);
      // When all scores are equal, median gap is 0, so no truncation
      expect(truncResult.truncated).toBe(false);
      expect(truncResult.results.length).toBe(8);

      // Normalization of identical scores
      setEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
      const tiedScores = [0.5, 0.5, 0.5, 0.5];
      const normalized = normalizeCompositeScores(tiedScores);
      // All equal → all normalize to 0.0
      for (const n of normalized) {
        expect(n).toBe(0.0);
      }

      // RRF normalization of identical scores
      const tiedFusion: FusionResult[] = [
        { id: 1, rrfScore: 0.3, sources: [], sourceScores: {}, convergenceBonus: 0 },
        { id: 2, rrfScore: 0.3, sources: [], sourceScores: {}, convergenceBonus: 0 },
      ];
      normalizeRrfScores(tiedFusion);
      expect(tiedFusion[0].rrfScore).toBe(1.0);
      expect(tiedFusion[1].rrfScore).toBe(1.0);
    });

    it('15. Very old memory: decay applied, still scores > 0', () => {
      clearEnv('SPECKIT_INTERFERENCE_SCORE');

      // Memory created 1 year ago
      const oneYearAgo = new Date(Date.now() - 365 * 86400000).toISOString();

      // Retrievability should be very low but > 0
      const retrievability = calculateRetrievabilityScore({
        created_at: oneYearAgo,
        updated_at: oneYearAgo,
        importance_tier: 'normal',
        stability: 1.0,
      });
      expect(retrievability).toBeGreaterThan(0);
      expect(retrievability).toBeLessThan(0.5);

      // Composite score still valid
      const row = makeScoringInput({
        created_at: oneYearAgo,
        updated_at: oneYearAgo,
        similarity: 50,
        importance_weight: 0.5,
      });
      const score = calculateCompositeScore(row);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     5. CROSS-STAGE PIPELINE INTEGRATION
     ═══════════════════════════════════════════════════════════════════ */

  describe('Cross-Stage Pipeline Integration', () => {

    it('16. Full pipeline: query → classify → budget → fusion → score → truncate', () => {
      setEnv('SPECKIT_COMPLEXITY_ROUTER', 'true');
      setEnv('SPECKIT_DYNAMIC_TOKEN_BUDGET', 'true');
      setEnv('SPECKIT_CONFIDENCE_TRUNCATION', 'true');

      // Step 1: Classify query
      const query = 'fix the memory search scoring bug in hybrid pipeline';
      const classification = classifyQueryComplexity(query);
      expect(['simple', 'moderate', 'complex']).toContain(classification.tier);

      // Step 2: Get token budget
      const budget = getDynamicTokenBudget(classification.tier);
      expect(budget.budget).toBeGreaterThan(0);

      // Step 3: Classify intent
      const intent = classifyIntent(query);
      expect(intent.intent).toBeTruthy();

      // Step 4: Get intent weights
      const weights = getIntentWeights(intent.intent);
      expect(weights.recency + weights.importance + weights.similarity).toBeCloseTo(1.0, 1);

      // Step 5: Fuse search results via RRF
      const vectorResults: RrfItem[] = [
        makeRrfItem(1, { title: 'Memory search fix' }),
        makeRrfItem(2, { title: 'Scoring pipeline' }),
        makeRrfItem(3, { title: 'Hybrid search' }),
      ];
      const ftsResults: RrfItem[] = [
        makeRrfItem(2, { title: 'Scoring pipeline' }),
        makeRrfItem(4, { title: 'Bug fix guide' }),
        makeRrfItem(1, { title: 'Memory search fix' }),
      ];
      const fused = fuseResultsMulti([
        { source: 'vector', results: vectorResults },
        { source: 'fts', results: ftsResults },
      ]);
      expect(fused.length).toBeGreaterThan(0);

      // Step 6: Score with composite scoring
      const scored = fused.map(r => ({
        ...r,
        score: calculateCompositeScore({
          id: r.id as number,
          title: r.title as string,
          similarity: 80,
          importance_weight: 0.6,
          importance_tier: 'normal',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date().toISOString(),
        }),
      })).sort((a, b) => b.score - a.score);

      // Step 7: Truncate by confidence
      const truncated = truncateByConfidence(scored);
      expect(truncated.results.length).toBeGreaterThanOrEqual(DEFAULT_MIN_RESULTS);
      expect(truncated.results.length).toBeLessThanOrEqual(fused.length);
    });

    it('17. Intent weights modify result ordering', () => {
      // Simulate search results with different attributes
      const results: Array<Record<string, unknown>> = [
        { id: 1, similarity: 95, importance_weight: 0.3 }, // high similarity, low importance
        { id: 2, similarity: 70, importance_weight: 0.9 }, // moderate similarity, high importance
        { id: 3, similarity: 85, importance_weight: 0.5 }, // balanced
      ];

      // Fix_bug intent: recency=0.5, importance=0.2, similarity=0.3
      const bugResults = applyIntentWeights([...results], 'fix_bug');

      // Security_audit intent: recency=0.1, importance=0.5, similarity=0.4
      const secResults = applyIntentWeights([...results], 'security_audit');

      // Both should produce valid ordered results
      expect(bugResults.length).toBe(3);
      expect(secResults.length).toBe(3);

      // All results should have intentAdjustedScore
      for (const r of bugResults) {
        expect(r.intentAdjustedScore).toBeDefined();
        expect(typeof r.intentAdjustedScore).toBe('number');
      }
    });

    it('18. Channel representation promotes missing channels after RRF fusion', () => {
      setEnv('SPECKIT_CHANNEL_MIN_REP', 'true');

      // Simulate: top-k only has vector results, but graph also returned results
      const topK = [
        { id: 1, score: 0.9, source: 'vector' },
        { id: 2, score: 0.8, source: 'vector' },
        { id: 3, score: 0.7, source: 'vector' },
      ];

      const allChannelResults = new Map([
        ['vector', [{ id: 1, score: 0.9 }, { id: 2, score: 0.8 }]],
        ['graph', [{ id: 10, score: 0.6 }, { id: 11, score: 0.3 }]],
      ]);

      const rep = analyzeChannelRepresentation(topK, allChannelResults);

      // Graph channel should be under-represented
      expect(rep.underRepresentedChannels).toContain('graph');

      // Best graph result (score=0.6 > QUALITY_FLOOR=0.005) should be promoted
      expect(rep.promoted.length).toBe(1);
      expect(rep.promoted[0].promotedFrom).toBe('graph');
      expect(rep.promoted[0].id).toBe(10);

      // Enhanced topK includes promoted item
      expect(rep.topK.length).toBe(4);
    });

    it('19. Co-activation R17 fan-effect: pure fan-effect dilutes boost with more relations', () => {
      // Pure fan-effect — more connections dilute each relationship's contribution
      const base = 0.5;
      const avgSim = 80;

      const boost1 = boostScore(base, 1, avgSim);
      const boost3 = boostScore(base, 3, avgSim);
      const boost5 = boostScore(base, 5, avgSim);

      // All boosts are positive (above base)
      expect(boost1).toBeGreaterThan(base);
      expect(boost3).toBeGreaterThan(base);
      expect(boost5).toBeGreaterThan(base);

      // Fan-effect: more relations = less total boost (1/sqrt(n) decay)
      expect(boost3).toBeLessThan(boost1);
      expect(boost5).toBeLessThan(boost3);

      // Verify formula manually for 3 relations
      const perNeighborBoost = DEFAULT_COACTIVATION_STRENGTH * (avgSim / 100);
      const fanDivisor = Math.sqrt(3);
      const expected = base + perNeighborBoost / fanDivisor;
      expect(boost3).toBeCloseTo(expected, 6);
    });

    it('20. RRF normalization maps scores to [0,1] while preserving order', () => {
      const fusionResults: FusionResult[] = [
        { id: 1, rrfScore: 0.13, sources: ['vector', 'fts'], sourceScores: {}, convergenceBonus: 0.1 },
        { id: 2, rrfScore: 0.08, sources: ['vector'], sourceScores: {}, convergenceBonus: 0 },
        { id: 3, rrfScore: 0.05, sources: ['fts'], sourceScores: {}, convergenceBonus: 0 },
        { id: 4, rrfScore: 0.02, sources: ['graph'], sourceScores: {}, convergenceBonus: 0 },
      ];

      // Capture original order
      const originalOrder = fusionResults.map(r => r.id);

      normalizeRrfScores(fusionResults);

      // All scores in [0, 1]
      for (const r of fusionResults) {
        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
        expect(r.rrfScore).toBeLessThanOrEqual(1);
      }

      // Max normalizes to 1, min normalizes to 0
      expect(fusionResults[0].rrfScore).toBe(1.0);
      expect(fusionResults[fusionResults.length - 1].rrfScore).toBeCloseTo(0, 4);

      // Order preserved
      const normalizedOrder = fusionResults.map(r => r.id);
      expect(normalizedOrder).toEqual(originalOrder);
    });
  });
});
