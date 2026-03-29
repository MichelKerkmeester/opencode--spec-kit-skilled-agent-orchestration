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
} from '../lib/eval/ablation-framework.js';

export {
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
} from '../lib/eval/bm25-baseline.js';

export { loadGroundTruth } from '../lib/eval/ground-truth-generator.js';
export { initEvalDb } from '../lib/eval/eval-db.js';
