---
title: "075 -- Canonical ID dedup hardening"
description: "This scenario validates Canonical ID dedup hardening for `075`. It focuses on Confirm mixed-format ID dedup."
audited_post_018: true
---

# 075 -- Canonical ID dedup hardening

## 1. OVERVIEW

This scenario validates Canonical ID dedup hardening for `075`. It focuses on Confirm mixed-format ID dedup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `075` and confirm the expected signals without contradicting evidence.

- Objective: Confirm mixed-format ID dedup plus two-probe save-path hardening and parent-only index coverage
- Prompt: `As a data-integrity validation operator, validate Canonical ID dedup hardening against the documented validation surface. Verify mixed-format ID dedup plus two-probe save-path hardening and parent-only index coverage. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity; same-path lookup uses two direct probes without nullable OR predicates; `idx_save_parent_canonical_path` and `idx_save_parent_content_hash_scope` exist with `WHERE parent_id IS NULL`
- Pass/fail: PASS if all mixed-format IDs for the same entity resolve to one canonical ID with no duplicates and the save-path/index optimization evidence is present

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, confirm mixed-format ID dedup against the documented validation surface. Verify mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity; same-path lookup uses two direct probes without nullable OR predicates; idx_save_parent_canonical_path and idx_save_parent_content_hash_scope exist with WHERE parent_id IS NULL. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Produce mixed IDs
2. Run dedup
3. Confirm single canonical output
4. Capture same-path SQL-shape evidence
5. Query schema indexes for parent-only save-path coverage

### Expected

Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity; same-path lookup uses two direct probes without nullable OR predicates; `idx_save_parent_canonical_path` and `idx_save_parent_content_hash_scope` exist with `WHERE parent_id IS NULL`

### Evidence

Dedup input (mixed IDs) + dedup output (canonical IDs) + SQL/test evidence for `T320-1`/`T320-2` + `sqlite_master` or schema-test evidence for the two parent-only indexes

### Pass / Fail

- **Pass**: all mixed-format IDs for the same entity resolve to one canonical ID with no duplicates and the save-path/index optimization evidence is present
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect canonical ID resolution logic → Check format normalization rules → Verify same-path lookup is split into direct probes → Confirm schema migration/index creation coverage

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md](../../feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 075
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/075-canonical-id-dedup-hardening.md`
