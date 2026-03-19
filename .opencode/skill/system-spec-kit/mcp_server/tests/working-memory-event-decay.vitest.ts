// TEST: WORKING MEMORY EVENT DECAY (T005-T008)
import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as wm from '../lib/cognitive/working-memory';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT '/test.md',
      title TEXT
    );
  `);

  for (let i = 1; i <= 20; i += 1) {
    db.prepare('INSERT INTO memory_index (id, title) VALUES (?, ?)').run(i, `Memory ${i}`);
  }

  wm.init(db);
  return db;
}

describe('T005-T008: event-based decay pipeline', () => {
  let db: Database.Database | null = null;
  const originalEventDecay = process.env.SPECKIT_EVENT_DECAY;
  const originalRolloutPercent = process.env.SPECKIT_ROLLOUT_PERCENT;

  afterEach(() => {
    if (db) {
      db.close();
      db = null;
    }
    if (originalEventDecay === undefined) {
      delete process.env.SPECKIT_EVENT_DECAY;
    } else {
      process.env.SPECKIT_EVENT_DECAY = originalEventDecay;
    }
    if (originalRolloutPercent === undefined) {
      delete process.env.SPECKIT_ROLLOUT_PERCENT;
    } else {
      process.env.SPECKIT_ROLLOUT_PERCENT = originalRolloutPercent;
    }
  });

  it('T007: event_counter increments globally and mention_count increments on re-access', () => {
    db = createDb();

    expect(wm.setAttentionScore('s1', 1, 0.8)).toBe(true); // counter 0
    expect(wm.setAttentionScore('s1', 2, 0.7)).toBe(true); // counter 1
    expect(wm.setAttentionScore('s1', 1, 0.9)).toBe(true); // counter 2, mention +1

    const rows = db.prepare(`
      SELECT memory_id, event_counter, mention_count, focus_count
      FROM working_memory
      WHERE session_id = 's1'
      ORDER BY memory_id ASC
    `).all() as Array<{
      memory_id: number;
      event_counter: number;
      mention_count: number;
      focus_count: number;
    }>;

    expect(rows).toEqual([
      { memory_id: 1, event_counter: 2, mention_count: 1, focus_count: 2 },
      { memory_id: 2, event_counter: 1, mention_count: 0, focus_count: 1 },
    ]);
  });

  it('T005/T006: batch decay uses event distance plus mention boost formula', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s2', 3, 1.0, 0, 2, '2026-01-01T00:00:00.000Z')
    `).run();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s2', 4, 0.4, 10, 0, '2026-01-01T00:00:01.000Z')
    `).run();

    const changed = wm.batchUpdateScores('s2');
    expect(changed).toBe(2);

    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s2', 3) as {
      attention_score: number;
    };

    const expected = (1.0 * Math.pow(0.85, 10)) + (2 * 0.05);
    expect(Math.abs(row.attention_score - expected)).toBeLessThan(1e-9);
  });

  it('T009: decay calculation covers event distance 0, 10, and 100 with mention boost', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s5', 9, 0.6, 100, 1, '2026-01-01T00:00:02.000Z')
    `).run();
    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s5', 10, 0.6, 90, 1, '2026-01-01T00:00:01.000Z')
    `).run();
    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s5', 11, 0.6, 0, 1, '2026-01-01T00:00:00.000Z')
    `).run();

    const changed = wm.batchUpdateScores('s5');
    expect(changed).toBe(3);

    const rows = db.prepare(`
      SELECT memory_id, attention_score
      FROM working_memory
      WHERE session_id = 's5'
      ORDER BY memory_id ASC
    `).all() as Array<{ memory_id: number; attention_score: number }>;

    const expected0 = (0.6 * Math.pow(0.85, 0)) + 0.05;
    const expected10 = (0.6 * Math.pow(0.85, 10)) + 0.05;
    const expected100 = (0.6 * Math.pow(0.85, 100)) + 0.05;

    expect(Math.abs(rows[0].attention_score - expected0)).toBeLessThan(1e-9);
    expect(Math.abs(rows[1].attention_score - expected10)).toBeLessThan(1e-9);
    expect(Math.abs(rows[2].attention_score - expected100)).toBeLessThan(1e-9);
  });

  it('T008: delete threshold is checked before decay floor clamp', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s3', 5, 0.009, 0, 0, '2026-01-01T00:00:00.000Z')
    `).run();
    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s3', 6, 0.02, 0, 0, '2026-01-01T00:00:01.000Z')
    `).run();

    wm.batchUpdateScores('s3');

    const deleted = db.prepare('SELECT COUNT(*) AS count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 5) as {
      count: number;
    };
    expect(deleted.count).toBe(0);

    const floored = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 6) as {
      attention_score: number;
    };
    expect(floored.attention_score).toBe(wm.DECAY_FLOOR);
    expect(wm.DELETE_THRESHOLD).toBe(0.01);
  });

  it('T007 wrap handling: event counter wraps and decay distance uses modular arithmetic', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s4', 7, 0.9, ?, 0, '2026-01-01T00:00:00.000Z')
    `).run(wm.EVENT_COUNTER_MODULUS - 1);

    expect(wm.setAttentionScore('s4', 7, 0.9)).toBe(true);

    const wrapped = db.prepare('SELECT event_counter, mention_count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 7) as {
      event_counter: number;
      mention_count: number;
    };
    expect(wrapped.event_counter).toBe(0);
    expect(wrapped.mention_count).toBe(1);

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s4', 8, 1.0, ?, 0, '2025-12-31T23:59:59.000Z')
    `).run(wm.EVENT_COUNTER_MODULUS - 1);

    wm.batchUpdateScores('s4');

    const decayed = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 8) as {
      attention_score: number;
    };
    expect(Math.abs(decayed.attention_score - 0.85)).toBeLessThan(1e-9);
  });

  it('default-on contract: event decay runs when SPECKIT_EVENT_DECAY is unset', () => {
    delete process.env.SPECKIT_EVENT_DECAY;
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s-default', 12, 1.0, 0, 0, '2026-01-01T00:00:00.000Z')
    `).run();

    const changed = wm.batchUpdateScores('s-default');
    expect(changed).toBe(1);
  });

  it('opt-out contract: event decay is disabled only when SPECKIT_EVENT_DECAY=false', () => {
    process.env.SPECKIT_EVENT_DECAY = 'false';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
      VALUES ('s-disabled', 13, 0.9, 0, 0, '2026-01-01T00:00:00.000Z')
    `).run();

    const changed = wm.batchUpdateScores('s-disabled');
    expect(changed).toBe(0);

    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s-disabled', 13) as {
      attention_score: number;
    };
    expect(row.attention_score).toBe(0.9);
  });
});
