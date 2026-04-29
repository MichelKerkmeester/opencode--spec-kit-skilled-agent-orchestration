import { describe, expect, it } from 'vitest';

import { buildTrustTree } from '../../lib/rag/trust-tree.js';
import { runMeasurement } from './measurement-fixtures.js';

describe('W3 composed RAG trust tree', () => {
  it('composes response policy, graph, advisor, CocoIndex, and causal contradiction signals', () => {
    const trustTree = buildTrustTree({
      responsePolicy: {
        state: 'live',
        decision: 'cite-or-refuse',
        citations: ['trust-tree-response-policy'],
      },
      codeGraph: {
        trustState: 'stale',
        canonicalReadiness: 'stale',
        citations: ['code-graph-readiness-signal'],
      },
      advisor: {
        trustState: 'live',
        citations: ['advisor-trust-state-signal'],
      },
      cocoIndex: {
        available: true,
        pathClass: 'runtime',
        rawScore: 0.82,
        citations: ['cocoindex-path-signal'],
      },
      causal: {
        edges: [{
          relation: 'contradicts',
          sourceId: 'trust-tree-response-policy',
          targetId: 'trust-tree-contradiction-edge',
          strength: 0.9,
        }],
        citations: ['trust-tree-contradiction-edge'],
      },
    });

    expect(trustTree.decision).toBe('mixed');
    expect(trustTree.hasContradiction).toBe(true);
    expect(trustTree.causal.contradicts).toHaveLength(1);
    expect(trustTree.citations).toEqual(expect.arrayContaining([
      'trust-tree-response-policy',
      'trust-tree-contradiction-edge',
    ]));
  });

  it('improves W3 citation-quality in the variant fixture', async () => {
    const baseline = await runMeasurement({ workstream: 'W3', variant: 'baseline' });
    const variant = await runMeasurement({ workstream: 'W3', variant: 'variant' });

    expect(variant.summary.citationQuality).toBeGreaterThan(baseline.summary.citationQuality);
    expect(variant.summary.recallAt3).toBeGreaterThanOrEqual(baseline.summary.recallAt3);
  });
});
