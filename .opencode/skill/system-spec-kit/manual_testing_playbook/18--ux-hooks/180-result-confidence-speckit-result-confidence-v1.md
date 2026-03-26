---
title: "180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE_V1)"
description: "This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE_V1) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 4-factor weighting."
---

# 180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE_V1)

## 1. OVERVIEW

This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE_V1) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 4-factor weighting.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `180` and confirm the expected signals without contradicting evidence.

- Objective: Verify per-result calibrated confidence with 4-factor weighting
- Prompt: `Test the default-on SPECKIT_RESULT_CONFIDENCE_V1 behavior. Run a search and verify each result receives a calibrated confidence score computed from 4 weighted factors: margin (0.35), channel agreement (0.30), reranker support (0.20), and anchor density (0.15). Confirm results are labeled high/medium/low based on thresholds (HIGH >= 0.7, LOW < 0.4), and that confidence drivers are reported per result. Verify this is heuristic only with no LLM calls. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 4 factors: margin 0.35, channel agreement 0.30, reranker support 0.20, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, reranker_boost, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM)
- Pass/fail: PASS if per-result confidence uses 4-factor heuristic weighting (margin/channel/reranker/anchor) blended with a score-prior calibration term, labels match thresholds, and drivers are reported; FAIL if heuristic factors missing, thresholds wrong, labels missing, or LLM called in hot path

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 180 | Result confidence (SPECKIT_RESULT_CONFIDENCE_V1) | Verify per-result calibrated confidence with 4-factor weighting | `Test the default-on SPECKIT_RESULT_CONFIDENCE_V1 behavior. Run a search and verify 4-factor weighted confidence scoring with high/medium/low labels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_RESULT_CONFIDENCE_V1` is unset or `true` 2) `memory_search({ query: "well-covered topic with multiple memories" })` 3) Inspect per-result confidence scores and labels 4) Verify 4-factor weights: margin=0.35, channel_agreement=0.30, reranker=0.20, anchor_density=0.15 5) Check confidence drivers reported per result 6) Verify labels: score >= 0.7 → high, < 0.4 → low, else → medium 7) Confirm requestQuality label (good/weak/gap) | Per-result confidence score computed; 4 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM | Per-result confidence output + factor breakdown + label assignments + driver lists + requestQuality + test transcript | PASS if 4-factor weighted confidence produces correct scores, labels match thresholds, and drivers reported; FAIL if weights wrong, thresholds incorrect, labels missing, or LLM used | Verify confidence-scoring.ts module loaded → Confirm flag is not forced off → Check factor weights (0.35/0.30/0.20/0.15) → Inspect HIGH_THRESHOLD=0.7 and LOW_THRESHOLD=0.4 → Verify driver detection logic → Check requestQuality computation |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/19-result-confidence.md](../../feature_catalog/18--ux-hooks/19-result-confidence.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/confidence-scoring.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 180
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/180-result-confidence-speckit-result-confidence-v1.md`
