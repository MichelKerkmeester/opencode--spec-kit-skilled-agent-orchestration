// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler Test Suite
// ───────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ───────────────────────────────────────────────────────────────
// 1. TEST DOUBLES
// ───────────────────────────────────────────────────────────────

const { dbHolder, mockRequireDb } = vi.hoisted(() => {
  const state: { current: Database.Database | null } = { current: null };
  return {
    dbHolder: state,
    mockRequireDb: vi.fn(() => state.current),
  };
});

vi.mock('../utils', () => ({
  requireDb: mockRequireDb,
}));

import {
  handleSharedMemoryEnable,
  handleSharedMemoryStatus,
  handleSharedSpaceMembershipSet,
  handleSharedSpaceUpsert,
  resolveAdminActor,
} from '../handlers/shared-memory';

interface SharedMemoryEnvelope extends Record<string, unknown> {
  data: Record<string, unknown> & {
    created?: boolean;
    ownerBootstrap?: boolean;
    killSwitch?: boolean;
    role?: string;
    error?: string;
    code?: string;
    details?: {
      reason?: string;
    };
  };
}

function getDb(): Database.Database {
  if (dbHolder.current === null) {
    throw new Error('Test database not initialized');
  }
  return dbHolder.current;
}

function parseEnvelope(response: { content: Array<{ text: string }> }): SharedMemoryEnvelope {
  return JSON.parse(response.content[0].text) as SharedMemoryEnvelope;
}

const sharedSpacesReadmePath = path.resolve(__dirname, '../../shared-spaces/README.md');

// ───────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────

