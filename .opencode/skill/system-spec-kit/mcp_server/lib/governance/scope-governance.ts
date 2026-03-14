import type Database from 'better-sqlite3';

import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema';

/**
 * Retention modes applied during governed ingest.
 */
export type RetentionPolicy = 'keep' | 'ephemeral' | 'shared';

/**
 * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
 */
export interface ScopeContext {
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  sharedSpaceId?: string;
}

/**
 * Governed-ingest fields required to persist scope and retention metadata.
 */
export interface GovernedIngestInput extends ScopeContext {
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: RetentionPolicy;
  deleteAfter?: string;
}

/**
 * Result of governed-ingest validation and field normalization.
 */
export interface GovernanceDecision {
  allowed: boolean;
  normalized: Required<Pick<GovernedIngestInput, 'tenantId' | 'sessionId' | 'provenanceSource' | 'provenanceActor' | 'governedAt' | 'retentionPolicy'>> & ScopeContext & { deleteAfter: string | null };
  reason?: string;
  issues: string[];
}

/**
 * Audit payload written for allow, deny, delete, and conflict events.
 */
export interface GovernanceAuditEntry extends ScopeContext {
  action: string;
  decision: 'allow' | 'deny' | 'delete' | 'conflict';
  memoryId?: number | null;
  logicalKey?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
}

function normalizeId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Trim and normalize optional scope identifiers before enforcement.
 *
 * @param input - Scope values supplied by the caller.
 * @returns Scope with blank identifiers removed.
 */
export function normalizeScopeContext(input: ScopeContext): ScopeContext {
  return {
    tenantId: normalizeId(input.tenantId),
    userId: normalizeId(input.userId),
    agentId: normalizeId(input.agentId),
    sessionId: normalizeId(input.sessionId),
    sharedSpaceId: normalizeId(input.sharedSpaceId),
  };
}

/**
 * Resolve whether scope filtering is active for the current process.
 *
 * @returns `true` when scope enforcement is enabled.
 */
export function isScopeEnforcementEnabled(): boolean {
  return process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT === 'true'
    || process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT === 'true';
}

/**
 * Resolve whether governance guardrails are active for the current process.
 *
 * @returns `true` when governance guardrails are enabled.
 */
export function isGovernanceGuardrailsEnabled(): boolean {
  return process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS === 'true'
    || process.env.SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS === 'true';
}

/**
 * Determine whether an ingest request must pass governed-ingest validation.
 *
 * @param input - Candidate ingest metadata.
 * @returns `true` when governance or scope metadata requires enforcement.
 */
export function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return isGovernanceGuardrailsEnabled()
    || isScopeEnforcementEnabled()
    || Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.deleteAfter === 'string';
}

/**
 * Validate governed-ingest metadata and return normalized persistence fields.
 *
 * @param input - Candidate ingest metadata.
 * @returns Validation result with normalized scope, provenance, and retention data.
 */
export function validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision {
  const scope = normalizeScopeContext(input);
  const issues: string[] = [];
  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
    ? input.retentionPolicy
    : 'keep';
  const provenanceSource = normalizeId(input.provenanceSource) ?? '';
  const provenanceActor = normalizeId(input.provenanceActor) ?? '';

  if (!requiresGovernedIngest(input)) {
    return {
      allowed: true,
      normalized: {
        tenantId: scope.tenantId ?? '',
        userId: scope.userId,
        agentId: scope.agentId,
        sessionId: scope.sessionId ?? '',
        sharedSpaceId: scope.sharedSpaceId,
        provenanceSource,
        provenanceActor,
        governedAt,
        retentionPolicy,
        deleteAfter,
      },
      issues,
    };
  }

  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
    issues.push('deleteAfter must be later than governedAt');
  }

  return {
    allowed: issues.length === 0,
    reason: issues[0],
    issues,
    normalized: {
      tenantId: scope.tenantId ?? '',
      userId: scope.userId,
      agentId: scope.agentId,
      sessionId: scope.sessionId ?? '',
      sharedSpaceId: scope.sharedSpaceId,
      provenanceSource,
      provenanceActor,
      governedAt,
      retentionPolicy,
      deleteAfter,
    },
  };
}

