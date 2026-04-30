---
title: "036 -- Confidence-based result truncation (R15-ext)"
description: "This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff."
audited_post_018: true
---

# 036 -- Confidence-based result truncation (R15-ext)

## 1. OVERVIEW

This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm relevance-cliff cutoff.
- Real user request: `Please validate Confidence-based result truncation (R15-ext) against the documented validation surface and tell me whether the expected signals are present: Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Confidence-based result truncation (R15-ext) against the documented validation surface. Verify results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm relevance-cliff cutoff against the documented validation surface. Verify results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run long-tail query
2. Inspect cutoff math
3. Verify min-result guarantee

### Expected

Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace

### Evidence

Truncated output with cutoff point + min-result count verification + cliff threshold in trace

### Pass / Fail

- **Pass**: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace
- **Fail**: No truncation or fewer than min-count results

### Failure Triage

Verify cliff detection algorithm → Check min-result guarantee → Inspect confidence score distribution

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/04-confidence-based-result-truncation.md](../../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 036
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/036-confidence-based-result-truncation-r15-ext.md`
