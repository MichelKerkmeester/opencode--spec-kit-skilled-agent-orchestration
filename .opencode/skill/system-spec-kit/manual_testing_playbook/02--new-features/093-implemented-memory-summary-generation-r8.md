---
title: "NEW-093 -- Implemented: memory summary generation (R8)"
description: "This scenario validates Implemented: memory summary generation (R8) for `NEW-093`. It focuses on Confirm deferred->implemented status."
---

# NEW-093 -- Implemented: memory summary generation (R8)

## 1. OVERVIEW

This scenario validates Implemented: memory summary generation (R8) for `NEW-093`. It focuses on Confirm deferred->implemented status.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-093` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deferred->implemented status
- Prompt: `Verify R8 implemented and gated.`
- Expected signals: Summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold
- Pass/fail: PASS if summaries are generated and persisted for long memories and scale gate correctly controls activation

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-093 | Implemented: memory summary generation (R8) | Confirm deferred->implemented status | `Verify R8 implemented and gated.` | 1) save long memory 2) inspect summary persistence 3) verify scale-gated usage | Summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold | Save output + summary field in DB record + scale gate threshold verification | PASS if summaries are generated and persisted for long memories and scale gate correctly controls activation | Verify summary generation triggers on save; check summary persistence field in schema; inspect scale gate threshold configuration |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/05-memory-summary-search-channel.md](../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-093
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/093-implemented-memory-summary-generation-r8.md`
