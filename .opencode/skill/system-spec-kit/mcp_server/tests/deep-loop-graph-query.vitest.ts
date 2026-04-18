import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CoverageModules = {
  closeDb: () => void;
  handleCoverageGraphQuery: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCoverageGraphStatus: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCoverageGraphUpsert: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-coverage-graph-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../lib/coverage-graph/coverage-graph-db.js');
  const queryModule = await import('../handlers/coverage-graph/query.js');
  const statusModule = await import('../handlers/coverage-graph/status.js');
  const upsertModule = await import('../handlers/coverage-graph/upsert.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCoverageGraphQuery: queryModule.handleCoverageGraphQuery,
    handleCoverageGraphStatus: statusModule.handleCoverageGraphStatus,
    handleCoverageGraphUpsert: upsertModule.handleCoverageGraphUpsert,
  };
}

afterEach(() => {
  activeCloseDb?.();
  activeCloseDb = null;
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }

  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('coverage graph live query surfaces', () => {
  it('queries uncovered research questions and reports live status metrics', async () => {
    const {
      handleCoverageGraphUpsert,
      handleCoverageGraphQuery,
      handleCoverageGraphStatus,
    } = await loadCoverageModules();
    const specFolder = 'specs/coverage-graph-live';
    const sessionId = 'research-query-live';

    const upsertResponse = parseResponse(await handleCoverageGraphUpsert({
      specFolder,
      loopType: 'research',
      sessionId,
      nodes: [
        { id: 'q-1', kind: 'QUESTION', name: 'Covered question' },
        { id: 'q-2', kind: 'QUESTION', name: 'Uncovered question' },
        { id: 'f-1', kind: 'FINDING', name: 'Answer one' },
        { id: 'f-2', kind: 'FINDING', name: 'Answer two' },
        { id: 's-1', kind: 'SOURCE', name: 'Primary source', metadata: { quality_class: 'primary' } },
        { id: 's-2', kind: 'SOURCE', name: 'Secondary source', metadata: { quality_class: 'secondary' } },
        { id: 'c-1', kind: 'CLAIM', name: 'Verified claim', metadata: { verification_status: 'verified' } },
      ],
      edges: [
        { id: 'a-1', sourceId: 'f-1', targetId: 'q-1', relation: 'ANSWERS' },
        { id: 'a-2', sourceId: 'f-2', targetId: 'q-1', relation: 'ANSWERS' },
        { id: 'cite-1', sourceId: 'f-1', targetId: 's-1', relation: 'CITES' },
        { id: 'cite-2', sourceId: 'f-2', targetId: 's-2', relation: 'CITES' },
      ],
    }));

    const queryResponse = parseResponse(await handleCoverageGraphQuery({
      specFolder,
      loopType: 'research',
      sessionId,
      queryType: 'uncovered_questions',
    }));
    const statusResponse = parseResponse(await handleCoverageGraphStatus({
      specFolder,
      loopType: 'research',
      sessionId,
    }));

    expect(upsertResponse.status).toBe('ok');
    expect((upsertResponse.data as Record<string, unknown>)?.insertedNodes).toBe(7);
    expect((upsertResponse.data as Record<string, unknown>)?.insertedEdges).toBe(4);

    const queryData = queryResponse.data as Record<string, unknown>;
    const gaps = (queryData.gaps as Array<Record<string, unknown>>) ?? [];
    expect(queryResponse.status).toBe('ok');
    expect(queryData.queryType).toBe('uncovered_questions');
    expect(queryData.totalGaps).toBe(1);
    expect(gaps[0]).toMatchObject({
      nodeId: 'q-2',
      kind: 'QUESTION',
      reason: 'No incoming ANSWERS or COVERS edges',
    });

    const statusData = statusResponse.data as Record<string, unknown>;
    expect(statusResponse.status).toBe('ok');
    expect(statusData.totalNodes).toBe(7);
    expect(statusData.totalEdges).toBe(4);
    expect(statusData.nodesByKind).toMatchObject({
      QUESTION: 2,
      FINDING: 2,
      SOURCE: 2,
      CLAIM: 1,
    });
    expect(statusData.signals).toMatchObject({
      questionCoverage: 0.5,
      claimVerificationRate: 1,
      contradictionDensity: 0,
      sourceDiversity: 1,
      evidenceDepth: 2,
    });
  });

  it('queries review coverage gaps through the live MCP handlers instead of archived stubs', async () => {
    const {
      handleCoverageGraphUpsert,
      handleCoverageGraphQuery,
      handleCoverageGraphStatus,
    } = await loadCoverageModules();
    const specFolder = 'specs/coverage-graph-live';
    const sessionId = 'review-query-live';

    await handleCoverageGraphUpsert({
      specFolder,
      loopType: 'review',
      sessionId,
      nodes: [
        { id: 'dim-1', kind: 'DIMENSION', name: 'Security' },
        { id: 'file-1', kind: 'FILE', name: 'handlers/security.ts' },
        { id: 'finding-1', kind: 'FINDING', name: 'Open P0', metadata: { severity: 'P0' } },
      ],
      edges: [],
    });

    const queryResponse = parseResponse(await handleCoverageGraphQuery({
      specFolder,
      loopType: 'review',
      sessionId,
      queryType: 'coverage_gaps',
    }));
    const statusResponse = parseResponse(await handleCoverageGraphStatus({
      specFolder,
      loopType: 'review',
      sessionId,
    }));

    const queryData = queryResponse.data as Record<string, unknown>;
    const gaps = (queryData.gaps as Array<Record<string, unknown>>) ?? [];

    expect(queryResponse.status).toBe('ok');
    expect(queryData.queryType).toBe('coverage_gaps');
    expect(queryData.totalGaps).toBe(2);
    expect(gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nodeId: 'dim-1',
          kind: 'DIMENSION',
          reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
        }),
        expect.objectContaining({
          nodeId: 'file-1',
          kind: 'FILE',
          reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
        }),
      ])
    );

    const statusData = statusResponse.data as Record<string, unknown>;
    expect(statusResponse.status).toBe('ok');
    expect(statusData.nodesByKind).toMatchObject({
      DIMENSION: 1,
      FILE: 1,
      FINDING: 1,
    });
    expect(statusData.signals).toMatchObject({
      dimensionCoverage: 0,
      findingStability: 1,
      p0ResolutionRate: 0,
      evidenceDensity: 0,
      hotspotSaturation: 1,
    });

    const uncoveredQuestionsResponse = parseResponse(await handleCoverageGraphQuery({
      specFolder,
      loopType: 'review',
      sessionId,
      queryType: 'uncovered_questions',
    }));

    expect(uncoveredQuestionsResponse.status).toBe('error');
    expect(uncoveredQuestionsResponse.error).toContain('coverage_gaps for review graphs');
  });
});
