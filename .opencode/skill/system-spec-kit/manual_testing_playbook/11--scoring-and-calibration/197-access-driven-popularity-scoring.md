---
title: "197 -- Access-driven popularity scoring"
description: "This scenario validates access-driven popularity scoring for `197`. It focuses on confirming batched access accumulation, thresholded flushes, and popularity-driven ranking effects."
---

# 197 -- Access-driven popularity scoring

## 1. OVERVIEW

This scenario validates access-driven popularity scoring for `197`. It focuses on confirming batched access accumulation, thresholded flushes, and popularity-driven ranking effects.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `197` and confirm the expected signals without contradicting evidence.

- Objective: Confirm batched access accumulation, thresholded flushes, and popularity-driven ranking effects
- Prompt: `Verify access-driven popularity scoring with two comparable memories. Repeatedly retrieve one target memory enough times to push the in-memory access accumulator past the flush threshold, then confirm the persisted access count and last_accessed fields update while a comparable control memory does not. Re-run a ranking query and confirm the more frequently accessed memory receives a stronger popularity contribution. Capture accumulator, flush, ranking, and dormancy evidence and return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: each retrieval increments the in-memory accumulator by 0.1; accumulated access flushes after the threshold is crossed; persisted `access_count` and `last_accessed` update for the hot memory; composite scoring reflects a popularity boost for the more frequently accessed memory; untouched control evidence remains comparatively colder for dormancy analysis
- Pass/fail: PASS: repeated retrievals batch and flush correctly, persistence updates land on the hot memory, and popularity-sensitive ranking favors it over the control; FAIL: flush never occurs, persisted counts stay unchanged, or repeated access has no measurable scoring impact

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 197 | Access-driven popularity scoring | Confirm batched access accumulation, thresholded flushes, and popularity-driven ranking effects | `Verify access-driven popularity scoring with two comparable memories. Repeatedly retrieve one target memory enough times to push the in-memory access accumulator past the flush threshold, then confirm the persisted access count and last_accessed fields update while a comparable control memory does not. Re-run a ranking query and confirm the more frequently accessed memory receives a stronger popularity contribution. Capture accumulator, flush, ranking, and dormancy evidence and return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare or identify two comparable memories that match the same retrieval query 2) Run the shared query once to establish a baseline ranking 3) Retrieve the target memory repeatedly until the accumulator crosses the flush threshold 4) Inspect accumulator state and persisted `access_count` plus `last_accessed` for target vs control 5) Re-run the ranking query and compare popularity-sensitive ordering and dormancy signals | Accumulator rises in 0.1 steps; flush occurs after the threshold is crossed; persisted fields update for the target memory; composite scoring or ranking reflects a popularity boost; colder control memory remains relatively less active for dormancy purposes | Baseline and post-access query results, accumulator snapshots, persisted access metadata, and operator transcript | PASS: target retrievals batch correctly, persistence updates are visible, and the hot memory gains a measurable popularity advantage; FAIL: accumulator does not flush, persisted metadata does not change, or ranking stays indistinguishable from baseline without explanation | Verify repeated retrievals hit the same target memory -> Inspect accumulator threshold and flush path -> Check `access_count` and `last_accessed` persistence writes -> Review composite scoring popularity contribution -> Confirm dormancy logic is reading updated access data |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/16-access-driven-popularity-scoring.md](../../feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 197
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/197-access-driven-popularity-scoring.md`
