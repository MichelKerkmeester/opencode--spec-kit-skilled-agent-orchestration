// ───────────────────────────────────────────────────────────────
// 1. TEST — SHA256 CONTENT-HASH DEDUP (TM-02)
// ───────────────────────────────────────────────────────────────
// Verifies that the fast-path dedup check in indexMemoryFile()
// Returns 'duplicate' for identical content (same spec_folder,
// Same content_hash) and proceeds to embed for changed content.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as hybridSearch from '../lib/search/hybrid-search';
import { findSamePathExistingMemory } from '../handlers/save/create-record';
import { checkContentHashDedup, checkExistingRow } from '../handlers/save/dedup';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

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
      parent_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      embedding_status TEXT DEFAULT 'success',
      importance_tier TEXT DEFAULT 'normal',
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT,
      content_hash TEXT,
      content_text TEXT,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
  `);
  return db;
}

/**
 * Insert a memory record as if it was already indexed (embedding_status='success').
 */
function insertIndexedMemory(
  db: Database.Database,
  specFolder: string,
  filePath: string,
  content: string,
  title?: string,
  embeddingStatus?: 'success' | 'pending' | 'partial' | 'failed' | 'retry' | 'complete',
  scope: {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
    sharedSpaceId?: string | null;
  } = {},
): number {
  const hash = sha256(content);
  const result = db.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      content_hash,
      embedding_status,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    specFolder,
    filePath,
    filePath,
    title ?? null,
    hash,
    embeddingStatus ?? 'success',
    scope.tenantId ?? null,
    scope.userId ?? null,
    scope.agentId ?? null,
    scope.sessionId ?? null,
    scope.sharedSpaceId ?? null,
  );
  return result.lastInsertRowid as number;
}

function buildParsedMemory(specFolder: string, content: string, title: string | null = 'Test Memory') {
  return {
    specFolder,
    title,
    triggerPhrases: [],
    content,
    contentHash: sha256(content),
    contextType: 'general',
    importanceTier: 'normal',
    qualityScore: 0,
    qualityFlags: [],
  } as any;
}

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('T054: SHA256 Content-Hash Dedup (TM-02)', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = createMinimalDb();
  });

  afterAll(() => {
    if (db) db.close();
  });

  /* ───────────────────────────────────────────────────────────────
     Core dedup logic
  ──────────────────────────────────────────────────────────────── */

  describe('Dedup Query Logic', () => {
    it('T054-1: Returns undefined when memory_index is empty', () => {
      const hash = sha256('some content');
      const result = checkContentHashDedup(db, buildParsedMemory('specs/test-folder', 'some content'), false, []);
      expect(result).toBeNull();
    });

    it('T054-2: Returns undefined when spec_folder does not match', () => {
      const content = 'Unique content for T054-2 test case';
      const hash = sha256(content);
      insertIndexedMemory(db, 'specs/other-folder', '/path/to/memory/file.md', content);

      const result = checkContentHashDedup(db, buildParsedMemory('specs/test-folder', content), false, []);
      expect(result).toBeNull();
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
      const result = checkContentHashDedup(db, buildParsedMemory('specs/dedup-test', content), false, []);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(originalId);
      expect(result!.status).toBe('duplicate');
      expect(result!.message).toContain('/specs/dedup-test/memory/original.md');
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
      const result = checkContentHashDedup(db, buildParsedMemory('specs/changed-content', modifiedContent), false, []);
      expect(result).toBeNull();
    });

    it('T054-5: Pending embeddings are excluded from dedup check', () => {
      const content = 'Content with a pending embedding status.';
      const hash = sha256(content);

      // Insert with embedding_status='pending' — should NOT be matched
      db.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
        VALUES (?, ?, ?, 'pending')
      `).run('specs/pending-test', '/specs/pending-test/memory/pending.md', hash);

      const result = checkContentHashDedup(db, buildParsedMemory('specs/pending-test', content), false, []);
      expect(result).toBeNull();
    });

    it('T054-6: Returns most recent record (highest id) for multiple matches', () => {
      const content = 'Repeated content saved multiple times.';
      const hash = sha256(content);
      const folder = 'specs/multi-match';

      const id1 = insertIndexedMemory(db, folder, '/path/a.md', content);
      const id2 = insertIndexedMemory(db, folder, '/path/b.md', content);

      const result = checkContentHashDedup(db, buildParsedMemory(folder, content), false, []);
      expect(result).not.toBeNull();
      // Should return the most recently inserted (highest id)
      expect(result!.id).toBe(id2);
      expect(result!.id).toBeGreaterThan(id1);
    });

    it('T054-6aa: Cross-tenant duplicates do not dedup when governance scope differs', () => {
      const content = 'Same content in another tenant must not short-circuit save.';
      const folder = 'specs/governed-dedup';
      insertIndexedMemory(
        db,
        folder,
        '/specs/governed-dedup/memory/tenant-a.md',
        content,
        'Tenant A',
        'success',
        { tenantId: 'tenant-a' },
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory(folder, content, 'Tenant B'),
        false,
        [],
        undefined,
        { tenantId: 'tenant-b' },
      );

      expect(result).toBeNull();
    });

    it('T054-6ab: Matching governance scope still dedups identical content', () => {
      const content = 'Same-tenant duplicates should still be caught.';
      const folder = 'specs/governed-dedup-match';
      const insertedId = insertIndexedMemory(
        db,
        folder,
        '/specs/governed-dedup-match/memory/tenant-a.md',
        content,
        'Tenant A',
        'success',
        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory(folder, content, 'Tenant A duplicate'),
        false,
        [],
        undefined,
        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
      );

      expect(result?.status).toBe('duplicate');
      expect(result?.id).toBe(insertedId);
    });

    it('T054-6b: Partial parent rows remain dedup-eligible', () => {
      const content = 'Chunked parent content for partial dedup.';
      const folder = 'specs/partial-parent';
      const insertedId = insertIndexedMemory(
        db,
        folder,
        '/specs/partial-parent/memory/chunked.md',
        content,
        'Chunked Parent',
        'partial'
      );

      const result = checkContentHashDedup(db, buildParsedMemory(folder, content), false, []);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(insertedId);
    });

    it('T054-6c: Invalid terminal status complete is excluded from dedup', () => {
      const content = 'Legacy complete status should not dedup.';
      const folder = 'specs/invalid-complete-status';
      insertIndexedMemory(
        db,
        folder,
        '/specs/invalid-complete-status/memory/legacy.md',
        content,
        'Legacy Complete',
        'complete'
      );

      const result = checkContentHashDedup(db, buildParsedMemory(folder, content), false, []);

      expect(result).toBeNull();
    });

    it('T054-6cc: Hash hits are ignored when stored content verification fails', () => {
      const incomingContent = 'Incoming content should not be rejected by a mismatched stored payload.';
      const folder = 'specs/hash-verification';
      const existingPath = path.join(os.tmpdir(), `hash-verification-${Date.now()}.md`);
      fs.writeFileSync(existingPath, 'Stored file content does not match the incoming content.', 'utf8');

      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, content_text, embedding_status, parent_id
        ) VALUES (?, ?, ?, ?, ?, NULL, 'success', NULL)
      `).run(
        folder,
        existingPath,
        existingPath,
        'Mismatched Stored Payload',
        sha256(incomingContent),
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory(folder, incomingContent, 'Incoming Content'),
        false,
        [],
      );

      expect(result).toBeNull();
      fs.rmSync(existingPath, { force: true });
    });
  });

  describe('Same-path unchanged gate', () => {
    it('T320-1: Same-path lookup uses two direct probes without nullable OR scope predicates', () => {
      const sqlCalls: string[] = [];
      const dbSpy = {
        prepare: (sql: string) => {
          sqlCalls.push(sql);
          return {
            get: () => undefined,
          };
        },
      } as unknown as Database.Database;

      checkExistingRow(
        dbSpy,
        buildParsedMemory('specs/sql-shape', 'content', 'SQL Shape'),
        '/specs/sql-shape/memory/canonical.md',
        '/specs/sql-shape/memory/file.md',
        false,
        [],
        { tenantId: 'tenant-a' },
      );

      expect(sqlCalls).toHaveLength(2);
      expect(sqlCalls[0]).toContain('canonical_file_path = ?');
      expect(sqlCalls[1]).toContain('file_path = ?');
      expect(sqlCalls.join('\n')).not.toContain('canonical_file_path = ? OR file_path = ?');
      expect(sqlCalls.join('\n')).not.toContain('? IS NULL');
      expect(sqlCalls.join('\n')).toContain('tenant_id = ?');
      expect(sqlCalls.join('\n')).toContain('user_id IS NULL');
    });

    it('T320-2: Content-hash dedup uses exact scope clauses instead of nullable OR predicates', () => {
      let capturedSql = '';
      const dbSpy = {
        prepare: (sql: string) => {
          capturedSql = sql;
          return {
            get: () => undefined,
          };
        },
      } as unknown as Database.Database;

      checkContentHashDedup(
        dbSpy,
        buildParsedMemory('specs/sql-shape', 'content', 'SQL Shape'),
        false,
        [],
        undefined,
        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
      );

      expect(capturedSql).toContain('tenant_id = ?');
      expect(capturedSql).toContain('shared_space_id = ?');
      expect(capturedSql).toContain('user_id IS NULL');
      expect(capturedSql).not.toContain('? IS NULL');
    });

    it('T054-6d: Same-path unchanged does not short-circuit failed embeddings', () => {
      const content = 'Existing failed embedding should not be treated as unchanged.';
      const filePath = '/specs/failed-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'failed', NULL)
      `).run('specs/failed-same-path', filePath, filePath, 'Failed Embedding', sha256(content));

      const result = checkExistingRow(
        db,
        buildParsedMemory('specs/failed-same-path', content, 'Failed Embedding'),
        filePath,
        filePath,
        false,
        [],
      );

      expect(result).toBeNull();
    });

    it('T054-6e: Same-path unchanged still short-circuits partial parents', () => {
      const content = 'Existing partial parent remains unchanged-eligible.';
      const filePath = '/specs/partial-same-path/memory/doc.md';
      const inserted = db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'partial', NULL)
      `).run('specs/partial-same-path', filePath, filePath, 'Partial Parent', sha256(content));

      const result = checkExistingRow(
        db,
        buildParsedMemory('specs/partial-same-path', content, 'Partial Parent'),
        filePath,
        filePath,
        false,
        [],
      );

      expect(result?.status).toBe('unchanged');
      expect(result?.id).toBe(Number(inserted.lastInsertRowid));
    });

    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
      const content = 'Existing same-path row with stale trigger phrases.';
      const filePath = '/specs/metadata-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'success', ?, ?, ?, NULL)
      `).run(
        'specs/metadata-same-path',
        filePath,
        filePath,
        'Metadata Drift',
        sha256(content),
        JSON.stringify(['legacy-trigger']),
        0,
        JSON.stringify([]),
      );

      const result = checkExistingRow(
        db,
        buildParsedMemory('specs/metadata-same-path', content, 'Metadata Drift'),
        filePath,
        filePath,
        false,
        [],
      );

      expect(result).toBeNull();
    });

    it('T054-6g: Same-path metadata drift is not reclassified as folder duplicate', () => {
      const content = 'Existing same-path row with stale trigger phrases.';
      const filePath = '/specs/metadata-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'success', ?, ?, ?, NULL)
      `).run(
        'specs/metadata-same-path',
        filePath,
        filePath,
        'Metadata Drift',
        sha256(content),
        JSON.stringify(['legacy-trigger']),
        0,
        JSON.stringify([]),
      );

      const result = checkContentHashDedup(
        db,
        {
          ...buildParsedMemory('specs/metadata-same-path', content, 'Metadata Drift'),
          triggerPhrases: ['fresh-trigger'],
        },
        false,
        [],
        { canonicalFilePath: filePath, filePath },
      );

      expect(result).toBeNull();
    });

    it('T079-1: Force saves skip same-path content-hash dedup rejection', () => {
      const content = 'Intentional same-path force save should not be rejected as duplicate.';
      const filePath = '/specs/forced-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'success', NULL)
      `).run(
        'specs/forced-same-path',
        filePath,
        filePath,
        'Force Save',
        sha256(content),
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory('specs/forced-same-path', content, 'Force Save'),
        true,
        [],
        { canonicalFilePath: filePath, filePath },
      );

      expect(result).toBeNull();
    });

    it('T054-6h: Cross-path duplicates remain detectable when legacy rows have NULL canonical_file_path', () => {
      const content = 'Legacy rows with null canonical paths must still dedup across paths.';
      const originalFilePath = '/specs/legacy-null-canonical/memory/original.md';
      const incomingFilePath = '/specs/legacy-null-canonical/memory/incoming.md';
      const inserted = db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
        ) VALUES (?, ?, NULL, ?, ?, 'success', NULL)
      `).run(
        'specs/legacy-null-canonical',
        originalFilePath,
        'Legacy Duplicate',
        sha256(content),
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory('specs/legacy-null-canonical', content, 'Legacy Duplicate'),
        false,
        [],
        { canonicalFilePath: incomingFilePath, filePath: incomingFilePath },
      );

      expect(result?.status).toBe('duplicate');
      expect(result?.id).toBe(Number(inserted.lastInsertRowid));
      expect(result?.message).toContain(originalFilePath);
    });

    it('T054-6i: Same-path exclusion stays effective for legacy rows with NULL canonical_file_path', () => {
      const content = 'Same-path legacy rows with null canonical paths should still be excluded.';
      const filePath = '/specs/legacy-null-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
        ) VALUES (?, ?, NULL, ?, ?, 'success', NULL)
      `).run(
        'specs/legacy-null-same-path',
        filePath,
        'Legacy Same Path',
        sha256(content),
      );

      const result = checkContentHashDedup(
        db,
        buildParsedMemory('specs/legacy-null-same-path', content, 'Legacy Same Path'),
        false,
        [],
        { canonicalFilePath: filePath, filePath },
      );

      expect(result).toBeNull();
    });

    it('T054-6j: Same-path unchanged ignores matching content in another tenant scope', () => {
      const content = 'Same-path unchanged must remain tenant-scoped.';
      const filePath = '/specs/governed-same-path/memory/doc.md';
      db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'success', ?, NULL)
      `).run(
        'specs/governed-same-path',
        filePath,
        filePath,
        'Tenant Scoped',
        sha256(content),
        'tenant-a',
      );

      const result = checkExistingRow(
        db,
        buildParsedMemory('specs/governed-same-path', content, 'Tenant Scoped'),
        filePath,
        filePath,
        false,
        [],
        { tenantId: 'tenant-b' },
      );

      expect(result).toBeNull();
    });

    it('T054-6k: Same-path predecessor lookup stays inside the current governance scope', () => {
      const content = 'Append-first predecessor lookup must not cross tenants.';
      const filePath = '/specs/governed-predecessor/memory/doc.md';
      const tenantAId = db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
        ) VALUES (?, ?, ?, ?, ?, 'success', ?, NULL)
      `).run(
        'specs/governed-predecessor',
        filePath,
        filePath,
        'Tenant A predecessor',
        sha256(content),
        'tenant-a',
      ).lastInsertRowid as number;

      const tenantBMatch = findSamePathExistingMemory(
        db,
        'specs/governed-predecessor',
        filePath,
        filePath,
        { tenantId: 'tenant-b' },
      );
      const tenantAMatch = findSamePathExistingMemory(
        db,
        'specs/governed-predecessor',
        filePath,
        filePath,
        { tenantId: 'tenant-a' },
      );

      expect(tenantBMatch).toBeUndefined();
      expect(tenantAMatch?.id).toBe(tenantAId);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SHA256 hash computation
  ──────────────────────────────────────────────────────────────── */

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

  /* ───────────────────────────────────────────────────────────────
     Return value shape
  ──────────────────────────────────────────────────────────────── */

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

      const result = checkContentHashDedup(db, buildParsedMemory(folder, content, 'Shape Test Title'), false, []);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('id', insertedId);
      expect(result).toHaveProperty('status', 'duplicate');
      expect(result!.message).toContain('/specs/shape-test/memory/shape.md');
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

      const result = checkContentHashDedup(db, buildParsedMemory(folder, content, null), false, []);
      expect(result).not.toBeNull();
      expect(result!.title).toBe('');
    });
  });
});

function createHybridMockDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) {
            return { count: 1 };
          }
          return null;
        },
        all() {
          return [
            {
              id: 42,
              title: 'Canonical duplicate from FTS',
              content: 'fts duplicate entry',
              fts_score: 9.0,
              spec_folder: 'specs/dedup',
            },
            {
              id: 202,
              title: 'Unique FTS entry',
              content: 'unique fts entry',
              fts_score: 8.0,
              spec_folder: 'specs/dedup',
            },
          ];
        },
      };
    },
  } as unknown as Database.Database;
}

const mockVectorSearch = (_embedding: Float32Array | number[]) => {
  return [
    {
      id: 'mem:42',
      title: 'Canonical duplicate from vector',
      content: 'vector duplicate entry',
      similarity: 0.95,
      spec_folder: 'specs/dedup',
    },
    {
      id: 101,
      title: 'Unique vector entry',
      content: 'unique vector entry',
      similarity: 0.90,
      spec_folder: 'specs/dedup',
    },
  ];
};

function canonicalIds(results: Awaited<ReturnType<typeof hybridSearch.hybridSearchEnhanced>>): string[] {
  return results.map((result) => hybridSearch.__testables.canonicalResultId(result.id));
}

describe('T008: includeContent-independent dedup in hybrid search path', () => {
  it('deduplicates canonical IDs when includeContent=false (default production path)', async () => {
    hybridSearch.init(createHybridMockDb(), mockVectorSearch, null);
    hybridSearch.resetGraphMetrics();

    const results = await hybridSearch.hybridSearchEnhanced(
      'dedup regression query',
      new Float32Array(384).fill(0.1),
      {
        limit: 20,
        useBm25: false,
        useGraph: false,
        forceAllChannels: true,
      }
    );

    const ids = canonicalIds(results);
    const metrics = hybridSearch.getGraphMetrics();
    expect(ids.length).toBe(new Set(ids).size);
    expect(ids.length).toBeGreaterThan(0);
    expect(metrics.multiSourceResults).toBeGreaterThan(0);
  });

  it('deduplicates canonical IDs when includeContent=true', async () => {
    hybridSearch.init(createHybridMockDb(), mockVectorSearch, null);
    hybridSearch.resetGraphMetrics();

    const results = await hybridSearch.hybridSearchEnhanced(
      'dedup regression query',
      new Float32Array(384).fill(0.1),
      {
        limit: 20,
        includeContent: true,
        useBm25: false,
        useGraph: false,
        forceAllChannels: true,
      }
    );

    const ids = canonicalIds(results);
    const metrics = hybridSearch.getGraphMetrics();
    expect(ids.length).toBe(new Set(ids).size);
    expect(ids.length).toBeGreaterThan(0);
    expect(metrics.multiSourceResults).toBeGreaterThan(0);
  });

  it('returns identical deduped canonical IDs for includeContent=false vs true', async () => {
    hybridSearch.init(createHybridMockDb(), mockVectorSearch, null);
    const embedding = new Float32Array(384).fill(0.1);

    const defaultPath = await hybridSearch.hybridSearchEnhanced('dedup regression query', embedding, {
      limit: 20,
      useBm25: false,
      useGraph: false,
      forceAllChannels: true,
    });
    const includeContentPath = await hybridSearch.hybridSearchEnhanced('dedup regression query', embedding, {
      limit: 20,
      includeContent: true,
      useBm25: false,
      useGraph: false,
      forceAllChannels: true,
    });

    const defaultCanonical = canonicalIds(defaultPath).sort();
    const includeCanonical = canonicalIds(includeContentPath).sort();

    expect(defaultCanonical).toEqual(includeCanonical);
  });
});
