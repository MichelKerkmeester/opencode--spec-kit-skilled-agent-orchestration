# Legacy V1 pipeline removal

## Current Reality

The legacy V1 pipeline  was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6`. Since V2 was already the default, removing the dead code resolved all three at once. Deleted functions: `STATE_PRIORITY`, `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment. Unused imports (`fsrsScheduler`, `tierClassifier`, `crossEncoder`) were removed.

Orphaned chunk detection was added to `verify_integrity()` as the fourth P0 fix: chunks whose parent has been deleted but the chunk record persists (e.g., if FK cascade didn't fire) are now detected and optionally auto-cleaned when `autoClean=true`.

## Source Metadata

- Group: Opus review remediation (Phase 017)
- Source feature title: Legacy V1 pipeline removal
- Current reality source: feature_catalog.md
