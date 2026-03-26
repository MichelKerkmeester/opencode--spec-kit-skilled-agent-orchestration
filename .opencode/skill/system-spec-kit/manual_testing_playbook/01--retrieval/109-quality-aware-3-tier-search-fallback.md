---
title: "109 -- Quality-aware 3-tier search fallback"
description: "This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on Confirm 3-tier degradation chain triggers correctly."
---

# 109 -- Quality-aware 3-tier search fallback

## 1. OVERVIEW

This scenario validates Quality-aware 3-tier search fallback for `109`. It focuses on Confirm 3-tier degradation chain triggers correctly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `109` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 3-tier degradation chain triggers correctly
- Prompt: `Validate SPECKIT_SEARCH_FALLBACK tiered degradation. Capture the evidence needed to prove Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation
- Pass/fail: PASS if all 3 tiers trigger in correct order based on quality thresholds and disabling fallback produces single-tier behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 109 | Quality-aware 3-tier search fallback | Confirm 3-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation. Capture the evidence needed to prove Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({query:"zzz_nonexistent_term_zzz", limit:20})` with default settings (Tier 1) 2) inspect `_degradation` property on result — if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3, confirm Tier 2 triggered 3) verify Tier 2 uses minSimilarity=0.1 and forces all channels 4) if Tier 2 also fails quality check, confirm Tier 3 structural SQL fallback fires 5) verify Tier 3 scores capped at 50% of existing top score 6) set `SPECKIT_SEARCH_FALLBACK=false` and verify single-tier only | Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation | Search output with _degradation property + per-tier channel configuration evidence + fallback-disabled comparison | PASS if all 3 tiers trigger in correct order based on quality thresholds and disabling fallback produces single-tier behavior | Inspect quality threshold constants (topScore, relativeGap, resultCount); verify tier transition logic; check Tier 3 score capping at 50% |

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
