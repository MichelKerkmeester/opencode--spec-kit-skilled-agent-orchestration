// ───────────────────────────────────────────────────────────────
// TEST: Query-Intent Routing
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
import { describe, it, expect, vi } from 'vitest';
import { classifyQueryIntent } from '../code-graph/lib/query-intent-classifier.js';
import { createContentRouter } from '../lib/routing/content-router.js';

function makeEmbeddingFn() {
  return (text: string): number[] => {
    const buckets = Array.from({ length: 64 }, () => 0);
    for (const token of text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)) {
      const digest = createHash('sha256').update(token).digest();
      const bucketIndex = digest[0] % buckets.length;
      buckets[bucketIndex] += 1;
    }
    return buckets;
  };
}

function makeRouterContext() {
  return {
    specFolder: '026-graph-and-context-optimization/015-save-flow-planner-first-trim',
    packetLevel: 'L3+' as const,
    existingAnchors: ['phase-1', 'phase-2', 'what-built', 'how-delivered'],
    sessionMeta: {
      packet_kind: 'phase' as const,
      save_mode: 'auto' as const,
      recent_docs_touched: ['implementation-summary.md'],
      recent_anchors_touched: ['what-built'],
      likely_phase_anchor: 'phase-2',
      session_id: 'runtime-routing-test',
    },
  };
}

describe('query-intent routing', () => {
  describe('maps semantic queries to semantic intent', () => {
    it('find code queries', () => { expect(classifyQueryIntent('find code that handles authentication').intent).toBe('semantic'); });
    it('find retry logic implementation', () => { expect(classifyQueryIntent('find code related to retry logic').intent).toBe('semantic'); });
    it('similar to X', () => { expect(classifyQueryIntent('find functions similar to parseFile').intent).toBe('semantic'); });
  });

  describe('maps structural queries to structural intent', () => {
    it('what calls', () => { expect(classifyQueryIntent('what calls parseFile').intent).toBe('structural'); });
    it('what imports', () => { expect(classifyQueryIntent('what imports this module').intent).toBe('structural'); });
    it('show outline', () => { expect(classifyQueryIntent('show outline of this file').intent).toBe('structural'); });
    it('file structure', () => { expect(classifyQueryIntent('show structure of this file').intent).toBe('structural'); });
    it('what extends', () => { expect(classifyQueryIntent('what extends BaseClass').intent).toBe('structural'); });
  });

  describe('maps session queries to hybrid intent', () => {
    it('previous work', () => { expect(classifyQueryIntent('what was I working on in the previous session').intent).toBe('hybrid'); });
    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
    it('prior decisions', () => { expect(classifyQueryIntent('what was the prior decision about auth').intent).toBe('hybrid'); });
  });
});

describe('agent routing validates classifier-backed intent mapping', () => {
  describe('semantic queries map to semantic intent', () => {
    it('explain error handling patterns', () => { expect(classifyQueryIntent('explain error handling patterns').intent).toBe('semantic'); });
    it('find similar authentication code', () => { expect(classifyQueryIntent('find similar authentication code').intent).toBe('semantic'); });
    it('what is the purpose of the budget allocator', () => { expect(classifyQueryIntent('what is the purpose of the budget allocator').intent).toBe('semantic'); });
  });

  describe('structural queries map to structural intent', () => {
    it('what calls allocateBudget', () => { expect(classifyQueryIntent('what calls allocateBudget').intent).toBe('structural'); });
    it('show outline of session-prime.ts', () => { expect(classifyQueryIntent('show outline of session-prime.ts').intent).toBe('structural'); });
    it('what implements the RuntimeInfo interface', () => { expect(classifyQueryIntent('what implements the RuntimeInfo interface').intent).toBe('structural'); });
  });

  describe('session queries map to hybrid intent', () => {
    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
    it('what was I doing last session', () => { expect(classifyQueryIntent('what was I doing last session').intent).toBe('hybrid'); });
  });

  describe('content-oriented queries still map to semantic intent', () => {
    it('explain the hook system purpose', () => { expect(classifyQueryIntent('explain the hook system purpose').intent).toBe('semantic'); });
    it('what is the purpose of the token budget', () => { expect(classifyQueryIntent('what is the purpose of the token budget').intent).toBe('semantic'); });
    it('where is authentication handled', () => { expect(classifyQueryIntent('where is authentication handled').intent).toBe('semantic'); });
  });

  describe('routing is case-insensitive', () => {
    it('WHAT CALLS parseFile → structural', () => { expect(classifyQueryIntent('WHAT CALLS parseFile').intent).toBe('structural'); });
    it('Find Similar Code → semantic', () => { expect(classifyQueryIntent('Find Similar Code').intent).toBe('semantic'); });
    it('Resume My Session → hybrid', () => { expect(classifyQueryIntent('Resume My Session').intent).toBe('hybrid'); });
  });
});

describe('runtime routing fallback guardrails', () => {
  it('refuses ambiguous save chunks by default instead of invoking Tier 3', async () => {
    const classifyWithTier3 = vi.fn(async () => ({
      category: 'narrative_delivery',
      confidence: 0.8,
      target_doc: 'implementation-summary.md',
      target_anchor: 'how-delivered',
      merge_mode: 'append-as-paragraph',
      reasoning: 'Tier 3 should stay opt-in on planner-first saves.',
    }));
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
      classifyWithTier3,
    });

    const decision = await router.classifyContent({
      id: 'runtime-route-01',
      text: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
      sourceField: 'unknown',
    }, makeRouterContext());

    expect(decision.refusal).toBe(true);
    expect(decision.warningMessage).toContain('operator should specify routeAs');
    expect(classifyWithTier3).not.toHaveBeenCalled();
  });
});
