# Fix F38 Verification Report

Scope: 30 randomly sampled files (5 each from handlers, lib/search, lib/cognitive|lib/scoring, lib/storage|lib/eval, shared, scripts).

## Summary

| Metric | Value |
|---|---:|
| Files checked | 30 |
| Pass count | 20 |
| Fail count | 10 |

## Detailed Results

| # | Category | File | Result | Specific issues |
|---:|---|---|---|---|
| 1 | handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` | **PASS** | None |
| 2 | handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | **PASS** | None |
| 3 | handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts` | **PASS** | None |
| 4 | handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | **FAIL** | TSDOC: exported function `runPostInsertEnrichment` lacks JSDoc/TSDoc directly above declaration |
| 5 | handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts` | **FAIL** | TSDOC: exported function `applyPostInsertMetadata` lacks JSDoc/TSDoc directly above declaration |
| 6 | lib/search | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts` | **PASS** | None |
| 7 | lib/search | `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts` | **PASS** | None |
| 8 | lib/search | `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts` | **PASS** | None |
| 9 | lib/search | `.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts` | **PASS** | None |
| 10 | lib/search | `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts` | **FAIL** | TSDOC: exported function `expandQueryWithEmbeddings` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `isExpansionActive` lacks JSDoc/TSDoc directly above declaration |
| 11 | lib/cognitive or lib/scoring | `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts` | **PASS** | None |
| 12 | lib/cognitive or lib/scoring | `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts` | **FAIL** | TSDOC: exported function `computeConfidenceMultiplier` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `applyNegativeFeedback` lacks JSDoc/TSDoc directly above declaration |
| 13 | lib/cognitive or lib/scoring | `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts` | **PASS** | None |
| 14 | lib/cognitive or lib/scoring | `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts` | **PASS** | None |
| 15 | lib/cognitive or lib/scoring | `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` | **PASS** | None |
| 16 | lib/storage or lib/eval | `.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts` | **FAIL** | TSDOC: exported function `generateDashboardReport` lacks JSDoc/TSDoc directly above declaration |
| 17 | lib/storage or lib/eval | `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` | **FAIL** | TSDOC: exported function `runAblation` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `storeAblationResults` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `formatAblationReport` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `toHybridSearchFlags` lacks JSDoc/TSDoc directly above declaration |
| 18 | lib/storage or lib/eval | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts` | **PASS** | None |
| 19 | lib/storage or lib/eval | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts` | **PASS** | None |
| 20 | lib/storage or lib/eval | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts` | **PASS** | None |
| 21 | shared | `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` | **FAIL** | TSDOC: exported function `getAdaptiveWeights` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `adaptiveFuse` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `hybridAdaptiveFuse` lacks JSDoc/TSDoc directly above declaration |
| 22 | shared | `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts` | **FAIL** | MODULE HEADER: top 3 lines do not match required format |
| 23 | shared | `.opencode/skill/system-spec-kit/shared/index.ts` | **PASS** | None |
| 24 | shared | `.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts` | **FAIL** | TSDOC: exported function `splitIntoBlocks` lacks JSDoc/TSDoc directly above declaration; TSDOC: exported function `chunkMarkdown` lacks JSDoc/TSDoc directly above declaration |
| 25 | shared | `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts` | **PASS** | None |
| 26 | scripts | `.opencode/skill/system-spec-kit/scripts/evals/check-handler-cycles-ast.ts` | **PASS** | None |
| 27 | scripts | `.opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts` | **FAIL** | NO REGRESSIONS: duplicate module header found |
| 28 | scripts | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | **PASS** | None |
| 29 | scripts | `.opencode/skill/system-spec-kit/scripts/loaders/index.ts` | **PASS** | None |
| 30 | scripts | `.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts` | **PASS** | None |
