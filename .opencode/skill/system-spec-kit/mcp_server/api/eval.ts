// ────────────────────────────────────────────────────────────────
// MODULE: Eval
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// ARCH-1 stable re-export surface so eval scripts in scripts/evals/
// Do not couple to internal lib/ paths. When internals refactor, only this
// File needs updating.

export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  inspectGroundTruthAlignment,
  assertGroundTruthAlignment,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  type GroundTruthAlignmentSummary,
} from '../lib/eval/ablation-framework';

export {
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
} from '../lib/eval/bm25-baseline';

export { loadGroundTruth } from '../lib/eval/ground-truth-generator';
export { initEvalDb } from '../lib/eval/eval-db';
