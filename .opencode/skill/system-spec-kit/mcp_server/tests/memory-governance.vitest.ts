import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  benchmarkScopeFilter,
  buildGovernancePostInsertFields,
  createScopeFilterPredicate,
  ensureGovernanceRuntime,
  filterRowsByScope,
  recordGovernanceAudit,
  reviewGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance';
import { ALLOWED_POST_INSERT_COLUMNS } from '../lib/storage/post-insert-metadata';

describe('Phase 5 memory governance', () => {
  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT;
    delete process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS;
    vi.restoreAllMocks();
  });

  it('rejects governed ingest when provenance or scope markers are missing', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';
    process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS = 'true';

    const decision = validateGovernedIngest({
      tenantId: 'tenant-a',
      sessionId: 'session-1',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
    expect(decision.issues).toContain('provenanceSource is required for governed ingest');
  });

  it('filters rows to the requested tenant and actor scope', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';
    const filtered = filterRowsByScope([
      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
      { id: 2, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1' },
      { id: 3, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1' },
    ], {
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
    });

    expect(filtered.map((row) => row.id)).toEqual([1]);
  });

  it('denies all rows when enforcement is on and scope is empty', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';
    const rows = [
      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
    ];

    const filtered = filterRowsByScope(rows, {});

    expect(filtered).toHaveLength(0);
  });

  it('honors explicit session scope even when global scope enforcement is disabled', () => {
    const filtered = filterRowsByScope([
      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-2' },
    ], {
      sessionId: 'session-1',
    });

    expect(filtered.map((row) => row.id)).toEqual([1]);
  });

  it('writes governance audit rows for allow and deny decisions', () => {
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        session_id TEXT
      )
    `);
    ensureGovernanceRuntime(db);

    recordGovernanceAudit(db, {
      action: 'memory_save',
      decision: 'allow',
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
      reason: 'governed_ingest',
    });

    const row = db.prepare(`SELECT action, decision, tenant_id, user_id FROM governance_audit LIMIT 1`).get() as {
      action: string;
      decision: string;
      tenant_id: string;
      user_id: string;
    };
    expect(row).toEqual({
      action: 'memory_save',
      decision: 'allow',
      tenant_id: 'tenant-a',
      user_id: 'user-1',
    });
  });

  it('persists session_id as a queryable governance post-insert column', () => {
    const decision = validateGovernedIngest({
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-123',
      provenanceSource: 'memory-save',
      provenanceActor: 'agent:test',
    });

    expect(decision.allowed).toBe(true);

    const fields = buildGovernancePostInsertFields(decision);
    expect(fields).toMatchObject({
      tenant_id: 'tenant-a',
      user_id: 'user-1',
      session_id: 'session-123',
    });
    expect(ALLOWED_POST_INSERT_COLUMNS.has('session_id')).toBe(true);
  });

  it('reviews governance audit history with summary counts and parsed metadata', () => {
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        session_id TEXT
      )
    `);
    ensureGovernanceRuntime(db);

    recordGovernanceAudit(db, {
      action: 'memory_save',
      decision: 'allow',
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
      reason: 'governed_ingest',
      metadata: { stage: 'pilot' },
    });
    recordGovernanceAudit(db, {
      action: 'memory_save',
      decision: 'deny',
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
      reason: 'missing_provenance',
    });
    recordGovernanceAudit(db, {
      action: 'retention_sweep',
      decision: 'delete',
      tenantId: 'tenant-b',
      userId: 'user-9',
      sessionId: 'session-9',
      reason: 'delete_after_expired',
    });

    const review = reviewGovernanceAudit(db, {
      tenantId: 'tenant-a',
      action: 'memory_save',
      limit: 10,
    });

    expect(review.summary.totalMatching).toBe(2);
    expect(review.summary.returnedRows).toBe(2);
    expect(review.summary.byAction).toEqual({ memory_save: 2 });
    expect(review.summary.byDecision).toEqual({ allow: 1, deny: 1 });
    expect(review.summary.latestCreatedAt).toEqual(expect.any(String));
    expect(review.rows).toHaveLength(2);
    expect(review.rows[0]).toMatchObject({
      action: 'memory_save',
      decision: 'deny',
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
      reason: 'missing_provenance',
    });
    expect(review.rows[1]).toMatchObject({
      action: 'memory_save',
      decision: 'allow',
      metadata: { stage: 'pilot' },
    });
  });

  it('blocks unscoped governance audit enumeration unless allowUnscoped=true', () => {
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        session_id TEXT
      )
    `);
    ensureGovernanceRuntime(db);
    recordGovernanceAudit(db, {
      action: 'memory_save',
      decision: 'allow',
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
      reason: 'governed_ingest',
    });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const blocked = reviewGovernanceAudit(db, {});

    expect(blocked.rows).toEqual([]);
    expect(blocked.summary.totalMatching).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith(
      '[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.'
    );

    const allowed = reviewGovernanceAudit(db, { allowUnscoped: true, limit: 10 });
    expect(allowed.summary.totalMatching).toBe(1);
    expect(allowed.rows).toHaveLength(1);
  });

  it('reuses cached scope predicates and benchmarks scoped filtering', () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';
    const rows = [
      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
    ];
    const allowedSharedSpaceIds = new Set(['space-1']);

    const predicate = createScopeFilterPredicate({
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
    }, allowedSharedSpaceIds);

    expect(rows.filter(predicate).map((row) => row.id)).toEqual([1, 3]);
    expect(filterRowsByScope(rows, {
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
    }, allowedSharedSpaceIds).map((row) => row.id)).toEqual([1, 3]);

    const benchmark = benchmarkScopeFilter(rows, {
      tenantId: 'tenant-a',
      userId: 'user-1',
      sessionId: 'session-1',
    }, {
      iterations: 3,
      allowedSharedSpaceIds,
    });

    expect(benchmark.iterations).toBe(3);
    expect(benchmark.totalRows).toBe(4);
    expect(benchmark.matchedRows).toBe(2);
    expect(benchmark.filteredRows).toBe(2);
    expect(benchmark.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(benchmark.averageMsPerIteration).toBeGreaterThanOrEqual(0);
  });

});
