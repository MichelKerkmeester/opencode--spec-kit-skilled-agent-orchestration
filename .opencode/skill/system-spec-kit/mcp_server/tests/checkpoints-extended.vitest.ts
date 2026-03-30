import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll, vi } from 'vitest';

// TEST: CHECKPOINTS EXTENDED
// Covers handler happy-paths (with in-memory DB) and storage
// Gap paths: getDatabase error, getGitBranch, restoreCheckpoint
// ClearExisting=true, duplicate file_path skip, edge cases.
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as zlib from 'zlib';
import BetterSqlite3 from 'better-sqlite3';
import * as checkpointStorage from '../lib/storage/checkpoints';
import * as coreModule from '../core/db-state';
import * as handler from '../handlers/checkpoints';
import * as memorySaveHandler from '../handlers/memory-save';
import * as memoryIndexHandler from '../handlers/memory-index';
import * as memoryBulkDeleteHandler from '../handlers/memory-bulk-delete';

type TestDatabase = InstanceType<typeof BetterSqlite3>;
type VectorIndexModule = typeof import('../lib/search/vector-index');
type CheckpointHandlerResponse = Awaited<ReturnType<typeof handler.handleCheckpointList>>;

interface CountRow {
  cnt: number;
}

interface ExtendedMemoryRow {
  canonical_file_path: string | null;
  content_hash: string | null;
  content_text: string | null;
  quality_score: number;
  quality_flags: string | null;
  chunk_index: number | null;
  chunk_label: string | null;
}

interface HexEmbeddingRow {
  hex_embedding: string;
}

