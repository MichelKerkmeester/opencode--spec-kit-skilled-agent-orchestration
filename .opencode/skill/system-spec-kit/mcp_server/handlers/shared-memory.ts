// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler
// ───────────────────────────────────────────────────────────────
// MCP handler layer for shared-space CRUD, membership assignment,
// and rollout status reporting with deny-by-default access.
import { requireDb } from '../utils';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope';
import type { MCPResponse } from './types';
import type { SharedSpaceUpsertArgs, SharedSpaceMembershipArgs, SharedMemoryStatusArgs } from '../tools/types';
import {
  enableSharedMemory,
  ensureSharedCollabRuntime,
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

import * as fs from 'fs';
import * as path from 'path';

// Feature catalog: Shared-memory rollout, deny-by-default membership, and kill switch

type SharedAdminActor = {
  subjectType: 'user' | 'agent';
  subjectId: string;
};

function resolveAdminActor(
  tool: 'shared_space_upsert' | 'shared_space_membership_set',
  actorUserId?: string,
  actorAgentId?: string,
): SharedAdminActor | MCPResponse {
  const normalizedUserId = typeof actorUserId === 'string' ? actorUserId.trim() : '';
  const normalizedAgentId = typeof actorAgentId === 'string' ? actorAgentId.trim() : '';
  const hasUser = normalizedUserId.length > 0;
  const hasAgent = normalizedAgentId.length > 0;

  if (!hasUser && !hasAgent) {
    return createMCPErrorResponse({
      tool,
      error: 'Exactly one actor identity is required.',
      code: 'E_VALIDATION',
      details: { reason: 'actor_identity_required' },
      recovery: {
        hint: 'Provide actorUserId or actorAgentId.',
      },
    });
  }

  if (hasUser && hasAgent) {
    return createMCPErrorResponse({
      tool,
      error: 'Provide only one actor identity.',
      code: 'E_VALIDATION',
      details: { reason: 'actor_identity_ambiguous' },
      recovery: {
        hint: 'Send only actorUserId or actorAgentId, not both.',
      },
    });
  }

  return hasUser
    ? { subjectType: 'user', subjectId: normalizedUserId }
    : { subjectType: 'agent', subjectId: normalizedAgentId };
}

function findSharedSpaceTenant(database: ReturnType<typeof requireDb>, spaceId: string): string | null {
  const row = database.prepare(`
    SELECT tenant_id
    FROM shared_spaces
    WHERE space_id = ?
    LIMIT 1
  `).get(spaceId) as { tenant_id?: string | null } | undefined;
  return typeof row?.tenant_id === 'string' ? row.tenant_id : null;
}

function actorOwnsSharedSpace(
  database: ReturnType<typeof requireDb>,
  spaceId: string,
  actor: SharedAdminActor,
): boolean {
  const row = database.prepare(`
    SELECT role
    FROM shared_space_members
    WHERE space_id = ?
      AND subject_type = ?
      AND subject_id = ?
    LIMIT 1
  `).get(spaceId, actor.subjectType, actor.subjectId) as { role?: string } | undefined;
  return row?.role === 'owner';
}

function createSharedSpaceAuthError(
  tool: 'shared_space_upsert' | 'shared_space_membership_set',
  reason: string,
  error: string,
): MCPResponse {
  return createMCPErrorResponse({
    tool,
    error,
    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
    details: { reason },
    recovery: {
      hint: reason === 'shared_space_not_found'
        ? 'Create the space first with shared_space_upsert.'
        : 'Use the tenant owner identity for this shared space.',
    },
  });
}

/**
 * Persist a shared-space definition for rollout and membership checks.
 *
 * @param args - Shared-space fields to create or update.
 * @returns MCP success response describing the saved shared space.
 */
export async function handleSharedSpaceUpsert(args: SharedSpaceUpsertArgs): Promise<MCPResponse> {
  const db = requireDb();
  ensureSharedCollabRuntime(db);

  const enabled = isSharedMemoryEnabled(db);
  if (!enabled) {
    return createMCPErrorResponse({
      tool: 'shared_space_upsert',
      error: 'Shared memory is not enabled. Run /memory:shared enable first.',
      code: 'SHARED_MEMORY_DISABLED',
    });
  }

  const actor = resolveAdminActor('shared_space_upsert', args.actorUserId, args.actorAgentId);
  if ('content' in actor) {
    return actor;
  }

  const existingTenantId = findSharedSpaceTenant(db, args.spaceId);
  if (existingTenantId && existingTenantId !== args.tenantId) {
    return createSharedSpaceAuthError(
      'shared_space_upsert',
      'shared_space_tenant_mismatch',
      `Shared space "${args.spaceId}" belongs to a different tenant.`,
    );
  }
  if (existingTenantId && !actorOwnsSharedSpace(db, args.spaceId, actor)) {
    return createSharedSpaceAuthError(
      'shared_space_upsert',
      'shared_space_owner_required',
      `Only a shared-space owner can update "${args.spaceId}".`,
    );
  }

  upsertSharedSpace(db, {
    spaceId: args.spaceId,
    tenantId: args.tenantId,
    name: args.name,
    rolloutEnabled: args.rolloutEnabled,
    rolloutCohort: args.rolloutCohort,
    killSwitch: args.killSwitch,
  });

  const created = existingTenantId === null;
  if (created) {
    upsertSharedMembership(db, {
      spaceId: args.spaceId,
      subjectType: actor.subjectType,
      subjectId: actor.subjectId,
      role: 'owner',
    });
  }

  return createMCPSuccessResponse({
    tool: 'shared_space_upsert',
    summary: `Shared space "${args.spaceId}" saved`,
    data: {
      spaceId: args.spaceId,
      tenantId: args.tenantId,
      actorSubjectType: actor.subjectType,
      actorSubjectId: actor.subjectId,
      created,
      ownerBootstrap: created,
      rolloutEnabled: args.rolloutEnabled === true,
      killSwitch: args.killSwitch === true,
    },
  });
}

/**
 * Persist membership for a user or agent within a shared space.
 *
 * @param args - Membership assignment to write.
 * @returns MCP success response describing the updated membership.
 */
export async function handleSharedSpaceMembershipSet(args: SharedSpaceMembershipArgs): Promise<MCPResponse> {
  const db = requireDb();
  ensureSharedCollabRuntime(db);

  const enabled = isSharedMemoryEnabled(db);
  if (!enabled) {
    return createMCPErrorResponse({
      tool: 'shared_space_membership_set',
      error: 'Shared memory is not enabled. Run /memory:shared enable first.',
      code: 'SHARED_MEMORY_DISABLED',
    });
  }

  const actor = resolveAdminActor('shared_space_membership_set', args.actorUserId, args.actorAgentId);
  if ('content' in actor) {
    return actor;
  }

  const existingTenantId = findSharedSpaceTenant(db, args.spaceId);
  if (!existingTenantId) {
    return createSharedSpaceAuthError(
      'shared_space_membership_set',
      'shared_space_not_found',
      `Shared space "${args.spaceId}" was not found.`,
    );
  }
  if (existingTenantId !== args.tenantId) {
    return createSharedSpaceAuthError(
      'shared_space_membership_set',
      'shared_space_tenant_mismatch',
      `Shared space "${args.spaceId}" belongs to a different tenant.`,
    );
  }
  if (!actorOwnsSharedSpace(db, args.spaceId, actor)) {
    return createSharedSpaceAuthError(
      'shared_space_membership_set',
      'shared_space_owner_required',
      `Only a shared-space owner can update membership for "${args.spaceId}".`,
    );
  }

  upsertSharedMembership(db, {
    spaceId: args.spaceId,
    subjectType: args.subjectType,
    subjectId: args.subjectId,
    role: args.role,
  });
  return createMCPSuccessResponse({
    tool: 'shared_space_membership_set',
    summary: `Membership updated for ${args.subjectType} "${args.subjectId}"`,
    data: {
      spaceId: args.spaceId,
      tenantId: args.tenantId,
      actorSubjectType: actor.subjectType,
      actorSubjectId: actor.subjectId,
      subjectType: args.subjectType,
      subjectId: args.subjectId,
      role: args.role,
    },
  });
}

/**
 * Report rollout status and visible shared spaces for the requested scope.
 *
 * @param args - Tenant, user, or agent scope to evaluate.
 * @returns MCP success response containing the enabled state and allowed spaces.
 */
export async function handleSharedMemoryStatus(args: SharedMemoryStatusArgs): Promise<MCPResponse> {
  const db = requireDb();
  const enabled = isSharedMemoryEnabled(db);
  const allowedSharedSpaceIds = enabled ? Array.from(getAllowedSharedSpaceIds(db, args)) : [];
  return createMCPSuccessResponse({
    tool: 'shared_memory_status',
    summary: enabled
      ? `Shared memory enabled for ${allowedSharedSpaceIds.length} space(s)`
      : 'Shared memory disabled — run /memory:shared enable to set up',
    data: {
      enabled,
      allowedSharedSpaceIds,
      tenantId: args.tenantId ?? null,
      userId: args.userId ?? null,
      agentId: args.agentId ?? null,
    },
  });
}

/**
 * Enable the shared-memory subsystem via first-run setup.
 *
 * Idempotent: persists DB flag and creates README even if env-var override
 * already enables the runtime check. Subsequent calls that find both the
 * DB flag set and the README present return `alreadyEnabled: true`.
 */
export async function handleSharedMemoryEnable(_args: Record<string, unknown>): Promise<MCPResponse> {
  const db = requireDb();

  // Check DB-level persistence (not runtime env-var) to decide idempotency.
  // This ensures env-var-only users still get DB persistence + README on first call.
  let dbAlreadyEnabled = false;
  try {
    const row = db.prepare('SELECT value FROM config WHERE key = ?')
      .get('shared_memory_enabled') as { value: string } | undefined;
    dbAlreadyEnabled = row?.value === 'true';
  } catch { /* config table may not exist yet */ }

  const readmeAlreadyExists = createSharedSpacesReadme();

  if (dbAlreadyEnabled && readmeAlreadyExists) {
    return createMCPSuccessResponse({
      tool: 'shared_memory_enable',
      summary: 'Shared memory is already enabled',
      data: { alreadyEnabled: true },
    });
  }

  // Ensure tables + persist flag (README already created above)
  ensureSharedCollabRuntime(db);
  enableSharedMemory(db);

  return createMCPSuccessResponse({
    tool: 'shared_memory_enable',
    summary: 'Shared memory enabled successfully',
    data: {
      alreadyEnabled: false,
      enabled: true,
      readmeCreated: !readmeAlreadyExists,
    },
  });
}

/**
 * Write a README into the shared-spaces directory (skip if already exists).
 *
 * @returns `true` when the file already existed (no write needed).
 */
function createSharedSpacesReadme(): boolean {
  const dir = path.resolve(__dirname, '../../shared-spaces');
  const readmePath = path.join(dir, 'README.md');
  if (fs.existsSync(readmePath)) return true;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `# Shared Memory Spaces

> Collaborative memory sharing between users and agents.

## Status

Shared memory has been **enabled** for this workspace.

## Key Concepts

- **Spaces** — Named containers for shared memories, scoped to a tenant.
- **Membership** — Deny-by-default: users and agents must be explicitly granted access (owner, editor, or viewer).
- **Rollout** — Each space has independent rollout and kill-switch controls.
- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.

## Management Commands

| Command | Description |
|---------|-------------|
| \`/memory:shared status\` | View rollout state and accessible spaces |
| \`/memory:shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
| \`/memory:shared member <spaceId> <type> <id> <role>\` | Set membership; caller must already own the space |
| \`/memory:shared enable\` | Re-run first-time setup (idempotent) |

## Environment Overrides

Set \`SPECKIT_MEMORY_SHARED_MEMORY=true\` to force-enable shared memory regardless of database state.
`;

  fs.writeFileSync(readmePath, content, 'utf-8');
  return false;
}
