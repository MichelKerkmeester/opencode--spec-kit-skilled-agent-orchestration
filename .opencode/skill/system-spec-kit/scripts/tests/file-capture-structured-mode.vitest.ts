import { afterEach, describe, expect, it, vi } from 'vitest';

const execSyncMock = vi.hoisted(() => vi.fn(() => ' M scripts/core/workflow.ts\n?? scripts/tests/new-capture.vitest.ts\n'));

vi.mock('node:child_process', () => ({
  execSync: execSyncMock,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('file capture structured mode', () => {
  it('uses structured filesModified payloads to populate all frontmatter file counts', async () => {
    const { collectSessionData } = await import('../extractors/collect-session-data');

    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'Verified structured file capture counts.',
      filesModified: [
        { path: 'scripts/core/workflow.ts', description: 'Updated workflow render bindings.' },
        { path: 'scripts/core/title-builder.ts', description: 'Removed filename suffix output.' },
        { path: 'scripts/core/memory-metadata.ts', description: 'Added lineage helpers.' },
        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed packet doc discovery.' },
        { path: 'scripts/tests/post-save-render-round-trip.vitest.ts', description: 'Added round-trip coverage.' },
      ],
    } as never, 'test-packet');

    expect(sessionData.CAPTURED_FILE_COUNT).toBe(5);
    expect(sessionData.FILESYSTEM_FILE_COUNT).toBe(5);
    expect(sessionData.GIT_CHANGED_FILE_COUNT).toBe(5);
  });

  it('falls back to git status when no explicit file list is provided', async () => {
    const { collectSessionData } = await import('../extractors/collect-session-data');

    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'Verified fallback git capture counts.',
    } as never, 'test-packet');

    expect(execSyncMock).toHaveBeenCalled();
    expect(sessionData.CAPTURED_FILE_COUNT).toBe(2);
    expect(sessionData.FILESYSTEM_FILE_COUNT).toBe(2);
    expect(sessionData.GIT_CHANGED_FILE_COUNT).toBe(2);
  });
});
