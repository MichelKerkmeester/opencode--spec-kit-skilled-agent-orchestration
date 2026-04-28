// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph SQLite Indexer Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../../lib/skill-graph/skill-graph-db.js';
import { writeGraphMetadata } from '../../tests/fixtures/skill-graph-db.js';

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

  it('skips non-skill graph metadata fixtures during recursive indexing', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-'));
    const dbDir = join(root, 'db');
    const skillRoot = join(root, 'skills');
    const fixtureDir = join(skillRoot, 'scripts', 'test-fixtures', '053-template-compliant-level2');

    try {
      initDb(dbDir);
      writeGraphMetadata(skillRoot, 'alpha');
      mkdirSync(fixtureDir, { recursive: true });
      writeFileSync(join(fixtureDir, 'graph-metadata.json'), JSON.stringify({
        schema_version: 1,
        packet_id: 'system-spec-kit/053-template-compliant-level2',
        spec_folder: 'system-spec-kit/053-template-compliant-level2',
        parent_id: null,
        children_ids: [],
        manual: { depends_on: [], supersedes: [], related_to: [] },
        derived: {
          trigger_phrases: ['fixture'],
          key_topics: ['fixture'],
          importance_tier: 'normal',
          status: 'complete',
          key_files: ['spec.md'],
          entities: [],
          causal_summary: 'Non-skill graph metadata fixture.',
          created_at: '2026-04-21T00:00:00.000Z',
          last_save_at: '2026-04-21T00:00:00.000Z',
          last_accessed_at: null,
          source_docs: ['spec.md'],
        },
      }), 'utf8');

      const result = indexSkillMetadata(skillRoot);

      expect(result.scannedFiles).toBe(2);
      expect(result.indexedFiles).toBe(1);
      expect(result.skippedFiles).toBe(1);
      expect(result.warnings).toEqual([
        expect.stringContaining('NON-SKILL-METADATA'),
      ]);
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([
        { id: 'alpha' },
      ]);
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
