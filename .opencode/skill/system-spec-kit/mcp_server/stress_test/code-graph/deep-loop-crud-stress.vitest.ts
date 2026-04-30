import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  createSnapshot,
  initDb,
  type LoopType,
} from '../../lib/coverage-graph/coverage-graph-db.js';
import { handleCoverageGraphQuery } from '../../handlers/coverage-graph/query.js';
import { handleCoverageGraphStatus } from '../../handlers/coverage-graph/status.js';
import { handleCoverageGraphUpsert } from '../../handlers/coverage-graph/upsert.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface ParsedPayload {
  readonly status: string;
  readonly data?: Record<string, unknown>;
  readonly error?: string;
}

const tempDirs: string[] = [];
let tempRoot: string;

function parseResponse(response: HandlerResponse): ParsedPayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ParsedPayload;
}

function ns(sessionId: string, loopType: LoopType = 'research') {
  return {
    specFolder: 'specs/cg-009-010-011-stress',
    loopType,
    sessionId,
  };
}

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), 'cg-deep-loop-crud-'));
  tempDirs.push(tempRoot);
  initDb(tempRoot);
});

afterEach(() => {
  closeDb();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('cg-009,010,011 — deep-loop CRUD', () => {
  it('cg-011 upserts a large research graph and rejects self-loops without aborting the batch', async () => {
    const namespace = ns('research-upsert-large');
    const nodes = [
      ...Array.from({ length: 80 }, (_, index) => ({
        id: `q-${index}`,
        kind: 'QUESTION',
        name: `Question ${index}`,
        iteration: index % 8,
      })),
      ...Array.from({ length: 80 }, (_, index) => ({
        id: `f-${index}`,
        kind: 'FINDING',
        name: `Finding ${index}`,
        iteration: index % 8,
      })),
    ];
    const edges = [
      ...Array.from({ length: 80 }, (_, index) => ({
        id: `answers-${index}`,
        sourceId: `f-${index}`,
        targetId: `q-${index}`,
        relation: 'ANSWERS',
        weight: 4,
      })),
      { id: 'self-loop', sourceId: 'q-1', targetId: 'q-1', relation: 'SUPPORTS', weight: 1 },
    ];

    const parsed = parseResponse(await handleCoverageGraphUpsert({ ...namespace, nodes, edges }));

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      insertedNodes: 160,
      insertedEdges: 80,
      rejectedEdges: 0,
      rejectedSelfLoops: ['self-loop'],
    });
  });

  it('cg-011 rejects empty batches and invalid review relations with explicit validation details', async () => {
    const empty = parseResponse(await handleCoverageGraphUpsert({ ...ns('empty-batch'), nodes: [], edges: [] }));
    expect(empty.status).toBe('error');
    expect(empty.error).toMatch(/At least one node or edge/);

    const namespace = ns('invalid-review-relation', 'review');
    const invalid = parseResponse(await handleCoverageGraphUpsert({
      ...namespace,
      nodes: [
        { id: 'dim-1', kind: 'DIMENSION', name: 'Security' },
        { id: 'file-1', kind: 'FILE', name: 'src/security.ts' },
      ],
      edges: [
        { id: 'bad-relation', sourceId: 'dim-1', targetId: 'file-1', relation: 'ANSWERS' },
      ],
    }));

    expect(invalid.status).toBe('ok');
    expect(invalid.data).toMatchObject({
      insertedNodes: 2,
      insertedEdges: 0,
      rejectedEdges: 0,
    });
    expect(invalid.data?.validationErrors).toEqual([
      expect.stringContaining('Invalid relation "ANSWERS"'),
    ]);
  });

  it('cg-009 returns uncovered question and unverified claim query results from the same session scope', async () => {
    const namespace = ns('research-query-session');
    await handleCoverageGraphUpsert({
      ...namespace,
      nodes: [
        { id: 'q-covered', kind: 'QUESTION', name: 'Covered question' },
        { id: 'q-open', kind: 'QUESTION', name: 'Open question' },
        { id: 'f-1', kind: 'FINDING', name: 'Finding' },
        { id: 'claim-1', kind: 'CLAIM', name: 'Unverified claim', metadata: { verification_status: 'pending' } },
        { id: 'claim-2', kind: 'CLAIM', name: 'Verified claim', metadata: { verification_status: 'verified' } },
      ],
      edges: [
        { id: 'answers-1', sourceId: 'f-1', targetId: 'q-covered', relation: 'ANSWERS' },
      ],
    });

    const gaps = parseResponse(await handleCoverageGraphQuery({
      ...namespace,
      queryType: 'uncovered_questions',
    }));
    const claims = parseResponse(await handleCoverageGraphQuery({
      ...namespace,
      queryType: 'unverified_claims',
    }));

    expect(gaps.status).toBe('ok');
    expect(gaps.data).toMatchObject({
      queryType: 'uncovered_questions',
      totalGaps: 1,
    });
    expect(gaps.data?.gaps).toEqual([
      expect.objectContaining({ nodeId: 'q-open', reason: expect.stringContaining('No incoming') }),
    ]);

    expect(claims.status).toBe('ok');
    expect(claims.data).toMatchObject({
      queryType: 'unverified_claims',
      totalUnverified: 1,
    });
    expect(claims.data?.claims).toEqual([
      expect.objectContaining({ id: 'claim-1', name: 'Unverified claim' }),
    ]);
  });

  it('cg-009 caps hot-node query limits and rejects cross-loop query types cleanly', async () => {
    const namespace = ns('hot-node-limit');
    await handleCoverageGraphUpsert({
      ...namespace,
      nodes: [
        { id: 'q-1', kind: 'QUESTION', name: 'Question' },
        ...Array.from({ length: 25 }, (_, index) => ({
          id: `f-${index}`,
          kind: 'FINDING',
          name: `Finding ${index}`,
        })),
      ],
      edges: Array.from({ length: 25 }, (_, index) => ({
        id: `supports-${index}`,
        sourceId: `f-${index}`,
        targetId: 'q-1',
        relation: 'SUPPORTS',
      })),
    });

    const hotNodes = parseResponse(await handleCoverageGraphQuery({
      ...namespace,
      queryType: 'hot_nodes',
      limit: 1_000,
    }));
    const invalid = parseResponse(await handleCoverageGraphQuery({
      ...ns('review-invalid-query', 'review'),
      queryType: 'uncovered_questions',
    }));

    expect(hotNodes.status).toBe('ok');
    expect((hotNodes.data?.hotNodes as unknown[])).toHaveLength(26);
    expect(hotNodes.data?.totalReturned).toBe(26);
    expect(invalid.status).toBe('error');
    expect(invalid.error).toContain('coverage_gaps for review graphs');
  });

  it('cg-010 reports empty session status with null signals and stable namespace metadata', async () => {
    const namespace = ns('empty-status');

    const parsed = parseResponse(await handleCoverageGraphStatus(namespace));

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      namespace,
      scopeMode: 'session',
      totalNodes: 0,
      totalEdges: 0,
      nodesByKind: {},
      edgesByRelation: {},
      lastIteration: null,
      signals: null,
      momentum: null,
    });
  });

  it('cg-010 reports populated review metrics without leaking rows from another session', async () => {
    const review = ns('review-status-session', 'review');
    const other = ns('review-status-other-session', 'review');
    await handleCoverageGraphUpsert({
      ...review,
      nodes: [
        { id: 'dim-1', kind: 'DIMENSION', name: 'Security', iteration: 1 },
        { id: 'file-1', kind: 'FILE', name: 'src/security.ts', iteration: 1 },
        { id: 'finding-1', kind: 'FINDING', name: 'P0 finding', iteration: 2, metadata: { severity: 'P0', status: 'resolved' } },
        { id: 'evidence-1', kind: 'EVIDENCE', name: 'Proof', iteration: 2 },
      ],
      edges: [
        { id: 'covers-1', sourceId: 'dim-1', targetId: 'file-1', relation: 'COVERS' },
        { id: 'evidence-1', sourceId: 'evidence-1', targetId: 'finding-1', relation: 'EVIDENCE_FOR' },
      ],
    });
    await handleCoverageGraphUpsert({
      ...other,
      nodes: [{ id: 'dim-other', kind: 'DIMENSION', name: 'Other dimension' }],
    });
    createSnapshot({
      ...review,
      iteration: 2,
      metrics: { status: 'populated' },
      nodeCount: 4,
      edgeCount: 2,
    });

    const parsed = parseResponse(await handleCoverageGraphStatus(review));

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      totalNodes: 4,
      totalEdges: 2,
      nodesByKind: {
        DIMENSION: 1,
        FILE: 1,
        FINDING: 1,
        EVIDENCE: 1,
      },
      edgesByRelation: {
        COVERS: 1,
        EVIDENCE_FOR: 1,
      },
      lastIteration: 2,
    });
    expect(parsed.data?.signals).toEqual(expect.any(Object));
    expect(parsed.data?.momentum).toEqual(expect.any(Object));
  });
});
