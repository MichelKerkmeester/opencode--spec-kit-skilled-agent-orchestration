import Database from 'better-sqlite3';

import { ensureGovernanceRuntime } from '../../lib/governance/scope-governance.js';

export interface MemoryIndexTestDatabaseOptions {
  includeCheckpoints?: boolean;
  includeWorkingMemory?: boolean;
  includeActiveProjection?: boolean;
  includeContentColumns?: boolean;
}

export function createMemoryIndexTestDatabase(options: MemoryIndexTestDatabaseOptions = {}): Database.Database {
  const {
    includeCheckpoints = false,
    includeWorkingMemory = false,
    includeActiveProjection = false,
    includeContentColumns = false,
  } = options;
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
      content_hash TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      importance_tier TEXT DEFAULT 'normal',
      ${includeContentColumns ? "content_text TEXT, embedding_status TEXT DEFAULT 'success', parent_id INTEGER," : ''}
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      delete_after TEXT
    );
  `);

  if (includeCheckpoints) {
    db.exec(`
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
    `);
  }

  if (includeWorkingMemory) {
    db.exec(`
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
  }

  if (includeActiveProjection) {
    db.exec(`
      CREATE TABLE active_memory_projection (
        logical_key TEXT PRIMARY KEY,
        root_memory_id INTEGER,
        active_memory_id INTEGER,
        updated_at TEXT
      );
    `);
  }

  ensureGovernanceRuntime(db);
  return db;
}
