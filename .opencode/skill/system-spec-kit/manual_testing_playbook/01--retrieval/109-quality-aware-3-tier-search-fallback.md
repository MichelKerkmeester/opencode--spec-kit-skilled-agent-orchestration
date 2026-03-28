---
title: "109 -- Quality-aware 3-tier search fallback"
description: "This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on confirming the multi-tier degradation chain triggers correctly via Stage 1 collectRawCandidates()."
---

# 109 -- Quality-aware 3-tier search fallback

## 1. OVERVIEW

This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on confirming the multi-tier degradation chain triggers correctly via the Stage 1 pipeline path (`collectRawCandidates`).

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `109` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multi-tier degradation chain triggers correctly via Stage 1 pipeline
- Prompt: `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline collectRawCandidates path. Capture evidence that Tier 1 hybrid search (minSimilarity=0.3) runs first; checkDegradation() evaluates Tier 1 quality; on degradation, Tier 2 widens to minSimilarity=0.1 without re-enabling channels the caller explicitly disabled; if both tiers produce no results, structural fallback only uses still-allowed lexical channels; and SPECKIT_SEARCH_FALLBACK=false switches to two-pass adaptive (0.3→0.17) instead of quality-checked tiers. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Tier 1 runs with minSimilarity=0.3; checkDegradation() evaluates quality (topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3); Tier 2 widens within the allowed channel set at minSimilarity=0.1; structural fallback fires only for still-allowed lexical channels when both tiers fail; SPECKIT_SEARCH_FALLBACK=false disables quality-checked tiering in favor of two-pass adaptive
- Pass/fail: PASS if quality-checked multi-tier fallback triggers via collectRawCandidates in the Stage 1 pipeline path, and disabling the flag switches to two-pass adaptive behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 109 | Quality-aware 3-tier search fallback | Confirm multi-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline. Capture evidence for quality-checked multi-tier fallback via collectRawCandidates.` | 1) Verify `collectRawCandidates()` in `hybrid-search.ts` checks `isSearchFallbackEnabled()` and computes `allowedChannels` before fallback widening 2) When flag=true: Tier 1 hybrid search (minSimilarity=0.3) → `checkDegradation()` quality check → Tier 2 (minSimilarity=0.1, widened only inside `allowedChannels`) → lexical structural fallback only if the corresponding lexical channel is still allowed 3) Confirm the fallback path reuses normalized lexical query preparation 4) When flag=false: two-pass adaptive (0.3→0.17) without quality-checked tiering 5) Verify `executePipeline()` in `memory_search` handler routes through Stage 1 which calls `collectRawCandidates()` | Tier 1 runs with minSimilarity=0.3; checkDegradation evaluates quality; Tier 2 widens within the allowed channel set; lexical structural fallback respects caller-disabled channels; flag=false switches to two-pass adaptive | Source code: `hybrid-search.ts` collectRawCandidates and fallback helpers, plus `search-flags.ts` fallback gate | PASS if quality-checked multi-tier fallback triggers via collectRawCandidates, preserves explicit channel disables, and disabling the flag switches to two-pass adaptive | Inspect `collectRawCandidates()` allowed-channel handling, `checkDegradation()` thresholds, and lexical fallback helper wiring |

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
