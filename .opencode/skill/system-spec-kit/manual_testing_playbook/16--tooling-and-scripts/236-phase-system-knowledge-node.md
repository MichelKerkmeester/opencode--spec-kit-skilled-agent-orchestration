---
title: "236 -- Phase-System Knowledge Node"
description: "This scenario validates phase-system knowledge node for `236`. It focuses on confirming the documented phase workflow aligns with the executable phase creation and recursive validation surfaces."
---

# 236 -- Phase-System Knowledge Node

## 1. OVERVIEW

This scenario validates phase-system knowledge node for `236`. It focuses on confirming the documented phase workflow aligns with the executable phase creation and recursive validation surfaces.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the documented phase model aligns with the live creation, workflow, and validation surfaces.
- Real user request: `Please validate Phase-System Knowledge Node against bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh and tell me whether the expected signals are present: phase-system shell and JS tests pass; recursive validation succeeds on the valid-phase fixture; direct phase-link validation passes.`
- RCAF Prompt: `As a tooling validation operator, validate Phase-System Knowledge Node against bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh. Verify the documented phase model aligns with the live creation, workflow, and validation surfaces. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: phase-system shell and JS tests pass; recursive validation succeeds on the valid-phase fixture; direct phase-link validation passes
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the knowledge node's promised phase workflow is reflected by the executable scripts and fixtures

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm the documented phase model aligns with the live creation, workflow, and validation surfaces against bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh. Verify phase-system tests pass; recursive validation exits 0 on the valid fixture; direct phase-link check passes without warn/error output. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh`
2. `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js`
3. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase --recursive`
4. `bash .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase`

### Expected

Phase-system tests pass; recursive validation exits 0 on the valid fixture; direct phase-link check passes without warn/error output

### Evidence

Test transcript, recursive validation output, and direct rule output

### Pass / Fail

- **Pass**: all four commands succeed and the valid fixture is treated as phase-coherent across both orchestrated and direct checks
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `nodes/phase-system.md`, `scripts/tests/test-phase-system.sh`, `scripts/spec/validate.sh`, and `scripts/rules/check-phase-links.sh` if the documented model diverges from executable behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/22-phase-system-knowledge-node.md](../../feature_catalog/16--tooling-and-scripts/22-phase-system-knowledge-node.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 236
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/236-phase-system-knowledge-node.md`
