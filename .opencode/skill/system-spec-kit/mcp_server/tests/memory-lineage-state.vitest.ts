import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSchema, ensureSchemaVersion, validateLineageSchemaSupport } from '../lib/search/vector-index-schema';
import { recordHistory } from '../lib/storage/history';
import {
  benchmarkLineageWritePath,
  getActiveMemoryProjection,
  getActiveProjectionRow,
  getLatestLineageForMemory,
  inspectLineageChain,
  recordLineageVersion,
  resolveActiveLineageSnapshot,
  resolveLineageAsOf,
  resolveMemoryAsOf,
  summarizeLineageInspection,
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
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
    sharedSpaceId?: string | null;
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
      content_text,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id
    ) VALUES (?, ?, ?, ?, ?, '[]', 0.5, ?, ?, 'pending', 'normal', 'general', ?, ?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.specFolder,
    params.filePath,
    params.filePath,
    params.title,
    params.createdAt,
    params.updatedAt ?? params.createdAt,
    `${params.title} body`,
    params.tenantId ?? null,
    params.userId ?? null,
    params.agentId ?? null,
    params.sessionId ?? null,
    params.sharedSpaceId ?? null,
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

    const activeSnapshot = resolveActiveLineageSnapshot(database, 1);
    const directAsOfSnapshot = resolveLineageAsOf(database, 2, '2026-03-13T09:30:00.000Z');
    expect(activeSnapshot?.memoryId).toBe(2);
    expect(activeSnapshot?.snapshot.id).toBe(2);
    expect(directAsOfSnapshot?.memoryId).toBe(2);
    expect(directAsOfSnapshot?.snapshot.id).toBe(2);

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

  it('derives distinct logical keys for memories that only differ by tenant scope', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/scoped-tenant.md';
    insertMemory(database, {
      id: 61,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Tenant A',
      createdAt: '2026-03-13T11:00:00.000Z',
      tenantId: 'tenant-a',
    });
    insertMemory(database, {
      id: 62,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Tenant B',
      createdAt: '2026-03-13T11:05:00.000Z',
      tenantId: 'tenant-b',
    });

    const tenantA = recordLineageVersion(database, {
      memoryId: 61,
      actor: 'ops:tenant-scope',
      effectiveAt: '2026-03-13T11:00:00.000Z',
    });
    const tenantB = recordLineageVersion(database, {
      memoryId: 62,
      actor: 'ops:tenant-scope',
      effectiveAt: '2026-03-13T11:05:00.000Z',
    });

    expect(tenantA.logicalKey).not.toBe(tenantB.logicalKey);
    expect(tenantA.logicalKey).toContain('scope-sha256:');
    expect(tenantB.logicalKey).toContain('scope-sha256:');

    const projectionCount = database.prepare(`
      SELECT COUNT(*) AS total
      FROM active_memory_projection
      WHERE logical_key IN (?, ?)
    `).get(tenantA.logicalKey, tenantB.logicalKey) as { total: number };
    expect(projectionCount.total).toBe(2);
  });

  it('derives distinct logical keys for memories that only differ by user scope', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/scoped-user.md';
    insertMemory(database, {
      id: 71,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'User A',
      createdAt: '2026-03-13T12:00:00.000Z',
      tenantId: 'tenant-a',
      userId: 'user-a',
    });
    insertMemory(database, {
      id: 72,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'User B',
      createdAt: '2026-03-13T12:05:00.000Z',
      tenantId: 'tenant-a',
      userId: 'user-b',
    });

    const userA = recordLineageVersion(database, {
      memoryId: 71,
      actor: 'ops:user-scope',
      effectiveAt: '2026-03-13T12:00:00.000Z',
    });
    const userB = recordLineageVersion(database, {
      memoryId: 72,
      actor: 'ops:user-scope',
      effectiveAt: '2026-03-13T12:05:00.000Z',
    });

    expect(userA.logicalKey).not.toBe(userB.logicalKey);
    expect(userA.versionNumber).toBe(1);
    expect(userB.versionNumber).toBe(1);
  });

  it('preserves the legacy logical key format for unscoped memories', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/unscoped.md';
    insertMemory(database, {
      id: 81,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Unscoped v1',
      createdAt: '2026-03-13T13:00:00.000Z',
    });

    const recorded = recordLineageVersion(database, {
      memoryId: 81,
      actor: 'ops:unscoped-compat',
      effectiveAt: '2026-03-13T13:00:00.000Z',
    });

    expect(recorded.logicalKey).toBe('specs/015-memory-state::/tmp/specs/015-memory-state/memory/unscoped.md::_');
  });

  it('builds an operator-facing lineage summary for append-first chains', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/summary.md';
    insertMemory(database, {
      id: 21,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Summary v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 22,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Summary v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 23,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Summary v3',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    recordLineageVersion(database, {
      memoryId: 21,
      actor: 'ops:lineage-summary',
      effectiveAt: '2026-03-13T08:00:00.000Z',
    });
    recordLineageVersion(database, {
      memoryId: 22,
      actor: 'ops:lineage-summary',
      predecessorMemoryId: 21,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });
    recordLineageVersion(database, {
      memoryId: 23,
      actor: 'ops:lineage-summary',
      predecessorMemoryId: 22,
      effectiveAt: '2026-03-13T10:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });

    const summary = summarizeLineageInspection(database, 23);
    expect(summary).toMatchObject({
      logicalKey: 'specs/015-memory-state::/tmp/specs/015-memory-state/memory/summary.md::_',
      rootMemoryId: 21,
      activeMemoryId: 23,
      activeVersionNumber: 3,
      totalVersions: 3,
      versionNumbers: [1, 2, 3],
      historicalMemoryIds: [21, 22],
      firstValidFrom: '2026-03-13T08:00:00.000Z',
      latestValidFrom: '2026-03-13T10:00:00.000Z',
      actors: ['ops:lineage-summary'],
      transitionCounts: {
        CREATE: 1,
        UPDATE: 0,
        SUPERSEDE: 2,
        BACKFILL: 0,
      },
      hasVersionGaps: false,
      hasMultipleActiveVersions: false,
    });
  });

  it('resolves lineage reads from any chain member even when the active projection row is missing', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/projection-fallback.md';
    insertMemory(database, {
      id: 91,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Projection fallback v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 92,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Projection fallback v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 93,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Projection fallback v3',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    recordLineageVersion(database, {
      memoryId: 91,
      actor: 'ops:projection-fallback',
      effectiveAt: '2026-03-13T08:00:00.000Z',
    });
    recordLineageVersion(database, {
      memoryId: 92,
      actor: 'ops:projection-fallback',
      predecessorMemoryId: 91,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });
    recordLineageVersion(database, {
      memoryId: 93,
      actor: 'ops:projection-fallback',
      predecessorMemoryId: 92,
      effectiveAt: '2026-03-13T10:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });

    database.prepare('DELETE FROM active_memory_projection WHERE root_memory_id = ?').run(91);

    const chain = inspectLineageChain(database, 92);
    const summary = summarizeLineageInspection(database, 92);
    const projectionRow = getActiveProjectionRow(database, 92);
    const latestRow = getLatestLineageForMemory(database, 92);
    const activeSnapshot = resolveActiveLineageSnapshot(database, 92);
    const asOfSnapshot = resolveLineageAsOf(database, 92, '2026-03-13T09:30:00.000Z');

    expect(chain.map((version) => version.memoryId)).toEqual([91, 92, 93]);
    expect(summary).toMatchObject({
      rootMemoryId: 91,
      activeMemoryId: 93,
      activeVersionNumber: 3,
      totalVersions: 3,
    });
    expect(projectionRow).toBeNull();
    expect(latestRow?.memory_id).toBe(93);
    expect(activeSnapshot?.memoryId).toBe(93);
    expect(activeSnapshot?.snapshot.id).toBe(93);
    expect(asOfSnapshot?.memoryId).toBe(92);
    expect(asOfSnapshot?.snapshot.id).toBe(92);
  });

  it('benchmarks ordered lineage writes with final projection details', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/benchmark.md';
    insertMemory(database, {
      id: 31,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Benchmark v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 32,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Benchmark v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 33,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Benchmark v3',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    const benchmark = benchmarkLineageWritePath(database, {
      memoryIds: [31, 32, 33],
      actor: 'ops:lineage-benchmark',
    });

    expect(benchmark.iterations).toBe(3);
    expect(benchmark.insertedVersions).toBe(3);
    expect(benchmark.rootMemoryId).toBe(31);
    expect(benchmark.activeMemoryId).toBe(33);
    expect(benchmark.finalVersionNumber).toBe(3);
    expect(benchmark.logicalKey).toBe('specs/015-memory-state::/tmp/specs/015-memory-state/memory/benchmark.md::_');
    expect(benchmark.durationMs).toBeGreaterThanOrEqual(0);
    expect(benchmark.averageWriteMs).toBeGreaterThanOrEqual(0);

    const projection = getActiveMemoryProjection(database, { memoryId: 31 });
    expect(projection?.memoryId).toBe(33);
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

  it('rejects invalid transition event and predecessor combinations before persistence', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/validation.md';
    insertMemory(database, {
      id: 41,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Validation v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 42,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Validation v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 43,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Validation v3',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    recordLineageVersion(database, {
      memoryId: 41,
      actor: 'ops:lineage-validation',
      effectiveAt: '2026-03-13T08:00:00.000Z',
      transitionEvent: 'CREATE',
    });

    expect(() => recordLineageVersion(database, {
      memoryId: 42,
      actor: 'ops:lineage-validation',
      predecessorMemoryId: 41,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      transitionEvent: 'CREATE',
    })).toThrow(/CREATE transition must not specify a predecessor/);

    expect(() => recordLineageVersion(database, {
      memoryId: 43,
      actor: 'ops:lineage-validation',
      effectiveAt: '2026-03-13T10:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    })).toThrow(/SUPERSEDE transition requires a predecessor/);

    const lineageCount = database.prepare('SELECT COUNT(*) AS count FROM memory_lineage').get() as { count: number };
    expect(lineageCount.count).toBe(1);
  });

  it('rejects backwards valid_from timestamps and warns when a predecessor is already superseded', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/timestamps.md';
    insertMemory(database, {
      id: 51,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Timestamps v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 52,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Timestamps v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 53,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Timestamps v3',
      createdAt: '2026-03-13T10:00:00.000Z',
    });

    recordLineageVersion(database, {
      memoryId: 51,
      actor: 'ops:lineage-validation',
      effectiveAt: '2026-03-13T08:00:00.000Z',
      transitionEvent: 'CREATE',
    });

    expect(() => recordLineageVersion(database, {
      memoryId: 52,
      actor: 'ops:lineage-validation',
      predecessorMemoryId: 51,
      effectiveAt: '2026-03-13T07:30:00.000Z',
      transitionEvent: 'SUPERSEDE',
    })).toThrow(/is earlier than predecessor valid_from/);

    recordLineageVersion(database, {
      memoryId: 52,
      actor: 'ops:lineage-validation',
      predecessorMemoryId: 51,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });

    database.prepare(`
      UPDATE memory_lineage
      SET valid_to = ?
      WHERE memory_id = 52
    `).run('2026-03-13T09:30:00.000Z');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let warned = false;
    try {
      recordLineageVersion(database, {
        memoryId: 53,
        actor: 'ops:lineage-validation',
        predecessorMemoryId: 52,
        effectiveAt: '2026-03-13T10:00:00.000Z',
        transitionEvent: 'UPDATE',
      });
      warned = errorSpy.mock.calls.some((call) => String(call[0]).includes('already superseded'));
    } finally {
      errorSpy.mockRestore();
    }

    expect(warned).toBe(true);

    const predecessorRow = database.prepare(`
      SELECT valid_to, superseded_by_memory_id
      FROM memory_lineage
      WHERE memory_id = 52
    `).get() as { valid_to: string | null; superseded_by_memory_id: number | null };
    expect(predecessorRow.valid_to).toBe('2026-03-13T09:30:00.000Z');
    expect(predecessorRow.superseded_by_memory_id).toBe(53);
  });

  it('retries version assignment when another supersede already claimed the next version', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/concurrent-supersede.md';
    insertMemory(database, {
      id: 91,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Concurrent v1',
      createdAt: '2026-03-13T08:00:00.000Z',
    });
    insertMemory(database, {
      id: 92,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Concurrent v2',
      createdAt: '2026-03-13T09:00:00.000Z',
    });
    insertMemory(database, {
      id: 93,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Concurrent v3',
      createdAt: '2026-03-13T09:30:00.000Z',
    });

    recordLineageVersion(database, {
      memoryId: 91,
      actor: 'ops:lineage-retry',
      effectiveAt: '2026-03-13T08:00:00.000Z',
      transitionEvent: 'CREATE',
    });
    recordLineageVersion(database, {
      memoryId: 92,
      actor: 'ops:lineage-retry',
      predecessorMemoryId: 91,
      effectiveAt: '2026-03-13T09:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });

    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const recorded = recordLineageVersion(database, {
        memoryId: 93,
        actor: 'ops:lineage-retry',
        predecessorMemoryId: 91,
        effectiveAt: '2026-03-13T09:30:00.000Z',
        transitionEvent: 'SUPERSEDE',
      });

      expect(recorded.versionNumber).toBe(3);
      expect(recorded.predecessorMemoryId).toBe(91);
      expect(
        warnSpy.mock.calls.some((call) => String(call[0]).includes('Retrying lineage insert for memory 93')),
      ).toBe(true);
    } finally {
      warnSpy.mockRestore();
    }

    const versions = database.prepare(`
      SELECT memory_id, version_number, predecessor_memory_id
      FROM memory_lineage
      WHERE logical_key = ?
      ORDER BY version_number ASC
    `).all('specs/015-memory-state::/tmp/specs/015-memory-state/memory/concurrent-supersede.md::_') as Array<{
      memory_id: number;
      version_number: number;
      predecessor_memory_id: number | null;
    }>;
    expect(versions).toEqual([
      { memory_id: 91, version_number: 1, predecessor_memory_id: null },
      { memory_id: 92, version_number: 2, predecessor_memory_id: 91 },
      { memory_id: 93, version_number: 3, predecessor_memory_id: 91 },
    ]);
  });
});
