---
title: "EX-005 -- 4-stage pipeline architecture"
description: "This scenario validates 4-stage pipeline architecture for `EX-005`. It focuses on Stage invariant verification."
audited_post_018: true
---

# EX-005 -- 4-stage pipeline architecture

## 1. OVERVIEW

This scenario validates 4-stage pipeline architecture for `EX-005`. It focuses on Stage invariant verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-005` and confirm the expected signals without contradicting evidence.

- Objective: Stage invariant verification
- Prompt: `As a retrieval validation operator, validate 4-stage pipeline architecture against memory_search(query,intent:understand). Verify no invariant errors; stable final scoring. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: No invariant errors; stable final scoring
- Pass/fail: PASS if no score-mutation symptoms

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Stage invariant verification against memory_search(query,intent:understand). Verify no invariant errors; stable final scoring. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search(query,intent:understand)

### Expected

No invariant errors; stable final scoring

### Evidence

Output + logs

### Pass / Fail

- **Pass**: no score-mutation symptoms
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect stage metadata and flags

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/05-4-stage-pipeline-architecture.md](../../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/005-4-stage-pipeline-architecture.md`
