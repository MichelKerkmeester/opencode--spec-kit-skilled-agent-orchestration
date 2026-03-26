---
title: "160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)"
description: "This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It focuses on enabling the flag, running a search, and verifying shadow_scoring_log entries are created."
---

# 160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)

## 1. OVERVIEW

This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It focuses on enabling the flag, running a search, and verifying shadow_scoring_log entries are created.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `160` and confirm the expected signals without contradicting evidence.

- Objective: Verify shadow scoring log entries are created and holdout evaluation runs
- Prompt: `Test SPECKIT_SHADOW_FEEDBACK=true. Run a shadow evaluation with holdout queries, then verify shadow_scoring_log entries are created with per-result rank deltas. Capture the evidence needed to prove logRankDelta() writes rows, compareRanks() produces Kendall tau and NDCG delta, and evaluatePromotionGate() returns a recommendation. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: shadow_scoring_log table has rows with query_id, result_id, live_rank, shadow_rank, delta, direction; compareRanks() produces RankComparisonResult with kendallTau and ndcgDelta; evaluatePromotionGate() returns ready/wait/rollback; no live ranking columns mutated
- Pass/fail: PASS if shadow_scoring_log has entries after evaluation and live rankings unchanged; FAIL if log empty or live ranking columns were mutated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 160 | Shadow feedback (SPECKIT_SHADOW_FEEDBACK) | Verify shadow_scoring_log entries created | `Test SPECKIT_SHADOW_FEEDBACK=true. Run a shadow evaluation with holdout queries, verify shadow_scoring_log entries with rank deltas, and check the promotion gate recommendation. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_SHADOW_FEEDBACK=true` 2) Call `runShadowEvaluation(db, queryIds, liveRanksFn, shadowRanksFn)` 3) Query `SELECT * FROM shadow_scoring_log` 4) Check `evaluatePromotionGate(db)` 5) `npx vitest run tests/shadow-scoring-holdout.vitest.ts` | shadow_scoring_log rows with rank deltas; compareRanks() produces Kendall tau and NDCG delta; evaluatePromotionGate() returns recommendation; no live ranking mutation | shadow_scoring_log rows + ShadowEvaluationReport output + test transcript | PASS if shadow_scoring_log has entries after evaluation and live rankings unchanged; FAIL if log empty or live ranking columns mutated | Verify isShadowFeedbackEnabled() → Check initShadowScoringLog() created tables → Inspect selectHoldoutQueries() output → Verify logRankDelta() insert count → Check PROMOTION_THRESHOLD_WEEKS (2) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md](../../feature_catalog/11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/feedback/shadow-scoring.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 160
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/160-shadow-feedback-speckit-shadow-feedback.md`
