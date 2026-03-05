---
title: "Verification Agent 10: Tooling & Governance Review"
reviewer: "@review agent (claude-sonnet-4-6)"
date: 2026-03-01
scope: "Features 61-64, 91-95 — Tooling scripts, feature flags, governance"
result: PASS WITH NOTES
score: 83/100
---

# Verification Agent 10: Tooling & Governance Review

## Summary

**Recommendation**: PASS WITH NOTES
**Score**: 83/100
**Confidence**: HIGH — all files read directly, all claims traced to source

| Dimension      | Score | Notes |
|----------------|-------|-------|
| Correctness    | 26/30 | Minor logic concern in resolveAction ordering; flag inventory count mismatch |
| Security       | 25/25 | No issues; flags are env-var read-only, no injection vectors |
| Patterns       | 16/20 | 6-flag cap not enforced in code; 90-day lifespan documentation-only |
| Maintainability| 12/15 | Excellent documentation; cap enforcement gap reduces confidence |
| Performance    | 10/10 | No issues; tree-thinning is pure, progressive-validate is efficient |

---

## Feature Results

### Feature 61: Tree Thinning Script — PASS

**File**: `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts`

The tree-thinning module is implemented as a pure, I/O-free function (`applyTreeThinning`) with a well-structured two-pass algorithm: classify each file by token count, then group files-to-merge by parent directory. The implementation is correct and testable. A vitest suite exists at `scripts/tests/tree-thinning.vitest.ts`.

**Merge thresholds verified**:

| File type | Threshold | Action |
|-----------|-----------|--------|
| Spec file < 200 tokens | `mergeThreshold: 200` | merged-into-parent |
| Spec file 200-499 tokens | `contentAsTextThreshold: 500` | content-as-summary |
| Spec file >= 500 tokens | — | keep |
| Memory file < 100 tokens | `memoryTextThreshold: 100` | content-as-summary |
| Memory file 100-299 tokens | `memoryThinThreshold: 300` | merged-into-parent |
| Memory file >= 300 tokens | — | keep |

**P2 — Suggestion**: The `resolveAction` function for memory files (lines 141-151) returns `content-as-summary` for tokens < `memoryTextThreshold` (100) and `merged-into-parent` for tokens < `memoryThinThreshold` (300). The naming is slightly misleading: "content-as-text" semantically implies the file is very small and needs no summary pass, but it is returned *before* the larger merge threshold is checked. This is logically correct but the intent is inverted relative to spec files (where smaller tokens get merged and larger ones get content-as-summary). A comment in the function or a rename of the memory branches would improve clarity.

**P2 — Suggestion**: `tokensSaved` calculation for `merged-into-parent` adds a flat 20 tokens per file (line 235). This is documented as "header overhead" but has no empirical basis. This is acceptable for a heuristic pre-pipeline estimate but should be called out as approximate in the comment.

### Feature 62: Progressive Validation (4 Levels) — PASS

**File**: `.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh`

All 4 levels are implemented and correctly chained:

| Level | Name | Implementation |
|-------|------|----------------|
| 1 | Detect | Delegates to `validate.sh`, captures exit code in `VALIDATE_EXIT` |
| 2 | Auto-fix | Three fixes: `autofix_missing_dates`, `autofix_heading_levels`, `autofix_whitespace` |
| 3 | Suggest | Queries `validate.sh --json`, extracts rule names, maps to remediation hints via `get_suggestion_for_rule()` |
| 4 | Report | Produces human-readable or `--json` structured output with before/after diffs |

**Script structure check**:
- Shebang: `#!/usr/bin/env bash` — present and correct
- Error handling: `set -euo pipefail` — present
- Exit codes: 0/1/2 compatible with `validate.sh` — verified (lines 731-740)
- Help text: `show_help()` function with full usage block — present
- Version flag: `--version` returning `$VERSION` — present
- Boolean flag pattern: uses `[[ "$FLAG" == "true" ]]` consistently, with a comment explaining why direct use with `set -e` is unsafe (lines 38-41)
- Dry-run safety: all write operations guarded by `[[ "$DRY_RUN" != "true" ]]` — verified at lines 337, 394, 437

