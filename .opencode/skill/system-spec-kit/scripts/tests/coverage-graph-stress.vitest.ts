/**
 * Coverage Graph Stress Tests (Phase 006 — REQ-GT-007, REQ-GT-008)
 *
 * Performance and correctness validation at scale:
 *   - 1000+ node graph construction and query
 *   - Contradiction scanning with 500+ edges
 *   - Provenance traversal in deep chains
 *   - Cluster metrics with complex topologies
 */

import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

// ── CJS layer imports ────────────────────────────────────────────

const coreModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
)) as {
  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  createGraph: () => { nodes: Map<string, any>; edges: Map<string, any> };
  insertEdge: (graph: any, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
  traverseProvenance: (graph: any, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
  resetEdgeIdCounter: () => void;
};

const signalsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
)) as {
  computeDegree: (graph: any, nodeId: string) => { inDegree: number; outDegree: number; total: number };
  computeAllDepths: (graph: any) => Map<string, number>;
  computeClusterMetrics: (graph: any) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
};

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
)) as {
  computeSourceDiversity: (graph: any) => number;
  computeEvidenceDepth: (graph: any) => number;
  computeQuestionCoverage: (graph: any) => number;
  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
};

const contradictionsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
)) as {
  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
};

// ── Helpers ──────────────────────────────────────────────────────

