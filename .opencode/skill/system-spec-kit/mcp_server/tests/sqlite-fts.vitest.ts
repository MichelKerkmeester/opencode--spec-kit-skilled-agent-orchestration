// TEST: SQLite FTS5 BM25 Search (C138-P2)
// Verifies weighted BM25 scoring via FTS5 bm25() function.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  fts5Bm25Search,
  getLastLexicalCapabilitySnapshot,
  isFts5Available,
  FTS5_BM25_WEIGHTS,
  probeFts5Capability,
  resetLastLexicalCapabilitySnapshot,
} from '../lib/search/sqlite-fts';

let db: Database.Database;

describe('C138-P2 SQLite FTS5 BM25 Search', () => {
  beforeEach(() => {
    resetLastLexicalCapabilitySnapshot();
    db = new Database(':memory:');

    // Create memory_index table
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        trigger_phrases TEXT,
        content_text TEXT,
        file_path TEXT,
        spec_folder TEXT,
        is_archived INTEGER DEFAULT 0,
        importance_tier TEXT DEFAULT NULL
      );
    `);

    // Create FTS5 virtual table matching production column order
    db.exec(`
      CREATE VIRTUAL TABLE memory_fts USING fts5(
        title,
        trigger_phrases,
        content_text,
        file_path,
        content='memory_index',
        content_rowid='id'
      );
    `);

    // Insert test documents
    db.exec(`
      INSERT INTO memory_index (id, title, trigger_phrases, content_text, file_path, spec_folder, is_archived)
      VALUES
        (1, 'Authentication Flow', 'login auth', 'User login flow for the application', '/specs/auth.md', 'auth-spec', 0),
        (2, 'Database Schema', 'schema db', 'Database migration and schema design', '/specs/db.md', 'db-spec', 0),
        (3, 'Login Bug Fix', 'login fix', 'Fixed the login redirect issue', '/specs/fix.md', 'auth-spec', 0),
        (4, 'Archived Memory', 'old data', 'This memory is archived', '/specs/old.md', 'old-spec', 1);
    `);

    // Populate FTS index
    db.exec(`
      INSERT INTO memory_fts (rowid, title, trigger_phrases, content_text, file_path)
      SELECT id, title, trigger_phrases, content_text, file_path FROM memory_index;
    `);
  });

  afterEach(() => {
    db.close();
  });

  // ---- T1: FTS5 table detection ----
  it('T1: isFts5Available detects memory_fts table', () => {
    expect(isFts5Available(db)).toBe(true);
  });

  it('T1b: isFts5Available returns false when table missing', () => {
    const emptyDb = new Database(':memory:');
    expect(isFts5Available(emptyDb)).toBe(false);
    emptyDb.close();
  });

  // ---- T2: BM25 weights are correct ----
  it('T2: FTS5_BM25_WEIGHTS has correct values', () => {
    expect(FTS5_BM25_WEIGHTS[0]).toBe(10.0); // title
    expect(FTS5_BM25_WEIGHTS[1]).toBe(5.0);  // trigger_phrases
    expect(FTS5_BM25_WEIGHTS[2]).toBe(2.0);  // file_path
    expect(FTS5_BM25_WEIGHTS[3]).toBe(1.0);  // content_text
  });

  // ---- T3: Basic BM25 search returns results ----
  it('T3: fts5Bm25Search returns matching results', () => {
    const results = fts5Bm25Search(db, 'login');
    expect(results.length).toBeGreaterThan(0);
    // Should find auth flow and login bug fix
    const ids = results.map(r => r.id);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });

  // ---- T4: Title match scores higher than content match ----
  it('T4: title match scores higher due to 10x weight', () => {
    const results = fts5Bm25Search(db, 'authentication');
    expect(results.length).toBeGreaterThan(0);
    // The "Authentication Flow" title match should rank first
    expect(results[0].id).toBe(1);
    expect(results[0].fts_score).toBeGreaterThan(0);
  });

  // ---- T5: specFolder filter works ----
  it('T5: specFolder filter restricts results', () => {
    const results = fts5Bm25Search(db, 'login', { specFolder: 'db-spec' });
    // No login results in db-spec
    expect(results.length).toBe(0);
  });

  // ---- T6: Archived compatibility flag is inert after cleanup ----
  it('T6: archived matches remain retrievable without a default exclusion branch', () => {
    const results = fts5Bm25Search(db, 'archived');
    const ids = results.map(r => r.id);
    expect(ids).toContain(4);
  });

  it('T6b: includeArchived preserves the same FTS result set after archived-branch cleanup', () => {
    const baselineIds = fts5Bm25Search(db, 'archived').map(r => r.id);
    const compatibilityIds = fts5Bm25Search(db, 'archived', { includeArchived: true }).map(r => r.id);
    expect(compatibilityIds).toEqual(baselineIds);
  });

  // ---- T7: Empty query returns empty ----
  it('T7: empty query returns empty array', () => {
    const results = fts5Bm25Search(db, '');
    expect(results).toEqual([]);
  });

  // ---- T8: Limit parameter works ----
  it('T8: limit parameter caps result count', () => {
    const results = fts5Bm25Search(db, 'login', { limit: 1 });
    expect(results.length).toBeLessThanOrEqual(1);
  });

  // ---- T9: Scores are positive (negated from bm25) ----
  it('T9: fts_score values are positive numbers', () => {
    const results = fts5Bm25Search(db, 'login');
    for (const r of results) {
      expect(r.fts_score).toBeGreaterThanOrEqual(0);
    }
  });

  // ---- T10: Results are sorted by score descending ----
  it('T10: results are sorted by fts_score descending', () => {
    const results = fts5Bm25Search(db, 'login');
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].fts_score).toBeGreaterThanOrEqual(results[i + 1].fts_score);
    }
  });

  it('T11: successful FTS search records lexicalPath=fts5 and fallbackState=ok', () => {
    fts5Bm25Search(db, 'login');
    expect(getLastLexicalCapabilitySnapshot()).toEqual({
      lexicalPath: 'fts5',
      fallbackState: 'ok',
    });
  });

  it('T12: forced degrade compile_probe_miss records an unavailable lexical lane without changing array shape', () => {
    const compileProbeMissDb = {
      prepare(sql: string) {
        if (sql === 'PRAGMA compile_options') {
          return {
            all: () => [{ compile_options: 'ENABLE_JSON1' }],
          };
        }

        throw new Error(`Unexpected SQL for compile probe miss test: ${sql}`);
      },
    } as unknown as Database.Database;

    const results = fts5Bm25Search(compileProbeMissDb, 'login');
    expect(results).toEqual([]);
    expect(Array.isArray(results)).toBe(true);
    expect(getLastLexicalCapabilitySnapshot()).toEqual({
      lexicalPath: 'unavailable',
      fallbackState: 'compile_probe_miss',
    });
  });

  it('T13: forced degrade missing_table records missing_table after a successful compile probe', () => {
    const missingTableDb = new Database(':memory:');
    missingTableDb.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        trigger_phrases TEXT,
        content_text TEXT,
        file_path TEXT,
        spec_folder TEXT,
        is_archived INTEGER DEFAULT 0,
        importance_tier TEXT DEFAULT NULL
      );
    `);

    expect(probeFts5Capability(missingTableDb)).toEqual({
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    });
    expect(fts5Bm25Search(missingTableDb, 'login')).toEqual([]);
    expect(getLastLexicalCapabilitySnapshot()).toEqual({
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    });

    missingTableDb.close();
  });

  it('T14: forced degrade no_such_module_fts5 records engine-level failure explicitly', () => {
    const noSuchModuleDb = {
      prepare(sql: string) {
        if (sql === 'PRAGMA compile_options') {
          return {
            all: () => [{ compile_options: 'ENABLE_FTS5' }],
          };
        }
        if (sql.includes("sqlite_master")) {
          return {
            get: () => ({ name: 'memory_fts' }),
          };
        }
        if (sql.includes('FROM memory_fts')) {
          return {
            all: () => {
              throw new Error('no such module: fts5');
            },
          };
        }

        throw new Error(`Unexpected SQL for no-such-module test: ${sql}`);
      },
    } as unknown as Database.Database;

    expect(fts5Bm25Search(noSuchModuleDb, 'login')).toEqual([]);
    expect(getLastLexicalCapabilitySnapshot()).toEqual({
      lexicalPath: 'unavailable',
      fallbackState: 'no_such_module_fts5',
    });
  });

  it('T15: forced degrade bm25_runtime_failure records ranking failure explicitly', () => {
    const bm25FailureDb = {
      prepare(sql: string) {
        if (sql === 'PRAGMA compile_options') {
          return {
            all: () => [{ compile_options: 'ENABLE_FTS5' }],
          };
        }
        if (sql.includes("sqlite_master")) {
          return {
            get: () => ({ name: 'memory_fts' }),
          };
        }
        if (sql.includes('FROM memory_fts')) {
          return {
            all: () => {
              throw new Error('unable to use function bm25 in the requested context');
            },
          };
        }

        throw new Error(`Unexpected SQL for bm25 runtime failure test: ${sql}`);
      },
    } as unknown as Database.Database;

    expect(fts5Bm25Search(bm25FailureDb, 'login')).toEqual([]);
    expect(getLastLexicalCapabilitySnapshot()).toEqual({
      lexicalPath: 'unavailable',
      fallbackState: 'bm25_runtime_failure',
    });
  });
});