**P2 — Suggestion**: Level 3 (`run_level3_suggest`) runs `validate.sh` twice: once in quiet mode to check the exit code, then again in JSON mode to extract structured data (lines 484-499). This double-invocation is a minor inefficiency. A single JSON-mode call with exit-code capture would be sufficient, since JSON mode captures both the exit code and structured data.

**P2 — Suggestion**: The `compute_diff` function uses `mktemp` with a fixed prefix pattern (`/tmp/progressive-validate-old.XXXXXX`). The `rm -f` cleanup (line 200) runs unconditionally, but if the script is interrupted mid-diff by SIGINT, the temp files may be left behind. A `trap 'rm -f ...' EXIT` would be more robust.

### Feature 63: Feature Flag Governance (6-Active Cap, 90-Day Lifespan) — PASS WITH NOTES

**File**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion-refinement/001-sprint-0-measurement-foundation/scratch/t000b-feature-flag-governance.md`

The governance framework is thoroughly documented:
- Cap: 6 active flags enforced per documentation
- Lifespan: 90-day maximum with a one-time 14-day INCONCLUSIVE extension
- Naming convention: `SPECKIT_[FEATURE]` (uppercase, underscore-separated)
- Lifecycle states: INTRODUCED → MEASURING → INCONCLUSIVE → ADOPT | RETIRE
- B8 signal ceiling: 12 active scoring signals maximum
- Monthly audit template: provided with structured table format

**P1 — Required**: The 6-active-flag cap is **not enforced in code** anywhere. A search across the entire `mcp_server/**/*.ts` source tree found zero references to `MAX_ACTIVE_FLAGS`, `maxActiveFlags`, or any runtime guard that counts active flags. The cap is enforced only through documentation and audit reviews (`t-fs0-flag-sunset-review.md`, `wave-8-flag-review-sprint3.md`). For a governance control this important, the absence of a runtime or CI-level enforcement means the cap can be exceeded silently without any automated signal. The audit documents themselves demonstrate compliance (5/6 at Sprint 0, 5/6 at Sprint 3), but this relies entirely on human discipline.

**Recommendation**: Add a CI-level script or a startup assertion that counts active `SPECKIT_` flags in MEASURING state and fails if the count exceeds 6. This does not need to be a runtime check — a pre-commit or CI-only script scanning `search-flags.ts` and related files would be sufficient.

**P2 — Suggestion**: The 90-day lifespan is also documentation-only. The monthly audit template (Section 5) provides a table with "Decision Due" column, but no tooling computes or enforces this deadline. A simple script generating a dated flag inventory from git log would reduce audit burden.

### Feature 64: Sunset Audit for Deprecated Flags — PASS

**Files reviewed**:
- `001-sprint-0-measurement-foundation/scratch/t-fs0-flag-sunset-review.md`
- `004-sprint-3-query-intelligence/scratch/wave-8-flag-review-sprint3.md`
- `008-sprint-7-long-horizon/scratch/w2-a10-flag-audit.md`

The sunset audit program is comprehensive. The Sprint 7 exit audit (`w2-a10-flag-audit.md`) represents the most complete artifact:
- Grepped all `mcp_server/**/*.ts` source for `SPECKIT_` flags
- Found 61 unique flags total
- Categorized: 18 permanent/core, 8 config/tuning, 3 debug, 39 sunset-candidate
- Disposition of sunset candidates: 27 GRADUATE, 9 REMOVE, 3 KEEP

Dead code removal was completed in Sprint 8:
- `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts` — verified absent
- `isRsfEnabled()` removed from `rsf-fusion.ts` — consistent with no SHADOW_SCORING/RSF references in `search-flags.ts`
- Dead flag branches removed from `hybrid-search.ts`

**P2 — Suggestion**: The Sprint 0 sunset audit (`t-fs0-flag-sunset-review.md`, line 134-137) identifies that Sprint 138 flags (`SPECKIT_MMR`, `SPECKIT_TRM`, `SPECKIT_MULTI_QUERY`) may be approaching or past their 90-day deadline, recommending verification at the March 2026 monthly audit (2026-03-02, which is tomorrow relative to review date). This outstanding action item should be addressed at the first monthly audit.

### Feature 91: INT8 Quantization Decision (Documented but Deferred) — PASS

**File**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion-refinement/research/scratch/research-zvec-int8-quantization-portability.md`

