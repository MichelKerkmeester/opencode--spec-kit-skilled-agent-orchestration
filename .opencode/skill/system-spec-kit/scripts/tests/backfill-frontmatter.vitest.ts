import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { collectSpecFiles, collectTemplateFiles, discoverSpecsRoots } from '../memory/backfill-frontmatter';

const tempRoots = new Set<string>();
const blockedDirs = new Set<string>();

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const dir of blockedDirs) {
    try {
      fs.chmodSync(dir, 0o755);
    } catch {
      // Ignore cleanup races for temp fixtures.
    }
  }
  blockedDirs.clear();
  for (const dir of tempRoots) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempRoots.clear();
});

describe('backfill-frontmatter skipped directory handling', () => {
  it('records unreadable directories while discovering specs roots', () => {
    const root = makeTempDir('speckit-backfill-discover-');
    const blockedDir = path.join(root, 'blocked');
    const specsDir = path.join(root, 'nested', 'specs');

    fs.mkdirSync(blockedDir, { recursive: true });
    fs.mkdirSync(specsDir, { recursive: true });
    fs.chmodSync(blockedDir, 0o000);
    blockedDirs.add(blockedDir);

    const skippedDirs: Array<{ dirPath: string; error: string }> = [];
    const roots = discoverSpecsRoots(root, skippedDirs);

    expect(roots).toEqual([specsDir]);
    expect(skippedDirs).toEqual([
      expect.objectContaining({
        dirPath: blockedDir,
        error: expect.stringContaining('permission denied'),
      }),
    ]);
  });

  it('records unreadable directories while collecting template files', () => {
    const root = makeTempDir('speckit-backfill-templates-');
    const blockedDir = path.join(root, 'blocked');
    const readableDir = path.join(root, 'readable');
    const templateFile = path.join(readableDir, 'spec.md');

    fs.mkdirSync(blockedDir, { recursive: true });
    fs.mkdirSync(readableDir, { recursive: true });
    fs.writeFileSync(templateFile, '# Template\n', 'utf-8');
    fs.chmodSync(blockedDir, 0o000);
    blockedDirs.add(blockedDir);

    const skippedDirs: Array<{ dirPath: string; error: string }> = [];
    const files = collectTemplateFiles(root, skippedDirs);

    expect(files).toEqual([templateFile]);
    expect(skippedDirs).toEqual([
      expect.objectContaining({
        dirPath: blockedDir,
        error: expect.stringContaining('permission denied'),
      }),
    ]);
  });

  it('records unreadable directories while collecting spec files', () => {
    const root = makeTempDir('speckit-backfill-specs-');
    const blockedDir = path.join(root, 'blocked');
    const memoryDir = path.join(root, 'memory');
    const memoryFile = path.join(memoryDir, 'context.md');

    fs.mkdirSync(blockedDir, { recursive: true });
    fs.mkdirSync(memoryDir, { recursive: true });
    fs.writeFileSync(memoryFile, '# Memory\n', 'utf-8');
    fs.chmodSync(blockedDir, 0o000);
    blockedDirs.add(blockedDir);

    const skippedDirs: Array<{ dirPath: string; error: string }> = [];
    const files = collectSpecFiles(root, true, skippedDirs);

    expect(files).toEqual([memoryFile]);
    expect(skippedDirs).toEqual([
      expect.objectContaining({
        dirPath: blockedDir,
        error: expect.stringContaining('permission denied'),
      }),
    ]);
  });
});
