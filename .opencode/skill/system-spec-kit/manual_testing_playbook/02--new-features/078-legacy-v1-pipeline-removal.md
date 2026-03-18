---
title: "NEW-078 -- Legacy V1 pipeline removal"
description: "This scenario validates Legacy V1 pipeline removal for `NEW-078`. It focuses on Confirm V2-only runtime."
---

# NEW-078 -- Legacy V1 pipeline removal

## 1. OVERVIEW

This scenario validates Legacy V1 pipeline removal for `NEW-078`. It focuses on Confirm V2-only runtime.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-078` and confirm the expected signals without contradicting evidence.

- Objective: Confirm V2-only runtime
- Prompt: `Verify legacy V1 removal.`
- Expected signals: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain
- Pass/fail: PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-078 | Legacy V1 pipeline removal | Confirm V2-only runtime | `Verify legacy V1 removal.` | 1) search removed symbols 2) run queries 3) confirm V2-only execution | V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain | Symbol search output (no V1 references) + query execution trace showing V2 pipeline | PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively | Search for V1 symbols across all files; check for conditional V1/V2 routing; verify V2 pipeline handles all former V1 query types |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-078
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/078-legacy-v1-pipeline-removal.md`
