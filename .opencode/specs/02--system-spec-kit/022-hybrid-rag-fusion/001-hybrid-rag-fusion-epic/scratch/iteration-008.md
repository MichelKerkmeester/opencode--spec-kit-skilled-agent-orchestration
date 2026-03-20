# Iteration 8: Eval/Measurement Infrastructure Quality (Q10)

## Focus
Deep investigation of the 18-file eval subsystem in `lib/eval/` to determine: (a) Is it connected to the live search pipeline or standalone? (b) What does the ground truth corpus look like? (c) Is the ablation framework actually usable? (d) Does eval infrastructure feed back into scoring calibration? This addresses Q10 directly and provides evidence relevant to Q3 (automation opportunities).

## Findings

1. **The ablation framework is structurally complete and correctly connected to the search pipeline.** `ablation-framework.ts` (773 lines) implements one-at-a-time channel ablation with: baseline computation, per-channel disable via `toHybridSearchFlags()`, Recall@K delta calculation, sign-test statistical significance (log-space binomial to avoid overflow), 9-metric breakdown (MRR@5, P@5, R@5, NDCG@5, MAP, hit_rate, latency p50/p95, token_usage), channel contribution ranking, and markdown report formatting. The `AblationSearchFn` type signature matches the hybrid search interface, and `hybrid-search.ts:568-569` confirms the search function respects disabled channel flags from the ablation framework. The connection is bidirectional: ablation calls search, search respects ablation's disable flags.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1-773]
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:568-569]

2. **The ground truth corpus is substantial: 2,591 lines of JSON with rich metadata.** `ground-truth.json` contains structured query-relevance pairs with 7 intent types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision), 3 complexity tiers (simple, moderate, complex), 7 query categories (factual, temporal, graph_relationship, cross_document, hard_negative, anchor_based, scope_filtered), and 4 query sources (manual, trigger_derived, pattern_derived, seed). Relevance grades use a 4-point scale (0=not relevant, 1=partial, 2=relevant, 3=highly relevant). Each query has an `expectedResultDescription` and optional `notes` explaining what the query tests.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1-2591]
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:1-78]

3. **The eval metrics library implements 12 metrics (7 core + 5 diagnostic) with no side effects.** Core: MRR@K, NDCG@K, Recall@K, Precision@K, F1@K, MAP, HitRate@K. Diagnostic: InversionRate (pairwise ranking quality), ConstitutionalSurfacingRate (tier-aware recall), ImportanceWeightedRecall (tier-weighted with constitutional=3x, critical=2x, important=1.5x), ColdStartDetectionRate (48-hour recency), IntentWeightedNDCG (7 intent-specific grade multipliers with MAX_WEIGHTED_GRADE=5 safety cap). All functions are pure -- no DB access, no side effects. Deduplication guards (F-28, F-29) prevent Recall>1.0 and MAP>1.0 from duplicate memoryIds.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:1-605]

4. **The eval DB is a separate SQLite database with 5 tables, isolated from the main memory DB.** File: `speckit-eval.db` in the same directory as the main DB. Tables: `eval_queries` (with intent, difficulty, category), `eval_channel_results` (per-channel per-query results), `eval_final_results` (fused results after RRF), `eval_ground_truth` (relevance judgments with annotator tracking), `eval_metric_snapshots` (time-series metric storage). Uses WAL mode and foreign keys. The separate DB approach is architecturally sound -- eval writes cannot corrupt the main memory index.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:1-196]

5. **The eval system is completely gated behind SPECKIT_ABLATION=true -- it NEVER runs in production.** Every public function in the ablation framework checks `isAblationEnabled()` and returns null/false when the flag is not set. The flag requires exact case-insensitive "true" -- "1", undefined, and all other values disable it. This is a strict opt-in gate, meaning: (a) no eval overhead in production, (b) no accidental eval writes to the DB, BUT (c) no continuous monitoring of retrieval quality. The system can only measure quality when manually triggered.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:38-46]

