import type Database from 'better-sqlite3';

import {
  ensureSharedSpaceTables,
} from '../search/vector-index-schema';

import {
  isGovernanceGuardrailsEnabled,
  normalizeScopeContext,
  recordGovernanceAudit,
  type ScopeContext,
} from '../governance/scope-governance';

export type SharedSubjectType = 'user' | 'agent';
export type SharedRole = 'owner' | 'editor' | 'viewer';

export interface SharedSpaceDefinition {
  spaceId: string;
  tenantId: string;
  name: string;
  rolloutEnabled?: boolean;
  rolloutCohort?: string | null;
  killSwitch?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SharedMembership {
  spaceId: string;
  subjectType: SharedSubjectType;
  subjectId: string;
  role: SharedRole;
}

export function isSharedMemoryEnabled(): boolean {
  return process.env.SPECKIT_MEMORY_SHARED_MEMORY === 'true'
    || process.env.SPECKIT_HYDRA_SHARED_MEMORY === 'true';
}

export function ensureSharedCollabRuntime(database: Database.Database): void {
  ensureSharedSpaceTables(database);
}

export function upsertSharedSpace(database: Database.Database, definition: SharedSpaceDefinition): void {
  ensureSharedCollabRuntime(database);
  database.prepare(`
    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(space_id) DO UPDATE SET
      tenant_id = excluded.tenant_id,
      name = excluded.name,
      rollout_enabled = excluded.rollout_enabled,
      rollout_cohort = excluded.rollout_cohort,
      kill_switch = excluded.kill_switch,
      metadata = excluded.metadata,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    definition.spaceId,
    definition.tenantId,
    definition.name,
    definition.rolloutEnabled ? 1 : 0,
    definition.rolloutCohort ?? null,
    definition.killSwitch ? 1 : 0,
    definition.metadata ? JSON.stringify(definition.metadata) : null,
  );
}

export function upsertSharedMembership(database: Database.Database, membership: SharedMembership): void {
  ensureSharedCollabRuntime(database);
  database.prepare(`
    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(space_id, subject_type, subject_id) DO UPDATE SET
      role = excluded.role,
      updated_at = CURRENT_TIMESTAMP
  `).run(membership.spaceId, membership.subjectType, membership.subjectId, membership.role);
}

export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
  ensureSharedCollabRuntime(database);
  const normalizedScope = normalizeScopeContext(scope);
  const ids = new Set<string>();
  const candidates: Array<[SharedSubjectType, string | undefined]> = [
    ['user', normalizedScope.userId],
    ['agent', normalizedScope.agentId],
  ];

  for (const [subjectType, subjectId] of candidates) {
    if (!subjectId) continue;
    const rows = database.prepare(`
      SELECT m.space_id
      FROM shared_space_members m
      JOIN shared_spaces s ON s.space_id = m.space_id
      WHERE m.subject_type = ?
        AND m.subject_id = ?
        AND (? IS NULL OR s.tenant_id = ?)
        AND s.kill_switch = 0
        AND s.rollout_enabled = 1
    `).all(
      subjectType,
      subjectId,
      normalizedScope.tenantId ?? null,
      normalizedScope.tenantId ?? null,
    ) as Array<{ space_id: string }>;
    for (const row of rows) {
      ids.add(row.space_id);
    }
  }

  return ids;
}

export function assertSharedSpaceAccess(
  database: Database.Database,
  scope: ScopeContext,
  spaceId: string,
  requiredRole: SharedRole = 'viewer',
): { allowed: boolean; reason?: string } {
  ensureSharedCollabRuntime(database);
  const normalizedScope = normalizeScopeContext(scope);

  if (!isSharedMemoryEnabled()) {
    return { allowed: false, reason: 'shared_memory_disabled' };
  }

  const space = database.prepare(`
    SELECT tenant_id, rollout_enabled, kill_switch
    FROM shared_spaces
    WHERE space_id = ?
  `).get(spaceId) as { tenant_id?: string; rollout_enabled?: number; kill_switch?: number } | undefined;

  if (!space) {
    return { allowed: false, reason: 'shared_space_not_found' };
  }
  if (space.kill_switch === 1) {
    return { allowed: false, reason: 'shared_space_kill_switch' };
  }
  if (space.rollout_enabled !== 1) {
    return { allowed: false, reason: 'shared_space_rollout_disabled' };
  }
  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
    return { allowed: false, reason: 'shared_space_tenant_mismatch' };
  }
  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
    return { allowed: false, reason: 'shared_space_tenant_required' };
  }

  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
  if (!allowed.has(spaceId)) {
    return { allowed: false, reason: 'shared_space_membership_required' };
  }

  if (requiredRole === 'viewer') {
    return { allowed: true };
  }

  const membership = database.prepare(`
    SELECT role
    FROM shared_space_members
    WHERE space_id = ?
      AND (
        (subject_type = 'user' AND subject_id = ?)
        OR
        (subject_type = 'agent' AND subject_id = ?)
      )
    ORDER BY CASE role
      WHEN 'owner' THEN 1
      WHEN 'editor' THEN 2
      ELSE 3
    END ASC
    LIMIT 1
  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;

  const role = membership?.role;
  if (!role) {
    return { allowed: false, reason: 'shared_space_membership_required' };
  }
  if (requiredRole === 'editor' && role === 'viewer') {
    return { allowed: false, reason: 'shared_space_editor_required' };
  }

  return { allowed: true };
}

export function recordSharedConflict(
  database: Database.Database,
  args: {
    spaceId: string;
    logicalKey: string;
    existingMemoryId: number | null;
    incomingMemoryId: number;
    actor: string;
    metadata?: Record<string, unknown>;
  }
): void {
  ensureSharedCollabRuntime(database);
  database.prepare(`
    INSERT INTO shared_space_conflicts (
      space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    args.spaceId,
    args.logicalKey,
    args.existingMemoryId,
    args.incomingMemoryId,
    'append_version',
    args.actor,
    args.metadata ? JSON.stringify(args.metadata) : null,
  );

  recordGovernanceAudit(database, {
    action: 'shared_conflict',
    decision: 'conflict',
    memoryId: args.incomingMemoryId,
    logicalKey: args.logicalKey,
    sharedSpaceId: args.spaceId,
    reason: 'append_version',
    metadata: args.metadata ?? null,
  });
}
