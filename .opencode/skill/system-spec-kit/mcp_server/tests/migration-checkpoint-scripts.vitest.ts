import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { runCreateCheckpoint } from '../scripts/migrations/create-checkpoint';
import { runRestoreCheckpoint } from '../scripts/migrations/restore-checkpoint';

function createFixtureDb(dbPath: string): void {
  const db = new Database(dbPath);
  try {
    db.exec(`
      CREATE TABLE schema_version (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        version INTEGER NOT NULL
      );
      INSERT INTO schema_version (id, version) VALUES (1, 21);

      CREATE TABLE demo (
        id INTEGER PRIMARY KEY,
        value TEXT NOT NULL
      );
      INSERT INTO demo (id, value) VALUES (1, 'before');
    `);
  } finally {
    db.close();
  }
}

describe('Migration checkpoint scripts', () => {
  let tempDir = '';
  let dbPath = '';
  let outputDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-roadmap-checkpoint-'));
    dbPath = path.join(tempDir, 'context-index.sqlite');
    outputDir = path.join(tempDir, 'checkpoints');
    createFixtureDb(dbPath);
  });

  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_ROADMAP_PHASE;
    delete process.env.SPECKIT_MEMORY_GRAPH_UNIFIED;
    delete process.env.SPECKIT_ROLLOUT_PERCENT;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates a checkpoint plus memory-roadmap metadata sidecar', () => {
    process.env.SPECKIT_MEMORY_ROADMAP_PHASE = 'graph';
    process.env.SPECKIT_MEMORY_GRAPH_UNIFIED = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    const result = runCreateCheckpoint({
      dbPath,
      outputDir,
      name: 'Memory Graph',
      note: 'phase-1 verification',
      json: false,
    });

    expect(fs.existsSync(result.checkpointPath)).toBe(true);
    expect(fs.existsSync(result.metadataPath)).toBe(true);
    expect(result.schemaVersion).toBe(21);

    const metadata = JSON.parse(fs.readFileSync(result.metadataPath, 'utf8')) as {
      phase: string;
      capabilities: { graphUnified: boolean };
      note: string | null;
    };
    expect(metadata.phase).toBe('graph');
    expect(metadata.capabilities.graphUnified).toBe(true);
    expect(metadata.note).toBe('phase-1 verification');
  });

  it('restores a checkpoint and creates a backup when overwriting an existing db', () => {
    const checkpoint = runCreateCheckpoint({
      dbPath,
      outputDir,
      name: 'restore-me',
      note: null,
      json: false,
    });

    const mutated = new Database(dbPath);
    try {
      mutated.prepare(`UPDATE demo SET value = 'after' WHERE id = 1`).run();
    } finally {
      mutated.close();
    }

    const restore = runRestoreCheckpoint({
      checkpointPath: checkpoint.checkpointPath,
      dbPath,
      backupDir: path.join(tempDir, 'restore-backups'),
      force: true,
      json: false,
    });

    expect(restore.backupPath).not.toBeNull();
    expect(restore.backupPath && fs.existsSync(restore.backupPath)).toBe(true);

    const restoredDb = new Database(dbPath, { readonly: true });
    try {
      const row = restoredDb.prepare(`SELECT value FROM demo WHERE id = 1`).get() as { value: string };
      expect(row.value).toBe('before');
    } finally {
      restoredDb.close();
    }
  });
});
