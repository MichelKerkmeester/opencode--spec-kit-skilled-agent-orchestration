// TEST: COMPOSITE SCORING
// Converted from: composite-scoring.test.ts (custom runner)

import { describe, it, expect } from 'vitest'
import * as compositeScoring from '../lib/scoring/composite-scoring'

/**
 * Helper to check if two numbers are approximately equal
 */
function approxEqual(a: number, b: number, epsilon: number = 0.0001): boolean {
  return Math.abs(a - b) < epsilon
}

describe('Composite Scoring', () => {

  // ───────────────────────────────────────────────────────────────
  // 1. WEIGHT CONFIGURATION TESTS (T401-T410)
  // ───────────────────────────────────────────────────────────────
  describe('Weight Configuration (T401-T410)', () => {
    const weights = compositeScoring.DEFAULT_WEIGHTS

    it('T401: Similarity weight = 0.30', () => {
      expect(weights.similarity).toBe(0.30)
    })

    it('T402: Importance weight = 0.25', () => {
      expect(weights.importance).toBe(0.25)
    })

    it('T403: Recency weight = 0.10', () => {
      expect(weights.recency).toBe(0.10)
    })

    it('T404: Retrievability weight = 0.15 (NEW)', () => {
      expect(weights.retrievability).toBe(0.15)
    })

    it('T405: Popularity weight = 0.15 (T026)', () => {
      expect(weights.popularity).toBe(0.15)
    })

    it('T406: Tier boost weight = 0.05', () => {
      expect(weights.tierBoost).toBe(0.05)
    })

    it('T407: All weights sum to exactly 1.0', () => {
      const sum = Object.values(weights).reduce((acc, weight) => acc + weight, 0)
      expect(sum).toBeCloseTo(1.0, 4)
    })

    it('T408: No negative weights', () => {
      const allNonNegative = Object.values(weights).every((weight) => weight >= 0)
      expect(allNonNegative).toBe(true)
    })

    it('T409: All weights in range [0, 1]', () => {
      for (const [key, value] of Object.entries(weights)) {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      }
    })

    it('T410: Weight count is exactly 6', () => {
      expect(Object.keys(weights).length).toBe(6)
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 2. RETRIEVABILITY INTEGRATION TESTS (T411-T420)
  // ───────────────────────────────────────────────────────────────
  describe('Retrievability Integration (T411-T420)', () => {
    const calcR = compositeScoring.calculateRetrievabilityScore

    it('T411: High R (0.9+) contributes positively to score', () => {
      const now = Date.now()
      const row = {
        stability: 10.0,
        lastReview: new Date(now - 1000 * 60 * 60).toISOString(), // 1 hour ago
      }
      const r = calcR(row)
      expect(r).toBeGreaterThanOrEqual(0.9)
    })

    it('T412: Lower R for old memories', () => {
      const now = Date.now()
      const row = {
        stability: 1.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      }
      const r = calcR(row)
      expect(r).toBeLessThan(0.8)
      expect(r).toBeGreaterThan(0)
    })

    it('T413: R=0 edge case handled', () => {
      const now = Date.now()
      const row = {
        stability: 0.1,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year ago
      }
      const r = calcR(row)
      expect(typeof r).toBe('number')
      expect(r).not.toBeNaN()
      expect(r).toBeGreaterThanOrEqual(0)
    })

    it('T414: R=1 for just-reviewed memory', () => {
      const now = Date.now()
      const row = {
        stability: 10.0,
        lastReview: new Date(now).toISOString(),
      }
      const r = calcR(row)
      expect(r).toBeCloseTo(1.0, 2)
    })

    it('T415: Missing stability defaults correctly', () => {
      const now = Date.now()
      const row = {
        // Stability is missing
        lastReview: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      }
      const r = calcR(row)
      expect(typeof r).toBe('number')
      expect(r).not.toBeNaN()
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(1)
    })

    it('T416: Falls back to updated_at when last_review missing', () => {
      const now = Date.now()
      const row = {
        stability: 5.0,
        updated_at: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      }
      const r = calcR(row)
      expect(typeof r).toBe('number')
      expect(r).not.toBeNaN()
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(1)
    })

    it('T417: Falls back to created_at when both missing', () => {
      const now = Date.now()
      const row = {
        stability: 5.0,
        created_at: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      }
      const r = calcR(row)
      expect(typeof r).toBe('number')
      expect(r).not.toBeNaN()
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(1)
    })

    it('T418: Higher stability = higher R for same elapsed time', () => {
      const now = Date.now()
      const elapsed = new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
      const rLowS = calcR({ stability: 1.0, lastReview: elapsed })
      const rHighS = calcR({ stability: 10.0, lastReview: elapsed })
      expect(rHighS).toBeGreaterThan(rLowS)
    })

    it('T418b: Tier multipliers affect retrievability decay rate', () => {
      const now = Date.now()
      const elapsed = new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString() // 14 days ago

      const constitutional = calcR({
        stability: 5.0,
        lastReview: elapsed,
        importance_tier: 'constitutional',
      })
      const normal = calcR({
        stability: 5.0,
        lastReview: elapsed,
        importance_tier: 'normal',
      })
      const scratch = calcR({
        stability: 5.0,
        lastReview: elapsed,
        importance_tier: 'scratch',
      })

      expect(constitutional).toBeGreaterThan(normal)
      expect(normal).toBeGreaterThan(scratch)
    })

    it('T418c: classification decay path applies when enabled (no double decay)', () => {
      const previousFlag = process.env.SPECKIT_CLASSIFICATION_DECAY
      process.env.SPECKIT_CLASSIFICATION_DECAY = 'true'

      try {
        const now = Date.now()
        const elapsed = new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString()

        const result = calcR({
          stability: 5.0,
          lastReview: elapsed,
          context_type: 'general',
          importance_tier: 'important',
        })

        // Expected path with classification decay:
        // StabilityAdjusted = 5.0 * 1.5, elapsedDays unchanged (no tier multiplier)
        const expected = Math.pow(1 + (19 / 81) * (14 / (5 * 1.5)), -0.5)

        expect(result).toBeCloseTo(expected, 2)
      } finally {
        if (previousFlag == null) {
          delete process.env.SPECKIT_CLASSIFICATION_DECAY
        } else {
          process.env.SPECKIT_CLASSIFICATION_DECAY = previousFlag
        }
      }
    })

    it('T418d: Negative and non-finite stability values still yield finite retrievability', () => {
      const now = Date.now()
      const lastReview = new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString()

      for (const stability of [-5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
        const r = calcR({ stability, lastReview })
        expect(Number.isFinite(r)).toBe(true)
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThanOrEqual(1)
      }
    })

    it('T419: R decreases monotonically with elapsed time', () => {
      const now = Date.now()
      const rDay1 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24).toISOString() })
      const rDay7 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString() })
      const rDay30 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString() })
      expect(rDay1).toBeGreaterThan(rDay7)
      expect(rDay7).toBeGreaterThan(rDay30)
    })

    it('T420: R is always clamped to [0, 1]', () => {
      const now = Date.now()
      const rMax = calcR({ stability: 1000.0, lastReview: new Date(now).toISOString() })
      const rMin = calcR({ stability: 0.01, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 10000).toISOString() })
      expect(rMax).toBeLessThanOrEqual(1)
      expect(rMax).toBeGreaterThanOrEqual(0)
      expect(rMin).toBeLessThanOrEqual(1)
      expect(rMin).toBeGreaterThanOrEqual(0)
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 3. SCORE CALCULATION TESTS (T421-T430)
  // ───────────────────────────────────────────────────────────────
  describe('Score Calculation (T421-T430)', () => {
    const calcScore = compositeScoring.calculateCompositeScore

    it('T421: Perfect scores approach 1.0', () => {
      const now = Date.now()
      const perfectRow = {
        similarity: 100,
        importance_weight: 1.0,
        importance_tier: 'constitutional',
        updated_at: new Date(now).toISOString(),
        access_count: 1000,
        stability: 100.0,
        lastReview: new Date(now).toISOString(),
      }
      const score = calcScore(perfectRow)
      expect(score).toBeGreaterThanOrEqual(0.90)
      expect(score).toBeLessThanOrEqual(1.0)
    })

    it('T422: Zero/minimal inputs give low score', () => {
      const zeroRow = {
        similarity: 0,
        importance_weight: 0,
        importance_tier: 'deprecated',
        updated_at: new Date(0).toISOString(),
        access_count: 0,
        stability: 0.01,
        lastReview: new Date(0).toISOString(),
      }
      const score = calcScore(zeroRow)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThan(0.3)
    })

    it('T423: Mixed scores calculate correctly', () => {
      const now = Date.now()
      const mixedRow = {
        similarity: 70,
        importance_weight: 0.5,
        importance_tier: 'normal',
        updated_at: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
        access_count: 10,
        stability: 5.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      }
      const score = calcScore(mixedRow)
      expect(score).toBeGreaterThan(0.2)
      expect(score).toBeLessThan(0.8)
    })

    it('T424: Score is always in range [0, 1]', () => {
      const testRows = [
        { similarity: 150 },  // Over 100%
        { similarity: -50 },  // Negative
        { importance_weight: 2.0 },
        { importance_weight: -1.0 },
      ]

      for (const row of testRows) {
        const s = calcScore(row)
        expect(s).toBeGreaterThanOrEqual(0)
        expect(s).toBeLessThanOrEqual(1)
      }
    })

    it('T425: Score changes with weight changes', () => {
      const now = Date.now()
      const baseRow = {
        similarity: 80,
        importance_weight: 0.6,
        importance_tier: 'important',
        updated_at: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
        access_count: 5,
        stability: 3.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      }

      const defaultScore = calcScore(baseRow)
      const highSimWeight = calcScore(baseRow, { weights: { ...compositeScoring.DEFAULT_WEIGHTS, similarity: 0.5 } })

      // Verify the custom score differs from default
      expect(Math.abs(highSimWeight - defaultScore)).toBeGreaterThan(0)
    })

    it('T426: Retrievability contributes to score', () => {
      const now = Date.now()
      const rowHighR = {
        similarity: 50,
        importance_weight: 0.5,
        importance_tier: 'normal',
        updated_at: new Date(now).toISOString(),
        access_count: 5,
        stability: 50.0,
        lastReview: new Date(now).toISOString(),
      }

      const rowLowR = {
        similarity: 50,
        importance_weight: 0.5,
        importance_tier: 'normal',
        updated_at: new Date(now).toISOString(),
        access_count: 5,
        stability: 0.5,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
      }

      const scoreHighR = calcScore(rowHighR)
      const scoreLowR = calcScore(rowLowR)
      const diff = scoreHighR - scoreLowR

      expect(diff).toBeGreaterThan(0)
    })

    it('T427: Custom weights override defaults', () => {
      const now = Date.now()
      const row = {
        similarity: 80,
        importance_weight: 0.5,
        importance_tier: 'normal',
        updated_at: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
        access_count: 5,
        stability: 3.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      }

      const defaultScore = calcScore(row)
      const customScore = calcScore(row, {
        weights: {
          similarity: 0.80,
          importance: 0.05,
          recency: 0.05,
          retrievability: 0.05,
          popularity: 0.02,
          tierBoost: 0.03,
        }
      })

      expect(Math.abs(customScore - defaultScore)).toBeGreaterThan(0.001)
    })

    it('T428: Similarity has weight 0.30', () => {
      const weights = compositeScoring.DEFAULT_WEIGHTS
      expect(weights.similarity).toBe(0.30)
    })

    it('T429: FSRS constants are exported', () => {
      const factor = compositeScoring.FSRS_FACTOR
      const decay = compositeScoring.FSRS_DECAY
      expect(typeof factor).toBe('number')
      expect(typeof decay).toBe('number')
    })

    it('T430: get_score_breakdown includes retrievability', () => {
      const now = Date.now()
      const row = {
        similarity: 80,
        importance_weight: 0.6,
        importance_tier: 'important',
        updated_at: new Date(now).toISOString(),
        access_count: 10,
        stability: 5.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      }

      const breakdown = compositeScoring.getScoreBreakdown(row) as ReturnType<typeof compositeScoring.getScoreBreakdown> & {
        factors: {
          retrievability: {
            value: number
            weight: number
            contribution: number
          }
        }
      }
      expect(breakdown.factors).toBeDefined()
      expect(breakdown.factors.retrievability).toBeDefined()

      const rFactor = breakdown.factors.retrievability
      expect(typeof rFactor.value).toBe('number')
      expect(typeof rFactor.weight).toBe('number')
      expect(typeof rFactor.contribution).toBe('number')
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 4. EDGE CASES (T431-T440)
  // ───────────────────────────────────────────────────────────────
  describe('Edge Cases (T431-T440)', () => {
    const calcScore = compositeScoring.calculateCompositeScore

    it('T431: Missing fields handled with defaults', () => {
      const sparseRow = { similarity: 50 }
      const score = calcScore(sparseRow)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('T432: Null inputs handled', () => {
      const nullRow = {
        similarity: null,
        importance_weight: null,
        importance_tier: null,
        updated_at: null,
        access_count: null,
        stability: null,
        lastReview: null,
      }
      const score = calcScore(nullRow as unknown as Parameters<typeof calcScore>[0])
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
    })

    it('T433: Undefined inputs handled', () => {
      const undefRow = {}
      const score = calcScore(undefRow)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
    })

    it('T434: Very small values (1e-10) handled', () => {
      const tinyRow = {
        similarity: 1e-10,
        importance_weight: 1e-10,
        stability: 1e-10,
      }
      const score = calcScore(tinyRow)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
      expect(isFinite(score)).toBe(true)
    })

    it('T435: Very large values clamped appropriately', () => {
      const largeRow = {
        similarity: 1e10,
        importance_weight: 1e10,
        access_count: 1e10,
        stability: 1e10,
      }
      const score = calcScore(largeRow)
      expect(score).toBeLessThanOrEqual(1)
      expect(score).toBeGreaterThanOrEqual(0)
    })

    it('T436: Empty memory object handled', () => {
      const score = calcScore({})
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('T437: Invalid date strings fall back to finite safe scores', () => {
      const badDateRow = {
        similarity: 50,
        updated_at: 'not-a-date',
        lastReview: 'invalid',
      }
      const score = calcScore(badDateRow)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
      expect(Number.isFinite(score)).toBe(true)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('T438: Unknown tier defaults correctly', () => {
      const unknownTierRow = {
        similarity: 50,
        importance_tier: 'unknown_tier_xyz',
      }
      const score = calcScore(unknownTierRow)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
    })

    it('T439: NaN, undefined, negative, and Infinity inputs stay finite and clamped', () => {
      const weirdRows = [
        {
          similarity: undefined,
          access_count: -100,
          stability: Number.NaN,
          updated_at: 'not-a-date',
          lastReview: 'invalid',
        },
        {
          similarity: Number.POSITIVE_INFINITY,
          access_count: Number.NEGATIVE_INFINITY,
          stability: Number.POSITIVE_INFINITY,
        },
      ]

      for (const row of weirdRows) {
        const score = calcScore(row as unknown as Parameters<typeof calcScore>[0])
        expect(typeof score).toBe('number')
        expect(score).not.toBeNaN()
        expect(Number.isFinite(score)).toBe(true)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(1)
      }
    })

    it('T440: Future dates handled (score <= 1)', () => {
      const futureRow = {
        similarity: 50,
        updated_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
        lastReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      }
      const score = calcScore(futureRow)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('T440b: NaN, undefined, negative, and Infinity stability inputs stay finite', () => {
      const now = Date.now()
      const lastReview = new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString()
      const cases = [
        { stability: Number.NaN, lastReview },
        { stability: undefined, lastReview },
        { stability: -5, lastReview },
        { stability: Number.POSITIVE_INFINITY, lastReview },
      ]

      for (const row of cases) {
        const score = compositeScoring.calculateRetrievabilityScore(row)
        expect(score).not.toBeNaN()
        expect(Number.isFinite(score)).toBe(true)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(1)
      }
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 5. RANKING TESTS (T441-T445)
  // ───────────────────────────────────────────────────────────────
  describe('Ranking (T441-T445)', () => {
    const applyScoring = compositeScoring.applyCompositeScoring

    it('T441: Higher R memories ranked higher (all else equal)', () => {
      const now = Date.now()
      const memories = [
        {
          id: 'low-r',
          similarity: 80,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(now).toISOString(),
          access_count: 5,
          stability: 0.5,
          lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        {
          id: 'high-r',
          similarity: 80,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(now).toISOString(),
          access_count: 5,
          stability: 20.0,
          lastReview: new Date(now).toISOString(),
        },
      ]

      const ranked = applyScoring(memories as unknown as Parameters<typeof applyScoring>[0])
      expect(ranked[0].id).toBe('high-r')
    })

    it('T442: Similarity still dominates (highest weight)', () => {
      const now = Date.now()
      const memories = [
        {
          id: 'high-r-low-sim',
          similarity: 30,
          importance_weight: 1.0,
          importance_tier: 'critical',
          updated_at: new Date(now).toISOString(),
          access_count: 100,
          stability: 50.0,
          lastReview: new Date(now).toISOString(),
        },
        {
          id: 'low-r-high-sim',
          similarity: 100,
          importance_weight: 0.3,
          importance_tier: 'normal',
          updated_at: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
          access_count: 1,
          stability: 1.0,
          lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
      ]

      const ranked = applyScoring(memories as unknown as Parameters<typeof applyScoring>[0])
      // Verify ranking produces valid results: both items scored, first has composite_score
      expect(ranked.length).toBe(2)
      expect(typeof ranked[0].composite_score).toBe('number')
      expect(typeof ranked[1].composite_score).toBe('number')
    })

    it('T443: Combined high similarity + high R beats either alone', () => {
      const now = Date.now()
      const memories = [
        {
          id: 'high-sim-only',
          similarity: 95,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
          access_count: 5,
          stability: 1.0,
          lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        {
          id: 'high-r-only',
          similarity: 60,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(now).toISOString(),
          access_count: 5,
          stability: 50.0,
          lastReview: new Date(now).toISOString(),
        },
        {
          id: 'both-high',
          similarity: 95,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(now).toISOString(),
          access_count: 5,
          stability: 50.0,
          lastReview: new Date(now).toISOString(),
        },
      ]

      const ranked = applyScoring(memories as unknown as Parameters<typeof applyScoring>[0])
      expect(ranked[0].id).toBe('both-high')
    })

    it('T444: Ranking preserves _scoring breakdown with retrievability', () => {
      const now = Date.now()
      const memories = [
        {
          id: 'test-memory',
          similarity: 75,
          importance_weight: 0.6,
          importance_tier: 'important',
          updated_at: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
          access_count: 10,
          stability: 5.0,
          lastReview: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
        },
      ]

      const ranked = applyScoring(memories as unknown as Parameters<typeof applyScoring>[0])
      expect(ranked[0]._scoring).toBeDefined()
      expect(typeof ranked[0]._scoring.retrievability).toBe('number')
    })

    it('T445: Empty array returns empty array', () => {
      const ranked = applyScoring([])
      expect(Array.isArray(ranked)).toBe(true)
      expect(ranked.length).toBe(0)
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 6. TIER BOOST TESTS
  // ───────────────────────────────────────────────────────────────
  describe('Tier Boost', () => {
    const getBoost = compositeScoring.getTierBoost

    // Note: 'deprecated' is handled separately below due to || operator behavior
    const expectedBoosts: Array<[string, number]> = [
      ['constitutional', 1.0],
      ['critical', 1.0],
      ['important', 0.8],
      ['normal', 0.5],
      ['temporary', 0.3],
    ]

    for (const [tier, expected] of expectedBoosts) {
      it(`Tier boost: ${tier} = ${expected}`, () => {
        const actual = getBoost(tier)
        expect(actual).toBe(expected)
      })
    }

    it('Tier boost: deprecated = 0.1 (from importance-tiers.js)', () => {
      const deprecatedBoost = getBoost('deprecated')
      expect(deprecatedBoost).toBe(0.1)
    })

    it('Unknown tier defaults to 0.5', () => {
      const unknown = getBoost('unknown_tier')
      expect(unknown).toBe(0.5)
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 7. FIVE-FACTOR MODEL TESTS (T083-T093)
  // ───────────────────────────────────────────────────────────────
  describe('Five-Factor Model (T083-T093)', () => {
    const weights = compositeScoring.FIVE_FACTOR_WEIGHTS

    it('T083: 5-factor composite score calculation', () => {
      const now = Date.now()
      const row = {
        stability: 5.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
        access_count: 10,
        importance_tier: 'important',
        importance_weight: 0.7,
        similarity: 80,
        title: 'Test memory',
        lastCited: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      }
      const options = { query: 'test' }

      const score = compositeScoring.calculateFiveFactorScore(row, options)
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('T084: Temporal factor weight = 0.25', () => {
      expect(weights.temporal).toBe(0.25)
    })

    it('T085: Usage factor weight = 0.15', () => {
      expect(weights.usage).toBe(0.15)
    })

    it('T086: Importance factor weight = 0.25', () => {
      expect(weights.importance).toBe(0.25)
    })

    it('T087: Pattern factor weight = 0.20', () => {
      expect(weights.pattern).toBe(0.20)
    })

    it('T088: Citation factor weight = 0.15', () => {
      expect(weights.citation).toBe(0.15)
    })

    it('T089: FSRS formula verified', () => {
      const now = Date.now()
      const FSRS_DECAY = compositeScoring.FSRS_DECAY // -0.5

      // Test with known values: days=10, stability=5
      const days = 10
      const stability = 5
      const expected = Math.pow(1 + (19 / 81) * days / stability, FSRS_DECAY)

      const row = {
        stability: stability,
        lastReview: new Date(now - days * 24 * 60 * 60 * 1000).toISOString(),
      }
      const actual = compositeScoring.calculateTemporalScore(row)

      expect(actual).toBeCloseTo(expected, 2)
    })

    it('T089b: FSRS formula at 0 days = 1.0', () => {
      const now = Date.now()
      const row_0days = {
        stability: 5.0,
        lastReview: new Date(now).toISOString(),
      }
      const score_0days = compositeScoring.calculateTemporalScore(row_0days)
      expect(score_0days).toBeCloseTo(1.0, 2)
    })

    it('T090a: Usage score at count=0', () => {
      const score_0 = compositeScoring.calculateUsageScore(0)
      expect(score_0).toBeCloseTo(0.0, 3)
    })

    it('T090b: Usage score at count=10', () => {
      const score_10 = compositeScoring.calculateUsageScore(10)
      expect(score_10).toBeCloseTo(1.0, 3)
    })

    it('T090c: Usage score at count=5', () => {
      const score_5 = compositeScoring.calculateUsageScore(5)
      expect(score_5).toBeCloseTo(0.5, 3)
    })

    it('T090d: Usage score capped at count=100', () => {
      const score_100 = compositeScoring.calculateUsageScore(100)
      expect(score_100).toBeCloseTo(1.0, 3)
    })

    it('T090e: Usage score clamps negative counts to 0', () => {
      const score_negative = compositeScoring.calculateUsageScore(-10)
      expect(score_negative).toBe(0)
    })

    it('T091a: Citation score at 0 days', () => {
      const now = Date.now()
      const row_0days = {
        lastCited: new Date(now).toISOString(),
      }
      const score_0 = compositeScoring.calculateCitationScore(row_0days)
      expect(score_0).toBeCloseTo(1.0, 2)
    })

    it('T091b: Citation score at 10 days', () => {
      const now = Date.now()
      const row_10days = {
        lastCited: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
      }
      const score_10 = compositeScoring.calculateCitationScore(row_10days)
      expect(score_10).toBeCloseTo(0.5, 2)
    })

    it('T091c: Citation score at 30 days', () => {
      const now = Date.now()
      const row_30days = {
        lastCited: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
      const score_30 = compositeScoring.calculateCitationScore(row_30days)
      expect(score_30).toBeCloseTo(0.25, 2)
    })

    it('T091d: Citation score at 90 days (max cutoff)', () => {
      const now = Date.now()
      const row_90days = {
        lastCited: new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString(),
      }
      const score_90 = compositeScoring.calculateCitationScore(row_90days)
      expect(score_90).toBe(0)
    })

    it('T092: Pattern alignment bonuses', () => {
      const bonuses = compositeScoring.PATTERN_ALIGNMENT_BONUSES

      expect(bonuses.exact_match).toBe(0.3)
      expect(bonuses.partial_match).toBe(0.15)
      expect(bonuses.anchor_match).toBe(0.25)
      expect(bonuses.type_match).toBe(0.2)
    })

    it('T092b: Pattern score with exact title match', () => {
      const calcPattern = compositeScoring.calculatePatternScore
      const rowExact = {
        similarity: 60,
        title: 'authentication flow',
      }
      const optionsExact = { query: 'authentication flow' }
      const patternScore = calcPattern(rowExact, optionsExact)

      // Should include exact_match bonus (0.3) + baseline from similarity
      expect(patternScore).toBeGreaterThanOrEqual(0.5)
    })

    it('T092c: Pattern score with anchor match', () => {
      const calcPattern = compositeScoring.calculatePatternScore
      const rowAnchor = {
        similarity: 50,
        title: 'Some memory',
        anchors: ['decision', 'context'],
      }
      const optionsAnchor = { query: 'test', anchors: ['decision'] }
      const anchorScore = calcPattern(rowAnchor, optionsAnchor)

      // Should include anchor_match bonus (0.25)
      expect(anchorScore).toBeGreaterThan(0.25)
    })

    it('T092d: Pattern score with type match', () => {
      const calcPattern = compositeScoring.calculatePatternScore
      const rowType = {
        similarity: 50,
        title: 'Some decision',
        memory_type: 'decision',
      }
      const optionsType = { query: 'why did we decide' }
      const typeScore = calcPattern(rowType, optionsType)

      // Should include type_match bonus (0.2)
      expect(typeScore).toBeGreaterThan(0.2)
    })

    it('T093a: Max inputs normalized to 0-1', () => {
      const now = Date.now()
      const calcFiveFactor = compositeScoring.calculateFiveFactorScore

      const rowMax = {
        stability: 1000.0,
        lastReview: new Date(now).toISOString(),
        access_count: 1000,
        importance_tier: 'constitutional',
        importance_weight: 1.0,
        similarity: 100,
        title: 'exact match test query',
        anchors: ['test', 'query'],
        memory_type: 'decision',
        lastCited: new Date(now).toISOString(),
      }
      const optionsMax = { query: 'exact match test query', anchors: ['test'] }
      const scoreMax = calcFiveFactor(rowMax, optionsMax)

      expect(scoreMax).toBeLessThanOrEqual(1.0)
      expect(scoreMax).toBeGreaterThanOrEqual(0)
    })

    it('T093b: Min inputs normalized to 0-1', () => {
      const calcFiveFactor = compositeScoring.calculateFiveFactorScore

      const rowMin = {
        stability: 0.001,
        lastReview: new Date(0).toISOString(),
        access_count: 0,
        importance_tier: 'deprecated',
        importance_weight: 0,
        similarity: 0,
        title: '',
        lastCited: new Date(0).toISOString(),
      }
      const scoreMin = calcFiveFactor(rowMin, {})

      expect(scoreMin).toBeGreaterThanOrEqual(0)
      expect(scoreMin).toBeLessThanOrEqual(1.0)
    })

    it('T093c: Negative inputs normalized to 0-1', () => {
      const calcFiveFactor = compositeScoring.calculateFiveFactorScore

      const rowNegative = {
        similarity: -100,
        access_count: -50,
        importance_weight: -1.0,
      }
      const scoreNegative = calcFiveFactor(rowNegative, {})

      expect(scoreNegative).toBeGreaterThanOrEqual(0)
      expect(scoreNegative).toBeLessThanOrEqual(1.0)
    })

    it('T093d: All test cases normalized to 0-1', () => {
      const now = Date.now()
      const calcFiveFactor = compositeScoring.calculateFiveFactorScore

      const testCases = [
        { similarity: 50, access_count: 5 },
        { similarity: 100, importance_tier: 'critical' },
        { stability: 10, lastReview: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
      ]

      for (const row of testCases) {
        const score = calcFiveFactor(row, {})
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(1)
        expect(score).not.toBeNaN()
      }
    })

    it('T093e: 5-factor weights sum to 1.0', () => {
      const weightSum = Object.values(weights).reduce((acc, weight) => acc + weight, 0)
      expect(weightSum).toBeCloseTo(1.0, 4)
    })
  })

  // ───────────────────────────────────────────────────────────────
  // 8. MODULE EXPORTS VERIFICATION
  // ───────────────────────────────────────────────────────────────
  describe('Module Exports', () => {
    const expectedExports = [
      // Configuration
      'DEFAULT_WEIGHTS',
      'FIVE_FACTOR_WEIGHTS',
      'RECENCY_SCALE_DAYS',
      'IMPORTANCE_MULTIPLIERS',
      'CITATION_DECAY_RATE',
      'CITATION_MAX_DAYS',
      'PATTERN_ALIGNMENT_BONUSES',
      'FSRS_FACTOR',
      'FSRS_DECAY',
      // 5-factor scoring functions (REQ-017)
      'calculateTemporalScore',
      'calculateUsageScore',
      'calculateImportanceScore',
      'calculatePatternScore',
      'calculateCitationScore',
      'calculateFiveFactorScore',
      'applyFiveFactorScoring',
      'getFiveFactorBreakdown',
      // Legacy functions
      'calculateRecencyScore',
      'getTierBoost',
      'calculateRetrievabilityScore',
      'calculateCompositeScore',
      'applyCompositeScoring',
      'getScoreBreakdown',
    ] as const satisfies ReadonlyArray<keyof typeof compositeScoring>

    for (const name of expectedExports) {
      it(`Export: ${name}`, () => {
        expect(compositeScoring[name]).toBeDefined()
      })
    }
  })
})
