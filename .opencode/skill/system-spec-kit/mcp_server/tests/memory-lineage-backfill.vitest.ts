import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
import { runLineageBackfill, summarizeLineageInspection } from '../lib/storage/lineage-state';
import { runCreateCheckpoint } from '../scripts/migrations/create-checkpoint';
import { runRestoreCheckpoint } from '../scripts/migrations/restore-checkpoint';

function insertMemory(
  database: Database.Database,
  params: {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    createdAt: string;
  },
): void {
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
      context_type,
      content_text
    ) VALUES (?, ?, ?, ?, ?, '[]', 0.5, ?, ?, 'pending', 'normal', 'general', ?)
  `).run(
    params.id,
    params.specFolder,
    params.filePath,
    params.filePath,
    params.title,
    params.createdAt,
    params.createdAt,
    `${params.title} body`,
  );
}

describe('Memory lineage backfill', () => {
  let tempDir = '';
  let dbPath = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-lineage-backfill-'));
    dbPath = path.join(tempDir, 'context-index.sqlite');
    const database = new Database(dbPath);
    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });
    ensureSchemaVersion(database);

    insertMemory(database, {
      id: 1,
      specFolder: 'specs/015-memory-state',
      filePath: '/tmp/specs/015-memory-state/memory/alpha.md',
      title: 'Alpha v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 2,
      specFolder: 'specs/015-memory-state',
      filePath: '/tmp/specs/015-memory-state/memory/alpha.md',
      title: 'Alpha v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 3,
      specFolder: 'specs/015-memory-state',
      filePath: '/tmp/specs/015-memory-state/memory/beta.md',
      title: 'Beta v1',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    database.close();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('supports dry-run planning, idempotent backfill, and checkpoint rollback drills', () => {
    let database = new Database(dbPath);
    const checkpoint = runCreateCheckpoint({
      dbPath,
      outputDir: path.join(tempDir, 'checkpoints'),
      name: 'pre-lineage-backfill',
      note: 'phase-2 rollback drill',
      json: false,
    });

    const dryRun = runLineageBackfill(database, { dryRun: true });
    expect(dryRun.dryRun).toBe(true);
    expect(dryRun.totalGroups).toBe(2);
    expect(dryRun.scanned).toBe(3);
    expect(dryRun.seeded).toBe(3);
    expect(dryRun.skipped).toBe(0);

    const beforeBackfill = database.prepare(`
      SELECT COUNT(*) AS total
      FROM memory_lineage
    `).get() as { total: number };
    expect(beforeBackfill.total).toBe(0);

    const executed = runLineageBackfill(database);
    expect(executed.dryRun).toBe(false);
    expect(executed.seeded).toBe(3);
    expect(executed.skipped).toBe(0);

    const summary = summarizeLineageInspection(database, 2);
    expect(summary).toMatchObject({
      logicalKey: 'specs/015-memory-state::/tmp/specs/015-memory-state/memory/alpha.md::_',
      rootMemoryId: 1,
      activeMemoryId: 2,
      activeVersionNumber: 2,
      totalVersions: 2,
      versionNumbers: [1, 2],
      historicalMemoryIds: [1],
      transitionCounts: {
        CREATE: 0,
        UPDATE: 0,
        SUPERSEDE: 0,
        BACKFILL: 2,
      },
      hasVersionGaps: false,
      hasMultipleActiveVersions: false,
    });

    const afterBackfill = database.prepare(`
      SELECT COUNT(*) AS total
      FROM memory_lineage
    `).get() as { total: number };
    expect(afterBackfill.total).toBe(3);

    const rerun = runLineageBackfill(database);
    expect(rerun.seeded).toBe(0);
    expect(rerun.skipped).toBe(3);

    database.close();

    runRestoreCheckpoint({
      checkpointPath: checkpoint.checkpointPath,
      dbPath,
      backupDir: path.join(tempDir, 'restore-backups'),
      force: true,
      json: false,
    });

    database = new Database(dbPath, { readonly: true });
    const restoredLineage = database.prepare(`
      SELECT COUNT(*) AS total
      FROM memory_lineage
    `).get() as { total: number };
    const restoredProjection = database.prepare(`
      SELECT COUNT(*) AS total
      FROM active_memory_projection
    `).get() as { total: number };
    expect(restoredLineage.total).toBe(0);
    expect(restoredProjection.total).toBe(0);
    database.close();
  });
});
