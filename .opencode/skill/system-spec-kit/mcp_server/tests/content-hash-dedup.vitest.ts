// ---------------------------------------------------------------
// MODULE: Test — SHA256 Content-Hash Dedup (TM-02)
// ---------------------------------------------------------------
// Verifies that the fast-path dedup check in indexMemoryFile()
// returns 'duplicate' for identical content (same spec_folder,
// same content_hash) and proceeds to embed for changed content.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as crypto from 'crypto';

/* -------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Create a minimal in-memory DB with the memory_index schema
 * needed for the content-hash dedup check.
 */
function createMinimalDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      embedding_status TEXT DEFAULT 'success',
      importance_tier TEXT DEFAULT 'normal',
      content_hash TEXT,
      content_text TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
  `);
  return db;
}

/**
 * Simulate the T054 dedup query as implemented in memory-save.ts.
 * Returns the duplicate row if found, else undefined.
 */
function checkContentHashDedup(
  db: Database.Database,
  specFolder: string,
  contentHash: string
): { id: number; file_path: string; title: string | null } | undefined {
  return db.prepare(`
    SELECT id, file_path, title FROM memory_index
    WHERE spec_folder = ?
      AND content_hash = ?
      AND embedding_status != 'pending'
    ORDER BY id DESC
    LIMIT 1
  `).get(specFolder, contentHash) as { id: number; file_path: string; title: string | null } | undefined;
}

/**
 * Insert a memory record as if it was already indexed (embedding_status='success').
 */
function insertIndexedMemory(
  db: Database.Database,
  specFolder: string,
  filePath: string,
  content: string,
  title?: string
): number {
  const hash = sha256(content);
  const result = db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title, content_hash, embedding_status)
    VALUES (?, ?, ?, ?, 'success')
  `).run(specFolder, filePath, title ?? null, hash);
  return result.lastInsertRowid as number;
}

/* -------------------------------------------------------------
   TESTS
---------------------------------------------------------------- */

describe('T054: SHA256 Content-Hash Dedup (TM-02)', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = createMinimalDb();
  });

  afterAll(() => {
    if (db) db.close();
  });

  /* -----------------------------------------------------------
     Core dedup logic
  ----------------------------------------------------------- */

  describe('Dedup Query Logic', () => {
    it('T054-1: Returns undefined when memory_index is empty', () => {
      const hash = sha256('some content');
      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
      expect(result).toBeUndefined();
    });

    it('T054-2: Returns undefined when spec_folder does not match', () => {
      const content = 'Unique content for T054-2 test case';
      const hash = sha256(content);
      insertIndexedMemory(db, 'specs/other-folder', '/path/to/memory/file.md', content);

      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
      expect(result).toBeUndefined();
    });

    it('T054-3: Detects duplicate when same content saved under different file path', () => {
      const content = 'This is duplicate content saved under two different paths.';
      const hash = sha256(content);

      // Insert original under path-A
      const originalId = insertIndexedMemory(
        db,
        'specs/dedup-test',
        '/specs/dedup-test/memory/original.md',
        content,
        'Original Memory'
      );

      // Now check as if saving the same content under path-B
      const result = checkContentHashDedup(db, 'specs/dedup-test', hash);

      expect(result).toBeDefined();
      expect(result!.id).toBe(originalId);
      expect(result!.file_path).toBe('/specs/dedup-test/memory/original.md');
    });

    it('T054-4: Changing 1 character produces a different hash — dedup does NOT trigger', () => {
      const originalContent = 'The quick brown fox jumps over the lazy dog.';
      const modifiedContent = 'The quick brown fox jumps over the lazy dog!'; // period -> exclamation

      const originalHash = sha256(originalContent);
      const modifiedHash = sha256(modifiedContent);

      // Sanity check: hashes differ
      expect(originalHash).not.toBe(modifiedHash);

      // Insert original
      insertIndexedMemory(
        db,
        'specs/changed-content',
        '/specs/changed-content/memory/doc.md',
        originalContent
      );

      // Query with modified hash — should NOT find a duplicate
      const result = checkContentHashDedup(db, 'specs/changed-content', modifiedHash);
      expect(result).toBeUndefined();
    });

    it('T054-5: Pending embeddings are excluded from dedup check', () => {
      const content = 'Content with a pending embedding status.';
      const hash = sha256(content);

      // Insert with embedding_status='pending' — should NOT be matched
      db.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
        VALUES (?, ?, ?, 'pending')
      `).run('specs/pending-test', '/specs/pending-test/memory/pending.md', hash);

      const result = checkContentHashDedup(db, 'specs/pending-test', hash);
      expect(result).toBeUndefined();
    });

    it('T054-6: Returns most recent record (highest id) for multiple matches', () => {
      const content = 'Repeated content saved multiple times.';
      const hash = sha256(content);
      const folder = 'specs/multi-match';

      const id1 = insertIndexedMemory(db, folder, '/path/a.md', content);
      const id2 = insertIndexedMemory(db, folder, '/path/b.md', content);

      const result = checkContentHashDedup(db, folder, hash);
      expect(result).toBeDefined();
      // Should return the most recently inserted (highest id)
      expect(result!.id).toBe(id2);
      expect(result!.id).toBeGreaterThan(id1);
    });
  });

  /* -----------------------------------------------------------
     SHA256 hash computation
  ----------------------------------------------------------- */

  describe('SHA256 Hash Properties', () => {
    it('T054-7: SHA256 of identical strings always produces the same hash', () => {
      const content = 'Deterministic content for hash test.';
      const h1 = sha256(content);
      const h2 = sha256(content);
      expect(h1).toBe(h2);
    });

    it('T054-8: SHA256 produces 64-character hex string', () => {
      const hash = sha256('any content');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('T054-9: Whitespace-only change produces a different hash', () => {
      const h1 = sha256('hello world');
      const h2 = sha256('hello  world'); // extra space
      expect(h1).not.toBe(h2);
    });

    it('T054-10: Empty string has a known SHA256 hash', () => {
      const hash = sha256('');
      // SHA256 of empty string is well-known
      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  /* -----------------------------------------------------------
     Return value shape
  ----------------------------------------------------------- */

  describe('Duplicate Return Value', () => {
    it('T054-11: Duplicate result contains id, file_path, and title fields', () => {
      const content = 'Content for return value shape test.';
      const hash = sha256(content);
      const folder = 'specs/shape-test';

      const insertedId = insertIndexedMemory(
        db,
        folder,
        '/specs/shape-test/memory/shape.md',
        content,
        'Shape Test Title'
      );

      const result = checkContentHashDedup(db, folder, hash);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', insertedId);
      expect(result).toHaveProperty('file_path', '/specs/shape-test/memory/shape.md');
      expect(result).toHaveProperty('title', 'Shape Test Title');
    });

    it('T054-12: title is null when not set', () => {
      const content = 'Content without a title.';
      const hash = sha256(content);
      const folder = 'specs/null-title-test';

      // Insert without title
      db.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
        VALUES (?, ?, ?, 'success')
      `).run(folder, '/specs/null-title-test/memory/notitle.md', hash);

      const result = checkContentHashDedup(db, folder, hash);
      expect(result).toBeDefined();
      expect(result!.title).toBeNull();
    });
  });
});
