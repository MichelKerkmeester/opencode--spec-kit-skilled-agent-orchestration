---
title: "160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)"
description: "This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It focuses on enabling the flag, running a search, and verifying shadow_scoring_log entries are created."
audited_post_018: true
---

# 160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)

## 1. OVERVIEW

This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It focuses on enabling the flag, running a search, and verifying shadow_scoring_log entries are created.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `160` and confirm the expected signals without contradicting evidence.

- Objective: Verify shadow scoring log entries are created and holdout evaluation runs
- Prompt: `As a scoring validation operator, validate Shadow feedback (SPECKIT_SHADOW_FEEDBACK) against SPECKIT_SHADOW_FEEDBACK=true. Verify shadow scoring log entries are created and holdout evaluation runs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: shadow_scoring_log table has rows with query_id, result_id, live_rank, shadow_rank, delta, direction; compareRanks() produces RankComparisonResult with kendallTau and ndcgDelta; evaluatePromotionGate() returns ready/wait/rollback; no live ranking columns mutated
- Pass/fail: PASS if shadow_scoring_log has entries after evaluation and live rankings unchanged; FAIL if log empty or live ranking columns were mutated

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, verify shadow_scoring_log entries created against SPECKIT_SHADOW_FEEDBACK=true. Verify shadow_scoring_log rows with rank deltas; compareRanks() produces Kendall tau and NDCG delta; evaluatePromotionGate() returns recommendation; no live ranking mutation. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_SHADOW_FEEDBACK=true`
2. Call `runShadowEvaluation(db, queryIds, liveRanksFn, shadowRanksFn)`
3. Query `SELECT * FROM shadow_scoring_log`
4. Check `evaluatePromotionGate(db)`
5. `npx vitest run tests/shadow-scoring-holdout.vitest.ts`

### Expected

shadow_scoring_log rows with rank deltas; compareRanks() produces Kendall tau and NDCG delta; evaluatePromotionGate() returns recommendation; no live ranking mutation

### Evidence

shadow_scoring_log rows + ShadowEvaluationReport output + test transcript

### Pass / Fail

- **Pass**: shadow_scoring_log has entries after evaluation and live rankings unchanged
- **Fail**: log empty or live ranking columns mutated

### Failure Triage

Verify isShadowFeedbackEnabled() → Check initShadowScoringLog() created tables → Inspect selectHoldoutQueries() output → Verify logRankDelta() insert count → Check PROMOTION_THRESHOLD_WEEKS (2)

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
