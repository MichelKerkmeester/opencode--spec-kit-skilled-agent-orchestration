import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import {
  batchUpsert,
  closeDb,
  initDb,
  type CoverageEdge,
  type CoverageNode,
  type LoopType,
  type NodeKind,
  type Relation,
} from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  handleCoverageGraphConvergence,
  type ConvergenceDecision,
} from '../../handlers/coverage-graph/convergence.js';

interface HandlerResponsePayload {
  readonly status: string;
  readonly data?: {
    readonly decision?: ConvergenceDecision;
    readonly reason?: string;
    readonly nodeCount?: number;
    readonly blockers?: Array<{ readonly type?: string; readonly severity?: string }>;
    readonly signals?: Record<string, unknown>;
  };
  readonly error?: string;
}

interface GraphFixture {
  readonly specFolder: string;
  readonly loopType: LoopType;
  readonly sessionId: string;
  readonly nodes: CoverageNode[];
  readonly edges: CoverageEdge[];
}

describe('cg-012 — Deep-loop graph convergence', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'stress-cg-012-'));
    initDb(tmpDir);
  });

  afterEach(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function parseResponse(response: { content: Array<{ type: string; text: string }> }): HandlerResponsePayload {
    return JSON.parse(response.content[0]?.text ?? '{}') as HandlerResponsePayload;
  }

  function node(
    fixture: Pick<GraphFixture, 'specFolder' | 'loopType' | 'sessionId'>,
    id: string,
    kind: NodeKind,
    metadata?: Record<string, unknown>,
  ): CoverageNode {
    return {
      id,
      specFolder: fixture.specFolder,
      loopType: fixture.loopType,
      sessionId: fixture.sessionId,
      kind,
      name: id,
      metadata,
    };
  }

  function edge(
    fixture: Pick<GraphFixture, 'specFolder' | 'loopType' | 'sessionId'>,
    id: string,
    sourceId: string,
    targetId: string,
    relation: Relation,
  ): CoverageEdge {
    return {
      id,
      specFolder: fixture.specFolder,
      loopType: fixture.loopType,
      sessionId: fixture.sessionId,
      sourceId,
      targetId,
      relation,
      weight: 1,
    };
  }

  function writeGraph(fixture: GraphFixture): void {
    const result = batchUpsert(fixture.nodes, fixture.edges);

    expect(result.insertedNodes).toBe(fixture.nodes.length);
    expect(result.insertedEdges).toBe(fixture.edges.length);
    expect(result.rejectedEdges).toBe(0);
  }

  function convergedResearchFixture(sessionId: string): GraphFixture {
    const fixture = {
      specFolder: 'specs/cg-012-convergence',
      loopType: 'research' as const,
      sessionId,
    };
    const nodes = [
      node(fixture, 'q-1', 'QUESTION'),
      node(fixture, 'f-1', 'FINDING'),
      node(fixture, 'f-2', 'FINDING'),
      node(fixture, 's-1', 'SOURCE', { quality_class: 'primary' }),
      node(fixture, 's-2', 'SOURCE', { quality_class: 'secondary' }),
      node(fixture, 'c-1', 'CLAIM', { verification_status: 'verified' }),
    ];
    const edges = [
      edge(fixture, 'answers-1', 'f-1', 'q-1', 'ANSWERS'),
      edge(fixture, 'answers-2', 'f-2', 'q-1', 'ANSWERS'),
      edge(fixture, 'cites-1', 'f-1', 's-1', 'CITES'),
      edge(fixture, 'cites-2', 'f-2', 's-2', 'CITES'),
    ];

    return { ...fixture, nodes, edges };
  }

  it('returns a convergence decision under 500ms with 5000+ nodes', async () => {
    const fixture = {
      specFolder: 'specs/cg-012-convergence',
      loopType: 'research' as const,
      sessionId: 'large-node-saturation',
    };
    const nodes = Array.from({ length: 5_001 }, (_, index) =>
      node(fixture, `source-${index}`, 'SOURCE', { quality_class: `class-${index % 3}` }),
    );
    writeGraph({ ...fixture, nodes, edges: [] });

    const startedAt = performance.now();
    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder: fixture.specFolder,
      loopType: fixture.loopType,
      sessionId: fixture.sessionId,
    }));
    const elapsedMs = performance.now() - startedAt;

    expect(response.status).toBe('ok');
    expect(response.data?.nodeCount).toBe(5_001);
    expect(response.data?.decision).toMatch(/^(CONTINUE|STOP_ALLOWED|STOP_BLOCKED)$/);
    expect(response.data?.reason).toContain('STOP is blocked');
    expect(elapsedMs).toBeLessThan(500);
  });

  it('blocks stop when contradictory research edges exceed the convergence threshold', async () => {
    const fixture = convergedResearchFixture('contradiction-block');
    writeGraph({
      ...fixture,
      edges: [
        ...fixture.edges,
        edge(fixture, 'contradiction-1', 'f-1', 'f-2', 'CONTRADICTS'),
      ],
    });

    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder: fixture.specFolder,
      loopType: fixture.loopType,
      sessionId: fixture.sessionId,
    }));
    const blockers = response.data?.blockers ?? [];

    expect(response.status).toBe('ok');
    expect(response.data?.decision).toBe('STOP_BLOCKED');
    expect(response.data?.reason).toContain('high_contradiction_density');
    expect(blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'high_contradiction_density', severity: 'blocking' }),
      ]),
    );
  });

  it('keeps returning a reasoned envelope when non-critical nodes lack provenance metadata', async () => {
    const fixture = convergedResearchFixture('missing-provenance-envelope');
    writeGraph({
      ...fixture,
      nodes: [
        ...fixture.nodes,
        node(fixture, 'orphan-source-without-metadata', 'SOURCE'),
        node(fixture, 'orphan-finding-without-citations', 'FINDING'),
      ],
    });

    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder: fixture.specFolder,
      loopType: fixture.loopType,
      sessionId: fixture.sessionId,
    }));

    expect(response.status).toBe('ok');
    expect(['CONTINUE', 'STOP_ALLOWED']).toContain(response.data?.decision);
    expect(response.data?.reason).toEqual(expect.any(String));
    expect(response.data?.signals).toMatchObject({
      questionCoverage: 1,
      claimVerificationRate: 1,
      contradictionDensity: 0,
    });
    expect(response.error).toBeUndefined();
  });
});
