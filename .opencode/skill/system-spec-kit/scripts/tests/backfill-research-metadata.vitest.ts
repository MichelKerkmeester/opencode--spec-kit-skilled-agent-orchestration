import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadGraphMetadata, loadPerFolderDescription } from '../../mcp_server/api';
import {
  collectResearchIterationDirectories,
  hasResearchIterationDirectories,
  runBackfillResearchMetadata,
} from '../memory/backfill-research-metadata.js';

const createdRoots = new Set<string>();

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'research-backfill-'));
  createdRoots.add(root);
  return root;
}

function writePacketRoot(specFolder: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), '# Packet\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
}

function createIterationDir(specFolder: string, relativePath: string): string {
  const iterationsDir = path.join(specFolder, 'research', relativePath, 'iterations');
  fs.mkdirSync(iterationsDir, { recursive: true });
  fs.writeFileSync(path.join(iterationsDir, 'iteration-001.md'), '# Iteration 001\n', 'utf-8');
  return iterationsDir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('backfill-research-metadata', () => {
  it('creates description.json and graph-metadata.json when both are missing', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '910-research-backfill');
    writePacketRoot(specFolder);
    const iterationsDir = createIterationDir(specFolder, '001-sample-topic');

    const summary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false, now: '2026-04-17T12:00:00.000Z' });

    expect(summary.descriptionCreated).toBe(1);
    expect(summary.graphCreated).toBe(1);
    expect(summary.failed).toBe(0);
    const description = loadPerFolderDescription(iterationsDir);
    const graphMetadata = loadGraphMetadata(path.join(iterationsDir, 'graph-metadata.json'));
    expect(description?.specFolder).toBe('system-spec-kit/910-research-backfill/research/001-sample-topic/iterations');
    expect(description?.folderSlug).toBe('sample-topic-iterations');
    expect(graphMetadata?.spec_folder).toBe('system-spec-kit/910-research-backfill/research/001-sample-topic/iterations');
  });

  it('creates only the missing file when one metadata artifact already exists', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '911-research-backfill');
    writePacketRoot(specFolder);
    const iterationsDir = createIterationDir(specFolder, '002-existing-description');
    fs.writeFileSync(
      path.join(iterationsDir, 'description.json'),
      JSON.stringify({
        specFolder: 'custom/path',
        description: 'Keep me',
        keywords: ['keep'],
        lastUpdated: '2026-04-10T00:00:00.000Z',
        specId: '002',
        folderSlug: 'custom-folder',
        parentChain: ['system-spec-kit'],
        memorySequence: 0,
        memoryNameHistory: [],
      }, null, 2),
      'utf-8',
    );

    const summary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false });

    expect(summary.descriptionCreated).toBe(0);
    expect(summary.graphCreated).toBe(1);
    expect(loadPerFolderDescription(iterationsDir)?.description).toBe('Keep me');
    expect(fs.existsSync(path.join(iterationsDir, 'graph-metadata.json'))).toBe(true);
  });

  it('leaves existing metadata untouched when both files are already present', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '912-research-backfill');
    writePacketRoot(specFolder);
    const iterationsDir = createIterationDir(specFolder, '003-already-backed');
    runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false, now: '2026-04-17T12:00:00.000Z' });
    const beforeDescription = fs.readFileSync(path.join(iterationsDir, 'description.json'), 'utf-8');
    const beforeGraph = fs.readFileSync(path.join(iterationsDir, 'graph-metadata.json'), 'utf-8');

    const summary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false, now: '2026-04-18T12:00:00.000Z' });

    expect(summary.unchanged).toBe(1);
    expect(summary.descriptionCreated).toBe(0);
    expect(summary.graphCreated).toBe(0);
    expect(fs.readFileSync(path.join(iterationsDir, 'description.json'), 'utf-8')).toBe(beforeDescription);
    expect(fs.readFileSync(path.join(iterationsDir, 'graph-metadata.json'), 'utf-8')).toBe(beforeGraph);
  });

  it('finds nested iterations directories below research subtrees', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '913-research-backfill');
    writePacketRoot(specFolder);
    const nestedIterationsDir = createIterationDir(specFolder, path.join('014-memory-save-rewrite', '013-audit-snapshot'));

    const discovered = collectResearchIterationDirectories(specFolder);
    const summary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false });

    expect(discovered).toEqual([nestedIterationsDir]);
    expect(summary.descriptionCreated).toBe(1);
    expect(summary.graphCreated).toBe(1);
  });

  it('records directory traversal failures instead of crashing', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '914-research-backfill');
    writePacketRoot(specFolder);
    const iterationsDir = createIterationDir(specFolder, '004-blocked-topic');
    const blockedDir = path.join(specFolder, 'research', 'blocked');
    fs.mkdirSync(blockedDir, { recursive: true });
    const originalReaddirSync = fs.readdirSync;
    vi.spyOn(fs, 'readdirSync').mockImplementation((target, options) => {
      if (path.resolve(String(target)) === path.resolve(blockedDir)) {
        const permissionError = new Error('permission denied');
        Object.assign(permissionError, { code: 'EACCES' });
        throw permissionError;
      }
      return originalReaddirSync.call(fs, target, options as never);
    });

    const summary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: false });

    expect(summary.failed).toBe(1);
    expect(summary.failures[0]).toEqual(expect.objectContaining({
      directory: blockedDir,
      error: expect.stringContaining('permission denied'),
    }));
    expect(fs.existsSync(path.join(iterationsDir, 'description.json'))).toBe(true);
  });

  it('supports dry-run and empty-research detection without writing files', () => {
    const root = makeWorkspace();
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '915-research-backfill');
    writePacketRoot(specFolder);
    const iterationsDir = createIterationDir(specFolder, '005-dry-run');

    const dryRunSummary = runBackfillResearchMetadata({ specFolderPath: specFolder, dryRun: true });
    expect(hasResearchIterationDirectories(specFolder)).toBe(true);
    expect(dryRunSummary.descriptionCreated).toBe(1);
    expect(dryRunSummary.graphCreated).toBe(1);
    expect(fs.existsSync(path.join(iterationsDir, 'description.json'))).toBe(false);
    expect(fs.existsSync(path.join(iterationsDir, 'graph-metadata.json'))).toBe(false);

    const emptySpecFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '916-no-research');
    writePacketRoot(emptySpecFolder);
    expect(hasResearchIterationDirectories(emptySpecFolder)).toBe(false);
    expect(runBackfillResearchMetadata({ specFolderPath: emptySpecFolder, dryRun: false }).iterationDirectories).toEqual([]);
  });
});
