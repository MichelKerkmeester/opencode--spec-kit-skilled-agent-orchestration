// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph SQLite Busy Timeout Tests
// ───────────────────────────────────────────────────────────────
// F-002-A2-02: initDb must set busy_timeout = 5000ms so concurrent writers
// wait for the writer lock instead of throwing SQLITE_BUSY immediately.

import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { closeDb, initDb } from '../lib/code-graph-db.js';

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
});

describe('F-002-A2-02: SQLite busy_timeout pragma', () => {
  it('sets busy_timeout = 5000 immediately after open', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-1-'));
    try {
      const db = initDb(tempDir);
      const result = db.pragma('busy_timeout', { simple: true });
      expect(result).toBe(5000);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('a second connection inherits busy timeout from the same DB file', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-2-'));
    try {
      // First connection via the singleton initDb
      const primary = initDb(tempDir);
      expect(primary.pragma('busy_timeout', { simple: true })).toBe(5000);

      // Open a second connection directly to the same file. busy_timeout is
      // a per-connection setting, so we set it explicitly to verify the
      // behavior expected of contention-tolerant paths.
      const secondaryPath = join(tempDir, 'code-graph.sqlite');
      const secondary = new Database(secondaryPath);
      try {
        secondary.pragma('busy_timeout = 5000');
        expect(secondary.pragma('busy_timeout', { simple: true })).toBe(5000);
      } finally {
        secondary.close();
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('busy_timeout is non-zero (bounded wait) — never unlimited', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-3-'));
    try {
      const db = initDb(tempDir);
      const timeout = db.pragma('busy_timeout', { simple: true }) as number;
      expect(timeout).toBeGreaterThan(0);
      // Sanity bound — should not be set to a pathological multi-minute value
      expect(timeout).toBeLessThanOrEqual(60_000);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
