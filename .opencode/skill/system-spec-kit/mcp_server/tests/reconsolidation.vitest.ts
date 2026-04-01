// TEST: Reconsolidation-on-Save (TM-06)
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import * as bm25Index from '../lib/search/bm25-index';
import { getHistory, init as initHistory } from '../lib/storage/history';
import {
  isReconsolidationEnabled,
  findSimilarMemories,
  determineAction,
  executeMerge,
  executeConflict,
  executeComplement,
  mergeContent,
  reconsolidate,
  MERGE_THRESHOLD,
  CONFLICT_THRESHOLD,
  SIMILAR_MEMORY_LIMIT,
} from '../lib/storage/reconsolidation';
import type {
  SimilarMemory,
  NewMemoryData,
  ReconsolidationAction,
  FindSimilarFn,
  StoreMemoryFn,
} from '../lib/storage/reconsolidation';


// TEST HELPERS
/** Create a simple embedding vector of given dimension */
function makeEmbedding(dim: number, fill: number = 1.0): number[] {
  return Array(dim).fill(fill);
}

/** Create a mock findSimilar function */
function mockFindSimilar(results: SimilarMemory[]): FindSimilarFn {
  return (
    _embedding: Parameters<FindSimilarFn>[0],
    _options: Parameters<FindSimilarFn>[1],
  ) => results;
}

/** Create a mock storeMemory function */
function mockStoreMemory(returnId: number): StoreMemoryFn {
  return (_memory: NewMemoryData) => returnId;
}

/** Create a base valid new memory object */
function makeNewMemory(overrides: Partial<NewMemoryData> = {}): NewMemoryData {
  return {
    title: 'Test Memory Title',
    content: 'This is the content of the new memory that is being saved for testing purposes.',
    specFolder: 'test-spec',
    filePath: '/test/memory.md',
    embedding: makeEmbedding(10),
    triggerPhrases: ['test', 'memory'],
    importanceTier: 'normal',
    importanceWeight: 0.5,
    ...overrides,
  };
}

/** Create a base existing similar memory */
function makeSimilarMemory(overrides: Partial<SimilarMemory> = {}): SimilarMemory {
  return {
    id: 100,
    file_path: '/test/existing.md',
    title: 'Existing Memory',
    content_text: 'This is the existing memory content that was previously stored.',
    similarity: 0.90,
    spec_folder: 'test-spec',
    importance_weight: 0.5,
    ...overrides,
  };
}

function getReachableVectorMemoryIds(database: Database.Database): number[] {
  const rows = database.prepare(`
    SELECT m.id
    FROM memory_index m
    JOIN active_memory_projection p ON p.active_memory_id = m.id
    JOIN vec_memories v ON m.id = v.rowid
    WHERE m.embedding_status = 'success'
      AND (m.is_archived IS NULL OR m.is_archived = 0)
    ORDER BY m.id ASC
  `).all() as Array<{ id: number }>;

  return rows.map((row) => row.id);
}

function expectMergeResult(result: Awaited<ReturnType<typeof executeMerge>>) {
  expect(result.action).toBe('merge');
  if (result.action !== 'merge') {
    const status = 'status' in result ? result.status : 'unknown';
    throw new Error(`Expected merge result but received ${result.action}:${status}`);
  }
  return result;
}

