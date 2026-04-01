import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  execSyncMock: vi.fn(),
  existsSyncMock: vi.fn(),
  realpathSyncMock: vi.fn(),
  indexFilesMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  upsertFileMock: vi.fn(),
  replaceNodesMock: vi.fn(),
  replaceEdgesMock: vi.fn(),
  removeFileMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  execSync: mocks.execSyncMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
  realpathSync: mocks.realpathSyncMock,
}));

vi.mock('../lib/code-graph/structural-indexer.js', () => ({
  indexFiles: mocks.indexFilesMock,
}));

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getLastGitHead: mocks.getLastGitHeadMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  isFileStale: mocks.isFileStaleMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  removeFile: mocks.removeFileMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
}));

import { handleCodeGraphScan } from '../handlers/code-graph/scan.js';

describe('handleCodeGraphScan', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.execSyncMock.mockReturnValue('new-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('old-head');
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.realpathSyncMock.mockImplementation((path: string) => path);
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/removed.ts']);
    mocks.indexFilesMock.mockResolvedValue([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{
        symbolId: 'current::symbol',
      }],
      edges: [],
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]);
  });

  it('forces a full reindex when git HEAD changes', async () => {
    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
        currentGitHead: string | null;
        previousGitHead: string | null;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(1);
    expect(payload.data.filesSkipped).toBe(0);
    expect(payload.data.fullReindexTriggered).toBe(true);
    expect(payload.data.previousGitHead).toBe('old-head');
    expect(payload.data.currentGitHead).toBe('new-head');
    expect(mocks.execSyncMock).toHaveBeenCalledWith('git rev-parse HEAD', expect.objectContaining({
      cwd: process.cwd(),
      encoding: 'utf-8',
    }));
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/removed.ts');
    expect(mocks.isFileStaleMock).not.toHaveBeenCalled();
    expect(mocks.upsertFileMock).toHaveBeenCalledTimes(1);
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('new-head');
  });

  it('removes deleted tracked files during incremental scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/current.ts', '/workspace/deleted.ts']);
    mocks.existsSyncMock.mockImplementation((filePath: string) => filePath !== '/workspace/deleted.ts');

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(0);
    expect(payload.data.filesSkipped).toBe(1);
    expect(payload.data.fullReindexTriggered).toBe(false);
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/deleted.ts');
    expect(mocks.upsertFileMock).not.toHaveBeenCalled();
  });
});
