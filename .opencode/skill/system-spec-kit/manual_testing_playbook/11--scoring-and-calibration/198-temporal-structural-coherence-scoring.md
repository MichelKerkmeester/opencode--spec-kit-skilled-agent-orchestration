---
title: "198 -- Temporal-structural coherence scoring"
description: "This scenario validates temporal-structural coherence scoring for `198`. It focuses on confirming structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop."
---

# 198 -- Temporal-structural coherence scoring

## 1. OVERVIEW

This scenario validates temporal-structural coherence scoring for `198`. It focuses on confirming structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `198` and confirm the expected signals without contradicting evidence.

- Objective: Confirm structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop
- Prompt: `Verify temporal-structural coherence scoring in the quality loop using one well-formed control memory and flawed variants. Submit variants that are too short or missing headings, include a future-dated completion claim, and include self-referential or unresolved causal links. Confirm the coherence breakdown applies the expected structural checks and bounded penalties, and verify that low-coherence content is rejected or downgraded while the quality loop retry cycle stays immediate and bounded. Capture the score breakdown and return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: structural checks evaluate non-empty content, minimum-length thresholds, and Markdown heading presence; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; sufficiently low coherence can trigger quality-loop rejection; verify-fix-verify retries remain immediate with no backoff and stay within the configured retry limit
- Pass/fail: PASS: flawed variants receive the expected coherence penalties and rejection or downgrade behavior while retries stay immediate and bounded; FAIL: structural defects do not affect coherence, temporal or causal-link issues are ignored, or retry behavior contradicts the documented bounded immediate cycle

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 198 | Temporal-structural coherence scoring | Confirm structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop | `Verify temporal-structural coherence scoring in the quality loop using one well-formed control memory and flawed variants. Submit variants that are too short or missing headings, include a future-dated completion claim, and include self-referential or unresolved causal links. Confirm the coherence breakdown applies the expected structural checks and bounded penalties, and verify that low-coherence content is rejected or downgraded while the quality loop retry cycle stays immediate and bounded. Capture the score breakdown and return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare a well-formed control memory plus flawed variants covering short or heading-less content, future-dated completion claims, and broken causal-link metadata 2) Run the quality loop or ingest path for each case 3) Inspect the coherence score breakdown and quality-loop decision for control vs flawed variants 4) Confirm penalties apply to temporal and causal-link issues without inventing broader chronology logic 5) For an auto-fixable case, capture the retry cycle and confirm retries occur immediately with no backoff and stop within the configured limit | Structural checks evaluate content presence, minimum length, and headings; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; low-coherence variants are rejected or downgraded; retry attempts are immediate and bounded | Quality-loop transcript, coherence score breakdown, control-vs-variant results, and retry timing evidence | PASS: coherence penalties appear for the flawed variants, low-quality cases are blocked or downgraded, and retry timing stays immediate and bounded; FAIL: penalties are missing, weak content passes without explanation, or retries show unexpected backoff or unbounded looping | Verify control content satisfies structural checks -> Inspect coherence penalty branches for future-dated claims and causal links -> Confirm rejection threshold or downgrade path -> Check retry loop configuration and attempt count -> Ensure broader chronology analysis was not assumed in the verdict |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md](../../feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 198
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/198-temporal-structural-coherence-scoring.md`
