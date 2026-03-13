import { requireDb } from '../utils';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import type { MCPResponse } from './types';
import {
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';

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

