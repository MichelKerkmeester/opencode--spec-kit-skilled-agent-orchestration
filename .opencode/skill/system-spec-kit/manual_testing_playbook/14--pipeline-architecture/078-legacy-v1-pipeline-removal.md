---
title: "078 -- Legacy V1 pipeline removal"
description: "This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime."
audited_post_018: true
---

# 078 -- Legacy V1 pipeline removal

## 1. OVERVIEW

This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `078` and confirm the expected signals without contradicting evidence.

- Objective: Confirm V2-only runtime
- Prompt: `As a pipeline validation operator, validate Legacy V1 pipeline removal against the documented validation surface. Verify v1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain
- Pass/fail: PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, confirm V2-only runtime against the documented validation surface. Verify v1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. search removed symbols
2. run queries
3. confirm V2-only execution

### Expected

V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain

### Evidence

Symbol search output (no V1 references) + query execution trace showing V2 pipeline

### Pass / Fail

- **Pass**: zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Search for V1 symbols across all files; check for conditional V1/V2 routing; verify V2 pipeline handles all former V1 query types

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 078
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/078-legacy-v1-pipeline-removal.md`
