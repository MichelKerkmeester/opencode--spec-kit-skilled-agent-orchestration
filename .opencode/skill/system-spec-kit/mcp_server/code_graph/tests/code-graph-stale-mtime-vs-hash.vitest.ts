// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Stale-Detection Mtime-vs-Hash Tests
// ───────────────────────────────────────────────────────────────
// F-014-C4-01: isFileStale + ensureFreshFiles must hash on mtime drift
// before declaring a file stale. A touch (mtime drift, content unchanged)
// stays fresh; only a real content change flips the file to stale.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  closeDb,
  ensureFreshFiles,
  initDb,
  isFileStale,
  upsertFile,
} from '../lib/code-graph-db.js';
import { generateContentHash } from '../lib/indexer-types.js';

function writeWorkspaceFile(rootDir: string, relativePath: string, content: string): string {
  const filePath = join(rootDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
});

describe('F-014-C4-01: hash on mtime drift before declaring stale', () => {
  it('treats touch-only changes (mtime drift, content unchanged) as fresh', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-touch-fresh-'));
    try {
      initDb(tempDir);
      const content = 'export const x = 1;\n';
      const filePath = writeWorkspaceFile(tempDir, 'touch.ts', content);
      const t0 = new Date('2026-01-01T00:00:00.000Z');
      utimesSync(filePath, t0, t0);

      // Index the file at t0
      upsertFile(
        filePath,
        'typescript',
        generateContentHash(content),
        0,
        0,
        'clean',
        1,
      );

      // Now "touch" the file: change mtime, content stays the same
      const t1 = new Date('2026-01-02T00:00:00.000Z');
      utimesSync(filePath, t1, t1);
      expect(Math.trunc(statSync(filePath).mtimeMs)).toBe(Math.trunc(t1.getTime()));

      // F-014-C4-01: touch-only must NOT be stale. Content hash matches
      // even though the mtime drifted.
      expect(isFileStale(filePath)).toBe(false);

      const sweep = ensureFreshFiles([filePath]);
      expect(sweep.fresh).toContain(filePath);
      expect(sweep.stale).not.toContain(filePath);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('still flags real content changes as stale', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-touch-real-'));
    try {
      initDb(tempDir);
      const filePath = writeWorkspaceFile(tempDir, 'real.ts', 'export const x = 1;\n');
      const t0 = new Date('2026-01-01T00:00:00.000Z');
      utimesSync(filePath, t0, t0);

      upsertFile(
        filePath,
        'typescript',
        generateContentHash('export const x = 1;\n'),
        0,
        0,
        'clean',
        1,
      );

      // Real content change
      writeFileSync(filePath, 'export const x = 2;\n');
      const t1 = new Date('2026-01-02T00:00:00.000Z');
      utimesSync(filePath, t1, t1);

      // Content hash differs → MUST be stale even though we hash before
      // declaring stale.
      expect(isFileStale(filePath)).toBe(true);
      const sweep = ensureFreshFiles([filePath]);
      expect(sweep.stale).toContain(filePath);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('treats missing-from-DB as stale (unchanged behavior)', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-touch-unknown-'));
    try {
      initDb(tempDir);
      const filePath = writeWorkspaceFile(tempDir, 'unknown.ts', 'export const x = 1;\n');
      // File exists on disk but has NEVER been indexed
      expect(isFileStale(filePath)).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
