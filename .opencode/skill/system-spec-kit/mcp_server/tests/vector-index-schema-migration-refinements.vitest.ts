import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createSchema,
  ensureSchemaVersion,
  migrateConstitutionalTier,
  runMigrations,
  validateBackwardCompatibility,
} from '../lib/search/vector-index-schema';

function createTestDatabase(): Database.Database {
  const database = new Database(':memory:');
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 4,
  });
  ensureSchemaVersion(database);
  return database;
}

describe('vector-index schema migration refinements', () => {
  const openDatabases = new Set<Database.Database>();

  afterEach(() => {
    for (const database of openDatabases) {
      database.close();
      openDatabases.delete(database);
    }
  });

  it('keeps schema_version unchanged when a required migration index build fails', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP INDEX IF EXISTS idx_quality_score');
    database.prepare('UPDATE schema_version SET version = 14 WHERE id = 1').run();

    const originalExec = database.exec.bind(database);
    (database as Database.Database & { exec: typeof database.exec }).exec = ((sql: string) => {
      if (sql.includes('CREATE INDEX IF NOT EXISTS idx_quality_score')) {
        throw new Error('simulated idx_quality_score failure');
      }
      return originalExec(sql);
    }) as typeof database.exec;

    expect(() => ensureSchemaVersion(database)).toThrow(/simulated idx_quality_score failure/);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(14);

    const compatibility = validateBackwardCompatibility(database);
    expect(compatibility.compatible).toBe(false);
    expect(compatibility.missingIndexes).toContain('idx_quality_score');
  });

  it('canonicalizes session and history spec folders during the v23 upgrade', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    const staleSpecFolder = 'current';
    const canonicalSpecFolder = '02--domain/010-feature';
    const filePath = '/workspace/specs/02--domain/010-feature/memory/note.md';
    const now = '2026-03-28T12:00:00.000Z';

    database.exec(`
      CREATE TABLE IF NOT EXISTS session_state (
        session_id TEXT PRIMARY KEY,
        spec_folder TEXT
      )
    `);

    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, title, created_at, updated_at,
        importance_tier, context_type, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      101,
      staleSpecFolder,
      filePath,
      'Migration Target',
      now,
      now,
      'normal',
      'general',
      'pending',
    );

    database.prepare(`
      INSERT INTO memory_history (
        id, memory_id, spec_folder, prev_value, new_value, event, actor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('history-null-folder', 101, null, null, 'seed', 'ADD', 'system');
    database.prepare(`
      INSERT INTO memory_history (
        id, memory_id, spec_folder, prev_value, new_value, event, actor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('history-stale-folder', 101, staleSpecFolder, 'before', 'after', 'UPDATE', 'system');
    database.prepare('INSERT INTO session_state (session_id, spec_folder) VALUES (?, ?)').run('session-1', staleSpecFolder);

    database.prepare('UPDATE schema_version SET version = 22 WHERE id = 1').run();

    ensureSchemaVersion(database);

    const memoryRow = database.prepare('SELECT spec_folder FROM memory_index WHERE id = ?').get(101) as { spec_folder: string };
    const sessionRow = database.prepare('SELECT spec_folder FROM session_state WHERE session_id = ?').get('session-1') as { spec_folder: string };
    const historyRows = database.prepare(`
      SELECT id, spec_folder FROM memory_history WHERE memory_id = ? ORDER BY id
    `).all(101) as Array<{ id: string; spec_folder: string | null }>;

    expect(memoryRow.spec_folder).toBe(canonicalSpecFolder);
    expect(sessionRow.spec_folder).toBe(canonicalSpecFolder);
    expect(historyRows).toEqual([
      { id: 'history-null-folder', spec_folder: canonicalSpecFolder },
      { id: 'history-stale-folder', spec_folder: canonicalSpecFolder },
    ]);
  });

  it('creates trigger-cache and temporal-contiguity indexes during the v24 upgrade', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP INDEX IF EXISTS idx_trigger_cache_source');
    database.exec('DROP INDEX IF EXISTS idx_spec_folder_created_at');
    database.prepare('UPDATE schema_version SET version = 23 WHERE id = 1').run();

    ensureSchemaVersion(database);

    const indexNames = (database.prepare('PRAGMA index_list(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name);

    expect(indexNames).toEqual(expect.arrayContaining([
      'idx_trigger_cache_source',
      'idx_spec_folder_created_at',
    ]));
  });

  it('fails fast on legacy memory_index schemas that cannot store constitutional tier values', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('critical', 'important', 'normal', 'temporary', 'deprecated')),
        context_type TEXT DEFAULT 'general',
        session_id TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    expect(() => migrateConstitutionalTier(database)).toThrow(/constitutional support/i);
  });

  it('preserves legacy memory_conflicts audit rows when upgrading to the unified v12 schema', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY
      );

      CREATE TABLE memory_conflicts (
        id INTEGER PRIMARY KEY,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        new_memory_hash TEXT NOT NULL,
        existing_memory_id INTEGER,
        similarity_score REAL,
        action TEXT,
        contradiction_detected INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
      );
    `);

    database.prepare('INSERT INTO memory_index (id) VALUES (?)').run(7);
    database.prepare(`
      INSERT INTO memory_conflicts (
        id, timestamp, new_memory_hash, existing_memory_id,
        similarity_score, action, contradiction_detected, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      '2026-03-27T10:00:00.000Z',
      'hash-1',
      7,
      0.91,
      'UPDATE',
      1,
      'legacy note',
    );

    runMigrations(database, 11, 12);

    const columns = (database.prepare('PRAGMA table_info(memory_conflicts)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toContain('similarity');
    expect(columns).toContain('reason');
    expect(columns).not.toContain('similarity_score');
    expect(columns).not.toContain('notes');

    const row = database.prepare(`
      SELECT id, timestamp, new_memory_hash, existing_memory_id, similarity, reason, contradiction_detected
      FROM memory_conflicts
      WHERE id = 1
    `).get() as {
      id: number;
      timestamp: string;
      new_memory_hash: string;
      existing_memory_id: number;
      similarity: number;
      reason: string | null;
      contradiction_detected: number;
    };

    expect(row).toEqual({
      id: 1,
      timestamp: '2026-03-27T10:00:00.000Z',
      new_memory_hash: 'hash-1',
      existing_memory_id: 7,
      similarity: 0.91,
      reason: 'legacy note',
      contradiction_detected: 1,
    });
  });

  it('migrates legacy embedding_cache primary keys so dimension variants can coexist', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec(`
      DROP TABLE embedding_cache;
      CREATE TABLE embedding_cache (
        content_hash TEXT NOT NULL,
        model_id TEXT NOT NULL,
        embedding BLOB NOT NULL,
        dimensions INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (content_hash, model_id)
      );
    `);

    database.prepare(`
      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('hash-1', 'model-A', Buffer.from([1, 2, 3]), 768, '2026-03-28T12:00:00.000Z', '2026-03-28T12:00:00.000Z');

    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });

    const tableSql = database.prepare(`
      SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'embedding_cache'
    `).get() as { sql: string };
    expect(tableSql.sql).toMatch(/PRIMARY KEY \(content_hash, model_id, dimensions\)/);

    database.prepare(`
      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('hash-1', 'model-A', Buffer.from([4, 5, 6]), 1024, '2026-03-28T12:01:00.000Z', '2026-03-28T12:01:00.000Z');

    const rows = database.prepare(`
      SELECT dimensions
      FROM embedding_cache
      WHERE content_hash = ? AND model_id = ?
      ORDER BY dimensions ASC
    `).all('hash-1', 'model-A') as Array<{ dimensions: number }>;
    expect(rows).toEqual([{ dimensions: 768 }, { dimensions: 1024 }]);
  });

  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    const indexes = database.prepare(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type = 'index'
        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
      ORDER BY name
    `).all() as Array<{ name: string; sql: string | null }>;

    expect(indexes).toHaveLength(2);
    expect(indexes).toEqual([
      expect.objectContaining({
        name: 'idx_save_parent_canonical_path',
        sql: expect.stringContaining('WHERE parent_id IS NULL'),
      }),
      expect.objectContaining({
        name: 'idx_save_parent_content_hash_scope',
        sql: expect.stringContaining('WHERE parent_id IS NULL'),
      }),
    ]);
    expect(indexes[0]?.sql).toContain('spec_folder, canonical_file_path, id DESC');
    expect(indexes[1]?.sql).toContain('spec_folder');
    expect(indexes[1]?.sql).toContain('content_hash');
    expect(indexes[1]?.sql).toContain('embedding_status');
    expect(indexes[1]?.sql).toContain('shared_space_id');
    expect(indexes[1]?.sql).toContain('id DESC');
  });
});
