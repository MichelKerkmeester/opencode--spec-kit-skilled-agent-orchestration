// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Spaces
// ───────────────────────────────────────────────────────────────
// Feature catalog: Shared-memory rollout, deny-by-default membership, and kill switch
// Shared-space definitions, membership management, rollout
// controls, conflict resolution, and collaboration metrics.
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

/**
 * Supported membership subject kinds for shared spaces.
 */
export type SharedSubjectType = 'user' | 'agent';

/**
 * Shared-space roles in descending permission order.
 */
export type SharedRole = 'owner' | 'editor' | 'viewer';

/**
 * Persisted shared-space definition used for rollout and tenancy checks.
 */
export interface SharedSpaceDefinition {
  spaceId: string;
  tenantId: string;
  name: string;
  rolloutEnabled?: boolean;
  rolloutCohort?: string | null;
  killSwitch?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Membership assignment for a user or agent within a shared space.
 */
export interface SharedMembership {
  spaceId: string;
  subjectType: SharedSubjectType;
  subjectId: string;
  role: SharedRole;
}

/**
 * Aggregate rollout metrics for shared spaces, memberships, and conflicts.
 */
export interface SharedRolloutMetrics {
  tenantId?: string;
  totalSpaces: number;
  rolloutEnabledSpaces: number;
  rolloutDisabledSpaces: number;
  killSwitchedSpaces: number;
  totalMemberships: number;
  totalConflicts: number;
  totalCohorts: number;
}

/**
 * Per-cohort summary used to review shared rollout coverage.
 */
export interface SharedRolloutCohortSummary {
  cohort: string | null;
  totalSpaces: number;
  rolloutEnabledSpaces: number;
  killSwitchedSpaces: number;
  membershipCount: number;
}

/**
 * Aggregate summary of conflict strategies used in shared spaces.
 */
export interface SharedConflictStrategySummary {
  strategy: string;
  totalConflicts: number;
  distinctLogicalKeys: number;
  latestCreatedAt: string | null;
}

const HIGH_RISK_CONFLICT_KINDS = new Set([
  'destructive_edit',
  'schema_mismatch',
  'semantic_divergence',
]);

function isDefaultOffFlagEnabled(...flagNames: string[]): boolean {
  for (const flagName of flagNames) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'true' || rawValue === '1') return true;
    if (rawValue === 'false' || rawValue === '0') return false;
  }
  return false;
}

