---
title: "009 -- Quality proxy formula (B7)"
description: "This scenario validates Quality proxy formula (B7) for `009`. It focuses on Confirm proxy formula correctness."
---

# 009 -- Quality proxy formula (B7)

## 1. OVERVIEW

This scenario validates Quality proxy formula (B7) for `009`. It focuses on Confirm proxy formula correctness.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm proxy formula correctness.
- Real user request: `Please validate Quality proxy formula (B7) against the documented validation surface and tell me whether the expected signals are present: Computed proxy value matches manual formula calculation within tolerance; formula components are all present.`
- RCAF Prompt: `As an evaluation validation operator, validate Quality proxy formula (B7) against the documented validation surface. Verify computed proxy value matches manual formula calculation within tolerance; formula components are all present. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Computed proxy value matches manual formula calculation within tolerance; formula components are all present
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Stored quality proxy matches manual computation within 0.01 tolerance; FAIL: Deviation > 0.01 or missing formula components

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm proxy formula correctness against the documented validation surface. Verify computed proxy value matches manual formula calculation within tolerance; formula components are all present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Export logs
2. Compute formula manually
3. Compare stored value

### Expected

Computed proxy value matches manual formula calculation within tolerance; formula components are all present

### Evidence

Exported log data + manual computation worksheet + stored proxy value comparison

### Pass / Fail

- **Pass**: Stored quality proxy matches manual computation within 0.01 tolerance
- **Fail**: Deviation > 0.01 or missing formula components

### Failure Triage

Check formula component extraction from logs → Verify coefficient weights → Inspect stored value write path

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/05-quality-proxy-formula.md](../../feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/009-quality-proxy-formula-b7.md`
- audited_post_018: true
