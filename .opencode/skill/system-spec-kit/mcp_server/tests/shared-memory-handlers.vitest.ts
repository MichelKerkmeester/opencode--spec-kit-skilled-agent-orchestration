// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler Tests
// ───────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';
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
  handleSharedSpaceMembershipSet,
  handleSharedSpaceUpsert,
} from '../handlers/shared-memory';

interface SharedMemoryEnvelope extends Record<string, unknown> {
  data: {
    created?: boolean;
    ownerBootstrap?: boolean;
    killSwitch?: boolean;
    role?: string;
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

function parseEnvelope(response: Awaited<ReturnType<typeof handleSharedSpaceUpsert>>): SharedMemoryEnvelope {
  return JSON.parse(response.content[0].text) as SharedMemoryEnvelope;
}

// ───────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────

describe('shared-memory admin handlers', () => {
  beforeEach(() => {
    dbHolder.current = new Database(':memory:');
    mockRequireDb.mockClear();
  });

  afterEach(() => {
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
    expect(envelope.data.details.reason).toBe('shared_space_owner_required');
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
    expect(envelope.data.details.reason).toBe('shared_space_owner_required');
  });

  it('rejects missing actor identity', async () => {
    const response = await handleSharedSpaceUpsert({
      spaceId: 'space-1',
      tenantId: 'tenant-a',
      name: 'Alpha',
    });

    const envelope = parseEnvelope(response);
    expect(response.isError).toBe(true);
    expect(envelope.data.details.reason).toBe('actor_identity_required');
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
    expect(envelope.data.details.reason).toBe('actor_identity_ambiguous');
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
    expect(envelope.data.details.reason).toBe('shared_space_tenant_mismatch');
  });
});
