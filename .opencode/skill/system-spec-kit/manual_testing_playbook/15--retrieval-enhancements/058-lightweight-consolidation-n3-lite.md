---
title: "058 -- Lightweight consolidation (N3-lite)"
description: "This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior."
audited_post_018: true
---

# 058 -- Lightweight consolidation (N3-lite)

## 1. OVERVIEW

This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm maintenance cycle behavior.
- Real user request: `Please validate Lightweight consolidation (N3-lite) against the documented validation surface and tell me whether the expected signals are present: Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Lightweight consolidation (N3-lite) against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three consolidation sub-processes execute and produce expected outputs without errors

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm maintenance cycle behavior against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. trigger cycle
2. inspect contradiction/hebbian/staleness outputs
3. verify logs

### Expected

Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs

### Evidence

Consolidation cycle output + log entries for each sub-step (contradiction/hebbian/staleness)

### Pass / Fail

- **Pass**: all three consolidation sub-processes execute and produce expected outputs without errors
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check consolidation trigger mechanism; inspect individual sub-process logs; verify database state before and after cycle

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/04-lightweight-consolidation.md](../../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 058
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/058-lightweight-consolidation-n3-lite.md`
