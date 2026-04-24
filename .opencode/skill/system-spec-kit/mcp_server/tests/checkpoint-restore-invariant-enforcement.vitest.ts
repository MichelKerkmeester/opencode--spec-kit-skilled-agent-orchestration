import Database from 'better-sqlite3';
import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ensureGovernanceRuntime } from '../lib/governance/scope-governance.js';
import * as checkpointStorage from '../lib/storage/checkpoints.js';

let database: Database.Database;

function createTestDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      importance_tier TEXT DEFAULT 'normal',
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      delete_after TEXT
    );

    CREATE TABLE checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT
    );

    CREATE TABLE working_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      memory_id INTEGER,
      attention_score REAL DEFAULT 1.0,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
      focus_count INTEGER DEFAULT 1,
      event_counter INTEGER NOT NULL DEFAULT 0,
      mention_count INTEGER NOT NULL DEFAULT 0,
      source_tool TEXT,
      source_call_id TEXT,
      extraction_rule_id TEXT,
      redaction_applied INTEGER NOT NULL DEFAULT 0,
      UNIQUE(session_id, memory_id)
    );

    CREATE TABLE session_state (
      session_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'active',
      spec_folder TEXT,
      current_task TEXT,
      last_action TEXT,
      context_summary TEXT,
      pending_work TEXT,
      state_data TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE session_sent_memories (
      session_id TEXT NOT NULL,
      memory_hash TEXT NOT NULL,
      memory_id INTEGER,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, memory_hash)
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL
    );
  `);
  ensureGovernanceRuntime(db);
  return db;
}

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
  database = createTestDatabase();
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
