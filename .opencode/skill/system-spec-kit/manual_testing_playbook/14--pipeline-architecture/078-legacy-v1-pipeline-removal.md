---
title: "078 -- Legacy V1 pipeline removal"
description: "This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime."
---

# 078 -- Legacy V1 pipeline removal

## 1. OVERVIEW

This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `078` and confirm the expected signals without contradicting evidence.

- Objective: Confirm V2-only runtime
- Prompt: `Verify legacy V1 removal. Capture the evidence needed to prove V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain
- Pass/fail: PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 078 | Legacy V1 pipeline removal | Confirm V2-only runtime | `Verify legacy V1 removal. Capture the evidence needed to prove V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise user-facing pass/fail verdict with the main reason.` | 1) search removed symbols 2) run queries 3) confirm V2-only execution | V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain | Symbol search output (no V1 references) + query execution trace showing V2 pipeline | PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively | Search for V1 symbols across all files; check for conditional V1/V2 routing; verify V2 pipeline handles all former V1 query types |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 078
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/078-legacy-v1-pipeline-removal.md`
