import { describe, expect, it, vi } from 'vitest';

import {
  DETECTOR_PROVENANCE_VALUES,
  isDetectorProvenance,
} from '../../mcp_server/lib/context/shared-payload.js';
import {
  EVIDENCE_GAP_DETECTOR_PROVENANCE,
} from '../../mcp_server/lib/search/evidence-gap-detector.ts';
import {
  detectorProvenanceFromParserBackend,
} from '../../mcp_server/code_graph/lib/structural-indexer.ts';

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn((subject: string) => subject),
  queryFileImportDependents: vi.fn(),
  queryFileDegrees: vi.fn(),
  getLastDetectorProvenance: vi.fn(() => 'structured'),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
}));

vi.mock('../../mcp_server/code_graph/lib/code-graph-db.js', () => ({
  getDb: mocks.getDb,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
  queryOutline: mocks.queryOutline,
  resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  queryFileImportDependents: mocks.queryFileImportDependents,
  queryFileDegrees: mocks.queryFileDegrees,
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
}));

vi.mock('../../mcp_server/code_graph/lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

import { handleCodeGraphQuery } from '../../mcp_server/code_graph/handlers/query.js';

describe('graph upgrades regression floor', () => {
  it('keeps detector provenance honest for fallback lanes', () => {
    expect([...DETECTOR_PROVENANCE_VALUES]).toEqual(['ast', 'structured', 'regex', 'heuristic']);
    expect(detectorProvenanceFromParserBackend('regex')).toBe('structured');
    expect(EVIDENCE_GAP_DETECTOR_PROVENANCE.predictGraphCoverage.parserProvenance).toBe('heuristic');
    expect(EVIDENCE_GAP_DETECTOR_PROVENANCE.detectEvidenceGap.parserProvenance).toBe('heuristic');
    expect(EVIDENCE_GAP_DETECTOR_PROVENANCE.predictGraphCoverage.parserProvenance).not.toBe('ast');
    expect(isDetectorProvenance('structured')).toBe(true);
    expect(isDetectorProvenance('invalid-detector')).toBe(false);
  });

  it('keeps blast-radius depth caps and explicit union behavior stable', async () => {
    mocks.queryFileImportDependents.mockReturnValue([
      { importedFilePath: 'src/a.ts', importerFilePath: 'src/b.ts' },
      { importedFilePath: 'src/b.ts', importerFilePath: 'src/c.ts' },
      { importedFilePath: 'src/c.ts', importerFilePath: 'src/d.ts' },
      { importedFilePath: 'src/x.ts', importerFilePath: 'src/e.ts' },
      { importedFilePath: 'src/e.ts', importerFilePath: 'src/f.ts' },
    ]);
    mocks.queryFileDegrees.mockReturnValue([
      { filePath: 'src/a.ts', degree: 1 },
      { filePath: 'src/x.ts', degree: 1 },
      { filePath: 'src/b.ts', degree: 2 },
      { filePath: 'src/e.ts', degree: 3 },
      { filePath: 'src/c.ts', degree: 5 },
      { filePath: 'src/f.ts', degree: 1 },
    ]);

    const depthTwo = JSON.parse((await handleCodeGraphQuery({
      operation: 'blast_radius',
      subject: 'src/a.ts',
      subjects: ['src/x.ts'],
      unionMode: 'multi',
      maxDepth: 2,
    })).content[0].text);

    expect(depthTwo.data.multiFileUnion).toBe(true);
    expect(depthTwo.data.sourceFiles).toEqual(['src/a.ts', 'src/x.ts']);
    expect(depthTwo.data.affectedFiles).toEqual([
      { filePath: 'src/b.ts', depth: 1 },
      { filePath: 'src/e.ts', depth: 1 },
      {
        filePath: 'src/c.ts',
        depth: 2,
        hotFileBreadcrumb: {
          degree: 5,
          changeCarefullyReason: 'High-degree node; change carefully because changes here ripple to 5 dependents.',
        },
      },
      { filePath: 'src/f.ts', depth: 2 },
    ]);
    expect(depthTwo.data.affectedFiles).not.toContainEqual({ filePath: 'src/d.ts', depth: 3 });

    mocks.queryFileDegrees.mockReturnValue([
      { filePath: 'src/a.ts', degree: 0 },
    ]);
    const depthZero = JSON.parse((await handleCodeGraphQuery({
      operation: 'blast_radius',
      subject: 'src/a.ts',
      maxDepth: 0,
    })).content[0].text);

    expect(depthZero.data.nodes).toEqual([
      { filePath: 'src/a.ts', depth: 0, isSeed: true },
    ]);
    expect(depthZero.data.affectedFiles).toEqual([]);
  });
});
