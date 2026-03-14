// ───────────────────────────────────────────────────────────────
// 1. TEST — EVAL DATABASE
// ───────────────────────────────────────────────────────────────
// Verifies that initEvalDb() creates the evaluation database with
// All 5 required tables, correct columns, and that it is a
// Separate file from the main context-index.sqlite.

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { initEvalDb, getEvalDb, getEvalDbPath, closeEvalDb, EVAL_DB_FILENAME } from '../lib/eval/eval-db';

/* ───────────────────────────────────────────────────────────────
   SETUP / TEARDOWN
──────────────────────────────────────────────────────────────── */

let testDataDir: string;

beforeAll(() => {
  // Use a temporary directory for test isolation
  testDataDir = path.join(os.tmpdir(), `eval-db-test-${Date.now()}`);
  fs.mkdirSync(testDataDir, { recursive: true });

  // Initialize the eval DB in the test directory
  initEvalDb(testDataDir);
});

afterAll(() => {
  // Close DB singleton before cleanup
  closeEvalDb();

  // Remove test directory
  if (testDataDir && fs.existsSync(testDataDir)) {
    try {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('T004: Eval DB Schema (R13-S1)', () => {

  /* ───────────────────────────────────────────────────────────────
     File creation
  ──────────────────────────────────────────────────────────────── */
  describe('Database File Creation', () => {
    it('T004-1: initEvalDb creates the DB file in the specified directory', () => {
      const expectedPath = path.join(testDataDir, EVAL_DB_FILENAME);
      expect(fs.existsSync(expectedPath)).toBe(true);
    });

    it('T004-2: DB file is named speckit-eval.db', () => {
      expect(EVAL_DB_FILENAME).toBe('speckit-eval.db');
      const dbPath = getEvalDbPath();
      expect(dbPath).not.toBeNull();
      expect(path.basename(dbPath!)).toBe('speckit-eval.db');
    });

    it('T004-3: Eval DB is a separate file from main context-index.sqlite', () => {
      const evalPath = getEvalDbPath();
      expect(evalPath).not.toBeNull();
      expect(path.basename(evalPath!)).not.toBe('context-index.sqlite');
    });

    it('T004-4: getEvalDb() returns a valid database instance after init', () => {
      const db = getEvalDb();
      expect(db).toBeDefined();
      expect(typeof db.prepare).toBe('function');
      expect(typeof db.exec).toBe('function');
    });

    it('T004-5: initEvalDb is idempotent (calling twice is safe)', () => {
      const db1 = initEvalDb(testDataDir);
      const db2 = initEvalDb(testDataDir);
      // Both should return the same singleton
      expect(db1).toBe(db2);
    });

    it('initEvalDb closes previous handle when path changes', () => {
      const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const dirA = path.join(os.tmpdir(), `eval-db-switch-a-${unique}`);
      const dirB = path.join(os.tmpdir(), `eval-db-switch-b-${unique}`);
      fs.mkdirSync(dirA, { recursive: true });
      fs.mkdirSync(dirB, { recursive: true });

      closeEvalDb();
      const dbA = initEvalDb(dirA);
      const closeSpy = vi.spyOn(dbA, 'close');

      try {
        const dbB = initEvalDb(dirB);
        expect(closeSpy).toHaveBeenCalledTimes(1);
        expect(dbB.prepare('SELECT 1 AS one').get()).toEqual({ one: 1 });
        expect(getEvalDbPath()).toBe(path.join(dirB, EVAL_DB_FILENAME));
      } finally {
        closeSpy.mockRestore();
        closeEvalDb();
        fs.rmSync(dirA, { recursive: true, force: true });
        fs.rmSync(dirB, { recursive: true, force: true });
        initEvalDb(testDataDir);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Table existence
  ──────────────────────────────────────────────────────────────── */
  describe('All 5 Tables Exist', () => {
    function tableExists(tableName: string): boolean {
      const db = getEvalDb();
      const result = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
      ).get(tableName);
      return !!result;
    }

    it('T004-6: eval_queries table exists', () => {
      expect(tableExists('eval_queries')).toBe(true);
    });

    it('T004-7: eval_channel_results table exists', () => {
      expect(tableExists('eval_channel_results')).toBe(true);
    });

    it('T004-8: eval_final_results table exists', () => {
      expect(tableExists('eval_final_results')).toBe(true);
    });

    it('T004-9: eval_ground_truth table exists', () => {
      expect(tableExists('eval_ground_truth')).toBe(true);
    });

    it('T004-10: eval_metric_snapshots table exists', () => {
      expect(tableExists('eval_metric_snapshots')).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Table column schemas
  ──────────────────────────────────────────────────────────────── */
  describe('eval_queries Schema', () => {
    function getColumns(tableName: string): string[] {
      const db = getEvalDb();
      const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
      return rows.map(r => r.name);
    }

    it('T004-11: eval_queries has required columns', () => {
      const cols = getColumns('eval_queries');
      expect(cols).toContain('id');
      expect(cols).toContain('query');
      expect(cols).toContain('intent');
      expect(cols).toContain('spec_folder');
      expect(cols).toContain('expected_memory_ids');
      expect(cols).toContain('difficulty');
      expect(cols).toContain('category');
      expect(cols).toContain('created_at');
      expect(cols).toContain('updated_at');
    });

    it('T004-12: eval_channel_results has required columns', () => {
      const cols = getColumns('eval_channel_results');
      expect(cols).toContain('id');
      expect(cols).toContain('eval_run_id');
      expect(cols).toContain('query_id');
      expect(cols).toContain('channel');
      expect(cols).toContain('result_memory_ids');
      expect(cols).toContain('scores');
      expect(cols).toContain('latency_ms');
      expect(cols).toContain('hit_count');
      expect(cols).toContain('created_at');
    });

    it('T004-13: eval_final_results has required columns', () => {
      const cols = getColumns('eval_final_results');
      expect(cols).toContain('id');
      expect(cols).toContain('eval_run_id');
      expect(cols).toContain('query_id');
      expect(cols).toContain('result_memory_ids');
      expect(cols).toContain('scores');
      expect(cols).toContain('fusion_method');
      expect(cols).toContain('latency_ms');
      expect(cols).toContain('created_at');
    });

    it('T004-14: eval_ground_truth has required columns', () => {
      const cols = getColumns('eval_ground_truth');
      expect(cols).toContain('id');
      expect(cols).toContain('query_id');
      expect(cols).toContain('memory_id');
      expect(cols).toContain('relevance');
      expect(cols).toContain('annotator');
      expect(cols).toContain('notes');
      expect(cols).toContain('created_at');
    });

    it('T004-15: eval_metric_snapshots has required columns', () => {
      const cols = getColumns('eval_metric_snapshots');
      expect(cols).toContain('id');
      expect(cols).toContain('eval_run_id');
      expect(cols).toContain('metric_name');
      expect(cols).toContain('metric_value');
      expect(cols).toContain('channel');
      expect(cols).toContain('query_count');
      expect(cols).toContain('metadata');
      expect(cols).toContain('created_at');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Basic CRUD operations
  ──────────────────────────────────────────────────────────────── */
  describe('Basic Table Operations', () => {
    it('T004-16: Can insert into eval_queries', () => {
      const db = getEvalDb();
      const result = db.prepare(`
        INSERT INTO eval_queries (query, intent, difficulty)
        VALUES (?, ?, ?)
      `).run('test search query', 'understand', 'easy');
      expect(result.changes).toBe(1);
      expect(typeof result.lastInsertRowid).toBe('number');
    });

    it('T004-17: Can insert into eval_channel_results', () => {
      const db = getEvalDb();
      const result = db.prepare(`
        INSERT INTO eval_channel_results (eval_run_id, query_id, channel, hit_count)
        VALUES (?, ?, ?, ?)
      `).run(1, 1, 'vector', 3);
      expect(result.changes).toBe(1);
    });

    it('T004-18: Can insert into eval_final_results', () => {
      const db = getEvalDb();
      const result = db.prepare(`
        INSERT INTO eval_final_results (eval_run_id, query_id, fusion_method)
        VALUES (?, ?, ?)
      `).run(1, 1, 'rrf');
      expect(result.changes).toBe(1);
    });

    it('T004-19: Can insert into eval_ground_truth', () => {
      const db = getEvalDb();
      const result = db.prepare(`
        INSERT INTO eval_ground_truth (query_id, memory_id, relevance, annotator)
        VALUES (?, ?, ?, ?)
      `).run(1, 42, 2, 'auto');
      expect(result.changes).toBe(1);
    });

    it('T004-20: eval_ground_truth enforces UNIQUE(query_id, memory_id)', () => {
      const db = getEvalDb();
      db.prepare(`
        INSERT INTO eval_ground_truth (query_id, memory_id, relevance)
        VALUES (999, 999, 1)
      `).run();

      expect(() => {
        db.prepare(`
          INSERT INTO eval_ground_truth (query_id, memory_id, relevance)
          VALUES (999, 999, 2)
        `).run();
      }).toThrow(/UNIQUE constraint/);
    });

    it('T004-21: Can insert into eval_metric_snapshots', () => {
      const db = getEvalDb();
      const result = db.prepare(`
        INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel)
        VALUES (?, ?, ?, ?)
      `).run(1, 'mrr@5', 0.72, 'vector');
      expect(result.changes).toBe(1);
    });

    it('T004-22: Can query back inserted eval_queries record', () => {
      const db = getEvalDb();
      const insertResult = db.prepare(`
        INSERT INTO eval_queries (query, intent, difficulty, category)
        VALUES (?, ?, ?, ?)
      `).run('how does chunking work?', 'understand', 'medium', 'retrieval');

      const row = db.prepare(`
        SELECT * FROM eval_queries WHERE id = ?
      `).get(insertResult.lastInsertRowid) as Record<string, unknown>;

      expect(row).toBeDefined();
      expect(row.query).toBe('how does chunking work?');
      expect(row.intent).toBe('understand');
      expect(row.difficulty).toBe('medium');
      expect(row.category).toBe('retrieval');
    });

    it('T004-23: difficulty defaults to medium when not specified', () => {
      const db = getEvalDb();
      const insertResult = db.prepare(`
        INSERT INTO eval_queries (query)
        VALUES (?)
      `).run('default difficulty test');

      const row = db.prepare(`
        SELECT difficulty FROM eval_queries WHERE id = ?
      `).get(insertResult.lastInsertRowid) as { difficulty: string };

      expect(row.difficulty).toBe('medium');
    });

    it('T004-24: fusion_method defaults to rrf in eval_final_results', () => {
      const db = getEvalDb();
      const insertResult = db.prepare(`
        INSERT INTO eval_final_results (eval_run_id, query_id)
        VALUES (?, ?)
      `).run(99, 99);

      const row = db.prepare(`
        SELECT fusion_method FROM eval_final_results WHERE id = ?
      `).get(insertResult.lastInsertRowid) as { fusion_method: string };

      expect(row.fusion_method).toBe('rrf');
    });

    it('T004-25: annotator defaults to auto in eval_ground_truth', () => {
      const db = getEvalDb();
      const insertResult = db.prepare(`
        INSERT INTO eval_ground_truth (query_id, memory_id, relevance)
        VALUES (?, ?, ?)
      `).run(777, 888, 3);

      const row = db.prepare(`
        SELECT annotator FROM eval_ground_truth WHERE id = ?
      `).get(insertResult.lastInsertRowid) as { annotator: string };

      expect(row.annotator).toBe('auto');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Singleton / isolation
  ──────────────────────────────────────────────────────────────── */
  describe('Singleton and Isolation', () => {
    it('T004-26: getEvalDb() throws before initEvalDb() is called (after closeEvalDb)', () => {
      closeEvalDb();
      expect(() => getEvalDb()).toThrow(/not initialized/);

      // Re-initialize for subsequent tests
      initEvalDb(testDataDir);
    });

    it('T004-27: getEvalDbPath() returns correct path after init', () => {
      const dbPath = getEvalDbPath();
      expect(dbPath).not.toBeNull();
      expect(dbPath).toContain(testDataDir);
      expect(dbPath).toContain('speckit-eval.db');
    });

    it('T004-28: closeEvalDb warns and resets state when db.close throws', () => {
      const db = getEvalDb();
      const closeSpy = vi.spyOn(db, 'close').mockImplementation(() => {
        throw new Error('simulated close failure');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        expect(() => closeEvalDb()).not.toThrow();
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledWith('[eval-db] closeEvalDb warning:', 'simulated close failure');
        expect(getEvalDbPath()).toBeNull();
        expect(() => getEvalDb()).toThrow(/not initialized/);
      } finally {
        closeSpy.mockRestore();
        warnSpy.mockRestore();
        db.close();
        initEvalDb(testDataDir);
      }
    });
  });
});
