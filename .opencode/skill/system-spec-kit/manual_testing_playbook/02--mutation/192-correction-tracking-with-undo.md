---
title: "192 -- Correction tracking with undo"
description: "This scenario validates Correction tracking with undo for `192`. It focuses on Confirm library-level correction recording, stability rollback, and scoped undo behavior."
---

# 192 -- Correction tracking with undo

## 1. OVERVIEW

This scenario validates Correction tracking with undo for `192`. It focuses on Confirm library-level correction recording, stability rollback, and scoped undo behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `192` and confirm the expected signals without contradicting evidence.

- Objective: Confirm library-level correction recording, stability rollback, and scoped undo behavior
- Prompt: `Validate correction tracking with undo through direct library invocation rather than an MCP mutation tool. Capture the evidence needed to prove record_correction stores before/after stability changes for both memories; correction rows preserve audit history with penalty/boost data; undo_correction restores pre-correction stability, marks is_undone with undone_at, and removes only the correction-owned causal edge. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `record_correction()` persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; `undo_correction()` restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation
- Pass/fail: PASS if direct library exercise proves correction recording and scoped undo behavior work as documented without implying a live end-user MCP mutation endpoint

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 192 | Correction tracking with undo | Confirm library-level correction recording, stability rollback, and scoped undo behavior | `Validate correction tracking with undo through direct library invocation rather than an MCP mutation tool. Capture the evidence needed to prove record_correction stores before/after stability changes for both memories; correction rows preserve audit history with penalty/boost data; undo_correction restores pre-correction stability, marks is_undone with undone_at, and removes only the correction-owned causal edge. Return a concise user-facing pass/fail verdict with the main reason.` | 1) seed an original memory and a correcting memory with known stability values 2) invoke `record_correction()` directly for one supported correction type (`superseded`, `deprecated`, `refined`, or `merged`) while `SPECKIT_RELATIONS` remains enabled 3) inspect correction history or stored rows to confirm before/after stability values plus applied penalty/boost data for both memories 4) inspect the created causal edge and confirm it is attributable to the specific correction record 5) invoke `undo_correction(correctionId)` directly 6) inspect post-undo state to confirm original stability values were restored, `is_undone = 1`, `undone_at` is populated, and only the correction-owned causal edge was removed 7) confirm validation used direct library capability rather than an MCP handler or tool dispatcher path | `record_correction()` persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; `undo_correction()` restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation | Direct invocation output or focused test harness output + correction row/history snapshot + pre/post stability values + causal-edge inspection before and after undo | PASS if direct library exercise proves correction recording and scoped undo behavior work as documented without implying a live end-user MCP mutation endpoint | Confirm `SPECKIT_RELATIONS` is enabled; verify the correction row captured the expected stability snapshots; inspect evidence prefix matching for scoped causal-edge deletion; if deletion is over-broad, review legacy fallback handling and correction-owned edge attribution |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/09-correction-tracking-with-undo.md](../../feature_catalog/02--mutation/09-correction-tracking-with-undo.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 192
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/192-correction-tracking-with-undo.md`
