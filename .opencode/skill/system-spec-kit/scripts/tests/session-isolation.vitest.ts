import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  getEdges,
  getNodes,
  initDb,
  upsertEdge,
  upsertNode,
  type CoverageEdge,
  type CoverageNode,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';
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
  response: Awaited<ReturnType<typeof handleCoverageGraphConvergence>>,
): Record<string, any> {
  return JSON.parse(response.content[0]?.text ?? '{}').data ?? {};
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

  it('computes convergence from the session-scoped subset and defaults to all sessions when sessionId is omitted', async () => {
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

    const aggregateData = parseHandlerData(await handleCoverageGraphConvergence({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    }));

    expect(aggregateData.namespace).toMatchObject({
      specFolder: SPEC_FOLDER,
      loopType: LOOP_TYPE,
    });
    expect(aggregateData.namespace.sessionId).toBeUndefined();
    expect(aggregateData.scopeMode).toBe('all_sessions_default');
    expect(aggregateData.nodeCount).toBe(7);
    expect(aggregateData.edgeCount).toBe(5);
    expect(aggregateData.signals.questionCoverage).toBe(0.5);
  });
});
