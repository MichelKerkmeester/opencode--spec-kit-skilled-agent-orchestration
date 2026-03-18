---
title: "NEW-094 -- Implemented: cross-document entity linking (S5)"
description: "This scenario validates Implemented: cross-document entity linking (S5) for `NEW-094`. It focuses on Confirm deferred->implemented status."
---

# NEW-094 -- Implemented: cross-document entity linking (S5)

## 1. OVERVIEW

This scenario validates Implemented: cross-document entity linking (S5) for `NEW-094`. It focuses on Confirm deferred->implemented status.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-094` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deferred->implemented status
- Prompt: `Verify S5 implemented and guarded.`
- Expected signals: Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified
- Pass/fail: PASS if entity linker produces correctly typed supports-edges and density guards enforce limits

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-094 | Implemented: cross-document entity linking (S5) | Confirm deferred->implemented status | `Verify S5 implemented and guarded.` | 1) run entity linker 2) inspect supports edges 3) verify density guards | Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified | Entity linker output + supports-edge inspection + density guard metrics | PASS if entity linker produces correctly typed supports-edges and density guards enforce limits | Verify entity linker implementation is active; check supports-edge schema; inspect density guard threshold and enforcement |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/06-cross-document-entity-linking.md](../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: NEW-094
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/094-implemented-cross-document-entity-linking-s5.md`
