---
title: "101 -- memory_delete confirm schema tightening"
description: "This scenario validates memory_delete confirm schema tightening for `101`. It focuses on Confirm confirm field accepts only literal true."
---

# 101 -- memory_delete confirm schema tightening

## 1. OVERVIEW

This scenario validates memory_delete confirm schema tightening for `101`. It focuses on Confirm confirm field accepts only literal true.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `101` and confirm the expected signals without contradicting evidence.

- Objective: Confirm confirm field accepts only literal true
- Prompt: `Validate memory_delete confirm:z.literal(true) enforcement. Capture the evidence needed to prove confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path
- Pass/fail: PASS if only `confirm:true` is accepted, `confirm:false` is rejected

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 101 | memory_delete confirm schema tightening | Confirm confirm field accepts only literal true | `Validate memory_delete confirm:z.literal(true) enforcement. Capture the evidence needed to prove confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_delete({id:1, confirm:true})` → verify accepted 2) `memory_delete({id:1, confirm:false})` → verify Zod rejection (literal true required) 3) `memory_delete({specFolder:"test", confirm:true})` → verify bulk delete path accepts 4) `memory_delete({specFolder:"test"})` (no confirm) → verify Zod rejection for bulk path | confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path | Tool validation outputs | PASS if only `confirm:true` is accepted, `confirm:false` is rejected | Inspect `tool-schemas.ts` memory_delete union schema |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(memory_delete confirm schema — covered by `02--mutation/03`)*

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 101
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/101-memory-delete-confirm-schema-tightening.md`
