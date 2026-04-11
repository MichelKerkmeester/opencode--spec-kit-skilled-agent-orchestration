import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  computeResearchContradictionDensityFromData,
  computeResearchEvidenceDepthFromData,
  computeResearchQuestionCoverageFromData,
  computeResearchSourceDiversityFromData,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-signals.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

type ResearchNode = {
  id: string;
  kind: 'QUESTION' | 'FINDING' | 'SOURCE';
  metadata?: Record<string, unknown>;
};

type ResearchEdge = {
  sourceId: string;
  targetId: string;
  relation: string;
};

type CjsGraph = {
  nodes: Map<string, Record<string, unknown>>;
  edges: Map<string, Record<string, unknown>>;
};

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
)) as {
  computeSourceDiversity: (graph: CjsGraph) => number;
  computeEvidenceDepth: (graph: CjsGraph) => number;
  computeQuestionCoverage: (graph: CjsGraph) => number;
  computeContradictionDensity: (graph: CjsGraph) => number;
  computeGraphConvergence: (graph: CjsGraph, signals?: { compositeStop?: number }) => {
    graphScore: number;
    blendedScore: number;
    components: {
      fragmentationScore: number;
      normalizedDepth: number;
      questionCoverage: number;
      contradictionDensity: number;
      evidenceDepth: number;
      sourceDiversity: number;
      compositeStop: number | null;
    };
  };
};

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function makeGraph(nodes: ResearchNode[], edges: ResearchEdge[]): CjsGraph {
  return {
    nodes: new Map(nodes.map((node) => [node.id, {
      id: node.id,
      kind: node.kind,
      type: node.kind.toLowerCase(),
      metadata: node.metadata ?? null,
    }])),
    edges: new Map(edges.map((edge, index) => [`edge-${index}`, {
      id: `edge-${index}`,
      source: edge.sourceId,
      target: edge.targetId,
      relation: edge.relation,
    }])),
  };
}

function computeIsolatedNodeCount(graph: CjsGraph): number {
  if (graph.nodes.size === 0) return 0;

  const undirected = new Map<string, Set<string>>();
  for (const nodeId of graph.nodes.keys()) {
    undirected.set(nodeId, new Set());
  }

  for (const edge of graph.edges.values()) {
    undirected.get(String(edge.source))?.add(String(edge.target));
    undirected.get(String(edge.target))?.add(String(edge.source));
  }

  let isolatedNodes = 0;
  const visited = new Set<string>();

  for (const nodeId of undirected.keys()) {
    if (visited.has(nodeId)) continue;

    const queue = [nodeId];
    visited.add(nodeId);
    let componentSize = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      componentSize++;

      for (const neighbor of undirected.get(current) ?? []) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    if (componentSize === 1) isolatedNodes++;
  }

  return isolatedNodes;
}

function computeTsEquivalentBlend(nodes: ResearchNode[], edges: ResearchEdge[], compositeStop: number) {
  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);
  const graph = makeGraph(nodes, edges);
  const fragmentationScore = nodes.length > 0
    ? 1 - (computeIsolatedNodeCount(graph) / nodes.length)
    : 0;
  const normalizedDepth = Math.min(evidenceDepth / 5, 1);
  const graphScore = (
    (fragmentationScore * 0.25) +
    (normalizedDepth * 0.25) +
    (questionCoverage * 0.30) +
    (sourceDiversity * 0.20)
  );

  return {
    graphScore: round3(graphScore),
    blendedScore: round3((compositeStop * 0.6) + (graphScore * 0.4)),
  };
}

