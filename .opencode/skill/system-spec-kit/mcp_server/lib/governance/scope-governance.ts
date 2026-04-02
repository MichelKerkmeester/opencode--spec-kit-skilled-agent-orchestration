// ───────────────────────────────────────────────────────────────
// MODULE: Scope Governance
// ───────────────────────────────────────────────────────────────
// Hierarchical scope enforcement, governed ingest validation,
// provenance normalization, and governance audit persistence.
import type Database from 'better-sqlite3';

import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema.js';

// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit


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
// R5: Simplified normalized type — previously a complex intersection.
export interface GovernanceNormalized {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
  sharedSpaceId?: string | null;
  provenanceSource: string | null;
  provenanceActor: string | null;
  governedAt: string;
  retentionPolicy: RetentionPolicy;
  deleteAfter: string | null;
}

export interface GovernanceDecision {
  allowed: boolean;
  normalized: GovernanceNormalized;
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

/**
 * Filters used to review governance audit history.
 */
export interface GovernanceAuditReviewFilters extends ScopeContext {
  action?: string;
  decision?: GovernanceAuditEntry['decision'];
  limit?: number;
  allowUnscoped?: boolean;
}

/**
 * Parsed governance audit row returned for review workflows.
 */
export interface GovernanceAuditReviewRow extends ScopeContext {
  id: number;
  action: string;
  decision: GovernanceAuditEntry['decision'];
  memoryId: number | null;
  logicalKey: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Aggregate view of governance audit activity for a filtered review.
 */
export interface GovernanceAuditReviewSummary {
  totalMatching: number;
  returnedRows: number;
  byAction: Record<string, number>;
  byDecision: Partial<Record<GovernanceAuditEntry['decision'], number>>;
  latestCreatedAt: string | null;
}

/**
 * Combined governance audit review rows and summary.
 */
export interface GovernanceAuditReviewResult {
  rows: GovernanceAuditReviewRow[];
  summary: GovernanceAuditReviewSummary;
}

/**
 * Options used when benchmarking scope-filter behavior.
 */
export interface ScopeFilterBenchmarkOptions {
  iterations?: number;
  allowedSharedSpaceIds?: ReadonlySet<string>;
}

/**
 * Benchmark result for a scope filter predicate.
 */
export interface ScopeFilterBenchmarkResult {
  iterations: number;
  totalRows: number;
  matchedRows: number;
  filteredRows: number;
  elapsedMs: number;
  averageMsPerIteration: number;
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
 * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
 * When enabled without scope constraints in the query, all results are rejected
 * (empty scope + enforcement = no access). Only enable when multi-tenant governance
 * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
 *
 * @returns `true` when scope enforcement is enabled.
 */
export function isScopeEnforcementEnabled(): boolean {
  const flagValue = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT?.trim().toLowerCase()
    ?? process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT?.trim().toLowerCase();
  return flagValue === 'true' || flagValue === '1';
}

/**
 * Resolve whether governance guardrails are active for the current process.
 * Default: OFF — governance guardrails are opt-in via SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS=true.
 *
 * @returns `true` when governance guardrails are enabled.
 */
export function isGovernanceGuardrailsEnabled(): boolean {
  const flagValue = process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS?.trim().toLowerCase()
    ?? process.env.SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS?.trim().toLowerCase();
  return flagValue === 'true' || flagValue === '1';
}

/**
 * Determine whether an ingest request must pass governed-ingest validation.
 *
 * @param input - Candidate ingest metadata.
 * @returns `true` when governance or scope metadata requires enforcement.
 */
export function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.governedAt === 'string'
    || input.retentionPolicy === 'ephemeral'
    || input.retentionPolicy === 'shared'
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
    // B8: Return null instead of empty string for optional scope fields
    // when governance is not required, to avoid persisting false-y placeholders.
    return {
      allowed: true,
      normalized: {
        tenantId: scope.tenantId || null,
        userId: scope.userId || null,
        agentId: scope.agentId || null,
        sessionId: scope.sessionId || null,
        sharedSpaceId: scope.sharedSpaceId || null,
        provenanceSource: provenanceSource || null,
        provenanceActor: provenanceActor || null,
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
  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
  // Without this, ephemeral rows are never swept since sweeps key off delete_after
  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
    issues.push('deleteAfter is required for ephemeral retention policy');
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
    session_id: decision.normalized.sessionId || null,
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
 * Determine whether a scope includes at least one concrete constraint.
 *
 * @param scope - Scope to inspect for tenant, actor, session, or shared-space bounds.
 * @returns `true` when the scope constrains access to at least one boundary.
 */
export function hasScopeConstraints(scope: ScopeContext): boolean {
  return Boolean(
    scope.sharedSpaceId
    || scope.tenantId
    || scope.userId
    || scope.agentId
    || scope.sessionId,
  );
}

function parseAuditMetadata(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return null;
    }
    return null;
  }

  return null;
}

function buildGovernanceAuditWhereClause(filters: GovernanceAuditReviewFilters): { whereSql: string; params: unknown[] } {
  const normalized = normalizeScopeContext(filters);
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.action) {
    clauses.push('action = ?');
    params.push(filters.action);
  }
  if (filters.decision) {
    clauses.push('decision = ?');
    params.push(filters.decision);
  }
  if (normalized.tenantId) {
    clauses.push('tenant_id = ?');
    params.push(normalized.tenantId);
  }
  if (normalized.userId) {
    clauses.push('user_id = ?');
    params.push(normalized.userId);
  }
  if (normalized.agentId) {
    clauses.push('agent_id = ?');
    params.push(normalized.agentId);
  }
  if (normalized.sessionId) {
    clauses.push('session_id = ?');
    params.push(normalized.sessionId);
  }
  if (normalized.sharedSpaceId) {
    clauses.push('shared_space_id = ?');
    params.push(normalized.sharedSpaceId);
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}

function hasGovernanceAuditFilters(filters: GovernanceAuditReviewFilters): boolean {
  const normalized = normalizeScopeContext(filters);
  return Boolean(
    filters.action
    || filters.decision
    || normalized.tenantId
    || normalized.userId
    || normalized.agentId
    || normalized.sessionId
    || normalized.sharedSpaceId
  );
}

/**
 * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
 *
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Predicate that returns `true` when a row remains visible.
 */
export function createScopeFilterPredicate<T extends Record<string, unknown>>(
  scope: ScopeContext,
  allowedSharedSpaceIds?: ReadonlySet<string>,
): (row: T) => boolean {
  const normalized = normalizeScopeContext(scope);
  if (!isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
    return () => true;
  }
  if (isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
    return () => false;
  }

  return (row: T) => {
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

    // H8 FIX: When a row belongs to an allowed shared space, use membership as
    // the access boundary — don't require exact actor/session match, which would
    // block collaborator B from seeing collaborator A's shared memories.
    if (rowSharedSpaceId && allowedSharedSpaceIds?.has(rowSharedSpaceId)) {
      return matchesExactScope(row.tenant_id, normalized.tenantId);
    }

    return matchesExactScope(row.tenant_id, normalized.tenantId)
      && matchesExactScope(row.user_id, normalized.userId)
      && matchesExactScope(row.agent_id, normalized.agentId)
      && matchesExactScope(row.session_id, normalized.sessionId);
  };
}

/**
 * Review governance audit rows and aggregate counts for a filtered governance window.
 *
 * @param database - Database connection that stores governance state.
 * @param filters - Optional audit filters and row limit.
 * @returns Review rows plus aggregate counts for the matching audit window.
 */
export function reviewGovernanceAudit(
  database: Database.Database,
  filters: GovernanceAuditReviewFilters = {},
): GovernanceAuditReviewResult {
  ensureGovernanceRuntime(database);
  const allowUnscoped = filters.allowUnscoped === true;
  // Security: audit enumeration requires explicit scope filters or admin override
  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
    return {
      rows: [],
      summary: {
        totalMatching: 0,
        returnedRows: 0,
        byAction: {},
        byDecision: {},
        latestCreatedAt: null,
      },
    };
  }
  const { whereSql, params } = buildGovernanceAuditWhereClause(filters);
  const limit = Number.isInteger(filters.limit) && (filters.limit ?? 0) > 0
    ? Math.trunc(filters.limit as number)
    : 50;

