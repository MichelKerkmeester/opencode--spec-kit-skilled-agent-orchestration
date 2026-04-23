import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  closeDb,
  getDb,
  initDb,
  replaceNodes,
  upsertFile,
} from '../code-graph/lib/code-graph-db.js';
import type { CodeNode } from '../code-graph/lib/indexer-types.js';

let tempDir: string;

function createNode(symbolId: string, filePath: string, name: string): CodeNode {
  return {
    symbolId,
    filePath,
    fqName: name,
    kind: 'function',
    name,
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 10,
    language: 'typescript',
    signature: `function ${name}()`,
    contentHash: `hash-${name}`,
  };
}

function createFile(filePath: string): number {
  return upsertFile(
    filePath,
    'typescript',
    `hash-${filePath}`,
    1,
    0,
    'clean',
    1,
    { fileMtimeMs: 0 },
  );
}

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'code-graph-db-'));
  initDb(tempDir);
});

afterEach(() => {
  closeDb();
  rmSync(tempDir, { recursive: true, force: true });
});

describe('replaceNodes INSERT OR IGNORE (Layer 2)', () => {
  it('does not throw UNIQUE constraint when colliding symbol_id from another file_id is already in DB', () => {
    const firstFileId = createFile('/workspace/first.ts');
    const secondFileId = createFile('/workspace/second.ts');
    replaceNodes(firstFileId, [createNode('shared-symbol-id', '/workspace/first.ts', 'shared')]);

    expect(() => replaceNodes(secondFileId, [
      createNode('shared-symbol-id', '/workspace/second.ts', 'shared'),
    ])).not.toThrow();

    const rows = getDb().prepare(`
      SELECT file_id, file_path FROM code_nodes WHERE symbol_id = ?
    `).all('shared-symbol-id') as Array<{ file_id: number; file_path: string }>;
    const secondFileRows = getDb().prepare(`
      SELECT COUNT(*) AS count FROM code_nodes WHERE file_id = ? AND symbol_id = ?
    `).get(secondFileId, 'shared-symbol-id') as { count: number };

    expect(rows).toEqual([{ file_id: firstFileId, file_path: '/workspace/first.ts' }]);
    expect(secondFileRows.count).toBe(0);
  });

  it('still inserts non-conflicting nodes from same call', () => {
    const firstFileId = createFile('/workspace/first.ts');
    const secondFileId = createFile('/workspace/second.ts');
    replaceNodes(firstFileId, [createNode('shared-symbol-id', '/workspace/first.ts', 'shared')]);

    replaceNodes(secondFileId, [
      createNode('shared-symbol-id', '/workspace/second.ts', 'shared'),
      createNode('unique-symbol-id', '/workspace/second.ts', 'unique'),
    ]);

    const secondFileRows = getDb().prepare(`
      SELECT symbol_id FROM code_nodes WHERE file_id = ? ORDER BY symbol_id
    `).all(secondFileId) as Array<{ symbol_id: string }>;
    const sharedRows = getDb().prepare(`
      SELECT file_id FROM code_nodes WHERE symbol_id = ?
    `).all('shared-symbol-id') as Array<{ file_id: number }>;

    expect(secondFileRows).toEqual([{ symbol_id: 'unique-symbol-id' }]);
    expect(sharedRows).toEqual([{ file_id: firstFileId }]);
  });
});
