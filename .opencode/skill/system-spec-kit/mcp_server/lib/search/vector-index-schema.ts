// ---------------------------------------------------------------
// MODULE: Vector Index Schema
// ---------------------------------------------------------------
// Split from vector-index-store.ts — contains ALL schema creation,
// migration, and companion-table logic.

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import { getCanonicalPathKey } from '../utils/canonical-path';
import { createLogger } from '../utils/logger';
import { initEmbeddingCache } from '../cache/embedding-cache';
import {
  get_error_message,
} from './vector-index-types';
import { init as initHistory } from '../storage/history';
import { getSpecsBasePaths } from './folder-discovery';

const logger = createLogger('VectorIndex');

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
// v5: Added memory_type column for type-specific half-lives (REQ-002)
// v6: Added file_mtime_ms for incremental indexing fast-path (REQ-023, T064-T066)
// v7: Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
// v8: Added causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
// v9: Added memory_corrections table for learning from corrections (REQ-015, REQ-026, T052-T055)
// v10: Schema consolidation and index optimization
// v11: Error code deduplication and validation improvements
// v12: Unified memory_conflicts DDL (KL-1 Schema Unification)
// v13: Add document_type and spec_level columns for full spec folder document indexing (Spec 126)
// v14: Add content_text column + FTS5 rebuild for BM25 full-text search across restarts
// v15: Add quality_score and quality_flags columns for memory quality gates
// v16: Add parent_id column for chunked indexing of large files (010-index-large-files)
// v17: Add interference_score column for TM-01 (Sprint 2)
// v18: Sprint 6 — weight_history table + causal_edges provenance + encoding_intent column
// v19: degree_snapshots + community_assignments (N2 graph centrality)
// v20: memory_summaries + memory_entities + entity_catalog (R8/R10/S5)
// v21: Add learned_triggers column (R11 learned feedback)
/** Current schema version for vector-index migrations. */
export const SCHEMA_VERSION = 21;

// AI-TRACE: Run schema migrations from one version to another
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
      // v0 -> v1: Initial schema (already exists via create_schema)
    },
    2: () => {
      // v1 -> v2: Add idx_history_timestamp index
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
      // v2 -> v3: Add related_memories column
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
      // v3 -> v4: Add FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
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

      // Create memory_conflicts table for prediction error gating audit
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_conflicts (
            id INTEGER PRIMARY KEY,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            new_memory_hash TEXT NOT NULL,
            existing_memory_id INTEGER,
            similarity_score REAL,
            action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
            contradiction_detected INTEGER DEFAULT 0,
            notes TEXT,
            FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v4: Created memory_conflicts table');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v4 warning (memory_conflicts):', get_error_message(e));
        }
      }

      // Create indexes for FSRS columns
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)');
        logger.info('Migration v4: Created FSRS indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v4 warning (indexes):', get_error_message(e));
      }
    },
    5: () => {
      // v4 -> v5: Add memory_type column for type-specific half-lives (REQ-002, T006)
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
      // v5 -> v6: Add file_mtime_ms for incremental indexing (REQ-023, T064-T066)
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
      // v6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
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
      // v7 -> v8: Create causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
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
      // v8 -> v9: Create memory_corrections table for Learning from Corrections
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
      // v11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
      try {
        database.exec(`
          DROP TABLE IF EXISTS memory_conflicts;
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
        logger.info('Migration v12: Unified memory_conflicts table (KL-1)');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v12 warning (memory_conflicts):', get_error_message(e));
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)');
        logger.info('Migration v12: Created memory_conflicts indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v12 warning (indexes):', get_error_message(e));
      }
    },
    13: () => {
      // v12 -> v13: Add document_type and spec_level for full spec folder document indexing
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

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)');
        logger.info('Migration v13: Created document_type indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v13 warning (indexes):', get_error_message(e));
      }

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

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score)');
        logger.info('Migration v15: Created quality score index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v15 warning (idx_quality_score):', get_error_message(e));
      }
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

  // v20 -> v21: Add learned_triggers column (R11 learned feedback)
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

  // AI-TRACE: BUG-019 FIX: Wrap all migrations in a transaction for atomicity
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

// AI-GUARD: Ensure schema version table exists and run any pending migrations
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

  if (current_version < SCHEMA_VERSION) {
    logger.info(`Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
    run_migrations(database, current_version, SCHEMA_VERSION);

    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);

    logger.info(`Schema migration complete: v${SCHEMA_VERSION}`);
  }

  return current_version;
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
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (_e: unknown) {
      console.warn('[vector-index-schema] Index creation failed (non-critical)', { error: _e instanceof Error ? _e.message : String(_e) });
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('stability')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0`);
      console.warn('[vector-index] Migration: Added stability column (FSRS)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('difficulty')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0`);
      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('last_review')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('review_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) throw e;
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
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) {
        throw e;
      }
    }
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
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
  const table_info = database.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get() as { sql?: string } | undefined;

  if (table_info && table_info.sql) {
    if (table_info.sql.includes("'constitutional'")) {
      return;
    }

    const constitutional_count = (database.prepare(`
      SELECT COUNT(*) as count FROM memory_index
      WHERE importance_tier = 'constitutional'
    `).get() as { count: number }).count;

    if (constitutional_count > 0) {
      console.warn(`[vector-index] Found ${constitutional_count} constitutional memories`);
    }

    console.warn('[vector-index] Migration: Constitutional tier available');
    console.warn('[vector-index] Note: For existing databases, constitutional tier may require manual schema update');
    console.warn('[vector-index] New databases will have the updated constraint automatically');
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
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create canonical path indexes', {
      operation: 'create_common_indexes',
      indexes: ['idx_canonical_file_path', 'idx_spec_canonical_path'],
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    logger.info('Created idx_content_hash index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_content_hash',
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

  // Companion table indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_spec ON checkpoints(spec_folder);
    CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id);
    CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC);
  `);
}

// Create database schema
/**
 * Creates or upgrades the vector-index schema.
 * @param database - The database connection to initialize.
 * @param options - Schema creation options.
 * @returns Nothing.
 */
export function create_schema(database: Database.Database, options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }) {
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
    initHistory(database);
    // AI-WHY: Sprint 2 (REQ-S2-001) — embedding cache table must exist before any
    // save/index operation so lookupEmbedding() can skip redundant provider calls.
    initEmbeddingCache(database);
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
      session_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'decision', 'discovery', 'general')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
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
  initHistory(database);

  // AI-WHY: Sprint 2 (REQ-S2-001) — create embedding_cache table
  initEmbeddingCache(database);

  // AI-WHY: Create memory_index-specific indexes (not IF NOT EXISTS because this is a fresh DB)
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
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
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

// AI-WHY: camelCase aliases for backward compatibility
export { ensure_schema_version as ensureSchemaVersion };
export { run_migrations as runMigrations };
export { create_schema as createSchema };
export { create_common_indexes as createCommonIndexes };
export { migrate_confidence_columns as migrateConfidenceColumns };
export { ensure_canonical_file_path_support as ensureCanonicalFilePathSupport };
export { migrate_constitutional_tier as migrateConstitutionalTier };