The decision is thoroughly documented with quantitative evidence:

- **Decision**: NO-GO (deferred)
- **Rationale**: All three activation criteria unmet — 2,412 memories vs 10,000 threshold (24.1%); p95 ~15ms vs 50ms threshold; 1,024-dim vs 1,536 threshold
- **Storage savings**: 7.1 MB / 3.9% of DB — not material
- **Precision risk**: ~1-2% recall estimated from zvec research extrapolation
- **Re-evaluation triggers**: Clearly stated (>10K memories, >50ms p95, new provider, stable sqlite-vec 1.0)

The research document is exemplary: it includes algorithm analysis, implementation sketch, TypeScript code samples, migration strategy with three phases, and a risk assessment table. The decision matrix (Section 9.1) clearly contrasts four options with quantified tradeoffs.

**P2 — Suggestion**: The confidence assessment (Section 5.4) correctly labels the INT8 recall impact as "Medium / B grade evidence (extrapolation from zvec data, not measured on our corpus)." Given that the decision is based partly on unvalidated recall impact, the document would benefit from a single empirical measurement: run a shadow INT8 search against FP32 on a sample of 50 queries and record the rank correlation. This would upgrade the evidence grade to A before the 10K re-evaluation threshold is reached.

### Features 92-93: Deferred Feature Decisions — PASS

**From summary_of_new_features.md** (Decisions and Deferrals section, lines 726-748):

Three features originally deferred have been implemented (N2, R10, R8, S5). This is a positive finding — features were not abandoned, they were re-evaluated and implemented when unblocked:

| Feature | Original Decision | Final Status |
|---------|------------------|--------------|
| N2 (Graph centrality + community detection) | Deferred Sprint 6b | Implemented: `SPECKIT_GRAPH_SIGNALS`, `SPECKIT_COMMUNITY_DETECTION` |
| R10 (Auto entity extraction) | Deferred Sprint 6b | Implemented: `SPECKIT_AUTO_ENTITIES` |
| R8 (Memory summary generation) | Skipped Sprint 7 (scale gate unmet) | Implemented with runtime scale gate (skip < 5K memories) |
| S5 (Cross-document entity linking) | Skipped Sprint 7 (no entity catalog) | Implemented: `SPECKIT_ENTITY_LINKING` |

All deferred decisions include rationale (scale thresholds, dependency requirements) and re-evaluation triggers. Documentation quality is high.