describe('shared-memory admin handlers', () => {
  beforeEach(() => {
    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
    process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID = 'user-owner';
    process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY = 'true';
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID;
    dbHolder.current = new Database(':memory:');
    mockRequireDb.mockClear();
  });

  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID;
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID;
    delete process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;
    vi.restoreAllMocks();
    dbHolder.current?.close();
    dbHolder.current = null;
  });

  it('emits the trusted-transport warning only once across admin operations', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await handleSharedSpaceUpsert({
      spaceId: 'space-warn-1',
      tenantId: 'tenant-a',
      name: 'Warn Once',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-warn-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-2',
      role: 'viewer',
    });
    await handleSharedMemoryEnable({
      actorUserId: 'user-owner',
    });

    const warningMessage = '[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport';
    expect(warnSpy).toHaveBeenCalledWith(warningMessage);
    expect(warnSpy.mock.calls.filter(([message]) => message === warningMessage)).toHaveLength(1);
  });

  it('rejects shared-space admin mutations when no configured admin identity exists', async () => {
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID;

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-locked',
      tenantId: 'tenant-a',
      name: 'Locked',
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_memory_admin_unconfigured');
  });

  it('fails closed for shared-space admin mutations when trusted caller binding is not enabled', async () => {
    delete process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-trust-gate',
      tenantId: 'tenant-a',
      name: 'Trust Gate',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHORIZATION');
    expect(envelope.data.details?.reason).toBe('shared_memory_trusted_binding_required');
  });

  it('auto-bootstraps the creator as owner when creating a shared space', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const envelope = parseEnvelope(response);
    expect(envelope.data.created).toBe(true);
    expect(envelope.data.ownerBootstrap).toBe(true);

    expect(getDb().prepare(`
      SELECT subject_type, subject_id, role
      FROM shared_space_members
      WHERE space_id = ?
    `).get('space-1')).toEqual({
      subject_type: 'user',
      subject_id: 'user-owner',
      role: 'owner',
    });
  });

  it('treats stale create conflicts as updates and bootstraps only one owner', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-race',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const db = getDb();
    const originalPrepare = db.prepare.bind(db);
    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      if (sql.includes('SELECT tenant_id, rollout_enabled, kill_switch')
        && sql.includes('FROM shared_spaces')
        && sql.includes('WHERE space_id = ?')) {
        return {
          get: () => undefined,
        } as unknown as ReturnType<typeof originalPrepare>;
      }
      return originalPrepare(sql);
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-race',
      tenantId: 'tenant-a',
      name: 'Alpha Updated',
      actorUserId: 'user-owner',
      killSwitch: true,
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(false);
    expect(envelope.data.created).toBe(false);
    expect(envelope.data.ownerBootstrap).toBe(false);
    expect(db.prepare(`
      SELECT COUNT(*) AS count
      FROM shared_space_members
      WHERE space_id = ?
        AND role = 'owner'
    `).get('space-race')).toEqual({ count: 1 });
    expect(db.prepare(`
      SELECT name, rollout_enabled, kill_switch
      FROM shared_spaces
      WHERE space_id = ?
    `).get('space-race')).toEqual({
      name: 'Alpha Updated',
      rollout_enabled: 1,
      kill_switch: 1,
    });
  });

  it('allows an owner to update an existing shared space', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha Updated',
      actorUserId: 'user-owner',
      killSwitch: true,
    });

    const envelope = parseEnvelope(response);
    expect(envelope.data.created).toBe(false);
    expect(envelope.data.killSwitch).toBe(true);
  });

  it('rolls back shared-space creation when owner bootstrap fails', async () => {
    const db = getDb();
    const originalPrepare = db.prepare.bind(db);
    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      if (sql.includes('INSERT INTO shared_space_members')) {
        throw new Error('membership insert failed');
      }
      return originalPrepare(sql);
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-rollback',
      tenantId: 'tenant-a',
      name: 'Rollback',
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toBe('Shared space upsert failed');
    expect(JSON.stringify(envelope)).not.toContain('membership insert failed');
    expect(db.prepare(`
      SELECT COUNT(*) AS count
      FROM shared_spaces
      WHERE space_id = ?
    `).get('space-rollback')).toEqual({ count: 0 });
  });

  it('rejects updates when the caller is not a shared-space owner or admin', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-editor',
      role: 'editor',
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Hijack',
      actorUserId: 'user-editor',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
  });

  it('allows a shared-space owner to change membership without admin identity', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-space-owner',
      role: 'owner',
    });

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-space-owner',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'editor',
    });

    const envelope = parseEnvelope(response);
    expect(envelope.data.role).toBe('editor');
    expect(envelope.data.actorSubjectId).toBe('user-space-owner');
    expect(getDb().prepare(`
      SELECT role
      FROM shared_space_members
      WHERE space_id = ?
        AND subject_type = ?
        AND subject_id = ?
    `).get('space-1', 'agent', 'agent-1')).toEqual({ role: 'editor' });
  });

  it('rejects membership changes when the caller is not a shared-space owner or admin', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-editor',
      role: 'editor',
    });

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-editor',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
  });

  it('rejects omitted actor identity with an authentication error', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHENTICATION');
    expect(envelope.data.details?.reason).toBe('actor_identity_required');
  });

  it('rejects blank or whitespace-only actor identity values', async () => {
    const cases = [
      { actorUserId: '   ' },
      { actorAgentId: '\t' },
      { actorUserId: ' ', actorAgentId: 'agent-1' },
    ];

    for (const actorArgs of cases) {
      const response = await handleSharedSpaceUpsert({
        spaceId: 'space-1',
        tenantId: 'tenant-a',
        name: 'Alpha',
        ...actorArgs,
      });

      const envelope = parseEnvelope(response);
      expect(response.isError).toBe(true);
      expect(envelope.data.code).toBe('E_VALIDATION');
      expect(envelope.data.details?.reason).toBe('actor_identity_blank');
    }
  });

  it('rejects ambiguous actor identity', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-1',
      actorAgentId: 'agent-1',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('actor_identity_ambiguous');
  });

  it('rejects non-admin callers creating spaces in another tenant', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-cross-tenant',
      tenantId: 'tenant-b',
      name: 'Cross Tenant',
      actorUserId: 'user-non-admin',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHORIZATION');
    expect(envelope.data.details?.reason).toBe('shared_space_create_admin_required');
  });

  it('resolves the configured admin when the server uses an agent identity', () => {
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID;
    process.env.SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID = 'agent-owner';

    const actor = resolveAdminActor('shared_space_upsert');

    expect(actor.ok).toBe(true);
    if (actor.ok) {
      expect(actor.actor).toEqual({
        subjectType: 'agent',
        subjectId: 'agent-owner',
      });
    }
  });

  it('preserves rolloutEnabled when an owner updates a shared space without resending the boolean', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-preserve-rollout',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-preserve-rollout',
      tenantId: 'tenant-a',
      name: 'Alpha Renamed',
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(envelope.data.rolloutEnabled).toBe(true);
    expect(getDb().prepare(`
      SELECT rollout_enabled
      FROM shared_spaces
      WHERE space_id = ?
    `).get('space-preserve-rollout')).toEqual({
      rollout_enabled: 1,
    });
  });

  it('records a shared-space admin audit entry after a successful upsert', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-audit-success',
      tenantId: 'tenant-a',
      name: 'Alpha Audit',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });

    const auditRow = getDb().prepare(`
      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
      FROM governance_audit
      WHERE action = 'shared_space_admin'
      ORDER BY id DESC
      LIMIT 1
    `).get() as {
      action: string;
      decision: string;
      reason: string;
      tenant_id: string;
      user_id: string;
      shared_space_id: string;
      metadata: string;
    };

    expect(auditRow.action).toBe('shared_space_admin');
    expect(auditRow.decision).toBe('allow');
    expect(auditRow.reason).toBe('space_created');
    expect(auditRow.tenant_id).toBe('tenant-a');
    expect(auditRow.user_id).toBe('user-owner');
    expect(auditRow.shared_space_id).toBe('space-audit-success');
    expect(JSON.parse(auditRow.metadata)).toMatchObject({
      operation: 'space_upsert',
      operationType: 'create',
      actorSubjectType: 'user',
      actorSubjectId: 'user-owner',
      rolloutEnabled: true,
    });
  });

  it('rejects non-owner members and audits the denied admin mutation', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-owner-only',
      tenantId: 'tenant-a',
      name: 'Owner Only',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-owner-only',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-editor',
      role: 'editor',
    });

    getDb().prepare(`
      UPDATE shared_space_members
      SET subject_id = ?, role = ?
      WHERE space_id = ? AND subject_type = ? AND subject_id = ?
    `).run('user-external-owner', 'owner', 'space-owner-only', 'user', 'user-owner');
    getDb().prepare(`
      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
      VALUES (?, ?, ?, ?)
    `).run('space-owner-only', 'user', 'user-owner', 'editor');

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-owner-only',
      tenantId: 'tenant-a',
      actorUserId: 'user-editor',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');

    const auditRow = getDb().prepare(`
      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
      FROM governance_audit
      WHERE action = 'shared_space_admin'
      ORDER BY id DESC
      LIMIT 1
    `).get() as {
      action: string;
      decision: string;
      reason: string;
      tenant_id: string;
      user_id: string;
      shared_space_id: string;
      metadata: string;
    };

    expect(auditRow.action).toBe('shared_space_admin');
    expect(auditRow.decision).toBe('deny');
    expect(auditRow.reason).toBe('shared_space_owner_required');
    expect(auditRow.tenant_id).toBe('tenant-a');
    expect(auditRow.user_id).toBe('user-editor');
    expect(auditRow.shared_space_id).toBe('space-owner-only');
    expect(JSON.parse(auditRow.metadata)).toMatchObject({
      operation: 'membership_set',
      operationType: 'membership_update',
      actorSubjectType: 'user',
      actorSubjectId: 'user-editor',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'viewer',
    });
  });

  it('rejects tenant mismatch on membership mutation', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-space-owner',
      role: 'owner',
    });

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-b',
      actorUserId: 'user-space-owner',
      subjectType: 'user',
      subjectId: 'user-2',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_tenant_mismatch');
  });

  it('returns an internal error when membership persistence throws unexpectedly', async () => {
    const db = getDb();
    db.close();
    dbHolder.current = null;

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-2',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toContain('Shared space membership update failed');
    expect(envelope.data.code).toBe('E_INTERNAL');
  });

  it('returns an internal error when shared-memory status lookup throws unexpectedly', async () => {
    const db = getDb();
    db.close();
    dbHolder.current = null;

    const response = await handleSharedMemoryStatus({
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toContain('Shared memory status failed');
    expect(envelope.data.code).toBe('E_INTERNAL');
  });

  it('scopes shared-memory status to the authenticated caller identity', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-status-owner',
      tenantId: 'tenant-a',
      name: 'Status Owner',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });
    await handleSharedSpaceUpsert({
      spaceId: 'space-status-other',
      tenantId: 'tenant-a',
      name: 'Status Other',
      actorUserId: 'user-owner',
      rolloutEnabled: true,
    });
    await handleSharedSpaceMembershipSet({
      spaceId: 'space-status-other',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'user',
      subjectId: 'user-other',
      role: 'viewer',
    });

    const response = await handleSharedMemoryStatus({
      tenantId: 'tenant-a',
      actorUserId: 'user-other',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(false);
    expect(envelope.data.allowedSharedSpaceIds).toEqual(['space-status-other']);
    expect(envelope.data.userId).toBe('user-other');
    expect(envelope.data.agentId).toBeNull();
    expect(envelope.data.actorSubjectType).toBe('user');
    expect(envelope.data.actorSubjectId).toBe('user-other');
  });

  it('rejects shared-memory status when caller identity is omitted', async () => {
    const response = await handleSharedMemoryStatus({});

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHENTICATION');
    expect(envelope.data.details?.reason).toBe('actor_identity_required');
  });

  it('rejects shared-memory enable when caller identity is omitted', async () => {
    const response = await handleSharedMemoryEnable({});

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHENTICATION');
    expect(envelope.data.details?.reason).toBe('actor_identity_required');
  });

  it('rejects shared-memory enable when the caller is not the configured admin', async () => {
    const response = await handleSharedMemoryEnable({
      actorUserId: 'user-other',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.code).toBe('E_AUTHORIZATION');
    expect(envelope.data.details?.reason).toBe('shared_memory_enable_admin_required');
  });

  it('returns an internal error before README checks when authenticated shared-memory enablement fails', async () => {
    const db = getDb();
    db.close();
    dbHolder.current = null;
    const readmeExistedBefore = await fsPromises.access(sharedSpacesReadmePath)
      .then(() => true)
      .catch(() => false);

    const response = await handleSharedMemoryEnable({
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toContain('Shared memory enable failed');
    expect(envelope.data.code).toBe('E_INTERNAL');
    const readmeExistsAfter = await fsPromises.access(sharedSpacesReadmePath)
      .then(() => true)
      .catch(() => false);
    expect(readmeExistsAfter).toBe(readmeExistedBefore);
  });
});
