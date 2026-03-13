import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createSchema, ensureSchemaVersion, validateLineageSchemaSupport } from '../lib/search/vector-index-schema';
import { recordHistory } from '../lib/storage/history';
import {
  getActiveMemoryProjection,
  inspectLineageChain,
  recordLineageVersion,
  resolveMemoryAsOf,
  validateLineageIntegrity,
} from '../lib/storage/lineage-state';

function insertMemory(
  database: Database.Database,
  params: {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
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
    params.updatedAt ?? params.createdAt,
    `${params.title} body`,
  );
}

describe('Memory lineage state', () => {
  let database: Database.Database;

  beforeEach(() => {
    database = new Database(':memory:');
    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });
    ensureSchemaVersion(database);
  });

  afterEach(() => {
    database.close();
  });

  it('records append-first versions and resolves active plus asOf reads deterministically', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/lineage.md';
    insertMemory(database, {
      id: 1,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Version 1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
    recordLineageVersion(database, {
      memoryId: 1,
      effectiveAt: '2026-03-13T08:00:00.000Z',
      actor: 'mcp:memory_save',
    });

    insertMemory(database, {
      id: 2,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Version 2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
    recordLineageVersion(database, {
      memoryId: 2,
      predecessorMemoryId: 1,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      actor: 'mcp:memory_save',
      transitionEvent: 'SUPERSEDE',
    });

    const projection = getActiveMemoryProjection(database, { memoryId: 1 });
    expect(projection?.memoryId).toBe(2);
    expect(projection?.versionNumber).toBe(2);

    const beforeSupersede = resolveMemoryAsOf(database, {
      memoryId: 2,
      asOf: '2026-03-13T08:30:00.000Z',
    });
    const afterSupersede = resolveMemoryAsOf(database, {
      memoryId: 2,
      asOf: '2026-03-13T09:30:00.000Z',
    });
    expect(beforeSupersede?.memoryId).toBe(1);
    expect(afterSupersede?.memoryId).toBe(2);

    const chain = inspectLineageChain(database, 2);
    expect(chain.map((version) => version.versionNumber)).toEqual([1, 2]);
    expect(chain[0]?.snapshot.id).toBe(1);

    const predecessorTier = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = 1
    `).get() as { importance_tier: string };
    expect(predecessorTier.importance_tier).toBe('deprecated');
  });

  it('validates lineage schema support for phase 2 tables', () => {
    const report = validateLineageSchemaSupport(database);
    expect(report.compatible).toBe(true);
    expect(report.missingTables).toEqual([]);
    expect(report.missingColumns).toEqual({});
  });

  it('detects malformed predecessor chains and projection drift', () => {
    insertMemory(database, {
      id: 10,
      specFolder: 'specs/015-memory-state',
      filePath: '/tmp/a.md',
      title: 'Broken v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 11,
      specFolder: 'specs/015-memory-state',
      filePath: '/tmp/a.md',
      title: 'Broken v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    database.pragma('foreign_keys = OFF');
    database.exec(`
      INSERT INTO memory_lineage (
        memory_id,
        logical_key,
        version_number,
        root_memory_id,
        predecessor_memory_id,
        superseded_by_memory_id,
        valid_from,
        valid_to,
        transition_event,
        actor,
        metadata
      ) VALUES
        (10, 'specs/015-memory-state::/tmp/a.md', 1, 10, NULL, NULL, '2026-03-13T08:00:00.000Z', NULL, 'CREATE', 'test', '{}'),
        (11, 'specs/015-memory-state::/tmp/a.md', 2, 10, 999, NULL, '2026-03-13T09:00:00.000Z', NULL, 'SUPERSEDE', 'test', '{}')
    `);
    database.exec(`
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      VALUES ('specs/015-memory-state::/tmp/a.md::projection-mismatch', 10, 10, '2026-03-13T09:00:00.000Z')
    `);
    database.pragma('foreign_keys = ON');

    const report = validateLineageIntegrity(database);
    expect(report.valid).toBe(false);
    expect(report.missingPredecessors).toContain(11);
    expect(report.duplicateActiveLogicalKeys).toContain('specs/015-memory-state::/tmp/a.md');
    expect(report.projectionMismatches).toContain('specs/015-memory-state::/tmp/a.md::projection-mismatch');
  });
});
