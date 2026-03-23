import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/governance/scope-governance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/governance/scope-governance')>();
  return {
    ...actual,
    recordGovernanceAudit: vi.fn(actual.recordGovernanceAudit),
  };
});

import * as scopeGovernance from '../lib/governance/scope-governance';
import {
  assertSharedSpaceAccess,
  enableSharedMemory,
  getAllowedSharedSpaceIds,
  getSharedConflictStrategySummary,
  getSharedRolloutCohortSummary,
  getSharedRolloutMetrics,
  isSharedMemoryEnabled,
  recordSharedConflict,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

describe('Phase 6 shared spaces', () => {
  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
    delete process.env.SPECKIT_HYDRA_SHARED_MEMORY;
    vi.restoreAllMocks();
  });

  it('enforces deny-by-default membership for shared spaces', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      rolloutEnabled: true,
    });

    const denied = assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }, 'space-1');
    expect(denied.allowed).toBe(false);

    upsertSharedMembership(db, {
      spaceId: 'space-1',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });

    const allowed = assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }, 'space-1', 'editor');
    expect(allowed.allowed).toBe(true);
    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }))).toEqual(['space-1']);
  });

  it('returns an empty allowlist when tenant context is missing', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-tenant-a',
      tenantId: 'tenant-A',
      name: 'Tenant A Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-tenant-a',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });

    expect(getAllowedSharedSpaceIds(db, { userId: 'user-1' })).toEqual(new Set());
  });

  it('returns shared spaces only for the matching tenant context', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-tenant-a',
      tenantId: 'tenant-A',
      name: 'Tenant A Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-tenant-a',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });

    expect(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-A',
      userId: 'user-1',
    })).toEqual(new Set(['space-tenant-a']));
  });

  it('returns an empty allowlist for the wrong tenant context', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-tenant-a',
      tenantId: 'tenant-A',
      name: 'Tenant A Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-tenant-a',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });

    expect(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-B',
      userId: 'user-1',
    })).toEqual(new Set());
  });

  it('rejects blank shared-space identifiers before access evaluation', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }, '   ')).toEqual({
      allowed: false,
      reason: 'shared_space_id_required',
    });

    expect(db.prepare(`
      SELECT action, decision, reason
      FROM governance_audit
      ORDER BY id DESC
      LIMIT 1
    `).get()).toEqual({
      action: 'shared_space_access',
      decision: 'deny',
      reason: 'shared_space_id_required',
    });
  });

  it('requires owner role for owner-gated shared-space actions', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-owner',
      tenantId: 'tenant-a',
      name: 'Owner Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-owner',
      subjectType: 'user',
      subjectId: 'user-editor',
      role: 'editor',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-owner',
      subjectType: 'user',
      subjectId: 'user-owner',
      role: 'owner',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-editor',
    }, 'space-owner', 'owner')).toEqual({
      allowed: false,
      reason: 'shared_space_owner_required',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-owner',
    }, 'space-owner', 'owner')).toEqual({
      allowed: true,
    });
  });

  it('uses the highest role when both user and agent memberships exist', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-mixed-role',
      tenantId: 'tenant-a',
      name: 'Mixed Role Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-mixed-role',
      subjectType: 'user',
      subjectId: 'user-mixed',
      role: 'viewer',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-mixed-role',
      subjectType: 'agent',
      subjectId: 'agent-mixed',
      role: 'owner',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-mixed',
      agentId: 'agent-mixed',
    }, 'space-mixed-role', 'owner')).toEqual({
      allowed: true,
    });
    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-mixed',
      agentId: 'agent-mixed',
    }))).toEqual(['space-mixed-role']);
  });

  it('records governance audits for denied and allowed shared-space access decisions', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-audit',
      tenantId: 'tenant-a',
      name: 'Audit Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-audit',
      subjectType: 'user',
      subjectId: 'user-owner',
      role: 'owner',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-viewer',
    }, 'space-audit')).toEqual({
      allowed: false,
      reason: 'shared_space_membership_required',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-owner',
    }, 'space-audit', 'owner')).toEqual({
      allowed: true,
    });

    expect(db.prepare(`
      SELECT decision, reason, tenant_id, user_id, shared_space_id
      FROM governance_audit
      WHERE action = 'shared_space_access'
      ORDER BY id ASC
    `).all()).toEqual([
      {
        decision: 'deny',
        reason: 'shared_space_membership_required',
        tenant_id: 'tenant-a',
        user_id: 'user-viewer',
        shared_space_id: 'space-audit',
      },
      {
        decision: 'allow',
        reason: 'membership_verified',
        tenant_id: 'tenant-a',
        user_id: 'user-owner',
        shared_space_id: 'space-audit',
      },
    ]);
  });

  it('preserves rolloutEnabled when a shared-space update omits the boolean fields', () => {
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-preserve-rollout',
      tenantId: 'tenant-a',
      name: 'Alpha',
      rolloutEnabled: true,
    });

    upsertSharedSpace(db, {
      spaceId: 'space-preserve-rollout',
      tenantId: 'tenant-a',
      name: 'Alpha Renamed',
    });

    expect(db.prepare(`
      SELECT rollout_enabled, kill_switch
      FROM shared_spaces
      WHERE space_id = ?
    `).get('space-preserve-rollout')).toEqual({
      rollout_enabled: 1,
      kill_switch: 0,
    });
  });

  it('returns the computed access decision even when audit persistence fails', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    upsertSharedSpace(db, {
      spaceId: 'space-audit-failure',
      tenantId: 'tenant-a',
      name: 'Audit Failure Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-audit-failure',
      subjectType: 'user',
      subjectId: 'user-owner',
      role: 'owner',
    });

    vi.mocked(scopeGovernance.recordGovernanceAudit)
      .mockImplementationOnce(() => {
        throw new Error('audit insert failed');
      })
      .mockImplementationOnce(() => {
        throw new Error('audit insert failed');
      });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-owner',
    }, 'space-audit-failure', 'owner')).toEqual({
      allowed: true,
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-viewer',
    }, 'space-audit-failure')).toEqual({
      allowed: false,
      reason: 'shared_space_membership_required',
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Failed to record shared_space_access audit');
  });

  it('blocks existing members immediately when a shared-space kill switch is enabled', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-2',
      tenantId: 'tenant-a',
      name: 'Beta',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-2',
      subjectType: 'user',
      subjectId: 'user-2',
      role: 'owner',
    });

    const beforeKillSwitch = assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-2',
    }, 'space-2', 'editor');
    expect(beforeKillSwitch).toEqual({ allowed: true });

    upsertSharedSpace(db, {
      spaceId: 'space-2',
      tenantId: 'tenant-a',
      name: 'Beta',
      rolloutEnabled: true,
      killSwitch: true,
    });

    const afterKillSwitch = assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-2',
    }, 'space-2');
    expect(afterKillSwitch).toEqual({
      allowed: false,
      reason: 'shared_space_kill_switch',
    });
    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-2' }))).toEqual([]);
  });

  it('keeps rollout disabled spaces hidden even when membership exists', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-3',
      tenantId: 'tenant-a',
      name: 'Gamma',
      rolloutEnabled: false,
      rolloutCohort: 'pilot-a',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-3',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'editor',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      agentId: 'agent-1',
    }, 'space-3')).toEqual({
      allowed: false,
      reason: 'shared_space_rollout_disabled',
    });
    expect(Array.from(getAllowedSharedSpaceIds(db, { agentId: 'agent-1' }))).toEqual([]);
  });

  it('rejects blank identifiers when persisting shared spaces and memberships', () => {
    const db = new Database(':memory:');

    expect(() => upsertSharedSpace(db, {
      spaceId: ' ',
      tenantId: 'tenant-a',
      name: 'Invalid Space',
    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');

    expect(() => upsertSharedMembership(db, {
      spaceId: 'space-blank',
      subjectType: 'user',
      subjectId: ' ',
      role: 'viewer',
    })).toThrow('E_VALIDATION: spaceId and subjectId must be non-empty strings');
  });

  it('limits shared-space discovery and access to the requested tenant boundary', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-a',
      tenantId: 'tenant-a',
      name: 'Tenant A',
      rolloutEnabled: true,
    });
    upsertSharedSpace(db, {
      spaceId: 'space-b',
      tenantId: 'tenant-b',
      name: 'Tenant B',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-a',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-b',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'editor',
    });

    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }))).toEqual(['space-a']);

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }, 'space-b')).toEqual({
      allowed: false,
      reason: 'shared_space_tenant_mismatch',
    });
  });

  it('records append-version conflicts in shared conflict and governance audit tables', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-4',
      tenantId: 'tenant-a',
      name: 'Delta',
      rolloutEnabled: true,
    });

    recordSharedConflict(db, {
      spaceId: 'space-4',
      logicalKey: 'roadmap:milestone',
      existingMemoryId: 10,
      incomingMemoryId: 11,
      actor: 'user-4',
      metadata: { strategy: 'append_version', conflictKind: 'concurrent_edit' },
    });

    expect(db.prepare(`
      SELECT space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor
      FROM shared_space_conflicts
      LIMIT 1
    `).get()).toEqual({
      space_id: 'space-4',
      logical_key: 'roadmap:milestone',
      existing_memory_id: 10,
      incoming_memory_id: 11,
      strategy: 'append_version',
      actor: 'user-4',
    });

    expect(db.prepare(`
      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
      FROM governance_audit
      ORDER BY id DESC
      LIMIT 1
    `).get()).toEqual({
      action: 'shared_conflict',
      decision: 'conflict',
      memory_id: 11,
      logical_key: 'roadmap:milestone',
      shared_space_id: 'space-4',
      reason: 'append_version',
    });
  });

  it('escalates repeat or high-risk conflicts to a manual merge strategy', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-4b',
      tenantId: 'tenant-a',
      name: 'Delta Escalation',
      rolloutEnabled: true,
    });

    recordSharedConflict(db, {
      spaceId: 'space-4b',
      logicalKey: 'roadmap:shared-doc',
      existingMemoryId: 40,
      incomingMemoryId: 41,
      actor: 'user-4b',
    });
    recordSharedConflict(db, {
      spaceId: 'space-4b',
      logicalKey: 'roadmap:shared-doc',
      existingMemoryId: 41,
      incomingMemoryId: 42,
      actor: 'user-4b',
    });
    recordSharedConflict(db, {
      spaceId: 'space-4b',
      logicalKey: 'roadmap:critical-doc',
      existingMemoryId: 42,
      incomingMemoryId: 43,
      actor: 'user-4b',
      metadata: { conflictKind: 'schema_mismatch' },
    });

    expect(db.prepare(`
      SELECT strategy, metadata
      FROM shared_space_conflicts
      WHERE space_id = ?
      ORDER BY id ASC
    `).all('space-4b')).toEqual([
      {
        strategy: 'append_version',
        metadata: JSON.stringify({
          strategy: 'append_version',
          strategyReason: 'default_append_only',
          priorConflictCount: 0,
        }),
      },
      {
        strategy: 'manual_merge',
        metadata: JSON.stringify({
          strategy: 'manual_merge',
          strategyReason: 'repeat_conflict',
          priorConflictCount: 1,
        }),
      },
      {
        strategy: 'manual_merge',
        metadata: JSON.stringify({
          conflictKind: 'schema_mismatch',
          strategy: 'manual_merge',
          strategyReason: 'high_risk:schema_mismatch',
          priorConflictCount: 0,
        }),
      },
    ]);

    expect(db.prepare(`
      SELECT reason, metadata
      FROM governance_audit
      WHERE shared_space_id = ?
      ORDER BY id ASC
    `).all('space-4b')).toEqual([
      {
        reason: 'append_version',
        metadata: JSON.stringify({
          strategy: 'append_version',
          strategyReason: 'default_append_only',
          priorConflictCount: 0,
        }),
      },
      {
        reason: 'manual_merge',
        metadata: JSON.stringify({
          strategy: 'manual_merge',
          strategyReason: 'repeat_conflict',
          priorConflictCount: 1,
        }),
      },
      {
        reason: 'manual_merge',
        metadata: JSON.stringify({
          conflictKind: 'schema_mismatch',
          strategy: 'manual_merge',
          strategyReason: 'high_risk:schema_mismatch',
          priorConflictCount: 0,
        }),
      },
    ]);
  });

  it('summarizes rollout metrics and cohorts for a tenant boundary', () => {
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-5',
      tenantId: 'tenant-a',
      name: 'Pilot A1',
      rolloutEnabled: true,
      rolloutCohort: 'pilot-a',
    });
    upsertSharedSpace(db, {
      spaceId: 'space-6',
      tenantId: 'tenant-a',
      name: 'Pilot A2',
      rolloutEnabled: false,
      rolloutCohort: 'pilot-a',
    });
    upsertSharedSpace(db, {
      spaceId: 'space-7',
      tenantId: 'tenant-a',
      name: 'General A',
      rolloutEnabled: true,
      killSwitch: true,
    });
    upsertSharedSpace(db, {
      spaceId: 'space-8',
      tenantId: 'tenant-b',
      name: 'Other Tenant',
      rolloutEnabled: true,
      rolloutCohort: 'pilot-b',
    });

    upsertSharedMembership(db, {
      spaceId: 'space-5',
      subjectType: 'user',
      subjectId: 'user-5',
      role: 'owner',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-5',
      subjectType: 'agent',
      subjectId: 'agent-5',
      role: 'editor',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-6',
      subjectType: 'user',
      subjectId: 'user-6',
      role: 'viewer',
    });
    upsertSharedMembership(db, {
      spaceId: 'space-8',
      subjectType: 'user',
      subjectId: 'user-8',
      role: 'owner',
    });

    recordSharedConflict(db, {
      spaceId: 'space-5',
      logicalKey: 'roadmap:pilot',
      existingMemoryId: 21,
      incomingMemoryId: 22,
      actor: 'user-5',
    });
    recordSharedConflict(db, {
      spaceId: 'space-6',
      logicalKey: 'roadmap:pilot-disabled',
      existingMemoryId: 23,
      incomingMemoryId: 24,
      actor: 'user-6',
    });
    recordSharedConflict(db, {
      spaceId: 'space-8',
      logicalKey: 'roadmap:tenant-b',
      existingMemoryId: 25,
      incomingMemoryId: 26,
      actor: 'user-8',
    });

    const metrics = getSharedRolloutMetrics(db, 'tenant-a');
    expect(metrics).toEqual({
      tenantId: 'tenant-a',
      totalSpaces: 3,
      rolloutEnabledSpaces: 2,
      rolloutDisabledSpaces: 1,
      killSwitchedSpaces: 1,
      totalMemberships: 3,
      totalConflicts: 2,
      totalCohorts: 1,
    });

    expect(getSharedRolloutCohortSummary(db, 'tenant-a')).toEqual([
      {
        cohort: 'pilot-a',
        totalSpaces: 2,
        rolloutEnabledSpaces: 1,
        killSwitchedSpaces: 0,
        membershipCount: 3,
      },
      {
        cohort: null,
        totalSpaces: 1,
        rolloutEnabledSpaces: 1,
        killSwitchedSpaces: 1,
        membershipCount: 0,
      },
    ]);
  });

  it('summarizes shared conflict strategies for a space', () => {
    const db = new Database(':memory:');

    upsertSharedSpace(db, {
      spaceId: 'space-9',
      tenantId: 'tenant-a',
      name: 'Conflict Summary',
      rolloutEnabled: true,
    });

    recordSharedConflict(db, {
      spaceId: 'space-9',
      logicalKey: 'doc:a',
      existingMemoryId: 30,
      incomingMemoryId: 31,
      actor: 'user-9',
    });
    db.prepare(`
      INSERT INTO shared_space_conflicts (
        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'space-9',
      'doc:b',
      31,
      32,
      'manual_merge',
      'user-9',
      JSON.stringify({ note: 'resolved by reviewer' }),
    );
    db.prepare(`
      INSERT INTO shared_space_conflicts (
        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'space-9',
      'doc:b',
      32,
      33,
      'manual_merge',
      'user-9',
      null,
    );

    expect(getSharedConflictStrategySummary(db, 'space-9')).toEqual([
      {
        strategy: 'manual_merge',
        totalConflicts: 2,
        distinctLogicalKeys: 1,
        latestCreatedAt: expect.any(String),
      },
      {
        strategy: 'append_version',
        totalConflicts: 1,
        distinctLogicalKeys: 1,
        latestCreatedAt: expect.any(String),
      },
    ]);
  });

  it('returns false by default when no env var and no DB config', () => {
    expect(isSharedMemoryEnabled()).toBe(false);
    const db = new Database(':memory:');
    expect(isSharedMemoryEnabled(db)).toBe(false);
  });

  it('returns true after enableSharedMemory is called', () => {
    const db = new Database(':memory:');
    expect(isSharedMemoryEnabled(db)).toBe(false);
    enableSharedMemory(db);
    expect(isSharedMemoryEnabled(db)).toBe(true);
  });

  it('env var override takes priority over DB config', () => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    const db = new Database(':memory:');
    // Enabled via env var even without DB config
    expect(isSharedMemoryEnabled(db)).toBe(true);
    expect(isSharedMemoryEnabled()).toBe(true);
  });

  it('enableSharedMemory is idempotent', () => {
    const db = new Database(':memory:');
    enableSharedMemory(db);
    enableSharedMemory(db);
    expect(isSharedMemoryEnabled(db)).toBe(true);
    const rows = db.prepare('SELECT COUNT(*) AS count FROM config WHERE key = ?')
      .get('shared_memory_enabled') as { count: number };
    expect(rows.count).toBe(1);
  });
});
