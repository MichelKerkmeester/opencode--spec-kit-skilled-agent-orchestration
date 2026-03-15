// TEST: HISTORY
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import type Database from 'better-sqlite3';

import * as mod from '../lib/storage/history';
import type { HistoryEntry } from '../lib/storage/history';
import { memoryBulkDeleteSchema } from '../schemas/tool-input-schemas';

type DatabaseConstructor = new (filename: string) => Database.Database;

let DatabaseImpl: DatabaseConstructor | null = null;
let db: Database.Database | null = null;
let dbPath: string = '';
const LEGACY_PRE_MIGRATION_ROW_ID = 'legacy-pre-migration-row';

function requireDb(): Database.Database {
  if (!db) {
    throw new Error('History test database was not initialized');
  }
  return db;
}

describe('History Tests (T508)', () => {
  beforeAll(() => {
    DatabaseImpl = require('better-sqlite3') as DatabaseConstructor;

    dbPath = path.join(os.tmpdir(), `history-test-${Date.now()}.sqlite`);
    db = new DatabaseImpl(dbPath);
    const activeDb = requireDb();

    // Create memory_index table (required for joins)
    activeDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        spec_folder TEXT,
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 1.0,
        importance_tier TEXT DEFAULT 'normal',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create memory_history table with legacy constraints to test migration
    activeDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system' CHECK(actor IN ('user', 'system', 'hook', 'decay')),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id)
      )
    `);

    // Insert test memories
    const insert = activeDb.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)');
    insert.run(1, 'Test Memory 1', 'specs/001-test');
    insert.run(2, 'Test Memory 2', 'specs/001-test');
    insert.run(3, 'Test Memory 3', 'specs/002-other');

    // Insert a legacy-row fixture before init() runs migration.
    activeDb.prepare(`
      INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, actor)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      LEGACY_PRE_MIGRATION_ROW_ID,
      1,
      'legacy-prev',
      'legacy-new',
      'UPDATE',
      'system'
    );

    mod.init(activeDb);
  });

  afterAll(() => {
    try {
      if (db) db.close();
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch { /* ignore cleanup errors */ }
  });

  // Record History Entry (T508-01)
  describe('Record History Entry', () => {
    it('T508-01: recordHistory returns UUID', () => {
      const id = mod.recordHistory(1, 'ADD', null, JSON.stringify({ title: 'Test Memory 1' }), 'system');
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('T508-01b: recordHistory normalizes non-string payloads', () => {
      const activeDb = requireDb();
      const id = mod.recordHistory(
        1,
        'UPDATE',
        { before: 'legacy' },
        { after: 'normalized' },
        'mcp:normalize_test',
        'specs/001-test',
      );

      const row = activeDb.prepare('SELECT prev_value, new_value, actor, spec_folder FROM memory_history WHERE id = ?').get(id) as {
        prev_value: string | null;
        new_value: string | null;
        actor: string;
        spec_folder: string | null;
      };

      expect(row.prev_value).toBe('{"before":"legacy"}');
      expect(row.new_value).toBe('{"after":"normalized"}');
      expect(row.actor).toBe('mcp:normalize_test');
      expect(row.spec_folder).toBe('specs/001-test');
    });

    it('T508-01c: undefined history payloads normalize to null values', () => {
      const activeDb = requireDb();
      const id = mod.recordHistory(1, 'UPDATE', undefined, undefined, '  mcp:trimmed_actor  ');
      const row = activeDb.prepare('SELECT prev_value, new_value, actor FROM memory_history WHERE id = ?').get(id) as {
        prev_value: string | null;
        new_value: string | null;
        actor: string;
      };

      expect(row.prev_value).toBeNull();
      expect(row.new_value).toBeNull();
      expect(row.actor).toBe('mcp:trimmed_actor');
    });
  });

  // Get History for Memory (T508-02)
  describe('Get History for Memory', () => {
    it('T508-02a: getHistory returns array of entries', () => {
      // Record a few more entries
      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'Old Title' }), JSON.stringify({ title: 'New Title' }), 'user');
      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'New Title' }), JSON.stringify({ title: 'Final Title' }), 'system');

      const history = mod.getHistory(1);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(3);
    });

    it('T508-02b: History entries have required fields', () => {
      const history = mod.getHistory(1);
      expect(history.length).toBeGreaterThan(0);

      const entry = history[0];
      expect(entry.id).toBeDefined();
      expect(entry.memory_id).toBeDefined();
      expect(entry.event).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });

    it('T508-02c: getLineageTransitionAnchors exposes lightweight bridge data', () => {
      const anchors = mod.getLineageTransitionAnchors(1);
      expect(Array.isArray(anchors)).toBe(true);
      expect(anchors.length).toBeGreaterThan(0);
      expect(anchors[0]?.memory_id).toBe(1);
      expect(typeof anchors[0]?.actor).toBe('string');
    });
  });

  // History Respects Limit (T508-03)
  describe('History Respects Limit', () => {
    it('T508-03: getHistory respects limit parameter', () => {
      const limited = mod.getHistory(1, 2);
      expect(Array.isArray(limited)).toBe(true);
      expect(limited.length).toBeLessThanOrEqual(2);
    });
  });

  // Chronological Ordering (T508-04)
  describe('Chronological Ordering', () => {
    it('T508-04: History is ordered newest-first (DESC)', () => {
      const history = mod.getHistory(1);
      expect(history.length).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < history.length - 1; i++) {
        expect(history[i].timestamp >= history[i + 1].timestamp).toBe(true);
      }
    });
  });

  // History Stats (T508-05)
  describe('History Stats', () => {
    it('T508-05a: getHistoryStats returns valid stats', () => {
      // Record a DELETE event
      mod.recordHistory(2, 'DELETE', JSON.stringify({ title: 'Test Memory 2' }), null, 'user');

      const stats = mod.getHistoryStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThan(0);
    });

    it('T508-05b: Stats breakdown by event type', () => {
      const stats = mod.getHistoryStats();
      expect(typeof stats.adds).toBe('number');
      expect(typeof stats.updates).toBe('number');
      expect(typeof stats.deletes).toBe('number');
    });

    it('T508-05c: getHistoryStats filters by specFolder', () => {
      const folderStats = mod.getHistoryStats('specs/001-test');
      expect(folderStats).toBeDefined();
      expect(typeof folderStats.total).toBe('number');
    });

    it('T508-05d: getHistoryStats includes delete events after memory row removal', () => {
      const activeDb = requireDb();
      const before = mod.getHistoryStats('specs/001-test');

      activeDb.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)')
        .run(9, 'Deleted Snapshot Memory', 'specs/001-test');
      mod.recordHistory(9, 'ADD', null, 'snapshot-added', 'system');
      activeDb.prepare('DELETE FROM memory_index WHERE id = ?').run(9);

      const id = mod.recordHistory(
        9,
        'DELETE',
        '/tmp/specs/001-test/memory/deleted-snapshot.md',
        null,
        'mcp:memory_delete',
      );
      const row = activeDb.prepare('SELECT spec_folder FROM memory_history WHERE id = ?').get(id) as {
        spec_folder: string | null;
      };

      const after = mod.getHistoryStats('specs/001-test');
      expect(row.spec_folder).toBe('specs/001-test');
      expect(after.deletes).toBe(before.deletes + 1);
      expect(after.total).toBe(before.total + 2);
    });

    it('T508-05e: getHistoryStats fallback still counts rows with null spec_folder when memory exists', () => {
      const activeDb = requireDb();
      const before = mod.getHistoryStats('specs/001-test');

      activeDb.prepare(`
        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, actor)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        'legacy-null-spec-folder-row',
        1,
        null,
        'legacy-before',
        'legacy-after',
        'UPDATE',
        'system',
      );

      const after = mod.getHistoryStats('specs/001-test');
      expect(after.updates).toBe(before.updates + 1);
      expect(after.total).toBe(before.total + 1);
    });

    it('T508-05f: getHistoryStats counts legacy null-folder rows after memory deletion when earlier history captured the folder', () => {
      const activeDb = requireDb();
      const before = mod.getHistoryStats('specs/001-test');

      activeDb.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)')
        .run(10, 'Legacy Deleted Memory', 'specs/001-test');
      mod.recordHistory(10, 'ADD', null, 'created-before-delete', 'system');
      activeDb.prepare('DELETE FROM memory_index WHERE id = ?').run(10);

      activeDb.prepare(`
        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, actor)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        'legacy-null-spec-folder-after-delete',
        10,
        null,
        'legacy-before',
        'legacy-after',
        'UPDATE',
        'system',
      );

      const after = mod.getHistoryStats('specs/001-test');
      expect(after.updates).toBe(before.updates + 1);
      expect(after.total).toBe(before.total + 2);
    });
  });

  // Legacy Schema Migration (T508-06)
  describe('Legacy Schema Migration', () => {
    it('T508-06a: init() migrates legacy CHECK(actor IN ...) and FOREIGN KEY constraints', () => {
      const activeDb = requireDb();
      // The beforeAll created the table with CHECK(actor IN ('user','system','hook','decay'))
      // And FOREIGN KEY, then called mod.init(db) which should have migrated it.
      const tableInfo = activeDb.prepare(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
      ).get() as { sql: string };
      expect(tableInfo.sql).not.toContain('CHECK(actor IN');
      expect(tableInfo.sql).not.toContain('FOREIGN KEY');
    });

    it('T508-06b: mcp:* actors are accepted after migration', () => {
      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
      expect(typeof id).toBe('string');
      expect(id.length).toBe(36);

      const history = mod.getHistory(1);
      const entry = history.find((h: HistoryEntry) => h.id === id);
      expect(entry).toBeDefined();
      expect(entry!.actor).toBe('mcp:memory_save');
    });

    it('T508-06c: mcp:memory_bulk_delete actor is accepted', () => {
      const id = mod.recordHistory(3, 'DELETE', 'old-path.md', null, 'mcp:memory_bulk_delete');
      expect(typeof id).toBe('string');

      const history = mod.getHistory(3);
      const entry = history.find((h: HistoryEntry) => h.id === id);
      expect(entry).toBeDefined();
      expect(entry!.actor).toBe('mcp:memory_bulk_delete');
    });

    it('T508-06d: migration preserves existing history rows', () => {
      const activeDb = requireDb();
      const legacyRow = activeDb.prepare(`
        SELECT id, memory_id, spec_folder, prev_value, new_value, event, actor
        FROM memory_history
        WHERE id = ?
      `).get(LEGACY_PRE_MIGRATION_ROW_ID) as {
        id: string;
        memory_id: number;
        spec_folder: string | null;
        prev_value: string;
        new_value: string;
        event: string;
        actor: string;
      } | undefined;

      expect(legacyRow).toBeDefined();
      expect(legacyRow!.memory_id).toBe(1);
      expect(legacyRow!.event).toBe('UPDATE');
      expect(legacyRow!.actor).toBe('system');
      expect(legacyRow!.spec_folder).toBe('specs/001-test');
      expect(legacyRow!.prev_value).toBe('legacy-prev');
      expect(legacyRow!.new_value).toBe('legacy-new');
    });

    it.each([
      'mcp:memory_save',
      'mcp:memory_update',
      'mcp:memory_delete',
      'mcp:memory_bulk_delete',
      'mcp:file_watcher',
      'mcp:cli_bulk_delete',
      'mcp:memory_index_scan',
      'mcp:checkpoint_restore',
      'mcp:integrity_check',
      'mcp:chunking_reindex',
      'mcp:chunking_rollback',
      'mcp:reconsolidation_cleanup',
      'mcp:delete_memories',
      'mcp:delete_by_path',
    ])('T508-06e: actor naming accepts %s', (actor) => {
      const id = mod.recordHistory(2, 'UPDATE', null, `actor-test:${actor}`, actor);
      const history = mod.getHistory(2);
      const entry = history.find((h: HistoryEntry) => h.id === id);
      expect(entry).toBeDefined();
      expect(entry!.actor).toBe(actor);
    });
  });

  // Memory_bulk_delete olderThanDays boundaries (T508-08)
  describe('memory_bulk_delete olderThanDays boundaries', () => {
    const baseInput = { tier: 'normal', confirm: true } as const;

    it('T508-08a: olderThanDays=0 fails validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: 0 });
      expect(result.success).toBe(false);
    });

    it('T508-08b: olderThanDays=-1 fails validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: -1 });
      expect(result.success).toBe(false);
    });

    it('T508-08c: olderThanDays=1 passes validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: 1 });
      expect(result.success).toBe(true);
    });

    it('T508-08d: olderThanDays=1.5 fails validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: 1.5 });
      expect(result.success).toBe(false);
    });

    it('T508-08e: olderThanDays=NaN fails validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: Number.NaN });
      expect(result.success).toBe(false);
    });

    it('T508-08f: confirm=false fails schema validation', () => {
      const result = memoryBulkDeleteSchema.safeParse({ tier: 'normal', confirm: false });
      expect(result.success).toBe(false);
    });
  });

  // UUID Generation (T508-07)
  describe('UUID Generation', () => {
    it('T508-07a: generateUuid returns 36-char string', () => {
      const uuid = mod.generateUuid();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('T508-07b: UUIDs are unique', () => {
      const uuid1 = mod.generateUuid();
      const uuid2 = mod.generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });

    it('T508-07c: UUID has v4 marker at position 14', () => {
      const uuid = mod.generateUuid();
      expect(uuid[14]).toBe('4');
    });
  });
});
