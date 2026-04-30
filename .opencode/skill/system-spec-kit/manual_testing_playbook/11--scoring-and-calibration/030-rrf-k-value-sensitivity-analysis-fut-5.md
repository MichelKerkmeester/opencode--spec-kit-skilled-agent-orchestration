---
title: "030 -- RRF K-value sensitivity analysis (FUT-5)"
description: "This scenario validates RRF K-value sensitivity analysis (FUT-5) for `030`. It focuses on Confirm K sensitivity measurements."
audited_post_018: true
---

# 030 -- RRF K-value sensitivity analysis (FUT-5)

## 1. OVERVIEW

This scenario validates RRF K-value sensitivity analysis (FUT-5) for `030`. It focuses on Confirm K sensitivity measurements.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm K sensitivity measurements.
- Real user request: `Please validate RRF K-value sensitivity analysis (FUT-5) against the documented validation surface and tell me whether the expected signals are present: K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns.`
- RCAF Prompt: `As a scoring validation operator, validate RRF K-value sensitivity analysis (FUT-5) against the documented validation surface. Verify k-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Multiple K values tested with per-K metrics; optimal K documented with evidence; FAIL: Single K tested or no comparative analysis

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm K sensitivity measurements against the documented validation surface. Verify k-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run K grid
2. Compare metrics
3. Select best K rationale

### Expected

K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns

### Evidence

K-grid metric output + sensitivity comparison table + optimal K selection rationale

### Pass / Fail

- **Pass**: Multiple K values tested with per-K metrics; optimal K documented with evidence
- **Fail**: Single K tested or no comparative analysis

### Failure Triage

Verify K-grid configuration → Check metric computation per K → Inspect sensitivity analysis methodology

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md](../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/030-rrf-k-value-sensitivity-analysis-fut-5.md`
