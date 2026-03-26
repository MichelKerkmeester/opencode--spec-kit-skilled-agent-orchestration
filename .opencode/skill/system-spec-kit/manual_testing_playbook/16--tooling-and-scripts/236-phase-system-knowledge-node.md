---
title: "236 -- Phase-System Knowledge Node"
description: "This scenario validates phase-system knowledge node for `236`. It focuses on confirming the documented phase workflow aligns with the executable phase creation and recursive validation surfaces."
---

# 236 -- Phase-System Knowledge Node

## 1. OVERVIEW

This scenario validates phase-system knowledge node for `236`. It focuses on confirming the documented phase workflow aligns with the executable phase creation and recursive validation surfaces.

---

## 2. CURRENT REALITY

Operators verify that the phase-system reference is not just descriptive: the shipped tests, validation fixtures, and rule runner all reflect the documented parent-child phase topology and recursive validation workflow.

- Objective: Confirm the documented phase model aligns with the live creation, workflow, and validation surfaces
- Prompt: `Validate the phase-system knowledge node and supporting workflow surface. Capture the evidence needed to prove the phase-system tests pass, recursive validation succeeds on a valid phase packet, and the dedicated phase-link rule passes on the same fixture. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: phase-system shell and JS tests pass; recursive validation succeeds on the valid-phase fixture; direct phase-link validation passes
- Pass/fail: PASS if the knowledge node's promised phase workflow is reflected by the executable scripts and fixtures

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 236 | Phase-System Knowledge Node | Confirm the documented phase model aligns with the live creation, workflow, and validation surfaces | `Validate the phase-system knowledge node and supporting workflow surface. Capture the evidence needed to prove the phase-system tests pass, recursive validation succeeds on a valid phase packet, and the dedicated phase-link rule passes on the same fixture. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh` 2) `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js` 3) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase --recursive` 4) `bash .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase` | Phase-system tests pass; recursive validation exits 0 on the valid fixture; direct phase-link check passes without warn/error output | Test transcript, recursive validation output, and direct rule output | PASS if all four commands succeed and the valid fixture is treated as phase-coherent across both orchestrated and direct checks | Inspect `nodes/phase-system.md`, `scripts/tests/test-phase-system.sh`, `scripts/spec/validate.sh`, and `scripts/rules/check-phase-links.sh` if the documented model diverges from executable behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/22-phase-system-knowledge-node.md](../../feature_catalog/16--tooling-and-scripts/22-phase-system-knowledge-node.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 236
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/236-phase-system-knowledge-node.md`
