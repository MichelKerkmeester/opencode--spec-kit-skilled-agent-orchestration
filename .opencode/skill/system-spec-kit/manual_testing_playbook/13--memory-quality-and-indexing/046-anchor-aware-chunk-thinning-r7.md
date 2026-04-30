---
title: "046 -- Anchor-aware chunk thinning (R7)"
description: "This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning."
audited_post_018: true
---

# 046 -- Anchor-aware chunk thinning (R7)

## 1. OVERVIEW

This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm anchor-priority thinning.
- Real user request: `Please validate Anchor-aware chunk thinning (R7) against the documented validation surface and tell me whether the expected signals are present: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order.`
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate Anchor-aware chunk thinning (R7) against the documented validation surface. Verify anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm anchor-priority thinning against the documented validation surface. Verify anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Index long doc with anchors/filler
2. run thinning
3. verify non-empty retained set

### Expected

Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order

### Evidence

Thinning output showing retained vs removed chunks + anchor identification

### Pass / Fail

- **Pass**: All anchor chunks retained; filler removed; retained set non-empty
- **Fail**: Anchor chunks removed or empty retained set

### Failure Triage

Verify anchor detection logic → Check thinning priority ordering → Inspect minimum retained set size

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md](../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 046
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md`
