// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Rebuild Concurrency Tests
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { rebuildFromSource } from '../../skill_advisor/lib/freshness/rebuild-from-source.js';

describe('skill graph rebuild concurrency', () => {
  it('serializes concurrent corruption rebuilds for the same database path', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-rebuild-'));
    const dbPath = join(root, 'skill-graph.sqlite');
    const skillsRoot = join(root, 'skills');

    try {
      writeFileSync(dbPath, 'not sqlite', 'utf8');
      const indexer = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
        const db = new Database(dbPath);
        db.exec('CREATE TABLE IF NOT EXISTS rebuilt (id TEXT PRIMARY KEY)');
        db.close();
        return { indexedNodes: 1 };
      });

      const results = await Promise.all([
        rebuildFromSource({ dbPath, skillsRoot, indexer, backupSuffix: 'first.corrupt' }),
        rebuildFromSource({ dbPath, skillsRoot, indexer, backupSuffix: 'second.corrupt' }),
      ]);

      expect(results.filter((result) => result.rebuilt)).toHaveLength(1);
      expect(results.filter((result) => !result.rebuilt)).toHaveLength(1);
      expect(indexer).toHaveBeenCalledTimes(1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
