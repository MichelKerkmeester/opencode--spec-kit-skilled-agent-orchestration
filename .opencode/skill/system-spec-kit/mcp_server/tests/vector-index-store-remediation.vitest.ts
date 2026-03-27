import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  clearConstitutionalCache,
  clear_constitutional_cache,
  close_db,
  get_constitutional_memories,
  initializeDb,
} from '../lib/search/vector-index-store';

function createTempDbPath(label: string): { dir: string; dbPath: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  return {
    dir,
    dbPath: path.join(dir, `${label}.sqlite`),
  };
}

function removeTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('vector-index-store remediation regressions', () => {
  const originalEmbeddingDim = process.env.EMBEDDING_DIM;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;

  afterEach(() => {
    close_db();
    if (originalEmbeddingDim === undefined) {
      delete process.env.EMBEDDING_DIM;
    } else {
      process.env.EMBEDDING_DIM = originalEmbeddingDim;
    }
    if (originalAllowedPaths === undefined) {
      delete process.env.MEMORY_ALLOWED_PATHS;
    } else {
      process.env.MEMORY_ALLOWED_PATHS = originalAllowedPaths;
    }
  });

  it('does not leak empty constitutional results during same-key warmup reentry', () => {
    clear_constitutional_cache('specs/reentrant');

    let depth = 0;
    const row = {
      id: 1,
      trigger_phrases: '["rule"]',
      importance_tier: 'constitutional',
    };
    const fakeDb = {
      prepare: () => ({
        all: () => {
          if (depth === 0) {
            depth += 1;
            return get_constitutional_memories(fakeDb as unknown as Database.Database, 'specs/reentrant', false);
          }
          return [row];
        },
      }),
    } as unknown as Database.Database;

    const results = get_constitutional_memories(fakeDb, 'specs/reentrant', false);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ id: 1, isConstitutional: true });
  });

  it('clears folder-scoped constitutional cache entries for archived and non-archived keys', () => {
    const { dir, dbPath } = createTempDbPath('constitutional-cache');
    process.env.MEMORY_ALLOWED_PATHS = dir;
    process.env.EMBEDDING_DIM = '1024';

    try {
      const db = initializeDb(dbPath);
      const specFolder = 'specs/cache-scope';
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, trigger_phrases,
          importance_tier, importance_weight, created_at, updated_at, embedding_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        4001,
        specFolder,
        path.join(dir, 'constitutional.md'),
        'Constitutional Rule',
        '["rule"]',
        'constitutional',
        1,
        now,
        now,
        'success',
      );
      db.prepare(`
        INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
        VALUES (?, ?, ?, ?)
      `).run(`${specFolder}::constitutional`, 4001, 4001, now);

      clearConstitutionalCache(specFolder);
      expect(get_constitutional_memories(db, specFolder, false)).toHaveLength(1);

      db.prepare('UPDATE memory_index SET is_archived = 1 WHERE id = ?').run(4001);
      clearConstitutionalCache(specFolder);

      expect(get_constitutional_memories(db, specFolder, false)).toHaveLength(0);
      expect(get_constitutional_memories(db, specFolder, true)).toHaveLength(1);
    } finally {
      removeTempDir(dir);
    }
  });

  it('rejects custom-path initialization when vec_metadata dimensions do not match the active provider', () => {
    const { dir, dbPath } = createTempDbPath('dimension-mismatch');
    process.env.MEMORY_ALLOWED_PATHS = dir;
    process.env.EMBEDDING_DIM = '1024';

    try {
      initializeDb(dbPath);
      close_db();

      const seeded = new Database(dbPath);
      const metadata = seeded
        .prepare(`SELECT value FROM vec_metadata WHERE key = 'embedding_dim'`)
        .get() as { value: string } | undefined;
      seeded.close();

      if (!metadata) {
        return;
      }

      process.env.EMBEDDING_DIM = '1536';
      expect(() => initializeDb(dbPath)).toThrow(/Dimension mismatch|DIMENSION MISMATCH/i);
    } finally {
      removeTempDir(dir);
    }
  });
});
