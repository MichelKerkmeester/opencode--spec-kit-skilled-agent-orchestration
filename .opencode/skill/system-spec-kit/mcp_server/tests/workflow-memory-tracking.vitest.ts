import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  loadPerFolderDescription,
  savePerFolderDescription,
} from '../lib/search/folder-discovery';
import type { PerFolderDescription } from '../lib/search/folder-discovery';

function buildDescription(
  overrides: Partial<PerFolderDescription> = {},
): PerFolderDescription {
  return {
    specFolder: '010-test',
    description: 'Test spec folder',
    keywords: ['test'],
    lastUpdated: '2026-03-09T00:00:00.000Z',
    specId: '010',
    folderSlug: 'test',
    parentChain: [],
    memorySequence: 0,
    memoryNameHistory: [],
    ...overrides,
  };
}

function applyWorkflowMemoryTracking(
  folderPath: string,
  nextMemoryName: string,
  mutate?: (desc: PerFolderDescription) => void,
): PerFolderDescription {
  const existing = loadPerFolderDescription(folderPath);
  expect(existing).not.toBeNull();
  if (!existing) {
    throw new Error('Expected per-folder description to exist');
  }
  if (mutate) mutate(existing);

  const rawSeq = Number(existing.memorySequence) || 0;
  existing.memorySequence = (Number.isSafeInteger(rawSeq) && rawSeq >= 0) ? rawSeq + 1 : 1;
  existing.memoryNameHistory = [
    ...(existing.memoryNameHistory || []).slice(-19),
    nextMemoryName,
  ];
  savePerFolderDescription(existing, folderPath);

  const updated = loadPerFolderDescription(folderPath);
  expect(updated).not.toBeNull();
  if (!updated) {
    throw new Error('Expected updated per-folder description to exist');
  }
  return updated;
}

describe('workflow memory tracking load→mutate→save cycle', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-memory-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('increments memorySequence from existing value', () => {
    savePerFolderDescription(buildDescription({ memorySequence: 5 }), tmpDir);

    const updated = applyWorkflowMemoryTracking(tmpDir, 'ctx-06.md');

    expect(updated.memorySequence).toBe(6);
  });

  it('initializes memorySequence from 0 when missing', () => {
    savePerFolderDescription(buildDescription({ memorySequence: 7 }), tmpDir);

    const updated = applyWorkflowMemoryTracking(tmpDir, 'ctx-01.md', (desc) => {
      delete (desc as { memorySequence?: number }).memorySequence;
    });

    expect(updated.memorySequence).toBe(1);
  });

  it('ring buffer caps at 20 entries', () => {
    const history = Array.from({ length: 20 }, (_, i) => `ctx-${String(i + 1).padStart(2, '0')}.md`);
    savePerFolderDescription(buildDescription({ memoryNameHistory: history }), tmpDir);

    const updated = applyWorkflowMemoryTracking(tmpDir, 'ctx-21.md');

    expect(updated.memoryNameHistory).toHaveLength(20);
    expect(updated.memoryNameHistory[0]).toBe('ctx-02.md');
    expect(updated.memoryNameHistory[19]).toBe('ctx-21.md');
  });

  it('ring buffer grows below cap', () => {
    const history = Array.from({ length: 5 }, (_, i) => `ctx-${i + 1}.md`);
    savePerFolderDescription(buildDescription({ memoryNameHistory: history }), tmpDir);

    const updated = applyWorkflowMemoryTracking(tmpDir, 'ctx-6.md');

    expect(updated.memoryNameHistory).toHaveLength(6);
    expect(updated.memoryNameHistory).toEqual([...history, 'ctx-6.md']);
  });

  it('handles empty memoryNameHistory', () => {
    savePerFolderDescription(buildDescription({ memoryNameHistory: [] }), tmpDir);

    const updated = applyWorkflowMemoryTracking(tmpDir, 'ctx-1.md');

    expect(updated.memoryNameHistory).toEqual(['ctx-1.md']);
  });
});
