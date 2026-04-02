// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler
// ───────────────────────────────────────────────────────────────
// MCP handler layer for shared-space CRUD, membership assignment,
// and rollout status reporting with deny-by-default access.
import { requireDb } from '../utils/index.js';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import type { MCPResponse } from './types.js';
import type { SharedSpaceUpsertArgs, SharedSpaceMembershipArgs, SharedMemoryStatusArgs } from '../tools/types.js';
import {
  assertSharedSpaceAccess,
  createSharedSpaceIfAbsent,
  enableSharedMemory,
  ensureSharedCollabRuntime,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces.js';
import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';

import { access, mkdir, writeFile } from 'fs/promises';
import * as path from 'path';

// Feature catalog: Shared-memory rollout, deny-by-default membership, and kill switch

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

export type AdminActorResult =
  | { ok: true; actor: SharedAdminActor }
  | { ok: false; response: MCPResponse };

class SharedMemoryAuthError extends Error {
  public readonly response: MCPResponse;

  constructor(message: string, response: MCPResponse) {
    super(message);
    this.name = 'SharedMemoryAuthError';
    this.response = response;
  }
}

function throwSharedMemoryAuthError(message: string, response: MCPResponse): never {
  throw new SharedMemoryAuthError(message, response);
}

function createCallerAuthErrorResponse(args: {
  tool: SharedIdentityTool;
  error: string;
  code: string;
  reason: string;
  hint: string;
}): MCPResponse {
  return createMCPErrorResponse({
    tool: args.tool,
    error: args.error,
    code: args.code,
    details: { reason: args.reason },
    recovery: {
      hint: args.hint,
    },
  });
}

/**
 * Resolve the shared-memory admin identity from server-owned configuration.
 */

export function resolveAdminActor(
  tool: SharedAdminTool,
): AdminActorResult {
  const configuredUserId = typeof process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID === 'string'
    ? process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID.trim()
    : '';
  const configuredAgentId = typeof process.env.SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID === 'string'
    ? process.env.SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID.trim()
    : '';
  const hasConfiguredUser = configuredUserId.length > 0;
  const hasConfiguredAgent = configuredAgentId.length > 0;
  if (!hasConfiguredUser && !hasConfiguredAgent) {
    return {
      ok: false,
      response: createMCPErrorResponse({
        tool,
        error: 'Shared-memory admin identity is not configured on the server.',
        code: 'E_AUTHORIZATION',
        details: { reason: 'shared_memory_admin_unconfigured' },
        recovery: {
          hint: 'Configure exactly one of SPECKIT_SHARED_MEMORY_ADMIN_USER_ID or SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID on the MCP server.',
        },
      }),
    };
  }

  if (hasConfiguredUser && hasConfiguredAgent) {
    return {
      ok: false,
      response: createMCPErrorResponse({
        tool,
        error: 'Shared-memory admin identity is ambiguously configured on the server.',
        code: 'E_INTERNAL',
        details: { reason: 'shared_memory_admin_ambiguous' },
        recovery: {
          hint: 'Configure only one server admin identity: SPECKIT_SHARED_MEMORY_ADMIN_USER_ID or SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID.',
        },
      }),
    };
  }

  if (hasConfiguredUser) {
    return {
      ok: true,
      actor: { subjectType: 'user', subjectId: configuredUserId },
    };
  }

  return {
    ok: true,
    actor: { subjectType: 'agent', subjectId: configuredAgentId },
  };
}

function validateSharedCallerIdentity(
  args: SharedCallerAuthArgs,
): SharedAdminActor {
  const userIdProvided = typeof args.actorUserId === 'string';
  const agentIdProvided = typeof args.actorAgentId === 'string';
  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
  const hasUser = normalizedUserId.length > 0;
  const hasAgent = normalizedAgentId.length > 0;

  if (hasBlankUser || hasBlankAgent) {
    throwSharedMemoryAuthError(
      'Actor identities must be non-empty, non-whitespace strings.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Actor identities must be non-empty, non-whitespace strings.',
        code: 'E_VALIDATION',
        reason: 'actor_identity_blank',
        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
      }),
    );
  }

  if (hasUser && hasAgent) {
    throwSharedMemoryAuthError(
      'Provide only one actor identity.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Provide only one actor identity.',
        code: 'E_VALIDATION',
        reason: 'actor_identity_ambiguous',
        hint: 'Send only actorUserId or actorAgentId, not both.',
      }),
    );
  }

  if (!hasUser && !hasAgent) {
    throwSharedMemoryAuthError(
      'Caller authentication is required for shared-memory operations.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Caller authentication is required for shared-memory operations.',
        code: 'E_AUTHENTICATION',
        reason: 'actor_identity_required',
        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
      }),
    );
  }

  return hasUser
    ? { subjectType: 'user', subjectId: normalizedUserId }
    : { subjectType: 'agent', subjectId: normalizedAgentId };
}

