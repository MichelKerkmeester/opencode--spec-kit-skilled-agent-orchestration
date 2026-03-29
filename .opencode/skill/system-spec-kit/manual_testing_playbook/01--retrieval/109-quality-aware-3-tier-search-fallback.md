---
title: "109 -- Quality-aware 3-tier search fallback"
description: "This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on confirming the multi-tier degradation chain triggers correctly via Stage 1 collectRawCandidates() and enriches only once after the final tier is chosen."
---

# 109 -- Quality-aware 3-tier search fallback

## 1. OVERVIEW

This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on confirming the multi-tier degradation chain triggers correctly via the Stage 1 pipeline path (`collectRawCandidates`) and only performs post-fusion enrichment once on the final merged tier.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `109` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multi-tier degradation chain triggers correctly via Stage 1 pipeline and enriches once after final tier selection
- Prompt: `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline collectRawCandidates path. Capture evidence that Tier 1 hybrid search (minSimilarity=0.3) runs first; checkDegradation() evaluates Tier 1 quality; on degradation, Tier 2 widens to minSimilarity=0.1 without re-enabling channels the caller explicitly disabled; fused candidates are collected per tier before reranking/co-activation/token truncation; enrichment runs once on the final merged tier only; if both tiers still degrade, structural fallback only uses still-allowed lexical channels; and SPECKIT_SEARCH_FALLBACK=false switches to two-pass adaptive (0.3→0.17) instead of quality-checked tiers. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Tier 1 runs with minSimilarity=0.3; checkDegradation() evaluates quality (topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3); Tier 2 widens within the allowed channel set at minSimilarity=0.1; per-tier collection stops after fusion; reranking/co-activation/token budget execution happens once on the final merged candidate set; structural fallback fires only for still-allowed lexical channels when both tiers fail; SPECKIT_SEARCH_FALLBACK=false disables quality-checked tiering in favor of two-pass adaptive
- Pass/fail: PASS if quality-checked multi-tier fallback triggers via collectRawCandidates, preserves explicit channel disables, and defers enrichment to a single final-tier pass

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 109 | Quality-aware 3-tier search fallback | Confirm multi-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline. Capture evidence for quality-checked multi-tier fallback via collectRawCandidates and single-pass enrichment on the final merged tier.` | 1) Verify `collectRawCandidates()` in `hybrid-search.ts` calls `executeFallbackPlan(..., { stopAfterFusion: true })` when the fallback flag is enabled 2) Confirm Tier 1 runs at minSimilarity=0.3, `checkDegradation()` evaluates quality, and Tier 2 widens to minSimilarity=0.1 only inside `allowedChannels` 3) Verify `searchWithFallbackTiered()` merges Tier 1, Tier 2, and calibrated Tier 3 candidates before calling `enrichFusedResults()` once on the final stage execution context 4) Confirm enrichment-only stages such as reranking, co-activation, contextual headers, and `truncateToBudget()` live inside `enrichFusedResults()` rather than the per-tier collection path 5) When flag=false: verify two-pass adaptive (0.3→0.17) without quality-checked tiering 6) Verify `executePipeline()` in `memory_search` handler routes through Stage 1 which calls `collectRawCandidates()` | Tier 1 runs with minSimilarity=0.3; checkDegradation evaluates quality; Tier 2 widens within the allowed channel set; per-tier collection stops after fusion; enrichment runs once on the final merged candidate set; lexical structural fallback respects caller-disabled channels; flag=false switches to two-pass adaptive | Source code: `hybrid-search.ts` collectRawCandidates, `executeFallbackPlan()`, `searchWithFallbackTiered()`, `enrichFusedResults()`, plus `search-flags.ts` fallback gate | PASS if quality-checked multi-tier fallback triggers via collectRawCandidates, preserves explicit channel disables, and only performs enrichment after the final merged tier is selected | Inspect `collectRawCandidates()` stop-after-fusion behavior, `checkDegradation()` thresholds, `searchWithFallbackTiered()` merge order, and whether enrichment helpers are invoked once or per tier |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/08-quality-aware-3-tier-search-fallback.md](../../feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 109
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/109-quality-aware-3-tier-search-fallback.md`
