import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as sessionManager from '../lib/session/session-manager';

interface CanonicalMemoryRow {
  id: number;
  file_path: string;
  anchorId: string;
  title: string;
  content_hash: string;
  documentType: 'spec_doc' | 'continuity';
  source: 'spec-doc' | 'continuity';
  specFolder: string;
  content: string;
}

let testDb: InstanceType<typeof Database> | null = null;

function createCanonicalRow(overrides: Partial<CanonicalMemoryRow>): CanonicalMemoryRow {
  return {
    id: 1,
    file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
    anchorId: 'what-built',
    title: 'Gate D reader-ready canonical doc',
    content_hash: 'sha256:gate-d-session-dedup-feature-3',
    documentType: 'spec_doc',
    source: 'spec-doc',
    specFolder: 'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready',
    content: 'Canonical spec-doc row for the Gate D reader-ready packet.',
    ...overrides,
  };
}

function initializeSessionManager(): void {
  testDb = new Database(':memory:');
  const result = sessionManager.init(testDb);
  if (!result.success) {
    throw new Error(`Failed to initialize session manager: ${result.error}`);
  }
}

afterEach(() => {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
});

beforeEach(() => {
  initializeSessionManager();
});

describe('Gate D regression session dedup', () => {
  it('feature 3 dedups repeat canonical hits across spec-doc and continuity rows without archived or legacy fallback', () => {
    const sessionId = 'gate-d-feature-3-session-dedup';
    const specDocRow = createCanonicalRow({
      id: 8101,
      anchorId: 'what-built',
      title: 'Gate D reader-ready canonical doc',
      documentType: 'spec_doc',
      source: 'spec-doc',
      file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
      content: 'Canonical spec-doc row for the Gate D reader-ready packet.',
    });
    const continuityRow = createCanonicalRow({
      id: 8102,
      anchorId: 'continuity',
      title: 'Gate D reader-ready continuity row',
      documentType: 'continuity',
      source: 'continuity',
      file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
      content: 'Canonical continuity row for the same Gate D reader-ready packet.',
    });
    const unrelatedCanonicalRow = createCanonicalRow({
      id: 8103,
      anchorId: 'next-safe-action',
      title: 'Gate D reader-ready follow-up doc',
      content_hash: 'sha256:gate-d-session-dedup-feature-3-follow-up',
      documentType: 'spec_doc',
      source: 'spec-doc',
      file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/tasks.md',
      content: 'Independent canonical row that should survive session dedup.',
    });

    expect(sessionManager.generateMemoryHash(specDocRow)).toBe(sessionManager.generateMemoryHash(continuityRow));
    expect(sessionManager.generateMemoryHash(specDocRow)).not.toBe(sessionManager.generateMemoryHash(unrelatedCanonicalRow));

    const firstMark = sessionManager.markMemorySent(sessionId, specDocRow);
    expect(firstMark.success).toBe(true);

    const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, [
      specDocRow,
      continuityRow,
      unrelatedCanonicalRow,
    ]);

    expect(dedupStats.enabled).toBe(true);
    expect(dedupStats.total).toBe(3);
    expect(dedupStats.filtered).toBe(2);
    expect(dedupStats.tokenSavingsEstimate).toBe('~400 tokens');
    expect(filtered.map((row) => row.id)).toEqual([8103]);
    expect(filtered[0].documentType).toBe('spec_doc');
    expect(filtered.every((row) => row.documentType !== 'archived')).toBe(true);
    expect(filtered.every((row) => row.source !== 'legacy')).toBe(true);
  });
});
