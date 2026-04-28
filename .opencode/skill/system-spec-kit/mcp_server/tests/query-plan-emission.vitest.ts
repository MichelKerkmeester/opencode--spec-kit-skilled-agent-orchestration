import { describe, expect, it } from 'vitest';

import { classifyQueryComplexity } from '../lib/search/query-classifier.js';
import { classifyIntent } from '../lib/search/intent-classifier.js';
import { routeQuery } from '../lib/search/query-router.js';

describe('query-plan telemetry emission', () => {
  it('emits a complexity plan from query-classifier without changing tier', () => {
    const result = classifyQueryComplexity('fix bug');

    expect(result.tier).toBe('simple');
    expect(result.queryPlan).toMatchObject({
      complexity: 'simple',
      intent: 'unknown',
      artifactClass: 'unknown',
      fallbackPolicy: {
        mode: 'none',
      },
    });
    expect(result.queryPlan.routingReasons).toContain('complexity:simple');
  });

  it('emits selected and skipped channels from query-router without changing routing', () => {
    const result = routeQuery('fix bug');

    expect(result.channels).toEqual(['vector', 'fts']);
    expect(result.queryPlan.selectedChannels).toEqual(result.channels);
    expect(result.queryPlan.skippedChannels.map((entry) => entry.channel)).toEqual([
      'bm25',
      'graph',
      'degree',
    ]);
    expect(result.queryPlan.complexity).toBe(result.tier);
  });

  it('preserves full-pipeline fallback telemetry when complexity router is disabled', () => {
    const original = process.env.SPECKIT_COMPLEXITY_ROUTER;
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    try {
      const result = routeQuery('fix bug');
      expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
      expect(result.queryPlan.fallbackPolicy).toEqual({
        mode: 'safe_complexity',
        reason: 'Complexity classifier fell back to safe complex tier',
      });
      expect(result.queryPlan.routingReasons).toContain('complexity-router-disabled');
    } finally {
      if (original === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = original;
      }
    }
  });

  it('emits intent and authority telemetry from intent-classifier', () => {
    const result = classifyIntent('show the decision record for graph query design');

    expect(result.intent).toBe('find_decision');
    expect(result.queryPlan.intent).toBe('find_decision');
    expect(result.queryPlan.authorityNeed).toBe('high');
    expect(result.queryPlan.routingReasons).toContain('intent:find_decision');
  });

  it('emits query plans for ambiguous and paraphrase patterns', () => {
    const ambiguous = routeQuery('review this routing prompt and tell me which skill applies');
    const paraphrase = routeQuery('show the plan for search evaluation using different wording');

    expect(ambiguous.queryPlan.routingReasons.length).toBeGreaterThan(0);
    expect(paraphrase.queryPlan.artifactClass).not.toBe('');
    expect(paraphrase.queryPlan.authorityNeed).toMatch(/^(low|medium|high|unknown)$/);
  });
});
