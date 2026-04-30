---
title: "061 -- Tree thinning for spec folder consolidation (PI-B1)"
description: "This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning."
---

# 061 -- Tree thinning for spec folder consolidation (PI-B1)

## 1. OVERVIEW

This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm small-file merge thinning.
- Real user request: `Please validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface and tell me whether the expected signals are present: Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity.`
- RCAF Prompt: `As a tooling validation operator, validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface. Verify files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm small-file merge thinning against the documented validation surface. Verify files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. prepare mixed-size tree around the 150-token boundary
2. run thinning path
3. verify merged output, 3-child cap, kept overflow files, and tokens saved

### Expected

Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity

### Evidence

Thinning output showing merged files + before/after token counts + per-parent child counts + kept overflow files

### Pass / Fail

- **Pass**: the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify file size thresholds; inspect per-parent merge caps; check overflow promotion to `keep`; inspect token counting accuracy

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 061
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/061-tree-thinning-for-spec-folder-consolidation-pi-b1.md`
