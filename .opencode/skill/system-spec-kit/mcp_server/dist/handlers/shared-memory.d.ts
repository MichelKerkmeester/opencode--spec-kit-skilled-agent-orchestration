import type { MCPResponse } from './types.js';
import type { SharedSpaceUpsertArgs, SharedSpaceMembershipArgs, SharedMemoryStatusArgs } from '../tools/types.js';
type SharedAdminActor = {
    subjectType: 'user' | 'agent';
    subjectId: string;
};
type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
type SharedCallerAuthArgs = {
    tool: SharedIdentityTool;
    actorUserId?: string;
    actorAgentId?: string;
};
type SharedAdminCallerAuthArgs = SharedCallerAuthArgs & {
    tool: SharedAdminTool;
};
type ValidatedCallerAuth = {
    actor: SharedAdminActor;
    isAdmin: boolean;
};
export type AdminActorResult = {
    ok: true;
    actor: SharedAdminActor;
} | {
    ok: false;
    response: MCPResponse;
};
/**
 * Resolve the shared-memory admin identity from server-owned configuration.
 */
export declare function resolveAdminActor(tool: SharedAdminTool): AdminActorResult;
export declare function validateCallerAuth(args: SharedAdminCallerAuthArgs, tenantId?: string): ValidatedCallerAuth;
/**
 * Persist a shared-space definition for rollout and membership checks.
 *
 * @param args - Shared-space fields to create or update.
 * @returns MCP success response describing the saved shared space.
 */
export declare function handleSharedSpaceUpsert(args: SharedSpaceUpsertArgs): Promise<MCPResponse>;
/**
 * Persist membership for a user or agent within a shared space.
 *
 * @param args - Membership assignment to write.
 * @returns MCP success response describing the updated membership.
 */
export declare function handleSharedSpaceMembershipSet(args: SharedSpaceMembershipArgs): Promise<MCPResponse>;
/**
 * Report rollout status and visible shared spaces for the requested scope.
 *
 * @param args - Tenant, user, or agent scope to evaluate.
 * @returns MCP success response containing the enabled state and allowed spaces.
 */
export declare function handleSharedMemoryStatus(args: SharedMemoryStatusArgs): Promise<MCPResponse>;
/**
 * Enable the shared-memory subsystem via first-run setup.
 *
 * Idempotent: persists DB flag and creates README even if env-var override
 * already enables the runtime check. Subsequent calls that find both the
 * DB flag set and the README present return `alreadyEnabled: true`.
 */
export declare function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse>;
export {};
//# sourceMappingURL=shared-memory.d.ts.map