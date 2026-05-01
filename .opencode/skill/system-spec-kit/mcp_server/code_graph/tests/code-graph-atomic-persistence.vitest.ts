// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Atomic Persistence Tests
// ───────────────────────────────────────────────────────────────
// F-002-A2-01: persistIndexedFileResult must wrap its 4 storage operations
// in a single per-file transaction. A throw mid-persistence rolls all four
// back atomically.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
import { persistIndexedFileResult } from '../lib/ensure-ready.js';
import * as graphDb from '../lib/code-graph-db.js';
import type { ParseResult } from '../lib/indexer-types.js';

function buildFakeParseResult(filePath: string): ParseResult {
  return {
    filePath,
    language: 'typescript',
    nodes: [
      {
        symbolId: 'sym-1',
        filePath,
        fqName: 'fakeFn',
        kind: 'function',
        name: 'fakeFn',
        startLine: 1,
        endLine: 5,
        startColumn: 0,
        endColumn: 0,
        language: 'typescript',
        signature: undefined,
        docstring: undefined,
        contentHash: 'aaaaaaaaaaaa',
      },
    ],
    edges: [],
    detectorProvenance: 'structured',
    contentHash: 'aaaaaaaaaaaa',
    parseHealth: 'clean',
    parseErrors: [],
    parseDurationMs: 1,
  };
}

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
  vi.restoreAllMocks();
});

describe('F-002-A2-01: atomic per-file persistence', () => {
  it('commits all 4 phases together on success', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-atomic-success-'));
    try {
      initDb(tempDir);
      const result = buildFakeParseResult(join(tempDir, 'success.ts'));

      persistIndexedFileResult(result);

      // After successful persistence: file row exists, nodes exist, mtime
      // is non-zero (finalize phase committed).
      const d = getDb();
      const fileRow = d.prepare('SELECT file_mtime_ms FROM code_files WHERE file_path = ?').get(result.filePath) as
        | { file_mtime_ms: number }
        | undefined;
      const nodeRows = d.prepare('SELECT COUNT(*) as c FROM code_nodes WHERE file_path = ?').all(result.filePath) as Array<{ c: number }>;
      expect(fileRow).toBeDefined();
      // mtime is the actual file mtime (finalize phase ran). The fake file
      // doesn't exist on disk so getCurrentFileMtimeMs returns null and the
      // helper falls back to 0 — that's still consistent with "finalize ran".
      expect(typeof fileRow!.file_mtime_ms).toBe('number');
      expect(nodeRows[0].c).toBe(1);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('rolls back all phases when replaceNodes throws', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-atomic-rollback-'));
    try {
      initDb(tempDir);
      const result = buildFakeParseResult(join(tempDir, 'rollback.ts'));

      // Force replaceNodes to throw mid-transaction
      const spy = vi.spyOn(graphDb, 'replaceNodes').mockImplementation(() => {
        throw new Error('synthetic mid-tx failure');
      });

      expect(() => persistIndexedFileResult(result)).toThrow('synthetic mid-tx failure');

      // After rollback: NO file row should exist (stage upsertFile rolled back)
      const d = getDb();
      const fileRow = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(result.filePath);
      expect(fileRow).toBeUndefined();

      const nodeRows = d.prepare('SELECT COUNT(*) as c FROM code_nodes WHERE file_path = ?').all(result.filePath) as Array<{ c: number }>;
      expect(nodeRows[0].c).toBe(0);

      spy.mockRestore();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('rolls back finalize phase failure too', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-atomic-finalize-'));
    try {
      initDb(tempDir);
      const result = buildFakeParseResult(join(tempDir, 'finalize.ts'));

      // Make the SECOND upsertFile call (the finalize phase) throw
      let upsertCallCount = 0;
      const realUpsert = graphDb.upsertFile;
      const spy = vi.spyOn(graphDb, 'upsertFile').mockImplementation(((...args: Parameters<typeof realUpsert>) => {
        upsertCallCount += 1;
        if (upsertCallCount === 2) {
          throw new Error('synthetic finalize failure');
        }
        return realUpsert(...args);
      }) as typeof realUpsert);

      expect(() => persistIndexedFileResult(result)).toThrow('synthetic finalize failure');

      // After rollback: stage upsert was inside the same transaction so it's
      // gone; nodes inserted between stage and finalize are also gone.
      const d = getDb();
      const fileRow = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(result.filePath);
      expect(fileRow).toBeUndefined();
      const nodeRows = d.prepare('SELECT COUNT(*) as c FROM code_nodes WHERE file_path = ?').all(result.filePath) as Array<{ c: number }>;
      expect(nodeRows[0].c).toBe(0);

      spy.mockRestore();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