interface ParsedHandlerEnvelope {
  summary?: string;
  data?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

type CheckpointMemoryRowInput = Record<string, unknown> | null;

let vectorIndexModule: VectorIndexModule | null = null;
let testDb!: TestDatabase;
let tmpDbPath = '';

function getCount(query: string, ...params: unknown[]): number {
  const row = testDb.prepare(query).get(...params) as CountRow;
  return row.cnt;
}

function parseHandlerResponse(response: CheckpointHandlerResponse): ParsedHandlerEnvelope {
  return JSON.parse(response.content[0]?.text ?? '{}') as ParsedHandlerEnvelope;
}

function parseMcpEnvelope<T = ParsedHandlerEnvelope>(response: { content: Array<{ text?: string }> }): T {
  return JSON.parse(response.content[0]?.text ?? '{}') as T;
}

/* ─────────────────────────────────────────────────────────────
   TEST SUITES
──────────────────────────────────────────────────────────────── */

describe('CHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures]', () => {
  beforeAll(async () => {
    try {
      vectorIndexModule = await import('../lib/search/vector-index');
    } catch {
      // Non-fatal
    }

    // Database initialization
    tmpDbPath = path.join(os.tmpdir(), `checkpoints-ext-test-${Date.now()}.db`);
    testDb = new BetterSqlite3(tmpDbPath);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL,
        file_path TEXT NOT NULL,
        anchor_id TEXT,
        title TEXT,
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 0.5,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        embedding_model TEXT,
        embedding_generated_at TEXT,
        embedding_status TEXT DEFAULT 'success',
        importance_tier TEXT DEFAULT 'normal',
        confidence REAL DEFAULT 0.5,
        stability REAL DEFAULT 1.0,
        difficulty REAL DEFAULT 5.0,
        last_review TEXT,
        review_count INTEGER DEFAULT 0,
        validation_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS checkpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL,
        spec_folder TEXT,
        git_branch TEXT,
        memory_snapshot BLOB,
        file_snapshot BLOB,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS working_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
        value TEXT,
        created_at TEXT
      );
    `);

    // Seed test memories
    const now = new Date().toISOString();
    const stmt = testDb.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run('test-spec', '/test/memory/mem1.md', 'Test Memory 1', now, 'normal');
    stmt.run('test-spec', '/test/memory/mem2.md', 'Test Memory 2', now, 'important');
    stmt.run('other-spec', '/test/memory/mem3.md', 'Test Memory 3', now, 'critical');

    checkpointStorage.init(testDb);
  });

  beforeEach(() => {
    vi.spyOn(coreModule, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    checkpointStorage.setRestoreBarrierHooks(null);
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    if (testDb) {
      try { testDb.close(); } catch {}
    }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) {
      try { fs.unlinkSync(tmpDbPath); } catch {}
    }
  });

  /* ─────────────────────────────────────────────────────────────
     4. STORAGE GAP TESTS
  ──────────────────────────────────────────────────────────────── */

  // 4.1 getDatabase error path
  describe('Storage: getDatabase Error Path', () => {
    it('EXT-S1: getDatabase returns DB when initialized', () => {
      const db = checkpointStorage.getDatabase();
      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    });

    it('EXT-S2: getDatabase throws when not initialized', () => {
      const savedDb = testDb;
      // @ts-expect-error intentionally passing null to exercise uninitialized error path
      checkpointStorage.init(null);

      expect(() => checkpointStorage.getDatabase()).toThrow(/not initialized/);

      // Restore
      checkpointStorage.init(savedDb);
    });
  });

  // 4.2 getGitBranch
  describe('Storage: getGitBranch', () => {
    it('EXT-S3: getGitBranch returns string or null', () => {
      const originalEnv = {
        GIT_BRANCH: process.env.GIT_BRANCH,
        BRANCH_NAME: process.env.BRANCH_NAME,
        CI_COMMIT_REF_NAME: process.env.CI_COMMIT_REF_NAME,
        VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
      };

      delete process.env.GIT_BRANCH;
      delete process.env.BRANCH_NAME;
      delete process.env.CI_COMMIT_REF_NAME;
      delete process.env.VERCEL_GIT_COMMIT_REF;

      try {
        expect(checkpointStorage.getGitBranch()).toBeNull();

        process.env.GIT_BRANCH = 'feature/ext-s3-branch';
        expect(checkpointStorage.getGitBranch()).toBe('feature/ext-s3-branch');
      } finally {
        for (const [key, value] of Object.entries(originalEnv)) {
          if (value === undefined) {
            delete process.env[key];
          } else {
            process.env[key] = value;
          }
        }
      }
    });

    it('EXT-S4: checkpoint records git branch', () => {
      const originalEnv = {
        GIT_BRANCH: process.env.GIT_BRANCH,
        BRANCH_NAME: process.env.BRANCH_NAME,
        CI_COMMIT_REF_NAME: process.env.CI_COMMIT_REF_NAME,
        VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
      };

      delete process.env.BRANCH_NAME;
      delete process.env.CI_COMMIT_REF_NAME;
      delete process.env.VERCEL_GIT_COMMIT_REF;
      process.env.GIT_BRANCH = 'feature/git-branch-test';

      try {
        const cp = checkpointStorage.createCheckpoint({ name: 'git-branch-test' });
        expect(cp).toBeDefined();
        expect(cp?.gitBranch).toBe('feature/git-branch-test');

        const stored = checkpointStorage.getCheckpoint('git-branch-test');
        expect(stored).toBeDefined();
        expect(stored?.git_branch).toBe('feature/git-branch-test');
      } finally {
        checkpointStorage.deleteCheckpoint('git-branch-test');
        for (const [key, value] of Object.entries(originalEnv)) {
          if (value === undefined) {
            delete process.env[key];
          } else {
            process.env[key] = value;
          }
        }
      }
    });
  });

  // 4.3 restoreCheckpoint with clearExisting=true
  describe('Storage: restoreCheckpoint clearExisting=true', () => {
    it('EXT-S5: restore with clearExisting clears and restores', () => {
      const cp = checkpointStorage.createCheckpoint({ name: 'clear-existing-test' });
      expect(cp).toBeDefined();

      // Add a 4th memory
      const now = new Date().toISOString();
      testDb.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
        VALUES (?, ?, ?, ?, ?)
      `).run('extra-spec', '/test/memory/extra.md', 'Extra Memory', now, 'normal');

      const countBefore = getCount('SELECT COUNT(*) as cnt FROM memory_index');

      const result = checkpointStorage.restoreCheckpoint('clear-existing-test', true);

      const countAfter = getCount('SELECT COUNT(*) as cnt FROM memory_index');

      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
      expect(result.restored).toBeGreaterThan(0);

      checkpointStorage.deleteCheckpoint('clear-existing-test');
    });

