---
title: "014 -- Full reporting and ablation study framework (R13-S3)"
description: "This scenario validates Full reporting and ablation study framework (R13-S3) for `014`. It focuses on Confirm ablation+report workflow."
---

# 014 -- Full reporting and ablation study framework (R13-S3)

## 1. OVERVIEW

This scenario validates Full reporting and ablation study framework (R13-S3) for `014`. It focuses on Confirm ablation+report workflow.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm ablation+report workflow.
- Real user request: `Please validate Full reporting and ablation study framework (R13-S3) against the documented validation surface and tell me whether the expected signals are present: Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report.`
- RCAF Prompt: `As an evaluation validation operator, validate Full reporting and ablation study framework (R13-S3) against the documented validation surface. Verify ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm ablation+report workflow against the documented validation surface. Verify ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run ablation channel-off
2. Check snapshots
3. Validate dashboard

### Expected

Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report

### Evidence

Ablation snapshot files + dashboard text or JSON output + per-channel metrics

### Pass / Fail

- **Pass**: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output
- **Fail**: Missing channel data or dashboard generation error

### Failure Triage

Verify eval dataset exists → Check ablation channel-off logic → Inspect snapshot storage path → Validate dashboard template

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/014-full-reporting-and-ablation-study-framework-r13-s3.md`
- audited_post_018: true
