// ───────────────────────────────────────────────────────────────
// MODULE: Schema Downgrade (V16 -> V15)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Database and schema safety
// Targeted downgrade utility for removing chunking columns added in v16:
//   - parent_id
//   - chunk_index
//   - chunk_label
// This intentionally supports ONLY v16 -> v15.
import type Database from 'better-sqlite3';
import * as checkpoints from './checkpoints.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SchemaDowngradeOptions {
  specFolder?: string;
  checkpointName?: string;
}

interface SchemaDowngradeResult {
  fromVersion: number;
  toVersion: number;
  checkpointName: string;
  preservedRows: number;
  removedColumns: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const TARGET_FROM_VERSION = 16;
const TARGET_TO_VERSION = 15;
const REMOVED_COLUMNS = ['parent_id', 'chunk_index', 'chunk_label'] as const;

const V15_COLUMNS = [
  'id',
  'spec_folder',
  'file_path',
  'anchor_id',
  'title',
  'trigger_phrases',
  'importance_weight',
  'created_at',
  'updated_at',
  'embedding_model',
  'embedding_generated_at',
  'embedding_status',
  'retry_count',
  'last_retry_at',
  'failure_reason',
  'base_importance',
  'decay_half_life_days',
  'is_pinned',
  'access_count',
  'last_accessed',
  'importance_tier',
  'session_id',
  'context_type',
  'channel',
  'content_hash',
  'expires_at',
  'confidence',
  'validation_count',
  'stability',
  'difficulty',
  'last_review',
  'review_count',
  'file_mtime_ms',
  'is_archived',
  'related_memories',
  'memory_type',
  'half_life_days',
  'type_inference_source',
  'document_type',
  'spec_level',
  'content_text',
  'quality_score',
  'quality_flags',
] as const;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function nowTimestampForName(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function getCurrentSchemaVersion(database: Database.Database): number {
  const row = database
    .prepare('SELECT version FROM schema_version WHERE id = 1')
    .get() as { version: number } | undefined;
  return row?.version ?? 0;
}

function ensureColumnsExist(database: Database.Database, requiredColumns: readonly string[]): void {
  const columns = database
    .prepare('PRAGMA table_info(memory_index)')
    .all() as Array<{ name: string }>;
  const columnNames = columns.map((row) => row.name);

  for (const col of requiredColumns) {
    if (!columnNames.includes(col)) {
      throw new Error(`Cannot downgrade: required v16 column "${col}" not found on memory_index`);
    }
  }
}

function createMemoryIndexV15(database: Database.Database): void {
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      failure_reason TEXT,
      base_importance REAL DEFAULT 0.5,
      decay_half_life_days REAL DEFAULT 90.0,
      is_pinned INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
      session_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general')), -- P1-5: canonical-only (legacy values migrated by v25)
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      is_archived INTEGER DEFAULT 0,
      related_memories TEXT,
      memory_type TEXT DEFAULT 'declarative'
        CHECK(memory_type IN ('working', 'episodic', 'prospective', 'implicit', 'declarative', 'procedural', 'semantic', 'autobiographical', 'meta-cognitive')),
      half_life_days REAL,
      type_inference_source TEXT DEFAULT 'default'
        CHECK(type_inference_source IN ('frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual')),
      document_type TEXT DEFAULT 'memory',
      spec_level INTEGER,
      content_text TEXT,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);
}

function createV15Indexes(database: Database.Database): void {
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_spec_folder ON memory_index(spec_folder);
    CREATE INDEX IF NOT EXISTS idx_created_at ON memory_index(created_at);
    CREATE INDEX IF NOT EXISTS idx_importance ON memory_index(importance_weight DESC);
    CREATE INDEX IF NOT EXISTS idx_embedding_status ON memory_index(embedding_status);
    CREATE INDEX IF NOT EXISTS idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at);

    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);

    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
    CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms);
    CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type);
    CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder);
    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);

    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);

    CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_index(memory_type);
    CREATE INDEX IF NOT EXISTS idx_memory_type_decay ON memory_index(memory_type, half_life_days);

    CREATE INDEX IF NOT EXISTS idx_embedding_pending
      ON memory_index(embedding_status)
      WHERE embedding_status IN ('pending', 'partial', 'retry');

    CREATE INDEX IF NOT EXISTS idx_fts_fallback
      ON memory_index(spec_folder, embedding_status)
      WHERE embedding_status IN ('pending', 'failed', 'retry');
  `);
}

function createFtsArtifacts(database: Database.Database): void {
  database.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
      title, trigger_phrases, file_path, content_text,
      content='memory_index', content_rowid='id'
    )
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
    END
  `);

  database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
}

/* ───────────────────────────────────────────────────────────────
   4. MAIN API
──────────────────────────────────────────────────────────────── */

function downgradeSchemaV16ToV15(
  database: Database.Database,
  options: SchemaDowngradeOptions = {}
): SchemaDowngradeResult {
  const currentVersion = getCurrentSchemaVersion(database);
  if (currentVersion !== TARGET_FROM_VERSION) {
    throw new Error(`Downgrade supports only v${TARGET_FROM_VERSION} -> v${TARGET_TO_VERSION}. Current schema is v${currentVersion}.`);
  }

  ensureColumnsExist(database, REMOVED_COLUMNS);

  const checkpointName = options.checkpointName || `pre-schema-downgrade-v16-to-v15-${nowTimestampForName()}`;
  const checkpoint = checkpoints.createCheckpoint({
    name: checkpointName,
    specFolder: options.specFolder || null,
    metadata: {
      reason: 'schema downgrade v16->v15',
      fromVersion: TARGET_FROM_VERSION,
      toVersion: TARGET_TO_VERSION,
      removedColumns: [...REMOVED_COLUMNS],
    },
  });

  if (!checkpoint) {
    throw new Error('Failed to create pre-downgrade checkpoint');
  }

  database.pragma('foreign_keys = OFF');
  try {
    const run = database.transaction(() => {
      database.exec(`
        DROP TRIGGER IF EXISTS memory_fts_insert;
        DROP TRIGGER IF EXISTS memory_fts_update;
        DROP TRIGGER IF EXISTS memory_fts_delete;
        DROP TABLE IF EXISTS memory_fts;
      `);

      database.exec(`ALTER TABLE memory_index RENAME TO memory_index_v16_backup`);

      createMemoryIndexV15(database);

      const columnsCsv = V15_COLUMNS.join(', ');
      database.exec(`
        INSERT INTO memory_index (${columnsCsv})
        SELECT ${columnsCsv}
        FROM memory_index_v16_backup
      `);

      // Drop backup table to release index names before re-creating v15 indexes.
      database.exec(`DROP TABLE memory_index_v16_backup`);

      createV15Indexes(database);
      createFtsArtifacts(database);

      database.prepare(`
        INSERT OR REPLACE INTO schema_version (id, version, updated_at)
        VALUES (1, ?, datetime('now'))
      `).run(TARGET_TO_VERSION);
    });

    run();
  } finally {
    database.pragma('foreign_keys = ON');
  }

  const row = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
  return {
    fromVersion: TARGET_FROM_VERSION,
    toVersion: TARGET_TO_VERSION,
    checkpointName: checkpointName,
    preservedRows: row.count,
    removedColumns: [...REMOVED_COLUMNS],
  };
}

export {
  downgradeSchemaV16ToV15,
};

/**
 * Re-exports related public types.
 */
export type {
  SchemaDowngradeOptions,
  SchemaDowngradeResult,
};
