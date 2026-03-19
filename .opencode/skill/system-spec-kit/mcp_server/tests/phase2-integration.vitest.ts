// TEST: PHASE 2 INTEGRATION (T048-T049)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as causalBoost from '../lib/search/causal-boost';
import { initExtractionAdapter } from '../lib/extraction/extraction-adapter';

type CausalBoostResults = Parameters<typeof causalBoost.applyCausalBoost>[0];

describe('T048-T049 integration path', () => {
  let db: Database.Database | null = null;
  let callback: ((tool: string, callId: string, result: unknown) => Promise<void>) | null = null;
  const previousExtractionFlag = process.env.SPECKIT_EXTRACTION;
  const previousCausalFlag = process.env.SPECKIT_CAUSAL_BOOST;

  beforeEach(() => {
    process.env.SPECKIT_EXTRACTION = 'true';
    process.env.SPECKIT_CAUSAL_BOOST = 'true';

    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        title TEXT,
        importance_tier TEXT,
        trigger_phrases TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL,
        strength REAL DEFAULT 1.0,
        evidence TEXT,
        extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT
      );

      CREATE TABLE IF NOT EXISTS weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
        old_strength REAL NOT NULL,
        new_strength REAL NOT NULL,
        changed_by TEXT DEFAULT 'manual',
        changed_at TEXT DEFAULT (datetime('now')),
        reason TEXT
      );
    `);

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (11, 'spec', '/tmp/spec.md', 'Spec', 'important', '[]'),
      (12, 'spec', '/tmp/related.md', 'Related', 'important', '[]')
    `).run();

    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('11', '12', 'supports')
    `).run();

    workingMemory.init(db);
    causalBoost.init(db);
    initExtractionAdapter(db, (fn) => {
      callback = fn;
    });
  });

  afterEach(() => {
    if (db) db.close();
    if (previousExtractionFlag === undefined) {
      delete process.env.SPECKIT_EXTRACTION;
    } else {
      process.env.SPECKIT_EXTRACTION = previousExtractionFlag;
    }
    if (previousCausalFlag === undefined) {
      delete process.env.SPECKIT_CAUSAL_BOOST;
    } else {
      process.env.SPECKIT_CAUSAL_BOOST = previousCausalFlag;
    }
    callback = null;
  });

  it('T048: Read tool result passes extraction/redaction into working_memory', async () => {
    await callback?.('Read', 'call-integration-1', {
      content: [{ type: 'text', text: 'Read /tmp/spec.md and got id": 11 plus api sk-abcdefghijklmnopqrstuvwxyz123456' }],
    });

    const row = db?.prepare(`
      SELECT memory_id, extraction_rule_id, redaction_applied
      FROM working_memory
      WHERE memory_id = 11
      LIMIT 1
    `).get() as Record<string, unknown>;

    expect(row.memory_id).toBe(11);
    expect(row.extraction_rule_id).toBe('read-spec');
    expect(row.redaction_applied).toBe(1);
  });

  it('T049: causal boost promotes related memory into top results', () => {
    const baseResults: CausalBoostResults = [{ id: 11, score: 0.9 }];
    const { results, metadata } = causalBoost.applyCausalBoost(baseResults);

    expect(metadata.applied).toBe(true);
    expect(results.some((item) => item.id === 12)).toBe(true);
  });
});
