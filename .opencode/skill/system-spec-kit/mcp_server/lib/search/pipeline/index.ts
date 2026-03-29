// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Public API for the 4-stage retrieval pipeline
/**
 * Execute the four-stage retrieval pipeline.
 */

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: 4-stage pipeline refactor

export { executePipeline } from './orchestrator.js';
/**
 * Public pipeline data contracts.
 */
export type {
  PipelineConfig,
  PipelineResult,
  PipelineRow,
  Stage4ReadonlyRow,
  Stage1Input,
  Stage1Output,
  Stage2Input,
  Stage2Output,
  Stage3Input,
  Stage3Output,
  Stage4Input,
  Stage4Output,
  ScoreSnapshot,
  IntentWeightsConfig,
  ArtifactRoutingConfig,
} from './types.js';
/**
 * Score snapshot helpers for Stage 4 invariants.
 */
export { captureScoreSnapshot, verifyScoreInvariant } from './types.js';