  const rows = database.prepare(`
    SELECT
      id,
      action,
      decision,
      memory_id,
      logical_key,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id,
      reason,
      metadata,
      created_at
    FROM governance_audit
    ${whereSql}
    ORDER BY id DESC
    LIMIT ?
  `).all(...params, limit) as Array<{
    id: number;
    action: string;
    decision: GovernanceAuditEntry['decision'];
    memory_id: number | null;
    logical_key: string | null;
    tenant_id: string | null;
    user_id: string | null;
    agent_id: string | null;
    session_id: string | null;
    shared_space_id: string | null;
    reason: string | null;
    metadata: string | null;
    created_at: string;
  }>;

  const summaryRow = database.prepare(`
    SELECT
      COUNT(*) AS total_matching,
      MAX(created_at) AS latest_created_at
    FROM governance_audit
    ${whereSql}
  `).get(...params) as {
    total_matching: number;
    latest_created_at: string | null;
  };
  const aggregateRows = database.prepare(`
    SELECT
      'action' AS aggregate_kind,
      action AS aggregate_key,
      COUNT(*) AS aggregate_count
    FROM governance_audit
    ${whereSql}
    GROUP BY action
    UNION ALL
    SELECT
      'decision' AS aggregate_kind,
      decision AS aggregate_key,
      COUNT(*) AS aggregate_count
    FROM governance_audit
    ${whereSql}
    GROUP BY decision
  `).all(...params, ...params) as Array<{
    aggregate_kind: 'action' | 'decision';
    aggregate_key: string;
    aggregate_count: number;
  }>;

