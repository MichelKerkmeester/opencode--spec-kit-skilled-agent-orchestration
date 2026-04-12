import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const coreModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
)) as {
  createGraph: () => { nodes: Map<string, Record<string, unknown>>; edges: Map<string, Record<string, unknown>> };
  insertEdge: (
    graph: ReturnType<typeof coreModule.createGraph>,
    source: string,
    target: string,
    relation: string,
    weight?: number,
    metadata?: Record<string, unknown>,
  ) => string | null;
  resetEdgeIdCounter: () => void;
};

const contradictionsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
)) as {
  scanContradictions: (
    graph: ReturnType<typeof coreModule.createGraph>,
    sessionId?: string,
  ) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: Record<string, unknown> }>;
  reportContradictions: (
    graph: ReturnType<typeof coreModule.createGraph>,
    sessionId?: string,
  ) => {
    total: number;
    pairs: Array<Record<string, unknown>>;
    byNode: Map<string, Array<Record<string, unknown>>>;
  };
  contradictionDensity: (
    graph: ReturnType<typeof coreModule.createGraph>,
    sessionId?: string,
  ) => number;
};

const SESSION_A = 'session-a';
const SESSION_B = 'session-b';

function seedNode(
  graph: ReturnType<typeof coreModule.createGraph>,
  id: string,
  sessionId: string,
  name: string,
): void {
  graph.nodes.set(id, { id, name, sessionId });
}

function insertContradiction(
  graph: ReturnType<typeof coreModule.createGraph>,
  source: string,
  target: string,
  sessionId: string,
  reason: string,
): string | null {
  return coreModule.insertEdge(graph, source, target, 'CONTRADICTS', 0.8, {
    sessionId,
    reason,
    evidence: `${sessionId}:${source}->${target}`,
  });
}

describe('coverage-graph-contradictions', () => {
  beforeEach(() => {
    coreModule.resetEdgeIdCounter();
  });

  it('scans contradictions only for the requested session', () => {
    const graph = coreModule.createGraph();

    seedNode(graph, 'claim-a-1', SESSION_A, 'Claim A 1');
    seedNode(graph, 'claim-a-2', SESSION_A, 'Claim A 2');
    seedNode(graph, 'claim-b-1', SESSION_B, 'Claim B 1');
    seedNode(graph, 'claim-b-2', SESSION_B, 'Claim B 2');

    insertContradiction(graph, 'claim-a-1', 'claim-a-2', SESSION_A, 'A contradiction');
    insertContradiction(graph, 'claim-b-1', 'claim-b-2', SESSION_B, 'B contradiction');

    expect(contradictionsModule.scanContradictions(graph, SESSION_A)).toEqual([
      expect.objectContaining({
        source: 'claim-a-1',
        target: 'claim-a-2',
        metadata: expect.objectContaining({
          reason: 'A contradiction',
        }),
      }),
    ]);
    expect(contradictionsModule.scanContradictions(graph, SESSION_B)).toEqual([
      expect.objectContaining({
        source: 'claim-b-1',
        target: 'claim-b-2',
        metadata: expect.objectContaining({
          reason: 'B contradiction',
        }),
      }),
    ]);
    expect(contradictionsModule.scanContradictions(graph)).toHaveLength(2);
  });

  it('reports contradiction details without leaking nodes across sessions', () => {
    const graph = coreModule.createGraph();

    seedNode(graph, 'claim-a-1', SESSION_A, 'Claim A 1');
    seedNode(graph, 'claim-a-2', SESSION_A, 'Claim A 2');
    seedNode(graph, 'claim-b-1', SESSION_B, 'Claim B 1');
    seedNode(graph, 'claim-b-2', SESSION_B, 'Claim B 2');

    insertContradiction(graph, 'claim-a-1', 'claim-a-2', SESSION_A, 'A contradiction');
    insertContradiction(graph, 'claim-b-1', 'claim-b-2', SESSION_B, 'B contradiction');

    const reportA = contradictionsModule.reportContradictions(graph, SESSION_A);
    const reportB = contradictionsModule.reportContradictions(graph, SESSION_B);

    expect(reportA.total).toBe(1);
    expect(reportA.pairs).toEqual([
      expect.objectContaining({
        source: expect.objectContaining({ id: 'claim-a-1', name: 'Claim A 1' }),
        target: expect.objectContaining({ id: 'claim-a-2', name: 'Claim A 2' }),
        reason: 'A contradiction',
        evidence: 'session-a:claim-a-1->claim-a-2',
      }),
    ]);
    expect([...reportA.byNode.keys()].sort()).toEqual(['claim-a-1', 'claim-a-2']);

    expect(reportB.total).toBe(1);
    expect(reportB.pairs).toEqual([
      expect.objectContaining({
        source: expect.objectContaining({ id: 'claim-b-1', name: 'Claim B 1' }),
        target: expect.objectContaining({ id: 'claim-b-2', name: 'Claim B 2' }),
        reason: 'B contradiction',
        evidence: 'session-b:claim-b-1->claim-b-2',
      }),
    ]);
    expect([...reportB.byNode.keys()].sort()).toEqual(['claim-b-1', 'claim-b-2']);
  });

  it('computes contradiction density from the session-scoped subgraph', () => {
    const graph = coreModule.createGraph();

    seedNode(graph, 'claim-a-1', SESSION_A, 'Claim A 1');
    seedNode(graph, 'claim-a-2', SESSION_A, 'Claim A 2');
    seedNode(graph, 'finding-a-1', SESSION_A, 'Finding A 1');
    seedNode(graph, 'claim-b-1', SESSION_B, 'Claim B 1');
    seedNode(graph, 'claim-b-2', SESSION_B, 'Claim B 2');
    seedNode(graph, 'finding-b-1', SESSION_B, 'Finding B 1');
    seedNode(graph, 'finding-b-2', SESSION_B, 'Finding B 2');

    insertContradiction(graph, 'claim-a-1', 'claim-a-2', SESSION_A, 'A contradiction');
    insertContradiction(graph, 'claim-b-1', 'claim-b-2', SESSION_B, 'B contradiction');

    expect(contradictionsModule.contradictionDensity(graph, SESSION_A)).toBeCloseTo(2 / 3, 5);
    expect(contradictionsModule.contradictionDensity(graph, SESSION_B)).toBeCloseTo(2 / 4, 5);
    expect(contradictionsModule.contradictionDensity(graph)).toBeCloseTo(4 / 7, 5);
  });
});
