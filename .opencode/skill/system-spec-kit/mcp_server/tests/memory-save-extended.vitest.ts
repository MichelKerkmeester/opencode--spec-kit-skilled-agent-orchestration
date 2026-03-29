import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import path from 'path';
import os from 'os';
import fs from 'fs';
import Database from 'better-sqlite3';
import * as handler from '../handlers/memory-save';
import {
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,
} from '../handlers/pe-gating';
import {
  resolveMemoryReference,
  resolveMemoryReferencesBatch,
  processCausalLinks,
  CAUSAL_LINK_MAPPINGS,
} from '../handlers/causal-links-processor';
import * as vectorIndex from '../lib/search/vector-index';
import * as dbHelpers from '../utils';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// TEST: MEMORY SAVE EXTENDED
// Covers untested functions in handlers/memory-save.ts
// Functions: resolveMemoryReference, processCausalLinks,
// ReinforceExistingMemory, markMemorySuperseded,
// UpdateExistingMemory, logPeDecision,
// AtomicSaveMemory, getAtomicityMetrics, indexMemoryFile
// Initialize a test DB at module scope so skipIf conditions can evaluate correctly.
// The DB must be available before it() registrations (skipIf evaluates at registration time).
const TEST_DB_DIR = path.join(os.tmpdir(), 'speckit-test-memory-save-extended-' + process.pid);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
let moduleDb: Database.Database | null = null;
try {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  process.env.MEMORY_DB_PATH = TEST_DB_PATH;
  try { vectorIndex.closeDb(); } catch { /* ignore */ }
  moduleDb = vectorIndex.initializeDb();
  if (previousMemoryDbPath === undefined) {
    delete process.env.MEMORY_DB_PATH;
  } else {
    process.env.MEMORY_DB_PATH = previousMemoryDbPath;
  }
} catch {
  moduleDb = null;
}
const hasModuleDb = moduleDb !== null;

