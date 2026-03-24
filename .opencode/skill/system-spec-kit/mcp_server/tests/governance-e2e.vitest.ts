// ───────────────────────────────────────────────────────────────
// TESTS: Governance E2E
// ───────────────────────────────────────────────────────────────
// Scoped governance isolation, retention behavior, and audit review.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  ensureGovernanceRuntime,
  filterRowsByScope,
} from '../lib/governance/scope-governance';

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

});
