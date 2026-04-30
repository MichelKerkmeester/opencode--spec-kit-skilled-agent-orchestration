---
title: "033 -- Query complexity router (R15)"
description: "This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing."
audited_post_018: true
---

# 033 -- Query complexity router (R15)

## 1. OVERVIEW

This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm query-class routing.
- Real user request: `Please validate Query complexity router (R15) against the documented validation surface and tell me whether the expected signals are present: Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query complexity router (R15) against the documented validation surface. Verify simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm query-class routing against the documented validation surface. Verify simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run simple/moderate/complex
2. Inspect selected channels
3. Disable flag fallback

### Expected

Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing

### Evidence

Channel selection trace for simple/moderate/complex queries + flag-disabled fallback behavior

### Pass / Fail

- **Pass**: Channel count increases with complexity class; disabled flag uses default routing
- **Fail**: All queries use same channels or flag-disabled produces error

### Failure Triage

Verify complexity classification logic → Check channel mapping per class → Inspect feature flag fallback behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/01-query-complexity-router.md](../../feature_catalog/12--query-intelligence/01-query-complexity-router.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/033-query-complexity-router-r15.md`
