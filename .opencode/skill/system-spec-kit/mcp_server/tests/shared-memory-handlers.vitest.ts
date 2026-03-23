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
    dbHolder.current = new Database(':memory:');
    mockRequireDb.mockClear();
  });

  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
    vi.restoreAllMocks();
    dbHolder.current?.close();
    dbHolder.current = null;
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

  it('rejects updates from non-owners', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });

    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Hijack',
      actorUserId: 'user-intruder',
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

  it('rejects membership changes from non-owners', async () => {
    await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
      actorUserId: 'user-owner',
    });

    const response = await handleSharedSpaceMembershipSet({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      actorUserId: 'user-intruder',
      subjectType: 'agent',
      subjectId: 'agent-1',
      role: 'viewer',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
  });

  it('rejects missing actor identity', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details?.reason).toBe('actor_identity_required');
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