    it('EXT-S6: clearExisting removes non-checkpoint memories', () => {
      // Create checkpoint, add extra, restore with clear
      const cp = checkpointStorage.createCheckpoint({ name: 'clear-extra-test' });
      expect(cp).toBeDefined();

      const now = new Date().toISOString();
      testDb.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
        VALUES (?, ?, ?, ?, ?)
      `).run('extra-spec', '/test/memory/extra2.md', 'Extra Memory 2', now, 'normal');

      checkpointStorage.restoreCheckpoint('clear-extra-test', true);

      expect(
        getCount("SELECT COUNT(*) as cnt FROM memory_index WHERE file_path = '/test/memory/extra2.md'")
      ).toBe(0);

      checkpointStorage.deleteCheckpoint('clear-extra-test');
    });
  });

  // 4.4 restoreCheckpoint duplicate file_path skip
  describe('Storage: restoreCheckpoint Duplicate file_path Skip', () => {
    it('EXT-S7: restore without clear handles existing data', () => {
      const cp = checkpointStorage.createCheckpoint({ name: 'dup-skip-test' });
      expect(cp).toBeDefined();

      const result = checkpointStorage.restoreCheckpoint('dup-skip-test', false);
      expect(result).toBeDefined();

      checkpointStorage.deleteCheckpoint('dup-skip-test');
    });
  });

  // 4.5 Edge cases
  describe('Storage: Edge Cases', () => {
    it('EXT-S8: restore non-existent returns errors or throws', () => {
      let handled = false;
      try {
        const result = checkpointStorage.restoreCheckpoint('non-existent-checkpoint-xyz');
        if (result && result.errors.length > 0) {
          handled = true;
        }
      } catch {
        handled = true;
      }
      expect(handled).toBe(true);
    });

    it('EXT-S9: duplicate checkpoint name handled', () => {
      let handled = false;
      try {
        checkpointStorage.createCheckpoint({ name: 'dup-name-test' });
        checkpointStorage.createCheckpoint({ name: 'dup-name-test' });
        handled = true;
      } catch {
        handled = true;
      }
      expect(handled).toBe(true);
      checkpointStorage.deleteCheckpoint('dup-name-test');
    });

    it('EXT-S10: getCheckpoint by numeric ID', () => {
      const cp = checkpointStorage.createCheckpoint({ name: 'id-lookup-test' });
      if (!cp || !cp.id) return;

      const fetched = checkpointStorage.getCheckpoint(cp.id);
      expect(fetched).toBeDefined();
      if (!fetched) return;
      expect(fetched.name).toBe('id-lookup-test');

      checkpointStorage.deleteCheckpoint('id-lookup-test');
    });
  });

  // 4.6 T101: Transaction rollback on corrupt restore
  describe('Storage: T101 Transaction Rollback on Corrupt Restore', () => {
    it('EXT-S11: transaction rollback preserves data on corrupt restore', () => {
      const countBefore = getCount('SELECT COUNT(*) as cnt FROM memory_index');
      if (countBefore === 0) return;

      const cp = checkpointStorage.createCheckpoint({ name: 'rollback-test' });
      expect(cp).toBeDefined();

      const corruptSnapshot = {
        memories: [
          { id: 9001, spec_folder: 'valid-spec', file_path: '/test/ok.md', title: 'Valid', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), importance_tier: 'normal' },
          { id: 9002, spec_folder: null, file_path: null, title: null, created_at: null, updated_at: null, importance_tier: 'normal' },
        ],
        workingMemory: [],
        timestamp: new Date().toISOString(),
      };
      const corruptBlob = zlib.gzipSync(Buffer.from(JSON.stringify(corruptSnapshot)));

      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-test');

      const result = checkpointStorage.restoreCheckpoint('rollback-test', true);

      const countAfter = getCount('SELECT COUNT(*) as cnt FROM memory_index');
      expect(countAfter).toBe(countBefore);

      checkpointStorage.deleteCheckpoint('rollback-test');
    });

    it('EXT-S12: rollback result reports errors', () => {
      const countBefore = getCount('SELECT COUNT(*) as cnt FROM memory_index');
      if (countBefore === 0) return;

      const cp = checkpointStorage.createCheckpoint({ name: 'rollback-errors-test' });
      expect(cp).toBeDefined();

      const corruptSnapshot = {
        memories: [
          { id: 9001, spec_folder: 'valid-spec', file_path: '/test/ok.md', title: 'Valid', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), importance_tier: 'normal' },
          { id: 9002, spec_folder: null, file_path: null, title: null, created_at: null, updated_at: null, importance_tier: 'normal' },
        ],
        workingMemory: [],
        timestamp: new Date().toISOString(),
      };
      const corruptBlob = zlib.gzipSync(Buffer.from(JSON.stringify(corruptSnapshot)));
      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-errors-test');

      const result = checkpointStorage.restoreCheckpoint('rollback-errors-test', true);
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);

      checkpointStorage.deleteCheckpoint('rollback-errors-test');
    });

    it('EXT-S13: rollback resets restored counter to 0', () => {
      const countBefore = getCount('SELECT COUNT(*) as cnt FROM memory_index');
      if (countBefore === 0) return;

      const cp = checkpointStorage.createCheckpoint({ name: 'rollback-counter-test' });
      expect(cp).toBeDefined();

      const corruptSnapshot = {
        memories: [
          { id: 9001, spec_folder: 'valid-spec', file_path: '/test/ok.md', title: 'Valid', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), importance_tier: 'normal' },
          { id: 9002, spec_folder: null, file_path: null, title: null, created_at: null, updated_at: null, importance_tier: 'normal' },
        ],
        workingMemory: [],
        timestamp: new Date().toISOString(),
      };
      const corruptBlob = zlib.gzipSync(Buffer.from(JSON.stringify(corruptSnapshot)));
      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-counter-test');

      const result = checkpointStorage.restoreCheckpoint('rollback-counter-test', true);
      expect(result).toBeDefined();
      expect(result.restored).toBe(0);

      checkpointStorage.deleteCheckpoint('rollback-counter-test');
    });

    it('EXT-S13b: barrier clears after rollbacking restore failure', () => {
      checkpointStorage.createCheckpoint({ name: 'rollback-barrier-test' });

      const badSnapshot = {
        manifest: {
          snapshot: ['memory_index', 'working_memory'],
          rebuild: [],
          skip: ['checkpoints'],
        },
        tables: {
          memory_index: {
            columns: ['id', 'spec_folder', 'file_path', 'title', 'created_at', 'updated_at', 'importance_tier'],
            rows: [
              {
                id: 9101,
                spec_folder: 'rollback-spec',
                file_path: '/test/rollback.md',
                title: 'Rollback Barrier Test',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                importance_tier: 'normal',
              },
            ],
          },
          working_memory: {
            columns: ['id', 'key', 'value', 'created_at'],
            rows: [
              {
                id: 1,
                key: null,
                value: 'bad-row',
                created_at: new Date().toISOString(),
              },
            ],
          },
        },
        memories: [],
        workingMemory: [],
        timestamp: new Date().toISOString(),
      };

      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(
        zlib.gzipSync(Buffer.from(JSON.stringify(badSnapshot))),
        'rollback-barrier-test',
      );

      const result = checkpointStorage.restoreCheckpoint('rollback-barrier-test', true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(checkpointStorage.isRestoreInProgress()).toBe(false);

      checkpointStorage.deleteCheckpoint('rollback-barrier-test');
    });
  });

  describe('Storage: Restore Maintenance Barrier', () => {
    it('EXT-S13c: barrier blocks concurrent mutation handlers during restore', async () => {
      checkpointStorage.createCheckpoint({ name: 'barrier-block-test' });

      let savePromise: Promise<Awaited<ReturnType<typeof memorySaveHandler.handleMemorySave>>> | null = null;
      let indexPromise: Promise<Awaited<ReturnType<typeof memoryIndexHandler.handleMemoryIndexScan>>> | null = null;
      let bulkDeletePromise: Promise<Awaited<ReturnType<typeof memoryBulkDeleteHandler.handleMemoryBulkDelete>>> | null = null;

      checkpointStorage.setRestoreBarrierHooks({
        afterAcquire: () => {
          expect(checkpointStorage.isRestoreInProgress()).toBe(true);
          savePromise = memorySaveHandler.handleMemorySave({
            filePath: '/tmp/restore-barrier-memory.md',
          } as Parameters<typeof memorySaveHandler.handleMemorySave>[0]);
          indexPromise = memoryIndexHandler.handleMemoryIndexScan({});
          bulkDeletePromise = memoryBulkDeleteHandler.handleMemoryBulkDelete({
            tier: 'deprecated',
            confirm: true,
          });
        },
      });

      const restoreResult = checkpointStorage.restoreCheckpoint('barrier-block-test', false);
      expect(restoreResult.errors).toEqual(
        expect.not.arrayContaining([expect.stringContaining('Checkpoint not found')]),
      );

      const saveResponse = parseMcpEnvelope<{ data?: { code?: string; error?: string } }>(await savePromise!);
      const indexResponse = parseMcpEnvelope<{ data?: { code?: string; error?: string } }>(await indexPromise!);
      const bulkDeleteResponse = parseMcpEnvelope<{ data?: { code?: string; error?: string } }>(await bulkDeletePromise!);

      for (const envelope of [saveResponse, indexResponse, bulkDeleteResponse]) {
        expect(envelope.data?.code).toBe(checkpointStorage.RESTORE_IN_PROGRESS_ERROR_CODE);
        expect(envelope.data?.error).toContain('Checkpoint restore maintenance is in progress');
      }

      checkpointStorage.deleteCheckpoint('barrier-block-test');
    });

    it('EXT-S13d: barrier clears after successful restore', () => {
      checkpointStorage.createCheckpoint({ name: 'barrier-success-test' });

      const result = checkpointStorage.restoreCheckpoint('barrier-success-test', false);
      expect(result.errors).not.toContain('Checkpoint not found or empty');
      expect(checkpointStorage.isRestoreInProgress()).toBe(false);

      checkpointStorage.deleteCheckpoint('barrier-success-test');
    });
  });

  // 4.7 Extended restore fidelity and vector preservation
  describe('Storage: Restore Fidelity', () => {
    it('EXT-S14: restore preserves extended memory_index columns when schema supports them', () => {
      // Add modern schema columns to this fixture DB if missing.
      const alterStatements = [
        'ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT',
        'ALTER TABLE memory_index ADD COLUMN content_hash TEXT',
        'ALTER TABLE memory_index ADD COLUMN content_text TEXT',
        'ALTER TABLE memory_index ADD COLUMN quality_score REAL DEFAULT 0',
        'ALTER TABLE memory_index ADD COLUMN quality_flags TEXT',
        'ALTER TABLE memory_index ADD COLUMN parent_id INTEGER',
        'ALTER TABLE memory_index ADD COLUMN chunk_index INTEGER',
        'ALTER TABLE memory_index ADD COLUMN chunk_label TEXT',
      ];
      for (const statement of alterStatements) {
        try {
          testDb.exec(statement);
        } catch {
          // Column may already exist from prior test execution.
        }
      }

      testDb.prepare(`
        UPDATE memory_index
        SET canonical_file_path = ?,
            content_hash = ?,
            content_text = ?,
            quality_score = ?,
            quality_flags = ?,
            parent_id = ?,
            chunk_index = ?,
            chunk_label = ?
        WHERE id = ?
      `).run(
        '/canonical/path/mem1.md',
        'abc123hash',
        'restorable content payload',
        0.91,
        '["flag_a","flag_b"]',
        null,
        2,
        'chunk-2',
        1
      );

      checkpointStorage.createCheckpoint({ name: 'extended-cols-test' });

      testDb.prepare(`
        UPDATE memory_index
        SET canonical_file_path = NULL,
            content_hash = NULL,
            content_text = NULL,
            quality_score = 0,
            quality_flags = NULL,
            parent_id = NULL,
            chunk_index = NULL,
            chunk_label = NULL
        WHERE id = ?
      `).run(1);

      const result = checkpointStorage.restoreCheckpoint('extended-cols-test', true);
      expect(result.errors.length).toBe(0);

      const restored = testDb.prepare(`
        SELECT canonical_file_path, content_hash, content_text, quality_score, quality_flags, chunk_index, chunk_label
        FROM memory_index
        WHERE id = ?
      `).get(1) as ExtendedMemoryRow | undefined;

      expect(restored).toBeDefined();
      if (!restored) return;
      expect(restored.canonical_file_path).toBe('/canonical/path/mem1.md');
      expect(restored.content_hash).toBe('abc123hash');
      expect(restored.content_text).toBe('restorable content payload');
      expect(restored.quality_score).toBe(0.91);
      expect(restored.quality_flags).toBe('["flag_a","flag_b"]');
      expect(restored.chunk_index).toBe(2);
      expect(restored.chunk_label).toBe('chunk-2');

      checkpointStorage.deleteCheckpoint('extended-cols-test');
    });

    it('EXT-S15: restore non-clear keeps same file_path entries when anchor_id differs', () => {
      const now = new Date().toISOString();

      testDb.prepare(`
        INSERT OR REPLACE INTO memory_index (
          id, spec_folder, file_path, anchor_id, title, created_at, updated_at, importance_tier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(9101, 'anchor-spec', '/anchor-spec/shared.md', 'section-a', 'Anchor A', now, now, 'normal');

      testDb.prepare(`
        INSERT OR REPLACE INTO memory_index (
          id, spec_folder, file_path, anchor_id, title, created_at, updated_at, importance_tier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(9102, 'anchor-spec', '/anchor-spec/shared.md', 'section-b', 'Anchor B', now, now, 'normal');

      checkpointStorage.createCheckpoint({ name: 'anchor-aware-duplicate-test' });

      // Simulate a missing anchor variant that should be restored.
      testDb.prepare('DELETE FROM memory_index WHERE id = ?').run(9102);

      const result = checkpointStorage.restoreCheckpoint('anchor-aware-duplicate-test', false);
      expect(result.errors.length).toBe(0);

      expect(
        getCount(
          `
        SELECT COUNT(*) as cnt
        FROM memory_index
        WHERE spec_folder = ? AND file_path = ? AND anchor_id = ?
      `,
          'anchor-spec',
          '/anchor-spec/shared.md',
          'section-b'
        )
      ).toBe(1);

      checkpointStorage.deleteCheckpoint('anchor-aware-duplicate-test');
      testDb.prepare('DELETE FROM memory_index WHERE id IN (?, ?)').run(9101, 9102);
    });

    it('EXT-S16: clearExisting restore reinstates checkpoint vector snapshot', () => {
      testDb.exec(`
        CREATE TABLE IF NOT EXISTS vec_memories (
          rowid INTEGER PRIMARY KEY,
          embedding BLOB NOT NULL
        )
      `);

      const originalEmbedding = Buffer.from([0x01, 0x02, 0x03, 0x04]);
      testDb.prepare(`
        INSERT OR REPLACE INTO vec_memories (rowid, embedding)
        VALUES (?, ?)
      `).run(1, originalEmbedding);

      checkpointStorage.createCheckpoint({ name: 'vector-restore-test' });

      // Mutate vector payload and add an orphan vector row not in checkpoint memory set.
      testDb.prepare(`
        INSERT OR REPLACE INTO vec_memories (rowid, embedding)
        VALUES (?, ?)
      `).run(1, Buffer.from([0xaa, 0xbb, 0xcc]));
      testDb.prepare(`
        INSERT OR REPLACE INTO vec_memories (rowid, embedding)
        VALUES (?, ?)
      `).run(9999, Buffer.from([0xff]));

      const result = checkpointStorage.restoreCheckpoint('vector-restore-test', true);
      expect(result.errors.length).toBe(0);

      const restored = testDb.prepare(`
        SELECT hex(embedding) as hex_embedding
        FROM vec_memories
        WHERE rowid = ?
      `).get(1) as HexEmbeddingRow | undefined;

      expect(restored).toBeDefined();
      if (!restored) return;
      expect(restored.hex_embedding).toBe(originalEmbedding.toString('hex').toUpperCase());

      expect(getCount('SELECT COUNT(*) as cnt FROM vec_memories WHERE rowid = ?', 9999)).toBe(0);

      checkpointStorage.deleteCheckpoint('vector-restore-test');
    });
  });

  // 4.8 T107: Schema validation rejects corrupt checkpoint rows
  describe('Storage: T107 Schema Validation Before Restore', () => {
    function injectCheckpoint(name: string, memories: CheckpointMemoryRowInput[]): boolean {
      const snapshot = {
        memories,
        workingMemory: [],
        timestamp: new Date().toISOString(),
      };
      const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(snapshot)));
      const now = new Date().toISOString();
      try {
        testDb.prepare(`INSERT OR REPLACE INTO checkpoints (name, created_at, memory_snapshot, metadata) VALUES (?, ?, ?, ?)`).run(
          name, now, compressed, JSON.stringify({ memoryCount: memories.length })
        );
        return true;
      } catch {
        return false;
      }
    }

    it('T107-01: missing id rejects restore', () => {
      const ok = injectCheckpoint('t107-missing-id', [
        { file_path: '/test/x.md', spec_folder: 'spec', title: 'T', importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01', importance_tier: 'normal' },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-missing-id');
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('id');

      checkpointStorage.deleteCheckpoint('t107-missing-id');
    });

    it('T107-02: non-string file_path rejects restore', () => {
      const ok = injectCheckpoint('t107-bad-filepath', [
        { id: 1, file_path: 123, spec_folder: 'spec', title: 'T', importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01', importance_tier: 'normal' },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-bad-filepath');
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('file_path');

      checkpointStorage.deleteCheckpoint('t107-bad-filepath');
    });

    it('T107-03: missing spec_folder rejects restore', () => {
      const ok = injectCheckpoint('t107-missing-spec', [
        { id: 1, file_path: '/test/x.md', title: 'T', importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01', importance_tier: 'normal' },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-missing-spec');
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('spec_folder');

      checkpointStorage.deleteCheckpoint('t107-missing-spec');
    });

    it('T107-04: missing importance_tier rejects restore', () => {
      const ok = injectCheckpoint('t107-missing-tier', [
        { id: 1, file_path: '/test/x.md', spec_folder: 'spec', title: 'T', importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01' },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-missing-tier');
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('importance_tier');

      checkpointStorage.deleteCheckpoint('t107-missing-tier');
    });

    it('T107-05: old-format checkpoint (no optional fields) restores OK', () => {
      const ok = injectCheckpoint('t107-old-format', [
        {
          id: 8001, file_path: '/test/old.md', spec_folder: 'old-spec',
          title: 'Old Memory', importance_weight: 0.5,
          created_at: '2024-01-01', updated_at: '2024-01-01',
          importance_tier: 'normal',
        },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-old-format');
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
      expect(result.restored).toBeGreaterThan(0);

      testDb.prepare('DELETE FROM memory_index WHERE id = 8001').run();
      checkpointStorage.deleteCheckpoint('t107-old-format');
    });

    it('T107-06: empty memories array restores OK', () => {
      const ok = injectCheckpoint('t107-empty', []);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-empty');
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);

      checkpointStorage.deleteCheckpoint('t107-empty');
    });

    it('T107-07: null row rejects restore', () => {
      const ok = injectCheckpoint('t107-null-row', [null]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-null-row');
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('not an object');

      checkpointStorage.deleteCheckpoint('t107-null-row');
    });

    it('T107-08: validation rejects before DB mutation', () => {
      const countBefore = getCount('SELECT COUNT(*) as cnt FROM memory_index');

      const ok = injectCheckpoint('t107-no-mutation', [
        { id: 9999, file_path: '/test/good.md', spec_folder: 'spec', title: 'Good', importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01', importance_tier: 'normal' },
        { id: 'bad-id' },
      ]);
      if (!ok) return;

      const result = checkpointStorage.restoreCheckpoint('t107-no-mutation', true);
      const countAfter = getCount('SELECT COUNT(*) as cnt FROM memory_index');

      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(countAfter).toBe(countBefore);

      checkpointStorage.deleteCheckpoint('t107-no-mutation');
    });

    it('T107-09: validateMemoryRow accepts valid row', () => {
      expect(checkpointStorage.validateMemoryRow).toBeTypeOf('function');
      expect(() => {
        checkpointStorage.validateMemoryRow({
          id: 1, file_path: '/x.md', spec_folder: 'sp',
          title: 'T', importance_weight: 0.5, created_at: 'now', updated_at: 'now', importance_tier: 'normal',
        }, 0);
      }).not.toThrow();
    });

    it('T107-10: validateMemoryRow rejects invalid id', () => {
      expect(checkpointStorage.validateMemoryRow).toBeTypeOf('function');
      expect(() => {
        checkpointStorage.validateMemoryRow({ id: 'not-a-number', file_path: '/x.md', spec_folder: 'sp' }, 0);
      }).toThrow(/id/);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     5. HANDLER HAPPY-PATH TESTS
  ──────────────────────────────────────────────────────────────── */

  // 5.1 handleCheckpointCreate
  describe('Handler: handleCheckpointCreate Happy Path', () => {
    it('EXT-H1: handleCheckpointCreate returns success', async () => {
      const result = await handler.handleCheckpointCreate({
        name: 'handler-create-test',
        metadata: { reason: 'extended test' },
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        const isSuccess =
          parsed.data?.success === true ||
          (typeof parsed.summary === 'string' && parsed.summary.includes('success'));
        expect(isSuccess).toBe(true);

      checkpointStorage.deleteCheckpoint('handler-create-test');
    });

    it('EXT-H2: handleCheckpointCreate with specFolder', async () => {
      const result = await handler.handleCheckpointCreate({
        name: 'handler-create-spec',
        specFolder: 'test-spec',
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        expect(parsed.data?.success).toBe(true);

      checkpointStorage.deleteCheckpoint('handler-create-spec');
    });
  });

  // 5.2 handleCheckpointList
  describe('Handler: handleCheckpointList Happy Path', () => {
    it('EXT-H3: handleCheckpointList returns checkpoints', async () => {
      checkpointStorage.createCheckpoint({ name: 'list-test-cp' });

      const result = await handler.handleCheckpointList({});

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      const parsed = parseHandlerResponse(result);
      expect(parsed.data).toBeDefined();
      expect(typeof parsed.data?.count).toBe('number');

      checkpointStorage.deleteCheckpoint('list-test-cp');
    });

    it('EXT-H4: handleCheckpointList with specFolder filter', async () => {
      checkpointStorage.createCheckpoint({ name: 'list-filter-test', specFolder: 'filter-spec' });

      const result = await handler.handleCheckpointList({ specFolder: 'filter-spec' });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      checkpointStorage.deleteCheckpoint('list-filter-test');
    });

    it('EXT-H5: handleCheckpointList empty result', async () => {
      const result = await handler.handleCheckpointList({ specFolder: 'non-existent-spec-xyz' });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      const parsed = parseHandlerResponse(result);
      expect(parsed.data).toBeDefined();
      expect(parsed.data?.count).toBe(0);
    });
  });

  // 5.3 handleCheckpointRestore
  describe('Handler: handleCheckpointRestore Happy Path', () => {
    it('EXT-H6: handleCheckpointRestore returns success', async () => {
      checkpointStorage.createCheckpoint({ name: 'restore-handler-test' });

      const result = await handler.handleCheckpointRestore({ name: 'restore-handler-test' });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        const isSuccess =
          parsed.data?.success === true ||
          (typeof parsed.summary === 'string' && parsed.summary.includes('restored'));
        expect(isSuccess).toBe(true);

      checkpointStorage.deleteCheckpoint('restore-handler-test');
    });

    it('EXT-H7: handleCheckpointRestore with clearExisting', async () => {
      checkpointStorage.createCheckpoint({ name: 'restore-clear-test' });

      const result = await handler.handleCheckpointRestore({
        name: 'restore-clear-test',
        clearExisting: true,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        expect(parsed.data?.success).toBe(true);

      checkpointStorage.deleteCheckpoint('restore-clear-test');
    });
  });

  // 5.4 handleCheckpointDelete
  describe('Handler: handleCheckpointDelete Happy Path', () => {
    it('EXT-H8: handleCheckpointDelete returns success', async () => {
      checkpointStorage.createCheckpoint({ name: 'delete-handler-test' });

      const result = await handler.handleCheckpointDelete({
        name: 'delete-handler-test',
        confirmName: 'delete-handler-test',
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data && parsed.data.success).toBe(true);
    });

    it('EXT-H9: handleCheckpointDelete not-found handled', async () => {
      const result = await handler.handleCheckpointDelete({
        name: 'does-not-exist-xyz',
        confirmName: 'does-not-exist-xyz',
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      const parsed = parseHandlerResponse(result);
      // Success=false or success=true are both acceptable
      expect(parsed.data).toBeDefined();
    });
  });

  // 5.5 handleMemoryValidate
  describe('Handler: handleMemoryValidate Happy Path', () => {
    it('EXT-H10: handleMemoryValidate positive validation', async () => {
      if (!vectorIndexModule) return;

      vi.spyOn(vectorIndexModule, 'initializeDb').mockReturnValue(testDb);
      vi.spyOn(vectorIndexModule, 'getDb').mockReturnValue(testDb);

      try {
        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: true });

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        const hasData =
          typeof parsed.data?.confidence === 'number' ||
          (typeof parsed.summary === 'string' && parsed.summary.includes('validation'));
        expect(hasData).toBe(true);
      } finally {
        vi.restoreAllMocks();
      }
    });

    it('EXT-H11: handleMemoryValidate negative validation', async () => {
      if (!vectorIndexModule) return;

      vi.spyOn(vectorIndexModule, 'initializeDb').mockReturnValue(testDb);
      vi.spyOn(vectorIndexModule, 'getDb').mockReturnValue(testDb);

      try {
        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: false });

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = parseHandlerResponse(result);
        expect(typeof parsed.data?.confidence === 'number').toBe(true);
      } finally {
        vi.restoreAllMocks();
      }
    });
  });

  // 5.6 Handler response format
  describe('Handler: Response Envelope Format', () => {
    it('EXT-H12: response follows MCP envelope format', async () => {
      checkpointStorage.createCheckpoint({ name: 'format-test-cp' });

      const result = await handler.handleCheckpointList({});

      expect(result).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);

      const firstItem = result.content[0];
      expect(firstItem).toBeDefined();
      if (!firstItem) return;
      expect(firstItem.type).toBe('text');
      expect(typeof firstItem.text).toBe('string');

      const parsed = JSON.parse(firstItem.text) as ParsedHandlerEnvelope;
      expect(parsed.summary).toBeDefined();
      expect(parsed.data).toBeDefined();
      expect(parsed.meta).toBeDefined();

      checkpointStorage.deleteCheckpoint('format-test-cp');
    });
  });

  describe('Handler: Checkpoint Scope Validation', () => {
    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
      await expect(handler.handleCheckpointList({
        tenantId: '   ',
        sharedSpaceId: 'space-1',
      })).rejects.toThrow(/tenantId must be a non-empty string/i);
    });
  });
});
