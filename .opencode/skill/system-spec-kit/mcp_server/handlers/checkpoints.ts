// ────────────────────────────────────────────────────────────────
// MODULE: Checkpoints
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import * as checkpoints from '../lib/storage/checkpoints.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as bm25Index from '../lib/search/bm25-index.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as confidenceTracker from '../lib/scoring/confidence-tracker.js';
import { executeAutoPromotion } from '../lib/search/auto-promotion.js';
import { recordSelection } from '../lib/search/learned-feedback.js';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback.js';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback.js';
import { recordAdaptiveSignal } from '../lib/cognitive/adaptive-ranking.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { requireDb, toErrorMessage } from '../utils/index.js';

// REQ-019: Standardized Response Structure
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';

// Shared handler types
import type { MCPResponse } from './types.js';

// Feature catalog: Checkpoint creation (checkpoint_create)
// Feature catalog: Checkpoint listing (checkpoint_list)
// Feature catalog: Checkpoint restore (checkpoint_restore)
// Feature catalog: Checkpoint deletion (checkpoint_delete)
// Feature catalog: Checkpoint delete confirmName safety


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  metadata?: Record<string, unknown>;
}

interface CheckpointListArgs {
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
}

interface CheckpointRestoreArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  clearExisting?: boolean;
}

interface CheckpointDeleteArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  confirmName: string;
}

interface CheckpointScopeArgs {
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

interface MemoryValidateArgs {
  id: number | string;
  wasUseful: boolean;
  queryId?: string;
  queryTerms?: string[];
  resultRank?: number;
  totalResultsShown?: number;
  searchMode?: string;
  intent?: string;
  sessionId?: string;
  notes?: string;
}

interface ValidationResult {
  confidence: number;
  validationCount: number;
  positiveValidationCount: number;
  promotionEligible: boolean;
}

function resolveValidationQueryText(
  database: ReturnType<typeof requireDb>,
  queryId?: string,
): string | null {
  if (typeof queryId !== 'string') {
    return null;
  }

  const normalizedQueryId = queryId.trim();
  if (normalizedQueryId.length === 0) {
    return null;
  }

  if (/\s/.test(normalizedQueryId)) {
    return normalizedQueryId;
  }

  const consumptionMatch = normalizedQueryId.match(/^(?:consumption:)?(\d+)$/);
  if (!consumptionMatch) {
    return null;
  }

  const consumptionLogTable = database.prepare(`
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = 'consumption_log'
    LIMIT 1
  `).get();
  if (!consumptionLogTable) {
    return null;
  }

  const row = database.prepare(`
    SELECT query_text
    FROM consumption_log
    WHERE id = ?
      AND query_text IS NOT NULL
      AND TRIM(query_text) != ''
    LIMIT 1
  `).get(Number.parseInt(consumptionMatch[1], 10)) as { query_text?: string } | undefined;

  return typeof row?.query_text === 'string' && row.query_text.trim().length > 0
    ? row.query_text
    : null;
}

function parseMemoryId(rawId: number | string): number {
  const numericId = typeof rawId === 'string'
    ? Number.parseInt(rawId.trim(), 10)
    : rawId;

  if (
    typeof numericId !== 'number' ||
    !Number.isSafeInteger(numericId) ||
    numericId <= 0 ||
    (typeof rawId === 'string' && !/^\d+$/.test(rawId.trim()))
  ) {
    throw new Error('id must be a positive integer');
  }

  return numericId;
}

function parseCheckpointMetadata(rawMetadata: unknown): Record<string, unknown> {
  if (!rawMetadata) {
    return {};
  }

  if (typeof rawMetadata === 'string') {
    try {
      const parsed = JSON.parse(rawMetadata);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch (_error: unknown) {
      return {};
    }
  }

  return typeof rawMetadata === 'object' && !Array.isArray(rawMetadata)
    ? rawMetadata as Record<string, unknown>
    : {};
}

function validateCheckpointScope(args: CheckpointScopeArgs): CheckpointScopeArgs {
  const validateValue = (
    value: string | undefined,
    field: keyof CheckpointScopeArgs,
    options: { trim?: boolean } = {},
  ): string | undefined => {
    if (value === undefined) {
      return undefined;
    }
    if (typeof value !== 'string') {
      throw new Error(`${field} must be a string`);
    }
    return options.trim ? value.trim() : value;
  };

  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
  const userId = validateValue(args.userId, 'userId');
  const agentId = validateValue(args.agentId, 'agentId');
  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
  const hasActorOrSharedSpaceScope =
    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;

  if (
    hasActorOrSharedSpaceScope
    && tenantId !== undefined
    && tenantId.trim().length === 0
  ) {
    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
  }

  return {
    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
    userId,
    agentId,
    sharedSpaceId,
  };
}

function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
  return (
    scope.tenantId !== undefined
    || scope.userId !== undefined
    || scope.agentId !== undefined
    || scope.sharedSpaceId !== undefined
  );
}

function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
  return scope.tenantId === undefined && (
    scope.userId !== undefined
    || scope.agentId !== undefined
    || scope.sharedSpaceId !== undefined
  );
}

