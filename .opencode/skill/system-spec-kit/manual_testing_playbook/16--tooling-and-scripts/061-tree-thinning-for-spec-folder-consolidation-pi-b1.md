---
title: "061 -- Tree thinning for spec folder consolidation (PI-B1)"
description: "This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning."
---

# 061 -- Tree thinning for spec folder consolidation (PI-B1)

## 1. OVERVIEW

This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `061` and confirm the expected signals without contradicting evidence.

- Objective: Confirm small-file merge thinning
- Prompt: `Validate tree thinning behavior (PI-B1). Capture the evidence needed to prove Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity
- Pass/fail: PASS if the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 061 | Tree thinning for spec folder consolidation (PI-B1) | Confirm small-file merge thinning | `Validate tree thinning behavior (PI-B1). Capture the evidence needed to prove Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity. Return a concise user-facing pass/fail verdict with the main reason.` | 1) prepare mixed-size tree around the 150-token boundary 2) run thinning path 3) verify merged output, 3-child cap, kept overflow files, and tokens saved | Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity | Thinning output showing merged files + before/after token counts + per-parent child counts + kept overflow files | PASS if the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved | Verify file size thresholds; inspect per-parent merge caps; check overflow promotion to `keep`; inspect token counting accuracy |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 061
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/061-tree-thinning-for-spec-folder-consolidation-pi-b1.md`
