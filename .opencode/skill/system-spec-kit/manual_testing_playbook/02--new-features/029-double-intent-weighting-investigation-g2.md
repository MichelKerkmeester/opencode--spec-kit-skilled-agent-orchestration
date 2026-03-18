---
title: "NEW-029 -- Double intent weighting investigation (G2)"
description: "This scenario validates Double intent weighting investigation (G2) for `NEW-029`. It focuses on Confirm no hybrid double-weight."
---

# NEW-029 -- Double intent weighting investigation (G2)

## 1. OVERVIEW

This scenario validates Double intent weighting investigation (G2) for `NEW-029`. It focuses on Confirm no hybrid double-weight.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-029` and confirm the expected signals without contradicting evidence.

- Objective: Confirm no hybrid double-weight
- Prompt: `Validate G2 guard in active pipeline.`
- Expected signals: Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally
- Pass/fail: PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-029 | Double intent weighting investigation (G2) | Confirm no hybrid double-weight | `Validate G2 guard in active pipeline.` | 1) Run hybrid query 2) Inspect stage trace 3) Confirm stage-2 intent skip | Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally | Stage trace output for hybrid vs non-hybrid queries + intent weight comparison | PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path | Check hybrid detection logic → Verify stage-2 guard condition → Inspect intent weight application point |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/07-double-intent-weighting-investigation.md](../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/029-double-intent-weighting-investigation-g2.md`
