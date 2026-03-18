---
title: "NEW-069 -- Entity normalization consolidation"
description: "This scenario validates Entity normalization consolidation for `NEW-069`. It focuses on Confirm shared normalization path."
---

# NEW-069 -- Entity normalization consolidation

## 1. OVERVIEW

This scenario validates Entity normalization consolidation for `NEW-069`. It focuses on Confirm shared normalization path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-069` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared normalization path
- Prompt: `Validate entity normalization consolidation.`
- Expected signals: Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence
- Pass/fail: PASS if extractor and linker produce identical normalized entities for all test inputs including unicode

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-069 | Entity normalization consolidation | Confirm shared normalization path | `Validate entity normalization consolidation.` | 1) feed unicode entities 2) compare extractor/linker outputs 3) verify parity | Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence | Extractor output + linker output + side-by-side comparison showing parity | PASS if extractor and linker produce identical normalized entities for all test inputs including unicode | Verify shared normalization function is used by both paths; check unicode handling; inspect normalization rules for edge cases |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/13-entity-normalization-consolidation.md](../../feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-069
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/069-entity-normalization-consolidation.md`
