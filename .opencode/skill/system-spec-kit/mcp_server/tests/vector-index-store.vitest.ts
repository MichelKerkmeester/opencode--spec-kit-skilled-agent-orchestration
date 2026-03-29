import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  clearConstitutionalCache,
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

function insertConstitutionalMemory(
  db: ReturnType<typeof initializeDb>,
  specFolder: string,
  id: number,
  title: string,
  filePath: string,
): void {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases,
      importance_tier, importance_weight, created_at, updated_at, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    specFolder,
    filePath,
    title,
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
  `).run(`${specFolder}::${id}`, id, id, now);
}

describe('vector-index-store constitutional cache isolation', () => {
  const originalEmbeddingDim = process.env.EMBEDDING_DIM;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;

  afterEach(() => {
    clearConstitutionalCache();
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

  it('does not leak constitutional cache entries across active database switches', () => {
    const firstDbPaths = createTempDbPath('constitutional-cache-db-a');
    const secondDbPaths = createTempDbPath('constitutional-cache-db-b');
    process.env.MEMORY_ALLOWED_PATHS = [firstDbPaths.dir, secondDbPaths.dir].join(path.delimiter);
    process.env.EMBEDDING_DIM = '1024';

    try {
      const specFolder = 'specs/cache-isolation';
      const dbA = initializeDb(firstDbPaths.dbPath);
      insertConstitutionalMemory(
        dbA,
        specFolder,
        5101,
        'Constitutional Rule A',
        path.join(firstDbPaths.dir, 'constitutional-a.md'),
      );

      const cachedFromA = get_constitutional_memories(dbA, specFolder, false);
      expect(cachedFromA).toHaveLength(1);
      expect(cachedFromA[0]?.title).toBe('Constitutional Rule A');

      const dbB = initializeDb(secondDbPaths.dbPath);
      insertConstitutionalMemory(
        dbB,
        specFolder,
        6202,
        'Constitutional Rule B',
        path.join(secondDbPaths.dir, 'constitutional-b.md'),
      );

      const fromB = get_constitutional_memories(dbB, specFolder, false);
      expect(fromB).toHaveLength(1);
      expect(fromB[0]?.title).toBe('Constitutional Rule B');
      expect(fromB[0]?.id).toBe(6202);
    } finally {
      removeTempDir(firstDbPaths.dir);
      removeTempDir(secondDbPaths.dir);
    }
  });
});
