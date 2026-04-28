import Database from 'better-sqlite3';
import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpointStorage from '../lib/storage/checkpoints.js';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db.js';

let database: Database.Database;

function insertCheckpoint(name: string, memories: Array<Record<string, unknown>>): void {
  const snapshot = {
    memories,
    workingMemory: [],
    timestamp: new Date().toISOString(),
  };
  database.prepare(`
    INSERT INTO checkpoints (name, created_at, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    gzipSync(Buffer.from(JSON.stringify(snapshot))),
    JSON.stringify({ memoryCount: memories.length }),
  );
}

beforeEach(() => {
  database = createMemoryIndexTestDatabase({
    includeCheckpoints: true,
    includeWorkingMemory: true,
  });
  checkpointStorage.init(database);
});

afterEach(() => {
  if (database) {
    database.close();
  }
});

describe('checkpoint_restore invariant enforcement', () => {
  it('downgrades poisoned constitutional rows outside /constitutional/ and records governance_audit', () => {
    insertCheckpoint('poisoned-constitutional', [
      {
        id: 4001,
        spec_folder: 'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
        file_path: '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md',
        canonical_file_path: '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md',
        title: 'Poisoned snapshot row',
        importance_weight: 0.6,
        created_at: '2026-04-24T00:00:00Z',
        updated_at: '2026-04-24T00:00:00Z',
        importance_tier: 'constitutional',
      },
    ]);

    const result = checkpointStorage.restoreCheckpoint('poisoned-constitutional', true);

    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(1);

    const restored = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = 4001
    `).get() as { importance_tier: string };
    expect(restored.importance_tier).toBe('important');

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'tier_downgrade_non_constitutional_path' },
    ]);
  });

  it('aborts the restore for walker-excluded paths and preserves the pre-restore state', () => {
    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, title,
        importance_weight, created_at, updated_at, importance_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      9,
      'baseline-spec',
      '/workspace/.opencode/specs/system-spec-kit/active/spec.md',
      '/workspace/.opencode/specs/system-spec-kit/active/spec.md',
      'Baseline row',
      0.5,
      '2026-04-24T00:00:00Z',
      '2026-04-24T00:00:00Z',
      'important',
    );

    insertCheckpoint('excluded-row', [
      {
        id: 5001,
        spec_folder: 'system-spec-kit/z_future/011',
        file_path: '/workspace/.opencode/specs/system-spec-kit/z_future/011/spec.md',
        canonical_file_path: '/workspace/.opencode/specs/system-spec-kit/z_future/011/spec.md',
        title: 'Future row',
        importance_weight: 0.6,
        created_at: '2026-04-24T00:00:00Z',
        updated_at: '2026-04-24T00:00:00Z',
        importance_tier: 'important',
      },
    ]);

    const result = checkpointStorage.restoreCheckpoint('excluded-row', true);

    expect(result.errors.some((message) => message.includes('path excluded from memory indexing'))).toBe(true);

    const remaining = database.prepare(`
      SELECT id
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<{ id: number }>;
    expect(remaining).toEqual([{ id: 9 }]);

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'checkpoint_restore_excluded_path_rejected' },
    ]);
  });

  it('restores clean constitutional rows unchanged without emitting governance_audit', () => {
    insertCheckpoint('clean-constitutional', [
      {
        id: 6001,
        spec_folder: 'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
        file_path: '/workspace/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md',
        canonical_file_path: '/workspace/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md',
        title: 'Gate enforcement',
        importance_weight: 0.9,
        created_at: '2026-04-24T00:00:00Z',
        updated_at: '2026-04-24T00:00:00Z',
        importance_tier: 'constitutional',
      },
    ]);

    const result = checkpointStorage.restoreCheckpoint('clean-constitutional', true);

    expect(result.errors).toEqual([]);
    const restored = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = 6001
    `).get() as { importance_tier: string };
    expect(restored.importance_tier).toBe('constitutional');

    const auditCount = database.prepare(`
      SELECT COUNT(*) AS count
      FROM governance_audit
    `).get() as { count: number };
    expect(auditCount.count).toBe(0);
  });
});
