import type Database from 'better-sqlite3';
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
/**
 * Trim and normalize optional scope identifiers before enforcement.
 *
 * @param input - Scope values supplied by the caller.
 * @returns Scope with blank identifiers removed.
 */
export declare function normalizeScopeContext(input: ScopeContext): ScopeContext;
/**
 * Resolve whether scope filtering is active for the current process.
 * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
 * When enabled without scope constraints in the query, all results are rejected
 * (empty scope + enforcement = no access). Only enable when multi-tenant governance
 * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
 *
 * @returns `true` when scope enforcement is enabled.
 */
export declare function isScopeEnforcementEnabled(): boolean;
/**
 * Resolve whether governance guardrails are active for the current process.
 * Default: OFF — governance guardrails are opt-in via SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS=true.
 *
 * @returns `true` when governance guardrails are enabled.
 */
export declare function isGovernanceGuardrailsEnabled(): boolean;
/**
 * Determine whether an ingest request must pass governed-ingest validation.
 *
 * @param input - Candidate ingest metadata.
 * @returns `true` when governance or scope metadata requires enforcement.
 */
export declare function requiresGovernedIngest(input: GovernedIngestInput): boolean;
/**
 * Validate governed-ingest metadata and return normalized persistence fields.
 *
 * @param input - Candidate ingest metadata.
 * @returns Validation result with normalized scope, provenance, and retention data.
 */
export declare function validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision;
/**
 * Map a governance decision into memory-index column values.
 *
 * @param decision - Normalized governance decision from ingest validation.
 * @returns Column/value pairs used after memory insertion.
 */
export declare function buildGovernancePostInsertFields(decision: GovernanceDecision): Record<string, unknown>;
/**
 * Ensure governance and shared-space audit tables exist before writes.
 *
 * @param database - Database connection that stores governance state.
 */
export declare function ensureGovernanceRuntime(database: Database.Database): void;
/**
 * Persist a governance audit entry for enforcement decisions and lifecycle events.
 *
 * @param database - Database connection that stores governance state.
 * @param entry - Audit payload to persist.
 */
export declare function recordGovernanceAudit(database: Database.Database, entry: GovernanceAuditEntry): void;
/**
 * Determine whether a scope includes at least one concrete constraint.
 *
 * @param scope - Scope to inspect for tenant, actor, session, or shared-space bounds.
 * @returns `true` when the scope constrains access to at least one boundary.
 */
export declare function hasScopeConstraints(scope: ScopeContext): boolean;
/**
 * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
 *
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Predicate that returns `true` when a row remains visible.
 */
export declare function createScopeFilterPredicate<T extends Record<string, unknown>>(scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): (row: T) => boolean;
/**
 * Review governance audit rows and aggregate counts for a filtered governance window.
 *
 * @param database - Database connection that stores governance state.
 * @param filters - Optional audit filters and row limit.
 * @returns Review rows plus aggregate counts for the matching audit window.
 */
export declare function reviewGovernanceAudit(database: Database.Database, filters?: GovernanceAuditReviewFilters): GovernanceAuditReviewResult;
/**
 * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param options - Optional iterations and shared-space allowlist.
 * @returns Timing and match counts for the benchmark run.
 */
export declare function benchmarkScopeFilter<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, options?: ScopeFilterBenchmarkOptions): ScopeFilterBenchmarkResult;
/**
 * Filter result rows to the tenant, actor, session, and shared-space scope in force.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Rows that remain visible after governance filtering.
 */
export declare function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[];
//# sourceMappingURL=scope-governance.d.ts.map