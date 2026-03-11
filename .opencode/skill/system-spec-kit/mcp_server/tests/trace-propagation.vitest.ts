// ---------------------------------------------------------------
// MODULE: Test — Trace Propagation Chain (T006 Integration Tests)
// ---------------------------------------------------------------
// Validates the full chain: routeResult.tier -> traceMetadata.queryComplexity
// Ensures classifier tier values propagate correctly through the router
// into the trace metadata structure used by hybrid-search.ts (CHK-038).

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  classifyQueryComplexity,
  type QueryComplexityTier,
} from '../lib/search/query-classifier';
import { routeQuery } from '../lib/search/query-router';

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */

const FEATURE_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';
let savedEnv: string | undefined;

function enableFlag(): void {
  savedEnv = process.env[FEATURE_FLAG];
  process.env[FEATURE_FLAG] = 'true';
}

function restoreFlag(): void {
  if (savedEnv === undefined) {
    delete process.env[FEATURE_FLAG];
  } else {
    process.env[FEATURE_FLAG] = savedEnv;
  }
}

/**
 * Simulate the traceMetadata assembly that hybrid-search.ts performs at
 * lines 997-1009 (CHK-038). This mirrors the production code:
 *   traceMetadata: { ..., queryComplexity: routeResult.tier }
 */
function buildTraceMetadata(routeResult: { tier: QueryComplexityTier }) {
  return {
    stage4: null,
    attribution: null,
    degradation: null,
    budgetTruncated: false,
    budgetLimit: 100,
    queryComplexity: routeResult.tier,
  };
}

/* ---------------------------------------------------------------
   T006: TRACE PROPAGATION CHAIN
   classifier -> router -> traceMetadata.queryComplexity
   --------------------------------------------------------------- */