function normalizeConflictKind(metadata: Record<string, unknown> | undefined): string | null {
  const value = metadata?.conflictKind;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function normalizeExplicitStrategy(metadata: Record<string, unknown> | undefined): string | null {
  const value = metadata?.strategy;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function resolveSharedConflictStrategy(
  database: Database.Database,
  args: {
    spaceId: string;
    logicalKey: string;
    metadata?: Record<string, unknown>;
  },
): { strategy: string; metadata: Record<string, unknown> | null } {
  const explicitStrategy = normalizeExplicitStrategy(args.metadata);
  const conflictKind = normalizeConflictKind(args.metadata);
  const priorConflictsRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM shared_space_conflicts
    WHERE space_id = ?
      AND logical_key = ?
  `).get(args.spaceId, args.logicalKey) as { count?: number } | undefined;
  const priorConflicts = typeof priorConflictsRow?.count === 'number' ? priorConflictsRow.count : 0;

  const strategy = explicitStrategy
    ?? (HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
      ? 'manual_merge'
      : priorConflicts > 0
        ? 'manual_merge'
        : 'append_version');
  const strategyReason = explicitStrategy
    ? 'explicit_metadata'
    : HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
      ? `high_risk:${conflictKind}`
      : priorConflicts > 0
        ? 'repeat_conflict'
        : 'default_append_only';

  return {
    strategy,
    metadata: {
      ...(args.metadata ?? {}),
      strategy,
      strategyReason,
      priorConflictCount: priorConflicts,
    },
  };
}

/**
 * Resolve whether shared-memory rollout is enabled for the process.
 *
 * Tier 1: Env var override (highest priority) — `SPECKIT_MEMORY_SHARED_MEMORY` or `SPECKIT_HYDRA_SHARED_MEMORY`.
 * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
 * Default: OFF (requires explicit enablement via env var or first-run setup).
 *
 * @param database - Optional database to check for persisted enablement state.
 * @returns `true` when shared-memory access is allowed at runtime.
 */
export function isSharedMemoryEnabled(database?: Database.Database): boolean {
  // Tier 1: Env var override (highest priority)
  if (isDefaultOffFlagEnabled('SPECKIT_MEMORY_SHARED_MEMORY', 'SPECKIT_HYDRA_SHARED_MEMORY')) {
    return true;
  }
  // Tier 2: Database config persistence
  if (database) {
    try {
      const row = database.prepare('SELECT value FROM config WHERE key = ?')
        .get('shared_memory_enabled') as { value: string } | undefined;
      return row?.value === 'true';
    } catch { return false; }
  }
  return false;
}

/**
 * Persist the shared-memory enabled state to the database config table.
 *
 * @param database - Database connection to write the config key.
 */
export function enableSharedMemory(database: Database.Database): void {
  database.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
  database.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)')
    .run('shared_memory_enabled', 'true');
}

/**
 * Ensure shared-space schema is available before collab operations run.
 *
 * @param database - Database connection that stores shared-space state.
 */
export function ensureSharedCollabRuntime(database: Database.Database): void {
  ensureSharedSpaceTables(database);
}

/**
 * Summarize shared-space rollout metrics for an optional tenant boundary.
 *
 * @param database - Database connection that stores shared-space state.
 * @param tenantId - Optional tenant to constrain the summary.
 * @returns Aggregate rollout, membership, and conflict counts.
 */
export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
  ensureSharedCollabRuntime(database);
  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;

  const spaceCounts = database.prepare(`
    SELECT
      COUNT(*) AS total_spaces,
      SUM(CASE WHEN rollout_enabled = 1 THEN 1 ELSE 0 END) AS rollout_enabled_spaces,
      SUM(CASE WHEN rollout_enabled = 0 THEN 1 ELSE 0 END) AS rollout_disabled_spaces,
      SUM(CASE WHEN kill_switch = 1 THEN 1 ELSE 0 END) AS kill_switched_spaces,
      COUNT(DISTINCT CASE
        WHEN rollout_cohort IS NOT NULL AND TRIM(rollout_cohort) <> ''
        THEN rollout_cohort
      END) AS total_cohorts
    FROM shared_spaces
    WHERE (? IS NULL OR tenant_id = ?)
  `).get(normalizedTenantId, normalizedTenantId) as {
    total_spaces: number;
    rollout_enabled_spaces: number | null;
    rollout_disabled_spaces: number | null;
    kill_switched_spaces: number | null;
    total_cohorts: number;
  };

  const membershipRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM shared_space_members m
    JOIN shared_spaces s ON s.space_id = m.space_id
    WHERE (? IS NULL OR s.tenant_id = ?)
  `).get(normalizedTenantId, normalizedTenantId) as { count: number };

  const conflictRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM shared_space_conflicts c
    JOIN shared_spaces s ON s.space_id = c.space_id
    WHERE (? IS NULL OR s.tenant_id = ?)
  `).get(normalizedTenantId, normalizedTenantId) as { count: number };

  return {
    tenantId: normalizedTenantId ?? undefined,
    totalSpaces: spaceCounts.total_spaces,
    rolloutEnabledSpaces: spaceCounts.rollout_enabled_spaces ?? 0,
    rolloutDisabledSpaces: spaceCounts.rollout_disabled_spaces ?? 0,
    killSwitchedSpaces: spaceCounts.kill_switched_spaces ?? 0,
    totalMemberships: membershipRow.count,
    totalConflicts: conflictRow.count,
    totalCohorts: spaceCounts.total_cohorts,
  };
}

/**
 * Summarize rollout cohorts for shared spaces within an optional tenant boundary.
 *
 * @param database - Database connection that stores shared-space state.
 * @param tenantId - Optional tenant to constrain the summary.
 * @returns Cohort-by-cohort rollout counts ordered for review.
 */
export function getSharedRolloutCohortSummary(
  database: Database.Database,
  tenantId?: string,
): SharedRolloutCohortSummary[] {
  ensureSharedCollabRuntime(database);
  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
  const spaces = database.prepare(`
    SELECT space_id, rollout_enabled, rollout_cohort, kill_switch
    FROM shared_spaces
    WHERE (? IS NULL OR tenant_id = ?)
    ORDER BY space_id ASC
  `).all(normalizedTenantId, normalizedTenantId) as Array<{
    space_id: string;
    rollout_enabled: number;
    rollout_cohort: string | null;
    kill_switch: number;
  }>;

  const membershipRows = database.prepare(`
    SELECT s.space_id, COUNT(m.subject_id) AS membership_count
    FROM shared_spaces s
    LEFT JOIN shared_space_members m ON m.space_id = s.space_id
    WHERE (? IS NULL OR s.tenant_id = ?)
    GROUP BY s.space_id
  `).all(normalizedTenantId, normalizedTenantId) as Array<{
    space_id: string;
    membership_count: number;
  }>;

  const membershipCounts = new Map<string, number>(
    membershipRows.map((row) => [row.space_id, row.membership_count]),
  );
  const summaryByCohort = new Map<string | null, SharedRolloutCohortSummary>();

  for (const space of spaces) {
    const cohort = typeof space.rollout_cohort === 'string' && space.rollout_cohort.trim().length > 0
      ? space.rollout_cohort
      : null;
    const existing = summaryByCohort.get(cohort) ?? {
      cohort,
      totalSpaces: 0,
      rolloutEnabledSpaces: 0,
      killSwitchedSpaces: 0,
      membershipCount: 0,
    };

    existing.totalSpaces += 1;
    if (space.rollout_enabled === 1) {
      existing.rolloutEnabledSpaces += 1;
    }
    if (space.kill_switch === 1) {
      existing.killSwitchedSpaces += 1;
    }
    existing.membershipCount += membershipCounts.get(space.space_id) ?? 0;
    summaryByCohort.set(cohort, existing);
  }

  return Array.from(summaryByCohort.values()).sort((left, right) => {
    if (left.cohort === null) return 1;
    if (right.cohort === null) return -1;
    return left.cohort.localeCompare(right.cohort);
  });
}

/**
 * Summarize how shared-space conflicts have been resolved by strategy.
 *
 * @param database - Database connection that stores shared-space state.
 * @param spaceId - Optional shared-space identifier to constrain the summary.
 * @returns Conflict counts grouped by strategy.
 */
export function getSharedConflictStrategySummary(
  database: Database.Database,
  spaceId?: string,
): SharedConflictStrategySummary[] {
  ensureSharedCollabRuntime(database);

  return database.prepare(`
    SELECT
      strategy,
      COUNT(*) AS total_conflicts,
      COUNT(DISTINCT logical_key) AS distinct_logical_keys,
      MAX(created_at) AS latest_created_at
    FROM shared_space_conflicts
    WHERE (? IS NULL OR space_id = ?)
    GROUP BY strategy
    ORDER BY total_conflicts DESC, strategy ASC
  `).all(spaceId ?? null, spaceId ?? null).map((row) => ({
    strategy: (row as { strategy: string }).strategy,
    totalConflicts: (row as { total_conflicts: number }).total_conflicts,
    distinctLogicalKeys: (row as { distinct_logical_keys: number }).distinct_logical_keys,
    latestCreatedAt: (row as { latest_created_at: string | null }).latest_created_at,
  }));
}

/**
 * Create or update a shared-space definition.
 *
 * @param database - Database connection that stores shared-space state.
 * @param definition - Shared-space values to persist.
 */
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

/**
 * Create or update a membership entry for a shared space.
 *
 * @param database - Database connection that stores shared-space state.
 * @param membership - Membership values to persist.
 */
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

/**
 * Collect the shared spaces visible to the provided user or agent scope.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope used to filter memberships and tenant boundaries.
 * @returns Shared-space identifiers the scope is allowed to see.
 */
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

/**
 * Enforce rollout, tenancy, and membership rules for shared-space access.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope requesting shared-space access.
 * @param spaceId - Shared-space identifier to validate.
 * @param requiredRole - Minimum role required for the attempted action.
 * @returns Allow or deny decision with a failure reason when blocked.
 */
export function assertSharedSpaceAccess(
  database: Database.Database,
  scope: ScopeContext,
  spaceId: string,
  requiredRole: SharedRole = 'viewer',
): { allowed: boolean; reason?: string } {
  ensureSharedCollabRuntime(database);
  const normalizedScope = normalizeScopeContext(scope);

  if (!isSharedMemoryEnabled(database)) {
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

/**
 * Record an append-version conflict for shared-memory writes and audit it.
 *
 * @param database - Database connection that stores shared-space state.
 * @param args - Conflict details used for shared and governance audits.
 */
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
  const resolved = resolveSharedConflictStrategy(database, args);
  database.prepare(`
    INSERT INTO shared_space_conflicts (
      space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    args.spaceId,
    args.logicalKey,
    args.existingMemoryId,
    args.incomingMemoryId,
    resolved.strategy,
    args.actor,
    resolved.metadata ? JSON.stringify(resolved.metadata) : null,
  );

  recordGovernanceAudit(database, {
    action: 'shared_conflict',
    decision: 'conflict',
    memoryId: args.incomingMemoryId,
    logicalKey: args.logicalKey,
    sharedSpaceId: args.spaceId,
    reason: resolved.strategy,
    metadata: resolved.metadata,
  });
}
