// ───────────────────────────────────────────────────────────────
// MODULE: Stage4 Filter
// ───────────────────────────────────────────────────────────────
// Final stage of the 4-stage retrieval pipeline.
//
// ARCHITECTURAL INVARIANT: Stage 4 MUST NOT modify scores.
// Any ordering change after Stage 3 is a bug. Score fields on
// Stage4ReadonlyRow are compile-time readonly; the runtime assertion
// Via captureScoreSnapshot / verifyScoreInvariant provides a second
// Defence-in-depth layer.
//
// I/O CONTRACT:
// Input:  Stage4Input { results: Stage4ReadonlyRow[], config }
// Output: Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
// Key invariants:
//     - No score field (similarity, score, rrfScore, intentAdjustedScore,
// AttentionScore, importance_weight) may change between input and output
//     - Ordering from Stage 3 is preserved for all surviving rows
//     - final contains only rows at or above config.minState priority
// Side effects:
//     - None — this stage is read-only with respect to the database
//
// FILTER APPLICATION ORDER (within filterByMemoryState):
// 1. memoryState priority filter — rows below minState are removed
// 2. Per-tier hard limits        — STATE_LIMITS caps applied when applyStateLimits=true
//
// Responsibilities (in execution order):
// 1. Capture score snapshot BEFORE any operations (runtime invariant)
// 2. Apply memory-state filtering (filterByMemoryState)
// 3. Apply evidence gap detection via TRM (Z-score confidence check)
// 4. Add annotation metadata (feature flags, state stats, etc.)
// 5. Verify score invariant AFTER all operations
//
// NOT in Stage 4: session dedup — that happens after cache in the
// Main handler to avoid double-counting and cache pollution.

import type { Stage4Input, Stage4Output, Stage4ReadonlyRow, PipelineRow } from './types.js';
import { captureScoreSnapshot, verifyScoreInvariant, resolveEffectiveScore } from './types.js';
import { isTRMEnabled, isMultiQueryEnabled } from '../search-flags.js';
import { detectEvidenceGap, formatEvidenceGapWarning } from '../evidence-gap-detector.js';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Confidence-based result truncation


// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS


// ───────────────────────────────────────────────────────────────
/**
 * Memory state priority map. Higher number = higher priority.
 * Used to compare states numerically so filtering is O(1) per row.
 */
const STATE_PRIORITY: Record<string, number> = {
  HOT: 5,
  WARM: 4,
  COLD: 3,
  DORMANT: 2,
  ARCHIVED: 1,
};

/**
 * Per-tier hard limits applied when `applyStateLimits` is true.
 * Prevents any single tier from monopolising the result window.
 */
const STATE_LIMITS: Record<string, number> = {
  HOT: 50,
  WARM: 30,
  COLD: 20,
  DORMANT: 10,
  ARCHIVED: 5,
};

/** Fallback priority for unknown/missing memoryState values.
 * Set above HOT (5) so UNKNOWN memories always pass state filters.
 * memoryState column doesn't exist yet — all memories are UNKNOWN.
 * Reset to 0 when the TRM state column is implemented. */
const UNKNOWN_STATE_PRIORITY = 6;

function normalizeStateValue(state: unknown): string | null {
  if (typeof state !== 'string') {
    return null;
  }
  const normalizedState = state.toUpperCase();
  return normalizedState in STATE_PRIORITY ? normalizedState : null;
}

function resolveStateForFiltering(row: Stage4ReadonlyRow): string {
  const explicitState = normalizeStateValue(row.memoryState);
  if (explicitState) {
    return explicitState;
  }

  return 'UNKNOWN';
}

// ───────────────────────────────────────────────────────────────
// 3. TYPES


// ───────────────────────────────────────────────────────────────
/**
 * Per-state tally produced by `filterByMemoryState`.
 * Keys are state names (e.g. "HOT", "WARM"); values are counts.
 */
export type StateStats = Record<string, number>;

/**
 * Return value of the internal `filterByMemoryState` function.
 */
export interface FilterResult {
  /** Rows that survived state filtering, in original order. */
  filtered: Stage4ReadonlyRow[];
  /** Pre-filter per-state counts (includes removed rows). */
  statsBefore: StateStats;
  /** Post-filter per-state counts. */
  statsAfter: StateStats;
  /** Total number of rows removed. */
  removedCount: number;
}