/**
 * Map a governance decision into memory-index column values.
 *
 * @param decision - Normalized governance decision from ingest validation.
 * @returns Column/value pairs used after memory insertion.
 */
export function buildGovernancePostInsertFields(decision: GovernanceDecision): Record<string, unknown> {
  return {
    tenant_id: decision.normalized.tenantId || null,
    user_id: decision.normalized.userId ?? null,
    agent_id: decision.normalized.agentId ?? null,
    shared_space_id: decision.normalized.sharedSpaceId ?? null,
    provenance_source: decision.normalized.provenanceSource || null,
    provenance_actor: decision.normalized.provenanceActor || null,
    governed_at: decision.normalized.governedAt,
    retention_policy: decision.normalized.retentionPolicy,
    delete_after: decision.normalized.deleteAfter,
    governance_metadata: JSON.stringify({
      tenantId: decision.normalized.tenantId || null,
      userId: decision.normalized.userId ?? null,
      agentId: decision.normalized.agentId ?? null,
      sessionId: decision.normalized.sessionId || null,
      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
      provenanceSource: decision.normalized.provenanceSource || null,
      provenanceActor: decision.normalized.provenanceActor || null,
      governedAt: decision.normalized.governedAt,
      retentionPolicy: decision.normalized.retentionPolicy,
      deleteAfter: decision.normalized.deleteAfter,
    }),
  };
}

/**
 * Ensure governance and shared-space audit tables exist before writes.
 *
 * @param database - Database connection that stores governance state.
 */
export function ensureGovernanceRuntime(database: Database.Database): void {
  ensureGovernanceTables(database);
  ensureSharedSpaceTables(database);
}

/**
 * Persist a governance audit entry for enforcement decisions and lifecycle events.
 *
 * @param database - Database connection that stores governance state.
 * @param entry - Audit payload to persist.
 */
export function recordGovernanceAudit(database: Database.Database, entry: GovernanceAuditEntry): void {
  ensureGovernanceRuntime(database);
  const scope = normalizeScopeContext(entry);
  database.prepare(`
    INSERT INTO governance_audit (
      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
      shared_space_id, reason, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    entry.action,
    entry.decision,
    entry.memoryId ?? null,
    entry.logicalKey ?? null,
    scope.tenantId ?? null,
    scope.userId ?? null,
    scope.agentId ?? null,
    scope.sessionId ?? null,
    scope.sharedSpaceId ?? null,
    entry.reason ?? null,
    entry.metadata ? JSON.stringify(entry.metadata) : null,
  );
}

function matchesExactScope(rowValue: unknown, requestedValue?: string): boolean {
  if (!requestedValue) return true;
  return typeof rowValue === 'string' && rowValue === requestedValue;
}

/**
 * Filter result rows to the tenant, actor, session, and shared-space scope in force.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Rows that remain visible after governance filtering.
 */
export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
  const normalized = normalizeScopeContext(scope);
  if (
    !isScopeEnforcementEnabled()
    && !normalized.sharedSpaceId
    && !normalized.tenantId
    && !normalized.userId
    && !normalized.agentId
    && !normalized.sessionId
  ) {
    return rows;
  }

  return rows.filter((row) => {
    const rowSharedSpaceId = normalizeId(row.shared_space_id);
    if (rowSharedSpaceId) {
      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
        return false;
      }
      if (allowedSharedSpaceIds && !allowedSharedSpaceIds.has(rowSharedSpaceId)) {
        return false;
      }
    } else if (normalized.sharedSpaceId) {
      return false;
    }

    return matchesExactScope(row.tenant_id, normalized.tenantId)
      && matchesExactScope(row.user_id, normalized.userId)
      && matchesExactScope(row.agent_id, normalized.agentId)
      && matchesExactScope(row.session_id, normalized.sessionId);
  });
}
