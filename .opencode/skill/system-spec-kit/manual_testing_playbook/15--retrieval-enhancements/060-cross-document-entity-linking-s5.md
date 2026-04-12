---
title: "060 -- Cross-document entity linking (S5)"
description: "This scenario validates Cross-document entity linking (S5) for `060`. It focuses on Confirm guarded supports-edge linking."
audited_post_018: true
---

# 060 -- Cross-document entity linking (S5)

## 1. OVERVIEW

This scenario validates Cross-document entity linking (S5) for `060`. It focuses on Confirm guarded supports-edge linking.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `060` and confirm the expected signals without contradicting evidence.

- Objective: Confirm guarded supports-edge linking
- Prompt: `As a retrieval-enhancement validation operator, validate Cross-document entity linking (S5) against the documented validation surface. Verify supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied
- Pass/fail: PASS if supports-edges are created for shared entities and density guards cap edge count appropriately

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 060 | Cross-document entity linking (S5) | Confirm guarded supports-edge linking | `As a retrieval-enhancement validation operator, confirm guarded supports-edge linking against the documented validation surface. Verify supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) ensure shared entities across docs 2) run linker 3) verify density guards | Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied | Linker output showing created edges + density guard metrics + entity normalization evidence | PASS if supports-edges are created for shared entities and density guards cap edge count appropriately | Verify shared entities exist across documents; check density guard thresholds; inspect entity normalization pipeline |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/06-cross-document-entity-linking.md](../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 060
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/060-cross-document-entity-linking-s5.md`
