import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureGovernanceRuntime } from '../lib/governance/scope-governance.js';

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
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      importance_tier TEXT DEFAULT 'normal',
      content_text TEXT,
      embedding_status TEXT DEFAULT 'success',
      parent_id INTEGER,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      delete_after TEXT
    );

    CREATE TABLE active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER,
      active_memory_id INTEGER,
      updated_at TEXT
    )
  `);
  ensureGovernanceRuntime(db);
  return db;
}

function seedMemory(filePath: string): number {
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, canonical_file_path, anchor_id, title,
      trigger_phrases, importance_weight, created_at, updated_at, importance_tier
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    101,
    'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
    filePath,
    filePath,
    null,
    'Wave 1 fixture',
    JSON.stringify(['wave-1']),
    0.5,
    now,
    now,
    'important',
  );
  database.prepare(`
    INSERT INTO active_memory_projection (
      logical_key, root_memory_id, active_memory_id, updated_at
    ) VALUES (?, ?, ?, ?)
  `).run(
    `${'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants'}::${filePath}::_`,
    101,
    101,
    now,
  );
  return 101;
}

async function loadHandler() {
  vi.resetModules();

  vi.doMock('../core/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../core/index.js')>();
    return {
      ...actual,
      checkDatabaseUpdated: vi.fn(async () => false),
    };
  });

  vi.doMock('../lib/search/vector-index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/vector-index.js')>();
    return {
      ...actual,
      getDb: vi.fn(() => database),
      getMemory: vi.fn((id: number) => actual.getMemory(id, database)),
      updateMemory: vi.fn((params: Parameters<typeof actual.updateMemory>[0]) => actual.updateMemory(params, database)),
      updateEmbeddingStatus: vi.fn(),
    };
  });

  vi.doMock('../lib/search/bm25-index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/bm25-index.js')>();
    return {
      ...actual,
      isBm25Enabled: vi.fn(() => false),
    };
  });

  vi.doMock('../lib/storage/history.js', () => ({
    recordHistory: vi.fn(),
  }));

  vi.doMock('./memory-crud-utils.js', () => ({
    appendMutationLedgerSafe: vi.fn(() => true),
    getMemoryHashSnapshot: vi.fn(() => null),
  }));

  vi.doMock('./mutation-hooks.js', () => ({
    runPostMutationHooks: vi.fn(() => ({
      latencyMs: 0,
      triggerCacheCleared: false,
      constitutionalCacheCleared: false,
      toolCacheInvalidated: 0,
      graphSignalsCacheCleared: false,
      coactivationCacheCleared: false,
      errors: [],
    })),
  }));

  vi.doMock('../hooks/mutation-feedback.js', () => ({
    buildMutationHookFeedback: vi.fn(() => ({ hints: [], data: {} })),
  }));

  return import('../handlers/memory-crud-update.js');
}

beforeEach(() => {
  database = createTestDatabase();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  database.close();
});

describe('memory_update constitutional tier guard', () => {
  it('downgrades a non-constitutional path back to important and writes governance_audit', async () => {
    const memoryId = seedMemory('/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md');
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'constitutional',
    });

    const row = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as { importance_tier: string };
    expect(row.importance_tier).toBe('important');

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'tier_downgrade_non_constitutional_path' },
    ]);
  });

  it('preserves constitutional tier for rows inside /constitutional/ without an audit row', async () => {
    const memoryId = seedMemory('/workspace/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md');
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'constitutional',
    });

    const row = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as { importance_tier: string };
    expect(row.importance_tier).toBe('constitutional');

    const auditCount = database.prepare(`
      SELECT COUNT(*) AS count
      FROM governance_audit
    `).get() as { count: number };
    expect(auditCount.count).toBe(0);
  });
});
