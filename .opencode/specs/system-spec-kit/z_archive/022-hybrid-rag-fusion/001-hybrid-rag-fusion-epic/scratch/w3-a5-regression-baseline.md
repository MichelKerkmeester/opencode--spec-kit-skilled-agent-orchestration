# W3-A5 Regression Baseline

Date: 2026-03-08
Commit: `359ef21e7994af51e2cef3977cd1f81d663060a6`
Baseline source report: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-ux-hooks-automation/scratch/w2-a3-test-verification.md`
Raw Vitest output: `/tmp/w2-a3-vitest-output.txt`
Raw TypeScript output: `/tmp/w2-a3-tsc-output.txt`

## Baseline Summary

- Target workspace: `.opencode/skill/system-spec-kit/mcp_server`
- Vitest status: **FAILED** with `4` known failing tests across `2` files
- Test file summary: `241 passed / 2 failed / 243 total`
- Test summary: `7153 passed / 4 failed / 7157 total`
- TypeScript status: **FAILED** with `1` known compiler error

## Per-File Test Counts

| File | Passed | Failed | Skipped | Total |
| --- | ---: | ---: | ---: | ---: |
| `tests/ablation-framework.vitest.ts` | 41 | 0 | 0 | 41 |
| `tests/access-tracker-extended.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/access-tracker.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/adaptive-fallback.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/adaptive-fusion.vitest.ts` | 26 | 0 | 0 | 26 |
| `tests/anchor-id-simplification.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/anchor-metadata.vitest.ts` | 45 | 0 | 0 | 45 |
| `tests/anchor-prefix-matching.vitest.ts` | 28 | 0 | 0 | 28 |
| `tests/api-key-validation.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/api-validation.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/archival-manager.vitest.ts` | 31 | 0 | 0 | 31 |
| `tests/artifact-routing.vitest.ts` | 35 | 0 | 0 | 35 |
| `tests/attention-decay.vitest.ts` | 76 | 0 | 0 | 76 |
| `tests/batch-processor.vitest.ts` | 34 | 0 | 0 | 34 |
| `tests/bm25-baseline.vitest.ts` | 24 | 0 | 0 | 24 |
| `tests/bm25-index.vitest.ts` | 78 | 0 | 0 | 78 |
| `tests/bm25-security.vitest.ts` | 64 | 0 | 0 | 64 |
| `tests/causal-boost.vitest.ts` | 3 | 0 | 0 | 3 |
| `tests/causal-edges-unit.vitest.ts` | 70 | 0 | 0 | 70 |
| `tests/causal-edges.vitest.ts` | 73 | 0 | 0 | 73 |
| `tests/causal-fixes.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/ceiling-quality.vitest.ts` | 31 | 0 | 0 | 31 |
| `tests/channel-enforcement.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/channel-representation.vitest.ts` | 15 | 0 | 0 | 15 |
| `tests/channel.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/checkpoint-limit.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/checkpoint-working-memory.vitest.ts` | 9 | 0 | 0 | 9 |
| `tests/checkpoints-extended.vitest.ts` | 38 | 0 | 0 | 38 |
| `tests/checkpoints-storage.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/chunk-thinning.vitest.ts` | 25 | 0 | 0 | 25 |
| `tests/co-activation.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/cognitive-gaps.vitest.ts` | 43 | 0 | 0 | 43 |
| `tests/cold-start.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/community-detection.vitest.ts` | 42 | 0 | 0 | 42 |
| `tests/composite-scoring.vitest.ts` | 102 | 0 | 0 | 102 |
| `tests/confidence-tracker.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/confidence-truncation.vitest.ts` | 38 | 0 | 0 | 38 |
| `tests/config-cognitive.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/consumption-logger.vitest.ts` | 35 | 0 | 0 | 35 |
| `tests/content-hash-dedup.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/content-normalizer.vitest.ts` | 76 | 0 | 0 | 76 |
| `tests/context-server.vitest.ts` | 307 | 0 | 0 | 307 |
| `tests/continue-session.vitest.ts` | 34 | 0 | 0 | 34 |
| `tests/corrections.vitest.ts` | 35 | 0 | 0 | 35 |
| `tests/crash-recovery.vitest.ts` | 28 | 0 | 0 | 28 |
| `tests/cross-encoder-extended.vitest.ts` | 31 | 0 | 0 | 31 |
| `tests/cross-encoder.vitest.ts` | 28 | 0 | 0 | 28 |
| `tests/cross-feature-integration-eval.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/db-state-graph-reinit.vitest.ts` | 1 | 0 | 0 | 1 |
| `tests/decay-delete-race.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/decay.vitest.ts` | 27 | 0 | 0 | 27 |
| `tests/deferred-features-integration.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/degree-computation.vitest.ts` | 24 | 0 | 0 | 24 |
| `tests/dual-scope-hooks.vitest.ts` | 62 | 0 | 0 | 62 |
| `tests/dynamic-token-budget.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/edge-density.vitest.ts` | 37 | 0 | 0 | 37 |
| `tests/embedding-cache.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/embedding-expansion.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/embeddings.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/encoding-intent.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/entity-extractor.vitest.ts` | 45 | 0 | 0 | 45 |
| `tests/entity-linker.vitest.ts` | 44 | 0 | 0 | 44 |
| `tests/entity-scope.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/envelope.vitest.ts` | 37 | 0 | 0 | 37 |
| `tests/errors-comprehensive.vitest.ts` | 78 | 0 | 0 | 78 |
| `tests/eval-db.vitest.ts` | 27 | 0 | 0 | 27 |
| `tests/eval-logger.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/eval-metrics.vitest.ts` | 58 | 0 | 0 | 58 |
| `tests/eval-the-eval.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/evidence-gap-detector.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/extraction-adapter.vitest.ts` | 6 | 0 | 0 | 6 |
| `tests/feature-eval-graph-signals.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/feature-eval-query-intelligence.vitest.ts` | 26 | 0 | 0 | 26 |
| `tests/feature-eval-scoring-calibration.vitest.ts` | 24 | 0 | 0 | 24 |
| `tests/feedback-denylist.vitest.ts` | 37 | 0 | 0 | 37 |
| `tests/file-watcher.vitest.ts` | 6 | 3 | 0 | 9 |
| `tests/five-factor-scoring.vitest.ts` | 107 | 0 | 0 | 107 |
| `tests/flag-ceiling.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/folder-discovery-integration.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/folder-discovery.vitest.ts` | 64 | 0 | 0 | 64 |
| `tests/folder-relevance.vitest.ts` | 22 | 0 | 0 | 22 |
| `tests/folder-scoring.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/fsrs-scheduler.vitest.ts` | 55 | 0 | 0 | 55 |
| `tests/full-spec-doc-indexing.vitest.ts` | 142 | 0 | 0 | 142 |
| `tests/graph-flags.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/graph-regression-flag-off.vitest.ts` | 22 | 0 | 0 | 22 |
| `tests/graph-scoring-integration.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/graph-search-fn.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/graph-signals.vitest.ts` | 36 | 0 | 0 | 36 |
| `tests/ground-truth-feedback.vitest.ts` | 27 | 0 | 0 | 27 |
| `tests/ground-truth.vitest.ts` | 75 | 0 | 0 | 75 |
| `tests/handler-causal-graph.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/handler-checkpoints.vitest.ts` | 36 | 0 | 0 | 36 |
| `tests/handler-helpers.vitest.ts` | 68 | 0 | 0 | 68 |
| `tests/handler-memory-context.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/handler-memory-crud.vitest.ts` | 27 | 0 | 0 | 27 |
| `tests/handler-memory-index-cooldown.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/handler-memory-index.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/handler-memory-ingest.vitest.ts` | 6 | 1 | 0 | 7 |
| `tests/handler-memory-save.vitest.ts` | 13 | 0 | 0 | 13 |
| `tests/handler-memory-search.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/handler-memory-triggers.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/handler-session-learning.vitest.ts` | 15 | 0 | 0 | 15 |
| `tests/history.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/hooks-ux-feedback.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/hybrid-search-context-headers.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/hybrid-search-flags.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/hybrid-search.vitest.ts` | 73 | 0 | 0 | 73 |
| `tests/importance-tiers.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/incremental-index-v2.vitest.ts` | 43 | 0 | 0 | 43 |
| `tests/incremental-index.vitest.ts` | 36 | 0 | 0 | 36 |
| `tests/index-refresh.vitest.ts` | 13 | 0 | 0 | 13 |
| `tests/integration-138-pipeline.vitest.ts` | 28 | 0 | 0 | 28 |
| `tests/integration-causal-graph.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/integration-checkpoint-lifecycle.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/integration-error-recovery.vitest.ts` | 15 | 0 | 0 | 15 |
| `tests/integration-learning-history.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/integration-save-pipeline.vitest.ts` | 10 | 0 | 0 | 10 |
| `tests/integration-search-pipeline.vitest.ts` | 15 | 0 | 0 | 15 |
| `tests/integration-session-dedup.vitest.ts` | 6 | 0 | 0 | 6 |
| `tests/integration-trigger-pipeline.vitest.ts` | 8 | 0 | 0 | 8 |
| `tests/intent-classifier.vitest.ts` | 54 | 0 | 0 | 54 |
| `tests/intent-routing.vitest.ts` | 1 | 0 | 0 | 1 |
| `tests/intent-weighting.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/interfaces.vitest.ts` | 25 | 0 | 0 | 25 |
| `tests/interference.vitest.ts` | 31 | 0 | 0 | 31 |
| `tests/job-queue.vitest.ts` | 3 | 0 | 0 | 3 |
| `tests/layer-definitions.vitest.ts` | 38 | 0 | 0 | 38 |
| `tests/lazy-loading.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/learned-feedback.vitest.ts` | 73 | 0 | 0 | 73 |
| `tests/learning-stats-filters.vitest.ts` | 6 | 0 | 0 | 6 |
| `tests/local-reranker.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/mcp-error-format.vitest.ts` | 10 | 0 | 0 | 10 |
| `tests/mcp-input-validation.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/mcp-response-envelope.vitest.ts` | 10 | 0 | 0 | 10 |
| `tests/mcp-tool-dispatch.vitest.ts` | 48 | 0 | 0 | 48 |
| `tests/memory-context-eval-channels.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/memory-context.vitest.ts` | 115 | 0 | 0 | 115 |
| `tests/memory-crud-extended.vitest.ts` | 70 | 0 | 0 | 70 |
| `tests/memory-parser-extended.vitest.ts` | 44 | 0 | 0 | 44 |
| `tests/memory-parser.vitest.ts` | 25 | 0 | 0 | 25 |
| `tests/memory-save-extended.vitest.ts` | 43 | 0 | 0 | 43 |
| `tests/memory-save-integration.vitest.ts` | 55 | 0 | 0 | 55 |
| `tests/memory-save-ux-regressions.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/memory-search-eval-channels.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/memory-search-integration.vitest.ts` | 51 | 0 | 0 | 51 |
| `tests/memory-search-quality-filter.vitest.ts` | 13 | 0 | 0 | 13 |
| `tests/memory-summaries.vitest.ts` | 40 | 0 | 0 | 40 |
| `tests/memory-types.vitest.ts` | 16 | 0 | 0 | 16 |
| `tests/mmr-reranker.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/modularization.vitest.ts` | 91 | 0 | 0 | 91 |
| `tests/mpab-aggregation.vitest.ts` | 33 | 0 | 0 | 33 |
| `tests/mpab-quality-gate-integration.vitest.ts` | 26 | 0 | 0 | 26 |
| `tests/mutation-ledger.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/n3lite-consolidation.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/pagerank.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/phase2-integration.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/pipeline-integration.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/pipeline-v2.vitest.ts` | 30 | 0 | 0 | 30 |
| `tests/prediction-error-gate.vitest.ts` | 75 | 0 | 0 | 75 |
| `tests/preflight.vitest.ts` | 39 | 0 | 0 | 39 |
| `tests/pressure-monitor.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/progressive-validation.vitest.ts` | 49 | 0 | 0 | 49 |
| `tests/promotion-positive-validation-semantics.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/protect-learning.vitest.ts` | 9 | 0 | 0 | 9 |
| `tests/quality-loop.vitest.ts` | 43 | 0 | 0 | 43 |
| `tests/query-classifier.vitest.ts` | 72 | 0 | 0 | 72 |
| `tests/query-expander.vitest.ts` | 11 | 0 | 0 | 11 |
| `tests/query-router-channel-interaction.vitest.ts` | 16 | 0 | 0 | 16 |
| `tests/query-router.vitest.ts` | 33 | 0 | 0 | 33 |
| `tests/reconsolidation.vitest.ts` | 45 | 0 | 0 | 45 |
| `tests/recovery-hints.vitest.ts` | 95 | 0 | 0 | 95 |
| `tests/redaction-gate.vitest.ts` | 4 | 0 | 0 | 4 |
| `tests/regression-010-index-large-files.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/regression-suite.vitest.ts` | 15 | 0 | 0 | 15 |
| `tests/reporting-dashboard.vitest.ts` | 34 | 0 | 0 | 34 |
| `tests/reranker.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/retrieval-directives.vitest.ts` | 48 | 0 | 0 | 48 |
| `tests/retrieval-telemetry.vitest.ts` | 25 | 0 | 0 | 25 |
| `tests/retrieval-trace.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/retry-manager.vitest.ts` | 55 | 0 | 0 | 55 |
| `tests/review-fixes.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/rollout-policy.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/rrf-degree-channel.vitest.ts` | 26 | 0 | 0 | 26 |
| `tests/rrf-fusion.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/rsf-fusion-edge-cases.vitest.ts` | 16 | 0 | 0 | 16 |
| `tests/rsf-fusion.vitest.ts` | 35 | 0 | 0 | 35 |
| `tests/rsf-multi.vitest.ts` | 38 | 0 | 0 | 38 |
| `tests/rsf-vs-rrf-kendall.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/safety.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/save-quality-gate.vitest.ts` | 77 | 0 | 0 | 77 |
| `tests/schema-migration.vitest.ts` | 55 | 0 | 0 | 55 |
| `tests/score-normalization.vitest.ts` | 30 | 0 | 0 | 30 |
| `tests/scoring-gaps.vitest.ts` | 40 | 0 | 0 | 40 |
| `tests/scoring-observability.vitest.ts` | 46 | 0 | 0 | 46 |
| `tests/scoring.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/search-archival.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/search-extended.vitest.ts` | 48 | 0 | 0 | 48 |
| `tests/search-fallback-tiered.vitest.ts` | 23 | 0 | 0 | 23 |
| `tests/search-flags.vitest.ts` | 5 | 0 | 0 | 5 |
| `tests/search-limits-scoring.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/search-results-format.vitest.ts` | 45 | 0 | 0 | 45 |
| `tests/session-boost.vitest.ts` | 3 | 0 | 0 | 3 |
| `tests/session-cleanup.vitest.ts` | 9 | 0 | 0 | 9 |
| `tests/session-lifecycle.vitest.ts` | 2 | 0 | 0 | 2 |
| `tests/session-manager-extended.vitest.ts` | 42 | 0 | 0 | 42 |
| `tests/session-manager.vitest.ts` | 17 | 0 | 0 | 17 |
| `tests/shadow-comparison.vitest.ts` | 21 | 0 | 0 | 21 |
| `tests/shadow-scoring.vitest.ts` | 30 | 0 | 0 | 30 |
| `tests/signal-vocab.vitest.ts` | 27 | 0 | 0 | 27 |
| `tests/slug-uniqueness.vitest.ts` | 6 | 0 | 0 | 6 |
| `tests/spec-folder-hierarchy.vitest.ts` | 46 | 0 | 0 | 46 |
| `tests/spec-folder-prefilter.vitest.ts` | 22 | 0 | 0 | 22 |
| `tests/sqlite-fts.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/stage2-fusion.vitest.ts` | 1 | 0 | 0 | 1 |
| `tests/stdio-logging-safety.vitest.ts` | 1 | 0 | 0 | 1 |
| `tests/structure-aware-chunker.vitest.ts` | 9 | 0 | 0 | 9 |
| `tests/temporal-contiguity.vitest.ts` | 9 | 0 | 0 | 9 |
| `tests/tier-classifier.vitest.ts` | 78 | 0 | 0 | 78 |
| `tests/tiered-injection-turnNumber.vitest.ts` | 18 | 0 | 0 | 18 |
| `tests/token-budget-enforcement.vitest.ts` | 13 | 0 | 0 | 13 |
| `tests/token-budget.vitest.ts` | 16 | 0 | 0 | 16 |
| `tests/tool-cache.vitest.ts` | 65 | 0 | 0 | 65 |
| `tests/tool-input-schema.vitest.ts` | 26 | 0 | 0 | 26 |
| `tests/transaction-manager-extended.vitest.ts` | 10 | 0 | 0 | 10 |
| `tests/transaction-manager.vitest.ts` | 18 | 0 | 0 | 18 |
| `tests/trigger-config-extended.vitest.ts` | 69 | 0 | 0 | 69 |
| `tests/trigger-extractor.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/trigger-matcher.vitest.ts` | 19 | 0 | 0 | 19 |
| `tests/trigger-setAttentionScore.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/unit-composite-scoring-types.vitest.ts` | 13 | 0 | 0 | 13 |
| `tests/unit-folder-scoring-types.vitest.ts` | 12 | 0 | 0 | 12 |
| `tests/unit-fsrs-formula.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/unit-normalization-roundtrip.vitest.ts` | 14 | 0 | 0 | 14 |
| `tests/unit-normalization.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/unit-path-security.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/unit-rrf-fusion.vitest.ts` | 16 | 0 | 0 | 16 |
| `tests/unit-tier-classifier-types.vitest.ts` | 20 | 0 | 0 | 20 |
| `tests/unit-transaction-metrics-types.vitest.ts` | 10 | 0 | 0 | 10 |
| `tests/validation-metadata.vitest.ts` | 32 | 0 | 0 | 32 |
| `tests/vector-index-impl.vitest.ts` | 144 | 0 | 0 | 144 |
| `tests/working-memory-event-decay.vitest.ts` | 7 | 0 | 0 | 7 |
| `tests/working-memory.vitest.ts` | 47 | 0 | 0 | 47 |
| **Total** | **7153** | **4** | **0** | **7157** |

## Known Failures

| Failing test | Classification | Root cause baseline | Evidence |
| --- | --- | --- | --- |
| `tests/file-watcher.vitest.ts > file-watcher runtime behavior > forces reindex for repeated add events even when content is unchanged` | Async timing / debounce coordination | Test times out after `4000ms` while waiting for reindex completion, indicating unstable watcher event-to-reindex synchronization under the current baseline. | `waitFor` timeout noted in W2-A3 report at `tests/file-watcher.vitest.ts:114:5` |
| `tests/file-watcher.vitest.ts > file-watcher runtime behavior > waits for in-flight reindex to finish during close` | Async shutdown coordination | Close-path behavior does not satisfy the test's wait condition within `4000ms`, so in-flight reindex shutdown sequencing is currently baseline-broken. | `waitFor` timeout noted in W2-A3 report at `tests/file-watcher.vitest.ts:143:5` |
| `tests/file-watcher.vitest.ts > file-watcher runtime behavior > silently ignores ENOENT when file is removed before debounce execution` | Resource exhaustion / environment-sensitive watcher warning | The assertion expects no warning, but the watcher emits `EMFILE: too many open files, watch`, so the baseline includes a file-descriptor pressure side effect that surfaces as an unexpected warning. | W2-A3 report records `warn` unexpectedly called with `EMFILE` |
| `tests/handler-memory-ingest.vitest.ts > Handler Memory Ingest (Sprint 9 P0-3) > start queues job and returns queued response` | Mock contract drift | The mocked `../core` module does not export `DATABASE_PATH`, so the handler under test imports a symbol the test double does not provide. | W2-A3 report records `No "DATABASE_PATH" export is defined on the "../core" mock` |

### Failure Buckets

- `tests/file-watcher.vitest.ts` — `6` passed / `3` failed. Bucketed as watcher coordination plus environment/resource-noise failures.
- `tests/handler-memory-ingest.vitest.ts` — `6` passed / `1` failed. Bucketed as a test-mock contract failure.

## TypeScript Compilation Status

- Command: `npx tsc --noEmit`
- Status: **FAILED**
- Known compiler error:

```text
core/config.ts(92,14): error TS4023: Exported variable 'COGNITIVE_CONFIG' has or is using name 'CognitiveConfig' from external module "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/cognitive" but cannot be named.
```

- Root cause classification: exported API typing / declaration namability issue. `COGNITIVE_CONFIG` exposes the `CognitiveConfig` type from `configs/cognitive`, and TypeScript cannot emit a stable name for that external type in the current export shape.

## Regression Acceptance Criteria

Wave 7 regression verification should pass only if all of the following remain true unless one of the known baseline issues is intentionally fixed:

1. Vitest introduces **no new failing test files** beyond:
   - `tests/file-watcher.vitest.ts`
   - `tests/handler-memory-ingest.vitest.ts`
2. Vitest introduces **no new failing tests** beyond these four known failures:
   - the three `tests/file-watcher.vitest.ts` failures listed above
   - the single `tests/handler-memory-ingest.vitest.ts` failure listed above
3. Aggregate Vitest failure count is **<= 4**, unless any overage is explained by an intentional baseline fix plus a different newly introduced regression-free outcome.
4. TypeScript compilation does not introduce any **new compiler errors** beyond the known `core/config.ts(92,14)` `TS4023` error.
5. If any of the four known failures disappear, treat that as an expected improvement only after confirming that:
   - the corresponding behavior was intentionally changed, and
   - no additional failures replaced it elsewhere in the suite.

## Usage Note

Use this document as the comparison point for Wave 7. Any deviation from the failure inventory above should be treated as a regression candidate until proven to be an intentional fix or an unrelated pre-existing environment artifact.