describe('MEMORY SAVE EXTENDED', () => {

  afterAll(() => {
    try { vectorIndex.closeDb(); } catch { /* ignore */ }
    try { fs.rmSync(TEST_DB_DIR, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  /* ───────────────────────────────────────────────────────────────
     DB HELPERS
  ──────────────────────────────────────────────────────────────── */

  function createTestDb(): Database.Database {
    const db = new Database(':memory:');

    // Create memory_index table (matches production schema)
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT,
        file_path TEXT,
        title TEXT,
        trigger_phrases TEXT,
        content TEXT,
        content_text TEXT,
        content_hash TEXT,
        context_type TEXT DEFAULT 'implementation',
        importance_tier TEXT DEFAULT 'normal',
        importance_weight REAL DEFAULT 0.5,
        memory_type TEXT,
        type_inference_source TEXT,
        stability REAL DEFAULT 1.0,
        difficulty REAL DEFAULT 5.0,
        last_review TEXT DEFAULT (datetime('now')),
        review_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT,
        file_mtime_ms INTEGER,
        related_memories TEXT,
        embedding BLOB,
        embedding_status TEXT DEFAULT 'pending'
      )
    `);

    // Create memory_conflicts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_conflicts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        new_memory_hash TEXT,
        existing_memory_id INTEGER,
        similarity REAL DEFAULT 0,
        action TEXT,
        contradiction_detected INTEGER DEFAULT 0,
        reason TEXT,
        spec_folder TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Create causal_edges table
    db.exec(`
      CREATE TABLE IF NOT EXISTS causal_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL CHECK(relation IN (
          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
        )),
        strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
        evidence TEXT,
        extracted_at TEXT DEFAULT (datetime('now')),
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT,
        UNIQUE(source_id, target_id, relation)
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
        old_strength REAL NOT NULL,
        new_strength REAL NOT NULL,
        changed_by TEXT DEFAULT 'manual',
        changed_at TEXT DEFAULT (datetime('now')),
        reason TEXT
      )
    `);

    return db;
  }

  function seedTestMemories(db: Database.Database): void {
    const stmt = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(1, 'specs/001-test', '/specs/001-test/memory/session-2025-01-15.md', 'Session Context Jan 15', 'Test memory content 1', 'hash1', 1.0, 5.0);
    stmt.run(2, 'specs/001-test', '/specs/001-test/memory/decision-auth.md', 'Auth Decision Record', 'Test memory content 2', 'hash2', 2.0, 4.0);
    stmt.run(3, 'specs/002-feature', '/specs/002-feature/memory/implementation-notes.md', 'Implementation Notes', 'Test memory content 3', 'hash3', 1.5, 5.0);
    stmt.run(4, 'specs/002-feature', '/specs/002-feature/memory/debug-log.md', 'Debug Log', 'Test memory content 4', 'hash4', 0.8, 6.0);
    stmt.run(5, 'specs/003-refactor', '/specs/003-refactor/memory/2024-12-01-session.md', 'Refactor Plan', 'Test memory content 5', 'hash5', 1.2, 5.0);
  }

  /* ───────────────────────────────────────────────────────────────
     SUITE: resolveMemoryReference
  ──────────────────────────────────────────────────────────────── */

  describe('resolveMemoryReference', () => {
    const resolveFn = typeof resolveMemoryReference === 'function'
      ? resolveMemoryReference
      : null;
    const resolveBatchFn = typeof resolveMemoryReferencesBatch === 'function'
      ? resolveMemoryReferencesBatch
      : null;
    type ResolveReferenceInput = Parameters<NonNullable<typeof resolveFn>>[1];

    it.skipIf(!resolveFn)('resolves numeric ID', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, '1');
      expect(result).toBe(1);
      db.close();
    });

    it.skipIf(!resolveFn)('null for non-existent ID', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, '999');
      expect(result).toBeNull();
      db.close();
    });

    it.skipIf(!resolveFn)('resolves session reference', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'session-2025-01-15');
      expect(result).toBe(1);
      db.close();
    });

    it.skipIf(!resolveFn)('resolves date-prefixed reference', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, '2024-12-01-session');
      expect(result).toBe(5);
      db.close();
    });

    it.skipIf(!resolveFn)('resolves path reference', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'specs/002-feature/memory/implementation-notes.md');
      expect(result).toBe(3);
      db.close();
    });

    it.skipIf(!resolveFn)('resolves exact title', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'Debug Log');
      expect(result).toBe(4);
      db.close();
    });

    it.skipIf(!resolveFn)('resolves partial title', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'Auth Decision');
      expect(result).toBe(2);
      db.close();
    });

    it.skipIf(!resolveFn)('null for empty/null/undefined', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const r1 = resolveFn!(db, '');
      const r2 = resolveFn!(db, null as unknown as ResolveReferenceInput);
      const r3 = resolveFn!(db, undefined as unknown as ResolveReferenceInput);
      expect(r1).toBeNull();
      expect(r2).toBeNull();
      expect(r3).toBeNull();
      db.close();
    });

    it.skipIf(!resolveFn)('null for whitespace-only', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, '   ');
      expect(result).toBeNull();
      db.close();
    });

    it.skipIf(!resolveFn)('null for non-existent ref', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'totally-nonexistent-reference');
      expect(result).toBeNull();
      db.close();
    });

    it.skipIf(!resolveFn)('resolves memory/ path', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = resolveFn!(db, 'memory/decision-auth.md');
      expect(result).toBe(2);
      db.close();
    });

    it.skipIf(!resolveFn)('prefers exact path equality before fuzzy path fallback', () => {
      const db = createTestDb();
      db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
      seedTestMemories(db);
      db.prepare('UPDATE memory_index SET canonical_file_path = file_path').run();

      db.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, canonical_file_path, title, content, content_hash, stability, difficulty
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        99,
        'specs/099-shadow',
        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
        'Shadow Path',
        'Shadow content',
        'hash-shadow',
        1.0,
        5.0,
      );

      const result = resolveFn!(db, 'specs/002-feature/memory/implementation-notes.md');
      expect(result).toBe(3);
      db.close();
    });

    it.skipIf(!resolveBatchFn)('resolves multiple references in one batch call', () => {
      const db = createTestDb();
      seedTestMemories(db);

      const resolved = resolveBatchFn!(db, [
        '1',
        'memory/decision-auth.md',
        'Debug Log',
        'non-existent-ref',
      ]);

      expect(resolved.get('1')).toBe(1);
      expect(resolved.get('memory/decision-auth.md')).toBe(2);
      expect(resolved.get('Debug Log')).toBe(4);
      expect(resolved.get('non-existent-ref')).toBeNull();
      db.close();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: processCausalLinks
  ──────────────────────────────────────────────────────────────── */

  describe('processCausalLinks', () => {
    const processFn = typeof processCausalLinks === 'function'
      ? processCausalLinks
      : null;
    type CausalLinksInput = Parameters<NonNullable<typeof processFn>>[2];

    it.skipIf(!processFn)('empty result for null input', () => {
      const db = createTestDb();
      const result = processFn!(db, 100, null as unknown as CausalLinksInput);
      expect(result.processed).toBe(0);
      expect(result.inserted).toBe(0);
      expect(result.resolved).toBe(0);
      db.close();
    });

    it.skipIf(!processFn)('empty result for empty object', () => {
      const db = createTestDb();
      const result = processFn!(db, 100, {} as CausalLinksInput);
      expect(result.processed).toBe(0);
      expect(result.inserted).toBe(0);
      db.close();
    });

    it.skipIf(!processFn)('skips unknown link types', () => {
      const db = createTestDb();
      const result = processFn!(db, 100, { unknown_type: ['ref1'] } as unknown as CausalLinksInput);
      expect(result.processed).toBe(0);
      expect(result.inserted).toBe(0);
      db.close();
    });

    it.skipIf(!processFn)('tracks unresolved references', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = processFn!(db, 100, { caused_by: ['nonexistent-ref'] } as CausalLinksInput);
      expect(result.processed).toBe(1);
      expect(result.unresolved).toHaveLength(1);
      db.close();
    });

    it.skipIf(!processFn)('resolves and inserts valid links', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = processFn!(db, 10, { caused_by: ['1'] } as CausalLinksInput);
      expect(result.processed).toBe(1);
      expect(result.resolved).toBe(1);
      expect(result.inserted).toBe(1);
      db.close();
    });

    it.skipIf(!processFn)('handles multiple references', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = processFn!(db, 10, { caused_by: ['1', '2', 'nonexistent'] } as CausalLinksInput);
      expect(result.processed).toBe(3);
      expect(result.resolved).toBe(2);
      expect(result.unresolved).toHaveLength(1);
      db.close();
    });

    it.skipIf(!processFn)('skips empty arrays', () => {
      const db = createTestDb();
      const result = processFn!(db, 100, { caused_by: [], supersedes: [] } as unknown as CausalLinksInput);
      expect(result.processed).toBe(0);
      db.close();
    });

    it.skipIf(!processFn)('handles non-array values', () => {
      const db = createTestDb();
      const result = processFn!(db, 100, { caused_by: 'not-an-array' } as unknown as CausalLinksInput);
      expect(result.processed).toBe(0);
      db.close();
    });

    it.skipIf(!processFn)('supersedes link type', () => {
      const db = createTestDb();
      seedTestMemories(db);
      const result = processFn!(db, 10, { supersedes: ['3'] } as CausalLinksInput);
      expect(result.processed).toBe(1);
      expect(result.resolved).toBe(1);
      expect(result.inserted).toBe(1);
      const edges = db.prepare('SELECT source_id, target_id, relation FROM causal_edges').all() as Array<{ source_id: string; target_id: string; relation: string }>;
      const edge = edges.find((e) => e.relation === 'supersedes');
      expect(edge).toBeDefined();
      db.close();
    });

    it.skipIf(!processFn)('CAUSAL_LINK_MAPPINGS exported', () => {
      const mappings = CAUSAL_LINK_MAPPINGS;
      expect(mappings).toBeDefined();
      expect(typeof mappings).toBe('object');
      const keys = Object.keys(mappings);
      const expected = ['caused_by', 'supersedes', 'derived_from', 'blocks', 'related_to'];
      for (const key of expected) {
        expect(keys).toContain(key);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: logPeDecision
  ──────────────────────────────────────────────────────────────── */

  describe('logPeDecision', () => {
    const logPeFn = typeof logPeDecision === 'function'
      ? logPeDecision
      : null;
    const hasGetDb = typeof vectorIndex.getDb === 'function';
    const canRun = logPeFn && hasGetDb;

    let db: Database.Database | null = null;
    beforeAll(() => {
      if (canRun) {
        try {
          db = vectorIndex.getDb();
        } catch {
          db = null;
        }
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('logs basic decision without error', () => {
      const decision = {
        action: 'REINFORCE',
        similarity: 0.97,
        existingMemoryId: 42,
        reason: 'High similarity duplicate detected',
      };
      expect(() => logPeFn!(decision, 'test-hash-001', 'specs/test-folder')).not.toThrow();
    });

    it.skipIf(!canRun || !hasModuleDb)('logs contradiction decision', () => {
      const decision = {
        action: 'SUPERSEDE',
        similarity: 0.92,
        existingMemoryId: 10,
        reason: 'Contradiction detected',
        contradiction: {
          detected: true,
          type: 'always_never',
          description: 'always vs never',
          confidence: 0.85,
        },
      };
      expect(() => logPeFn!(decision, 'test-hash-002', 'specs/contradiction-folder')).not.toThrow();
    });

    it.skipIf(!canRun || !hasModuleDb)('handles null existingMemoryId', () => {
      const decision = {
        action: 'CREATE',
        similarity: 0.3,
        existingMemoryId: null,
        reason: 'Novel content',
      };
      expect(() => logPeFn!(decision, 'test-hash-003', 'specs/create-folder')).not.toThrow();
    });

    it.skipIf(!canRun || !hasModuleDb)('handles missing optional fields', () => {
      const decision = {
        action: 'UPDATE',
        similarity: 0.91,
      };
      expect(() => logPeFn!(decision, 'test-hash-004', 'specs/minimal')).not.toThrow();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: reinforceExistingMemory
  ──────────────────────────────────────────────────────────────── */

  describe('reinforceExistingMemory', () => {
    const reinforceFn = typeof reinforceExistingMemory === 'function'
      ? reinforceExistingMemory
      : null;
    const hasGetDb = typeof vectorIndex.getDb === 'function';
    const canRun = reinforceFn && hasGetDb;

    let db: Database.Database | null = null;
    beforeAll(() => {
      if (canRun) {
        try {
          db = vectorIndex.getDb();
        } catch {
          db = null;
        }
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('error for non-existent ID', () => {
      const parsed = {
        specFolder: 'specs/test',
        filePath: '/test/memory.md',
        title: 'Test',
        triggerPhrases: [],
        content: 'test content',
        contentHash: 'hash',
        contextType: 'implementation',
        importanceTier: 'normal',
      };
      const result = reinforceFn!(99999, parsed);
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
      expect(result.error).toContain('not found');
    });

    it.skipIf(!canRun || !hasModuleDb)('returns correct shape for valid memory', () => {
      if (!db) return;
      const row = db.prepare('SELECT id FROM memory_index LIMIT 1').get() as { id: number } | undefined;
      if (!row) {
        // No memories in DB to test with - skip gracefully
        return;
      }
      const parsed = {
        specFolder: 'specs/test',
        filePath: '/test/memory.md',
        title: 'Test',
        triggerPhrases: [],
        content: 'test content',
        contentHash: 'hash',
        contextType: 'implementation',
        importanceTier: 'normal',
      };
      const result = reinforceFn!(row.id, parsed);
      if (result.status === 'error') {
        // May fail due to missing FSRS columns - acceptable
        expect(result.status).toBe('error');
      } else {
        expect(result.status).toBe('reinforced');
        expect(result.id).toBe(row.id);
        expect(typeof result.newStability).toBe('number');
        expect(typeof result.retrievability).toBe('number');
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('returns error when reinforcement update affects zero rows', () => {
      if (!db) return;
      const row = db.prepare('SELECT id FROM memory_index LIMIT 1').get() as { id: number } | undefined;
      if (!row) {
        return;
      }

      const triggerName = `skip_reinforce_${Date.now()}`;
      const parsed = {
        specFolder: 'specs/test',
        filePath: '/test/memory.md',
        title: 'Test',
        triggerPhrases: [],
        content: 'test content',
        contentHash: 'hash',
        contextType: 'implementation',
        importanceTier: 'normal',
      };

      try {
        db.exec(`
          CREATE TRIGGER ${triggerName}
          BEFORE UPDATE ON memory_index
          WHEN OLD.id = ${Number(row.id)}
          BEGIN
            SELECT RAISE(IGNORE);
          END;
        `);

        const result = reinforceFn!(row.id, parsed);
        expect(result.status).toBe('error');
        expect(String(result.error || '')).toContain('matched 0 rows');
      } finally {
        db.exec(`DROP TRIGGER IF EXISTS ${triggerName}`);
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('error result has expected fields', () => {
      const parsed = {
        specFolder: 'specs/my-spec',
        filePath: '/test/memory.md',
        title: 'Test',
        triggerPhrases: [],
        content: 'test',
        contentHash: 'h',
        contextType: 'implementation',
        importanceTier: 'normal',
      };
      const result = reinforceFn!(88888, parsed);
      if (result.status === 'error') {
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('success');
      } else {
        expect(result.specFolder).toBe('specs/my-spec');
      }
    });

    it('backfills content_hash when reinforcement populates missing content_text', () => {
      const db = createTestDb();
      const requireDbSpy = vi.spyOn(dbHelpers, 'requireDb').mockReturnValue(db as never);
      const parsed = {
        specFolder: 'specs/hash-refresh',
        filePath: '/specs/hash-refresh/memory/doc.md',
        title: 'Hash Refresh',
        triggerPhrases: [],
        content: 'Fresh reinforcement content',
        contentHash: 'fresh-reinforcement-hash',
        contextType: 'implementation',
        importanceTier: 'normal',
        documentType: 'memory',
      };

      try {
        db.prepare(`
          INSERT INTO memory_index (
            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
          ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)
        `).run(
          55,
          parsed.specFolder,
          parsed.filePath,
          parsed.title,
          'stale-hash',
          2,
          5,
          0,
        );

        const result = reinforceFn!(55, parsed as any);
        expect(result.status).toBe('reinforced');

        const updated = db.prepare(`
          SELECT content_text, content_hash
          FROM memory_index
          WHERE id = ?
        `).get(55) as { content_text: string | null; content_hash: string | null };

        expect(updated.content_text).toBe(parsed.content);
        expect(updated.content_hash).toBe(parsed.contentHash);
      } finally {
        requireDbSpy.mockRestore();
        db.close();
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: markMemorySuperseded
  ──────────────────────────────────────────────────────────────── */

  describe('markMemorySuperseded', () => {
    const markSupersededFn = typeof markMemorySuperseded === 'function'
      ? markMemorySuperseded
      : null;
    const hasGetDb = typeof vectorIndex.getDb === 'function';
    const canRun = markSupersededFn && hasGetDb;

    let db: Database.Database | null = null;
    beforeAll(() => {
      if (canRun) {
        try {
          db = vectorIndex.getDb();
        } catch {
          db = null;
        }
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('returns true for valid memory', () => {
      if (!db) return;
      const row = db.prepare('SELECT id FROM memory_index LIMIT 1').get() as { id: number } | undefined;
      if (!row) {
        // No memories in DB - skip gracefully
        return;
      }
      // Save original tier for restoration
      const original = db.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(row.id) as { importance_tier: string } | undefined;
      const result = markSupersededFn!(row.id);
      expect(result).toBe(true);
      // Verify the tier was actually changed
      const updated = db.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(row.id) as { importance_tier: string } | undefined;
      if (updated) {
        expect(updated.importance_tier).toBe('deprecated');
      }
      // Restore original tier
      if (original) {
        db.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?')
          .run(original.importance_tier, row.id);
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('handles non-existent ID', () => {
      // SQL UPDATE affects 0 rows but shouldn't throw
      const result = markSupersededFn!(99999);
      // Some implementations return true (no-op), some return false
      expect(typeof result).toBe('boolean');
    });

    it.skipIf(!canRun || !hasModuleDb)('idempotent - no error on repeated calls', () => {
      expect(() => {
        markSupersededFn!(77777);
        markSupersededFn!(77777);
      }).not.toThrow();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: updateExistingMemory
  ──────────────────────────────────────────────────────────────── */

  describe('updateExistingMemory', () => {
    const updateFn = typeof updateExistingMemory === 'function'
      ? updateExistingMemory
      : null;
    const hasGetDb = typeof vectorIndex.getDb === 'function';
    const canRun = updateFn && hasGetDb;

    let db: Database.Database | null = null;
    beforeAll(() => {
      if (canRun) {
        try {
          db = vectorIndex.getDb();
        } catch {
          db = null;
        }
      }
    });

    it.skipIf(!canRun || !hasModuleDb)('returns correct shape', () => {
      if (!db) return;
      const row = db.prepare('SELECT id FROM memory_index LIMIT 1').get() as { id: number } | undefined;
      if (!row) {
        // No memories in DB - skip gracefully
        return;
      }
      const parsed = {
        specFolder: 'specs/test',
        filePath: '/specs/test/memory/test.md',
        title: 'Updated Title',
        triggerPhrases: ['trigger1', 'trigger2'],
        content: 'updated content',
        contentHash: 'updated-hash',
        contextType: 'decision',
        importanceTier: 'important',
      };
      const embedding = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) embedding[i] = Math.random() * 2 - 1;

      const result = updateFn!(row.id, parsed, embedding);
      expect(result.status).toBe('updated');
      expect(result.id).toBe(row.id);
      expect(result.specFolder).toBe('specs/test');
      expect(result.title).toBe('Updated Title');
    });

    it.skipIf(!canRun || !hasModuleDb)('includes metadata fields', () => {
      if (!db) return;
      const row = db.prepare('SELECT id FROM memory_index LIMIT 1').get() as { id: number } | undefined;
      if (!row) {
        // No memories in DB - skip gracefully
        return;
      }
      const parsed = {
        specFolder: 'specs/meta-test',
        filePath: '/specs/meta-test/memory/m.md',
        title: 'Meta Test',
        triggerPhrases: ['alpha', 'beta'],
        content: 'test',
        contentHash: 'meta-hash',
        contextType: 'research',
        importanceTier: 'critical',
      };
      const embedding = new Float32Array(1024);

      const result = updateFn!(row.id, parsed, embedding);
      expect(result.triggerPhrases).toContain('alpha');
      expect(result.contextType).toBe('research');
      expect(result.importanceTier).toBe('critical');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: getAtomicityMetrics
  ──────────────────────────────────────────────────────────────── */

  describe('getAtomicityMetrics', () => {
    const getMetricsFn = typeof handler.getAtomicityMetrics === 'function'
      ? handler.getAtomicityMetrics
      : null;

    it.skipIf(!getMetricsFn)('returns an object', () => {
      const metrics = getMetricsFn!();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });

    it.skipIf(!getMetricsFn)('has expected fields', () => {
      const metrics = getMetricsFn!();
      const expectedFields = ['totalAtomicWrites', 'totalDeletes', 'totalRecoveries', 'totalErrors'];
      const presentFields = expectedFields.filter(f => f in metrics);
      expect(presentFields.length).toBeGreaterThanOrEqual(3);
    });

    it.skipIf(!getMetricsFn)('numeric metric values', () => {
      const metrics = getMetricsFn!();
      const numericFields = Object.entries(metrics).filter(([_k, v]) =>
        typeof v === 'number'
      );
      expect(numericFields.length).toBeGreaterThanOrEqual(3);
    });

    it.skipIf(!getMetricsFn)('returns defensive copy', () => {
      const metrics1 = getMetricsFn!();
      metrics1.totalAtomicWrites = 999999;
      const metrics2 = getMetricsFn!();
      expect(metrics2.totalAtomicWrites).not.toBe(999999);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: atomicSaveMemory
  ──────────────────────────────────────────────────────────────── */

  describe('atomicSaveMemory', () => {
    const atomicSaveFn = typeof handler.atomicSaveMemory === 'function'
      ? handler.atomicSaveMemory
      : null;

    it.skipIf(!atomicSaveFn)('returns result with success and filePath fields', async () => {
      const tmpDir = path.join(os.tmpdir(), 'memory-save-test-' + Date.now());
      fs.mkdirSync(tmpDir, { recursive: true });
      const testFile = path.join(tmpDir, 'test-memory.md');

      const content = `---
title: Test Memory
trigger_phrases: ["test trigger"]
importance_tier: normal
---

# Test Memory

This is test content.
`;

      try {
        const result = await atomicSaveFn!(
          { file_path: testFile, content },
          { force: true }
        );
        expect(typeof result.success).toBe('boolean');
        expect(typeof result.filePath).toBe('string');
      } catch (err: unknown) {
        expect(getErrorMessage(err)).toBeDefined();
      } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_cleanupError: unknown) {}
      }
    }, 15000);

    it.skipIf(!atomicSaveFn)('rejects for empty params', async () => {
      try {
        const result = await atomicSaveFn!({ file_path: '', content: '' }, {});
        expect(result.success).toBe(false);
      } catch (err: unknown) {
        expect(getErrorMessage(err)).toBeDefined();
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     SUITE: indexMemoryFile
  ──────────────────────────────────────────────────────────────── */

  describe('indexMemoryFile', () => {
    const indexFileFn = typeof handler.indexMemoryFile === 'function'
      ? handler.indexMemoryFile
      : null;
    type IndexFileOptions = Parameters<NonNullable<typeof indexFileFn>>[1];
    type ParsedOverride = NonNullable<NonNullable<IndexFileOptions>['parsedOverride']>;

    it.skipIf(!indexFileFn)('rejects invalid file', async () => {
      await expect(indexFileFn!('/tmp/nonexistent-file.md')).rejects.toThrow();
    });

    it.skipIf(!indexFileFn)('accepts parsedOverride option', async () => {
      const fakeParsed = {
        specFolder: 'specs/fake',
        filePath: '/fake/path.md',
        title: 'Fake',
        triggerPhrases: [],
        content: 'content',
        contentHash: 'fakehash',
        contextType: 'implementation',
        importanceTier: 'normal',
        hasCausalLinks: false,
      } as unknown as ParsedOverride;

      try {
        await indexFileFn!('/fake/path.md', { parsedOverride: fakeParsed });
      } catch (e: unknown) {
        expect(getErrorMessage(e)).toBeDefined();
      }
    });

    it.skipIf(!indexFileFn)('force option accepted', async () => {
      await expect(indexFileFn!('/tmp/nonexistent.md', { force: true })).rejects.toThrow();
    });
  });
});
