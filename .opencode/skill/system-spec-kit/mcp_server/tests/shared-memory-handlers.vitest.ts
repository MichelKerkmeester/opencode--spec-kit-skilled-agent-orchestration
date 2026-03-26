// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler Tests
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
    dbHolder.current = new Database(':memory:');
    mockRequireDb.mockClear();
  });

  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
    delete process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID;
    vi.restoreAllMocks();
    dbHolder.current?.close();
    dbHolder.current = null;
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
    expect(envelope.data.error).toBe('Shared space upsert failed: membership insert failed');
    expect(db.prepare(`
      SELECT COUNT(*) AS count
      FROM shared_spaces
      WHERE space_id = ?
    `).get('space-rollback')).toEqual({ count: 0 });
  });

  it('rejects updates when the configured admin is not an owner of the shared space', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    getDb().prepare(`
      UPDATE shared_space_members
      SET subject_id = ?, role = ?
      WHERE space_id = ? AND subject_type = ? AND subject_id = ?
    `).run('user-external-owner', 'owner', 'space-1', 'user', 'user-owner');
    getDb().prepare(`
      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
      VALUES (?, ?, ?, ?)
    `).run('space-1', 'user', 'user-owner', 'editor');

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Hijack',
      actorUserId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
  });

  it('allows an owner to change membership', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'editor',
    });

    const envelope = parseEnvelope(response);
    expect(envelope.data.role).toBe('editor');
    expect(getDb().prepare(`
      SELECT role
      FROM shared_space_members
      WHERE space_id = ?
        AND subject_type = ?
        AND subject_id = ?
    `).get('space-1', 'agent', 'agent-1')).toEqual({ role: 'editor' });
  });

  it('rejects membership changes when the configured admin is not an owner', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });
    getDb().prepare(`
      UPDATE shared_space_members
      SET subject_id = ?, role = ?
      WHERE space_id = ? AND subject_type = ? AND subject_id = ?
    `).run('user-external-owner', 'owner', 'space-1', 'user', 'user-owner');
    getDb().prepare(`
      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
      VALUES (?, ?, ?, ?)
    `).run('space-1', 'user', 'user-owner', 'editor');

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-owner',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
  });

  it('accepts missing actor hints and resolves the configured admin identity', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(false);
    expect(envelope.data.created).toBe(true);
    expect(envelope.data.actorSubjectType).toBe('user');
    expect(envelope.data.actorSubjectId).toBe('user-owner');
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

  it('treats empty actor hints as omitted while still rejecting ambiguous hints', () => {
    const emptyActor = resolveAdminActor('shared_space_upsert', '', undefined);
    expect(emptyActor.ok).toBe(true);
    if (emptyActor.ok) {
      expect(emptyActor.actor).toEqual({
        subjectType: 'user',
        subjectId: 'user-owner',
      });
    }

    const whitespaceActor = resolveAdminActor('shared_space_membership_set', '   ', ' \n\t ');
    expect(whitespaceActor.ok).toBe(true);
    if (whitespaceActor.ok) {
      expect(whitespaceActor.actor).toEqual({
        subjectType: 'user',
        subjectId: 'user-owner',
      });
    }

    const ambiguousActor = resolveAdminActor('shared_space_upsert', 'user-1', 'agent-1');
    expect(ambiguousActor.ok).toBe(false);
    if (!ambiguousActor.ok) {
      expect(parseEnvelope(ambiguousActor.response).data.details?.reason).toBe('actor_identity_ambiguous');
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
      actorUserId: 'user-owner',
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
    expect(auditRow.user_id).toBe('user-owner');
    expect(auditRow.shared_space_id).toBe('space-owner-only');
    expect(JSON.parse(auditRow.metadata)).toMatchObject({
      operation: 'membership_set',
      operationType: 'membership_update',
      actorSubjectType: 'user',
      actorSubjectId: 'user-owner',
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

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-b',
      actorUserId: 'user-owner',
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
      userId: 'user-owner',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toContain('Shared memory status failed');
    expect(envelope.data.code).toBe('E_INTERNAL');
  });

  it('returns an internal error before README checks when shared-memory enablement fails', async () => {
    const db = getDb();
    db.close();
    dbHolder.current = null;

    const response = await handleSharedMemoryEnable({});

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.error).toContain('Shared memory enable failed');
    expect(envelope.data.code).toBe('E_INTERNAL');
    await expect(fsPromises.access(sharedSpacesReadmePath)).rejects.toThrow();
  });
});
