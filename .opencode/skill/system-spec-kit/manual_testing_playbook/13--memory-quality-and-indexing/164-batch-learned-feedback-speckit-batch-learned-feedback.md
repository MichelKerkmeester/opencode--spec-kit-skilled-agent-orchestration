---
title: "164 -- Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK)"
description: "This scenario validates batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) for `164`. It focuses on enabling the flag, running batch learning, and verifying aggregation."
---

# 164 -- Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK)

## 1. OVERVIEW

This scenario validates batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) for `164`. It focuses on enabling the flag, running batch learning, and verifying aggregation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `164` and confirm the expected signals without contradicting evidence.

- Objective: Verify batch learning aggregation with min-support and boost-cap guards
- Prompt: `Test SPECKIT_BATCH_LEARNED_FEEDBACK=true. Populate feedback events across multiple sessions, run batch learning, and verify aggregated signals respect MIN_SUPPORT_SESSIONS (3) and MAX_BOOST_DELTA (0.10). Capture the evidence needed to prove AggregatedSignal contains session counts, confidence-weighted scores, and capped boost values, and that batch_learning_log entries are recorded. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: AggregatedSignal with sessionCount >= MIN_SUPPORT_SESSIONS (3) for promoted signals; weightedScore computed using CONFIDENCE_WEIGHTS (strong=1.0, medium=0.5, weak=0.1); computedBoost capped at MAX_BOOST_DELTA (0.10); batch_learning_log rows recorded; shadow-only (no live ranking mutation)
- Pass/fail: PASS if aggregation respects min-support, boost is capped, and batch_learning_log is populated; FAIL if signals with < 3 sessions are promoted or boost exceeds 0.10

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 164 | Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) | Verify batch learning aggregation | `Test SPECKIT_BATCH_LEARNED_FEEDBACK=true. Populate feedback events, run batch learning, and verify min-support guards, boost caps, and batch_learning_log entries. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_BATCH_LEARNED_FEEDBACK=true` 2) Populate feedback_events via multiple sessions 3) Call `runBatchLearning(db, options)` 4) Query `SELECT * FROM batch_learning_log` 5) Verify AggregatedSignal values 6) `npx vitest run tests/batch-learning.vitest.ts` | AggregatedSignal with sessionCount, weightedScore, computedBoost; min-support enforced (>= 3 sessions); boost capped at 0.10; batch_learning_log rows; shadow-only | AggregatedSignal output + batch_learning_log rows + test transcript | PASS if min-support respected, boost capped, and log populated; FAIL if under-supported signals promoted or boost > 0.10 | Verify flag enabled → Check initFeedbackLedger() → Inspect CONFIDENCE_WEIGHTS mapping → Verify MIN_SUPPORT_SESSIONS (3) → Check MAX_BOOST_DELTA (0.10) → Verify BATCH_WINDOW_MS (7 days) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/20-weekly-batch-feedback-learning.md](../../feature_catalog/13--memory-quality-and-indexing/20-weekly-batch-feedback-learning.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/feedback/batch-learning.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 164
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/164-batch-learned-feedback-speckit-batch-learned-feedback.md`
