// ───────────────────────────────────────────────────────────────
// TESTS: Shared Memory E2E
// ───────────────────────────────────────────────────────────────
// Shared-memory enablement, membership enforcement, and kill switch behavior.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  assertSharedSpaceAccess,
  enableSharedMemory,
  ensureSharedCollabRuntime,
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

const SHARED_MEMORY_ENV_KEYS = [
  'SPECKIT_MEMORY_SHARED_MEMORY',
  'SPECKIT_HYDRA_SHARED_MEMORY',
  'SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS',
  'SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS',
] as const;

type SharedMemoryEnvKey = typeof SHARED_MEMORY_ENV_KEYS[number];

function createSharedMemoryDb(): Database.Database {
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
      session_id TEXT
    )
  `);
  ensureSharedCollabRuntime(database);
  return database;
}

describe('shared memory E2E', () => {
  let db: Database.Database;
  let originalEnv: Record<SharedMemoryEnvKey, string | undefined>;

  beforeEach(() => {
    db = createSharedMemoryDb();
    originalEnv = Object.fromEntries(
      SHARED_MEMORY_ENV_KEYS.map((key) => [key, process.env[key]]),
    ) as Record<SharedMemoryEnvKey, string | undefined>;
  });

  afterEach(() => {
    for (const key of SHARED_MEMORY_ENV_KEYS) {
      const value = originalEnv[key];
      if (typeof value === 'string') {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
    db.close();
  });

  it('supports the full shared-memory lifecycle for an allowed member', () => {
    expect(isSharedMemoryEnabled(db)).toBe(false);

    enableSharedMemory(db);
    expect(isSharedMemoryEnabled(db)).toBe(true);

    upsertSharedSpace(db, {
      spaceId: 'space-e2e',
      tenantId: 'tenant-a',
      name: 'Shared E2E Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-e2e',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'owner',
    });

    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }))).toEqual(['space-e2e']);
    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }, 'space-e2e')).toEqual({
      allowed: true,
    });
  });

  it('denies access by default for non-members', () => {
    enableSharedMemory(db);

    upsertSharedSpace(db, {
      spaceId: 'space-private',
      tenantId: 'tenant-a',
      name: 'Private Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-private',
      subjectType: 'user',
      subjectId: 'owner-1',
      role: 'owner',
    });

    expect(assertSharedSpaceAccess(db, {
      tenantId: 'tenant-a',
      userId: 'user-2',
    }, 'space-private')).toEqual({
      allowed: false,
      reason: 'shared_space_membership_required',
    });
    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-2',
    }))).toEqual([]);
  });

  it('honors the shared-memory env kill switch over persisted enablement', () => {
    enableSharedMemory(db);

    upsertSharedSpace(db, {
      spaceId: 'space-disabled',
      tenantId: 'tenant-a',
      name: 'Disabled Space',
      rolloutEnabled: true,
    });
    upsertSharedMembership(db, {
      spaceId: 'space-disabled',
      subjectType: 'user',
      subjectId: 'user-1',
      role: 'owner',
    });

    expect(isSharedMemoryEnabled(db)).toBe(true);

    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'false';

    expect(isSharedMemoryEnabled(db)).toBe(false);
    expect(Array.from(getAllowedSharedSpaceIds(db, {
      tenantId: 'tenant-a',
      userId: 'user-1',
    }))).toEqual([]);
  });
});
