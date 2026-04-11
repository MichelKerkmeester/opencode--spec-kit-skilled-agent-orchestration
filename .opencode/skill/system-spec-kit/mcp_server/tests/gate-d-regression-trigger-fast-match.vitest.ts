import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MockMemoryRow {
  id: number;
  spec_folder: string;
  file_path: string;
  title: string | null;
  trigger_phrases: string;
  importance_weight: number | null;
  document_type: string | null;
  anchor_id: string | null;
  content_text: string | null;
}

const mockDbState = vi.hoisted(() => ({
  rows: [] as MockMemoryRow[],
}));

const mockDb = vi.hoisted(() => ({
  prepare: () => ({
    all: () => mockDbState.rows,
  }),
}));

vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => mockDb),
}));

import { clearCache, loadTriggerCache } from '../lib/parsing/trigger-matcher';

function buildSpecDocContent(title: string, triggerPhrases: string[] | null): string {
  return [
    '---',
    `title: "${title}"`,
    ...(triggerPhrases && triggerPhrases.length > 0
      ? ['trigger_phrases:', ...triggerPhrases.map((phrase) => `  - "${phrase}"`)]
      : []),
    'importance_tier: "important"',
    'contextType: "implementation"',
    '---',
    '',
    '# Fixture',
  ].join('\n');
}

function setMockDbRows(rows: MockMemoryRow[]): void {
  mockDbState.rows = rows.map((row) => ({
    content_text: row.content_text ?? null,
    ...row,
  }));
}

describe('Gate D trigger fast-match regression', () => {
  beforeEach(() => {
    clearCache();
    setMockDbRows([]);
  });

  it('prefers canonical spec-doc frontmatter, falls back to _memory.continuity only when frontmatter has no trigger phrases, and ignores legacy/archive-shaped rows', () => {
    setMockDbRows([
      {
        id: 101,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/specs/system-spec-kit/018-canonical-continuity-refactor/implementation-summary.md',
        title: 'Canonical implementation summary',
        trigger_phrases: JSON.stringify(['stale column phrase']),
        importance_weight: 0.9,
        document_type: 'implementation_summary',
        anchor_id: null,
        content_text: buildSpecDocContent('Canonical implementation summary', ['frontmatter winner']),
      },
      {
        id: 102,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/specs/system-spec-kit/018-canonical-continuity-refactor/implementation-summary.md',
        title: 'Canonical continuity',
        trigger_phrases: JSON.stringify(['continuity fallback']),
        importance_weight: 0.4,
        document_type: 'implementation_summary',
        anchor_id: '_memory.continuity',
        content_text: 'continuity metadata only',
      },
      {
        id: 103,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/legacy/memory.md',
        title: 'Legacy memory row',
        trigger_phrases: JSON.stringify(['legacy fallback']),
        importance_weight: 0.2,
        document_type: 'memory',
        anchor_id: null,
        content_text: buildSpecDocContent('Legacy memory row', ['legacy fallback']),
      },
      {
        id: 104,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/archive/memory.md',
        title: 'Archived memory row',
        trigger_phrases: JSON.stringify(['archived fallback']),
        importance_weight: 0.1,
        document_type: 'archived',
        anchor_id: null,
        content_text: buildSpecDocContent('Archived memory row', ['archived fallback']),
      },
    ]);

    const frontmatterCache = loadTriggerCache();

    expect(frontmatterCache).toHaveLength(1);
    expect(frontmatterCache.map((entry) => entry.phrase)).toEqual(['frontmatter winner']);
    expect(frontmatterCache[0]?.memoryId).toBe(101);
    expect(frontmatterCache[0]?.filePath).toContain('implementation-summary.md');
    expect(frontmatterCache.some((entry) => entry.memoryId === 102)).toBe(false);
    expect(frontmatterCache.some((entry) => entry.memoryId === 103)).toBe(false);
    expect(frontmatterCache.some((entry) => entry.memoryId === 104)).toBe(false);

    clearCache();

    setMockDbRows([
      {
        id: 201,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/specs/system-spec-kit/018-canonical-continuity-refactor/tasks.md',
        title: 'Tasks doc',
        trigger_phrases: JSON.stringify(['stale column phrase']),
        importance_weight: 0.8,
        document_type: 'tasks',
        anchor_id: null,
        content_text: buildSpecDocContent('Tasks doc', null),
      },
      {
        id: 202,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/specs/system-spec-kit/018-canonical-continuity-refactor/tasks.md',
        title: 'Tasks continuity',
        trigger_phrases: JSON.stringify(['continuity fallback']),
        importance_weight: 0.6,
        document_type: 'tasks',
        anchor_id: '_memory.continuity',
        content_text: 'continuity metadata only',
      },
      {
        id: 203,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/legacy/tasks.md',
        title: 'Legacy task row',
        trigger_phrases: JSON.stringify(['legacy fallback']),
        importance_weight: 0.3,
        document_type: 'memory',
        anchor_id: null,
        content_text: buildSpecDocContent('Legacy task row', ['legacy fallback']),
      },
      {
        id: 204,
        spec_folder: 'specs/system-spec-kit/018-canonical-continuity-refactor',
        file_path: '/virtual/archive/tasks.md',
        title: 'Archived task row',
        trigger_phrases: JSON.stringify(['archived fallback']),
        importance_weight: 0.1,
        document_type: 'archived',
        anchor_id: null,
        content_text: buildSpecDocContent('Archived task row', ['archived fallback']),
      },
    ]);

    const continuityCache = loadTriggerCache();

    expect(continuityCache).toHaveLength(1);
    expect(continuityCache.map((entry) => entry.phrase)).toEqual(['continuity fallback']);
    expect(continuityCache[0]?.memoryId).toBe(202);
    expect(continuityCache[0]?.filePath).toContain('tasks.md');
    expect(continuityCache.some((entry) => entry.memoryId === 201)).toBe(false);
    expect(continuityCache.some((entry) => entry.memoryId === 203)).toBe(false);
    expect(continuityCache.some((entry) => entry.memoryId === 204)).toBe(false);
  });
});