describe('graph-convergence parity', () => {
  const cases: Array<{
    name: string;
    compositeStop: number;
    nodes: ResearchNode[];
    edges: ResearchEdge[];
    expected: {
      sourceDiversity: number;
      contradictionDensity: number;
      questionCoverage: number;
      evidenceDepth: number;
    };
  }> = [
    {
      name: 'empty graph',
      compositeStop: 0.2,
      nodes: [],
      edges: [],
      expected: {
        sourceDiversity: 0,
        contradictionDensity: 0,
        questionCoverage: 0,
        evidenceDepth: 0,
      },
    },
    {
      name: 'single-source graph',
      compositeStop: 0.55,
      nodes: [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
      ],
      edges: [
        { sourceId: 'f-1', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-1', targetId: 's-1', relation: 'CITES' },
      ],
      expected: {
        sourceDiversity: 1,
        contradictionDensity: 0,
        questionCoverage: 0,
        evidenceDepth: 2,
      },
    },
    {
      name: 'multi-source graph with contradictions',
      compositeStop: 0.9,
      nodes: [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
      ],
      edges: [
        { sourceId: 'f-1', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-2', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-1', targetId: 's-1', relation: 'CITES' },
        { sourceId: 'f-2', targetId: 's-2', relation: 'CITES' },
        { sourceId: 'f-1', targetId: 'f-2', relation: 'CONTRADICTS' },
      ],
      expected: {
        sourceDiversity: 2,
        contradictionDensity: 0.2,
        questionCoverage: 1,
        evidenceDepth: 2,
      },
    },
  ];

  for (const testCase of cases) {
    it(`keeps CJS parity with canonical TS research signals for ${testCase.name}`, () => {
      const graph = makeGraph(testCase.nodes, testCase.edges);

      const cjsSourceDiversity = convergenceModule.computeSourceDiversity(graph);
      const cjsContradictionDensity = convergenceModule.computeContradictionDensity(graph);
      const cjsQuestionCoverage = convergenceModule.computeQuestionCoverage(graph);
      const cjsEvidenceDepth = convergenceModule.computeEvidenceDepth(graph);
      const cjsConvergence = convergenceModule.computeGraphConvergence(graph, {
        compositeStop: testCase.compositeStop,
      });

      const tsSourceDiversity = computeResearchSourceDiversityFromData(testCase.nodes, testCase.edges);
      const tsContradictionDensity = computeResearchContradictionDensityFromData(testCase.edges);
      const tsQuestionCoverage = computeResearchQuestionCoverageFromData(testCase.nodes, testCase.edges);
      const tsEvidenceDepth = computeResearchEvidenceDepthFromData(testCase.nodes, testCase.edges);
      const tsEquivalentBlend = computeTsEquivalentBlend(
        testCase.nodes,
        testCase.edges,
        testCase.compositeStop,
      );

      expect(cjsSourceDiversity).toBe(testCase.expected.sourceDiversity);
      expect(tsSourceDiversity).toBe(testCase.expected.sourceDiversity);
      expect(cjsSourceDiversity).toBe(tsSourceDiversity);

      expect(cjsContradictionDensity).toBe(testCase.expected.contradictionDensity);
      expect(tsContradictionDensity).toBe(testCase.expected.contradictionDensity);
      expect(cjsContradictionDensity).toBe(tsContradictionDensity);

      expect(cjsQuestionCoverage).toBe(testCase.expected.questionCoverage);
      expect(tsQuestionCoverage).toBe(testCase.expected.questionCoverage);
      expect(cjsQuestionCoverage).toBe(tsQuestionCoverage);

      expect(cjsEvidenceDepth).toBe(testCase.expected.evidenceDepth);
      expect(tsEvidenceDepth).toBe(testCase.expected.evidenceDepth);
      expect(cjsEvidenceDepth).toBe(tsEvidenceDepth);

      expect(cjsConvergence.components.sourceDiversity).toBe(tsSourceDiversity);
      expect(cjsConvergence.components.contradictionDensity).toBe(tsContradictionDensity);
      expect(cjsConvergence.blendedScore).toBe(tsEquivalentBlend.blendedScore);
      expect(cjsConvergence.graphScore).toBe(tsEquivalentBlend.graphScore);
    });
  }
});
