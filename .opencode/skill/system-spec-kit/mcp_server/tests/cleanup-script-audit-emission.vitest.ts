import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ensureGovernanceRuntime } from '../lib/governance/scope-governance.js';
import {
  applyCleanup,
  buildPlan,
} from '../../scripts/memory/cleanup-index-scope-violations.js';

let database: Database.Database;

function createTestDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      content_hash TEXT,
      importance_tier TEXT DEFAULT 'normal',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      delete_after TEXT
    )
  `);
  ensureGovernanceRuntime(db);
  return db;
}

beforeEach(() => {
  database = createTestDatabase();
});

afterEach(() => {
  if (database) {
    database.close();
  }
});

describe('cleanup script governance audit emission', () => {
  it('retains historical governance_audit rows for deleted memories and emits cleanup downgrade audits', () => {
    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, anchor_id, content_hash, importance_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'system-spec-kit/z_future/011',
      '/workspace/.opencode/specs/system-spec-kit/z_future/011/spec.md',
      '/workspace/.opencode/specs/system-spec-kit/z_future/011/spec.md',
      null,
      'hash:z-future',
      'important',
    );

    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, anchor_id, content_hash, importance_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      2,
      'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
      '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md',
      '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md',
      null,
      'hash:plan',
      'constitutional',
    );

    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, anchor_id, content_hash, importance_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      3,
      'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
      '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/tasks.md',
      '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/tasks.md',
      'anchor-3',
      'hash:tasks',
      'constitutional',
    );

    database.prepare(`
      INSERT INTO governance_audit (action, decision, memory_id, reason)
      VALUES (?, ?, ?, ?)
    `).run('memory_save', 'allow', 1, 'preexisting_forensic_row');

    const plan = buildPlan(database);
    const applyTx = database.transaction(() => applyCleanup(database, plan));
    const summary = applyTx();

    expect(summary.deletedMemoryRows).toBe(1);
    expect(summary.downgradedRows).toBe(2);

    const remainingMemoryIds = database.prepare(`
      SELECT id, importance_tier
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<{ id: number; importance_tier: string }>;
    expect(remainingMemoryIds).toEqual([
      { id: 2, importance_tier: 'important' },
      { id: 3, importance_tier: 'important' },
    ]);

    const audits = database.prepare(`
      SELECT action, decision, memory_id, reason
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{
      action: string;
      decision: string;
      memory_id: number | null;
      reason: string | null;
    }>;
    expect(audits).toEqual([
      {
        action: 'memory_save',
        decision: 'allow',
        memory_id: 1,
        reason: 'preexisting_forensic_row',
      },
      {
        action: 'tier_downgrade_non_constitutional_path_cleanup',
        decision: 'conflict',
        memory_id: 2,
        reason: 'cleanup-script bulk normalization',
      },
      {
        action: 'tier_downgrade_non_constitutional_path_cleanup',
        decision: 'conflict',
        memory_id: 3,
        reason: 'cleanup-script bulk normalization',
      },
    ]);
  });
});