function isTrustedCallerIdentityBindingEnabled(): boolean {
  const value = process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().toLowerCase() === 'true';
}

export function validateCallerAuth(
  args: SharedAdminCallerAuthArgs,
  tenantId?: string,
): ValidatedCallerAuth {
  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';

  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
    throwSharedMemoryAuthError(
      'Tenant scope is required for shared-memory admin mutations.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Tenant scope is required for shared-memory admin mutations.',
        code: 'E_AUTHORIZATION',
        reason: 'shared_space_tenant_required',
        hint: 'Provide the tenantId for the target shared-space mutation.',
      }),
    );
  }

  const adminResult = resolveAdminActor(args.tool);
  if (!adminResult.ok) {
    throwSharedMemoryAuthError('Shared-memory admin validation failed.', adminResult.response);
  }

  if (!isTrustedCallerIdentityBindingEnabled()) {
    throwSharedMemoryAuthError(
      'Shared-memory admin mutations require trusted identity binding.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Shared-memory admin mutations require trusted identity binding.',
        code: 'E_AUTHORIZATION',
        reason: 'shared_memory_trusted_binding_required',
        hint: 'Set SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY=true only for trusted local transports.',
      }),
    );
  }

  // SECURITY: Actor IDs are caller-supplied and not cryptographically bound to
  // an authenticated session. In untrusted environments, wrap this handler
  // behind authenticated transport middleware.
  // Shared-memory tools do not currently receive a server-minted sessionId or
  // transport principal, so the trusted-session validation used by
  // memory_context/memory_match_triggers cannot be wired here yet.
  const actor = validateSharedCallerIdentity(args);

  return {
    actor,
    isAdmin: actor.subjectType === adminResult.actor.subjectType
      && actor.subjectId === adminResult.actor.subjectId,
  };
}

function buildActorScope(
  actor: SharedAdminActor,
  tenantId: string,
  sharedSpaceId?: string,
): {
  tenantId: string;
  sharedSpaceId?: string;
  userId?: string;
  agentId?: string;
} {
  return {
    tenantId,
    sharedSpaceId,
    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
  };
}

function recordSharedSpaceAdminAudit(
  database: ReturnType<typeof requireDb>,
  args: {
    actor: SharedAdminActor;
    tenantId: string;
    spaceId: string;
    decision: 'allow' | 'deny';
    operation: 'space_upsert' | 'membership_set';
    reason?: string;
    metadata?: Record<string, unknown>;
  },
): void {
  recordGovernanceAudit(database, {
    action: 'shared_space_admin',
    decision: args.decision,
    reason: args.reason ?? args.operation,
    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
    metadata: {
      operation: args.operation,
      actorSubjectType: args.actor.subjectType,
      actorSubjectId: args.actor.subjectId,
      ...(args.metadata ?? {}),
    },
  });
}

