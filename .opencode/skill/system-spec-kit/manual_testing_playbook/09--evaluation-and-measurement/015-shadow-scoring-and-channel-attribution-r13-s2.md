---
title: "015 -- Shadow scoring and channel attribution (R13-S2)"
description: "This scenario validates Shadow scoring and channel attribution (R13-S2) for `015`. It focuses on Confirm shadow deactivation and attribution continuity."
---

# 015 -- Shadow scoring and channel attribution (R13-S2)

## 1. OVERVIEW

This scenario validates Shadow scoring and channel attribution (R13-S2) for `015`. It focuses on Confirm shadow deactivation and attribution continuity.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `015` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shadow deactivation and attribution continuity
- Prompt: `Verify shadow scoring deactivation and attribution continuity. Capture the evidence needed to prove Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results
- Pass/fail: PASS: Shadow flags produce no ranking change and attribution metadata is intact; FAIL: Shadow mode affects live ranking or attribution missing

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 015 | Shadow scoring and channel attribution (R13-S2) | Confirm shadow deactivation and attribution continuity | `Verify shadow scoring deactivation and attribution continuity. Capture the evidence needed to prove Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Trigger shadow flags 2) Confirm inert behavior 3) Check attribution metadata | Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results | Search output with attribution metadata present + shadow flag state confirmation | PASS: Shadow flags produce no ranking change and attribution metadata is intact; FAIL: Shadow mode affects live ranking or attribution missing | Check shadow flag deactivation → Verify attribution metadata pipeline → Inspect flag governance state |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md](../../feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/015-shadow-scoring-and-channel-attribution-r13-s2.md`