/* ───────────────────────────────────────────────────────────────
   3. INTERNAL: filterByMemoryState
   ──────────────────────────────────────────────────────────────── */

/**
 * Remove rows whose `memoryState` falls below `minState` priority and,
 * optionally, enforce per-tier result limits via `STATE_LIMITS`.
 *
 * IMPORTANT: This function ONLY removes items — it never reorders or
 * modifies score fields. The original ordering from Stage 3 is preserved
 * for all rows that survive.
 *
 * @param results        - Read-only rows from Stage 3 output.
 * @param minState       - Minimum acceptable state (e.g. "WARM").
 * @param applyStateLimits - When true, cap each tier to STATE_LIMITS[tier].
 * @returns FilterResult with the surviving rows and before/after stats.
 */
export function filterByMemoryState(
  results: Stage4ReadonlyRow[],
  minState: string,
  applyStateLimits: boolean,
): FilterResult {
  const normalizedMinState = normalizeStateValue(minState);
  const minPriority = STATE_PRIORITY[normalizedMinState ?? ''] ?? UNKNOWN_STATE_PRIORITY;

  // -- 3a. Tally states before filtering --
  const statsBefore: StateStats = {};
  for (const row of results) {
    const state = normalizeStateValue(row.memoryState) ?? 'UNKNOWN';
    statsBefore[state] = (statsBefore[state] ?? 0) + 1;
  }

  // -- 3b. State-priority filter --
  let passing = results.filter(row => {
    const state = resolveStateForFiltering(row);
    const priority = STATE_PRIORITY[state] ?? UNKNOWN_STATE_PRIORITY;
    return priority >= minPriority;
  });

  // -- 3c. Per-tier limits (optional) --
  if (applyStateLimits) {
    const tierCounters: Record<string, number> = {};
    const limitPassing: Stage4ReadonlyRow[] = [];

    for (const row of passing) {
      const state = resolveStateForFiltering(row);
      const limit = STATE_LIMITS[state] ?? Infinity;
      const count = tierCounters[state] ?? 0;

      if (count < limit) {
        tierCounters[state] = count + 1;
        limitPassing.push(row);
      }
      // Rows exceeding the per-tier limit are silently dropped (no score change).
    }

    passing = limitPassing;
  }

  // -- 3d. Tally states after filtering --
  const statsAfter: StateStats = {};
  for (const row of passing) {
    const state = resolveStateForFiltering(row);
    statsAfter[state] = (statsAfter[state] ?? 0) + 1;
  }

  return {
    filtered: passing,
    statsBefore,
    statsAfter,
    removedCount: results.length - passing.length,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. INTERNAL: extractScoringValues
   ──────────────────────────────────────────────────────────────── */

/**
 * Extract the best available numeric score from a row for evidence-gap
 * analysis. Delegates to resolveEffectiveScore (canonical chain in types.ts)
 * so scoring, sorting, and filtering all agree on precedence and normalization.
 *
 * A1 FIX: Previously used a different precedence order (rrfScore first) and
 * did NOT divide similarity by 100, causing a 100x scale mismatch on rows
 * that only had the similarity field set.
 *
 * @param row - A Stage4ReadonlyRow to inspect.
 * @returns The best available numeric score clamped to [0,1], or 0.
 */
export function extractScoringValue(row: Stage4ReadonlyRow): number {
  return resolveEffectiveScore(row as unknown as PipelineRow);
}

/* ───────────────────────────────────────────────────────────────
   5. MAIN: executeStage4
   ──────────────────────────────────────────────────────────────── */

/**
 * Execute Stage 4 of the 4-stage retrieval pipeline: Filter + Annotate.
 *
 * Stage 4 is the final pipeline stage. It removes results that fall below
 * the configured minimum memory state, runs the Transparent Reasoning Module
 * (TRM) evidence-gap check, attaches annotation metadata, and verifies the
 * score invariant before returning.
 *
 * **Score invariant:** No score fields are modified in Stage 4. The compile-time
 * guarantee is enforced via Stage4ReadonlyRow readonly fields; the runtime check
 * via captureScoreSnapshot / verifyScoreInvariant provides defence-in-depth. If
 * verifyScoreInvariant throws, it indicates a Stage 4 implementation bug.
 *
 * **Session dedup:** Session deduplication is intentionally NOT performed here.
 * It happens after the cache layer in the main handler to avoid cache pollution.
 *
 * @param input - Stage4Input containing read-only results and pipeline config.
 * @returns Stage4Output with filtered/annotated results and metadata.
 * @throws Error if verifyScoreInvariant detects any score mutation (Stage 4 bug).
 */
export async function executeStage4(input: Stage4Input): Promise<Stage4Output> {
  const stageStart = Date.now();
  const { results, config } = input;

  // -- Step 1: Capture score snapshot (runtime invariant) --
  //
  // This snapshot is the source-of-truth for the "no score changes" assertion.
  // It is taken over the FULL input set BEFORE any operations, so rows that
  // Are subsequently filtered out are still in the before-snapshot. The
  // VerifyScoreInvariant call skips rows not present in the after-set.
  const scoresBefore = captureScoreSnapshot(results);

  // -- Step 2: State filtering --
  const filterResult = filterByMemoryState(
    results,
    config.minState,
    config.applyStateLimits,
  );

  let workingResults: Stage4ReadonlyRow[] = filterResult.filtered;
  const stateFiltered = filterResult.removedCount;

  // -- Step 3: Evidence gap detection (TRM) --
  let evidenceGapDetected = false;
  let evidenceGapWarning: string | undefined;

  if (isTRMEnabled()) {
    const scores = workingResults.map(extractScoringValue);
    const trm = detectEvidenceGap(scores);

    evidenceGapDetected = trm.gapDetected;

    if (trm.gapDetected) {
      evidenceGapWarning = formatEvidenceGapWarning(trm);

      // Annotate each result with the gap metadata (non-score field).
      workingResults = workingResults.map(row => ({
        ...row,
        evidenceGap: { gapDetected: true, warning: evidenceGapWarning },
      }));
    }
  }

  // -- Step 4: Build annotation metadata --
  const featureFlags: Record<string, boolean> = {
    trmEnabled: isTRMEnabled(),
    multiQueryEnabled: isMultiQueryEnabled(),
    stateLimitsApplied: config.applyStateLimits,
  };

  const stateStats: Record<string, unknown> = {
    minState: config.minState,
    before: filterResult.statsBefore,
    after: filterResult.statsAfter,
    removed: stateFiltered,
  };

  const annotations: Stage4Output['annotations'] = {
    evidenceGapWarning,
    stateStats,
    featureFlags,
  };

  // -- Step 4b: Final limit cap --
  // Enforce caller's limit after all filtering to prevent degraded paths exceeding requested count
  if (typeof config.limit === 'number' && config.limit > 0 && workingResults.length > config.limit) {
    workingResults = workingResults.slice(0, config.limit);
  }

  // -- Step 5: Verify score invariant (defence-in-depth) --
  //
  // VerifyScoreInvariant checks every row that survived filtering.
  // Rows removed by filterByMemoryState are absent from workingResults,
  // So the function correctly skips them (see types.ts implementation).
  // Throws [Stage4Invariant] Error if any score field was mutated.
  verifyScoreInvariant(scoresBefore, workingResults);

  const durationMs = Date.now() - stageStart;

  // -- Trace entry --
  if (config.trace) {
    addTraceEntry(
      config.trace,
      'filter',
      results.length,
      workingResults.length,
      durationMs,
      {
        stateFiltered,
        evidenceGapDetected,
        trmEnabled: isTRMEnabled(),
        applyStateLimits: config.applyStateLimits,
        minState: config.minState,
      },
    );
  }

  return {
    final: workingResults,
    metadata: {
      stateFiltered,
      // Fix #14 — sessionDeduped removed; dedup is post-cache in main handler
      // Fix #15 — constitutionalInjected passed from Stage 1 metadata
      constitutionalInjected: input.stage1Metadata?.constitutionalInjected ?? 0,
      evidenceGapDetected,
      durationMs,
    },
    annotations,
  };
}

// ───────────────────────────────────────────────────────────────
// 4. TEST SURFACE


// ───────────────────────────────────────────────────────────────
/**
 * Exported internals for unit testing.
 * Not intended for production use outside the test harness.
 */
export const __testables = {
  filterByMemoryState,
  resolveStateForFiltering,
  normalizeStateValue,
  extractScoringValue,
  STATE_PRIORITY,
  STATE_LIMITS,
  UNKNOWN_STATE_PRIORITY,
} as const;
