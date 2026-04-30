---
title: "138 -- MODULE: header compliance via verify_alignment_drift.py"
description: "This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings."
---

# 138 -- MODULE: header compliance via verify_alignment_drift.py

## 1. OVERVIEW

This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.
- Real user request: `Please validate MODULE: header compliance via verify_alignment_drift.py against cd .opencode/skill/system-spec-kit and tell me whether the expected signals are present: verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings.`
- RCAF Prompt: `As a tooling validation operator, validate MODULE: header compliance via verify_alignment_drift.py against cd .opencode/skill/system-spec-kit. Verify verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if 0 TS-MODULE-HEADER findings reported

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify verify_alignment_drift.py returns 0 TS-MODULE-HEADER findings against cd .opencode/skill/system-spec-kit. Verify verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit`
2. `python3 ../sk-code-opencode/scripts/verify_alignment_drift.py --root .`
3. Grep output for `TS-MODULE-HEADER` findings
4. Verify 0 findings

### Expected

verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings

### Evidence

Script output showing PASS verdict + finding count

### Pass / Fail

- **Pass**: 0 TS-MODULE-HEADER findings reported
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check for new .ts files without MODULE: header → Add 3-line header block → Re-run verifier

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 138
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md`