### Feature 94: Feature Flag Inventory (20 Flags Documented) — PASS WITH NOTES

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`

**P1 — Required (Minor)**: The summary (`summary_of_new_features.md`, line 616) states "the current active flag inventory stands at **20 flags in `search-flags.ts`**." A direct count of exported functions in the file returns **19**, not 20.

Verified flags in `search-flags.ts`:
1. `isMMREnabled` — `SPECKIT_MMR`
2. `isTRMEnabled` — `SPECKIT_TRM`
3. `isMultiQueryEnabled` — `SPECKIT_MULTI_QUERY`
4. `isCrossEncoderEnabled` — `SPECKIT_CROSS_ENCODER`
5. `isSearchFallbackEnabled` — `SPECKIT_SEARCH_FALLBACK`
6. `isFolderDiscoveryEnabled` — `SPECKIT_FOLDER_DISCOVERY`
7. `isDocscoreAggregationEnabled` — `SPECKIT_DOCSCORE_AGGREGATION`
8. `isSaveQualityGateEnabled` — `SPECKIT_SAVE_QUALITY_GATE`
9. `isReconsolidationEnabled` — `SPECKIT_RECONSOLIDATION`
10. `isNegativeFeedbackEnabled` — `SPECKIT_NEGATIVE_FEEDBACK`
11. `isPipelineV2Enabled` — `SPECKIT_PIPELINE_V2`
12. `isEmbeddingExpansionEnabled` — `SPECKIT_EMBEDDING_EXPANSION`
13. `isConsolidationEnabled` — `SPECKIT_CONSOLIDATION`
14. `isEncodingIntentEnabled` — `SPECKIT_ENCODING_INTENT`
15. `isGraphSignalsEnabled` — `SPECKIT_GRAPH_SIGNALS`
16. `isCommunityDetectionEnabled` — `SPECKIT_COMMUNITY_DETECTION`
17. `isMemorySummariesEnabled` — `SPECKIT_MEMORY_SUMMARIES`
18. `isAutoEntitiesEnabled` — `SPECKIT_AUTO_ENTITIES`
19. `isEntityLinkingEnabled` — `SPECKIT_ENTITY_LINKING`

The summary's claim of 20 flags likely counted `SPECKIT_SHADOW_SCORING` or `SPECKIT_ABLATION` which are not in this file. The summary describes `SPECKIT_SHADOW_SCORING` as "hardcoded OFF and scheduled for removal" and `SPECKIT_ABLATION` as "defaults OFF as an opt-in evaluation tool" — neither of these has a corresponding `isXEnabled()` function in `search-flags.ts` based on the direct read. The count discrepancy is a documentation inconsistency, not a code defect. Severity is minor: the inventory of 19 flags in `search-flags.ts` is accurate and complete; the number "20" in the summary is off by one.

**Flag registration quality**: Each of the 19 flags has a JSDoc comment stating the feature name, default state, and override env-var syntax. The grouping into logical sections (core, Hybrid RAG, pipeline, indexing/graph, deferred) aids navigation. This is well above average for flag documentation.

### Feature 95: Final Standards Verification — PASS

**Verified against multiple artifacts**:

| Standard | Status | Evidence |
|----------|--------|----------|
| TypeScript patterns in search-flags.ts | PASS | All functions use `isFeatureEnabled()` from `rollout-policy.ts`; consistent return type `boolean`; JSDoc on all 19 functions |
| rollout-policy.ts correctness | PASS | `isFeatureEnabled` correctly handles undefined (enabled), 'false' (disabled), 'true' (enabled), and rollout-percent gating; edge cases for empty strings handled |
| Script shebang + error handling | PASS | `#!/usr/bin/env bash`, `set -euo pipefail` on progressive-validate.sh |
| Script exit codes | PASS | 0/1/2 semantics preserved; identical to validate.sh contract |
| Script help text | PASS | Full `show_help()` function with OPTIONS, LEVELS, EXIT CODES, and AUTO-FIXES sections |
| Naming convention | PASS | All flags follow `SPECKIT_[FEATURE]` uppercase underscore convention |
| Documentation quality | PASS | Governance doc, sunset audit, deferred decision record all present with quantitative rationale |
| Dead code removal | PASS | Shadow-scoring and RSF functions confirmed absent from search-flags.ts |

**P2 — Suggestion**: `rollout-policy.ts` exports `deterministicBucket` and `isIdentityInRollout` as public functions but they are not referenced outside the module (based on grep pattern; they are internal helpers). Marking them unexported or adding a comment that they are exported for testing would reduce the public API surface.

---

## Issues Summary

### P1 — Required (2)

**P1-1: 6-flag cap has no code-level enforcement**
- Location: Governance design (Feature 63) — no file:line because the enforcement is *absent*
- Impact: The governance cap can be exceeded silently without automated detection. Compliance relies entirely on manual audit discipline.
- Fix: Add a CI script (e.g., `scripts/ops/check-flag-cap.sh`) that greps `search-flags.ts` and related files for active feature flag functions, counts them, and exits non-zero if > 6.

