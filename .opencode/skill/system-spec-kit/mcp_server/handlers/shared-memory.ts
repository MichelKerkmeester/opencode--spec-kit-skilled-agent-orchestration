// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler
// ───────────────────────────────────────────────────────────────
// MCP handler layer for shared-space CRUD, membership assignment,
// and rollout status reporting with deny-by-default access.
import { requireDb } from '../utils';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import type { MCPResponse } from './types';
import {
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

// Feature catalog: Shared-memory rollout, deny-by-default membership, and kill switch


interface SharedSpaceUpsertArgs {
  spaceId: string;
  tenantId: string;
  name: string;
  rolloutEnabled?: boolean;
  rolloutCohort?: string;
  killSwitch?: boolean;
}

interface SharedSpaceMembershipArgs {
  spaceId: string;
  subjectType: 'user' | 'agent';
  subjectId: string;
  role: 'owner' | 'editor' | 'viewer';
}

interface SharedMemoryStatusArgs {
  tenantId?: string;
  userId?: string;
  agentId?: string;
}

/**
 * Persist a shared-space definition for rollout and membership checks.
 *
 * @param args - Shared-space fields to create or update.
 * @returns MCP success response describing the saved shared space.
 */
export async function handleSharedSpaceUpsert(args: SharedSpaceUpsertArgs): Promise<MCPResponse> {
  const db = requireDb();
  upsertSharedSpace(db, args);
  return createMCPSuccessResponse({
    tool: 'shared_space_upsert',
    summary: `Shared space "${args.spaceId}" saved`,
    data: {
      spaceId: args.spaceId,
      tenantId: args.tenantId,
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
  upsertSharedMembership(db, args);
  return createMCPSuccessResponse({
    tool: 'shared_space_membership_set',
    summary: `Membership updated for ${args.subjectType} "${args.subjectId}"`,
    data: {
      spaceId: args.spaceId,
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
  const allowedSharedSpaceIds = Array.from(getAllowedSharedSpaceIds(db, args));
  return createMCPSuccessResponse({
    tool: 'shared_memory_status',
    summary: isSharedMemoryEnabled()
      ? `Shared memory enabled for ${allowedSharedSpaceIds.length} space(s)`
      : 'Shared memory disabled by rollout flag',
    data: {
      enabled: isSharedMemoryEnabled(),
      allowedSharedSpaceIds,
      tenantId: args.tenantId ?? null,
      userId: args.userId ?? null,
      agentId: args.agentId ?? null,
    },
  });
}
