// ───────────────────────────────────────────────────────────────
// MODULE: causal-links-processor null-insert tests
// ───────────────────────────────────────────────────────────────
// F-008-B3-02: processCausalLinks now gates `inserted` on a real (non-null)
// row id from causalEdges.insertEdge. When null is returned, the
// processor pushes a skip-reason into result.errors instead of
// silently incrementing the counter.

import { describe, it, expect, beforeAll } from 'vitest';
import Database from 'better-sqlite3';

import * as causalEdges from '../lib/storage/causal-edges';
import { processCausalLinks } from '../handlers/causal-links-processor.js';

type SqliteDatabase = InstanceType<typeof Database>;

describe('processCausalLinks null-insert handling (F-008-B3-02)', () => {
  let testDb: SqliteDatabase;

  beforeAll(() => {
    testDb = new Database(':memory:');
    testDb.exec(`
      CREATE TABLE causal_edges (
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
        source_anchor TEXT,
        target_anchor TEXT,
        last_accessed TEXT,
        UNIQUE(source_id, target_id, relation)
      )
    `);
    testDb.exec(`
      CREATE TABLE weight_history (
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
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        canonical_file_path TEXT,
        title TEXT
      )
    `);
    causalEdges.init(testDb);
  });

  it('does not increment inserted when edge insert returns null (self-loop)', () => {
    const memoryId = 7;

    // resolveMemoryReferencesBatch needs the references resolvable. Insert
    // a memory_index row so the reference '7' resolves to id=7 and
    // creates a self-loop scenario where insertEdge returns null.
    testDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path)
      VALUES (7, 'test/self-loop', 'test.md')
    `).run();

    const result = processCausalLinks(testDb, memoryId, {
      caused_by: ['7'], // resolves to id=7 → self-loop, insertEdge returns null
      supersedes: [],
      derived_from: [],
      blocks: [],
      related_to: [],
    });

    // F-008-B3-02: inserted MUST stay 0 because insertEdge returned null.
    expect(result.inserted).toBe(0);
    // F-008-B3-02: skip reason must be recorded in result.errors.
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].error).toMatch(/edge insert returned null/);
    // The reference is still considered resolved (the look-up succeeded).
    expect(result.resolved).toBe(1);
    expect(result.processed).toBe(1);
  });

  it('increments inserted when edge insert returns a real row id', () => {
    // Reset edges between tests
    testDb.exec('DELETE FROM causal_edges');

    const sourceMemoryId = 10;

    // Insert two distinct memory rows so the reference resolves to a
    // different id than the source.
    testDb.exec('DELETE FROM memory_index');
    testDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path)
      VALUES (10, 'test/source', 'source.md'), (11, 'test/target', 'target.md')
    `).run();

    const result = processCausalLinks(testDb, sourceMemoryId, {
      caused_by: ['11'],
      supersedes: [],
      derived_from: [],
      blocks: [],
      related_to: [],
    });

    // F-008-B3-02: inserted increments on a real row id.
    expect(result.inserted).toBe(1);
    expect(result.resolved).toBe(1);
    expect(result.processed).toBe(1);
    // No skip-reason errors expected.
    expect(result.errors.filter((e) => e.error.includes('edge insert returned null'))).toEqual([]);
  });
});
