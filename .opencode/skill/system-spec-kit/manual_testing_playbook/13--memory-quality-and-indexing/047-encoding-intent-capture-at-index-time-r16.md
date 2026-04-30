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


- Objective: Confirm persisted intent labels.
- Real user request: `Please validate Encoding-intent capture at index time (R16) against the documented validation surface and tell me whether the expected signals are present: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels.`
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate Encoding-intent capture at index time (R16) against the documented validation surface. Verify intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 047
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md`
