// TEST: Batch PageRank (C138-P4)
// Iterative PageRank for memory graph authority scoring.
// Verifies convergence, score persistence, isolation, batching.
import { describe, it, expect } from 'vitest';
import { computePageRank } from '../lib/manage/pagerank';
import type { GraphNode, PageRankResult } from '../lib/manage/pagerank';

const DEFAULT_ITERATIONS = 10;

/* ---------------------------------------------------------------
   TESTS
   --------------------------------------------------------------- */

describe('C138-P4 Batch PageRank', () => {

  // ---- T1: Simple graph converges ----
  it('T1: triangle graph converges within 10 iterations', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2] },
      { id: 2, outLinks: [3] },
      { id: 3, outLinks: [1] },
    ];

    const result = computePageRank(nodes);

    expect(result.converged).toBe(true);
    expect(result.iterations).toBeLessThanOrEqual(DEFAULT_ITERATIONS);

    // In a triangle, all nodes should have equal PageRank
    const scores = Array.from(result.scores.values());
    expect(scores[0]).toBeCloseTo(scores[1], 4);
    expect(scores[1]).toBeCloseTo(scores[2], 4);
  });

  // ---- T2: Scores sum to ~1.0 ----
  it('T2: all PageRank scores sum to approximately 1.0', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2, 3] },
      { id: 2, outLinks: [3] },
      { id: 3, outLinks: [1] },
      { id: 4, outLinks: [1, 2] },
    ];

    const result = computePageRank(nodes);
    const sum = Array.from(result.scores.values()).reduce((a, b) => a + b, 0);

    expect(sum).toBeCloseTo(1.0, 2);
  });

  it('T2b: dangling-node mass is redistributed and score sum remains ~1.0', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2] },
      { id: 2, outLinks: [1] },
      { id: 3, outLinks: [] }, // dangling node
    ];

    const result = computePageRank(nodes);
    const sum = Array.from(result.scores.values()).reduce((a, b) => a + b, 0);

    expect(sum).toBeCloseTo(1.0, 4);
    expect(result.scores.get(3)).toBeGreaterThan(0);
  });

  // ---- T3: Hub node gets higher score ----
  it('T3: node with many inbound links gets highest score', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [3] },
      { id: 2, outLinks: [3] },
      { id: 3, outLinks: [4] },  // 1,2,4 all link to 3
      { id: 4, outLinks: [3] },
    ];

    const result = computePageRank(nodes);

    const score3 = result.scores.get(3)!;
    const score1 = result.scores.get(1)!;
    const score2 = result.scores.get(2)!;

    expect(score3).toBeGreaterThan(score1);
    expect(score3).toBeGreaterThan(score2);
  });

  // ---- T4: Isolated node gets minimum score ----
  it('T4: isolated node (no inbound links) gets minimum PageRank', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2] },
      { id: 2, outLinks: [1] },
      { id: 3, outLinks: [] },  // isolated: no one links to it
    ];

    const result = computePageRank(nodes);

    const score1 = result.scores.get(1)!;
    const score3 = result.scores.get(3)!;

    // Isolated node gets only the (1-d)/N base score
    expect(score3).toBeLessThan(score1);
    expect(score3).toBeGreaterThan(0); // never zero due to damping
  });

  // ---- T5: Empty graph ----
  it('T5: empty graph returns empty scores and converged=true', () => {
    const result = computePageRank([]);

    expect(result.scores.size).toBe(0);
    expect(result.iterations).toBe(0);
    expect(result.converged).toBe(true);
  });

  // ---- T6: Single node ----
  it('T6: single node gets the only PageRank score', () => {
    const nodes: GraphNode[] = [{ id: 1, outLinks: [] }];
    const result = computePageRank(nodes);

    // Single node with no inbound links gets (1-d)/n = 0.15 per iteration
    // (damping factor prevents score from reaching 1.0 without inbound links)
    const score = result.scores.get(1)!;
    expect(score).toBeGreaterThan(0);
    expect(result.scores.size).toBe(1);
  });

  // ---- T7: Star topology ----
  it('T7: star center node dominates in star topology', () => {
    // Node 1 is the center, all others point to it
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [] },
      { id: 2, outLinks: [1] },
      { id: 3, outLinks: [1] },
      { id: 4, outLinks: [1] },
      { id: 5, outLinks: [1] },
    ];

    const result = computePageRank(nodes);
    const centerScore = result.scores.get(1)!;

    for (let i = 2; i <= 5; i++) {
      expect(centerScore).toBeGreaterThan(result.scores.get(i)!);
    }
  });

  // ---- T8: Damping factor impact ----
  it('T8: higher damping factor increases score differential', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2] },
      { id: 2, outLinks: [1] },
      { id: 3, outLinks: [1] },
    ];

    const lowDamping = computePageRank(nodes, 20, 0.5);
    const highDamping = computePageRank(nodes, 20, 0.95);

    // Higher damping → more differentiation between hub and leaf
    const diffLow = lowDamping.scores.get(1)! - lowDamping.scores.get(2)!;
    const diffHigh = highDamping.scores.get(1)! - highDamping.scores.get(2)!;

    expect(Math.abs(diffHigh)).toBeGreaterThanOrEqual(Math.abs(diffLow) - 0.01);
  });

  // ---- T9: Performance for 100 nodes ----
  it('T9: computes PageRank for 100 nodes within 10ms', () => {
    const nodes: GraphNode[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      outLinks: [((i + 1) % 100) + 1, ((i + 7) % 100) + 1],
    }));

    const start = performance.now();
    const result = computePageRank(nodes);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(10);
    expect(result.scores.size).toBe(100);
  });

  // ---- T10: Deterministic output ----
  it('T10: same graph produces identical scores', () => {
    const nodes: GraphNode[] = [
      { id: 1, outLinks: [2, 3] },
      { id: 2, outLinks: [3] },
      { id: 3, outLinks: [1] },
    ];

    const run1 = computePageRank(nodes);
    const run2 = computePageRank(nodes);

    for (const [id, score] of run1.scores) {
      expect(score).toBe(run2.scores.get(id));
    }
  });
});
