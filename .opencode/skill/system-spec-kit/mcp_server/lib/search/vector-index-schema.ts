// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Schema
// ───────────────────────────────────────────────────────────────
// Split from vector-index-store.ts — contains ALL schema creation,
// Migration, and companion-table logic.

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import { getCanonicalPathKey } from '../utils/canonical-path.js';
import { extractSpecFolder } from '../parsing/memory-parser.js';
import { createLogger } from '../utils/logger.js';
import { initEmbeddingCache } from '../cache/embedding-cache.js';
import {
  get_error_message,
} from './vector-index-types.js';
import { init as initHistory } from '../storage/history.js';
import { getSpecsBasePaths } from './folder-discovery.js';

// Feature catalog: Database and schema safety
// Feature catalog: Lineage state active projection and asOf resolution
// Feature catalog: Per-memory history log


const logger = createLogger('VectorIndex');

interface SchemaCompatibilityReport {
  compatible: boolean;
  schemaVersion: number | null;
  missingTables: string[];
  missingColumns: Record<string, string[]>;
  missingIndexes: string[];
  constraintMismatches: string[];
  warnings: string[];
}

interface LineageSchemaReport {
  compatible: boolean;
  schemaVersion: number | null;
  missingTables: string[];
  missingColumns: Record<string, string[]>;
  warnings: string[];
}

const MEMORY_LINEAGE_TABLE = 'memory_lineage';
const ACTIVE_MEMORY_PROJECTION_TABLE = 'active_memory_projection';
const LEGACY_MEMORY_LINEAGE_TABLE = 'hydra_memory_lineage';
const LEGACY_ACTIVE_MEMORY_PROJECTION_TABLE = 'hydra_active_memory_projection';
const REQUIRED_TABLES: readonly string[] = ['memory_index', 'schema_version'];
const REQUIRED_INDEXES_BY_TABLE: Readonly<Record<string, readonly string[]>> = {
  memory_index: [
    'idx_stability',
    'idx_last_review',
    'idx_fsrs_retrieval',
    'idx_document_type',
    'idx_doc_type_folder',
    'idx_quality_score',
    'idx_save_parent_content_hash_scope',
    'idx_save_parent_canonical_path',
  ],
  memory_conflicts: [
    'idx_conflicts_memory',
    'idx_conflicts_timestamp',
  ],
};
const REQUIRED_MEMORY_INDEX_COLUMNS: readonly string[] = [
  'id',
  'spec_folder',
  'file_path',
  'importance_tier',
  'context_type',
  'session_id',
  'created_at',
  'updated_at',
];
const REQUIRED_MEMORY_CONFLICT_COLUMNS: readonly string[] = [
  'id',
  'timestamp',
  'action',
  'new_memory_hash',
  'new_memory_id',
  'existing_memory_id',
  'similarity',
  'reason',
  'new_content_preview',
  'existing_content_preview',
  'contradiction_detected',
  'contradiction_type',
  'spec_folder',
  'created_at',
];
const REQUIRED_LINEAGE_TABLES: readonly string[] = [
  MEMORY_LINEAGE_TABLE,
  ACTIVE_MEMORY_PROJECTION_TABLE,
];
const REQUIRED_LINEAGE_COLUMNS: Readonly<Record<string, readonly string[]>> = {
  [MEMORY_LINEAGE_TABLE]: [
    'memory_id',
    'logical_key',
    'version_number',
    'root_memory_id',
    'predecessor_memory_id',
    'superseded_by_memory_id',
    'valid_from',
    'valid_to',
    'transition_event',
    'actor',
    'metadata',
    'created_at',
  ],
  [ACTIVE_MEMORY_PROJECTION_TABLE]: [
    'logical_key',
    'root_memory_id',
    'active_memory_id',
    'updated_at',
  ],
};
const SAVE_PARENT_CONTENT_HASH_SCOPE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
  ON memory_index(
    spec_folder,
    content_hash,
    embedding_status,
    tenant_id,
    user_id,
    agent_id,
    session_id,
    shared_space_id,
    id DESC
  )
  WHERE parent_id IS NULL
`;
const SAVE_PARENT_CANONICAL_PATH_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_save_parent_canonical_path
  ON memory_index(spec_folder, canonical_file_path, id DESC)
  WHERE parent_id IS NULL
`;

function hasTable(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='table' AND name = ?"
  ).get(tableName) as { present?: number } | undefined;

  return row?.present === 1;
}

function hasIndex(database: Database.Database, indexName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='index' AND name = ?"
  ).get(indexName) as { present?: number } | undefined;

  return row?.present === 1;
}

function getTableColumns(database: Database.Database, tableName: string): string[] {
  return (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
    .map((column) => column.name)
    .filter((columnName) => typeof columnName === 'string' && columnName.length > 0);
}

function getTableSql(database: Database.Database, tableName: string): string | null {
  const row = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name = ?"
  ).get(tableName) as { sql?: string } | undefined;

  return typeof row?.sql === 'string' ? row.sql : null;
}

function hasEmbeddingCacheDimensionsPrimaryKey(database: Database.Database): boolean {
  const tableSql = getTableSql(database, 'embedding_cache');
  if (typeof tableSql !== 'string') {
    return false;
  }

  return /PRIMARY\s+KEY\s*\(\s*content_hash\s*,\s*model_id\s*,\s*dimensions\s*\)/i.test(tableSql);
}

function ensureEmbeddingCacheSchema(database: Database.Database): void {
  if (!hasTable(database, 'embedding_cache')) {
    initEmbeddingCache(database);
    return;
  }

  if (hasEmbeddingCacheDimensionsPrimaryKey(database)) {
    return;
  }

  logger.info('Migrating embedding_cache primary key to include dimensions');
  database.exec(`
    ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_dimensions;
  `);
  initEmbeddingCache(database);
  database.exec(`
    INSERT OR REPLACE INTO embedding_cache (
      content_hash,
      model_id,
      embedding,
      dimensions,
      created_at,
      last_used_at
    )
    SELECT
      content_hash,
      model_id,
      embedding,
      dimensions,
      created_at,
      last_used_at
    FROM embedding_cache_legacy_dimensions
  `);
  database.exec('DROP TABLE embedding_cache_legacy_dimensions');
}

function hasConstitutionalTierConstraint(database: Database.Database): boolean {
  const tableSql = getTableSql(database, 'memory_index');
  return typeof tableSql === 'string' && tableSql.includes("'constitutional'");
}

function createRequiredIndex(
  database: Database.Database,
  indexName: string,
  sql: string,
  context: string,
): void {
  try {
    database.exec(sql);
  } catch (error: unknown) {
    if (hasIndex(database, indexName)) {
      logger.warn(`${context}: reusing existing index after DDL warning`, {
        indexName,
        error: get_error_message(error),
      });
      return;
    }
    throw error;
  }

  if (!hasIndex(database, indexName)) {
    throw new Error(`${context}: expected index "${indexName}" to exist after migration`);
  }
}