**P1-2: Flag inventory count mismatch — summary says 20, actual count is 19**
- Location: `summary_of_new_features.md` line 616 vs `search-flags.ts` (19 exported functions counted)
- Impact: Documentation is inaccurate by one. A reader checking the "20 flags" claim against the source will find 19 and question the audit's reliability.
- Fix: Update `summary_of_new_features.md` line 616 to read "19 flags in `search-flags.ts`" or verify whether a 20th flag function exists elsewhere and link it.

### P2 — Suggestions (6)

1. `tree-thinning.ts` — Memory file action ordering (`resolveAction`) is semantically inverted relative to spec files; add a clarifying comment.
2. `tree-thinning.ts` — `tokensSaved` flat 20-token merged-file overhead is an undocumented heuristic; annotate as approximate.
3. `progressive-validate.sh` — Level 3 runs `validate.sh` twice; single JSON-mode call with exit-code capture would suffice.
4. `progressive-validate.sh` — `mktemp` temp files lack `trap EXIT` cleanup; add for robustness.
5. Feature 91 INT8 research — Confidence grade is B (extrapolation); a shadow empirical measurement before 10K threshold would upgrade to A.
6. `rollout-policy.ts` — `deterministicBucket` and `isIdentityInRollout` are exported but appear to be test-only helpers; consider unexporting or documenting.

---

## Positive Highlights

- **Progressive validation script is production-quality**: 748 LOC with dry-run safety, JSON output mode, before/after diff logging, and a clear 4-level pipeline. The boolean flag handling pattern with explicit string comparisons is explicitly documented and correct.
- **Tree-thinning is pure and testable**: No I/O, no side effects, full test coverage in vitest. The two-pass design (classify then merge) is clean and the `buildMergedSummary` function preserves all content with path headers to prevent content loss.
- **INT8 deferred decision is a model example**: Quantitative evidence, implementation sketch, empirical thresholds, risk table, and re-evaluation triggers. The decision to defer is well-justified and the document provides everything needed to re-open the decision at the right time.
- **Sunset audit at Sprint 7 is comprehensive**: grep-verified source scan, 61 unique flags, triaged with GRADUATE/REMOVE/KEEP classifications and per-flag justification. The rollup summary is actionable.
- **Dead code removal verified**: Shadow-scoring and RSF functions confirmed absent from `search-flags.ts`; Sprint 8 remediation was effective.
- **rollout-policy.ts is robust**: `isFeatureEnabled` correctly handles all edge cases including undefined env vars, empty strings, and percent-based gating with a deterministic bucket function.

---

## Files Reviewed

| File | Type | Issues |
|------|------|--------|
| `mcp_server/lib/search/search-flags.ts` | TypeScript | P1-2 (count mismatch) |
| `mcp_server/lib/cache/cognitive/rollout-policy.ts` | TypeScript | P2 (export surface) |
| `scripts/core/tree-thinning.ts` | TypeScript | P2 x2 |
| `scripts/tests/tree-thinning.vitest.ts` | TypeScript test | None |
| `scripts/spec/progressive-validate.sh` | Shell script | P2 x2 |
| `001-sprint-0.../scratch/t000b-feature-flag-governance.md` | Governance doc | P1-1 (no code enforcement) |
| `001-sprint-0.../scratch/t-fs0-flag-sunset-review.md` | Audit doc | P2 (overdue flag check) |
| `004-sprint-3.../scratch/wave-8-flag-review-sprint3.md` | Audit doc | None |
| `008-sprint-7.../scratch/w2-a10-flag-audit.md` | Audit doc | None |
| `research/scratch/research-zvec-int8-quantization-portability.md` | Research doc | P2 (evidence grade) |
| `summary_of_new_features.md` (tooling sections) | Summary | P1-2 |
