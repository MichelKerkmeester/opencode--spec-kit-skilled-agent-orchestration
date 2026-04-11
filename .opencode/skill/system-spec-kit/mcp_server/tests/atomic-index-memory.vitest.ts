import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { atomicIndexMemory, type AtomicIndexDependencies } from '../handlers/save/atomic-index-memory.js';
import type { AtomicSaveParams, IndexResult } from '../handlers/save/types.js';

function createTempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-index-memory-'));
}

function cleanupTempRoot(root: string): void {
  fs.rmSync(root, { recursive: true, force: true });
}

function createTargetPath(root: string, name: string): string {
  const target = path.join(root, 'specs', '026-fixture', name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  return target;
}

function buildIndexResult(overrides: Partial<IndexResult> = {}): IndexResult {
  return {
    status: 'indexed',
    id: 101,
    specFolder: 'specs/026-fixture',
    title: 'Canonical continuity write',
    message: 'Indexed successfully',
    ...overrides,
  };
}

function buildDependencies(
  overrides: Partial<AtomicIndexDependencies<{ token: string }>> = {},
): AtomicIndexDependencies<{ token: string }> {
  return {
    prepare: async (params) => ({
      status: 'ready',
      specFolder: 'specs/026-fixture',
      persistedContent: params.content,
      prepared: { token: 'prepared' },
    }),
    indexPrepared: async () => buildIndexResult(),
    ...overrides,
  };
}

describe('atomicIndexMemory', () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    while (tempRoots.length > 0) {
      const root = tempRoots.pop();
      if (root) {
        cleanupTempRoot(root);
      }
    }
    vi.restoreAllMocks();
  });

  it('writes canonical content and returns a success payload', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'implementation-summary.md');
    const params: AtomicSaveParams = {
      file_path: filePath,
      content: '# placeholder content',
    };

    const result = await atomicIndexMemory(params, { force: true }, buildDependencies({
      prepare: async () => ({
        status: 'ready',
        specFolder: 'specs/026-fixture',
        persistedContent: '# normalized canonical content',
        prepared: { token: 'ready' },
      }),
      indexPrepared: async ({ ready }) => buildIndexResult({
        specFolder: ready.specFolder,
        title: 'Implementation Summary',
      }),
    }));

    expect(result.success).toBe(true);
    expect(result.status).toBe('indexed');
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# normalized canonical content');
    expect(fs.readdirSync(path.dirname(filePath)).every((entry) => !entry.includes('_pending'))).toBe(true);
  });

  it('promotes routed canonical content into the prepared persisted file path', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const sourcePath = createTargetPath(root, 'memory/session.md');
    const targetPath = createTargetPath(root, 'implementation-summary.md');
    fs.writeFileSync(sourcePath, '# original source memory', 'utf8');

    const result = await atomicIndexMemory(paramsFrom(sourcePath), { force: true }, buildDependencies({
      prepare: async () => ({
        status: 'ready',
        specFolder: 'specs/026-fixture',
        persistedContent: '# routed canonical summary',
        persistedFilePath: targetPath,
        prepared: { token: 'routed-target' },
      }),
      indexPrepared: async () => buildIndexResult({
        specFolder: 'specs/026-fixture',
        title: 'Implementation Summary',
        targetDocPath: targetPath,
      }),
    }));

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(targetPath);
    expect(fs.readFileSync(sourcePath, 'utf8')).toBe('# original source memory');
    expect(fs.readFileSync(targetPath, 'utf8')).toBe('# routed canonical summary');
  });

  it('rolls back the original file when canonical indexing returns rejected', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'decision-record.md');
    fs.writeFileSync(filePath, '# original content', 'utf8');

    const indexPrepared = vi.fn(async () => buildIndexResult({
      status: 'rejected',
      id: 0,
      message: 'Merge legality rejected the canonical write',
      rejectionReason: 'Merge legality rejected the canonical write',
    }));

    const result = await atomicIndexMemory(
      { file_path: filePath, content: '# replacement content' },
      { force: true },
      buildDependencies({ indexPrepared }),
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('rejected');
    expect(result.message).toContain('Merge legality rejected');
    expect(indexPrepared).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# original content');
  });

  it('surfaces rollback metadata when rejected writes cannot restore the original state', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'plan.md');

    const result = await atomicIndexMemory(
      { file_path: filePath, content: '# routed content' },
      { force: true },
      buildDependencies({
        indexPrepared: async () => buildIndexResult({
          status: 'rejected',
          id: 0,
          message: 'Rejected by canonical validator',
          rejectionReason: 'Rejected by canonical validator',
        }),
        restoreOriginalState: () => ({
          restored: false,
          error: 'simulated rollback failure',
        }),
      }),
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('rejected');
    expect(result.error).toContain('rollback failed');
    expect(result.errorMetadata).toEqual({ rollbackError: 'simulated rollback failure' });
  });

  it('retries once when canonical indexing throws and then succeeds', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'tasks.md');

    const prepare = vi.fn(async (params) => ({
      status: 'ready' as const,
      specFolder: 'specs/026-fixture',
      persistedContent: params.content,
      prepared: { token: 'retryable' },
    }));
    const indexPrepared = vi.fn()
      .mockRejectedValueOnce(new Error('simulated transient canonical indexing failure'))
      .mockResolvedValueOnce(buildIndexResult({
        id: 211,
        title: 'Tasks',
      }));

    const result = await atomicIndexMemory(
      { file_path: filePath, content: '# second attempt wins' },
      { force: true },
      buildDependencies({ prepare, indexPrepared }),
    );

    expect(result.success).toBe(true);
    expect(result.id).toBe(211);
    expect(prepare).toHaveBeenCalledTimes(2);
    expect(indexPrepared).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# second attempt wins');
  });

  it('restores or removes the promoted file after retry exhaustion', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'handover.md');

    const result = await atomicIndexMemory(
      { file_path: filePath, content: '# this never lands' },
      { force: true },
      buildDependencies({
        indexPrepared: async () => {
          throw new Error('simulated persistent canonical indexing failure');
        },
      }),
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('error');
    expect(result.error).toContain('Indexing failed after retry');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('serializes concurrent writes through the shared spec-folder lock', async () => {
    const root = createTempRoot();
    tempRoots.push(root);
    const filePath = createTargetPath(root, 'implementation-summary.md');

    let firstRelease: (() => void) | null = null;
    let firstReadySignal: (() => void) | null = null;
    const firstReady = new Promise<void>((resolve) => {
      firstReadySignal = resolve;
    });
    const firstReleasePromise = new Promise<void>((resolve) => {
      firstRelease = resolve;
    });

    const promotions: string[] = [];
    let callCount = 0;

    const defaultWritePendingAndPromote = (pendingPath: string, finalPath: string, content: string): void => {
      fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
      fs.writeFileSync(pendingPath, content, 'utf-8');
      fs.renameSync(pendingPath, finalPath);
    };

    const dependencies = buildDependencies({
      prepare: async (params) => ({
        status: 'ready',
        specFolder: 'specs/026-fixture',
        persistedContent: params.content,
        prepared: { token: params.content },
      }),
      writePendingAndPromote: (pendingPath, finalPath, content) => {
        promotions.push(content);
        defaultWritePendingAndPromote(pendingPath, finalPath, content);
      },
      indexPrepared: async () => {
        callCount += 1;
        if (callCount === 1) {
          firstReadySignal?.();
          await firstReleasePromise;
        }
        return buildIndexResult({ id: 300 + callCount });
      },
    });

    const firstSave = atomicIndexMemory(
      { file_path: filePath, content: '# first canonical write' },
      { force: true },
      dependencies,
    );

    await firstReady;
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# first canonical write');
    expect(promotions).toEqual(['# first canonical write']);

    const secondSave = atomicIndexMemory(
      { file_path: filePath, content: '# second canonical write' },
      { force: true },
      dependencies,
    );

    expect(promotions).toEqual(['# first canonical write']);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# first canonical write');

    firstRelease?.();

    const [firstResult, secondResult] = await Promise.all([firstSave, secondSave]);

    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(true);
    expect(promotions).toEqual(['# first canonical write', '# second canonical write']);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('# second canonical write');
  });
});

function paramsFrom(filePath: string): AtomicSaveParams {
  return {
    file_path: filePath,
    content: '# placeholder content',
  };
}
