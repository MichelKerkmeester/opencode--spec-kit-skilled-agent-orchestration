---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance."
audited_post_018: true
---

# 063 -- Feature flag governance

## 1. OVERVIEW

This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm governance policy conformance.
- Real user request: `Please validate Feature flag governance against the documented validation surface and tell me whether the expected signals are present: All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found.`
- RCAF Prompt: `As a governance validation operator, validate Feature flag governance against the documented validation surface. Verify all flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all flags have documented governance metadata and compliance gaps are identified

---

## 3. TEST EXECUTION

### Prompt

```
As a governance validation operator, confirm governance policy conformance against the documented validation surface. Verify all flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. enumerate flags
2. verify age/limits/review cadence
3. record compliance gaps

### Expected

All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found

### Evidence

Flag inventory + compliance report + gap list

### Pass / Fail

- **Pass**: all flags have documented governance metadata and compliance gaps are identified
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify flag enumeration covers all source files; check governance policy definitions; inspect review cadence tracking

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/01-feature-flag-governance.md](../../feature_catalog/17--governance/01-feature-flag-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/063-feature-flag-governance.md`
