import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

type VectorIndexModule = typeof import('../lib/search/vector-index');

describe('Phase 5 cascade delete cleanup', () => {
  let mod!: VectorIndexModule;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-delete-cascade-'));
  const tmpDbPath = path.join(tmpDir, 'context-index.sqlite');

  beforeAll(async () => {
    process.env.MEMORY_DB_PATH = tmpDbPath;
    process.env.MEMORY_ALLOWED_PATHS = tmpDir;
    mod = await import('../lib/search/vector-index');
  });

  afterAll(() => {
    try {
      mod.closeDb();
    } catch (_error: unknown) {
      // Ignore cleanup errors in temporary test fixtures
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('deletes derived summaries, entities, communities, and graph edges with the base memory', () => {
    const rootId = mod.indexMemoryDeferred({
      specFolder: 'specs/test-cascade-delete',
      filePath: path.join(tmpDir, 'memory-cascade-root.md'),
      title: 'Cascade Root',
    });
    const neighborId = mod.indexMemoryDeferred({
      specFolder: 'specs/test-cascade-delete',
      filePath: path.join(tmpDir, 'memory-cascade-neighbor.md'),
      title: 'Cascade Neighbor',
    });
    const db = mod.getDb();

    db.prepare(`INSERT INTO degree_snapshots (memory_id, degree_count, snapshot_date) VALUES (?, ?, datetime('now'))`)
      .run(rootId, 4);
    db.prepare(`INSERT INTO community_assignments (memory_id, community_id, algorithm) VALUES (?, ?, ?)`)
      .run(rootId, 2, 'bfs');
    db.prepare(`INSERT INTO memory_summaries (memory_id, summary_text, summary_embedding, key_sentences) VALUES (?, ?, ?, ?)`)
      .run(rootId, 'summary', null, '[]');
    db.prepare(`INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency) VALUES (?, ?, ?, ?)`)
      .run(rootId, 'entity', 'concept', 1);
    db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
      .run(String(rootId), String(neighborId), 'supports');

    expect(mod.deleteMemory(rootId)).toBe(true);

    expect(db.prepare('SELECT COUNT(*) AS count FROM degree_snapshots WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM community_assignments WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM memory_summaries WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM memory_entities WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM causal_edges WHERE source_id = ? OR target_id = ?').get(String(rootId), String(rootId))).toEqual({ count: 0 });
  });

  it('bulk delete cleans the same ancillary rows as single delete', () => {
    const rootId = mod.indexMemoryDeferred({
      specFolder: 'specs/test-cascade-bulk-delete',
      filePath: path.join(tmpDir, 'memory-cascade-bulk-root.md'),
      title: 'Cascade Bulk Root',
    });
    const neighborId = mod.indexMemoryDeferred({
      specFolder: 'specs/test-cascade-bulk-delete',
      filePath: path.join(tmpDir, 'memory-cascade-bulk-neighbor.md'),
      title: 'Cascade Bulk Neighbor',
    });
    const db = mod.getDb();

    db.prepare(`INSERT INTO degree_snapshots (memory_id, degree_count, snapshot_date) VALUES (?, ?, datetime('now'))`)
      .run(rootId, 7);
    db.prepare(`INSERT INTO community_assignments (memory_id, community_id, algorithm) VALUES (?, ?, ?)`)
      .run(rootId, 3, 'bulk');
    db.prepare(`INSERT INTO memory_summaries (memory_id, summary_text, summary_embedding, key_sentences) VALUES (?, ?, ?, ?)`)
      .run(rootId, 'bulk-summary', null, '[]');
    db.prepare(`INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency) VALUES (?, ?, ?, ?)`)
      .run(rootId, 'bulk-entity', 'concept', 1);
    db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
      .run(String(rootId), String(neighborId), 'supports');

    expect(mod.deleteMemories([rootId])).toEqual({ deleted: 1, failed: 0 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM degree_snapshots WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM community_assignments WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM memory_summaries WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM memory_entities WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM causal_edges WHERE source_id = ? OR target_id = ?').get(String(rootId), String(rootId))).toEqual({ count: 0 });
  });
});
