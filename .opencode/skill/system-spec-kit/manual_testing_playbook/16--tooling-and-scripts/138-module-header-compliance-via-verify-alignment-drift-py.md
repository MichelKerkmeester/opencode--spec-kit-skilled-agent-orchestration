---
title: "138 -- MODULE: header compliance via verify_alignment_drift.py"
description: "This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings."
---

# 138 -- MODULE: header compliance via verify_alignment_drift.py

## 1. OVERVIEW

This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `138` and confirm the expected signals without contradicting evidence.

- Objective: Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings
- Prompt: `As a tooling validation operator, validate MODULE: header compliance via verify_alignment_drift.py against cd .opencode/skill/system-spec-kit. Verify verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings
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

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 138
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md`
