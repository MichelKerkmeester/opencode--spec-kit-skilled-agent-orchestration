---
title: "101 -- memory_delete confirm schema tightening"
description: "This scenario validates memory_delete confirm schema tightening for `101`. It focuses on Confirm confirm field accepts only literal true."
audited_post_018: true
---

# 101 -- memory_delete confirm schema tightening

## 1. OVERVIEW

This scenario validates memory_delete confirm schema tightening for `101`. It focuses on Confirm confirm field accepts only literal true.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `101` and confirm the expected signals without contradicting evidence.

- Objective: Confirm confirm field accepts only literal true
- Prompt: `As a mutation validation operator, validate memory_delete confirm schema tightening against memory_delete({id:1, confirm:true}). Verify confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path
- Pass/fail: PASS if only `confirm:true` is accepted, `confirm:false` is rejected

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, confirm confirm field accepts only literal true against memory_delete({id:1, confirm:true}). Verify confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_delete({id:1, confirm:true})` → verify accepted
2. `memory_delete({id:1, confirm:false})` → verify Zod rejection (literal true required)
3. `memory_delete({specFolder:"test", confirm:true})` → verify bulk delete path accepts
4. `memory_delete({specFolder:"test"})` (no confirm) → verify Zod rejection for bulk path

### Expected

confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path

### Evidence

Tool validation outputs

### Pass / Fail

- **Pass**: only `confirm:true` is accepted, `confirm:false` is rejected
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `tool-schemas.ts` memory_delete union schema

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(memory_delete confirm schema — covered by `02--mutation/03`)*

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 101
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/101-memory-delete-confirm-schema-tightening.md`
