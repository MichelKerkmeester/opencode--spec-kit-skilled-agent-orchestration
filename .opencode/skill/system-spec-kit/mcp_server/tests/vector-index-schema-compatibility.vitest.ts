import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { validateBackwardCompatibility } from '../lib/search/vector-index-schema';

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
        INSERT INTO schema_version (id, version, updated_at) VALUES (1, 21, datetime('now'));

        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT,
          file_path TEXT,
          importance_tier TEXT,
          context_type TEXT,
          session_id TEXT,
          created_at TEXT,
          updated_at TEXT
        );

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
          created_at TEXT
        );
      `);

      const report = validateBackwardCompatibility(db);
      expect(report.compatible).toBe(true);
      expect(report.schemaVersion).toBe(21);
      expect(report.missingTables).toEqual([]);
      expect(report.missingColumns).toEqual({});
      expect(report.warnings).toEqual([]);
    } finally {
      db.close();
    }
  });
});
