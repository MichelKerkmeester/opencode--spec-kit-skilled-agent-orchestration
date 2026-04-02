import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as zlib from 'zlib';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
import * as causalEdges from '../lib/storage/causal-edges';
import * as checkpoints from '../lib/storage/checkpoints';

interface SnapshotPayload {
  manifest?: {
    snapshot?: string[];
    rebuild?: string[];
    skip?: string[];
  };
  tables?: Record<string, { columns: string[]; rows: Array<Record<string, unknown>> }>;
}

const AUTHORITATIVE_TABLES = [
  'memory_index',
  'vec_memories',
  'vec_metadata',
  'working_memory',
  'causal_edges',
  'weight_history',
  'memory_history',
  'mutation_ledger',
  'memory_conflicts',
  'memory_corrections',
  'adaptive_signal_events',
  'negative_feedback_events',
  'learned_feedback_audit',
  'session_learning',
  'governance_audit',
  'shared_spaces',
  'shared_space_members',
  'shared_space_conflicts',
  'session_state',
  'session_sent_memories',
  'memory_summaries',
] as const;

const DERIVED_TABLES = [
  'memory_lineage',
  'active_memory_projection',
  'memory_entities',
  'entity_catalog',
  'degree_snapshots',
  'community_assignments',
  'memory_fts',
] as const;

const SKIP_TABLES = [
  'checkpoints',
  'schema_version',
  'embedding_cache',
  'adaptive_shadow_runs',
] as const;

let tempDir = '';
let dbPath = '';
let db: Database.Database;

function initializeDatabase(database: Database.Database): void {
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 4,
  });
  ensureSchemaVersion(database);
  createAuxiliaryTables(database);
}

function createAuxiliaryTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS vec_memories (
      embedding BLOB
    );

    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS working_memory (
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

    CREATE TABLE IF NOT EXISTS mutation_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      mutation_type TEXT NOT NULL,
      reason TEXT NOT NULL,
      prior_hash TEXT,
      new_hash TEXT NOT NULL,
      linked_memory_ids TEXT NOT NULL DEFAULT '[]',
      decision_meta TEXT NOT NULL DEFAULT '{}',
      actor TEXT NOT NULL,
      session_id TEXT
    );

    CREATE TABLE IF NOT EXISTS adaptive_signal_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      signal_type TEXT NOT NULL,
      signal_value REAL DEFAULT 1,
      query TEXT,
      actor TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS negative_feedback_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      created_at_ms INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learned_feedback_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      terms TEXT NOT NULL,
      source TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      shadow_mode INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS session_learning (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      memory_id INTEGER,
      insight TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_state (
      session_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'active',
      spec_folder TEXT,
      current_task TEXT,
      last_action TEXT,
      context_summary TEXT,
      pending_work TEXT,
      state_data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_sent_memories (
      session_id TEXT NOT NULL,
      memory_hash TEXT NOT NULL,
      memory_id INTEGER,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, memory_hash)
    );

    CREATE TABLE IF NOT EXISTS embedding_cache (
      content_hash TEXT NOT NULL,
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_used_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (content_hash, model_id)
    );

    CREATE TABLE IF NOT EXISTS adaptive_shadow_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      mode TEXT NOT NULL,
      bounded INTEGER DEFAULT 1,
      max_delta_applied REAL DEFAULT 0,
      proposal_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedDatabase(database: Database.Database): void {
  const now = '2026-03-20T10:00:00.000Z';
  const later = '2026-03-20T10:05:00.000Z';

  database.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_status,
      importance_tier,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id,
      context_type,
      channel,
      content_hash,
      content_text,
      learned_triggers
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    1,
    'specs/022-hybrid-rag-fusion',
    '/tmp/specs/022/alpha.md',
    '/tmp/specs/022/alpha.md',
    'Alpha Memory',
    '["alpha","sqlite"]',
    0.8,
    now,
    later,
    'success',
    'important',
    'tenant-a',
    'user-a',
    'agent-a',
    'sess-1',
    'space-1',
    'implementation',
    'default',
    'hash-alpha',
    'Spec Kit Memory Alpha uses SQLite and TypeScript.',
    '[]',
  );

  database.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_status,
      importance_tier,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id,
      context_type,
      channel,
      content_hash,
      content_text,
      learned_triggers
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    2,
    'specs/022-hybrid-rag-fusion',
    '/tmp/specs/022/beta.md',
    '/tmp/specs/022/beta.md',
    'Beta Memory',
    '["beta","graph"]',
    0.6,
    later,
    later,
    'success',
    'normal',
    'tenant-a',
    'user-a',
    'agent-a',
    'sess-1',
    'space-1',
    'research',
    'default',
    'hash-beta',
    'Beta Memory references OpenAI and Graph Signals.',
    '[]',
  );

  database.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(1, Buffer.from([1, 2, 3, 4]));
  database.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(2, Buffer.from([5, 6, 7, 8]));
  database.prepare(`INSERT INTO vec_metadata (key, value, created_at) VALUES ('embedding_dim', '4', ?)`).run(now);

  database.prepare(`
    INSERT INTO working_memory (
      id, session_id, memory_id, attention_score, added_at, last_focused, focus_count,
      event_counter, mention_count, source_tool, source_call_id, extraction_rule_id, redaction_applied
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);

  database.prepare(`
    INSERT INTO causal_edges (id, source_id, target_id, relation, strength, evidence, created_by, last_accessed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, '1', '2', 'supports', 0.75, 'checkpoint completeness test', 'manual', later);

  database.prepare(`
    INSERT INTO weight_history (id, edge_id, old_strength, new_strength, changed_by, changed_at, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(1, 1, 0.5, 0.75, 'tester', later, 'seed');

  database.prepare(`
    INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, timestamp, is_deleted, actor, spec_folder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('hist-1', 1, null, 'Alpha Memory', 'ADD', now, 0, 'tester', 'specs/022-hybrid-rag-fusion');

  database.prepare(`
    INSERT INTO mutation_ledger (
      id, timestamp, mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, later, 'update', 'seed restore', 'hash-alpha-prev', 'hash-alpha', '[1]', '{"source":"test"}', 'tester', 'sess-1');

  database.prepare(`
    INSERT INTO memory_conflicts (
      id, timestamp, action, new_memory_hash, new_memory_id, existing_memory_id, similarity, reason,
      new_content_preview, existing_content_preview, contradiction_detected, contradiction_type, spec_folder, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, later, 'UPDATE', 'hash-beta', 2, 1, 0.82, 'seed conflict', 'beta preview', 'alpha preview', 0, null, 'specs/022-hybrid-rag-fusion', later);

  database.prepare(`
    INSERT INTO memory_corrections (
      id, original_memory_id, correction_memory_id, correction_type, original_stability_before,
      original_stability_after, correction_stability_before, correction_stability_after, reason, corrected_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 1, 2, 'refined', 1.0, 1.2, 0.8, 1.0, 'seed correction', 'tester', later);

  database.prepare(`
    INSERT INTO adaptive_signal_events (id, memory_id, signal_type, signal_value, query, actor, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 1, 'access', 1.25, 'checkpoint completeness', 'tester', '{"phase":"seed"}', later);

  database.prepare(`
    INSERT INTO negative_feedback_events (id, memory_id, created_at_ms)
    VALUES (?, ?, ?)
  `).run(1, 2, 1710929100000);

  database.prepare(`
    INSERT INTO learned_feedback_audit (id, memory_id, action, terms, source, timestamp, shadow_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(1, 1, 'downrank', '["sqlite"]', 'tester', 1710929200, 0);

  database.prepare(`
    INSERT INTO session_learning (id, session_id, memory_id, insight, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(1, 'sess-1', 1, 'checkpoint completeness lesson', later);

  database.prepare(`
    INSERT INTO governance_audit (
      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 'scope_check', 'allow', 1, 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 'tenant-a', 'user-a', 'agent-a', 'sess-1', 'space-1', 'seed governance', '{"phase":"seed"}', later);

  database.prepare(`
    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('space-1', 'tenant-a', 'Hybrid Space', 1, 'pilot-a', 0, '{"phase":"seed"}', now, later);

  database.prepare(`
    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('space-1', 'user', 'user-a', 'owner', now, later);

  database.prepare(`
    INSERT INTO shared_space_conflicts (
      id, space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 'space-1', 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 1, 2, 'manual_review', 'tester', '{"phase":"seed"}', later);

  database.prepare(`
    INSERT INTO session_state (
      session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('sess-1', 'active', 'specs/022-hybrid-rag-fusion', 'checkpoint test', 'seed', 'summary', '[]', '{"phase":"seed"}', now, later);

  database.prepare(`
    INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
    VALUES (?, ?, ?, ?)
  `).run('sess-1', 'hash-alpha', 1, later);

  database.prepare(`
    INSERT INTO memory_summaries (
      id, memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(1, 1, 'Alpha summary', Buffer.from([9, 9, 9]), '["Alpha sentence"]', now, later);

  database.prepare(`
    INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('hash-alpha', 'test-model', Buffer.from([4, 4, 4]), 3, now, later);

  database.prepare(`
    INSERT INTO adaptive_shadow_runs (id, query, mode, bounded, max_delta_applied, proposal_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(1, 'checkpoint completeness', 'shadow', 1, 0.25, '{"proposal":"seed"}', later);
}

function normalizeValue(value: unknown): unknown {
  if (Buffer.isBuffer(value)) {
    return { type: 'buffer', hex: value.toString('hex') };
  }
  return value;
}

function readTableRows(database: Database.Database, tableName: string): Array<Record<string, unknown>> {
  if (tableName === 'vec_memories') {
    return database.prepare('SELECT rowid AS rowid, embedding FROM vec_memories').all() as Array<Record<string, unknown>>;
  }
  return database.prepare(`SELECT * FROM ${tableName}`).all() as Array<Record<string, unknown>>;
}

function normalizeRows(rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return rows
    .map((row) => {
      const normalized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        normalized[key] = normalizeValue(value);
      }
      return normalized;
    })
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
}

function captureTableState(database: Database.Database, tableName: string): Array<Record<string, unknown>> {
  return normalizeRows(readTableRows(database, tableName));
}

function captureAuthoritativeState(database: Database.Database): Record<string, Array<Record<string, unknown>>> {
  const state: Record<string, Array<Record<string, unknown>>> = {};
  for (const tableName of AUTHORITATIVE_TABLES) {
    state[tableName] = captureTableState(database, tableName);
  }
  return state;
}

function getCheckpointPayload(name: string): SnapshotPayload {
  const checkpoint = checkpoints.getCheckpoint(name);
  expect(checkpoint?.memory_snapshot).toBeTruthy();
  const payload = zlib.gunzipSync(checkpoint!.memory_snapshot!);
  return JSON.parse(payload.toString()) as SnapshotPayload;
}

describe('Checkpoint completeness', () => {
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkpoint-completeness-'));
    dbPath = path.join(tempDir, 'checkpoint-completeness.sqlite');
    db = new Database(dbPath);

    initializeDatabase(db);
    seedDatabase(db);

    causalEdges.init(db);
    checkpoints.init(db);
  });

  afterEach(() => {
    try {
      db.close();
    } catch {
      // no-op
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('round-trips authoritative tables and rebuilds derived tables after restore', () => {
    const baseline = captureAuthoritativeState(db);

    const created = checkpoints.createCheckpoint({ name: 'checkpoint-complete' });
    expect(created).toBeTruthy();

    const sourceCheckpoint = checkpoints.getCheckpoint('checkpoint-complete');
    expect(sourceCheckpoint).toBeTruthy();

    const restoreDbPath = path.join(tempDir, 'checkpoint-restore.sqlite');
    const restoreDb = new Database(restoreDbPath);
    initializeDatabase(restoreDb);
    restoreDb.prepare(`
      INSERT INTO checkpoints (id, name, created_at, spec_folder, git_branch, memory_snapshot, file_snapshot, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sourceCheckpoint!.id,
      sourceCheckpoint!.name,
      sourceCheckpoint!.created_at,
      sourceCheckpoint!.spec_folder,
      sourceCheckpoint!.git_branch,
      sourceCheckpoint!.memory_snapshot,
      sourceCheckpoint!.file_snapshot,
      sourceCheckpoint!.metadata,
    );

    causalEdges.init(restoreDb);
    checkpoints.init(restoreDb);

    const result = checkpoints.restoreCheckpoint('checkpoint-complete');
    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(2);
    expect(result.workingMemoryRestored).toBe(1);

    const restored = captureAuthoritativeState(restoreDb);
    expect(restored).toEqual(baseline);

    const lineageCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM memory_lineage').get() as { count: number };
    const projectionCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM active_memory_projection').get() as { count: number };
    const entityCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM memory_entities').get() as { count: number };
    const catalogCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM entity_catalog').get() as { count: number };
    const degreeCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM degree_snapshots').get() as { count: number };
    const communityCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM community_assignments').get() as { count: number };
    const ftsCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM memory_fts').get() as { count: number };

    expect(lineageCount.count).toBe(2);
    expect(projectionCount.count).toBe(2);
    expect(entityCount.count).toBeGreaterThan(0);
    expect(catalogCount.count).toBeGreaterThan(0);
    expect(degreeCount.count).toBe(2);
    // Community detection keeps a minimum cluster size of 3, so this 2-node seed
    // intentionally rebuilds degree/fts artifacts while leaving assignments empty.
    expect(communityCount.count).toBe(0);
    expect(ftsCount.count).toBe(2);

    restoreDb.close();
  });

  it('stores the manifest and omits skip tables from snapshot payloads', () => {
    const created = checkpoints.createCheckpoint({ name: 'checkpoint-manifest' });
    expect(created).toBeTruthy();

    const payload = getCheckpointPayload('checkpoint-manifest');
    expect(payload.manifest?.snapshot).toEqual([...AUTHORITATIVE_TABLES]);
    expect(payload.manifest?.skip).toEqual([...SKIP_TABLES]);

    const snapshottedTables = Object.keys(payload.tables ?? {}).sort();
    expect(snapshottedTables).toEqual([...AUTHORITATIVE_TABLES].sort());

    for (const tableName of SKIP_TABLES) {
      expect(snapshottedTables).not.toContain(tableName);
    }
  });
});
