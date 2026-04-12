import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  getEdge,
  getEdges,
  getEdgesFrom,
  getNode,
  getNodes,
  initDb,
  upsertEdge,
  upsertNode,
  type CoverageEdge,
  type CoverageNode,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';
import { handleCoverageGraphQuery } from '../../mcp_server/handlers/coverage-graph/query.js';
import { handleCoverageGraphStatus } from '../../mcp_server/handlers/coverage-graph/status.js';
import { handleCoverageGraphConvergence } from '../../mcp_server/handlers/coverage-graph/convergence.js';

const SPEC_FOLDER = 'specs/042-session-scope';
const LOOP_TYPE = 'research';
const SESSION_A = 'session-a';
const SESSION_B = 'session-b';

function makeNode(id: string, sessionId: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
  return {
    id,
    specFolder: SPEC_FOLDER,
    loopType: LOOP_TYPE,
    sessionId,
    kind,
    name,
    metadata,
  };
}

function makeEdge(id: string, sessionId: string, sourceId: string, targetId: string, relation: CoverageEdge['relation']): CoverageEdge {
  return {
    id,
    specFolder: SPEC_FOLDER,
    loopType: LOOP_TYPE,
    sessionId,
    sourceId,
    targetId,
    relation,
    weight: 1,
  };
}

function parseHandlerData(
  response: { content: Array<{ text: string }> },
): Record<string, any> {
  return JSON.parse(response.content[0]?.text ?? '{}').data ?? {};
}

function parseHandlerError(response: { content: Array<{ text: string }> }): string {
  return JSON.parse(response.content[0]?.text ?? '{}').error ?? '';
}

describe('coverage graph session isolation', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-session-isolation-'));
    initDb(tempDir);

    const sessionANodes: CoverageNode[] = [
      makeNode('q-a', SESSION_A, 'QUESTION', 'Question A'),
      makeNode('f-a-1', SESSION_A, 'FINDING', 'Finding A1'),
      makeNode('f-a-2', SESSION_A, 'FINDING', 'Finding A2'),
      makeNode('s-a-1', SESSION_A, 'SOURCE', 'Source A1', { quality_class: 'primary' }),
      makeNode('s-a-2', SESSION_A, 'SOURCE', 'Source A2', { quality_class: 'secondary' }),
    ];

    const sessionBNodes: CoverageNode[] = [
      makeNode('q-b', SESSION_B, 'QUESTION', 'Question B'),
      makeNode('f-b-1', SESSION_B, 'FINDING', 'Finding B1'),
    ];

    const sessionAEdges: CoverageEdge[] = [
      makeEdge('a-answers-1', SESSION_A, 'f-a-1', 'q-a', 'ANSWERS'),
      makeEdge('a-answers-2', SESSION_A, 'f-a-2', 'q-a', 'ANSWERS'),
      makeEdge('a-cites-1', SESSION_A, 'f-a-1', 's-a-1', 'CITES'),
      makeEdge('a-cites-2', SESSION_A, 'f-a-2', 's-a-2', 'CITES'),
    ];

    const sessionBEdges: CoverageEdge[] = [
      makeEdge('b-answers-1', SESSION_B, 'f-b-1', 'q-b', 'ANSWERS'),
    ];

    for (const node of [...sessionANodes, ...sessionBNodes]) {
      upsertNode(node);
    }

    for (const edge of [...sessionAEdges, ...sessionBEdges]) {
      upsertEdge(edge);
    }
  });

  afterEach(() => {
    try {
      closeDb();
    } catch {
      // best effort cleanup
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns only the requested session nodes when sessionId is provided', () => {
    const sessionNodes = getNodes({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
      sessionId: SESSION_A,
    });

    expect(sessionNodes.map(node => node.id).sort()).toEqual([
      'f-a-1',
      'f-a-2',
      'q-a',
      's-a-1',
      's-a-2',
    ]);

    const aggregateNodes = getNodes({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    });

    expect(aggregateNodes.map(node => node.id).sort()).toEqual([
      'f-a-1',
      'f-a-2',
      'f-b-1',
      'q-a',
      'q-b',
      's-a-1',
      's-a-2',
    ]);
  });

  it('returns only the requested session edges when sessionId is provided', () => {
    const sessionEdges = getEdges({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
      sessionId: SESSION_A,
    });

    expect(sessionEdges.map(edge => edge.id).sort()).toEqual([
      'a-answers-1',
      'a-answers-2',
      'a-cites-1',
      'a-cites-2',
    ]);

    const aggregateEdges = getEdges({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    });

    expect(aggregateEdges.map(edge => edge.id).sort()).toEqual([
      'a-answers-1',
      'a-answers-2',
      'a-cites-1',
      'a-cites-2',
      'b-answers-1',
    ]);
  });

  it('computes convergence from the session-scoped subset', async () => {
    const scopedData = parseHandlerData(await handleCoverageGraphConvergence({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
      sessionId: SESSION_A,
    }));

    expect(scopedData.namespace).toMatchObject({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
      sessionId: SESSION_A,
    });
    expect(scopedData.scopeMode).toBe('session');
    expect(scopedData.nodeCount).toBe(5);
    expect(scopedData.edgeCount).toBe(4);
    expect(scopedData.signals.questionCoverage).toBe(1);
    expect(scopedData.signals.sourceDiversity).toBe(2);
  });

  it('requires sessionId for public coverage graph read handlers', async () => {
    const queryError = parseHandlerError(await handleCoverageGraphQuery({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
      queryType: 'coverage_gaps',
    } as any));
    const statusError = parseHandlerError(await handleCoverageGraphStatus({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    } as any));
    const convergenceError = parseHandlerError(await handleCoverageGraphConvergence({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    } as any));

    expect(queryError).toContain('sessionId is required');
    expect(statusError).toContain('sessionId is required');
    expect(convergenceError).toContain('sessionId is required');
  });
});

