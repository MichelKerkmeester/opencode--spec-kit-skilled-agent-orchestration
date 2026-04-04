import type Database from 'better-sqlite3';
import { type ScopeContext } from '../governance/scope-governance.js';
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
export interface SharedSpaceWriteResult {
    created: boolean;
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
export declare function isSharedMemoryEnabled(database?: Database.Database): boolean;
/**
 * Persist the shared-memory enabled state to the database config table.
 *
 * @param database - Database connection to write the config key.
 */
export declare function enableSharedMemory(database: Database.Database): void;
/**
 * Ensure shared-space schema is available before collab operations run.
 *
 * @param database - Database connection that stores shared-space state.
 */
export declare function ensureSharedCollabRuntime(database: Database.Database): void;
/**
 * Summarize shared-space rollout metrics for an optional tenant boundary.
 *
 * @param database - Database connection that stores shared-space state.
 * @param tenantId - Optional tenant to constrain the summary.
 * @returns Aggregate rollout, membership, and conflict counts.
 */
export declare function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics;
/**
 * Summarize rollout cohorts for shared spaces within an optional tenant boundary.
 *
 * @param database - Database connection that stores shared-space state.
 * @param tenantId - Optional tenant to constrain the summary.
 * @returns Cohort-by-cohort rollout counts ordered for review.
 */
export declare function getSharedRolloutCohortSummary(database: Database.Database, tenantId?: string): SharedRolloutCohortSummary[];
/**
 * Summarize how shared-space conflicts have been resolved by strategy.
 *
 * @param database - Database connection that stores shared-space state.
 * @param spaceId - Optional shared-space identifier to constrain the summary.
 * @returns Conflict counts grouped by strategy.
 */
export declare function getSharedConflictStrategySummary(database: Database.Database, spaceId?: string): SharedConflictStrategySummary[];
export declare function createSharedSpaceIfAbsent(database: Database.Database, definition: SharedSpaceDefinition): SharedSpaceWriteResult;
export declare function upsertSharedSpace(database: Database.Database, definition: SharedSpaceDefinition): void;
/**
 * Create or update a membership entry for a shared space.
 *
 * @param database - Database connection that stores shared-space state.
 * @param membership - Membership values to persist.
 */
export declare function upsertSharedMembership(database: Database.Database, membership: SharedMembership): void;
/**
 * Collect the shared spaces visible to the provided user or agent scope.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope used to filter memberships and tenant boundaries.
 * @returns Shared-space identifiers the scope is allowed to see.
 */
export declare function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string>;
/**
 * Enforce rollout, tenancy, and membership rules for shared-space access.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope requesting shared-space access.
 * @param spaceId - Shared-space identifier to validate.
 * @param requiredRole - Minimum role required for the attempted action.
 * @returns Allow or deny decision with a failure reason when blocked.
 */
export declare function assertSharedSpaceAccess(database: Database.Database, scope: ScopeContext, spaceId: string, requiredRole?: SharedRole): {
    allowed: boolean;
    reason?: string;
};
/**
 * Record an append-version conflict for shared-memory writes and audit it.
 *
 * @param database - Database connection that stores shared-space state.
 * @param args - Conflict details used for shared and governance audits.
 */
export declare function recordSharedConflict(database: Database.Database, args: {
    spaceId: string;
    logicalKey: string;
    existingMemoryId: number | null;
    incomingMemoryId: number;
    actor: string;
    metadata?: Record<string, unknown>;
}): void;
//# sourceMappingURL=shared-spaces.d.ts.map