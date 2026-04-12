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
  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  REVIEW_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  DEFAULT_MAX_DEPTH: number;
  createGraph: () => { nodes: Map<string, object>; edges: Map<string, object> };
  insertEdge: (graph: ReturnType<typeof coreModule.createGraph>, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
  updateEdge: (graph: ReturnType<typeof coreModule.createGraph>, edgeId: string, updates: { weight?: number; metadata?: object; relation?: string }) => boolean;
  deleteEdge: (graph: ReturnType<typeof coreModule.createGraph>, edgeId: string) => boolean;
  traverseProvenance: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
  getEdges: (graph: ReturnType<typeof coreModule.createGraph>, sessionId?: string) => Array<object>;
  getEdgesFrom: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => Array<object>;
  getEdgesTo: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => Array<object>;
  clampWeight: (weight: number) => number | null;
  resetEdgeIdCounter: () => void;
};

describe('coverage-graph-core', () => {
  beforeEach(() => {
    coreModule.resetEdgeIdCounter();
  });

  describe('constants', () => {
    it('exports research relation weights', () => {
      expect(coreModule.RESEARCH_RELATION_WEIGHTS).toBeDefined();
      expect(coreModule.RESEARCH_RELATION_WEIGHTS.ANSWERS).toBe(1.3);
      expect(coreModule.RESEARCH_RELATION_WEIGHTS.CONTRADICTS).toBe(0.8);
      expect(coreModule.RESEARCH_RELATION_WEIGHTS.CITES).toBe(1.0);
    });

    it('exports review relation weights', () => {
      expect(coreModule.REVIEW_RELATION_WEIGHTS).toBeDefined();
      expect(coreModule.REVIEW_RELATION_WEIGHTS.COVERS).toBe(1.3);
      expect(coreModule.REVIEW_RELATION_WEIGHTS.EVIDENCE_FOR).toBe(1.0);
      expect(coreModule.REVIEW_RELATION_WEIGHTS.RESOLVES).toBe(1.5);
      expect(coreModule.REVIEW_RELATION_WEIGHTS.CONFIRMS).toBe(1.0);
    });

    it('has default max depth of 5', () => {
      expect(coreModule.DEFAULT_MAX_DEPTH).toBe(5);
    });

    it('relation weight maps are frozen', () => {
      expect(Object.isFrozen(coreModule.RESEARCH_RELATION_WEIGHTS)).toBe(true);
      expect(Object.isFrozen(coreModule.REVIEW_RELATION_WEIGHTS)).toBe(true);
    });
  });

  describe('createGraph', () => {
    it('returns an empty graph with Maps', () => {
      const graph = coreModule.createGraph();
      expect(graph.nodes).toBeInstanceOf(Map);
      expect(graph.edges).toBeInstanceOf(Map);
      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
    });
  });

  describe('clampWeight', () => {
    it('clamps values within 0.0-2.0 range', () => {
      expect(coreModule.clampWeight(1.0)).toBe(1.0);
      expect(coreModule.clampWeight(0.0)).toBe(0.0);
      expect(coreModule.clampWeight(2.0)).toBe(2.0);
    });

    it('clamps values above 2.0 to 2.0', () => {
      expect(coreModule.clampWeight(3.0)).toBe(2.0);
      expect(coreModule.clampWeight(100)).toBe(2.0);
    });

    it('clamps values below 0.0 to 0.0', () => {
      expect(coreModule.clampWeight(-1.0)).toBe(0.0);
      expect(coreModule.clampWeight(-100)).toBe(0.0);
    });

    it('returns null for non-finite inputs', () => {
      expect(coreModule.clampWeight(NaN)).toBeNull();
      expect(coreModule.clampWeight(Infinity)).toBeNull();
      expect(coreModule.clampWeight(-Infinity)).toBeNull();
    });
  });

  describe('insertEdge', () => {
    it('inserts an edge and returns an edge ID', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.3);
      expect(edgeId).toBeTruthy();
      expect(graph.edges.size).toBe(1);
      expect(graph.nodes.size).toBe(2);
    });

    it('prevents self-loops', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'a', 'CITES', 1.0);
      expect(edgeId).toBeNull();
      expect(graph.edges.size).toBe(0);
    });

    it('auto-creates source and target nodes', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'src', 'tgt', 'ANSWERS');
      expect(graph.nodes.has('src')).toBe(true);
      expect(graph.nodes.has('tgt')).toBe(true);
    });

    it('clamps edge weight to valid range', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', 5.0);
      expect(edgeId).toBeTruthy();
      const edge = graph.edges.get(edgeId!) as { weight: number };
      expect(edge.weight).toBe(2.0);
    });

    it('rejects non-finite weight', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', NaN);
      expect(edgeId).toBeNull();
    });

    it('defaults weight to 1.0 when omitted', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES');
      const edge = graph.edges.get(edgeId!) as { weight: number };
      expect(edge.weight).toBe(1.0);
    });

    it('normalizes session identifiers when filtering graph records', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'CITES', 1.0, { sessionId: 'sess-1' });
      expect(coreModule.getEdges(graph, '  sess-1  ').length).toBe(1);
    });
  });

  describe('updateEdge', () => {
    it('updates weight on an existing edge', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0)!;
      const result = coreModule.updateEdge(graph, edgeId, { weight: 1.5 });
      expect(result).toBe(true);
      const edge = graph.edges.get(edgeId) as { weight: number };
      expect(edge.weight).toBe(1.5);
    });

    it('returns false for non-existent edge', () => {
      const graph = coreModule.createGraph();
      expect(coreModule.updateEdge(graph, 'nonexistent', { weight: 1.0 })).toBe(false);
    });

    it('merges metadata', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', 1.0, { foo: 'bar' })!;
      coreModule.updateEdge(graph, edgeId, { metadata: { baz: 'qux' } });
      const edge = graph.edges.get(edgeId) as { metadata: Record<string, string> };
      expect(edge.metadata.foo).toBe('bar');
      expect(edge.metadata.baz).toBe('qux');
    });
  });

  describe('deleteEdge', () => {
    it('deletes an existing edge', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS')!;
      expect(coreModule.deleteEdge(graph, edgeId)).toBe(true);
      expect(graph.edges.size).toBe(0);
    });

    it('returns false for non-existent edge', () => {
      const graph = coreModule.createGraph();
      expect(coreModule.deleteEdge(graph, 'nonexistent')).toBe(false);
    });
  });

  describe('traverseProvenance', () => {
    it('traverses a linear chain', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 1.0);
      const result = coreModule.traverseProvenance(graph, 'a', 5);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('c');
    });

    it('respects max depth', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 1.0);
      coreModule.insertEdge(graph, 'c', 'd', 'EXTENDS', 1.0);
      const result = coreModule.traverseProvenance(graph, 'a', 2);
      expect(result.length).toBe(2);
      expect(result.map((r) => r.id)).toContain('b');
      expect(result.map((r) => r.id)).toContain('c');
    });

    it('handles cycles without infinite loops', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
      coreModule.insertEdge(graph, 'b', 'a', 'CONTRADICTS', 0.8);
      const result = coreModule.traverseProvenance(graph, 'a', 5);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('b');
    });

    it('propagates weights through chains', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.3);
      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 0.5);
      const result = coreModule.traverseProvenance(graph, 'a', 5);
      const nodeC = result.find((r) => r.id === 'c')!;
      expect(nodeC.weight).toBeCloseTo(0.65, 2);
    });

    it('returns empty for isolated node', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('isolated', { id: 'isolated' });
      const result = coreModule.traverseProvenance(graph, 'isolated', 5);
      expect(result.length).toBe(0);
    });
  });

  describe('getEdgesFrom / getEdgesTo', () => {
    it('returns outgoing edges', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'a', 'c', 'CITES');
      coreModule.insertEdge(graph, 'b', 'c', 'EXTENDS');
      const from = coreModule.getEdgesFrom(graph, 'a');
      expect(from.length).toBe(2);
    });

    it('returns incoming edges', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
      const to = coreModule.getEdgesTo(graph, 'c');
      expect(to.length).toBe(2);
    });

    it('returns empty for node with no edges', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('lonely', { id: 'lonely' });
      expect(coreModule.getEdgesFrom(graph, 'lonely').length).toBe(0);
      expect(coreModule.getEdgesTo(graph, 'lonely').length).toBe(0);
    });
  });
});
