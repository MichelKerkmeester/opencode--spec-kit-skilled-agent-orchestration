// ───────────────────────────────────────────────────────────────
// MODULE: Retention Policy
// ───────────────────────────────────────────────────────────────
// Scoped retention sweeps that delete expired memories and
// record governance audit entries for each deletion event.
import type Database from 'better-sqlite3';

import { delete_memory_from_database } from '../search/vector-index-mutations';
import {
  ensureGovernanceRuntime,
  filterRowsByScope,
  hasScopeConstraints,
  isScopeEnforcementEnabled,
  recordGovernanceAudit,
  type ScopeContext,
} from './scope-governance';
import { getAllowedSharedSpaceIds } from '../collab/shared-spaces';

// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit


/**
 * Outcome of a retention sweep scoped to the caller's governance filters.
 */
export interface RetentionSweepResult {
  scanned: number;
  deleted: number;
  skipped: number;
  failed?: number;
  deletedIds: number[];
}

/**
 * Delete memories whose `delete_after` timestamp has expired for the requested scope.
 *
 * @param database - Database connection that stores memory and governance state.
 * @param scope - Scope used to constrain eligible deletions.
 * @param options - Optional sweep controls for privileged operations.
 * @returns Sweep counts and the identifiers deleted during the run.
 */
export function runRetentionSweep(
  database: Database.Database,
  scope: ScopeContext = {},
  options?: { adminOverride?: boolean },
): RetentionSweepResult {
  ensureGovernanceRuntime(database);
  const hasScopedConstraints = hasScopeConstraints(scope);
  if (isScopeEnforcementEnabled() && !hasScopedConstraints && !options?.adminOverride) {
    // BUG-002 fix: Prevent unscoped retention sweeps from touching cross-tenant data.
    return { scanned: 0, deleted: 0, skipped: 0, deletedIds: [] };
  }
  if (options?.adminOverride) {
    try {
      recordGovernanceAudit(database, {
        action: 'retention_sweep',
        decision: 'allow',
        reason: 'admin_override_global_sweep',
        metadata: {
          adminOverride: true,
          scopeEnforcement: isScopeEnforcementEnabled(),
        },
      });
    } catch (error: unknown) {
      console.error(
        'Retention sweep: failed to record admin override audit:',
        error instanceof Error ? error.message : error,
      );
    }
  }
  const expiredRows = database.prepare(`
    SELECT id, tenant_id, user_id, agent_id, session_id, shared_space_id
    FROM memory_index
    WHERE delete_after IS NOT NULL
      AND datetime(delete_after) <= datetime('now')
    ORDER BY delete_after ASC, id ASC
  `).all() as Array<Record<string, unknown> & { id: number }>;
  const rows = options?.adminOverride && !hasScopedConstraints
    ? expiredRows
    : filterRowsByScope(
      expiredRows,
      scope,
      getAllowedSharedSpaceIds(database, scope),
    );

  const result: RetentionSweepResult = {
    scanned: rows.length,
    deleted: 0,
    skipped: 0,
    deletedIds: [],
  };

  for (const row of rows) {
    try {
      // A8: Wrap delete + audit in a per-memory transaction for atomicity.
      const sweepOne = database.transaction(() => {
        const deleted = delete_memory_from_database(database, row.id);
        if (deleted) {
          recordGovernanceAudit(database, {
            action: 'retention_sweep',
            decision: 'delete',
            memoryId: row.id,
            tenantId: typeof row.tenant_id === 'string' ? row.tenant_id : scope.tenantId,
            userId: typeof row.user_id === 'string' ? row.user_id : scope.userId,
            agentId: typeof row.agent_id === 'string' ? row.agent_id : scope.agentId,
            sessionId: typeof row.session_id === 'string' ? row.session_id : scope.sessionId,
            sharedSpaceId: typeof row.shared_space_id === 'string' ? row.shared_space_id : scope.sharedSpaceId,
            reason: 'delete_after_expired',
          });
        }
        return deleted;
      });
      const deleted = sweepOne();
      if (deleted) {
        result.deleted += 1;
        result.deletedIds.push(row.id);
        continue;
      }

      result.skipped += 1;
    } catch (error: unknown) {
      result.failed = (result.failed || 0) + 1;
      console.error(
        `Retention sweep: failed to process row ${row.id}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return result;
}
