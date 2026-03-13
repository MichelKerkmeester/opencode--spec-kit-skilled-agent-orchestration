import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  assertSharedSpaceAccess,
  getAllowedSharedSpaceIds,
  recordSharedConflict,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

describe('Phase 6 shared spaces', () => {
  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
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
    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-1' }))).toEqual(['space-1']);
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
});