function createMemoryConflictsTable(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_conflicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
      new_memory_hash TEXT,
      new_memory_id INTEGER,
      existing_memory_id INTEGER,
      similarity REAL,
      reason TEXT,
      new_content_preview TEXT,
      existing_content_preview TEXT,
      contradiction_detected INTEGER DEFAULT 0,
      contradiction_type TEXT,
      spec_folder TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
    )
  `);
}

function createMemoryConflictIndexes(
  database: Database.Database,
  context: string,
): void {
  createRequiredIndex(
    database,
    'idx_conflicts_memory',
    'CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)',
    context,
  );
  createRequiredIndex(
    database,
    'idx_conflicts_timestamp',
    'CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)',
    context,
  );
}

function getFirstAvailableColumnExpression(
  availableColumns: Set<string>,
  candidates: string[],
  fallback: string,
): string {
  for (const candidate of candidates) {
    if (availableColumns.has(candidate)) {
      return candidate;
    }
  }
  return fallback;
}

function hasUnifiedMemoryConflictsTable(database: Database.Database): boolean {
  if (!hasTable(database, 'memory_conflicts')) {
    return false;
  }

  const columns = new Set(getTableColumns(database, 'memory_conflicts'));
  return REQUIRED_MEMORY_CONFLICT_COLUMNS.every((columnName) => columns.has(columnName));
}

function migrateMemoryConflictsTable(database: Database.Database): void {
  if (!hasTable(database, 'memory_conflicts')) {
    createMemoryConflictsTable(database);
    return;
  }

  if (hasUnifiedMemoryConflictsTable(database)) {
    return;
  }

  database.exec('ALTER TABLE memory_conflicts RENAME TO memory_conflicts_legacy');
  createMemoryConflictsTable(database);

  const legacyColumns = new Set(getTableColumns(database, 'memory_conflicts_legacy'));
  database.exec(`
    INSERT INTO memory_conflicts (
      id,
      timestamp,
      action,
      new_memory_hash,
      new_memory_id,
      existing_memory_id,
      similarity,
      reason,
      new_content_preview,
      existing_content_preview,
      contradiction_detected,
      contradiction_type,
      spec_folder,
      created_at
    )
    SELECT
      ${getFirstAvailableColumnExpression(legacyColumns, ['id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['timestamp', 'created_at'], 'CURRENT_TIMESTAMP')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['action'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_memory_hash'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_memory_id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['existing_memory_id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['similarity', 'similarity_score'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['reason', 'notes'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_content_preview'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['existing_content_preview'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_detected'], '0')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_type'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['spec_folder'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['created_at', 'timestamp'], 'CURRENT_TIMESTAMP')}
    FROM memory_conflicts_legacy
  `);
  database.exec('DROP TABLE memory_conflicts_legacy');

  if (!hasUnifiedMemoryConflictsTable(database)) {
    throw new Error('Migration v12: memory_conflicts table is still missing unified columns after rebuild');
  }
}

function summarizeCompatibilityFailures(report: SchemaCompatibilityReport): string {
  const details: string[] = [];

  if (report.missingTables.length > 0) {
    details.push(`missing tables: ${report.missingTables.join(', ')}`);
  }
  if (Object.keys(report.missingColumns).length > 0) {
    const missingColumns = Object.entries(report.missingColumns)
      .map(([tableName, columns]) => `${tableName}[${columns.join(', ')}]`)
      .join('; ');
    details.push(`missing columns: ${missingColumns}`);
  }
  if (report.missingIndexes.length > 0) {
    details.push(`missing indexes: ${report.missingIndexes.join(', ')}`);
  }
  if (report.constraintMismatches.length > 0) {
    details.push(`constraint mismatches: ${report.constraintMismatches.join(', ')}`);
  }

  return details.join(' | ');
}

function logDuplicateColumnMigrationSkip(columnName: string, error: unknown): void {
  logger.warn(`Migration skipped existing ${columnName} column`, {
    error: error instanceof Error ? error.message : String(error),
  });
}

function getMigrationAllowedBasePaths(): string[] {
  const workspaceRoot = process.cwd();
  const envPaths = process.env.MEMORY_ALLOWED_PATHS
    ? process.env.MEMORY_ALLOWED_PATHS.split(path.delimiter)
    : [];

  return Array.from(new Set([
    ...getSpecsBasePaths(workspaceRoot),
    path.join(workspaceRoot, '.opencode'),
    path.join(os.homedir(), '.claude'),
    workspaceRoot,
    ...envPaths,
  ].filter(Boolean).map((basePath) => path.resolve(basePath))));
}

// Schema version for migration tracking
// Added memory_type column for type-specific half-lives (REQ-002)
// Added file_mtime_ms for incremental indexing fast-path (REQ-023, T064-T066)
// Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
// Added causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
// Added memory_corrections table for learning from corrections (REQ-015, REQ-026, T052-T055)
// V10: Schema consolidation and index optimization
// V11: Error code deduplication and validation improvements
// V12: Unified memory_conflicts DDL (KL-1 Schema Unification)
// V13: Add document_type and spec_level columns for full spec folder document indexing
// V14: Add content_text column + FTS5 rebuild for BM25 full-text search across restarts
// V15: Add quality_score and quality_flags columns for memory quality gates
// V16: Add parent_id column for chunked indexing of large files (010-index-large-files)
// V17: Add interference_score column for TM-01 (the rollout)
// V18: the rollout — weight_history table + causal_edges provenance + encoding_intent column
// V19: degree_snapshots + community_assignments (N2 graph centrality)
// V20: memory_summaries + memory_entities + entity_catalog (R8/R10/S5)
// V21: Add learned_triggers column (R11 learned feedback)
// V22: Step 2 memory lineage tables + active projection support
// V23: One-time spec_folder re-canonicalization + session_state migration
// V24: Add trigger-cache source and temporal contiguity indexes
/** Current schema version for vector-index migrations. */
export const SCHEMA_VERSION = 25;

// Run schema migrations from one version to another
// Each migration is idempotent - safe to run multiple times
// BUG-019 FIX: Wrap migrations in transaction for atomicity
/**
 * Runs schema migrations between two schema versions.
 * @param database - The database connection to migrate.
 * @param from_version - The current schema version.
 * @param to_version - The target schema version.
 * @returns Nothing.
 */
export function run_migrations(database: Database.Database, from_version: number, to_version: number): void {
  const migrations: Record<number, () => void> = {
    1: () => {
      // V0 -> v1: Initial schema (already exists via create_schema)
    },
    2: () => {
      // V1 -> v2: Add idx_history_timestamp index
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
        logger.info('Migration v2: Created idx_history_timestamp index');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v2 warning:', get_error_message(e));
        }
      }
    },
    3: () => {
      // V2 -> v3: Add related_memories column
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN related_memories TEXT');
        logger.info('Migration v3: Added related_memories column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v3 warning:', get_error_message(e));
        }
      }
    },
    4: () => {
      // V3 -> v4: Add FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      // These columns enable spaced repetition-based memory retrieval prioritization
      const fsrs_columns = [
        { name: 'stability', sql: 'ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0' },
        { name: 'difficulty', sql: 'ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0' },
        { name: 'last_review', sql: 'ALTER TABLE memory_index ADD COLUMN last_review TEXT' },
        { name: 'review_count', sql: 'ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0' }
      ];

      for (const col of fsrs_columns) {
        try {
          database.exec(col.sql);
          logger.info(`Migration v4: Added ${col.name} column (FSRS)`);
        } catch (e: unknown) {
          if (!get_error_message(e).includes('duplicate column')) {
            console.warn(`[VectorIndex] Migration v4 warning (${col.name}):`, get_error_message(e));
          }
        }
      }

      // Use the canonical helper so later schema refinements only update one DDL definition.
      createMemoryConflictsTable(database);
      logger.info('Migration v4: Ensured memory_conflicts table');

      // Create indexes for FSRS columns
      createRequiredIndex(
        database,
        'idx_stability',
        'CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC)',
        'Migration v4',
      );
      createRequiredIndex(
        database,
        'idx_last_review',
        'CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)',
        'Migration v4',
      );
      createRequiredIndex(
        database,
        'idx_fsrs_retrieval',
        'CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)',
        'Migration v4',
      );
      logger.info('Migration v4: Created FSRS indexes');
    },
    5: () => {
      // V4 -> v5: Add memory_type column for type-specific half-lives (REQ-002, T006)
      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'declarative'
            CHECK(memory_type IN (
              'working', 'episodic', 'prospective', 'implicit', 'declarative',
              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
            ))
        `);
        logger.info('Migration v5: Added memory_type column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (memory_type):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN half_life_days REAL');
        logger.info('Migration v5: Added half_life_days column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (half_life_days):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN type_inference_source TEXT DEFAULT 'default'
            CHECK(type_inference_source IN (
              'frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual'
            ))
        `);
        logger.info('Migration v5: Added type_inference_source column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (type_inference_source):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_index(memory_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type_decay ON memory_index(memory_type, half_life_days)');
        logger.info('Migration v5: Created memory_type indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v5 warning (indexes):', get_error_message(e));
      }

      logger.info('Migration v5: Type inference backfill will run on next index scan');
    },
    6: () => {
      // V5 -> v6: Add file_mtime_ms for incremental indexing (REQ-023, T064-T066)
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN file_mtime_ms INTEGER');
        logger.info('Migration v6: Added file_mtime_ms column for incremental indexing');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v6 warning (file_mtime_ms):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms)');
        logger.info('Migration v6: Created file_mtime index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v6 warning (idx_file_mtime):', get_error_message(e));
      }
    },
    7: () => {
      // V6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_embedding_pending
          ON memory_index(embedding_status)
          WHERE embedding_status IN ('pending', 'partial', 'retry')
        `);
        logger.info('Migration v7: Created idx_embedding_pending partial index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', get_error_message(e));
      }

      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_fts_fallback
          ON memory_index(spec_folder, embedding_status, importance_tier)
          WHERE embedding_status IN ('pending', 'partial')
        `);
        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
      }
    },
    8: () => {
      // V7 -> v8: Create causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS causal_edges (
            id INTEGER PRIMARY KEY,
            source_id TEXT NOT NULL,
            target_id TEXT NOT NULL,
            relation TEXT NOT NULL CHECK(relation IN (
              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
            )),
            strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
            evidence TEXT,
            extracted_at TEXT DEFAULT (datetime('now')),
            created_by TEXT DEFAULT 'manual',
            last_accessed TEXT,
            UNIQUE(source_id, target_id, relation)
          )
        `);
        logger.info('Migration v8: Created causal_edges table');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v8 warning (causal_edges):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_relation ON causal_edges(relation)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_strength ON causal_edges(strength DESC)');
        logger.info('Migration v8: Created causal_edges indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v8 warning (indexes):', get_error_message(e));
      }
    },
    9: () => {
      // V8 -> v9: Create memory_corrections table for Learning from Corrections
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_corrections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_memory_id INTEGER NOT NULL,
            correction_memory_id INTEGER,
            correction_type TEXT NOT NULL CHECK(correction_type IN (
              'superseded', 'deprecated', 'refined', 'merged'
            )),
            original_stability_before REAL,
            original_stability_after REAL,
            correction_stability_before REAL,
            correction_stability_after REAL,
            reason TEXT,
            corrected_by TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            is_undone INTEGER DEFAULT 0,
            undone_at TEXT,
            FOREIGN KEY (original_memory_id) REFERENCES memory_index(id) ON DELETE CASCADE,
            FOREIGN KEY (correction_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v9: Created memory_corrections table');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v9 warning (memory_corrections):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_original ON memory_corrections(original_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_correction ON memory_corrections(correction_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_type ON memory_corrections(correction_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_created ON memory_corrections(created_at DESC)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_active ON memory_corrections(original_memory_id, is_undone) WHERE is_undone = 0');
        logger.info('Migration v9: Created memory_corrections indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v9 warning (indexes):', get_error_message(e));
      }
    },
    12: () => {
      // V11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
      migrateMemoryConflictsTable(database);
      logger.info('Migration v12: Unified memory_conflicts table (KL-1)');

      createMemoryConflictIndexes(database, 'Migration v12');
      logger.info('Migration v12: Created memory_conflicts indexes');
    },
    13: () => {
      // V12 -> v13: Add document_type and spec_level for full spec folder document indexing
      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'");
        logger.info('Migration v13: Added document_type column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (document_type):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN spec_level INTEGER');
        logger.info('Migration v13: Added spec_level column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (spec_level):', get_error_message(e));
        }
      }

      createRequiredIndex(
        database,
        'idx_document_type',
        'CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)',
        'Migration v13',
      );
      createRequiredIndex(
        database,
        'idx_doc_type_folder',
        'CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)',
        'Migration v13',
      );
      logger.info('Migration v13: Created document_type indexes');

      try {
        database.exec(`
          UPDATE memory_index SET document_type = 'constitutional'
          WHERE document_type = 'memory'
            AND importance_tier = 'constitutional'
        `);
        logger.info('Migration v13: Backfilled document_type for constitutional files');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v13 warning (backfill):', get_error_message(e));
      }
    },

    14: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN content_text TEXT');
        logger.info('Migration v14: Added content_text column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v14 warning (content_text):', get_error_message(e));
        }
      }

      try {
        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');

        database.exec('DROP TABLE IF EXISTS memory_fts');
        database.exec(`
          CREATE VIRTUAL TABLE memory_fts USING fts5(
            title, trigger_phrases, file_path, content_text,
            content='memory_index', content_rowid='id'
          )
        `);

        database.exec(`
          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
          END
        `);
        database.exec(`
          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
          END
        `);
        database.exec(`
          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
          END
        `);
        logger.info('Migration v14: Rebuilt FTS5 table with content_text');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v14 warning (FTS5 rebuild):', get_error_message(e));
      }

      try {
        const rows = database.prepare(
          'SELECT id, file_path FROM memory_index WHERE content_text IS NULL'
        ).all() as Array<{ id: number; file_path: string }>;

        let backfilled = 0;
        const allowedBasePaths = getMigrationAllowedBasePaths();
        const updateStmt = database.prepare(
          'UPDATE memory_index SET content_text = ? WHERE id = ?'
        );

        for (const row of rows) {
          try {
            const validatedPath = validateFilePath(row.file_path, allowedBasePaths);
            if (!validatedPath) {
              console.warn('[VectorIndex] Migration v14 skipped content_text backfill for disallowed path', {
                operation: 'migration_v14_backfill',
                memoryId: row.id,
                filePath: row.file_path,
              });
              continue;
            }

            if (fs.existsSync(validatedPath)) {
              const content = fs.readFileSync(validatedPath, 'utf-8');
              updateStmt.run(content, row.id);
              backfilled++;
            }
          } catch (rowError: unknown) {
            console.warn('[VectorIndex] Migration v14 skipped unreadable file during content_text backfill', {
              operation: 'migration_v14_backfill',
              memoryId: row.id,
              filePath: row.file_path,
              error: get_error_message(rowError),
            });
          }
        }

        if (backfilled > 0) {
          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
        }

        logger.info(`Migration v14: Backfilled content_text for ${backfilled}/${rows.length} rows`);
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v14 warning (backfill):', get_error_message(e));
      }
    },

    15: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN quality_score REAL DEFAULT 0');
        logger.info('Migration v15: Added quality_score column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_score):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN quality_flags TEXT');
        logger.info('Migration v15: Added quality_flags column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_flags):', get_error_message(e));
        }
      }

      createRequiredIndex(
        database,
        'idx_quality_score',
        'CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score)',
        'Migration v15',
      );
      logger.info('Migration v15: Created quality score index');
    },

    16: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE');
        logger.info('Migration v16: Added parent_id column for chunked indexing');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (parent_id):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN chunk_index INTEGER');
        logger.info('Migration v16: Added chunk_index column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (chunk_index):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN chunk_label TEXT');
        logger.info('Migration v16: Added chunk_label column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (chunk_label):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_parent_id ON memory_index(parent_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_parent_chunk ON memory_index(parent_id, chunk_index)');
        logger.info('Migration v16: Created parent_id indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v16 warning (indexes):', get_error_message(e));
      }
    },

    17: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN interference_score REAL DEFAULT 0');
        logger.info('Migration v17: Added interference_score column (TM-01)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v17 warning (interference_score):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_interference_score ON memory_index(interference_score)');
        logger.info('Migration v17: Created interference_score index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v17 warning (idx_interference_score):', get_error_message(e));
      }
    },

    18: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS weight_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
            old_strength REAL NOT NULL,
            new_strength REAL NOT NULL,
            changed_by TEXT DEFAULT 'manual',
            changed_at TEXT DEFAULT (datetime('now')),
            reason TEXT
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_edge ON weight_history(edge_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_time ON weight_history(changed_at DESC)');
        logger.info('Migration v18: Created weight_history table (T001d)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v18 warning (weight_history):', get_error_message(e));
        }
      }

      try {
        database.exec("ALTER TABLE causal_edges ADD COLUMN created_by TEXT DEFAULT 'manual'");
        logger.info('Migration v18: Added created_by column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (created_by):', get_error_message(e));
        }
      }
      try {
        database.exec('ALTER TABLE causal_edges ADD COLUMN last_accessed TEXT');
        logger.info('Migration v18: Added last_accessed column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (last_accessed):', get_error_message(e));
        }
      }

      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN encoding_intent TEXT DEFAULT 'document'");
        database.exec('CREATE INDEX IF NOT EXISTS idx_encoding_intent ON memory_index(encoding_intent)');
        logger.info('Migration v18: Added encoding_intent column to memory_index (R16)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (encoding_intent):', get_error_message(e));
        }
      }
    },

    19: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS degree_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL,
            degree_count INTEGER NOT NULL DEFAULT 0,
            snapshot_date TEXT NOT NULL DEFAULT (date('now')),
            UNIQUE(memory_id, snapshot_date)
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_memory ON degree_snapshots(memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_date ON degree_snapshots(snapshot_date DESC)');
        logger.info('Migration v19: Created degree_snapshots table (N2a)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v19 warning (degree_snapshots):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS community_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL UNIQUE,
            community_id INTEGER NOT NULL,
            algorithm TEXT NOT NULL DEFAULT 'bfs',
            computed_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_community_assignments_community ON community_assignments(community_id)');
        logger.info('Migration v19: Created community_assignments table (N2c)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v19 warning (community_assignments):', get_error_message(e));
        }
      }
    },

    20: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL UNIQUE,
            summary_text TEXT NOT NULL,
            summary_embedding BLOB,
            key_sentences TEXT DEFAULT '[]',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_summaries_memory ON memory_summaries(memory_id)');
        logger.info('Migration v20: Created memory_summaries table (R8)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (memory_summaries):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_entities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL,
            entity_text TEXT NOT NULL,
            entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
            frequency INTEGER NOT NULL DEFAULT 1,
            created_by TEXT NOT NULL DEFAULT 'entity_extractor',
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE(memory_id, entity_text)
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_memory ON memory_entities(memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_text ON memory_entities(entity_text)');
        logger.info('Migration v20: Created memory_entities table (R10)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (memory_entities):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS entity_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            canonical_name TEXT NOT NULL UNIQUE,
            aliases TEXT DEFAULT '[]',
            entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
            memory_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_entity_catalog_name ON entity_catalog(canonical_name)');
        logger.info('Migration v20: Created entity_catalog table (S5)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (entity_catalog):', get_error_message(e));
        }
      }
    }
  };

  // V20 -> v21: Add learned_triggers column (R11 learned feedback)
  migrations[21] = () => {
    try {
      database.exec("ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'");
      logger.info('Migration v21: Added learned_triggers column (R11)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column') && !get_error_message(e).includes('already exists')) {
        console.warn('[VectorIndex] Migration v21 warning (learned_triggers):', get_error_message(e));
      }
    }
  };

  migrations[22] = () => {
    try {
      ensureLineageTables(database);
      logger.info('Migration v22: Created memory lineage tables and indexes');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('already exists')) {
        console.warn('[VectorIndex] Migration v22 warning (memory lineage):', get_error_message(e));
      }
    }
  };

  // V22 -> V23: One-time re-canonicalization of spec_folder values
  migrations[23] = () => {
    const rows = database.prepare(`
      SELECT id, file_path, spec_folder FROM memory_index
      WHERE file_path IS NOT NULL AND file_path != ''
    `).all() as Array<{ id: number; file_path: string; spec_folder: string }>;

    // P1-2 fix: Filter in JS with normalized separators (not SQL LIKE)
    const specRows = rows.filter(row => {
      const normalized = row.file_path.replace(/\\/g, '/');
      return normalized.includes('/specs/') || normalized.startsWith('specs/');
    });

    const updates: Array<{ id: number; canonical: string; oldSpecFolder: string }> = [];
    for (const row of specRows) {
      try {
        const canonical = extractSpecFolder(row.file_path);
        if (canonical !== row.spec_folder) {
          updates.push({ id: row.id, canonical, oldSpecFolder: row.spec_folder });
        }
      } catch {
        logger.warn(`Migration v23: Skipping row ${row.id} — canonicalization failed`);
      }
    }

    if (updates.length > 0) {
      const updateStmt = database.prepare(
        'UPDATE memory_index SET spec_folder = ? WHERE id = ? AND spec_folder = ?'
      );
      for (const u of updates) {
        updateStmt.run(u.canonical, u.id, u.oldSpecFolder);
      }
      logger.info(`Migration v23: Re-canonicalized spec_folder for ${updates.length} memory rows`);
    }

    // P1-3 fix: Migrate session_state.spec_folder using old→new mapping
    migrateSessionStateSpecFolders(database, updates);
    migrateHistorySpecFolders(database, updates);
  };

  migrations[24] = () => {
    createRequiredIndex(
      database,
      'idx_trigger_cache_source',
      `CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
       ON memory_index(embedding_status, id)
       WHERE embedding_status = 'success'
         AND trigger_phrases IS NOT NULL
         AND trigger_phrases != '[]'
         AND trigger_phrases != ''`,
      'Migration v24',
    );
    createRequiredIndex(
      database,
      'idx_spec_folder_created_at',
      'CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)',
      'Migration v24',
    );
    logger.info('Migration v24: Created trigger-cache source and temporal contiguity indexes');
  };

  migrations[25] = () => {
    // P1-5: Normalize legacy context_type values and rebuild CHECK constraint.
    // Step 1: UPDATE legacy values to canonical forms
    const updated = database.prepare(`
      UPDATE memory_index SET context_type = 'planning' WHERE context_type = 'decision'
    `).run();
    const updatedDiscovery = database.prepare(`
      UPDATE memory_index SET context_type = 'general' WHERE context_type = 'discovery'
    `).run();
    logger.info(`Migration v25: Normalized context_type values (${updated.changes} decision→planning, ${updatedDiscovery.changes} discovery→general)`);

    // Step 2: Rebuild table with strict CHECK constraint (canonical types only).
    // SQLite doesn't support ALTER CONSTRAINT, so we rebuild the table.
    const hasContextTypeColumn = database.prepare(
      `SELECT COUNT(*) as cnt FROM pragma_table_info('memory_index') WHERE name = 'context_type'`
    ).get() as { cnt: number };

    if (hasContextTypeColumn.cnt > 0) {
      // Get current table SQL to check if CHECK constraint needs updating
      const tableInfo = database.prepare(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_index'`
      ).get() as { sql: string } | undefined;

      if (tableInfo?.sql && !tableInfo.sql.includes("context_type IN ('research', 'implementation', 'planning', 'general')")) {
        // Table needs rebuilding — current CHECK is either missing or includes legacy values
        // Get all column names from the existing table
        const columns = database.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
        const columnNames = columns.map(c => c.name).join(', ');

        // Get all indexes to recreate after rebuild
        const indexes = database.prepare(
          `SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='memory_index' AND sql IS NOT NULL`
        ).all() as Array<{ sql: string }>;

        // Rebuild: rename → create new → copy → drop old
        database.exec(`ALTER TABLE memory_index RENAME TO memory_index_v24_backup`);

        // Get the CREATE TABLE statement and replace the CHECK constraint
        let createSql = tableInfo.sql;
        // Replace any existing CHECK on context_type with strict canonical-only constraint
        createSql = createSql.replace(
          /CHECK\s*\(\s*context_type\s+IN\s*\([^)]+\)\s*\)/i,
          "CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))"
        );
        // If no CHECK existed (column added via ALTER TABLE), add one
        if (!createSql.includes('CHECK(context_type')) {
          createSql = createSql.replace(
            /context_type\s+TEXT\s+DEFAULT\s+'general'/i,
            "context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))"
          );
        }
        database.exec(createSql);

        // Copy data
        database.exec(`INSERT INTO memory_index SELECT ${columnNames} FROM memory_index_v24_backup`);
        database.exec(`DROP TABLE memory_index_v24_backup`);

        // Recreate indexes
        for (const idx of indexes) {
          try {
            database.exec(idx.sql);
          } catch {
            // Index may already exist or reference dropped columns — skip
          }
        }

        logger.info('Migration v25: Rebuilt memory_index with strict CHECK(context_type) — canonical types only');
      } else {
        logger.info('Migration v25: CHECK constraint already correct, skipping table rebuild');
      }
    }
  };

  // BUG-019 FIX: Wrap all migrations in a transaction for atomicity
  const run_all_migrations = database.transaction(() => {
    for (let v = from_version + 1; v <= to_version; v++) {
      if (migrations[v]) {
        logger.info(`Running migration v${v}`);
        migrations[v]();
      }
    }
  });

  try {
    run_all_migrations();
  } catch (err: unknown) {
    console.error('[VectorIndex] Migration failed, rolled back:', get_error_message(err));
    throw err;
  }
}