function mergeCheckpointScopeMetadata(
  metadata: Record<string, unknown> | undefined,
  scope: CheckpointScopeArgs,
): Record<string, unknown> {
  return {
    ...(metadata ?? {}),
    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
  };
}

function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
  const metadata = parseCheckpointMetadata(rawMetadata);
  const matchesScopeField = (field: keyof CheckpointScopeArgs): boolean => {
    const expected = scope[field];
    if (expected === undefined) {
      return true;
    }
    const actual = metadata[field];
    return actual === undefined || actual === expected;
  };

  return (
    matchesScopeField('tenantId') &&
    matchesScopeField('userId') &&
    matchesScopeField('agentId') &&
    matchesScopeField('sharedSpaceId')
  );
}

function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
  const details: Record<string, string> = {};
  if (scope.tenantId !== undefined) {
    details.tenantId = scope.tenantId;
  }
  if (scope.userId !== undefined) {
    details.userId = scope.userId;
  }
  if (scope.agentId !== undefined) {
    details.agentId = scope.agentId;
  }
  if (scope.sharedSpaceId !== undefined) {
    details.sharedSpaceId = scope.sharedSpaceId;
  }
  return details;
}

function createCheckpointScopeValidationError(
  tool: 'checkpoint_create' | 'checkpoint_list' | 'checkpoint_restore' | 'checkpoint_delete',
): MCPResponse {
  return createMCPErrorResponse({
    tool,
    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
    code: 'CHECKPOINT_SCOPE_TENANT_REQUIRED',
    details: {
      reason: 'checkpoint_scope_tenant_required',
    },
    recovery: {
      hint: 'Retry with tenantId included for governed checkpoint access.',
    },
  });
}

/* ───────────────────────────────────────────────────────────────
   3. CHECKPOINT CREATE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle checkpoint_create tool — snapshots the current memory state for rollback.
 * @param args - Checkpoint creation arguments (name, note)
 * @returns MCP response with checkpoint metadata
 */
