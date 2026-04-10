import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  VALID_RELATIONS,
  RESEARCH_WEIGHTS,
  clampWeight as clampDbWeight,
  closeDb,
  getEdge,
  getEdges,
  getNodes,
  initDb,
  upsertEdge,
  upsertNode,
  type CoverageEdge,
  type CoverageNode,
  type Namespace,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';
import {
  findContradictions,
  findCoverageGaps,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-query.js';
import {
  computeNodeSignals,
  computeResearchSignals,
  computeReviewSignals,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-signals.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

type CjsGraph = { nodes: Map<string, Record<string, unknown>>; edges: Map<string, Record<string, unknown>> };

const coreModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
)) as {
  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  createGraph: () => CjsGraph;
  insertEdge: (
    graph: CjsGraph,
    source: string,
    target: string,
    relation: string,
    weight?: number,
    metadata?: Record<string, unknown>,
  ) => string | null;
  clampWeight: (weight: number) => number | null;
  resetEdgeIdCounter: () => void;
};

const cjsSignalsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
)) as {
  computeDegree: (graph: CjsGraph, nodeId: string) => { inDegree: number; outDegree: number; total: number };
  computeAllDepths: (graph: CjsGraph) => Map<string, number>;
};

const cjsContradictionsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
)) as {
  scanContradictions: (graph: CjsGraph) => Array<{ edgeId: string; source: string; target: string }>;
  reportContradictions: (graph: CjsGraph) => { total: number; pairs: unknown[]; byNode: Map<string, unknown[]> };
  contradictionDensity: (graph: CjsGraph) => number;
};

const cjsConvergenceModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
)) as {
  computeQuestionCoverage: (graph: CjsGraph) => number;
  evaluateGraphGates: (graph: CjsGraph) => {
    sourceDiversity: { pass: boolean; value: number; threshold: number };
    evidenceDepth: { pass: boolean; value: number; threshold: number };
    allPass: boolean;
  };
};

function cjsNodeWeightSums(graph: CjsGraph): Map<string, number> {
  const sums = new Map<string, number>();

  for (const edge of graph.edges.values()) {
    const weight = Number(edge.weight ?? 0);
    const source = String(edge.source);
    const target = String(edge.target);
    sums.set(source, (sums.get(source) ?? 0) + weight);
    sums.set(target, (sums.get(target) ?? 0) + weight);
  }

  return sums;
}

function makeResearchNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
  return {
    id,
    specFolder,
    loopType: 'research',
    sessionId,
    kind,
    name,
    metadata,
  };
}

function makeReviewNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
  return {
    id,
    specFolder,
    loopType: 'review',
    sessionId,
    kind,
    name,
    metadata,
  };
}

function makeEdge(edge: CoverageEdge): CoverageEdge {
  return edge;
}