// Ensure schema version table exists and run any pending migrations
/**
 * Ensures the schema version table is current.
 * @param database - The database connection to check.
 * @returns The previous schema version.
 */
export function ensure_schema_version(database: Database.Database): number {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
  const current_version = row ? row.version : 0;
  let compatibility = validate_backward_compatibility(database);

  if (current_version < SCHEMA_VERSION) {
    logger.info(`Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
    run_migrations(database, current_version, SCHEMA_VERSION);

    compatibility = validate_backward_compatibility(database);
    if (!compatibility.compatible) {
      throw new Error(`Schema migration compatibility check failed: ${summarizeCompatibilityFailures(compatibility)}`);
    }

    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);

    logger.info(`Schema migration complete: v${SCHEMA_VERSION}`);
  }

  if (!compatibility.compatible) {
    logger.warn(
      'Backward-compatibility validation detected schema gaps',
      compatibility as unknown as Record<string, unknown>
    );
  }

  initHistory(database);

  return current_version;
}

export function ensureLineageTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_lineage (
      memory_id INTEGER PRIMARY KEY,
      logical_key TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      root_memory_id INTEGER NOT NULL,
      predecessor_memory_id INTEGER,
      superseded_by_memory_id INTEGER,
      valid_from TEXT NOT NULL,
      valid_to TEXT,
      transition_event TEXT NOT NULL CHECK(transition_event IN ('CREATE', 'UPDATE', 'SUPERSEDE', 'BACKFILL')),
      actor TEXT DEFAULT 'system',
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(logical_key, version_number)
    )
  `);

  const lineageTableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_lineage'"
  ).get() as { sql?: string } | undefined;
  if (lineageTableInfo?.sql && (!lineageTableInfo.sql.includes("'UPDATE'") || lineageTableInfo.sql.includes('FOREIGN KEY'))) {
    database.exec(`
      ALTER TABLE memory_lineage RENAME TO memory_lineage_old;
      CREATE TABLE memory_lineage (
        memory_id INTEGER PRIMARY KEY,
        logical_key TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        root_memory_id INTEGER NOT NULL,
        predecessor_memory_id INTEGER,
        superseded_by_memory_id INTEGER,
        valid_from TEXT NOT NULL,
        valid_to TEXT,
        transition_event TEXT NOT NULL CHECK(transition_event IN ('CREATE', 'UPDATE', 'SUPERSEDE', 'BACKFILL')),
        actor TEXT DEFAULT 'system',
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(logical_key, version_number)
      );
      INSERT INTO memory_lineage (
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      )
      SELECT
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      FROM memory_lineage_old;
      DROP TABLE memory_lineage_old;
    `);
  }

  if (hasTable(database, LEGACY_MEMORY_LINEAGE_TABLE)) {
    database.exec(`
      INSERT OR IGNORE INTO memory_lineage (
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      )
      SELECT
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      FROM hydra_memory_lineage
    `);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER NOT NULL,
      active_memory_id INTEGER NOT NULL UNIQUE,
      updated_at TEXT NOT NULL
    )
  `);

  const projectionTableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='active_memory_projection'"
  ).get() as { sql?: string } | undefined;
  if (projectionTableInfo?.sql && projectionTableInfo.sql.includes('FOREIGN KEY')) {
    database.exec(`
      ALTER TABLE active_memory_projection RENAME TO active_memory_projection_old;
      CREATE TABLE active_memory_projection (
        logical_key TEXT PRIMARY KEY,
        root_memory_id INTEGER NOT NULL,
        active_memory_id INTEGER NOT NULL UNIQUE,
        updated_at TEXT NOT NULL
      );
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      SELECT logical_key, root_memory_id, active_memory_id, updated_at
      FROM active_memory_projection_old;
      DROP TABLE active_memory_projection_old;
    `);
  }

  if (hasTable(database, LEGACY_ACTIVE_MEMORY_PROJECTION_TABLE)) {
    database.exec(`
      INSERT OR IGNORE INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      SELECT logical_key, root_memory_id, active_memory_id, updated_at
      FROM hydra_active_memory_projection
    `);
  }

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_logical_key
      ON memory_lineage(logical_key, version_number DESC);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_predecessor
      ON memory_lineage(predecessor_memory_id);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_root
      ON memory_lineage(root_memory_id, version_number ASC);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_valid_from
      ON memory_lineage(logical_key, valid_from DESC);
    CREATE INDEX IF NOT EXISTS idx_active_memory_projection_active
      ON active_memory_projection(active_memory_id);
  `);
}

