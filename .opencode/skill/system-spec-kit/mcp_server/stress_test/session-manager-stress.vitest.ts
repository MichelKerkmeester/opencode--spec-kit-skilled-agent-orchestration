// TEST: Session Entry-Limit Stress Regressions (T014)
import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as workingMemory from '../lib/cognitive/working-memory';

type CountRow = { count: number };

function createWorkingMemoryDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'specs/test',
      file_path TEXT NOT NULL DEFAULT '/tmp/memory.md',
      title TEXT NOT NULL DEFAULT 'Test Memory',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

function seedMemoryIndex(db: Database.Database, total: number): void {
  const insert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
    VALUES (?, 'specs/test', ?, ?, CURRENT_TIMESTAMP)
  `);

  for (let id = 1; id <= total; id++) {
    insert.run(id, `/tmp/memory-${id}.md`, `Memory ${id}`);
  }
}

function countSessionEntries(db: Database.Database, sessionId: string): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?')
    .get(sessionId) as CountRow;
  return row.count;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('T014: interleaved session entry-limit stress', () => {
  it('keeps interleaved inserts within maxCapacity tolerance', async () => {
    const db = createWorkingMemoryDb();
    try {
      workingMemory.init(db);

      const sessionId = 'stress-session';
      const maxCapacity = workingMemory.WORKING_MEMORY_CONFIG.maxCapacity;
      const totalWrites = maxCapacity + 24;
      const tolerance = 1;
      let maxObserved = 0;

      seedMemoryIndex(db, totalWrites);

      await Promise.all(
        Array.from({ length: totalWrites }, (_, index) => (async () => {
          await delay((index % 5) * 2);
          const memoryId = index + 1;
          const score = 0.25 + (index % 4) * 0.15;
          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
          expect(ok).toBe(true);

          const currentCount = countSessionEntries(db, sessionId);
          maxObserved = Math.max(maxObserved, currentCount);
        })())
      );

      const finalCount = countSessionEntries(db, sessionId);

      expect(maxObserved).toBeLessThanOrEqual(maxCapacity + tolerance);
      expect(finalCount).toBeLessThanOrEqual(maxCapacity + tolerance);
      expect(finalCount).toBeGreaterThan(0);
    } finally {
      db.close();
    }
  });

  it('cleanupOldSessions removes expired sessions and preserves CURRENT_TIMESTAMP entries', () => {
    const db = createWorkingMemoryDb();
    const originalTimeoutMs = workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs;

    try {
      workingMemory.init(db);
      seedMemoryIndex(db, 3);

      // 60 minutes timeout to keep "current" rows while deleting clearly expired ones.
      workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs = 60 * 60 * 1000;

      db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, datetime('now', '-2 hours'), datetime('now', '-2 hours'), 1)
      `).run('expired-session', 1, 0.35);

      db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, datetime('now'), datetime('now'), 1)
      `).run('active-session', 2, 0.8);

      // Explicitly use SQLite CURRENT_TIMESTAMP format for regression coverage.
      db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
      `).run('sqlite-format-session', 3, 0.9);

      const removed = workingMemory.cleanupOldSessions();
      expect(removed).toBe(1);

      const remainingRows = db.prepare(`
        SELECT session_id
        FROM working_memory
        ORDER BY session_id ASC
      `).all() as Array<{ session_id: string }>;
      const remainingSessionIds = remainingRows.map(row => row.session_id);

      expect(remainingSessionIds).not.toContain('expired-session');
      expect(remainingSessionIds).toContain('active-session');
      expect(remainingSessionIds).toContain('sqlite-format-session');
    } finally {
      workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs = originalTimeoutMs;
      db.close();
    }
  });
});
