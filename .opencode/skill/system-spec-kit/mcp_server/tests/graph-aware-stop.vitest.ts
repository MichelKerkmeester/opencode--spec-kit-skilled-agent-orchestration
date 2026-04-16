import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CoverageModules = {
  closeDb: () => void;
  handleCoverageGraphConvergence: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCoverageGraphUpsert: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-graph-stop-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../lib/coverage-graph/coverage-graph-db.js');
  const convergenceModule = await import('../handlers/coverage-graph/convergence.js');
  const upsertModule = await import('../handlers/coverage-graph/upsert.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCoverageGraphConvergence: convergenceModule.handleCoverageGraphConvergence,
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

describe('coverage graph convergence handler', () => {
  it('emits the canonical top-level score from the live research handler output', async () => {
    const {
      handleCoverageGraphUpsert,
      handleCoverageGraphConvergence,
    } = await loadCoverageModules();
    const specFolder = 'specs/coverage-graph-live';
    const sessionId = 'research-stop-live';

    await handleCoverageGraphUpsert({
      specFolder,
      loopType: 'research',
      sessionId,
      nodes: [
        { id: 'q-1', kind: 'QUESTION', name: 'Resolved question' },
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
    });

    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder,
      loopType: 'research',
      sessionId,
      persistSnapshot: true,
      iteration: 1,
    }));
    const data = response.data as Record<string, unknown>;
    const signals = data.signals as Record<string, unknown>;
    const trace = (data.trace as Array<Record<string, unknown>>) ?? [];

    expect(response.status).toBe('ok');
    expect(data.decision).toBe('STOP_ALLOWED');
    expect(data.score).toBe(0.86);
    expect(signals.score).toBe(0.86);
    expect(signals).toMatchObject({
      questionCoverage: 1,
      claimVerificationRate: 1,
      contradictionDensity: 0,
      sourceDiversity: 2,
      evidenceDepth: 2,
    });
    expect(data.snapshotPersistence).toBe('persisted');
    expect(data.blockers).toEqual([]);
    expect(trace.every((entry) => entry.passed === true)).toBe(true);
  });

  it('reports blocking review-stop reasons from the live convergence branch', async () => {
    const {
      handleCoverageGraphUpsert,
      handleCoverageGraphConvergence,
    } = await loadCoverageModules();
    const specFolder = 'specs/coverage-graph-live';
    const sessionId = 'review-stop-live';

    await handleCoverageGraphUpsert({
      specFolder,
      loopType: 'review',
      sessionId,
      nodes: [
        { id: 'dim-1', kind: 'DIMENSION', name: 'Security' },
        { id: 'file-1', kind: 'FILE', name: 'handlers/security.ts', metadata: { hotspot_score: 1 } },
        { id: 'finding-1', kind: 'FINDING', name: 'Open P0 finding', metadata: { severity: 'P0' } },
      ],
      edges: [],
    });

    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder,
      loopType: 'review',
      sessionId,
    }));
    const data = response.data as Record<string, unknown>;
    const blockers = (data.blockers as Array<Record<string, unknown>>) ?? [];
    const signals = data.signals as Record<string, unknown>;

    expect(response.status).toBe('ok');
    expect(data.decision).toBe('STOP_BLOCKED');
    expect(data.reason).toContain('unresolved_p0_findings');
    expect(data.reason).toContain('uncovered_dimensions');
    expect(signals.score).toBe(0.2);
    expect(blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'unresolved_p0_findings', severity: 'blocking' }),
        expect.objectContaining({ type: 'uncovered_dimensions', severity: 'blocking' }),
      ])
    );
  });
});
