import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '..', '..');
const require = createRequire(import.meta.url);

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  'scripts/lib/coverage-graph-convergence.cjs',
)) as {
  SOURCE_DIVERSITY_THRESHOLD: number;
  EVIDENCE_DEPTH_THRESHOLD: number;
  computeSourceDiversity: (graph: Graph) => number;
  computeEvidenceDepth: (graph: Graph) => number;
  computeQuestionCoverage: (graph: Graph) => number;
  computeGraphConvergence: (graph: Graph, signals?: { compositeStop?: number }) => {
    graphScore: number;
    blendedScore: number;
    components: {
      fragmentationScore: number;
      normalizedDepth: number;
      questionCoverage: number;
      sourceDiversity: number;
      compositeStop: number | null;
    };
  };
  evaluateGraphGates: (graph: Graph) => {
    sourceDiversity: { pass: boolean; value: number; threshold: number };
    evidenceDepth: { pass: boolean; value: number; threshold: number };
    allPass: boolean;
  };
};

type GraphNode = {
  id: string;
  type: 'question' | 'finding' | 'source';
};

type GraphEdge = {
  source: string;
  target: string;
  relation: string;
  createdAt?: string;
};

type Graph = {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
};

function makeGraph(nodes: GraphNode[], edges: GraphEdge[]): Graph {
  return {
    nodes: new Map(nodes.map((node) => [node.id, node])),
    edges: new Map(edges.map((edge, index) => [`edge-${index}`, edge])),
  };
}

describe('coverage-graph-convergence', () => {
  it('exports the canonical stop-gate thresholds', () => {
    expect(convergenceModule.SOURCE_DIVERSITY_THRESHOLD).toBe(0.4);
    expect(convergenceModule.EVIDENCE_DEPTH_THRESHOLD).toBe(1.5);
  });

  it('computes source diversity from unique edge sources over total nodes', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', type: 'question' },
        { id: 'q-2', type: 'question' },
        { id: 'f-1', type: 'finding' },
        { id: 'f-2', type: 'finding' },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-2', relation: 'ANSWERS' },
      ],
    );

    expect(convergenceModule.computeSourceDiversity(graph)).toBe(0.5);
  });

  it('returns zero source diversity for an empty graph', () => {
    expect(convergenceModule.computeSourceDiversity(makeGraph([], []))).toBe(0);
  });

  it('computes average evidence depth from longest-path node depths', () => {
    const graph = makeGraph(
      [
        { id: 'source-1', type: 'source' },
        { id: 'finding-1', type: 'finding' },
        { id: 'question-1', type: 'question' },
      ],
      [
        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
        { source: 'finding-1', target: 'question-1', relation: 'ANSWERS' },
      ],
    );

    expect(convergenceModule.computeEvidenceDepth(graph)).toBe(1);
  });

  it('computes question coverage from ANSWERS edges into question nodes', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', type: 'question' },
        { id: 'q-2', type: 'question' },
        { id: 'f-1', type: 'finding' },
      ],
      [{ source: 'f-1', target: 'q-1', relation: 'ANSWERS' }],
    );

    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0.5);
  });

  it('treats a graph with no questions as fully covered', () => {
    const graph = makeGraph(
      [{ id: 'finding-1', type: 'finding' }],
      [],
    );

    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(1);
  });

  it('computes a graph-only convergence score when stop-trace signals are absent', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', type: 'question' },
        { id: 'q-2', type: 'question' },
        { id: 'f-1', type: 'finding' },
        { id: 'source-1', type: 'source' },
      ],
      [
        { source: 'source-1', target: 'f-1', relation: 'SUPPORTS' },
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
      ],
    );

    const result = convergenceModule.computeGraphConvergence(graph);
    expect(result.blendedScore).toBe(result.graphScore);
    expect(result.components.questionCoverage).toBe(0.5);
    expect(result.components.sourceDiversity).toBe(0.5);
  });

  it('blends the graph score with compositeStop when stop-trace signals exist', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', type: 'question' },
        { id: 'f-1', type: 'finding' },
      ],
      [{ source: 'f-1', target: 'q-1', relation: 'ANSWERS' }],
    );

    const result = convergenceModule.computeGraphConvergence(graph, { compositeStop: 0.8 });
    expect(result.components.compositeStop).toBe(0.8);
    expect(result.blendedScore).toBeGreaterThanOrEqual(result.graphScore);
    expect(result.blendedScore).toBeLessThanOrEqual(0.8);
  });

  it('passes graph gates when both diversity and depth clear their thresholds', () => {
    const graph = makeGraph(
      [
        { id: 'source-1', type: 'source' },
        { id: 'finding-1', type: 'finding' },
        { id: 'finding-2', type: 'finding' },
        { id: 'question-1', type: 'question' },
      ],
      [
        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
        { source: 'finding-1', target: 'finding-2', relation: 'DERIVED_FROM' },
        { source: 'finding-2', target: 'question-1', relation: 'ANSWERS' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(true);
    expect(result.evidenceDepth.pass).toBe(true);
    expect(result.allPass).toBe(true);
  });

  it('fails the diversity gate when too few distinct sources are present', () => {
    const graph = makeGraph(
      [
        { id: 'source-1', type: 'source' },
        { id: 'finding-1', type: 'finding' },
        { id: 'finding-2', type: 'finding' },
        { id: 'finding-3', type: 'finding' },
      ],
      [
        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
        { source: 'source-1', target: 'finding-2', relation: 'SUPPORTS' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(false);
    expect(result.sourceDiversity.value).toBe(0.25);
    expect(result.allPass).toBe(false);
  });

  it('fails the depth gate when evidence chains are too shallow', () => {
    const graph = makeGraph(
      [
        { id: 'source-1', type: 'source' },
        { id: 'source-2', type: 'source' },
        { id: 'finding-1', type: 'finding' },
        { id: 'finding-2', type: 'finding' },
      ],
      [
        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
        { source: 'source-2', target: 'finding-2', relation: 'SUPPORTS' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(true);
    expect(result.evidenceDepth.pass).toBe(false);
    expect(result.evidenceDepth.value).toBe(0.5);
    expect(result.allPass).toBe(false);
  });
});
