---
title: "Wave 2 - Gemini New Features Summary Verification"
source: "cli-gemini (gemini-3.1-pro-review)"
date: 2026-03-02
---

# Wave 2: Gemini New Features Summary Verification

## Results: 15/15 MATCH — All features verified against code

| # | Feature | Verdict | Evidence |
|---|---------|---------|----------|
| 1 | G1 Graph channel ID fix | MATCH | `graph-search-fn.ts`: `CAST(ce.source_id AS INTEGER)`, TypeScript `Number(row.source_id)` |
| 2 | isPipelineV2Enabled() always true | MATCH | `search-flags.ts`: hardcoded `return true` |
| 3 | SPECKIT_PIPELINE_V2 deprecated | MATCH | JSDoc `@deprecated`, env var is no-op |
| 4 | resolveEffectiveScore() shared | MATCH | `pipeline/types.ts`: fallback chain `intentAdjustedScore -> rrfScore -> score -> similarity/100`, clamped [0,1] |
| 5 | Stage 4 score immutability | MATCH | `Stage4ReadonlyRow` + `verifyScoreInvariant()` in pipeline/types.ts |
| 6 | MPAB_BONUS_COEFFICIENT = 0.3 | MATCH | `mpab-aggregation.ts`: exported as `0.3` |
| 7 | Quality gate 14-day warn-only + SQLite | MATCH | `save-quality-gate.ts`: `WARN_ONLY_PERIOD_MS` = 14 days, `loadActivationTimestampFromDb()` + `persistActivationTimestampToDb()` |
| 8 | Self-loop rejection | MATCH | `causal-edges.ts`: `if (sourceId === targetId) { return null; }` |
| 9 | SPECKIT_SHADOW_SCORING inert | MATCH | `shadow-scoring.ts`: `runShadowScoring` returns `null`, `logShadowComparison` returns `false` |
| 10 | N4 novelty boost removed | MATCH | `composite-scoring.ts`: `calculateNoveltyBoost()` deprecated, always returns 0 |
| 11 | Channel quality floor = 0.005 | MATCH | `channel-representation.ts`: `QUALITY_FLOOR = 0.005` |
| 12 | Interference coefficient = -0.08 | MATCH | `interference-scoring.ts`: `INTERFERENCE_PENALTY_COEFFICIENT = -0.08` |
| 13 | Entity normalization unified | MATCH | `entity-linker.ts`: Unicode-aware `/[^\p{L}\p{N}\s]/gu`, re-exported by `entity-extractor.ts` |
| 14 | Memory delete cleans ancillary | MATCH | `vector-index-impl.ts`: `delete_memory()` cleans degree_snapshots, community_assignments, memory_summaries, memory_entities, causal_edges |
| 15 | Five-factor weights normalize | MATCH | `composite-scoring.ts`: `wSum` normalization + `adaptive-fusion.ts`: core weights normalize to 1.0 |

## Assessment

**Zero mismatches found.** The `summary_of_new_features.md` documentation is fully accurate against the current codebase for all 15 features sampled. Feature flag values, function signatures, pipeline behaviors, and constants all match precisely.