function getSharedSpaceAccessErrorMessage(
  tool: SharedSpaceAdminTool,
  spaceId: string,
  reason: string,
): string {
  switch (reason) {
    case 'shared_space_not_found':
      return `Shared space "${spaceId}" was not found.`;
    case 'shared_space_create_admin_required':
      return `Only the configured shared-memory admin can create shared space "${spaceId}".`;
    case 'shared_space_tenant_mismatch':
      return `Shared space "${spaceId}" belongs to a different tenant.`;
    case 'shared_space_owner_required':
      return tool === 'shared_space_membership_set'
        ? `Only a shared-space owner can update membership for "${spaceId}".`
        : `Only a shared-space owner can update "${spaceId}".`;
    case 'shared_space_editor_required':
      return `Editor access is required for "${spaceId}".`;
    case 'shared_space_membership_required':
      return `Membership is required to manage shared space "${spaceId}".`;
    case 'shared_space_kill_switch':
      return `Shared space "${spaceId}" is disabled by its kill switch.`;
    case 'shared_space_rollout_disabled':
      return `Shared space "${spaceId}" is not currently rolled out.`;
    case 'shared_space_tenant_required':
      return 'Tenant scope is required to manage shared spaces.';
    default:
      return `Shared space admin access denied for "${spaceId}".`;
  }
}

function normalizeOwnerAdminDenyReason(reason: string): string {
  return reason === 'shared_space_membership_required'
    ? 'shared_space_owner_required'
    : reason;
}

function createSharedSpaceAuthError(
  tool: SharedSpaceAdminTool,
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
        : reason === 'shared_space_create_admin_required'
          ? 'Authenticate as the configured shared-memory admin before creating a new shared space.'
        : 'Use the tenant owner identity for this shared space.',
    },
  });
}

function createSharedMemoryEnableAuthError(reason: string, error: string): MCPResponse {
  return createMCPErrorResponse({
    tool: 'shared_memory_enable',
    error,
    code: 'E_AUTHORIZATION',
    details: { reason },
    recovery: {
      hint: 'Authenticate as the configured shared-memory admin before enabling shared memory.',
    },
  });
}

