---
title: "NEW-071 -- Performance improvements"
description: "This scenario validates Performance improvements for `NEW-071`. It focuses on Confirm key perf remediations active."
---

# NEW-071 -- Performance improvements

## 1. OVERVIEW

This scenario validates Performance improvements for `NEW-071`. It focuses on Confirm key perf remediations active.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-071` and confirm the expected signals without contradicting evidence.

- Objective: Confirm key perf remediations active
- Prompt: `Verify performance improvements (Sprint 8).`
- Expected signals: Optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions
- Pass/fail: PASS if optimized paths are active and heavy query timing shows no regressions compared to baseline

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-071 | Performance improvements | Confirm key perf remediations active | `Verify performance improvements (Sprint 8).` | 1) inspect optimized code paths 2) run heavy queries 3) capture timing notes | Optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions | Code path inspection evidence + timing measurements for heavy queries | PASS if optimized paths are active and heavy query timing shows no regressions compared to baseline | Profile heavy query execution; check for bypassed optimizations; compare timing with pre-optimization baseline |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/08-performance-improvements.md](../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: NEW-071
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/071-performance-improvements.md`
