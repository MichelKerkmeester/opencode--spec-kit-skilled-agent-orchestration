---
title: "NEW-061 -- Tree thinning for spec folder consolidation (PI-B1)"
description: "This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `NEW-061`. It focuses on Confirm small-file merge thinning."
---

# NEW-061 -- Tree thinning for spec folder consolidation (PI-B1)

## 1. OVERVIEW

This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `NEW-061`. It focuses on Confirm small-file merge thinning.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-061` and confirm the expected signals without contradicting evidence.

- Objective: Confirm small-file merge thinning
- Prompt: `Validate tree thinning behavior (PI-B1).`
- Expected signals: Small files merged into consolidated output; token count reduced; large files left untouched; merge preserves content integrity
- Pass/fail: PASS if small files are merged, token savings are positive, and content integrity is preserved

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-061 | Tree thinning for spec folder consolidation (PI-B1) | Confirm small-file merge thinning | `Validate tree thinning behavior (PI-B1).` | 1) prepare mixed-size tree 2) run thinning path 3) verify merged output/tokens saved | Small files merged into consolidated output; token count reduced; large files left untouched; merge preserves content integrity | Thinning output showing merged files + before/after token counts + file list comparison | PASS if small files are merged, token savings are positive, and content integrity is preserved | Verify file size thresholds; check merge logic for content preservation; inspect token counting accuracy |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: NEW-061
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/061-tree-thinning-for-spec-folder-consolidation-pi-b1.md`