function createSharedMemoryInternalError(
  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
  prefix: string,
  error: unknown,
  hint: string,
): MCPResponse {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[shared-memory] ${tool} failed: ${message}`);
  return createMCPErrorResponse({
    tool,
    error: prefix,
    code: 'E_INTERNAL',
    details: { reason: 'shared_memory_internal_error' },
    recovery: {
      hint,
    },
  });
}

let hasWarnedTrustedAdminIdentity = false;

function warnTrustedAdminIdentityAssumption(): void {
  if (!isTrustedCallerIdentityBindingEnabled()) {
    return;
  }
  if (hasWarnedTrustedAdminIdentity) {
    return;
  }
  hasWarnedTrustedAdminIdentity = true;
  console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport');
}

function getAllowedSharedSpaceIdsForCaller(
  database: ReturnType<typeof requireDb>,
  actor: SharedAdminActor,
  tenantId?: string,
): string[] {
  if (!isSharedMemoryEnabled(database)) {
    return [];
  }

  ensureSharedCollabRuntime(database);
  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
    ? tenantId.trim()
    : null;

  const rows = database.prepare(`
    SELECT DISTINCT m.space_id
    FROM shared_space_members m
    JOIN shared_spaces s ON s.space_id = m.space_id
    WHERE m.subject_type = ?
      AND m.subject_id = ?
      AND (? IS NULL OR s.tenant_id = ?)
      AND s.kill_switch = 0
      AND s.rollout_enabled = 1
  `).all(
    actor.subjectType,
    actor.subjectId,
    normalizedTenantId,
    normalizedTenantId,
  ) as Array<{ space_id: string }>;

  return rows.map((row) => row.space_id);
}

/**
 * Persist a shared-space definition for rollout and membership checks.
 *
 * @param args - Shared-space fields to create or update.
 * @returns MCP success response describing the saved shared space.
 */
export async function handleSharedSpaceUpsert(args: SharedSpaceUpsertArgs): Promise<MCPResponse> {
  try {
    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
    warnTrustedAdminIdentityAssumption();
    const db = requireDb();
    ensureSharedCollabRuntime(db);

    const enabled = isSharedMemoryEnabled(db);
    if (!enabled) {
      return createMCPErrorResponse({
        tool: 'shared_space_upsert',
        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
        code: 'SHARED_MEMORY_DISABLED',
      });
    }

    const { actor, isAdmin } = validateCallerAuth({
      tool: 'shared_space_upsert',
      actorUserId: args.actorUserId,
      actorAgentId: args.actorAgentId,
    }, args.tenantId);

    const result = db.transaction((): (
      | { success: true; created: boolean; ownerBootstrap: boolean; rolloutEnabled: boolean; killSwitch: boolean }
      | { error: string; msg: string; operationType: 'create' | 'update' }
    ) => {
      const existingSpace = db.prepare(`
        SELECT tenant_id, rollout_enabled, kill_switch
        FROM shared_spaces
        WHERE space_id = ?
        LIMIT 1
      `).get(args.spaceId) as {
        tenant_id?: string;
        rollout_enabled?: number;
        kill_switch?: number;
      } | undefined;

      if (existingSpace) {
        if (!isAdmin) {
          const access = assertSharedSpaceAccess(
            db,
            buildActorScope(actor, args.tenantId, args.spaceId),
            args.spaceId,
            'owner',
          );
          if (!access.allowed) {
            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
            recordSharedSpaceAdminAudit(db, {
              actor,
              tenantId: args.tenantId,
              spaceId: args.spaceId,
              decision: 'deny',
              operation: 'space_upsert',
              reason,
              metadata: {
                operationType: 'update',
                actorAuthRole: 'owner',
              },
            });
            return {
              error: reason,
              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
              operationType: 'update',
            };
          }
        }
      } else if (!isAdmin) {
        const reason = 'shared_space_create_admin_required';
        recordSharedSpaceAdminAudit(db, {
          actor,
          tenantId: args.tenantId,
          spaceId: args.spaceId,
          decision: 'deny',
          operation: 'space_upsert',
          reason,
          metadata: {
            operationType: 'create',
            actorAuthRole: 'non_admin',
          },
        });
        return {
          error: reason,
          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
          operationType: 'create',
        };
      }

      const definition = {
        spaceId: args.spaceId,
        tenantId: args.tenantId,
        name: args.name,
        rolloutEnabled: args.rolloutEnabled,
        rolloutCohort: args.rolloutCohort,
        killSwitch: args.killSwitch,
      };

      let created = false;
      let ownerBootstrap = false;

      if (existingSpace) {
        upsertSharedSpace(db, definition);
      } else {
        const createResult = createSharedSpaceIfAbsent(db, definition);
        created = createResult.created;
        ownerBootstrap = createResult.created;

        if (!createResult.created) {
          upsertSharedSpace(db, definition);
        }
      }

      if (ownerBootstrap) {
        upsertSharedMembership(db, {
          spaceId: args.spaceId,
          subjectType: actor.subjectType,
          subjectId: actor.subjectId,
          role: 'owner',
        });
      }

      const savedSpace = db.prepare(`
        SELECT rollout_enabled, kill_switch
        FROM shared_spaces
        WHERE space_id = ?
        LIMIT 1
      `).get(args.spaceId) as { rollout_enabled?: number; kill_switch?: number } | undefined;

      recordSharedSpaceAdminAudit(db, {
        actor,
        tenantId: args.tenantId,
        spaceId: args.spaceId,
        decision: 'allow',
        operation: 'space_upsert',
        reason: created ? 'space_created' : 'space_updated',
        metadata: {
          operationType: created ? 'create' : 'update',
          actorAuthRole: isAdmin ? 'admin' : 'owner',
          created,
          ownerBootstrap,
          rolloutEnabled: savedSpace?.rollout_enabled === 1,
          killSwitch: savedSpace?.kill_switch === 1,
        },
      });

      return {
        success: true,
        created,
        ownerBootstrap,
        rolloutEnabled: savedSpace?.rollout_enabled === 1,
        killSwitch: savedSpace?.kill_switch === 1,
      };
    })();

    if ('error' in result) {
      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
    }

    return createMCPSuccessResponse({
      tool: 'shared_space_upsert',
      summary: `Shared space "${args.spaceId}" saved`,
      data: {
        spaceId: args.spaceId,
        tenantId: args.tenantId,
        actorSubjectType: actor.subjectType,
        actorSubjectId: actor.subjectId,
        created: result.created,
        ownerBootstrap: result.ownerBootstrap,
        rolloutEnabled: result.rolloutEnabled,
        killSwitch: result.killSwitch,
      },
    });
  } catch (error: unknown) {
    if (error instanceof SharedMemoryAuthError) {
      return error.response;
    }

    return createSharedMemoryInternalError(
      'shared_space_upsert',
      'Shared space upsert failed',
      error,
      'Retry the operation. If the error persists, check database connectivity.',
    );
  }
}

/**
 * Persist membership for a user or agent within a shared space.
 *
 * @param args - Membership assignment to write.
 * @returns MCP success response describing the updated membership.
 */
export async function handleSharedSpaceMembershipSet(args: SharedSpaceMembershipArgs): Promise<MCPResponse> {
  try {
    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
    warnTrustedAdminIdentityAssumption();
    const db = requireDb();
    ensureSharedCollabRuntime(db);

    const enabled = isSharedMemoryEnabled(db);
    if (!enabled) {
      return createMCPErrorResponse({
        tool: 'shared_space_membership_set',
        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
        code: 'SHARED_MEMORY_DISABLED',
      });
    }

    const { actor, isAdmin } = validateCallerAuth({
      tool: 'shared_space_membership_set',
      actorUserId: args.actorUserId,
      actorAgentId: args.actorAgentId,
    }, args.tenantId);

    if (!isAdmin) {
      const access = assertSharedSpaceAccess(
        db,
        buildActorScope(actor, args.tenantId, args.spaceId),
        args.spaceId,
        'owner',
      );
      if (!access.allowed) {
        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
        try {
          recordSharedSpaceAdminAudit(db, {
            actor,
            tenantId: args.tenantId,
            spaceId: args.spaceId,
            decision: 'deny',
            operation: 'membership_set',
            reason,
            metadata: {
              operationType: 'membership_update',
              actorAuthRole: 'owner',
              subjectType: args.subjectType,
              subjectId: args.subjectId,
              role: args.role,
            },
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
        }
        return createSharedSpaceAuthError(
          'shared_space_membership_set',
          reason,
          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
        );
      }
    }

    db.transaction(() => {
      upsertSharedMembership(db, {
        spaceId: args.spaceId,
        subjectType: args.subjectType,
        subjectId: args.subjectId,
        role: args.role,
      });

      recordSharedSpaceAdminAudit(db, {
        actor,
        tenantId: args.tenantId,
        spaceId: args.spaceId,
        decision: 'allow',
        operation: 'membership_set',
        reason: 'membership_updated',
        metadata: {
          operationType: 'membership_update',
          actorAuthRole: isAdmin ? 'admin' : 'owner',
          subjectType: args.subjectType,
          subjectId: args.subjectId,
          role: args.role,
        },
      });
    })();

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
  } catch (error: unknown) {
    if (error instanceof SharedMemoryAuthError) {
      return error.response;
    }

    return createSharedMemoryInternalError(
      'shared_space_membership_set',
      'Shared space membership update failed',
      error,
      'Retry the operation. If the error persists, check database connectivity.',
    );
  }
}

/**
 * Report rollout status and visible shared spaces for the requested scope.
 *
 * @param args - Tenant, user, or agent scope to evaluate.
 * @returns MCP success response containing the enabled state and allowed spaces.
 */
export async function handleSharedMemoryStatus(args: SharedMemoryStatusArgs): Promise<MCPResponse> {
  try {
    const db = requireDb();
    const actor = validateSharedCallerIdentity({
      tool: 'shared_memory_status',
      actorUserId: args.actorUserId,
      actorAgentId: args.actorAgentId,
    });
    const enabled = isSharedMemoryEnabled(db);
    const allowedSharedSpaceIds = enabled
      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
      : [];
    return createMCPSuccessResponse({
      tool: 'shared_memory_status',
      summary: enabled
        ? `Shared memory enabled for ${allowedSharedSpaceIds.length} space(s)`
        : 'Shared memory disabled — run /memory:manage shared enable to set up',
      data: {
        enabled,
        allowedSharedSpaceIds,
        tenantId: args.tenantId ?? null,
        userId: actor.subjectType === 'user' ? actor.subjectId : null,
        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
        actorSubjectType: actor.subjectType,
        actorSubjectId: actor.subjectId,
      },
    });
  } catch (error: unknown) {
    if (error instanceof SharedMemoryAuthError) {
      return error.response;
    }

    return createSharedMemoryInternalError(
      'shared_memory_status',
      'Shared memory status failed',
      error,
      'Retry the operation. If the error persists, check database connectivity.',
    );
  }
}

/**
 * Enable the shared-memory subsystem via first-run setup.
 *
 * Idempotent: persists DB flag and creates README even if env-var override
 * already enables the runtime check. Subsequent calls that find both the
 * DB flag set and the README present return `alreadyEnabled: true`.
 */
export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
  try {
    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
    warnTrustedAdminIdentityAssumption();
    const { actor, isAdmin } = validateCallerAuth({
      tool: 'shared_memory_enable',
      actorUserId: typeof args.actorUserId === 'string' ? args.actorUserId : undefined,
      actorAgentId: typeof args.actorAgentId === 'string' ? args.actorAgentId : undefined,
    });
    if (!isAdmin) {
      return createSharedMemoryEnableAuthError(
        'shared_memory_enable_admin_required',
        'Only the configured shared-memory admin can enable shared memory.',
      );
    }

    const db = requireDb();

    // Check DB-level persistence (not runtime env-var) to decide idempotency.
    // This ensures env-var-only users still get DB persistence + README on first call.
    let dbAlreadyEnabled = false;
    try {
      const row = db.prepare('SELECT value FROM config WHERE key = ?')
        .get('shared_memory_enabled') as { value: string } | undefined;
      dbAlreadyEnabled = row?.value === 'true';
    } catch (error: unknown) {
      // config table may not exist yet
      const message = error instanceof Error ? error.message : String(error);
      void message;
    }

    if (dbAlreadyEnabled) {
      await createSharedSpacesReadme();
      return createMCPSuccessResponse({
        tool: 'shared_memory_enable',
        summary: 'Shared memory is already enabled',
        data: {
          alreadyEnabled: true,
          actorSubjectType: actor.subjectType,
          actorSubjectId: actor.subjectId,
        },
      });
    }

    ensureSharedCollabRuntime(db);
    enableSharedMemory(db);

    const readmeCreated = !await createSharedSpacesReadme();

    return createMCPSuccessResponse({
      tool: 'shared_memory_enable',
      summary: 'Shared memory enabled successfully',
      data: {
        alreadyEnabled: false,
        enabled: true,
        readmeCreated,
        actorSubjectType: actor.subjectType,
        actorSubjectId: actor.subjectId,
      },
    });
  } catch (error: unknown) {
    if (error instanceof SharedMemoryAuthError) {
      return error.response;
    }

    return createSharedMemoryInternalError(
      'shared_memory_enable',
      'Shared memory enable failed',
      error,
      'Retry the operation. If the error persists, check database connectivity.',
    );
  }
}

/**
 * Write a README into the shared-spaces directory (skip if already exists).
 *
 * @returns `true` when the file already existed (no write needed).
 */
async function createSharedSpacesReadme(): Promise<boolean> {
  const dir = path.resolve(import.meta.dirname, '../../shared-spaces');
  const readmePath = path.join(dir, 'README.md');
  try {
    await access(readmePath);
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    void message;
    // README does not exist yet.
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
| \`/memory:manage shared status\` | View rollout state and accessible spaces |
| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
| \`/memory:manage shared member <spaceId> <type> <id> <role>\` | Set membership; caller must already own the space |
| \`/memory:manage shared enable\` | Re-run first-time setup (idempotent) |

## Environment Overrides

Set \`SPECKIT_MEMORY_SHARED_MEMORY=true\` to force-enable shared memory regardless of database state.
`;

  await mkdir(dir, { recursive: true });
  await writeFile(readmePath, content, 'utf-8');
  return false;
}
