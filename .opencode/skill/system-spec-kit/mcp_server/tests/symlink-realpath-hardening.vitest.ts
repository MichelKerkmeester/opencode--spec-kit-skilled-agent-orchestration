import BetterSqlite3 from 'better-sqlite3';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

function writeFixture(root: string, relativePath: string, content = '# fixture\n'): string {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

function createSymlinkFixtures() {
  const root = mkdtempSync(join(tmpdir(), 'symlink-hardening-'));
  const blockedTarget = writeFixture(root, 'z_future/evil.md', '# blocked\n');
  const safeSpecPath = join(
    root,
    '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md',
  );
  mkdirSync(dirname(safeSpecPath), { recursive: true });
  symlinkSync(blockedTarget, safeSpecPath);
  return { root, blockedTarget, safeSpecPath };
}

function createCodeGraphSymlinkFixtures() {
  const root = mkdtempSync(join(tmpdir(), 'symlink-hardening-code-graph-'));
  const blockedTarget = writeFixture(root, 'z_future/blocked.ts', 'export const blocked = true;\n');
  const safeFilePath = join(root, 'src', 'safe.ts');
  mkdirSync(dirname(safeFilePath), { recursive: true });
  symlinkSync(blockedTarget, safeFilePath);
  return { root, safeFilePath };
}

function setupIndexerMocks(): void {
  vi.resetModules();
  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    isFileStale: vi.fn(() => true),
  }));
  process.env.SPECKIT_PARSER = 'regex';
}

afterEach(() => {
  delete process.env.SPECKIT_PARSER;
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('realpath hardening for symlinked paths', () => {
  it('blocks memory_save when a safe-looking spec path resolves into z_future', async () => {
    const { root, safeSpecPath } = createSymlinkFixtures();
    const database = new BetterSqlite3(':memory:');

    try {
      vi.doMock('../core/index.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../core/index.js')>();
        return {
          ...actual,
          checkDatabaseUpdated: vi.fn(async () => false),
        };
      });

      vi.doMock('../utils/validators.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/validators.js')>();
        return {
          ...actual,
          createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
        };
      });

      vi.doMock('../utils/index.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/index.js')>();
        return {
          ...actual,
          requireDb: vi.fn(() => database),
        };
      });

      const { handleMemorySave } = await import('../handlers/memory-save.js');

      await expect(handleMemorySave({ filePath: safeSpecPath })).rejects.toThrow(/z_future/);
    } finally {
      database.close();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('skips code-graph specificFiles entries when the symlink target resolves into z_future', async () => {
    setupIndexerMocks();
    const { root, safeFilePath } = createCodeGraphSymlinkFixtures();

    try {
      const { getDefaultConfig } = await import('../code_graph/lib/indexer-types.js');
      const { indexFiles } = await import('../code_graph/lib/structural-indexer.js');

      const results = await indexFiles({
        ...getDefaultConfig(root),
        includeGlobs: ['**/*.ts'],
        languages: ['typescript'],
        specificFiles: [safeFilePath],
      });

      const indexedPaths = results.map((result) => relative(root, result.filePath).replace(/\\/g, '/'));
      expect(indexedPaths).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