function ensureMemoryIndexGovernanceColumns(database: Database.Database): void {
  if (!hasTable(database, 'memory_index')) {
    return;
  }

  const columnNames = getTableColumns(database, 'memory_index');

  const governanceColumns: Array<{ name: string; sql: string }> = [
    { name: 'tenant_id', sql: 'ALTER TABLE memory_index ADD COLUMN tenant_id TEXT' },
    { name: 'user_id', sql: 'ALTER TABLE memory_index ADD COLUMN user_id TEXT' },
    { name: 'agent_id', sql: 'ALTER TABLE memory_index ADD COLUMN agent_id TEXT' },
    { name: 'shared_space_id', sql: 'ALTER TABLE memory_index ADD COLUMN shared_space_id TEXT' },
    { name: 'provenance_source', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_source TEXT' },
    { name: 'provenance_actor', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_actor TEXT' },
    { name: 'governed_at', sql: 'ALTER TABLE memory_index ADD COLUMN governed_at TEXT' },
    { name: 'retention_policy', sql: "ALTER TABLE memory_index ADD COLUMN retention_policy TEXT DEFAULT 'keep'" },
    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
    { name: 'governance_metadata', sql: 'ALTER TABLE memory_index ADD COLUMN governance_metadata TEXT' },
  ];

  for (const column of governanceColumns) {
    if (columnNames.includes(column.name)) continue;
    try {
      database.exec(column.sql);
    } catch (error: unknown) {
      logDuplicateColumnMigrationSkip(column.name, error);
    }
  }
}

export function ensureGovernanceTables(database: Database.Database): void {
  ensureMemoryIndexGovernanceColumns(database);

  database.exec(`
    CREATE TABLE IF NOT EXISTS governance_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      decision TEXT NOT NULL,
      memory_id INTEGER,
      logical_key TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT,
      reason TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_governance_audit_action
      ON governance_audit(action, decision, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_governance_audit_scope
      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
  `);

  if (hasTable(database, 'memory_index')) {
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_memory_scope_hierarchy
        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
        ON memory_index(delete_after);
    `);
  }
}

export function ensureSharedSpaceTables(database: Database.Database): void {
  ensureGovernanceTables(database);

  database.exec(`
    CREATE TABLE IF NOT EXISTS shared_spaces (
      space_id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      rollout_enabled INTEGER DEFAULT 0,
      rollout_cohort TEXT,
      kill_switch INTEGER DEFAULT 0,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS shared_space_members (
      space_id TEXT NOT NULL,
      subject_type TEXT NOT NULL CHECK(subject_type IN ('user', 'agent')),
      subject_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner', 'editor', 'viewer')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (space_id, subject_type, subject_id)
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      space_id TEXT NOT NULL,
      logical_key TEXT NOT NULL,
      existing_memory_id INTEGER,
      incoming_memory_id INTEGER,
      strategy TEXT NOT NULL,
      actor TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_shared_spaces_tenant
      ON shared_spaces(tenant_id, rollout_enabled, kill_switch);
    CREATE INDEX IF NOT EXISTS idx_shared_space_members_subject
      ON shared_space_members(subject_type, subject_id, role);
    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
      ON shared_space_conflicts(space_id, created_at DESC);
  `);
}

/**
 * Validates backward compatibility expectations for the current schema.
 * Never throws; returns compatibility details for logging and rollout gates.
 */
export function validate_backward_compatibility(database: Database.Database): SchemaCompatibilityReport {
  try {
    const missingTables = REQUIRED_TABLES.filter((tableName) => !hasTable(database, tableName));
    const missingColumns: Record<string, string[]> = {};
    const missingIndexes: string[] = [];
    const constraintMismatches: string[] = [];
    const warnings: string[] = [];

    if (hasTable(database, 'memory_index')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_index'));
      const absentColumns = REQUIRED_MEMORY_INDEX_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_index = absentColumns;
      }
      if (!hasConstitutionalTierConstraint(database)) {
        constraintMismatches.push('memory_index.importance_tier CHECK constraint is missing constitutional support');
      }
    } else {
      missingColumns.memory_index = [...REQUIRED_MEMORY_INDEX_COLUMNS];
    }

    if (hasTable(database, 'memory_conflicts')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_conflicts'));
      const absentColumns = REQUIRED_MEMORY_CONFLICT_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_conflicts = absentColumns;
      }
    }

    for (const [tableName, requiredIndexes] of Object.entries(REQUIRED_INDEXES_BY_TABLE)) {
      if (!hasTable(database, tableName)) {
        continue;
      }
      for (const indexName of requiredIndexes) {
        if (!hasIndex(database, indexName)) {
          missingIndexes.push(indexName);
        }
      }
    }

    if (!hasTable(database, 'memory_history')) {
      warnings.push('memory_history table missing; historical replay functionality may be degraded.');
    }
    if (!hasTable(database, 'checkpoints')) {
      warnings.push('checkpoints table missing; migration checkpoint tooling may be unavailable.');
    }
    if (!hasTable(database, 'memory_conflicts')) {
      warnings.push('memory_conflicts table missing; conflict audit trail may be incomplete.');
    }

    const schemaVersion = safe_get_schema_version(database);
    return {
      compatible: (
        missingTables.length === 0
        && Object.keys(missingColumns).length === 0
        && missingIndexes.length === 0
        && constraintMismatches.length === 0
      ),
      schemaVersion,
      missingTables,
      missingColumns,
      missingIndexes,
      constraintMismatches,
      warnings,
    };
  } catch (error: unknown) {
    return {
      compatible: false,
      schemaVersion: null,
      missingTables: [...REQUIRED_TABLES],
      missingColumns: { memory_index: [...REQUIRED_MEMORY_INDEX_COLUMNS] },
      missingIndexes: [],
      constraintMismatches: ['compatibility inspection failed before constraint verification'],
      warnings: [
        `Compatibility check failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

export function validateLineageSchemaSupport(database: Database.Database): LineageSchemaReport {
  try {
    const missingTables = REQUIRED_LINEAGE_TABLES.filter((tableName) => !hasTable(database, tableName));
    const missingColumns: Record<string, string[]> = {};
    const warnings: string[] = [];

    for (const [tableName, requiredColumns] of Object.entries(REQUIRED_LINEAGE_COLUMNS)) {
      if (!hasTable(database, tableName)) {
        missingColumns[tableName] = [...requiredColumns];
        continue;
      }

      const existingColumns = new Set(getTableColumns(database, tableName));
      const absentColumns = requiredColumns.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns[tableName] = [...absentColumns];
      }
    }

    if (!hasTable(database, 'checkpoints')) {
      warnings.push('checkpoints table missing; rollback drills cannot be validated safely.');
    }
    if (!hasTable(database, 'memory_history')) {
      warnings.push('memory_history table missing; lineage bridge metadata will be incomplete.');
    }

    return {
      compatible: missingTables.length === 0 && Object.keys(missingColumns).length === 0,
      schemaVersion: safe_get_schema_version(database),
      missingTables,
      missingColumns,
      warnings,
    };
  } catch (error: unknown) {
    const missingColumns: Record<string, string[]> = {};
    for (const [tableName, requiredColumns] of Object.entries(REQUIRED_LINEAGE_COLUMNS)) {
      missingColumns[tableName] = [...requiredColumns];
    }
    return {
      compatible: false,
      schemaVersion: null,
      missingTables: [...REQUIRED_LINEAGE_TABLES],
      missingColumns,
      warnings: [
        `Lineage compatibility check failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

function safe_get_schema_version(database: Database.Database): number | null {
  try {
    if (!hasTable(database, 'schema_version')) {
      return null;
    }
    const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
    if (typeof row?.version === 'number' && Number.isFinite(row.version)) {
      return row.version;
    }
    return null;
  } catch (_error: unknown) {
    return null;
  }
}

/**
 * Adds legacy confidence-related columns when needed.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export function migrate_confidence_columns(database: Database.Database): void {
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
  const column_names = columns.map((c) => c.name);

  if (!column_names.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('confidence', error);
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('validation_count', error);
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('importance_tier', error);
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (error: unknown) {
      logger.warn('Index creation failed (non-critical)', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('context_type', error);
    }
  }

  if (!column_names.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('content_hash', error);
    }
  }

  if (!column_names.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('channel', error);
    }
  }

  if (!column_names.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('session_id', error);
    }
  }

  if (!column_names.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('base_importance', error);
    }
  }

  if (!column_names.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('decay_half_life_days', error);
    }
  }

  if (!column_names.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('is_pinned', error);
    }
  }

  if (!column_names.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('last_accessed', error);
    }
  }

  if (!column_names.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('expires_at', error);
    }
  }

  if (!column_names.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('related_memories', error);
    }
  }

  if (!column_names.includes('stability')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0`);
      console.warn('[vector-index] Migration: Added stability column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('stability', error);
    }
  }

  if (!column_names.includes('difficulty')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0`);
      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('difficulty', error);
    }
  }

  if (!column_names.includes('last_review')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('last_review', error);
    }
  }

  if (!column_names.includes('review_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('review_count', error);
    }
  }
}

/**
 * Ensures canonical file path columns and indexes exist.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export function ensure_canonical_file_path_support(database: Database.Database): void {
  const columns = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
  const hasCanonicalColumn = columns.some((column) => column.name === 'canonical_file_path');

  if (!hasCanonicalColumn) {
    try {
      database.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
      console.warn('[vector-index] Migration: Added canonical_file_path column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('canonical_file_path', error);
    }
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
    createRequiredIndex(
      database,
      'idx_save_parent_canonical_path',
      SAVE_PARENT_CANONICAL_PATH_INDEX_SQL,
      'ensure_canonical_file_path_support',
    );
  } catch (e: unknown) {
    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
  }

  const rowsNeedingBackfill = database.prepare(`
    SELECT id, file_path
    FROM memory_index
    WHERE canonical_file_path IS NULL OR canonical_file_path = ''
  `).all() as Array<{ id: number; file_path: string | null }>;

  if (rowsNeedingBackfill.length === 0) {
    return;
  }

  const updateCanonicalPath = database.prepare(`
    UPDATE memory_index
    SET canonical_file_path = ?
    WHERE id = ?
  `);

  let updated = 0;
  const backfillTx = database.transaction((rows: Array<{ id: number; file_path: string | null }>) => {
    for (const row of rows) {
      if (!row.file_path) {
        continue;
      }

      updateCanonicalPath.run(getCanonicalPathKey(row.file_path), row.id);
      updated++;
    }
  });

  backfillTx(rowsNeedingBackfill);

  if (updated > 0) {
    logger.info(`Migration: Backfilled canonical_file_path for ${updated} memory rows`);
  }
}

// Migrate existing database to support constitutional tier
/**
 * Checks legacy databases for constitutional tier support.
 * @param database - The database connection to inspect.
 * @returns Nothing.
 */
export function migrate_constitutional_tier(database: Database.Database): void {
  const tableSql = getTableSql(database, 'memory_index');

  if (tableSql) {
    if (tableSql.includes("'constitutional'")) {
      return;
    }

    const constitutionalCount = (database.prepare(`
      SELECT COUNT(*) as count FROM memory_index
      WHERE importance_tier = 'constitutional'
    `).get() as { count: number }).count;

    throw new Error(
      constitutionalCount > 0
        ? `Legacy memory_index importance_tier constraint is missing constitutional support and blocks ${constitutionalCount} constitutional memories`
        : 'Legacy memory_index importance_tier constraint is missing constitutional support and requires a table rebuild before startup can continue'
    );
  }
}

// P2-001: Create indexes for commonly queried columns
/**
 * Creates common indexes used by vector-index queries.
 * @param database - The database connection to update.
 * @returns Nothing.
 */
export function create_common_indexes(database: Database.Database): void {
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path)`);
    logger.info('Created idx_file_path index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_file_path',
      error: get_error_message(err),
    });
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
    createRequiredIndex(
      database,
      'idx_save_parent_canonical_path',
      SAVE_PARENT_CANONICAL_PATH_INDEX_SQL,
      'create_common_indexes',
    );
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create canonical path indexes', {
      operation: 'create_common_indexes',
      indexes: ['idx_canonical_file_path', 'idx_spec_canonical_path', 'idx_save_parent_canonical_path'],
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    createRequiredIndex(
      database,
      'idx_save_parent_content_hash_scope',
      SAVE_PARENT_CONTENT_HASH_SCOPE_INDEX_SQL,
      'create_common_indexes',
    );
    logger.info('Created idx_content_hash index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
    logger.info('Created idx_last_accessed index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_last_accessed',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
    logger.info('Created idx_importance_tier index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_importance_tier',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
      ON memory_index(embedding_status, id)
      WHERE embedding_status = 'success'
        AND trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != ''
    `);
    logger.info('Created idx_trigger_cache_source index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
      operation: 'create_common_indexes',
      index: 'idx_trigger_cache_source',
      error: get_error_message(err),
    });
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)');
    logger.info('Created idx_spec_folder_created_at index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
      operation: 'create_common_indexes',
      index: 'idx_spec_folder_created_at',
      error: get_error_message(err),
    });
  }

  // H5 FIX: Add idx_history_timestamp index for memory_history table
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
    logger.info('Created idx_history_timestamp index');
  } catch (err: unknown) {
    if (!get_error_message(err).includes('already exists')) {
      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
    }
  }
}

/**
 * Ensure companion tables exist alongside memory_index.
 */
export function ensureCompanionTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_history (
      id TEXT PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      prev_value TEXT,
      new_value TEXT,
      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      actor TEXT DEFAULT 'system'
    )
  `);

  // Migration: rebuild table when legacy constraints are detected.
  const tableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
  ).get() as { sql: string } | undefined;
  if (tableInfo?.sql && (tableInfo.sql.includes('CHECK(actor IN') || tableInfo.sql.includes('FOREIGN KEY'))) {
    database.exec(`
      ALTER TABLE memory_history RENAME TO memory_history_old;
      CREATE TABLE memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system'
      );
      INSERT INTO memory_history SELECT * FROM memory_history_old;
      DROP TABLE memory_history_old;
    `);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT
    )
  `);

  createMemoryConflictsTable(database);

  // Companion table indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_spec ON checkpoints(spec_folder);
  `);
  createMemoryConflictIndexes(database, 'ensureCompanionTables');
}

/**
 * Migrate session_state.spec_folder values using the old→new mapping
 * produced by the memory_index re-canonicalization in migration v23.
 */
function migrateSessionStateSpecFolders(
  database: Database.Database,
  updates: Array<{ canonical: string; oldSpecFolder: string }>
): void {
  if (!hasTable(database, 'session_state')) return;
  if (updates.length === 0) return;

  // Build old→new mapping, keep only unambiguous 1:1 mappings
  const mapping = new Map<string, Set<string>>();
  for (const u of updates) {
    if (!mapping.has(u.oldSpecFolder)) mapping.set(u.oldSpecFolder, new Set());
    mapping.get(u.oldSpecFolder)!.add(u.canonical);
  }

  const updateStmt = database.prepare(
    'UPDATE session_state SET spec_folder = ? WHERE session_id = ? AND spec_folder = ?'
  );

  const sessionRows = database.prepare(
    `SELECT session_id, spec_folder FROM session_state WHERE spec_folder IS NOT NULL`
  ).all() as Array<{ session_id: string; spec_folder: string }>;

  let updated = 0;
  for (const row of sessionRows) {
    const targets = mapping.get(row.spec_folder);
    if (targets && targets.size === 1) {
      const canonical = [...targets][0];
      updateStmt.run(canonical, row.session_id, row.spec_folder);
      updated++;
    } else if (targets && targets.size > 1) {
      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
    }
  }

  if (updated > 0) {
    logger.info(`Migration v23: Updated spec_folder for ${updated} session_state rows`);
  }
}

function migrateHistorySpecFolders(
  database: Database.Database,
  updates: Array<{ canonical: string; oldSpecFolder: string }>
): void {
  if (!hasTable(database, 'memory_history')) return;
  if (!getTableColumns(database, 'memory_history').includes('spec_folder')) return;
  if (updates.length === 0) return;

  const mapping = new Map<string, Set<string>>();
  for (const update of updates) {
    if (!mapping.has(update.oldSpecFolder)) {
      mapping.set(update.oldSpecFolder, new Set());
    }
    mapping.get(update.oldSpecFolder)!.add(update.canonical);
  }

  const updateStmt = database.prepare(
    'UPDATE memory_history SET spec_folder = ? WHERE rowid = ? AND spec_folder = ?'
  );
  const historyRows = database.prepare(`
    SELECT rowid AS history_rowid, spec_folder
    FROM memory_history
    WHERE spec_folder IS NOT NULL
      AND trim(spec_folder) <> ''
  `).all() as Array<{ history_rowid: number; spec_folder: string }>;

  let updatedRows = 0;
  for (const row of historyRows) {
    const targets = mapping.get(row.spec_folder);
    if (targets && targets.size === 1) {
      const canonical = [...targets][0];
      updateStmt.run(canonical, row.history_rowid, row.spec_folder);
      updatedRows++;
    } else if (targets && targets.size > 1) {
      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
    }
  }

  if (updatedRows > 0) {
    logger.info(`Migration v23: Updated spec_folder for ${updatedRows} memory_history rows`);
  }
}

// Create database schema
/**
 * Creates or upgrades the vector-index schema.
 * @param database - The database connection to initialize.
 * @param options - Schema creation options.
 * @returns Nothing.
 */
export function create_schema(
  database: Database.Database,
  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
): void {
  const { sqlite_vec_available, get_embedding_dim } = options;

  const table_exists = database.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (table_exists) {
    migrate_confidence_columns(database);
    migrate_constitutional_tier(database);
    ensure_canonical_file_path_support(database);
    create_common_indexes(database);
    ensureCompanionTables(database);
    ensureLineageTables(database);
    ensureGovernanceTables(database);
    ensureSharedSpaceTables(database);
    const compatibility = validate_backward_compatibility(database);
    if (!compatibility.compatible) {
      logger.warn(
        'Existing schema is not fully backward-compatible after bootstrap',
        compatibility as unknown as Record<string, unknown>
      );
    }
    // the rollout (REQ-S2-001) — embedding cache table must exist before any
    // Save/index operation so lookupEmbedding() can skip redundant provider calls.
    ensureEmbeddingCacheSchema(database);
    return;
  }

  // Create memory_index table (metadata only)
  database.exec(`
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
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      provenance_source TEXT,
      provenance_actor TEXT,
      governed_at TEXT,
      retention_policy TEXT DEFAULT 'keep',
      delete_after TEXT,
      governance_metadata TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      is_archived INTEGER DEFAULT 0,
      document_type TEXT DEFAULT 'memory',
      spec_level INTEGER,
      content_text TEXT,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT,
      parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,
      chunk_index INTEGER,
      chunk_label TEXT,
      encoding_intent TEXT DEFAULT 'document',
      learned_triggers TEXT DEFAULT '[]',
      interference_score REAL DEFAULT 0,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);

  // Create vec_memories virtual table (only if sqlite-vec is available)
  if (sqlite_vec_available) {
    const embedding_dim = get_embedding_dim();
    database.exec(`
      CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[${embedding_dim}]
      )
    `);
    database.exec(`
      CREATE TABLE IF NOT EXISTS vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    database.prepare(`
      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
    `).run(String(embedding_dim));
    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
  }

  // Create FTS5 virtual table (includes content_text for full-text search)
  database.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
      title, trigger_phrases, file_path, content_text,
      content='memory_index', content_rowid='id'
    )
  `);

  // Create FTS5 sync triggers (includes content_text)
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

  // Create companion tables
  ensureCompanionTables(database);
  ensureLineageTables(database);
  ensureGovernanceTables(database);
  ensureSharedSpaceTables(database);

  // the rollout (REQ-S2-001) — create embedding_cache table
  ensureEmbeddingCacheSchema(database);

  // Create memory_index-specific indexes (not IF NOT EXISTS because this is a fresh DB)
  database.exec(`
    CREATE INDEX idx_spec_folder ON memory_index(spec_folder);
    CREATE INDEX idx_created_at ON memory_index(created_at);
    CREATE INDEX idx_importance ON memory_index(importance_weight DESC);
    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
    CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
      ON memory_index(embedding_status, id)
      WHERE embedding_status = 'success'
        AND trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != '';
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_save_parent_canonical_path ON memory_index(spec_folder, canonical_file_path, id DESC)
      WHERE parent_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
      spec_folder,
      content_hash,
      embedding_status,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id,
      id DESC
    )
      WHERE parent_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
    CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms);
    CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type);
    CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder);
    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
  `);

  console.warn('[vector-index] Schema created successfully');
}

// CamelCase aliases for backward compatibility
export { ensure_schema_version as ensureSchemaVersion };
export { run_migrations as runMigrations };
export { create_schema as createSchema };
export { create_common_indexes as createCommonIndexes };
export { migrate_confidence_columns as migrateConfidenceColumns };
export { ensure_canonical_file_path_support as ensureCanonicalFilePathSupport };
export { migrate_constitutional_tier as migrateConstitutionalTier };
export { validate_backward_compatibility as validateBackwardCompatibility };
