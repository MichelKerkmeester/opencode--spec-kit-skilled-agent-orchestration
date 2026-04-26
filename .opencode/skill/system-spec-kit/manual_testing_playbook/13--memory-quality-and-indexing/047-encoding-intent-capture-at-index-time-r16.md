---
title: "047 -- Encoding-intent capture at index time (R16)"
description: "This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels."
audited_post_018: true
---

# 047 -- Encoding-intent capture at index time (R16)

## 1. OVERVIEW

This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `047` and confirm the expected signals without contradicting evidence.

- Objective: Confirm persisted intent labels
- Prompt: `As a spec-doc record-quality validation operator, validate Encoding-intent capture at index time (R16) against the documented validation surface. Verify intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels
- Pass/fail: PASS: Correct intent label assigned per content type; labels immutable after save; FAIL: Wrong label or label modified post-save

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm persisted intent labels against the documented validation surface. Verify intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save doc/code/structured examples
2. inspect metadata
3. verify read-only intent field

### Expected

Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels

### Evidence

Metadata output showing intent labels per content type + read-only verification

### Pass / Fail

- **Pass**: Correct intent label assigned per content type; labels immutable after save
- **Fail**: Wrong label or label modified post-save

### Failure Triage

Verify intent classification rules → Check metadata persistence → Inspect read-only enforcement

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 047
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md`
