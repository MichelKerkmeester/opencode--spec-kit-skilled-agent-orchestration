// ---------------------------------------------------------------
// MODULE: Pipeline Orchestrator
// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
// ---------------------------------------------------------------

import type {
  PipelineConfig,
  PipelineResult,
  Stage4ReadonlyRow,
} from './types';

import { executeStage1 } from './stage1-candidate-gen';
import { executeStage2 } from './stage2-fusion';
import { executeStage3 } from './stage3-rerank';
import { executeStage4 } from './stage4-filter';

/**
 * Execute the 4-stage retrieval pipeline.
 *
 * Stage 1: Candidate Generation — search channels execute, raw results collected
 * Stage 2: Fusion + Signal Integration — RRF/RSF, boosts, intent weights (ONCE)
 * Stage 3: Rerank + Aggregate — cross-encoder, MMR, MPAB
 * Stage 4: Filter + Annotate — state filter, dedup, attribution (NO SCORE CHANGES)
 *
 * @param config Pipeline configuration derived from search args
 * @returns Pipeline result with stage metadata
 */
export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
  // Stage 1: Candidate Generation
  const stage1Result = await executeStage1({ config });

  // Stage 2: Fusion + Signal Integration (single scoring point — prevents G2)
  const stage2Result = await executeStage2({
    candidates: stage1Result.candidates,
    config,
    stage1Metadata: stage1Result.metadata,
  });

  // Stage 3: Rerank + Aggregate
  const stage3Result = await executeStage3({
    scored: stage2Result.scored,
    config,
  });

  // Stage 4: Filter + Annotate (NO SCORE CHANGES — invariant enforced)
  const stage4Result = await executeStage4({
    results: stage3Result.reranked as Stage4ReadonlyRow[],
    config,
  });

  return {
    results: stage4Result.final,
    metadata: {
      stage1: stage1Result.metadata,
      stage2: stage2Result.metadata,
      stage3: stage3Result.metadata,
      stage4: stage4Result.metadata,
    },
    annotations: stage4Result.annotations,
    trace: config.trace,
  };
}
