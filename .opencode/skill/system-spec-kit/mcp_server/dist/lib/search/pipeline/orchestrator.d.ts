import type { PipelineConfig, PipelineResult } from './types.js';
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
export declare function executePipeline(config: PipelineConfig): Promise<PipelineResult>;
//# sourceMappingURL=orchestrator.d.ts.map