import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  closeDb,
  initDb,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph/code-graph-db.js';
import type { CodeNode } from '../lib/code-graph/indexer-types.js';
import { resolveSeed } from '../lib/code-graph/seed-resolver.js';

describe('code graph seed resolver', () => {
  let tempDir = '';
  let filePath = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-graph-seed-resolver-'));
    filePath = path.join(tempDir, 'example.ts');
    fs.writeFileSync(filePath, 'export function sample() { return 1; }\n');
    initDb(tempDir);
  });

  afterEach(() => {
    try {
      closeDb();
    } catch {
      // best-effort cleanup for tests that intentionally close the DB
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('resolves to a near-exact node within five lines', () => {
    const node: CodeNode = {
      symbolId: 'sample::function',
      filePath,
      fqName: 'sample',
      kind: 'function',
      name: 'sample',
      startLine: 10,
      endLine: 14,
      startColumn: 0,
      endColumn: 1,
      language: 'typescript',
      contentHash: 'hash-1',
    };

    const fileId = upsertFile(filePath, 'typescript', 'hash-1', 1, 0, 'clean', 5);
    replaceNodes(fileId, [node]);

    const ref = resolveSeed({ filePath, startLine: 13 });

    expect(ref.resolution).toBe('near_exact');
    expect(ref.symbolId).toBe(node.symbolId);
    expect(ref.startLine).toBe(10);
    expect(ref.confidence).toBeCloseTo(0.89, 5);
  });

  it('degrades to a file anchor after database is closed and auto-reinitialised empty', () => {
    closeDb();

    // After closeDb(), getDb() lazily re-initialises an empty DB via DATABASE_DIR.
    // The empty DB has no code_nodes rows, so resolveSeed falls through to file_anchor.
    const ref = resolveSeed({ filePath, startLine: 10 });

    expect(ref.resolution).toBe('file_anchor');
    expect(ref.confidence).toBeLessThan(0.5);
  });
});
