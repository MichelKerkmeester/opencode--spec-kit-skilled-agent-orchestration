// ───────────────────────────────────────────────────────────────
// TESTS: Governance E2E
// ───────────────────────────────────────────────────────────────
// Scoped governance isolation, retention behavior, and audit review.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  ensureGovernanceRuntime,
  filterRowsByScope,
  recordGovernanceAudit,
  reviewGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance';
import { runRetentionSweep } from '../lib/governance/retention';

function createGovernanceDb(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE config (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT,
      delete_after TEXT
    )
  `);
  ensureGovernanceRuntime(database);
  return database;
}

describe('governance E2E', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createGovernanceDb();
  });

  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT;
    delete process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT;
    delete process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS;
    delete process.env.SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS;
    db.close();
  });

  it('isolates scoped retrieval to a single tenant and actor', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, 'specs/008-hydra-db-based-features', '/tmp/tenant-a-user-1.md', 'tenant-a', 'user-1', 'session-1');
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(2, 'specs/008-hydra-db-based-features', '/tmp/tenant-a-user-2.md', 'tenant-a', 'user-2', 'session-2');
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(3, 'specs/008-hydra-db-based-features', '/tmp/tenant-b-user-1.md', 'tenant-b', 'user-1', 'session-3');

    const rows = db.prepare(`
      SELECT id, tenant_id, user_id, session_id
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<Record<string, unknown> & { id: number }>;

    const filtered = filterRowsByScope(rows, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toMatchObject({
      id: 1,
      tenant_id: 'tenant-a',
      user_id: 'user-1',
    });
  });

  it('prevents cross-actor leakage when scope enforcement is enabled', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(10, 'specs/008-hydra-db-based-features', '/tmp/user-2.md', 'tenant-a', 'user-2', 'session-10');
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, agent_id, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(11, 'specs/008-hydra-db-based-features', '/tmp/agent-2.md', 'tenant-a', 'agent-2', 'session-11');

    const rows = db.prepare(`
      SELECT id, tenant_id, user_id, agent_id, session_id
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<Record<string, unknown> & { id: number }>;

    expect(filterRowsByScope(rows, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    })).toEqual([]);
    expect(filterRowsByScope(rows, {
      tenantId: 'tenant-a',
      agentId: 'agent-1',
    })).toEqual([]);
  });

  it('deletes only expired memories within the requested tenant scope', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';

    db.exec(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id, delete_after)
      VALUES
        (21, 'specs/008-hydra-db-based-features', '/tmp/tenant-a-expired.md', 'tenant-a', 'user-1', 'session-a1', datetime('now', '-2 day')),
        (22, 'specs/008-hydra-db-based-features', '/tmp/tenant-a-future.md', 'tenant-a', 'user-1', 'session-a2', datetime('now', '+2 day')),
        (23, 'specs/008-hydra-db-based-features', '/tmp/tenant-b-expired.md', 'tenant-b', 'user-9', 'session-b1', datetime('now', '-2 day'))
    `);

    const result = runRetentionSweep(db, {
      tenantId: 'tenant-a',
    });

    expect(result).toEqual({
      scanned: 1,
      deleted: 1,
      skipped: 0,
      deletedIds: [21],
    });

    const remainingIds = db.prepare(`
      SELECT id
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<{ id: number }>;
    expect(remainingIds).toEqual([{ id: 22 }, { id: 23 }]);
  });

  it('captures audit history for governed ingest review and retention deletion', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';
    process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS = 'true';

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id, delete_after)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 day'))
    `).run(31, 'specs/008-hydra-db-based-features', '/tmp/expired-audit.md', 'tenant-a', 'user-1', 'session-31');

    const governedIngest = validateGovernedIngest({
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-31',
      provenanceSource: 'e2e-test',
      provenanceActor: 'vitest',
      retentionPolicy: 'ephemeral',
      deleteAfter: new Date(Date.now() + 60_000).toISOString(),
    });

    expect(governedIngest.allowed).toBe(true);

    recordGovernanceAudit(db, {
      action: 'memory_save',
      decision: 'allow',
      tenantId: governedIngest.normalized.tenantId ?? undefined,
      userId: governedIngest.normalized.userId ?? undefined,
      agentId: governedIngest.normalized.agentId ?? undefined,
      sessionId: governedIngest.normalized.sessionId ?? undefined,
      sharedSpaceId: governedIngest.normalized.sharedSpaceId ?? undefined,
      reason: 'governed_ingest',
      metadata: {
        retentionPolicy: governedIngest.normalized.retentionPolicy,
      },
    });

    const retention = runRetentionSweep(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    });
    expect(retention.deletedIds).toEqual([31]);

    const review = reviewGovernanceAudit(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
      limit: 10,
    });

    expect(review.summary.totalMatching).toBe(2);
    expect(review.summary.byAction).toEqual({
      memory_save: 1,
      retention_sweep: 1,
    });
    expect(review.summary.byDecision).toEqual({
      allow: 1,
      delete: 1,
    });
    expect(review.rows.map((row) => row.action)).toEqual([
      'retention_sweep',
      'memory_save',
    ]);
    expect(review.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'memory_save',
          decision: 'allow',
          reason: 'governed_ingest',
        }),
        expect.objectContaining({
          action: 'retention_sweep',
          decision: 'delete',
          memoryId: 31,
          reason: 'delete_after_expired',
        }),
      ]),
    );
  });
});