describe('coverage-graph cross-layer integration', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-cross-layer-'));
    initDb(tempDir);
    coreModule.resetEdgeIdCounter();
  });

  afterEach(() => {
    try {
      closeDb();
    } catch {
      // best-effort cleanup for tests that intentionally close the DB
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('keeps research relation names aligned between CJS weights and TS valid relations', () => {
    const cjsRelations = Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS).sort();
    const tsRelations = [...VALID_RELATIONS.research].sort();
    const tsWeightRelations = Object.keys(RESEARCH_WEIGHTS).sort();

    expect(cjsRelations).toEqual(tsRelations);
    expect(cjsRelations).toEqual(tsWeightRelations);
  });

  it('keeps clamping bounds consistent at 0.0-2.0 in both layers', () => {
    expect(coreModule.clampWeight(-10)).toBe(0.0);
    expect(coreModule.clampWeight(10)).toBe(2.0);
    expect(clampDbWeight(-10)).toBe(0.0);
    expect(clampDbWeight(10)).toBe(2.0);

    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'finding-clamp', 'FINDING', 'Clamp finding'));
    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'question-clamp', 'QUESTION', 'Clamp question'));

    const edgeId = upsertEdge(makeEdge({
      id: 'edge-clamp',
      specFolder: 'spec-clamp',
      loopType: 'research',
      sessionId: 'session-clamp',
      sourceId: 'finding-clamp',
      targetId: 'question-clamp',
      relation: 'ANSWERS',
      weight: 9.9,
    }));

    expect(edgeId).toBe('edge-clamp');
    expect(getEdge('edge-clamp')?.weight).toBe(2.0);
  });

  it('handles empty graphs without errors in both layers', () => {
    const graph = coreModule.createGraph();
    const emptyResearchNs: Namespace = {
      specFolder: 'spec-empty',
      loopType: 'research',
      sessionId: 'session-empty',
    };

    expect(cjsSignalsModule.computeAllDepths(graph).size).toBe(0);
    expect(cjsContradictionsModule.scanContradictions(graph)).toEqual([]);
    expect(cjsContradictionsModule.reportContradictions(graph).total).toBe(0);
    expect(cjsContradictionsModule.contradictionDensity(graph)).toBe(0);
    expect(cjsConvergenceModule.evaluateGraphGates(graph)).toMatchObject({
      sourceDiversity: { pass: false, value: 0, threshold: 0.4 },
      evidenceDepth: { pass: false, value: 0, threshold: 1.5 },
      allPass: false,
    });

    expect(getNodes(emptyResearchNs)).toEqual([]);
    expect(getEdges(emptyResearchNs)).toEqual([]);
    expect(findCoverageGaps(emptyResearchNs)).toEqual([]);
    expect(findContradictions(emptyResearchNs)).toEqual([]);
    expect(computeNodeSignals(emptyResearchNs)).toEqual([]);
    expect(computeResearchSignals(emptyResearchNs)).toEqual({
      questionCoverage: 0,
      claimVerificationRate: 0,
      contradictionDensity: 0,
      sourceDiversity: 0,
      evidenceDepth: 0,
    });
  });

  it('rejects self-loops in both layers', () => {
    const graph = coreModule.createGraph();
    const cjsEdgeId = coreModule.insertEdge(graph, 'loop-node', 'loop-node', 'CITES', 1.0);

    upsertNode(makeResearchNode('spec-loop', 'session-loop', 'loop-node', 'SOURCE', 'Loop source'));
    const tsEdgeId = upsertEdge(makeEdge({
      id: 'edge-self-loop',
      specFolder: 'spec-loop',
      loopType: 'research',
      sessionId: 'session-loop',
      sourceId: 'loop-node',
      targetId: 'loop-node',
      relation: 'CITES',
      weight: 1.0,
    }));

    expect(cjsEdgeId).toBeNull();
    expect(graph.edges.size).toBe(0);
    expect(tsEdgeId).toBeNull();
    expect(getEdges({ specFolder: 'spec-loop', loopType: 'research', sessionId: 'session-loop' })).toEqual([]);
  });

  it('produces comparable structural and research signals for the same graph', () => {
    const specFolder = 'spec-signals';
    const sessionId = 'session-signals';
    const ns: Namespace = { specFolder, loopType: 'research', sessionId };
    const graph = coreModule.createGraph();

    graph.nodes.set('question-1', { id: 'question-1', type: 'question' });
    graph.nodes.set('finding-1', { id: 'finding-1', type: 'finding' });
    graph.nodes.set('finding-2', { id: 'finding-2', type: 'finding' });
    graph.nodes.set('source-1', { id: 'source-1', type: 'source' });
    graph.nodes.set('source-2', { id: 'source-2', type: 'source' });

    const cjsAnswer1 = coreModule.insertEdge(graph, 'finding-1', 'question-1', 'ANSWERS', 1.3);
    const cjsAnswer2 = coreModule.insertEdge(graph, 'finding-2', 'question-1', 'ANSWERS', 1.0);
    const cjsCite1 = coreModule.insertEdge(graph, 'finding-1', 'source-1', 'CITES', 0.9);
    const cjsCite2 = coreModule.insertEdge(graph, 'finding-2', 'source-2', 'CITES', 1.1);
    const cjsContradiction = coreModule.insertEdge(graph, 'finding-1', 'finding-2', 'CONTRADICTS', 0.8);

    expect([cjsAnswer1, cjsAnswer2, cjsCite1, cjsCite2, cjsContradiction].every(Boolean)).toBe(true);

    const nodes: CoverageNode[] = [
      makeResearchNode(specFolder, sessionId, 'question-1', 'QUESTION', 'Question 1'),
      makeResearchNode(specFolder, sessionId, 'finding-1', 'FINDING', 'Finding 1'),
      makeResearchNode(specFolder, sessionId, 'finding-2', 'FINDING', 'Finding 2'),
      makeResearchNode(specFolder, sessionId, 'source-1', 'SOURCE', 'Source 1', { quality_class: 'primary' }),
      makeResearchNode(specFolder, sessionId, 'source-2', 'SOURCE', 'Source 2', { quality_class: 'secondary' }),
    ];

    const edges: CoverageEdge[] = [
      makeEdge({
        id: 'edge-answer-1',
        specFolder,
        loopType: 'research',
        sessionId,
        sourceId: 'finding-1',
        targetId: 'question-1',
        relation: 'ANSWERS',
        weight: 1.3,
      }),
      makeEdge({
        id: 'edge-answer-2',
        specFolder,
        loopType: 'research',
        sessionId,
        sourceId: 'finding-2',
        targetId: 'question-1',
        relation: 'ANSWERS',
        weight: 1.0,
      }),
      makeEdge({
        id: 'edge-cite-1',
        specFolder,
        loopType: 'research',
        sessionId,
        sourceId: 'finding-1',
        targetId: 'source-1',
        relation: 'CITES',
        weight: 0.9,
      }),
      makeEdge({
        id: 'edge-cite-2',
        specFolder,
        loopType: 'research',
        sessionId,
        sourceId: 'finding-2',
        targetId: 'source-2',
        relation: 'CITES',
        weight: 1.1,
      }),
      makeEdge({
        id: 'edge-contradiction-1',
        specFolder,
        loopType: 'research',
        sessionId,
        sourceId: 'finding-1',
        targetId: 'finding-2',
        relation: 'CONTRADICTS',
        weight: 0.8,
      }),
    ];

    for (const node of nodes) upsertNode(node);
    for (const edge of edges) upsertEdge(edge);

    const cjsDepths = cjsSignalsModule.computeAllDepths(graph);
    const cjsWeights = cjsNodeWeightSums(graph);
    const tsSignals = new Map(computeNodeSignals(ns).map(signal => [signal.nodeId, signal]));

    for (const nodeId of graph.nodes.keys()) {
      const cjsDegree = cjsSignalsModule.computeDegree(graph, nodeId);
      const tsSignal = tsSignals.get(nodeId);

      expect(tsSignal).toBeDefined();
      expect(tsSignal).toMatchObject({
        degree: cjsDegree.total,
        inDegree: cjsDegree.inDegree,
        outDegree: cjsDegree.outDegree,
        depth: cjsDepths.get(nodeId) ?? 0,
        weightSum: cjsWeights.get(nodeId) ?? 0,
      });
    }

    expect(computeResearchSignals(ns).questionCoverage).toBe(cjsConvergenceModule.computeQuestionCoverage(graph));

    const cjsContradictions = cjsContradictionsModule.scanContradictions(graph)
      .map(edge => ({ source: edge.source, target: edge.target }))
      .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
    const tsContradictions = findContradictions(ns)
      .map(edge => ({ source: edge.sourceId, target: edge.targetId }))
      .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));

    expect(tsContradictions).toEqual(cjsContradictions);
  });

  it('keeps research data invisible to review queries in the same spec folder', () => {
    const specFolder = 'spec-isolation';
    const sessionId = 'session-isolation';
    const researchNs: Namespace = { specFolder, loopType: 'research', sessionId };
    const reviewNs: Namespace = { specFolder, loopType: 'review', sessionId };

    upsertNode(makeResearchNode(specFolder, sessionId, 'research-question', 'QUESTION', 'Research question'));
    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-a', 'FINDING', 'Research finding A'));
    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-b', 'FINDING', 'Research finding B'));
    upsertEdge(makeEdge({
      id: 'research-contradiction',
      specFolder,
      loopType: 'research',
      sessionId,
      sourceId: 'research-finding-a',
      targetId: 'research-finding-b',
      relation: 'CONTRADICTS',
      weight: 0.8,
    }));

    upsertNode(makeReviewNode(specFolder, sessionId, 'review-dimension', 'DIMENSION', 'Correctness'));
    upsertNode(makeReviewNode(specFolder, sessionId, 'review-file', 'FILE', 'coverage-graph.ts', { hotspot_score: 2 }));
    upsertNode(makeReviewNode(specFolder, sessionId, 'review-finding', 'FINDING', 'Review finding'));
    upsertEdge(makeEdge({
      id: 'review-cover',
      specFolder,
      loopType: 'review',
      sessionId,
      sourceId: 'review-dimension',
      targetId: 'review-file',
      relation: 'COVERS',
      weight: 1.3,
    }));

    expect(getNodes(researchNs).map(node => node.id).sort()).toEqual([
      'research-finding-a',
      'research-finding-b',
      'research-question',
    ]);
    expect(getNodes(reviewNs).map(node => node.id).sort()).toEqual([
      'review-dimension',
      'review-file',
      'review-finding',
    ]);

    expect(findContradictions(reviewNs)).toEqual([]);
    expect(findCoverageGaps(reviewNs)).toEqual([
      {
        nodeId: 'review-file',
        kind: 'FILE',
        name: 'coverage-graph.ts',
        reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
      },
    ]);
    expect(computeReviewSignals(reviewNs)).toMatchObject({
      dimensionCoverage: 1,
      findingStability: 1,
      evidenceDensity: 0,
      hotspotSaturation: 0,
    });

    expect(findContradictions(researchNs)).toHaveLength(1);
    expect(computeResearchSignals(researchNs).contradictionDensity).toBe(1);
  });
});
