---
title: "060 -- Cross-document entity linking (S5)"
description: "This scenario validates Cross-document entity linking (S5) for `060`. It focuses on Confirm guarded supports-edge linking."
audited_post_018: true
---

# 060 -- Cross-document entity linking (S5)

## 1. OVERVIEW

This scenario validates Cross-document entity linking (S5) for `060`. It focuses on Confirm guarded supports-edge linking.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `060` and confirm the expected signals without contradicting evidence.

- Objective: Confirm guarded supports-edge linking
- Prompt: `As a retrieval-enhancement validation operator, validate Cross-document entity linking (S5) against the documented validation surface. Verify supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied
- Pass/fail: PASS if supports-edges are created for shared entities and density guards cap edge count appropriately

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm guarded supports-edge linking against the documented validation surface. Verify supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. ensure shared entities across docs
2. run linker
3. verify density guards

### Expected

Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied

### Evidence

Linker output showing created edges + density guard metrics + entity normalization evidence

### Pass / Fail

- **Pass**: supports-edges are created for shared entities and density guards cap edge count appropriately
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify shared entities exist across documents; check density guard thresholds; inspect entity normalization pipeline

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/06-cross-document-entity-linking.md](../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 060
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/060-cross-document-entity-linking-s5.md`