// ───────────────────────────────────────────────────────────────
// REQ-028 (F004, F005 in the 042 closing audit): shared-ID
// collision regression. Two sessions intentionally reuse the same
// logical node and edge IDs, upsert independently, and the DB must
// keep them as disjoint rows — an upsert in session B must never
// overwrite the matching row in session A. The earlier suite only
// exercised filtered reads over disjoint fixtures, so it would have
// passed against the broken v1 schema too. This suite fails before
// the composite-key migration and passes after.
// ───────────────────────────────────────────────────────────────
describe('coverage graph session isolation — shared-ID collisions', () => {
  const SHARED_SPEC = 'specs/042-session-collision';
  const SHARED_LOOP_TYPE: CoverageNode['loopType'] = 'research';
  const SESSION_X = 'session-x';
  const SESSION_Y = 'session-y';

  const nsX = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_X };
  const nsY = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_Y };

  function collisionNode(sessionId: string, id: string, name: string): CoverageNode {
    return {
      id,
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId,
      kind: 'QUESTION',
      name,
    };
  }

  function collisionTypedNode(
    sessionId: string,
    id: string,
    kind: CoverageNode['kind'],
    name: string,
    metadata?: Record<string, unknown>,
  ): CoverageNode {
    return {
      id,
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId,
      kind,
      name,
      metadata,
    };
  }

  function collisionEdge(sessionId: string, id: string, sourceId: string, targetId: string): CoverageEdge {
    return {
      id,
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId,
      sourceId,
      targetId,
      relation: 'ANSWERS',
      weight: 1,
    };
  }

  function collisionTypedEdge(
    sessionId: string,
    id: string,
    sourceId: string,
    targetId: string,
    relation: CoverageEdge['relation'],
  ): CoverageEdge {
    return {
      id,
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId,
      sourceId,
      targetId,
      relation,
      weight: 1,
    };
  }

  let tempDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-collision-'));
    initDb(tempDir);
  });

  afterEach(() => {
    try {
      closeDb();
    } catch {
      // best effort cleanup
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('keeps session rows disjoint when two sessions upsert the same node id', () => {
    // Session X writes "q-shared" first with one name.
    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X text'));
    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
    expect(getNode(nsY, 'q-shared')).toBeNull();

    // Session Y upserts the same logical id with a different name.
    // Under the v1 bare-`id` primary key this overwrote session X's row;
    // under v2 it must create an independent session-Y row.
    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y text'));

    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y text');

    const allSessionX = getNodes(nsX).map((n) => n.id);
    const allSessionY = getNodes(nsY).map((n) => n.id);
    expect(allSessionX).toEqual(['q-shared']);
    expect(allSessionY).toEqual(['q-shared']);

    const aggregate = getNodes({ specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE });
    // Two distinct rows even though the logical id is identical.
    expect(aggregate.length).toBe(2);
  });

  it('keeps session rows disjoint when two sessions upsert the same edge id', () => {
    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X'));
    upsertNode(collisionNode(SESSION_X, 'f-shared', 'Finding X'));
    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y'));
    upsertNode(collisionNode(SESSION_Y, 'f-shared', 'Finding Y'));

    upsertEdge(collisionEdge(SESSION_X, 'answers-shared', 'f-shared', 'q-shared'));
    expect(getEdge(nsX, 'answers-shared')).toBeTruthy();
    expect(getEdge(nsY, 'answers-shared')).toBeNull();

    // The same logical edge id in session Y must not overwrite session X.
    upsertEdge(collisionEdge(SESSION_Y, 'answers-shared', 'f-shared', 'q-shared'));

    const edgeX = getEdge(nsX, 'answers-shared');
    const edgeY = getEdge(nsY, 'answers-shared');
    expect(edgeX).toBeTruthy();
    expect(edgeY).toBeTruthy();
    expect(edgeX?.sessionId).toBe(SESSION_X);
    expect(edgeY?.sessionId).toBe(SESSION_Y);

    const aggregate = getEdges({ specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE });
    // Two independent edge rows.
    expect(aggregate.length).toBe(2);

    // Namespace-scoped traversal reflects the same isolation.
    expect(getEdgesFrom(nsX, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
    expect(getEdgesFrom(nsY, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
  });

  it('updating a collided node in one session leaves the other session untouched', () => {
    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v1'));
    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y v1'));

    // Upsert-update in session X.
    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v2'));

    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X v2');
    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y v1');
  });

  it('keeps higher-level handler reads session-scoped when logical IDs collide', async () => {
    const sharedQuestionId = 'q-shared';
    const sharedFindingOneId = 'f-shared-1';
    const sharedFindingTwoId = 'f-shared-2';
    const sharedSourceOneId = 's-shared-1';
    const sharedSourceTwoId = 's-shared-2';
    const sharedClaimSourceId = 'claim-shared-a';
    const sharedClaimTargetId = 'claim-shared-b';

    const sessionXNodes: CoverageNode[] = [
      collisionNode(SESSION_X, sharedQuestionId, 'Question X'),
      collisionTypedNode(SESSION_X, sharedFindingOneId, 'FINDING', 'Finding X1'),
      collisionTypedNode(SESSION_X, sharedFindingTwoId, 'FINDING', 'Finding X2'),
      collisionTypedNode(SESSION_X, sharedSourceOneId, 'SOURCE', 'Source X1', { quality_class: 'primary' }),
      collisionTypedNode(SESSION_X, sharedSourceTwoId, 'SOURCE', 'Source X2', { quality_class: 'secondary' }),
      collisionTypedNode(SESSION_X, sharedClaimSourceId, 'CLAIM', 'Claim X A'),
      collisionTypedNode(SESSION_X, sharedClaimTargetId, 'CLAIM', 'Claim X B'),
    ];
    const sessionYNodes: CoverageNode[] = [
      collisionNode(SESSION_Y, sharedQuestionId, 'Question Y'),
      collisionTypedNode(SESSION_Y, sharedFindingOneId, 'FINDING', 'Finding Y1'),
      collisionTypedNode(SESSION_Y, sharedClaimSourceId, 'CLAIM', 'Claim Y A'),
      collisionTypedNode(SESSION_Y, sharedClaimTargetId, 'CLAIM', 'Claim Y B'),
    ];

    const sessionXEdges: CoverageEdge[] = [
      collisionEdge(SESSION_X, 'answers-shared-1', sharedFindingOneId, sharedQuestionId),
      collisionEdge(SESSION_X, 'answers-shared-2', sharedFindingTwoId, sharedQuestionId),
      collisionTypedEdge(SESSION_X, 'cites-shared-1', sharedFindingOneId, sharedSourceOneId, 'CITES'),
      collisionTypedEdge(SESSION_X, 'cites-shared-2', sharedFindingTwoId, sharedSourceTwoId, 'CITES'),
      collisionTypedEdge(SESSION_X, 'contradiction-shared', sharedClaimSourceId, sharedClaimTargetId, 'CONTRADICTS'),
    ];
    const sessionYEdges: CoverageEdge[] = [
      collisionEdge(SESSION_Y, 'answers-shared-1', sharedFindingOneId, sharedQuestionId),
    ];

    for (const node of [...sessionXNodes, ...sessionYNodes]) {
      upsertNode(node);
    }
    for (const edge of [...sessionXEdges, ...sessionYEdges]) {
      upsertEdge(edge);
    }

    const queryX = parseHandlerData(await handleCoverageGraphQuery({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_X,
      queryType: 'contradictions',
    }));
    const queryY = parseHandlerData(await handleCoverageGraphQuery({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_Y,
      queryType: 'contradictions',
    }));
    const statusX = parseHandlerData(await handleCoverageGraphStatus({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_X,
    }));
    const statusY = parseHandlerData(await handleCoverageGraphStatus({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_Y,
    }));
    const convergenceX = parseHandlerData(await handleCoverageGraphConvergence({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_X,
    }));
    const convergenceY = parseHandlerData(await handleCoverageGraphConvergence({
      specFolder: SHARED_SPEC,
      loopType: SHARED_LOOP_TYPE,
      sessionId: SESSION_Y,
    }));

    expect(queryX.totalContradictions).toBe(1);
    expect(queryX.contradictions).toEqual([
      expect.objectContaining({
        edgeId: 'contradiction-shared',
        sourceId: sharedClaimSourceId,
        targetId: sharedClaimTargetId,
        sourceName: 'Claim X A',
        targetName: 'Claim X B',
      }),
    ]);
    expect(queryY.totalContradictions).toBe(0);
    expect(queryY.contradictions).toEqual([]);

    expect(statusX.totalNodes).toBe(sessionXNodes.length);
    expect(statusX.totalEdges).toBe(sessionXEdges.length);
    expect(statusX.edgesByRelation.CONTRADICTS).toBe(1);
    expect(statusY.totalNodes).toBe(sessionYNodes.length);
    expect(statusY.totalEdges).toBe(sessionYEdges.length);
    expect(statusY.edgesByRelation.CONTRADICTS ?? 0).toBe(0);

    expect(convergenceX.signals.questionCoverage).toBe(1);
    expect(convergenceX.signals.sourceDiversity).toBe(2);
    expect(convergenceY.signals.questionCoverage).toBe(0);
    expect(convergenceY.signals.sourceDiversity).toBe(0);
  });
});