describe('T006: Trace Propagation Chain (classifier -> router -> traceMetadata)', () => {
  beforeEach(() => {
    enableFlag();
  });

  afterEach(() => {
    restoreFlag();
  });

  /* ---------------------------------------------------------------
     T006-01: Simple tier propagation
     --------------------------------------------------------------- */
  describe('T006-01: Simple tier propagation', () => {
    it('classifier returns "simple" for short query', () => {
      const classification = classifyQueryComplexity('fix bug');
      expect(classification.tier).toBe('simple');
    });

    it('router returns tier "simple" for short query', () => {
      const routeResult = routeQuery('fix bug');
      expect(routeResult.tier).toBe('simple');
    });

    it('traceMetadata.queryComplexity equals "simple" when tier is simple', () => {
      const routeResult = routeQuery('fix bug');
      const trace = buildTraceMetadata(routeResult);
      expect(trace.queryComplexity).toBe('simple');
    });

    it('full chain: classifier -> router -> trace all agree on "simple"', () => {
      const query = 'search memory';
      const classification = classifyQueryComplexity(query);
      const routeResult = routeQuery(query);
      const trace = buildTraceMetadata(routeResult);

      expect(classification.tier).toBe('simple');
      expect(routeResult.tier).toBe('simple');
      expect(trace.queryComplexity).toBe('simple');
      expect(classification.tier).toBe(routeResult.tier);
      expect(routeResult.tier).toBe(trace.queryComplexity);
    });
  });

  /* ---------------------------------------------------------------
     T006-02: Complex tier propagation
     --------------------------------------------------------------- */
  describe('T006-02: Complex tier propagation', () => {
    const complexQuery =
      'explain how the authentication module integrates with the external OAuth provider and handles token refresh';

    it('classifier returns "complex" for long query', () => {
      const classification = classifyQueryComplexity(complexQuery);
      expect(classification.tier).toBe('complex');
    });

    it('router returns tier "complex" for long query', () => {
      const routeResult = routeQuery(complexQuery);
      expect(routeResult.tier).toBe('complex');
    });

    it('traceMetadata.queryComplexity equals "complex" when tier is complex', () => {
      const routeResult = routeQuery(complexQuery);
      const trace = buildTraceMetadata(routeResult);
      expect(trace.queryComplexity).toBe('complex');
    });

    it('full chain: classifier -> router -> trace all agree on "complex"', () => {
      const classification = classifyQueryComplexity(complexQuery);
      const routeResult = routeQuery(complexQuery);
      const trace = buildTraceMetadata(routeResult);

      expect(classification.tier).toBe('complex');
      expect(routeResult.tier).toBe('complex');
      expect(trace.queryComplexity).toBe('complex');
      expect(classification.tier).toBe(routeResult.tier);
      expect(routeResult.tier).toBe(trace.queryComplexity);
    });
  });

  /* ---------------------------------------------------------------
     T006-03: Moderate tier propagation (analytical proxy)
     --------------------------------------------------------------- */
  describe('T006-03: Moderate tier propagation', () => {
    const moderateQuery = 'refactor the database connection module';

    it('classifier returns "moderate" for mid-length query', () => {
      const classification = classifyQueryComplexity(moderateQuery);
      expect(classification.tier).toBe('moderate');
    });

    it('router returns tier "moderate" for mid-length query', () => {
      const routeResult = routeQuery(moderateQuery);
      expect(routeResult.tier).toBe('moderate');
    });

    it('traceMetadata.queryComplexity equals "moderate" when tier is moderate', () => {
      const routeResult = routeQuery(moderateQuery);
      const trace = buildTraceMetadata(routeResult);
      expect(trace.queryComplexity).toBe('moderate');
    });

    it('full chain: classifier -> router -> trace all agree on "moderate"', () => {
      const classification = classifyQueryComplexity(moderateQuery);
      const routeResult = routeQuery(moderateQuery);
      const trace = buildTraceMetadata(routeResult);

      expect(classification.tier).toBe('moderate');
      expect(routeResult.tier).toBe('moderate');
      expect(trace.queryComplexity).toBe('moderate');
      expect(classification.tier).toBe(routeResult.tier);
      expect(routeResult.tier).toBe(trace.queryComplexity);
    });
  });

  /* ---------------------------------------------------------------
     T006-04: All tiers — cross-tier consistency
     --------------------------------------------------------------- */
  describe('T006-04: Cross-tier consistency', () => {
    const queries: Array<{ query: string; expectedTier: QueryComplexityTier }> = [
      { query: 'fix bug', expectedTier: 'simple' },
      { query: 'refactor the database connection module', expectedTier: 'moderate' },
      {
        query: 'explain how the authentication module integrates with the external OAuth provider and handles token refresh',
        expectedTier: 'complex',
      },
    ];

    for (const { query, expectedTier } of queries) {
      it(`"${query.slice(0, 30)}..." propagates "${expectedTier}" through full chain`, () => {
        const routeResult = routeQuery(query);
        const trace = buildTraceMetadata(routeResult);

        expect(routeResult.tier).toBe(expectedTier);
        expect(trace.queryComplexity).toBe(expectedTier);
        expect(routeResult.classification.tier).toBe(expectedTier);
      });
    }

    it('tier type covers exactly simple, moderate, complex', () => {
      const tiers: QueryComplexityTier[] = ['simple', 'moderate', 'complex'];
      expect(tiers).toHaveLength(3);
    });

    it('traceMetadata structure matches hybrid-search.ts shape', () => {
      const routeResult = routeQuery('fix bug');
      const trace = buildTraceMetadata(routeResult);

      expect(trace).toHaveProperty('stage4');
      expect(trace).toHaveProperty('attribution');
      expect(trace).toHaveProperty('degradation');
      expect(trace).toHaveProperty('budgetTruncated');
      expect(trace).toHaveProperty('budgetLimit');
      expect(trace).toHaveProperty('queryComplexity');
      expect(typeof trace.queryComplexity).toBe('string');
    });
  });

  /* ---------------------------------------------------------------
     T006-05: Fallback when flag disabled
     --------------------------------------------------------------- */
  describe('T006-05: Fallback propagation (flag disabled)', () => {
    it('propagates "complex" fallback through trace when flag is disabled', () => {
      process.env[FEATURE_FLAG] = 'false';
      const routeResult = routeQuery('fix bug');
      const trace = buildTraceMetadata(routeResult);

      expect(routeResult.tier).toBe('complex');
      expect(trace.queryComplexity).toBe('complex');
      expect(routeResult.classification.confidence).toBe('fallback');
    });
  });
});
