---
title: "046 -- Anchor-aware chunk thinning (R7)"
description: "This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning."
---

# 046 -- Anchor-aware chunk thinning (R7)

## 1. OVERVIEW

This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `046` and confirm the expected signals without contradicting evidence.

- Objective: Confirm anchor-priority thinning
- Prompt: `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order
- Pass/fail: PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 046 | Anchor-aware chunk thinning (R7) | Confirm anchor-priority thinning | `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Index long doc with anchors/filler 2) run thinning 3) verify non-empty retained set | Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order | Thinning output showing retained vs removed chunks + anchor identification | PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set | Verify anchor detection logic → Check thinning priority ordering → Inspect minimum retained set size |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md](../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 046
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md`