6. **The API surface is clean: `api/eval.ts` provides a stable re-export layer for scripts.** Exports ablation, BM25 baseline, ground truth loader, and eval DB init. The `ARCH-1` annotation confirms this is a deliberate architectural boundary -- scripts in `scripts/evals/` import from `api/eval.ts`, not from `lib/eval/` internals. This means refactoring internal eval modules does not break eval scripts.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/eval.ts:1-31]

7. **CRITICAL GAP: No feedback loop from eval to scoring calibration.** The eval system can measure retrieval quality but has no mechanism to feed results back into the pipeline's scoring weights. Ablation results go into `eval_metric_snapshots` but no pipeline code reads from that table. The 30+ hardcoded scoring constants (identified in iteration 2) remain uncalibrated. The eval system is pure measurement -- it answers "how well are we doing?" but does not answer "how should we adjust weights?" This is the largest missed opportunity in the eval infrastructure.
   [INFERENCE: Based on (a) no imports of eval modules in lib/search/, (b) no code reading eval_metric_snapshots for calibration, (c) ablation stores results but pipeline never consumes them]

8. **Ground truth quality assessment: Well-structured but potentially stale.** The corpus is synthetic ("seed", "pattern_derived", "trigger_derived" sources) with memory IDs hardcoded (e.g., memoryId 1471 at end of file). If the memory database is rebuilt or memories are re-indexed with different IDs, the entire ground truth corpus becomes invalid. There is no validation mechanism to check that ground truth memoryIds still exist in the active database. The `QUERY_DISTRIBUTION` export provides distribution stats but is computed once at import time, not refreshed.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:2588-2591]
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:65-78]

9. **The ablation framework includes proper statistical testing.** Sign-test p-value computation uses log-space binomial coefficients to avoid integer overflow for n>50. Requires minimum 5 non-tied observations for a meaningful test. Results are classified by verdict: CRITICAL (p<0.05, delta>=0.05), important (p<0.05, smaller delta), likely useful, negligible, possibly harmful, HARMFUL. This is methodologically sound for paired ablation comparisons.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:229-257, 730-748]

10. **token_usage metric is a stub -- always returns 0.** In `buildAggregatedMetrics()`, the `token_usage` entry is hardcoded as `{ baseline: 0, ablated: 0, delta: 0 }`. This metric is declared in the `AblationMetrics` interface but never computed. All other 8 metrics in the breakdown are functional.
    [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:338]

11. **MCP tool exposure: `eval_run_ablation` and `eval_reporting_dashboard` are available.** These are registered MCP tools (confirmed from tool list in the system), meaning an AI agent can trigger ablation studies and view dashboard reports directly. This is a significant capability -- eval is not just a developer script but an agent-accessible tool. However, the SPECKIT_ABLATION gate must be set externally.
    [SOURCE: ablation-framework.ts:4, confirmed via MCP tool list in dispatch context]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` (773 lines, read in full)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts` (78 lines, read in full)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts` (605 lines, read in full)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts` (196 lines, read in full)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` (2,591 lines, head+tail)
- `.opencode/skill/system-spec-kit/mcp_server/api/eval.ts` (31 lines, read in full)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (grep for eval/ablation references)

## Assessment
- New information ratio: 0.91
- Questions addressed: Q10 (primary), Q3 (partial -- eval automation opportunities identified)
- Questions answered: Q10 (fully answered)

## Reflection
- What worked and why: Reading ablation-framework.ts in full was highest-ROI -- it gave complete understanding of the eval system's architecture, connection mechanism, statistical methods, and output format in one pass. The grep for eval/ablation references in lib/search/ confirmed the pipeline connection with only 1 extra tool call.
- What did not work and why: The initial grep path for lib/pipeline was wrong (recurring issue, 5th occurrence). The correct path is lib/search/. This was recovered with a retry on the correct path.
- What I would do differently: For remaining iterations, always use lib/search/ not lib/pipeline/ as the search path prefix.

## Recommended Next Focus
Iteration 9: Q11 -- Save pipeline robustness. Read handlers/save/ directory to understand memory quality gates, dedup mechanisms, and save-time validation. This connects to Q3 (automation) since save-time quality could be automated.
