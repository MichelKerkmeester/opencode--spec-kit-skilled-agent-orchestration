---
title: "047 -- Encoding-intent capture at index time (R16)"
description: "This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels."
---

# 047 -- Encoding-intent capture at index time (R16)

## 1. OVERVIEW

This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `047` and confirm the expected signals without contradicting evidence.

- Objective: Confirm persisted intent labels
- Prompt: `Verify encoding-intent capture (R16). Capture the evidence needed to prove Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels
- Pass/fail: PASS: Correct intent label assigned per content type; labels immutable after save; FAIL: Wrong label or label modified post-save

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 047 | Encoding-intent capture at index time (R16) | Confirm persisted intent labels | `Verify encoding-intent capture (R16). Capture the evidence needed to prove Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save doc/code/structured examples 2) inspect metadata 3) verify read-only intent field | Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels | Metadata output showing intent labels per content type + read-only verification | PASS: Correct intent label assigned per content type; labels immutable after save; FAIL: Wrong label or label modified post-save | Verify intent classification rules → Check metadata persistence → Inspect read-only enforcement |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 047
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md`
