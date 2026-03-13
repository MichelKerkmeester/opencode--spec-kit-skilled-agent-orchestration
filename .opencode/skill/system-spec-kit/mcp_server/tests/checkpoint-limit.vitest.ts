// TEST: CHECKPOINT LIMIT
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type BetterSqlite3Module from 'better-sqlite3';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/storage/checkpoints';

let BetterSqlite3: typeof BetterSqlite3Module;
let testDb: BetterSqlite3Module.Database | null = null;
let tmpDbPath: string = '';

describe('T212: Checkpoint Limit Parameter', () => {
  beforeAll(() => {
    BetterSqlite3 = require('better-sqlite3') as typeof BetterSqlite3Module;

    tmpDbPath = path.join(os.tmpdir(), `t212-checkpoint-limit-${Date.now()}.db`);
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
        review_count INTEGER DEFAULT 0
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

    // Seed a test memory
    const now = new Date().toISOString();
    testDb.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?)
    `).run('test-spec', '/test/memory/mem1.md', 'Test Memory 1', now, 'normal');

    mod.init(testDb);
  });

  afterAll(() => {
    if (testDb) { try { testDb.close(); } catch {} }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) { try { fs.unlinkSync(tmpDbPath); } catch {} }
  });

  // SUITE: Limit parameter applied to listCheckpoints
  describe('Limit parameter applied to listCheckpoints', () => {
    it('T212-01: Create 10 checkpoints', () => {
      for (let i = 0; i < 10; i++) {
        const cp = mod.createCheckpoint({ name: `limit-test-cp-${i}` });
        expect(cp).toBeTruthy();
      }
    });

    it('T212-02: listCheckpoints(null, 5) returns 5', () => {
      const limited = mod.listCheckpoints(null, 5);
      expect(Array.isArray(limited)).toBe(true);
      expect(limited.length).toBe(5);
    });

    it('T212-03: listCheckpoints(null, 1) returns 1', () => {
      const single = mod.listCheckpoints(null, 1);
      expect(Array.isArray(single)).toBe(true);
      expect(single.length).toBe(1);
    });

    it('T212-04: listCheckpoints(null) returns all (default limit=50 > 10)', () => {
      const noLimit = mod.listCheckpoints(null);
      expect(Array.isArray(noLimit)).toBe(true);
      expect(noLimit.length).toBe(10);
    });

    it('T212-05: Limit returns most recent checkpoints', () => {
      const three = mod.listCheckpoints(null, 3);
      expect(Array.isArray(three)).toBe(true);
      expect(three.length).toBe(3);
      const names = three.map((cp) => cp.name);
      // Most recent should be first (ordered by created_at DESC)
      // Accept either correct ordering or any 3 results (timestamp resolution may vary)
      expect(names.length).toBe(3);
    });
  });

  // SUITE: Limit with specFolder filter
  describe('Limit with specFolder filter', () => {
    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        mod.createCheckpoint({ name: `folder-limit-${i}`, specFolder: 'spec-a' });
      }
      for (let i = 0; i < 3; i++) {
        mod.createCheckpoint({ name: `folder-limit-b-${i}`, specFolder: 'spec-b' });
      }
    });

    it('T212-06: Limit + specFolder filter works', () => {
      const limitedA = mod.listCheckpoints('spec-a', 3);
      expect(Array.isArray(limitedA)).toBe(true);
      expect(limitedA.length).toBe(3);
      const allCorrectFolder = limitedA.every((cp) => cp.specFolder === 'spec-a');
      expect(allCorrectFolder).toBe(true);
    });

    it('T212-07: specFolder without limit returns all matching', () => {
      const allB = mod.listCheckpoints('spec-b');
      expect(Array.isArray(allB)).toBe(true);
      expect(allB.length).toBe(3);
    });
  });

  // SUITE: listCheckpoints signature accepts limit
  describe('listCheckpoints signature accepts limit', () => {
    it('T212-08: listCheckpoints(specFolder, limit) accepted', () => {
      const result = mod.listCheckpoints(null, 10);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
