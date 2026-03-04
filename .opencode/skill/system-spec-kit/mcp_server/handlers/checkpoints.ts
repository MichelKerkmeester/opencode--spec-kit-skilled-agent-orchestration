// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse } from './types';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  metadata?: Record<string, unknown>;
}

interface CheckpointListArgs {
  specFolder?: string;
  limit?: number;
}

interface CheckpointRestoreArgs {
  name: string;
  clearExisting?: boolean;
}

interface CheckpointDeleteArgs {
  name: string;
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

/* ---------------------------------------------------------------
   3. CHECKPOINT CREATE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_create tool - snapshots the current memory state for rollback */
async function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, specFolder: spec_folder, metadata } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const result = checkpoints.createCheckpoint({ name, specFolder: spec_folder, metadata });

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
      `Delete with: checkpoint_delete({ name: "${name}" })`
    ],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   4. CHECKPOINT LIST HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_list tool - returns available checkpoints filtered by spec folder */
async function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { specFolder: spec_folder, limit: raw_limit = 50 } = args;

  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 100)
    : 50;

  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit);

  const summary = results.length > 0
    ? `Found ${results.length} checkpoint(s)`
    : 'No checkpoints found';

  return createMCPSuccessResponse({
    tool: 'checkpoint_list',
    summary,
    data: {
      count: results.length,
      checkpoints: results
    },
    hints: results.length === 0
      ? ['Create a checkpoint with checkpoint_create({ name: "my-checkpoint" })']
      : [],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   5. CHECKPOINT RESTORE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
async function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name, clearExisting: clear_existing = false } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const result = checkpoints.restoreCheckpoint(name, clear_existing);
  const hasRestoreErrors = result.errors.length > 0;
  const hasRestoredData = result.restored > 0 || result.workingMemoryRestored > 0;

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

  if (hasRestoreErrors && hasRestoredData) {
    return createMCPSuccessResponse({
      tool: 'checkpoint_restore',
      summary: `Checkpoint "${name}" restored with warnings (${result.errors.length})`,
      data: {
        success: true,
        partial: true,
        warningCount: result.errors.length,
        restored: result,
      },
      hints: [
        'Restore applied partially; review restored.errors before retrying',
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

/* ---------------------------------------------------------------
   6. CHECKPOINT DELETE HANDLER
--------------------------------------------------------------- */

/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { name } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const success: boolean = checkpoints.deleteCheckpoint(name);

  const summary = success
    ? `Checkpoint "${name}" deleted successfully`
    : `Checkpoint "${name}" not found`;

  return createMCPSuccessResponse({
    tool: 'checkpoint_delete',
    summary,
    data: { success },
    hints: success
      ? []
      : ['Use checkpoint_list() to see available checkpoints'],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   7. MEMORY VALIDATE HANDLER
--------------------------------------------------------------- */

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
  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);

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

/* ---------------------------------------------------------------
   8. EXPORTS
--------------------------------------------------------------- */

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