describe('Reconsolidation-on-Save (TM-06)', () => {
  let testDb: Database.Database;

  beforeAll(() => {
    testDb = new Database(':memory:');

    // Create memory_index table matching production schema
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        title TEXT,
        content_text TEXT,
        trigger_phrases TEXT DEFAULT '[]',
        content_hash TEXT DEFAULT '',
        importance_weight REAL DEFAULT 0.5,
        importance_tier TEXT DEFAULT 'normal',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_review TEXT,
        parent_id INTEGER,
        embedding_status TEXT DEFAULT 'pending',
        is_archived INTEGER DEFAULT 0
      )
    `);

    // Create vec_memories table (simplified for testing)
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS vec_memories (
        rowid INTEGER PRIMARY KEY,
        embedding BLOB
      )
    `);

    // Create causal_edges table
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS causal_edges (
        id INTEGER PRIMARY KEY,
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

    testDb.exec(`
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

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_lineage (
        memory_id INTEGER PRIMARY KEY,
        logical_key TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        root_memory_id INTEGER NOT NULL,
        predecessor_memory_id INTEGER,
        superseded_by_memory_id INTEGER,
        valid_from TEXT NOT NULL,
        valid_to TEXT,
        transition_event TEXT NOT NULL,
        actor TEXT NOT NULL DEFAULT 'system',
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS active_memory_projection (
        logical_key TEXT PRIMARY KEY,
        root_memory_id INTEGER NOT NULL,
        active_memory_id INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Initialize causal edges module
    causalEdges.init(testDb);
    initHistory(testDb);
  });

  afterAll(() => {
    if (testDb) {
      try { testDb.close(); } catch {}
    }
  });

  beforeEach(() => {
    // Clean tables before each test
    testDb.exec('DELETE FROM memory_index');
    testDb.exec('DELETE FROM vec_memories');
    testDb.exec('DELETE FROM causal_edges');
    testDb.exec('DELETE FROM memory_lineage');
    testDb.exec('DELETE FROM active_memory_projection');
    vi.restoreAllMocks();
  });

  /* ───────────────────────────────────────────────────────────────
     Feature Flag
  ──────────────────────────────────────────────────────────────── */

  describe('Feature Flag', () => {
    const originalEnv = process.env.SPECKIT_RECONSOLIDATION;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.SPECKIT_RECONSOLIDATION = originalEnv;
      } else {
        delete process.env.SPECKIT_RECONSOLIDATION;
      }
    });

    it('RF1: Enabled by default when env var is unset (graduated)', () => {
      delete process.env.SPECKIT_RECONSOLIDATION;
      expect(isReconsolidationEnabled()).toBe(true);
    });

    it('RF2: Enabled when env var is "true"', () => {
      process.env.SPECKIT_RECONSOLIDATION = 'true';
      expect(isReconsolidationEnabled()).toBe(true);
    });

    it('RF3: Case insensitive', () => {
      process.env.SPECKIT_RECONSOLIDATION = 'TRUE';
      expect(isReconsolidationEnabled()).toBe(true);
    });

    it('RF4: Disabled for "false"', () => {
      process.env.SPECKIT_RECONSOLIDATION = 'false';
      expect(isReconsolidationEnabled()).toBe(false);
    });

    it('RF5: Flag OFF means reconsolidate returns null', async () => {
      process.env.SPECKIT_RECONSOLIDATION = 'false';
      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        {
          findSimilar: mockFindSimilar([]),
          storeMemory: mockStoreMemory(1),
        }
      );
      expect(result).toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Constants
  ──────────────────────────────────────────────────────────────── */

  describe('Constants', () => {
    it('CT1: MERGE_THRESHOLD is 0.88', () => {
      expect(MERGE_THRESHOLD).toBe(0.88);
    });

    it('CT2: CONFLICT_THRESHOLD is 0.75', () => {
      expect(CONFLICT_THRESHOLD).toBe(0.75);
    });

    it('CT3: SIMILAR_MEMORY_LIMIT is 3', () => {
      expect(SIMILAR_MEMORY_LIMIT).toBe(3);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Action Determination
  ──────────────────────────────────────────────────────────────── */

  describe('Action Determination', () => {
    it('AD1: similarity >= 0.88 -> merge', () => {
      expect(determineAction(0.88)).toBe('merge');
      expect(determineAction(0.90)).toBe('merge');
      expect(determineAction(0.95)).toBe('merge');
      expect(determineAction(1.0)).toBe('merge');
    });

    it('AD2: similarity 0.75-0.879 -> conflict', () => {
      expect(determineAction(0.75)).toBe('conflict');
      expect(determineAction(0.80)).toBe('conflict');
      expect(determineAction(0.879)).toBe('conflict');
    });

    it('AD3: similarity < 0.75 -> complement', () => {
      expect(determineAction(0.74)).toBe('complement');
      expect(determineAction(0.50)).toBe('complement');
      expect(determineAction(0.0)).toBe('complement');
    });

    it('AD4: Boundary: exactly 0.88 is merge', () => {
      expect(determineAction(0.88)).toBe('merge');
    });

    it('AD5: Boundary: exactly 0.75 is conflict', () => {
      expect(determineAction(0.75)).toBe('conflict');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Find Similar Memories
  ──────────────────────────────────────────────────────────────── */

  describe('Find Similar Memories', () => {
    it('FS1: Returns results from findSimilar callback', () => {
      const expected = [makeSimilarMemory({ id: 1, similarity: 0.9 })];
      const results = findSimilarMemories(
        makeEmbedding(10),
        'test-spec',
        mockFindSimilar(expected)
      );
      expect(results).toHaveLength(1);
      expect(results[0]!.id).toBe(1);
    });

    it('FS2: Returns empty array on error', () => {
      const errorFn = () => { throw new Error('Search failed'); };
      const results = findSimilarMemories(
        makeEmbedding(10),
        'test-spec',
        errorFn
      );
      expect(results).toHaveLength(0);
    });

    it('FS3: Passes limit parameter', () => {
      let capturedLimit: number | undefined;
      const captureFn: FindSimilarFn = (_emb, opts) => {
        capturedLimit = (opts as { limit: number }).limit;
        return [];
      };
      findSimilarMemories(makeEmbedding(10), 'test-spec', captureFn, 5);
      expect(capturedLimit).toBe(5);
    });

    it('FS4: Default limit is SIMILAR_MEMORY_LIMIT', () => {
      let capturedLimit: number | undefined;
      const captureFn: FindSimilarFn = (_emb, opts) => {
        capturedLimit = (opts as { limit: number }).limit;
        return [];
      };
      findSimilarMemories(makeEmbedding(10), 'test-spec', captureFn);
      expect(capturedLimit).toBe(SIMILAR_MEMORY_LIMIT);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Merge Content Helper
  ──────────────────────────────────────────────────────────────── */

  describe('Merge Content', () => {
    it('MC1: Empty existing returns incoming', () => {
      const result = mergeContent('', 'new content');
      expect(result).toBe('new content');
    });

    it('MC2: Empty incoming returns existing', () => {
      const result = mergeContent('existing content', '');
      expect(result).toBe('existing content');
    });

    it('MC3: Duplicate lines are not repeated', () => {
      const result = mergeContent('line A\nline B', 'line A\nline B');
      expect(result).toBe('line A\nline B'); // No merge section added
    });

    it('MC4: New unique lines are appended', () => {
      const result = mergeContent('line A\nline B', 'line A\nline C');
      expect(result).toContain('line A');
      expect(result).toContain('line B');
      expect(result).toContain('line C');
      expect(result).toContain('<!-- Merged content -->');
    });

    it('MC5: Merged content has separator marker', () => {
      const result = mergeContent('existing', 'new unique line');
      expect(result).toContain('<!-- Merged content -->');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Merge Path (>= 0.88)
  ──────────────────────────────────────────────────────────────── */

  describe('Merge Path (>= 0.88)', () => {
    it('MP1: Merges content and boosts importance_weight', async () => {
      // Seed existing memory in DB
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (100, 'test-spec', '/test/existing.md', 'Existing', 'Existing content line A', 0.5, datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({
        id: 100,
        content_text: 'Existing content line A',
        importance_weight: 0.5,
        similarity: 0.90,
      });

      const newMem = makeNewMemory({ content: 'New unique content line B' });

      const result = expectMergeResult(await executeMerge(existing, newMem, testDb));

      expect(result.action).toBe('merge');
      expect(result.existingMemoryId).toBe(100);
      expect(result.importanceWeight).toBeCloseTo(0.6); // min(1.0, 0.5 + 0.1)
      expect(result.similarity).toBe(0.90);

      // F04-001: Append-only merge — old row (id=100) is archived, new row holds merged content.
      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 100').get() as {
        is_archived: number;
      };
      expect(oldRow.is_archived).toBe(1);

      // Verify the NEW merged row (latest insert after id=100)
      const newRow = testDb.prepare(
        'SELECT content_text, importance_weight FROM memory_index WHERE id > 100 ORDER BY id DESC LIMIT 1'
      ).get() as {
        content_text: string | null;
        importance_weight: number;
      };
      expect(newRow.importance_weight).toBeCloseTo(0.6);
      expect(newRow.content_text).toContain('Existing content line A');
      expect(newRow.content_text).toContain('New unique content line B');
    });

    it('MP2: importance_weight defaults to 0.5 if not present', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (101, 'test-spec', '/test/101.md', 'No weight', 'Base content', 0.5, datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({
        id: 101,
        file_path: '/test/101.md',
        title: 'No weight',
        content_text: 'Base content',
        importance_weight: undefined,
        similarity: 0.92,
      });

      const result = expectMergeResult(await executeMerge(existing, makeNewMemory({ content: 'Extra content' }), testDb));
      expect(result.action).toBe('merge');
      expect(result.existingMemoryId).toBe(101);
      expect(result.newMemoryId).toBeGreaterThan(101);
      expect(result.importanceWeight).toBeCloseTo(0.6); // min(1.0, 0.5 + 0.1) — default 0.5 + boost

      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 101').get() as {
        is_archived: number;
      };
      expect(oldRow.is_archived).toBe(1);

      const newRow = testDb.prepare(
        'SELECT importance_weight FROM memory_index WHERE id = ?'
      ).get(result.newMemoryId) as {
        importance_weight: number;
      };
      expect(newRow.importance_weight).toBeCloseTo(0.6);
    });

    it('MP3: Merge with embedding regeneration callback', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, created_at, updated_at)
        VALUES (102, 'test-spec', '/test/102.md', 'With emb', 'Original', datetime('now'), datetime('now'))
      `).run();
      testDb.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (102, ?)
      `).run(Buffer.from(new Float32Array([1, 0, 0]).buffer));

      const existing = makeSimilarMemory({
        id: 102,
        file_path: '/test/102.md',
        title: 'With emb',
        content_text: 'Original',
        similarity: 0.89,
      });

      const generateEmbedding = vi.fn(async () => new Float32Array([0, 1, 0]));

      const result = expectMergeResult(await executeMerge(existing, makeNewMemory({ content: 'Additional content' }), testDb, generateEmbedding));
      expect(result.newMemoryId).toBeGreaterThan(102);
      expect(generateEmbedding).toHaveBeenCalledWith('Original\n\n<!-- Merged content -->\nAdditional content');

      const archivedRow = testDb.prepare(
        'SELECT is_archived FROM memory_index WHERE id = 102'
      ).get() as { is_archived: number };
      expect(archivedRow.is_archived).toBe(1);

      const newEmbeddingRow = testDb.prepare(`
        SELECT embedding
        FROM vec_memories
        WHERE rowid = ?
      `).get(result.newMemoryId) as { embedding: Buffer };
      expect(newEmbeddingRow.embedding).toBeInstanceOf(Buffer);
      expect(Array.from(new Float32Array(
        newEmbeddingRow.embedding.buffer,
        newEmbeddingRow.embedding.byteOffset,
        newEmbeddingRow.embedding.byteLength / Float32Array.BYTES_PER_ELEMENT,
      ))).toEqual([0, 1, 0]);
    });

    it('MP4: Keeps merged survivor reachable through active projection and hides archived predecessor', async () => {
      const bm25RemoveDocument = vi.fn();
      const bm25AddDocument = vi.fn();
      vi.spyOn(bm25Index, 'isBm25Enabled').mockReturnValue(true);
      vi.spyOn(bm25Index, 'getIndex').mockReturnValue({
        removeDocument: bm25RemoveDocument,
        addDocument: bm25AddDocument,
      } as unknown as ReturnType<typeof bm25Index.getIndex>);

      testDb.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, content_text, importance_weight,
          embedding_status, created_at, updated_at
        )
        VALUES (
          103, 'test-spec', '/test/103.md', 'Reachable Existing', 'Original reachable content',
          0.5, 'success', datetime('now'), datetime('now')
        )
      `).run();
      testDb.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (103, ?)
      `).run(Buffer.from(new Float32Array([1, 0, 0]).buffer));

      const existing = makeSimilarMemory({
        id: 103,
        file_path: '/test/103.md',
        title: 'Reachable Existing',
        content_text: 'Original reachable content',
        similarity: 0.91,
      });

      const result = expectMergeResult(await executeMerge(
        existing,
        makeNewMemory({
          title: 'Reachable Existing',
          content: 'Merged addition that should stay searchable',
        }),
        testDb,
      ));

      expect(result.newMemoryId).toBeGreaterThan(103);

      const projectionRow = testDb.prepare(`
        SELECT root_memory_id, active_memory_id
        FROM active_memory_projection
        WHERE logical_key = ?
      `).get('test-spec::/test/103.md::_') as {
        root_memory_id: number;
        active_memory_id: number;
      };
      expect(projectionRow.root_memory_id).toBe(103);
      expect(projectionRow.active_memory_id).toBe(result.newMemoryId);

      const reachableIds = getReachableVectorMemoryIds(testDb);
      expect(reachableIds).toContain(result.newMemoryId);
      expect(reachableIds).not.toContain(103);

      const archivedRow = testDb.prepare(`
        SELECT is_archived
        FROM memory_index
        WHERE id = 103
      `).get() as { is_archived: number };
      expect(archivedRow.is_archived).toBe(1);

      const newLineageRow = testDb.prepare(`
        SELECT predecessor_memory_id, root_memory_id
        FROM memory_lineage
        WHERE memory_id = ?
      `).get(result.newMemoryId) as {
        predecessor_memory_id: number | null;
        root_memory_id: number;
      };
      expect(newLineageRow.predecessor_memory_id).toBe(103);
      expect(newLineageRow.root_memory_id).toBe(103);

      expect(bm25RemoveDocument).toHaveBeenCalledWith('103');
      expect(bm25AddDocument).toHaveBeenCalledWith(String(result.newMemoryId), expect.stringContaining('Merged addition'));
      const bm25Text = bm25AddDocument.mock.calls[0]?.[1];
      expect(bm25Text).toContain('Reachable Existing');
      expect(bm25Text).toContain('/test/103.md');
    });

    it('MP5: Attempts immediate BM25 repair and surfaces a warning if repair still fails', async () => {
      const bm25RemoveDocument = vi.fn();
      const bm25AddDocument = vi.fn()
        .mockImplementationOnce(() => {
          throw new Error('initial merge BM25 failure');
        })
        .mockImplementationOnce(() => {
          throw new Error('repair merge BM25 failure');
        });
      vi.spyOn(bm25Index, 'isBm25Enabled').mockReturnValue(true);
      vi.spyOn(bm25Index, 'getIndex').mockReturnValue({
        removeDocument: bm25RemoveDocument,
        addDocument: bm25AddDocument,
      } as unknown as ReturnType<typeof bm25Index.getIndex>);

      testDb.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, content_text, importance_weight,
          embedding_status, created_at, updated_at
        )
        VALUES (
          104, 'test-spec', '/test/104.md', 'BM25 Repair Existing', 'Original searchable content',
          0.5, 'success', datetime('now'), datetime('now')
        )
      `).run();
      testDb.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (104, ?)
      `).run(Buffer.from(new Float32Array([1, 0, 0]).buffer));

      const result = expectMergeResult(await executeMerge(
        makeSimilarMemory({
          id: 104,
          file_path: '/test/104.md',
          title: 'BM25 Repair Existing',
          content_text: 'Original searchable content',
          similarity: 0.93,
        }),
        makeNewMemory({
          title: 'BM25 Repair Existing',
          content: 'Merged addition that should trigger repair attempts',
        }),
        testDb,
      ));

      expect(result.newMemoryId).toBeGreaterThan(104);
      expect(bm25AddDocument).toHaveBeenCalledTimes(2);
      expect(bm25RemoveDocument).toHaveBeenCalledWith('104');
      expect(bm25RemoveDocument).toHaveBeenCalledWith(String(result.newMemoryId));
      expect(result.warnings).toEqual([
        `BM25 repair failed after reconsolidation merge for memory ${result.newMemoryId}: repair merge BM25 failure`,
      ]);

      const repairFlagRow = testDb.prepare(`
        SELECT bm25_repair_needed
        FROM memory_index
        WHERE id = ?
      `).get(result.newMemoryId) as { bm25_repair_needed: number | null };
      expect(repairFlagRow.bm25_repair_needed).toBe(1);
    });

    it('MP6: Aborts merge when predecessor changes during embedding generation', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, content_text, content_hash, importance_weight, created_at, updated_at
        )
        VALUES (
          105, 'test-spec', '/test/105.md', 'Race Existing', 'Original race content', 'hash-before', 0.5,
          datetime('now'), '2026-03-29T10:00:00.000Z'
        )
      `).run();
      testDb.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (105, ?)
      `).run(Buffer.from(new Float32Array([1, 0, 0]).buffer));

      const existing = makeSimilarMemory({
        id: 105,
        file_path: '/test/105.md',
        title: 'Race Existing',
        content_text: 'Original race content',
        similarity: 0.94,
      });

      const generateEmbedding = vi.fn(async () => {
        testDb.prepare(`
          UPDATE memory_index
          SET content_text = 'Concurrent writer content',
              content_hash = 'hash-after',
              updated_at = '2026-03-29T10:00:01.000Z'
          WHERE id = 105
        `).run();
        return new Float32Array([0, 1, 0]);
      });

      const result = await executeMerge(
        existing,
        makeNewMemory({ content: 'Incoming content that should not be stale-merged' }),
        testDb,
        generateEmbedding,
      );

      expect(result.action).toBe('complement');
      expect(result.status).toBe('predecessor_changed');
      expect(result.newMemoryId).toBe(0);

      const rows = testDb.prepare(`
        SELECT id, is_archived, content_text
        FROM memory_index
        ORDER BY id ASC
      `).all() as Array<{ id: number; is_archived: number; content_text: string | null }>;
      expect(rows).toEqual([
        { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
      ]);
    });

    it('MP7: Completes merge when predecessor stays unchanged during embedding generation', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, content_text, content_hash, importance_weight, created_at, updated_at
        )
        VALUES (
          106, 'test-spec', '/test/106.md', 'Stable Existing', 'Stable base content', 'stable-hash', 0.5,
          datetime('now'), '2026-03-29T10:05:00.000Z'
        )
      `).run();
      testDb.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (106, ?)
      `).run(Buffer.from(new Float32Array([1, 0, 0]).buffer));

      const existing = makeSimilarMemory({
        id: 106,
        file_path: '/test/106.md',
        title: 'Stable Existing',
        content_text: 'Stable base content',
        similarity: 0.95,
      });

      const generateEmbedding = vi.fn(async () => new Float32Array([0, 1, 1]));

      const result = expectMergeResult(await executeMerge(
        existing,
        makeNewMemory({ content: 'Fresh content that should merge cleanly' }),
        testDb,
        generateEmbedding,
      ));

      expect(result.newMemoryId).toBeGreaterThan(106);
      expect(generateEmbedding).toHaveBeenCalledTimes(1);

      const archivedRow = testDb.prepare(`
        SELECT is_archived
        FROM memory_index
        WHERE id = 106
      `).get() as { is_archived: number };
      expect(archivedRow.is_archived).toBe(1);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Conflict Path (0.75 - 0.88)
  ──────────────────────────────────────────────────────────────── */

  describe('Conflict Path (0.75 - 0.88)', () => {
    it('CP1: Marks existing memory deprecated and adds supersedes edge', () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, created_at, updated_at)
        VALUES (200, 'test-spec', '/test/200.md', 'Old Title', 'Old content', datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({
        id: 200,
        content_text: 'Old content',
        title: 'Old Title',
        similarity: 0.80,
      });

      const newMem = makeNewMemory({
        id: 201,
        title: 'New Title',
        content: 'New replacement content',
      });

      const result = executeConflict(existing, newMem, testDb);

      expect(result.action).toBe('conflict');
      expect(result.existingMemoryId).toBe(200);
      expect(result.newMemoryId).toBe(201);
      expect(result.similarity).toBe(0.80);

      // Verify superseded memory is preserved and demoted.
      const row = testDb.prepare('SELECT title, content_text, importance_tier FROM memory_index WHERE id = 200').get() as {
        title: string;
        content_text: string;
        importance_tier: string;
      };
      expect(row.title).toBe('Old Title');
      expect(row.content_text).toBe('Old content');
      expect(row.importance_tier).toBe('deprecated');

      // Verify causal edge
      expect(result.causalEdgeId).not.toBeNull();
      const edges = causalEdges.getEdgesFrom('201');
      expect(edges).toHaveLength(1);
      expect(edges[0]!.relation).toBe('supersedes');
      expect(edges[0]!.target_id).toBe('200');
    });

    it('CP2: Supersedes edge has TM-06 evidence', () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, created_at, updated_at)
        VALUES (210, 'test-spec', '/test/210.md', 'Old', 'Old', datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({ id: 210, similarity: 0.82 });
      const newMem = makeNewMemory({ id: 211 });

      executeConflict(existing, newMem, testDb);

      const edges = causalEdges.getEdgesFrom('211');
      expect(edges[0]!.evidence).toContain('TM-06');
      expect(edges[0]!.evidence).toContain('reconsolidation');
    });

    it('CP3: Conflict with no new memory ID uses existing ID and avoids self-edge', () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, created_at, updated_at)
        VALUES (220, 'test-spec', '/test/220.md', 'Old', 'Old', datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({ id: 220, similarity: 0.78 });
      const newMem = makeNewMemory({ id: undefined }); // No ID yet

      const result = executeConflict(existing, newMem, testDb);
      expect(result.newMemoryId).toBe(220); // Falls back to existing ID
      expect(result.causalEdgeId).toBeNull();

      const selfSupersedes = causalEdges
        .getEdgesFrom('220')
        .filter((edge) => edge.relation === 'supersedes' && edge.target_id === '220');
      expect(selfSupersedes).toHaveLength(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Complement Path (< 0.75)
  ──────────────────────────────────────────────────────────────── */

  describe('Complement Path (< 0.75)', () => {
    it('CMP1: Stores new memory unchanged', () => {
      const newMem = makeNewMemory();
      const storeMemory = mockStoreMemory(300);

      const result = executeComplement(newMem, storeMemory, 0.60);

      expect(result.action).toBe('complement');
      expect(result.newMemoryId).toBe(300);
      expect(result.similarity).toBe(0.60);
    });

    it('CMP2: Passes null similarity when no candidates', () => {
      const newMem = makeNewMemory();
      const storeMemory = mockStoreMemory(301);

      const result = executeComplement(newMem, storeMemory, null);

      expect(result.action).toBe('complement');
      expect(result.similarity).toBeNull();
    });

    it('CMP3: Calls storeMemory with the new memory', () => {
      const newMem = makeNewMemory();
      let capturedMemory: NewMemoryData | null = null;
      const storeMemory: StoreMemoryFn = (mem) => {
        capturedMemory = mem;
        return 302;
      };

      executeComplement(newMem, storeMemory, 0.50);

      expect(capturedMemory).toBe(newMem);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Full Reconsolidation Orchestrator
  ──────────────────────────────────────────────────────────────── */

  describe('Reconsolidation Orchestrator', () => {
    const originalEnv = process.env.SPECKIT_RECONSOLIDATION;

    beforeEach(() => {
      process.env.SPECKIT_RECONSOLIDATION = 'true';
    });

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.SPECKIT_RECONSOLIDATION = originalEnv;
      } else {
        delete process.env.SPECKIT_RECONSOLIDATION;
      }
    });

    it('RO1: Merge path when similarity >= 0.88', async () => {
      // Seed existing memory
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (400, 'test-spec', '/test/400.md', 'Existing', 'Existing content', 0.5, datetime('now'), datetime('now'))
      `).run();

      const findSimilar = mockFindSimilar([
        makeSimilarMemory({
          id: 400,
          file_path: '/test/400.md',
          title: 'Existing',
          similarity: 0.90,
          content_text: 'Existing content',
          importance_weight: 0.5,
        }),
      ]);

      const result = await reconsolidate(
        makeNewMemory({ content: 'New extra content' }),
        testDb,
        { findSimilar, storeMemory: mockStoreMemory(401) }
      );

      expect(result).not.toBeNull();
      expect(result!.action).toBe('merge');
      if (result!.action === 'merge') {
        expect(result!.existingMemoryId).toBe(400);
        expect(result!.newMemoryId).toBeGreaterThan(400);
        expect(result!.importanceWeight).toBeCloseTo(0.6); // min(1.0, 0.5 + 0.1)
      }

      const archivedRow = testDb.prepare(
        'SELECT is_archived FROM memory_index WHERE id = 400'
      ).get() as { is_archived: number };
      expect(archivedRow.is_archived).toBe(1);
    });

    it('RO2: Conflict path when similarity 0.75-0.88', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, created_at, updated_at)
        VALUES (410, 'test-spec', '/test/410.md', 'Old', 'Old content', datetime('now'), datetime('now'))
      `).run();

      const findSimilar = mockFindSimilar([
        makeSimilarMemory({ id: 410, similarity: 0.80, content_text: 'Old content' }),
      ]);

      const result = await reconsolidate(
        makeNewMemory({ id: 411, content: 'Replacement content' }),
        testDb,
        { findSimilar, storeMemory: mockStoreMemory(411) }
      );

      expect(result).not.toBeNull();
      expect(result!.action).toBe('conflict');
      if (result!.action === 'conflict') {
        expect(result!.existingMemoryId).toBe(410);
      }
    });

    it('RO3: Complement path when similarity < 0.75', async () => {
      const findSimilar = mockFindSimilar([
        makeSimilarMemory({ id: 420, similarity: 0.60 }),
      ]);
      const storeMemory = vi.fn().mockReturnValue(421);

      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        { findSimilar, storeMemory }
      );

      expect(result).not.toBeNull();
      expect(result!.action).toBe('complement');
      if (result!.action === 'complement') {
        expect(result!.newMemoryId).toBe(0);
        expect(result!.similarity).toBe(0.60);
      }
      expect(storeMemory).not.toHaveBeenCalled();
    });

    it('RO4: No similar memories -> complement', async () => {
      const findSimilar = mockFindSimilar([]);
      const storeMemory = vi.fn().mockReturnValue(430);

      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        { findSimilar, storeMemory }
      );

      expect(result).not.toBeNull();
      expect(result!.action).toBe('complement');
      if (result!.action === 'complement') {
        expect(result!.newMemoryId).toBe(0);
        expect(result!.similarity).toBeNull();
      }
      expect(storeMemory).not.toHaveBeenCalled();
    });

    it('RO5: Flag OFF returns null (normal store)', async () => {
      process.env.SPECKIT_RECONSOLIDATION = 'false';

      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        { findSimilar: mockFindSimilar([]), storeMemory: mockStoreMemory(440) }
      );

      expect(result).toBeNull();
    });

    it('RO6: TM-04/TM-06 interaction: similarity 0.89 passes TM-04, triggers TM-06 merge', async () => {
      // This test validates that similarity in [0.88, 0.92) is:
      // - ALLOWED by TM-04 (threshold 0.92 for dedup rejection)
      // - HANDLED by TM-06 as MERGE (threshold 0.88)
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (450, 'test-spec', '/test/450.md', 'Existing', 'Existing content', 0.5, datetime('now'), datetime('now'))
      `).run();

      const findSimilar = mockFindSimilar([
        makeSimilarMemory({
          id: 450,
          file_path: '/test/450.md',
          title: 'Existing',
          similarity: 0.89, // Between TM-04 (0.92) and TM-06 merge (0.88)
          content_text: 'Existing content',
          importance_weight: 0.5,
        }),
      ]);

      // TM-06 action determination
      const action = determineAction(0.89);
      expect(action).toBe('merge'); // 0.89 >= 0.88 -> merge

      // Full reconsolidate flow
      const result = await reconsolidate(
        makeNewMemory({ content: 'Additional content to merge' }),
        testDb,
        { findSimilar, storeMemory: mockStoreMemory(451) }
      );

      expect(result).not.toBeNull();
      expect(result!.action).toBe('merge');
      if (result!.action === 'merge') {
        expect(result!.existingMemoryId).toBe(450);
        expect(result!.newMemoryId).toBeGreaterThan(450);
        expect(result!.importanceWeight).toBeCloseTo(0.6); // min(1.0, 0.5 + 0.1)
      }

      const archivedRow = testDb.prepare(
        'SELECT is_archived FROM memory_index WHERE id = 450'
      ).get() as { is_archived: number };
      expect(archivedRow.is_archived).toBe(1);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Checkpoint Requirement
  ──────────────────────────────────────────────────────────────── */

  describe('Checkpoint Requirement', () => {
    it('CHK1: SPECKIT_RECONSOLIDATION defaults to ON and can be explicitly disabled', () => {
      delete process.env.SPECKIT_RECONSOLIDATION;
      expect(isReconsolidationEnabled()).toBe(true);

      process.env.SPECKIT_RECONSOLIDATION = 'true';
      expect(isReconsolidationEnabled()).toBe(true);

      process.env.SPECKIT_RECONSOLIDATION = 'false';
      expect(isReconsolidationEnabled()).toBe(false);
    });

    it('CHK2: Documentation note — checkpoint MUST be created before reconsolidation runs', () => {
      // This is a documentation-level test. The actual checkpoint creation
      // Is handled by the caller before allowing reconsolidation to proceed.
      // We verify the flag mechanism exists to enforce this workflow.
      expect(typeof isReconsolidationEnabled).toBe('function');
      // The feature is now default-ON (graduated). The safety workflow is:
      // 1. User creates checkpoint via checkpoint_create()
      // 2. Bridge guard checks for checkpoint before running reconsolidation
      // 3. Set SPECKIT_RECONSOLIDATION=false to opt out
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Edge Cases
  ──────────────────────────────────────────────────────────────── */

  describe('Edge Cases', () => {
    const originalEnv = process.env.SPECKIT_RECONSOLIDATION;

    beforeEach(() => {
      process.env.SPECKIT_RECONSOLIDATION = 'true';
    });

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.SPECKIT_RECONSOLIDATION = originalEnv;
      } else {
        delete process.env.SPECKIT_RECONSOLIDATION;
      }
    });

    it('EC1: findSimilar returns empty -> complement', async () => {
      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        { findSimilar: mockFindSimilar([]), storeMemory: mockStoreMemory(500) }
      );
      expect(result!.action).toBe('complement');
    });

    it('EC2: findSimilar throws -> complement (non-fatal)', async () => {
      const errorFn: FindSimilarFn = () => { throw new Error('vector search down'); };
      const result = await reconsolidate(
        makeNewMemory(),
        testDb,
        { findSimilar: errorFn, storeMemory: mockStoreMemory(501) }
      );
      // FindSimilarMemories catches errors and returns [], leading to complement
      expect(result!.action).toBe('complement');
    });

    it('EC2b: orphan cleanup via transaction rollback when executeConflict fails', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (520, 'test-spec', '/test/520.md', 'Existing Memory', 'Existing content', 0.5, datetime('now'), datetime('now'))
      `).run();

      const orphanId = 621;
      const storeMemory: StoreMemoryFn = () => {
        testDb.prepare(`
          INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
          VALUES (?, 'test-spec', '/test/orphan.md', 'Orphan Memory', 'Orphan content', 0.5, datetime('now'), datetime('now'))
        `).run(orphanId);
        return orphanId;
      };

      const insertEdgeSpy = vi.spyOn(causalEdges, 'insertEdge')
        .mockImplementation(() => { throw new Error('forced edge failure'); });

      await expect(reconsolidate(
        makeNewMemory({ content: 'Conflicting content for cleanup path' }),
        testDb,
        {
          findSimilar: mockFindSimilar([makeSimilarMemory({ id: 520, similarity: 0.8 })]),
          storeMemory,
        }
      )).rejects.toThrow('forced edge failure');

      // F04-002: storeMemory + executeConflict are wrapped in a single transaction.
      // When executeConflict throws, the transaction rolls back the storeMemory insert,
      // so the orphan row is already gone without needing an explicit delete.
      const orphanRow = testDb.prepare('SELECT id FROM memory_index WHERE id = ?').get(orphanId);
      expect(orphanRow).toBeUndefined();

      insertEdgeSpy.mockRestore();
    });

    it('EC3: Merge with null existing content handles gracefully', async () => {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, importance_weight, created_at, updated_at)
        VALUES (510, 'test-spec', '/test/510.md', 'Null content', NULL, 0.5, datetime('now'), datetime('now'))
      `).run();

      const existing = makeSimilarMemory({
        id: 510,
        file_path: '/test/510.md',
        title: 'Null content',
        content_text: null,
        similarity: 0.90,
        importance_weight: 0.5,
      });

      const result = expectMergeResult(await executeMerge(existing, makeNewMemory({ content: 'New content' }), testDb));
      expect(result.newMemoryId).toBeGreaterThan(510);
      expect(result.importanceWeight).toBeCloseTo(0.6); // min(1.0, 0.5 + 0.1)

      const newRow = testDb.prepare(
        'SELECT content_text FROM memory_index WHERE id = ?'
      ).get(result.newMemoryId) as {
        content_text: string | null;
      };
      expect(newRow.content_text).toBe('New content');
    });

    it('EC4: Boundary similarity 0.88 -> merge (not conflict)', async () => {
      expect(determineAction(0.88)).toBe('merge');
    });

    it('EC5: Boundary similarity 0.75 -> conflict (not complement)', async () => {
      expect(determineAction(0.75)).toBe('conflict');
    });

    it('EC6: Boundary similarity 0.7499 -> complement', async () => {
      expect(determineAction(0.7499)).toBe('complement');
    });
  });
});
