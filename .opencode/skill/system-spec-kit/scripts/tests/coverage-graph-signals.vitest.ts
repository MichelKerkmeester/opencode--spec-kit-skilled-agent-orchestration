import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const coreModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
)) as {
  createGraph: () => { nodes: Map<string, object>; edges: Map<string, object> };
  insertEdge: (graph: ReturnType<typeof coreModule.createGraph>, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
  resetEdgeIdCounter: () => void;
};

const signalsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
)) as {
  computeDegree: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, sessionId?: string) => { inDegree: number; outDegree: number; total: number };
  computeDepth: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, sessionId?: string) => number;
  computeAllDepths: (graph: ReturnType<typeof coreModule.createGraph>, sessionId?: string) => Map<string, number>;
  computeRecentEdgeActivity: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, windowSize?: number, sessionId?: string) => number;
  computeMomentum: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, windowSize?: number, sessionId?: string) => number;
  computeClusterMetrics: (graph: ReturnType<typeof coreModule.createGraph>, sessionId?: string) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
};

describe('coverage-graph-signals', () => {
  beforeEach(() => {
    coreModule.resetEdgeIdCounter();
  });

  describe('computeDegree', () => {
    it('computes in-degree and out-degree', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'c', 'CITES');
      coreModule.insertEdge(graph, 'b', 'c', 'EXTENDS');

      const degreeA = signalsModule.computeDegree(graph, 'a');
      expect(degreeA.outDegree).toBe(2);
      expect(degreeA.inDegree).toBe(0);
      expect(degreeA.total).toBe(2);

      const degreeC = signalsModule.computeDegree(graph, 'c');
      expect(degreeC.inDegree).toBe(2);
      expect(degreeC.outDegree).toBe(0);
      expect(degreeC.total).toBe(2);
    });

    it('returns zero for isolated node', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('lonely', { id: 'lonely' });
      const degree = signalsModule.computeDegree(graph, 'lonely');
      expect(degree.total).toBe(0);
    });

    it('normalizes session ids when computing degree', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0, { sessionId: 'sess-1' });
      expect(signalsModule.computeDegree(graph, 'a', '  sess-1  ').total).toBe(1);
    });
  });

  describe('computeDepth', () => {
    it('computes depth in a linear chain', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
      coreModule.insertEdge(graph, 'c', 'd', 'EXTENDS');

      expect(signalsModule.computeDepth(graph, 'a')).toBe(0);
      expect(signalsModule.computeDepth(graph, 'b')).toBe(1);
      expect(signalsModule.computeDepth(graph, 'c')).toBe(2);
      expect(signalsModule.computeDepth(graph, 'd')).toBe(3);
    });

    it('returns 0 for root node', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'root', 'child', 'ANSWERS');
      expect(signalsModule.computeDepth(graph, 'root')).toBe(0);
    });

    it('returns 0 for non-existent node', () => {
      const graph = coreModule.createGraph();
      expect(signalsModule.computeDepth(graph, 'nonexistent')).toBe(0);
    });

    it('computes longest path depth for diamond DAG', () => {
      const graph = coreModule.createGraph();
      // a -> b -> d
      // a -> c -> d
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'd', 'CITES');
      coreModule.insertEdge(graph, 'c', 'd', 'CITES');

      expect(signalsModule.computeDepth(graph, 'd')).toBe(2);
    });

    it('collapses rooted cycles into a bounded depth layer', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'root', 'a', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'b', 'CITES');
      coreModule.insertEdge(graph, 'b', 'a', 'DERIVED_FROM');
      coreModule.insertEdge(graph, 'b', 'tail', 'COVERS');

      expect(signalsModule.computeDepth(graph, 'root')).toBe(0);
      expect(signalsModule.computeDepth(graph, 'a')).toBe(1);
      expect(signalsModule.computeDepth(graph, 'b')).toBe(1);
      expect(signalsModule.computeDepth(graph, 'tail')).toBe(2);
    });

    it('treats a rootless cycle with a tail as a root SCC', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'a', 'CITES');
      coreModule.insertEdge(graph, 'b', 'tail', 'COVERS');

      expect(signalsModule.computeDepth(graph, 'a')).toBe(0);
      expect(signalsModule.computeDepth(graph, 'b')).toBe(0);
      expect(signalsModule.computeDepth(graph, 'tail')).toBe(1);
    });
  });

  describe('computeAllDepths', () => {
    it('computes depths for all nodes', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'c', 'CITES');

      const depths = signalsModule.computeAllDepths(graph);
      expect(depths.get('a')).toBe(0);
      expect(depths.get('b')).toBe(1);
      expect(depths.get('c')).toBe(2);
    });

    it('returns empty map for empty graph', () => {
      const graph = coreModule.createGraph();
      const depths = signalsModule.computeAllDepths(graph);
      expect(depths.size).toBe(0);
    });
  });

  describe('computeRecentEdgeActivity', () => {
    it('counts recent edges within window', () => {
      const graph = coreModule.createGraph();
      // Insert edges — they get current timestamps
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'c', 'CITES');

      // With a large window, both edges should be counted
      const activity = signalsModule.computeRecentEdgeActivity(graph, 'a', 600000);
      expect(activity).toBe(2);
      expect(signalsModule.computeMomentum(graph, 'a', 600000)).toBe(activity);
    });

    it('returns 0 for node with no recent edges', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('stale', { id: 'stale' });
      const activity = signalsModule.computeRecentEdgeActivity(graph, 'stale', 300000);
      expect(activity).toBe(0);
    });

    it('counts edges where node is target', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'x', 'target', 'ANSWERS');
      coreModule.insertEdge(graph, 'y', 'target', 'CITES');
      const activity = signalsModule.computeRecentEdgeActivity(graph, 'target', 600000);
      expect(activity).toBe(2);
    });
  });

  describe('computeClusterMetrics', () => {
    it('detects a single connected component', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'c', 'CITES');

      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.componentCount).toBe(1);
      expect(metrics.largestSize).toBe(3);
      expect(metrics.isolatedNodes).toBe(0);
    });

    it('detects multiple components', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'c', 'd', 'CITES');

      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.componentCount).toBe(2);
      expect(metrics.sizes).toEqual([2, 2]);
    });

    it('counts isolated nodes', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('x', { id: 'x' });
      graph.nodes.set('y', { id: 'y' });
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');

      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.isolatedNodes).toBe(2);
      expect(metrics.componentCount).toBe(3);
    });

    it('returns zeros for empty graph', () => {
      const graph = coreModule.createGraph();
      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.componentCount).toBe(0);
      expect(metrics.largestSize).toBe(0);
      expect(metrics.isolatedNodes).toBe(0);
      expect(metrics.sizes).toEqual([]);
    });

    it('treats directed edges as undirected for connectivity', () => {
      const graph = coreModule.createGraph();
      // Only one direction, but they should be in the same component
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.componentCount).toBe(1);
      expect(metrics.largestSize).toBe(2);
    });
  });
});
