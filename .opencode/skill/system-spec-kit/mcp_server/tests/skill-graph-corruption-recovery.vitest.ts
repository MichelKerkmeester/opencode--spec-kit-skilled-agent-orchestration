// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Corruption Recovery Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { closeDb, DB_FILENAME, getDb, initDb } from '../lib/skill-graph/skill-graph-db.js';

describe('skill graph live DB corruption recovery', () => {
  afterEach(() => {
    closeDb();
  });

  it('recovers a malformed SQLite file during initDb quick_check', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-corruption-'));
    const dbDir = join(root, 'db');

    try {
      mkdirSync(dbDir, { recursive: true });
      writeFileSync(join(dbDir, DB_FILENAME), 'not sqlite', 'utf8');

      expect(() => initDb(dbDir)).not.toThrow();
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_nodes').get()).toEqual({ count: 0 });
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
