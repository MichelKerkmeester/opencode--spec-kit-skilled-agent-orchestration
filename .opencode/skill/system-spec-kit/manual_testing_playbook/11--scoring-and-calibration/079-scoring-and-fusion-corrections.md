---
title: "079 -- Scoring and fusion corrections"
description: "This scenario validates scoring and fusion corrections for `079` with executable source checks and a targeted Vitest regression bundle for the phase-017 fixes plus the later single-pass fusion refinement."
---

# 079 -- Scoring and fusion corrections

## 1. OVERVIEW

This scenario validates scoring and fusion corrections for `079`. It focuses on confirming the phase-017 correction bundle plus the later T315 single-pass fusion refinement with executable source anchors and the regression tests that cover the corrected math, normalization, fusion, and score-resolution behavior.

---

## 2. CURRENT REALITY

Operators verify that the implementing symbols are present in the expected source files, then rerun the targeted regression suite from the `@spec-kit/mcp-server` workspace.

- Objective: Confirm the phase-017 scoring and fusion correction bundle plus the T315 single-pass fusion refinement with executable source and regression checks.
- Prompt: `Validate the phase-017 scoring and fusion correction bundle plus the T315 single-pass fusion refinement. Confirm the implementing symbols exist in the expected source files, rerun the targeted regression tests, and return a concise pass/fail verdict with the first failing symbol or test if anything breaks.`
- Expected signals: `rg` finds the corrected scoring, normalization, fusion, BM25 scope, interference-threshold, score-alias, and single-pass fusion symbols; the targeted Vitest run exits 0 with all files passing; the current baseline summary is `Test Files 8 passed (8)` and `Tests 350 passed (350)`.
- Pass/fail: PASS if all required source anchors are present and the targeted Vitest bundle exits 0 with no failed tests.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 079 | Scoring and fusion corrections | Confirm phase-017 correction bundle plus T315 single-pass fusion | `Validate the phase-017 scoring and fusion correction bundle plus the T315 single-pass fusion refinement. Confirm the implementing symbols exist in the expected source files, rerun the targeted regression tests, and return a concise pass/fail verdict with the first failing symbol or test if anything breaks.` | 1) `rg -n "calculateFiveFactorScore|normalizeCompositeScores|computeInterferenceScoresBatch|bm25Search|applyIntentWeights|resolveEffectiveScore|withSyncedScoreAliases|syncScoreAliasesInPlace|const fusionLists = lists|keywordFusionResults|fuseResultsMulti\\(fusionLists\\)" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`<br>2) `rg -n "getAdaptiveWeights|canonicalRrfId|fuseResultsCrossVariant" .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts`<br>3) `cd .opencode/skill/system-spec-kit/mcp_server && node ./node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/score-normalization.vitest.ts tests/hybrid-search.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/adaptive-fusion.vitest.ts tests/score-resolution-consistency.vitest.ts tests/interference.vitest.ts tests/intent-weighting.vitest.ts` | Source grep returns matches for all expected symbols, including the single-pass fusion anchors; Vitest reports all eight files passing and no `FAIL` lines; current baseline summary is `Test Files 8 passed (8)` and `Tests 350 passed (350)` | Saved `rg` output showing each symbol in the expected implementation files plus the final Vitest summary | PASS if both `rg` commands return all expected symbols and the Vitest command exits 0 with zero failed files/tests. FAIL if any symbol is missing, any target file fails, or Vitest exits non-zero. | If a symbol is missing, inspect the corresponding implementation file listed in step 1 or 2. Use `mcp_server/lib/search/hybrid-search.ts` first when the missing anchor is `fusionLists`, `keywordFusionResults`, or `fuseResultsMulti(fusionLists)`. If Vitest fails, use the first failing file to localize the regression: `composite-scoring.vitest.ts` / `score-normalization.vitest.ts` for normalization math, `hybrid-search.vitest.ts` for BM25 scope handling and single-pass fusion wiring, `unit-rrf-fusion.vitest.ts` and `adaptive-fusion.vitest.ts` for fusion logic, `score-resolution-consistency.vitest.ts` for alias resolution, `interference.vitest.ts` for threshold wiring, and `intent-weighting.vitest.ts` for recency-aware intent weighting. |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)
- Source files: `mcp_server/lib/scoring/composite-scoring.ts`, `mcp_server/lib/scoring/interference-scoring.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/intent-classifier.ts`, `mcp_server/lib/search/pipeline/types.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `shared/algorithms/adaptive-fusion.ts`, `shared/algorithms/rrf-fusion.ts`
- Regression tests: `mcp_server/tests/composite-scoring.vitest.ts`, `mcp_server/tests/score-normalization.vitest.ts`, `mcp_server/tests/hybrid-search.vitest.ts`, `mcp_server/tests/unit-rrf-fusion.vitest.ts`, `mcp_server/tests/adaptive-fusion.vitest.ts`, `mcp_server/tests/score-resolution-consistency.vitest.ts`, `mcp_server/tests/interference.vitest.ts`, `mcp_server/tests/intent-weighting.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 079
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/079-scoring-and-fusion-corrections.md`
