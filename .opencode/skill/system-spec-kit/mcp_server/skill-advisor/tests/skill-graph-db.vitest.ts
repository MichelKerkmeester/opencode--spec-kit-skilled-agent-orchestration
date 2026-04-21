import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../../lib/skill-graph/skill-graph-db.js';

function writeGraphMetadata(skillRoot: string, skillId: string, edges: Record<string, unknown[]> = {}): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges,
  }), 'utf8');
}

describe('skill graph database indexing', () => {
  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
  });

  it('backfills previously rejected edges when the target appears on a later scan', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-'));
    const dbDir = join(root, 'db');
    const skillRoot = join(root, 'skills');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      initDb(dbDir);
      writeGraphMetadata(skillRoot, 'alpha', {
        enhances: [{ target: 'beta', weight: 0.5, context: 'backfill target later' }],
      });

      const first = indexSkillMetadata(skillRoot);
      expect(first.rejectedEdges).toBe(1);
      expect(first.indexedEdges).toBe(0);
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_edges').get()).toEqual({ count: 0 });

      writeGraphMetadata(skillRoot, 'beta');
      const second = indexSkillMetadata(skillRoot);

      expect(second.skippedFiles).toBe(1);
      expect(second.rejectedEdges).toBe(0);
      expect(second.indexedEdges).toBe(1);
      expect(getDb().prepare(`
        SELECT source_id, target_id, edge_type
        FROM skill_edges
      `).all()).toEqual([
        { source_id: 'alpha', target_id: 'beta', edge_type: 'enhances' },
      ]);
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
