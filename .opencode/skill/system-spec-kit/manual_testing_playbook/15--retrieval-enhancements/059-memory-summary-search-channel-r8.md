---
title: "059 -- Memory summary search channel (R8)"
description: "This scenario validates Memory summary search channel (R8) for `059`. It focuses on Confirm scale-gated summary channel."
---

# 059 -- Memory summary search channel (R8)

## 1. OVERVIEW

This scenario validates Memory summary search channel (R8) for `059`. It focuses on Confirm scale-gated summary channel.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `059` and confirm the expected signals without contradicting evidence.

- Objective: Confirm scale-gated summary channel
- Prompt: `Verify memory summary search channel (R8). Capture the evidence needed to prove Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold
- Pass/fail: PASS if summary channel activates above threshold and remains inert below it

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 059 | Memory summary search channel (R8) | Confirm scale-gated summary channel | `Verify memory summary search channel (R8). Capture the evidence needed to prove Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise user-facing pass/fail verdict with the main reason.` | 1) check corpus size threshold 2) run stage-1 3) verify channel activation rules | Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold | Search output showing channel activation status + corpus size count + fusion contribution evidence | PASS if summary channel activates above threshold and remains inert below it | Verify corpus size counting logic; check threshold configuration; inspect channel activation gate in stage-1 pipeline |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/05-memory-summary-search-channel.md](../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 059
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/059-memory-summary-search-channel-r8.md`
