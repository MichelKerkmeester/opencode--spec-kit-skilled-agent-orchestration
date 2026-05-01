---
title: "192 -- Correction tracking with undo"
description: "This scenario validates Correction tracking with undo for `192`. It focuses on Confirm library-level correction recording, stability rollback, and scoped undo behavior."
audited_post_018: true
---

# 192 -- Correction tracking with undo

## 1. OVERVIEW

This scenario validates Correction tracking with undo for `192`. It focuses on Confirm library-level correction recording, stability rollback, and scoped undo behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm library-level correction recording, stability rollback, and scoped undo behavior.
- Real user request: `` Please validate Correction tracking with undo against record_correction() and tell me whether the expected signals are present: `record_correction()` persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; `undo_correction()` restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation. ``
- RCAF Prompt: `As a mutation validation operator, validate Correction tracking with undo against record_correction(). Verify library-level correction recording, stability rollback, and scoped undo behavior. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `record_correction()` persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; `undo_correction()` restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if direct library exercise proves correction recording and scoped undo behavior work as documented without implying a live end-user MCP mutation endpoint

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, confirm library-level correction recording, stability rollback, and scoped undo behavior against record_correction(). Verify record_correction() persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; undo_correction() restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. seed an original memory and a correcting memory with known stability values
2. invoke `record_correction()` directly for one supported correction type (`superseded`, `deprecated`, `refined`, or `merged`) while `SPECKIT_RELATIONS` remains enabled
3. inspect correction history or stored rows to confirm before/after stability values plus applied penalty/boost data for both memories
4. inspect the created causal edge and confirm it is attributable to the specific correction record
5. invoke `undo_correction(correctionId)` directly
6. inspect post-undo state to confirm original stability values were restored, `is_undone = 1`, `undone_at` is populated, and only the correction-owned causal edge was removed
7. confirm validation used direct library behavior rather than an MCP handler or tool dispatcher path

### Expected

`record_correction()` persists correction metadata plus before/after stability values; stability penalties and boosts are visible for both memories; `undo_correction()` restores original stability, marks the correction row undone, and removes only the correction-specific causal edge; no MCP handler or tool-dispatch path is required for the validation

### Evidence

Direct invocation output or focused test harness output + correction row/history snapshot + pre/post stability values + causal-edge inspection before and after undo

### Pass / Fail

- **Pass**: direct library exercise proves correction recording and scoped undo behavior work as documented without implying a live end-user MCP mutation endpoint
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Confirm `SPECKIT_RELATIONS` is enabled; verify the correction row captured the expected stability snapshots; inspect evidence prefix matching for scoped causal-edge deletion; if deletion is over-broad, review legacy fallback handling and correction-owned edge attribution

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/09-correction-tracking-with-undo.md](../../feature_catalog/02--mutation/09-correction-tracking-with-undo.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 192
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/192-correction-tracking-with-undo.md`