async function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, specFolder: spec_folder, metadata } = args;
  const scope = validateCheckpointScope(args);
  if (requiresCheckpointTenant(scope)) {
    return createCheckpointScopeValidationError('checkpoint_create');
  }

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const result = checkpoints.createCheckpoint({
    name,
    specFolder: spec_folder,
    metadata: mergeCheckpointScopeMetadata(metadata, scope),
    scope,
  });

  if (!result) {
    return createMCPErrorResponse({
      tool: 'checkpoint_create',
      error: 'Checkpoint creation failed',
      code: 'CHECKPOINT_CREATE_FAILED',
      details: {
        name,
        specFolder: spec_folder ?? null,
      },
      recovery: {
        hint: 'Verify database availability and retry checkpoint_create.',
        actions: ['Run checkpoint_list() to confirm checkpoint state before destructive operations'],
      },
      startTime,
    });
  }

  return createMCPSuccessResponse({
    tool: 'checkpoint_create',
    summary: `Checkpoint "${name}" created successfully`,
    data: {
      success: true,
      checkpoint: result
    },
    hints: [
      `Restore with: checkpoint_restore({ name: "${name}" })`,
      `Delete with: checkpoint_delete({ name: "${name}", confirmName: "${name}" })`
    ],
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   4. CHECKPOINT LIST HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle checkpoint_list tool - returns available checkpoints filtered by spec folder */
async function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { specFolder: spec_folder, limit: raw_limit = 50 } = args;
  const scope = validateCheckpointScope(args);
  if (requiresCheckpointTenant(scope)) {
    return createCheckpointScopeValidationError('checkpoint_list');
  }

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 100)
    : 50;

  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit, scope);
  const filteredResults = hasCheckpointScope(scope)
    ? results.filter((checkpoint) => checkpointMatchesScope(checkpoint.metadata, scope))
    : results;

  const summary = filteredResults.length > 0
    ? `Found ${filteredResults.length} checkpoint(s)`
    : 'No checkpoints found';

  return createMCPSuccessResponse({
    tool: 'checkpoint_list',
    summary,
    data: {
      count: filteredResults.length,
      checkpoints: filteredResults
    },
    hints: filteredResults.length === 0
      ? ['Create a checkpoint with checkpoint_create({ name: "my-checkpoint" })']
      : [],
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   5. CHECKPOINT RESTORE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
async function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
  if (restoreBarrier) {
    return createMCPErrorResponse({
      tool: 'checkpoint_restore',
      error: restoreBarrier.message,
      code: restoreBarrier.code,
      details: {
        name: args.name ?? null,
      },
      recovery: {
        hint: 'Retry checkpoint_restore after the active restore maintenance window completes.',
        actions: ['Wait for the current restore to finish', 'Retry the restore request'],
        severity: 'warning',
      },
      startTime,
    });
  }

  await checkDatabaseUpdated();
  const { name, clearExisting: clear_existing = false } = args;
  const scope = validateCheckpointScope(args);
  if (requiresCheckpointTenant(scope)) {
    return createCheckpointScopeValidationError('checkpoint_restore');
  }

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  if (hasCheckpointScope(scope)) {
    const checkpoint = checkpoints.getCheckpoint(name, scope);
    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
      return createMCPErrorResponse({
        tool: 'checkpoint_restore',
        error: `Checkpoint "${name}" scope mismatch`,
        code: 'CHECKPOINT_SCOPE_MISMATCH',
        details: {
          name,
          scope: checkpointScopeDetails(scope),
        },
        recovery: {
          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
        },
        startTime,
      });
    }
  }

  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
  const hasRestoreErrors = result.errors.length > 0;
  const hasRestoredData = result.restored > 0 || result.workingMemoryRestored > 0;
  const hasPartialFailure = result.partialFailure === true;
  const hasPartialSuccess = !hasPartialFailure && (result.skipped > 0 || hasRestoreErrors);

  // T102 FIX: Rebuild search indexes after checkpoint restore
  // Without this, restored memories are invisible to search until server restart.
  // Matches the startup rebuild sequence in context-server.ts (lines 776-791).
  if (result.restored > 0 || result.workingMemoryRestored > 0) {
    try {
      vectorIndex.clearConstitutionalCache(null);
      vectorIndex.clearSearchCache(null);

      const database = vectorIndex.getDb();
      if (database && bm25Index.isBm25Enabled()) {
        bm25Index.getIndex().rebuildFromDatabase(database);
      }

      triggerMatcher.refreshTriggerCache();
    } catch (rebuildErr: unknown) {
      // Index rebuild failure is non-fatal — indexes will self-heal on next query or restart
      console.error('[T102] Index rebuild after checkpoint restore failed:', toErrorMessage(rebuildErr));
    }
  }

  if (hasRestoreErrors && !hasRestoredData) {
    return createMCPErrorResponse({
      tool: 'checkpoint_restore',
      error: `Checkpoint "${name}" restore failed`,
      code: 'CHECKPOINT_RESTORE_FAILED',
      details: {
        name,
        clearExisting: clear_existing,
        restored: result.restored,
        workingMemoryRestored: result.workingMemoryRestored,
        errors: result.errors,
      },
      recovery: {
        hint: 'Use checkpoint_list() to confirm checkpoint name and retry.',
        actions: ['Inspect checkpoint integrity', 'Create a fresh checkpoint before retrying restore'],
      },
      startTime,
    });
  }

  if (hasPartialFailure && hasRestoredData) {
    return createMCPErrorResponse({
      tool: 'checkpoint_restore',
      error: `Checkpoint "${name}" restore completed with partial failure`,
      code: 'CHECKPOINT_RESTORE_PARTIAL_FAILURE',
      details: {
        name,
        clearExisting: clear_existing,
        restored: result.restored,
        skipped: result.skipped,
        workingMemoryRestored: result.workingMemoryRestored,
        rolledBackTables: result.rolledBackTables ?? [],
        errors: result.errors,
      },
      recovery: {
        hint: 'Review the reported table failures before retrying restore.',
        actions: [
          'Inspect restored.errors and restored.rolledBackTables for the failed merge-replace tables',
          'Retry with a narrower scope or clearExisting=true if you intend to replace current state',
        ],
      },
      startTime,
    });
  }

  if (hasPartialSuccess) {
    return createMCPSuccessResponse({
      tool: 'checkpoint_restore',
      summary: result.errors.length > 0
        ? `Checkpoint "${name}" restored with warnings (${result.errors.length})`
        : `Checkpoint "${name}" restored partially`,
      data: {
        success: true,
        partial: true,
        warningCount: result.errors.length,
        restored: result,
      },
      hints: [
        'Restore applied partially; review restored.errors and restored.skipped before retrying',
        'Avoid immediate retry with clearExisting=true unless you intend to replace current state',
      ],
      startTime,
    });
  }

  return createMCPSuccessResponse({
    tool: 'checkpoint_restore',
    summary: `Checkpoint "${name}" restored successfully`,
    data: {
      success: true,
      restored: result
    },
    hints: clear_existing
      ? ['Previous data was cleared before restore', 'Search indexes rebuilt']
      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   6. CHECKPOINT DELETE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, confirmName } = args;
  const scope = validateCheckpointScope(args);
  if (requiresCheckpointTenant(scope)) {
    return createCheckpointScopeValidationError('checkpoint_delete');
  }

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }
  if (!confirmName || typeof confirmName !== 'string') {
    throw new Error('confirmName is required and must be a string');
  }
  if (confirmName !== name) {
    throw new Error('confirmName must exactly match name to delete checkpoint');
  }

  if (hasCheckpointScope(scope)) {
    const checkpoint = checkpoints.getCheckpoint(name, scope);
    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
      return createMCPErrorResponse({
        tool: 'checkpoint_delete',
        error: `Checkpoint "${name}" scope mismatch`,
        code: 'CHECKPOINT_SCOPE_MISMATCH',
        details: {
          name,
          scope: checkpointScopeDetails(scope),
        },
        recovery: {
          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
        },
        startTime,
      });
    }
  }

  const success: boolean = checkpoints.deleteCheckpoint(name, scope);

  const summary = success
    ? `Checkpoint "${name}" deleted successfully`
    : `Checkpoint "${name}" not found`;

  return createMCPSuccessResponse({
    tool: 'checkpoint_delete',
    summary,
    data: {
      success,
      safetyConfirmationUsed: true,
      checkpointName: name,
      ...(success ? { deletedAt: new Date().toISOString() } : {}),
    },
    hints: success
      ? []
      : ['Use checkpoint_list() to see available checkpoints'],
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   7. MEMORY VALIDATE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_validate tool - records user validation feedback to adjust confidence */
async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const {
    id,
    wasUseful,
    queryId,
    queryTerms,
    resultRank,
    totalResultsShown,
    searchMode,
    intent,
    sessionId,
    notes,
  } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof wasUseful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  const memoryId = parseMemoryId(id);

  vectorIndex.initializeDb();
  const database = requireDb();
  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
    ? queryId.trim()
    : null;
  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
  try {
    recordAdaptiveSignal(database, {
      memoryId,
      signalType: wasUseful ? 'outcome' : 'correction',
      signalValue: 1,
      query: queryText,
      actor: sessionId ?? 'memory_validate',
      metadata: {
        queryId: normalizedQueryId,
        queryText,
        resultRank: typeof resultRank === 'number' ? resultRank : null,
        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
        intent: intent ?? null,
      },
    });
  } catch (_error: unknown) {
    // Adaptive signals are best-effort only
  }

  // T002a: Auto-promotion wiring on positive feedback.
  let autoPromotion: {
    attempted: boolean;
    promoted: boolean;
    previousTier?: string;
    newTier?: string;
    reason?: string;
  } | null = null;

  if (wasUseful) {
    const promotionResult = executeAutoPromotion(database, memoryId);
    autoPromotion = {
      attempted: true,
      promoted: promotionResult.promoted,
      previousTier: promotionResult.previousTier,
      newTier: promotionResult.newTier,
      reason: promotionResult.reason,
    };
  }

  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
  if (!wasUseful) {
    recordNegativeFeedbackEvent(database, memoryId);
  }

  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
  let learnedFeedback: {
    attempted: boolean;
    applied: boolean;
    termsLearned: string[];
    reason?: string;
  } | null = null;
  let groundTruthSelectionId: number | null = null;

  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
      searchMode,
      intent,
      selectedRank: resultRank,
      totalResultsShown,
      sessionId,
      notes,
    });

    const normalizedTerms = Array.isArray(queryTerms)
      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
      : [];

    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
      learnedFeedback = {
        attempted: true,
        applied: learnResult.applied,
        termsLearned: learnResult.terms,
        reason: learnResult.reason,
      };
    } else {
      learnedFeedback = {
        attempted: false,
        applied: false,
        termsLearned: [],
        reason: 'missing_query_terms_or_rank',
      };
    }
  }

  const summary = wasUseful
    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;

  const hints: string[] = [];
  if (result.promotionEligible) {
    hints.push('Memory eligible for promotion to critical tier');
  }
  if (!wasUseful && result.validationCount > 3) {
    hints.push('Consider updating or deleting this memory if consistently unhelpful');
  }

  return createMCPSuccessResponse({
    tool: 'memory_validate',
    summary,
    data: {
      memoryId,
      wasUseful: wasUseful,
      confidence: result.confidence,
      validationCount: result.validationCount,
      positiveValidationCount: result.positiveValidationCount,
      promotionEligible: result.promotionEligible,
      autoPromotion,
      learnedFeedback,
      groundTruthSelectionId,
    },
    hints,
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
  handleMemoryValidate,
};

// Backward-compatible aliases (snake_case)
const handle_checkpoint_create = handleCheckpointCreate;
const handle_checkpoint_list = handleCheckpointList;
const handle_checkpoint_restore = handleCheckpointRestore;
const handle_checkpoint_delete = handleCheckpointDelete;
const handle_memory_validate = handleMemoryValidate;

export {
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,
  handle_checkpoint_delete,
  handle_memory_validate,
};
