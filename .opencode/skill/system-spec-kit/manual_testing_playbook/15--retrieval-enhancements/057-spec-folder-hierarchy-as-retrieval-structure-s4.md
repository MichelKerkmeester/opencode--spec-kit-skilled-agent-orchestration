---
title: "057 -- Spec folder hierarchy as retrieval structure (S4)"
description: "This scenario validates Spec folder hierarchy as retrieval structure (S4) for `057`. It focuses on Confirm hierarchy-aware retrieval."
---

# 057 -- Spec folder hierarchy as retrieval structure (S4)

## 1. OVERVIEW

This scenario validates Spec folder hierarchy as retrieval structure (S4) for `057`. It focuses on Confirm hierarchy-aware retrieval.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `057` and confirm the expected signals without contradicting evidence.

- Objective: Confirm hierarchy-aware retrieval
- Prompt: `Validate spec-folder hierarchy retrieval (S4). Capture the evidence needed to prove Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking
- Pass/fail: PASS if retrieval respects folder hierarchy with self > parent > sibling ordering

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 057 | Spec folder hierarchy as retrieval structure (S4) | Confirm hierarchy-aware retrieval | `Validate spec-folder hierarchy retrieval (S4). Capture the evidence needed to prove Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise user-facing pass/fail verdict with the main reason.` | 1) create nested hierarchy 2) query 3) verify self/parent/sibling scoring | Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking | Query output showing hierarchy-aware ranking + folder path evidence in results | PASS if retrieval respects folder hierarchy with self > parent > sibling ordering | Verify nested hierarchy exists; check hierarchy scoring weights; inspect folder-path resolution in retrieval pipeline |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md](../../feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 057
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/057-spec-folder-hierarchy-as-retrieval-structure-s4.md`
