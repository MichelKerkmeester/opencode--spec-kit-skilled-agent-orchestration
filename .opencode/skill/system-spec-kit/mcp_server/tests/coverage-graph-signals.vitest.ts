import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { handleCoverageGraphQuery } from '../handlers/coverage-graph/query.js';
import {
  closeDb,
  initDb,
  upsertEdge,
  upsertNode,
} from '../lib/coverage-graph/coverage-graph-db.js';

function parseOkResponse(response: Awaited<ReturnType<typeof handleCoverageGraphQuery>>) {
  const payload = JSON.parse(response.content[0]?.text ?? '{}');
  expect(payload.status).toBe('ok');
  return payload.data as {
    queryType: string;
    gaps: Array<{ nodeId: string; kind: string; name: string; reason: string }>;
    totalGaps: number;
  };
}

describe('coverage graph review gap regression', () => {
  let dbDir = '';

  beforeEach(() => {
    closeDb();
    dbDir = mkdtempSync(join(tmpdir(), 'coverage-graph-'));
    initDb(dbDir);
  });

  afterEach(() => {
    closeDb();
    rmSync(dbDir, { recursive: true, force: true });
  });

  it('reports uncovered DIMENSION and FILE sources for review graphs', async () => {
    const namespace = {
      specFolder: 'packet-015',
      loopType: 'review' as const,
      sessionId: 'review-session-1',
    };

    upsertNode({
      ...namespace,
      id: 'dim-covered',
      kind: 'DIMENSION',
      name: 'Covered dimension',
    });
    upsertNode({
      ...namespace,
      id: 'dim-gap',
      kind: 'DIMENSION',
      name: 'Gap dimension',
    });
    upsertNode({
      ...namespace,
      id: 'file-covered',
      kind: 'FILE',
      name: 'Covered file',
    });
    upsertNode({
      ...namespace,
      id: 'file-gap',
      kind: 'FILE',
      name: 'Gap file',
    });
    upsertNode({
      ...namespace,
      id: 'finding-1',
      kind: 'FINDING',
      name: 'Finding 1',
    });
    upsertNode({
      ...namespace,
      id: 'evidence-1',
      kind: 'EVIDENCE',
      name: 'Evidence 1',
    });

    upsertEdge({
      ...namespace,
      id: 'edge-covers',
      sourceId: 'dim-covered',
      targetId: 'finding-1',
      relation: 'COVERS',
      weight: 1,
    });
    upsertEdge({
      ...namespace,
      id: 'edge-evidence',
      sourceId: 'file-covered',
      targetId: 'evidence-1',
      relation: 'EVIDENCE_FOR',
      weight: 1,
    });
    upsertEdge({
      ...namespace,
      id: 'edge-in-file',
      sourceId: 'finding-1',
      targetId: 'file-gap',
      relation: 'IN_FILE',
      weight: 1,
    });

    const result = parseOkResponse(await handleCoverageGraphQuery({
      ...namespace,
      queryType: 'coverage_gaps',
      limit: 10,
    }));

    expect(result.queryType).toBe('coverage_gaps');
    expect(result.totalGaps).toBe(2);
    expect(result.gaps).toEqual([
      {
        nodeId: 'dim-gap',
        kind: 'DIMENSION',
        name: 'Gap dimension',
        reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
      },
      {
        nodeId: 'file-gap',
        kind: 'FILE',
        name: 'Gap file',
        reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
      },
    ]);
    expect(result.gaps.every((gap) => gap.kind === 'DIMENSION' || gap.kind === 'FILE')).toBe(true);
  });
});
