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


- Objective: Confirm V2-only runtime.
- Real user request: `Please validate Legacy V1 pipeline removal against the documented validation surface and tell me whether the expected signals are present: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain.`
- RCAF Prompt: `As a pipeline validation operator, validate Legacy V1 pipeline removal against the documented validation surface. Verify v1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 078
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/078-legacy-v1-pipeline-removal.md`