  const totalMatching = summaryRow.total_matching;
  const byActionRows = aggregateRows.filter((row) => row.aggregate_kind === 'action');
  const byDecisionRows = aggregateRows.filter((row) => row.aggregate_kind === 'decision');

  return {
    rows: rows.map((row) => ({
      id: row.id,
      action: row.action,
      decision: row.decision,
      memoryId: row.memory_id,
      logicalKey: row.logical_key,
      tenantId: row.tenant_id ?? undefined,
      userId: row.user_id ?? undefined,
      agentId: row.agent_id ?? undefined,
      sessionId: row.session_id ?? undefined,
      sharedSpaceId: row.shared_space_id ?? undefined,
      reason: row.reason,
      metadata: parseAuditMetadata(row.metadata),
      createdAt: row.created_at,
    })),
    summary: {
      totalMatching,
      returnedRows: rows.length,
      byAction: Object.fromEntries(byActionRows.map((row) => [row.aggregate_key, row.aggregate_count])),
      byDecision: Object.fromEntries(byDecisionRows.map((row) => [row.aggregate_key as GovernanceAuditEntry['decision'], row.aggregate_count])),
      latestCreatedAt: summaryRow.latest_created_at,
    },
  };
}

/**
 * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param options - Optional iterations and shared-space allowlist.
 * @returns Timing and match counts for the benchmark run.
 */
export function benchmarkScopeFilter<T extends Record<string, unknown>>(
  rows: T[],
  scope: ScopeContext,
  options: ScopeFilterBenchmarkOptions = {},
): ScopeFilterBenchmarkResult {
  const iterations = Number.isInteger(options.iterations) && (options.iterations ?? 0) > 0
    ? Math.trunc(options.iterations as number)
    : 1;
  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
  let matchedRows = 0;
  const startedAt = process.hrtime.bigint();

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    matchedRows = 0;
    for (const row of rows) {
      if (predicate(row)) {
        matchedRows += 1;
      }
    }
  }

  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  return {
    iterations,
    totalRows: rows.length,
    matchedRows,
    filteredRows: rows.length - matchedRows,
    elapsedMs,
    averageMsPerIteration: elapsedMs / iterations,
  };
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
  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
}
