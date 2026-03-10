// ---------------------------------------------------------------
// TEST: HISTORY
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/storage/history';

let Database: any = null;
let db: any = null;
let dbPath: string = '';

describe('History Tests (T508)', () => {
  beforeAll(() => {
    Database = require('better-sqlite3');

    dbPath = path.join(os.tmpdir(), `history-test-${Date.now()}.sqlite`);
    db = new Database(dbPath);

    // Create memory_index table (required for joins)
    db.exec(`
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
    db.exec(`
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
    const insert = db.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)');
    insert.run(1, 'Test Memory 1', 'specs/001-test');
    insert.run(2, 'Test Memory 2', 'specs/001-test');
    insert.run(3, 'Test Memory 3', 'specs/002-other');

    mod.init(db);
  });

  afterAll(() => {
    try {
      if (db) db.close();
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch { /* ignore cleanup errors */ }
  });

  // -----------------------------------------------------------
  // Record History Entry (T508-01)
  // -----------------------------------------------------------
  describe('Record History Entry', () => {
    it('T508-01: recordHistory returns UUID', () => {
      const id = mod.recordHistory(1, 'ADD', null, JSON.stringify({ title: 'Test Memory 1' }), 'system');
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------
  // Get History for Memory (T508-02)
  // -----------------------------------------------------------
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
  });

  // -----------------------------------------------------------
  // History Respects Limit (T508-03)
  // -----------------------------------------------------------
  describe('History Respects Limit', () => {
    it('T508-03: getHistory respects limit parameter', () => {
      const limited = mod.getHistory(1, 2);
      expect(Array.isArray(limited)).toBe(true);
      expect(limited.length).toBeLessThanOrEqual(2);
    });
  });

  // -----------------------------------------------------------
  // Chronological Ordering (T508-04)
  // -----------------------------------------------------------
  describe('Chronological Ordering', () => {
    it('T508-04: History is ordered newest-first (DESC)', () => {
      const history = mod.getHistory(1);
      expect(history.length).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < history.length - 1; i++) {
        expect(history[i].timestamp >= history[i + 1].timestamp).toBe(true);
      }
    });
  });

  // -----------------------------------------------------------
  // History Stats (T508-05)
  // -----------------------------------------------------------
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
  });

  // -----------------------------------------------------------
  // Legacy Schema Migration (T508-06)
  // -----------------------------------------------------------
  describe('Legacy Schema Migration', () => {
    it('T508-06a: init() migrates legacy CHECK(actor IN ...) and FOREIGN KEY constraints', () => {
      // The beforeAll created the table with CHECK(actor IN ('user','system','hook','decay'))
      // and FOREIGN KEY, then called mod.init(db) which should have migrated it.
      const tableInfo = db.prepare(
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
      const entry = history.find((h: any) => h.id === id);
      expect(entry).toBeDefined();
      expect(entry!.actor).toBe('mcp:memory_save');
    });

    it('T508-06c: mcp:memory_bulk_delete actor is accepted', () => {
      const id = mod.recordHistory(3, 'DELETE', 'old-path.md', null, 'mcp:memory_bulk_delete');
      expect(typeof id).toBe('string');

      const history = mod.getHistory(3);
      const entry = history.find((h: any) => h.id === id);
      expect(entry).toBeDefined();
      expect(entry!.actor).toBe('mcp:memory_bulk_delete');
    });

    it('T508-06d: migration preserves existing history rows', () => {
      // Rows created in earlier tests (with 'system' and 'user' actors) should still exist
      const history = mod.getHistory(1);
      const systemEntries = history.filter((h: any) => h.actor === 'system');
      const userEntries = history.filter((h: any) => h.actor === 'user');
      expect(systemEntries.length).toBeGreaterThan(0);
      expect(userEntries.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------
  // UUID Generation (T508-07)
  // -----------------------------------------------------------
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
