---
title: "NEW-075 -- Canonical ID dedup hardening"
description: "This scenario validates Canonical ID dedup hardening for `NEW-075`. It focuses on Confirm mixed-format ID dedup."
---

# NEW-075 -- Canonical ID dedup hardening

## 1. OVERVIEW

This scenario validates Canonical ID dedup hardening for `NEW-075`. It focuses on Confirm mixed-format ID dedup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-075` and confirm the expected signals without contradicting evidence.

- Objective: Confirm mixed-format ID dedup
- Prompt: `Verify canonical ID dedup hardening.`
- Expected signals: Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity
- Pass/fail: PASS if all mixed-format IDs for the same entity resolve to one canonical ID with no duplicates

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-075 | Canonical ID dedup hardening | Confirm mixed-format ID dedup | `Verify canonical ID dedup hardening.` | 1) produce mixed IDs 2) run dedup 3) confirm single canonical output | Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity | Dedup input (mixed IDs) + dedup output (canonical IDs) + entity count comparison | PASS if all mixed-format IDs for the same entity resolve to one canonical ID with no duplicates | Inspect canonical ID resolution logic; check format normalization rules; verify dedup handles all known ID formats |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md](../../feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-075
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/075-canonical-id-dedup-hardening.md`
