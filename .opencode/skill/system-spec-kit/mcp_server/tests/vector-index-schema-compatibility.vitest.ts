import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { SCHEMA_VERSION, validateBackwardCompatibility } from '../lib/search/vector-index-schema';

describe('Vector index schema compatibility validator', () => {
  it('reports missing core tables on an empty database', () => {
    const db = new Database(':memory:');
    try {
      const report = validateBackwardCompatibility(db);
      expect(report.compatible).toBe(false);
      expect(report.missingTables).toEqual(['memory_index', 'schema_version']);
      expect(report.missingColumns.memory_index).toContain('spec_folder');
    } finally {
      db.close();
    }
  });

  it('accepts a minimally compatible schema footprint', () => {
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE schema_version (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          version INTEGER NOT NULL,
          updated_at TEXT
        );
        INSERT INTO schema_version (id, version, updated_at) VALUES (1, ${SCHEMA_VERSION}, datetime('now'));

        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT,
          file_path TEXT,
          importance_tier TEXT CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
          context_type TEXT,
          session_id TEXT,
          content_hash TEXT,
          embedding_status TEXT,
          tenant_id TEXT,
          user_id TEXT,
          agent_id TEXT,
          shared_space_id TEXT,
          parent_id INTEGER,
          canonical_file_path TEXT,
          created_at TEXT,
          updated_at TEXT,
          stability REAL,
          difficulty REAL,
          last_review TEXT,
          document_type TEXT,
          quality_score REAL
        );
        CREATE INDEX idx_stability ON memory_index(stability DESC);
        CREATE INDEX idx_last_review ON memory_index(last_review);
        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
        CREATE INDEX idx_document_type ON memory_index(document_type);
        CREATE INDEX idx_doc_type_folder ON memory_index(document_type, spec_folder);
        CREATE INDEX idx_quality_score ON memory_index(quality_score);
        CREATE INDEX idx_save_parent_content_hash_scope
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
          WHERE parent_id IS NULL;
        CREATE INDEX idx_save_parent_canonical_path
          ON memory_index(spec_folder, canonical_file_path, id DESC)
          WHERE parent_id IS NULL;

        CREATE TABLE memory_history (
          id INTEGER PRIMARY KEY,
          memory_id INTEGER,
          timestamp TEXT
        );

        CREATE TABLE checkpoints (
          id INTEGER PRIMARY KEY,
          name TEXT,
          created_at TEXT
        );

        CREATE TABLE memory_conflicts (
          id INTEGER PRIMARY KEY,
          timestamp TEXT,
          action TEXT,
          new_memory_hash TEXT,
          new_memory_id INTEGER,
          existing_memory_id INTEGER,
          similarity REAL,
          reason TEXT,
          new_content_preview TEXT,
          existing_content_preview TEXT,
          contradiction_detected INTEGER,
          contradiction_type TEXT,
          spec_folder TEXT,
          created_at TEXT
        );
        CREATE INDEX idx_conflicts_memory ON memory_conflicts(existing_memory_id);
        CREATE INDEX idx_conflicts_timestamp ON memory_conflicts(timestamp DESC);
      `);

      const report = validateBackwardCompatibility(db);
      expect(report.compatible).toBe(true);
      expect(report.schemaVersion).toBe(SCHEMA_VERSION);
      expect(report.missingTables).toEqual([]);
      expect(report.missingColumns).toEqual({});
      expect(report.missingIndexes).toEqual([]);
      expect(report.constraintMismatches).toEqual([]);
      expect(report.warnings).toEqual([]);
    } finally {
      db.close();
    }
  });
});
