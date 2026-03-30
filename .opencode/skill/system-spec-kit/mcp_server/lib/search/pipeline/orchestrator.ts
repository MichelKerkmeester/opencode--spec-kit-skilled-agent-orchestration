// ───────────────────────────────────────────────────────────────
// MODULE: Orchestrator
// ───────────────────────────────────────────────────────────────
// 4-stage pipeline execution with per-stage error handling and timeouts.
//
// B1 FIX: Each stage is wrapped in try/catch with withTimeout().
// Stage 1 is mandatory (throws on failure — no candidates = no results).
// Stages 2-4 fall back to previous stage output with degraded metadata.
// Timing is recorded for latency observability.
//
// I/O CONTRACT:
// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
// Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
// Key invariants:
//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
//     - Stage metadata for all four stages is included for observability
//     - When a stage degrades, metadata.degraded = true and timing tracks each stage
// Side effects:
//     - Delegates to each stage; see individual stage modules for their side effects

import type {
  PipelineConfig,
  PipelineResult,
  Stage1Output,
  Stage2Output,
  Stage3Output,
  Stage4Output,
  Stage4ReadonlyRow,
  SignalStatus,
} from './types.js';

import { executeStage1 } from './stage1-candidate-gen.js';
import { executeStage2 } from './stage2-fusion.js';
import { executeStage3 } from './stage3-rerank.js';
import { executeStage4 } from './stage4-filter.js';
import { MemoryError, withTimeout } from '../../errors/core.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: 4-stage pipeline refactor


/** Per-stage timeout in milliseconds. */
const STAGE_TIMEOUT_MS = 10_000;

/**
 * Execute the 4-stage retrieval pipeline with per-stage error handling.
 *
 * Stage 1: Candidate Generation — MANDATORY (throws on failure)
 * Stage 2: Fusion + Signal Integration — falls back to unsorted candidates
 * Stage 3: Rerank + Aggregate — falls back to unranked scored results
 * Stage 4: Filter + Annotate — falls back to unfiltered results
 *
 * @param config Pipeline configuration derived from search args
 * @returns Pipeline result with stage metadata and timing
 */
export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
  const timing: Record<string, number> = {};
  const pipelineStart = Date.now();
  let degraded = false;

  // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
  let stage1Result: Stage1Output;
  try {
    const t0 = Date.now();
    stage1Result = await withTimeout(
      executeStage1({ config }),
      STAGE_TIMEOUT_MS,
      'Stage 1: Candidate Generation',
    );
    timing.stage1 = Date.now() - t0;
  } catch (err) {
    throw new MemoryError(
      'PIPELINE_STAGE1_FAILED',
      `Candidate generation failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err instanceof Error ? err.message : String(err) },
    );
  }

  // -- Stage 2: Fusion + Signal Integration (falls back to unsorted candidates) --
  let stage2Result: Stage2Output;
  try {
    const t0 = Date.now();
    stage2Result = await withTimeout(
      executeStage2({
        candidates: stage1Result.candidates,
        config,
        stage1Metadata: stage1Result.metadata,
      }),
      STAGE_TIMEOUT_MS,
      'Stage 2: Fusion',
    );
    timing.stage2 = Date.now() - t0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 2 failed, returning unscored candidates: ${msg}`);
    degraded = true;
    stage2Result = {
      scored: stage1Result.candidates,
      metadata: {
        sessionBoostApplied: 'failed' as SignalStatus,
        causalBoostApplied: 'failed' as SignalStatus,
        intentWeightsApplied: 'failed' as SignalStatus,
        artifactRoutingApplied: 'failed' as SignalStatus,
        feedbackSignalsApplied: 'failed' as SignalStatus,
        qualityFiltered: 0,
        durationMs: 0,
      },
    };
    timing.stage2 = 0;
  }

  // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
  let stage3Result: Stage3Output;
  try {
    const t0 = Date.now();
    stage3Result = await withTimeout(
      executeStage3({
        scored: stage2Result.scored,
        config,
      }),
      STAGE_TIMEOUT_MS,
      'Stage 3: Rerank',
    );
    timing.stage3 = Date.now() - t0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 3 failed, returning unranked results: ${msg}`);
    degraded = true;
    stage3Result = {
      reranked: stage2Result.scored,
      metadata: {
        rerankApplied: false,
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 0,
      },
    };
    timing.stage3 = 0;
  }

  // -- Stage 4: Filter + Annotate (falls back to unfiltered results) --
  let stage4Result: Stage4Output;
  try {
    const t0 = Date.now();
    stage4Result = await withTimeout(
      executeStage4({
        results: stage3Result.reranked as Stage4ReadonlyRow[],
        config,
        stage1Metadata: { constitutionalInjected: stage1Result.metadata.constitutionalInjected },
      }),
      STAGE_TIMEOUT_MS,
      'Stage 4: Filter',
    );
    timing.stage4 = Date.now() - t0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 4 failed, returning unfiltered results: ${msg}`);
    degraded = true;
    stage4Result = {
      final: stage3Result.reranked as Stage4ReadonlyRow[],
      metadata: {
        stateFiltered: 0,
        constitutionalInjected: stage1Result.metadata.constitutionalInjected,
        evidenceGapDetected: false,
        durationMs: 0,
      },
      annotations: {
        stateStats: {},
        featureFlags: {},
      },
    };
    timing.stage4 = 0;
  }

  timing.total = Date.now() - pipelineStart;

  return {
    results: stage4Result.final,
    metadata: {
      stage1: stage1Result.metadata,
      stage2: stage2Result.metadata,
      stage3: stage3Result.metadata,
      stage4: stage4Result.metadata,
      timing,
      degraded: degraded || undefined,
    },
    annotations: stage4Result.annotations,
    trace: config.trace,
  };
}
