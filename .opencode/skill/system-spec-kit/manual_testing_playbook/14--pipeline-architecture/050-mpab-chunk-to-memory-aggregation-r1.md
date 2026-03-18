---
title: "NEW-050 -- MPAB chunk-to-memory aggregation (R1)"
description: "This scenario validates MPAB chunk-to-memory aggregation (R1) for `NEW-050`. It focuses on Confirm MPAB formula."
---

# NEW-050 -- MPAB chunk-to-memory aggregation (R1)

## 1. OVERVIEW

This scenario validates MPAB chunk-to-memory aggregation (R1) for `NEW-050`. It focuses on Confirm MPAB formula.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-050` and confirm the expected signals without contradicting evidence.

- Objective: Confirm MPAB formula
- Prompt: `Verify MPAB chunk aggregation (R1).`
- Expected signals: MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value
- Pass/fail: PASS: Computed MPAB score matches manual calculation within 0.001 tolerance; FAIL: Score deviation >0.001 or missing chunk contributions

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-050 | MPAB chunk-to-memory aggregation (R1) | Confirm MPAB formula | `Verify MPAB chunk aggregation (R1).` | 1) Create parent+chunks 2) run stage-3 aggregation 3) compare manual formula | MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value | Stage-3 aggregation output + manual MPAB formula calculation + comparison | PASS: Computed MPAB score matches manual calculation within 0.001 tolerance; FAIL: Score deviation >0.001 or missing chunk contributions | Verify MPAB formula implementation → Check child chunk linkage → Inspect aggregation stage-3 entry point |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md](../../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: NEW-050
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/050-mpab-chunk-to-memory-aggregation-r1.md`