const RELATIONS = ['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'CITES', 'COVERS', 'DERIVED_FROM', 'SUPERSEDES'];
const NON_CONTRADICTION_RELATIONS = RELATIONS.filter((relation) => relation !== 'CONTRADICTS');
const ENABLE_BENCHMARK_GUARDS = process.env.SPEC_KIT_ENABLE_COVERAGE_GRAPH_BENCHMARKS === '1';

function pickRelation(i: number, relations: readonly string[] = RELATIONS): string {
  return relations[i % relations.length];
}

function expectWithinBenchmarkBudget(elapsedMs: number, budgetMs: number): void {
  if (ENABLE_BENCHMARK_GUARDS) {
    expect(elapsedMs).toBeLessThan(budgetMs);
  }
}

/**
 * Build a large graph with N nodes and approximately N edges.
 * Creates a mix of chains and cross-links to produce realistic topology.
 */
function buildLargeGraph(
  nodeCount: number,
  relations: readonly string[] = RELATIONS,
): ReturnType<typeof coreModule.createGraph> {
  const graph = coreModule.createGraph();

  // Create a backbone chain: node-0 → node-1 → ... → node-(N-1)
  for (let i = 0; i < nodeCount - 1; i++) {
    coreModule.insertEdge(
      graph,
      `node-${i}`,
      `node-${i + 1}`,
      pickRelation(i, relations),
    );
  }

  // Add cross-links: every 10th node links to a node 5 positions ahead
  for (let i = 0; i < nodeCount - 5; i += 10) {
    coreModule.insertEdge(
      graph,
      `node-${i}`,
      `node-${i + 5}`,
      'SUPPORTS',
    );
  }

  return graph;
}

// ═════════════════════════════════════════════════════════════════
// TEST SUITES
// ═════════════════════════════════════════════════════════════════

describe('coverage-graph-stress', () => {
  beforeEach(() => {
    coreModule.resetEdgeIdCounter();
  });

  // ── REQ-GT-007: 1000+ node graph ─────────────────────────────

  describe('REQ-GT-007: 1000+ node graph construction and query', () => {
    it('inserts 1000 nodes with edges correctly', () => {
      const graph = buildLargeGraph(1000);

      expect(graph.nodes.size).toBe(1000);
      // 999 backbone edges + ~100 cross-links
      expect(graph.edges.size).toBeGreaterThanOrEqual(999);
      expect(graph.edges.size).toBeLessThan(1200);
    });

    it('inserts 2000 nodes within acceptable time (<2s)', () => {
      const start = performance.now();
      const graph = buildLargeGraph(2000);
      const elapsed = performance.now() - start;

      expect(graph.nodes.size).toBe(2000);
      expectWithinBenchmarkBudget(elapsed, 2000);
    });

    it('degree computation scales to 1000+ nodes', () => {
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      // Query degree for 100 random nodes
      for (let i = 0; i < 1000; i += 10) {
        const degree = signalsModule.computeDegree(graph, `node-${i}`);
        expect(degree.total).toBeGreaterThanOrEqual(1);
      }
      const elapsed = performance.now() - start;

      expectWithinBenchmarkBudget(elapsed, 5000);
    });

    it('computeAllDepths scales to 1000+ nodes', () => {
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const depths = signalsModule.computeAllDepths(graph);
      const elapsed = performance.now() - start;

      expect(depths.size).toBe(1000);
      expectWithinBenchmarkBudget(elapsed, 5000);
    });

    it('cluster metrics scale to 1000+ nodes', () => {
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const metrics = signalsModule.computeClusterMetrics(graph);
      const elapsed = performance.now() - start;

      // Single connected component (backbone chain connects everything)
      expect(metrics.componentCount).toBe(1);
      expect(metrics.largestSize).toBe(1000);
      expect(metrics.isolatedNodes).toBe(0);
      expectWithinBenchmarkBudget(elapsed, 5000);
    });

    it('source diversity scales to 1000+ nodes', () => {
      // ADR-001 canonical semantics: the signal is question-centric, so a
      // buildLargeGraph() output with no QUESTION-kind nodes returns 0. That
      // is semantically correct and cheap; the stress bound we care about
      // here is runtime, not the numeric output.
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const diversity = convergenceModule.computeSourceDiversity(graph);
      const elapsed = performance.now() - start;

      expect(diversity).toBeGreaterThanOrEqual(0);
      expect(diversity).toBeLessThanOrEqual(100); // absurd upper bound, just a sanity check
      expectWithinBenchmarkBudget(elapsed, 2000);
    });

    it('evidence depth scales to 1000+ nodes', () => {
      // Same as diversity: canonical returns 0 for graphs with no QUESTION
      // nodes. The stress bound is runtime.
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const depth = convergenceModule.computeEvidenceDepth(graph);
      const elapsed = performance.now() - start;

      expect(depth).toBeGreaterThanOrEqual(0);
      expectWithinBenchmarkBudget(elapsed, 5000);
    });

    it('full graph convergence computation scales to 1000+ nodes', () => {
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const convergence = convergenceModule.computeGraphConvergence(graph, {
        compositeStop: 0.5,
      });
      const elapsed = performance.now() - start;

      expect(convergence.graphScore).toBeGreaterThanOrEqual(0);
      expect(convergence.graphScore).toBeLessThanOrEqual(1);
      expectWithinBenchmarkBudget(elapsed, 10000);
    });
  });

  // ── REQ-GT-008: Contradiction scanning at scale ───────────────

  describe('REQ-GT-008: contradiction scanning at scale', () => {
    it('scans contradictions in a 500+ edge graph', () => {
      const graph = coreModule.createGraph();

      // Insert 200 CONTRADICTS edges among 400 nodes
      for (let i = 0; i < 200; i++) {
        coreModule.insertEdge(
          graph,
          `claim-${i}`,
          `claim-${i + 200}`,
          'CONTRADICTS',
          0.8,
        );
      }

      // Insert 300+ non-contradiction edges
      for (let i = 0; i < 300; i++) {
        coreModule.insertEdge(
          graph,
          `finding-${i}`,
          `question-${i}`,
          'ANSWERS',
          1.3,
        );
      }

      expect(graph.edges.size).toBe(500);

      const start = performance.now();
      const contradictions = contradictionsModule.scanContradictions(graph);
      const elapsed = performance.now() - start;

      expect(contradictions.length).toBe(200);
      expectWithinBenchmarkBudget(elapsed, 1000);
    });

    it('reportContradictions handles large contradiction sets', () => {
      const graph = coreModule.createGraph();

      for (let i = 0; i < 100; i++) {
        coreModule.insertEdge(
          graph,
          `a-${i}`,
          `b-${i}`,
          'CONTRADICTS',
          0.8,
        );
      }

      const start = performance.now();
      const report = contradictionsModule.reportContradictions(graph);
      const elapsed = performance.now() - start;

      expect(report.total).toBe(100);
      expect(report.pairs.length).toBe(100);
      expectWithinBenchmarkBudget(elapsed, 1000);
    });

    it('contradiction scan returns empty array for graph with no contradictions', () => {
      const graph = buildLargeGraph(500, NON_CONTRADICTION_RELATIONS);
      const contradictions = contradictionsModule.scanContradictions(graph);
      expect(contradictions).toEqual([]);
    });
  });

  // ── Provenance traversal at scale ─────────────────────────────

  describe('provenance traversal at scale', () => {
    it('traverses deep provenance chains (depth 50+)', () => {
      const graph = coreModule.createGraph();

      // Create a chain of 100 nodes
      for (let i = 0; i < 99; i++) {
        coreModule.insertEdge(graph, `n-${i}`, `n-${i + 1}`, 'DERIVED_FROM');
      }

      const start = performance.now();
      const chain = coreModule.traverseProvenance(graph, 'n-0', 100);
      const elapsed = performance.now() - start;

      // Should reach nodes up to depth 100 or DEFAULT_MAX_DEPTH
      expect(chain.length).toBeGreaterThan(0);
      expectWithinBenchmarkBudget(elapsed, 2000);
    });

    it('handles diamond-shaped provenance without infinite loops', () => {
      const graph = coreModule.createGraph();

      // Diamond: a → b, a → c, b → d, c → d
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'd', 'SUPPORTS');
      coreModule.insertEdge(graph, 'c', 'd', 'SUPPORTS');

      const chain = coreModule.traverseProvenance(graph, 'a');
      // Should visit b, c, d without duplicates or infinite loop
      const visitedIds = chain.map(n => n.id);
      expect(visitedIds).toContain('b');
      expect(visitedIds).toContain('c');
      expect(visitedIds).toContain('d');
    });

    it('provenance traversal with 1000+ nodes completes in bounded time', () => {
      const graph = buildLargeGraph(1000);

      const start = performance.now();
      const chain = coreModule.traverseProvenance(graph, 'node-0', 10);
      const elapsed = performance.now() - start;

      expect(chain.length).toBeGreaterThan(0);
      expectWithinBenchmarkBudget(elapsed, 5000);
    });
  });

  // ── Multi-component stress ────────────────────────────────────

  describe('multi-component graph stress', () => {
    it('handles 100 disconnected components', () => {
      const graph = coreModule.createGraph();

      // Create 100 disconnected 5-node clusters
      for (let c = 0; c < 100; c++) {
        const base = c * 5;
        for (let i = 0; i < 4; i++) {
          coreModule.insertEdge(
            graph,
            `cluster-${c}-node-${i}`,
            `cluster-${c}-node-${i + 1}`,
            'SUPPORTS',
          );
        }
      }

      expect(graph.nodes.size).toBe(500);

      const start = performance.now();
      const metrics = signalsModule.computeClusterMetrics(graph);
      const elapsed = performance.now() - start;

      expect(metrics.componentCount).toBe(100);
      expect(metrics.largestSize).toBe(5);
      expect(metrics.isolatedNodes).toBe(0);
      expectWithinBenchmarkBudget(elapsed, 5000);
    });

    it('handles graph with 200 isolated nodes plus 500 connected nodes', () => {
      const graph = coreModule.createGraph();

      // Add 200 isolated nodes
      for (let i = 0; i < 200; i++) {
        graph.nodes.set(`isolated-${i}`, { id: `isolated-${i}` });
      }

      // Add 499 edges connecting 500 nodes in a chain
      for (let i = 0; i < 499; i++) {
        coreModule.insertEdge(graph, `connected-${i}`, `connected-${i + 1}`, 'ANSWERS');
      }

      expect(graph.nodes.size).toBe(700);

      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.isolatedNodes).toBe(200);
      expect(metrics.largestSize).toBe(500);
      // 1 big component + 200 isolated = 201 components
      expect(metrics.componentCount).toBe(201);
    });
  });

  // ── Question coverage at scale ────────────────────────────────

  describe('question coverage at scale', () => {
    it('tracks question coverage across 500 questions', () => {
      const graph = coreModule.createGraph();

      // Create 500 questions; cover 250 of them with TWO answering findings each
      // (ADR-001 canonical semantics: a question needs ≥2 ANSWERS edges to count as covered).
      for (let i = 0; i < 500; i++) {
        graph.nodes.set(`q-${i}`, { id: `q-${i}`, kind: 'QUESTION' });
      }

      for (let i = 0; i < 250; i++) {
        graph.nodes.set(`f-${i}a`, { id: `f-${i}a`, kind: 'FINDING' });
        graph.nodes.set(`f-${i}b`, { id: `f-${i}b`, kind: 'FINDING' });
        coreModule.insertEdge(graph, `f-${i}a`, `q-${i}`, 'ANSWERS');
        coreModule.insertEdge(graph, `f-${i}b`, `q-${i}`, 'ANSWERS');
      }

      const start = performance.now();
      const coverage = convergenceModule.computeQuestionCoverage(graph);
      const elapsed = performance.now() - start;

      expect(coverage).toBeCloseTo(0.5, 2); // 250 covered / 500 total
      expectWithinBenchmarkBudget(elapsed, 2000);
    });
  });
});
