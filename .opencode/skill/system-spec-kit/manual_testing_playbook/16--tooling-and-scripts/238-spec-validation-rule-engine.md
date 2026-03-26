---
title: "238 -- Spec Validation Rule Engine"
description: "This scenario validates spec validation rule engine for `238`. It focuses on confirming compliant validation, warning escalation, and recursive phase validation behavior."
---

# 238 -- Spec Validation Rule Engine

## 1. OVERVIEW

This scenario validates spec validation rule engine for `238`. It focuses on confirming compliant validation, warning escalation, and recursive phase validation behavior.

---

## 2. CURRENT REALITY

Operators run the validation orchestrator against compliant, warning-bearing, and phased fixtures and confirm the engine exposes stable human and JSON results without collapsing the severity model.

- Objective: Confirm clean validation, warning behavior, strict escalation, and recursive phase validation
- Prompt: `Validate the spec validation rule engine. Capture the evidence needed to prove validate.sh passes a compliant Level 3 fixture, returns a warning-bearing non-pass result on a known-bad template fixture, escalates that warning path under --strict, and returns recursive phase results for a valid phase parent. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: compliant fixture exits cleanly with JSON output; warning fixture returns non-zero; strict mode escalates warning-bearing runs; recursive phase validation emits aggregate phase results
- Pass/fail: PASS if the orchestrator preserves the documented severity and recursion behavior across the four runs

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 238 | Spec Validation Rule Engine | Confirm clean validation, warning behavior, strict escalation, and recursive phase validation | `Validate the spec validation rule engine. Capture the evidence needed to prove validate.sh passes a compliant Level 3 fixture, returns a warning-bearing non-pass result on a known-bad template fixture, escalates that warning path under --strict, and returns recursive phase results for a valid phase parent. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 2) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header || true` 3) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header --strict || true` 4) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase --recursive --json` | Compliant fixture exits 0 with structured output; extra-header fixture surfaces warnings or non-pass status; strict mode does not silently downgrade issues; recursive JSON includes child phase results | Validation transcript for the warning-bearing fixture plus JSON output for the compliant and recursive runs | PASS if the compliant and phased fixtures pass, the warning fixture is surfaced, and strict mode remains more restrictive than the default run | Inspect `scripts/spec/validate.sh`, `.speckit.yaml` rule ordering, and `scripts/rules/check-*.sh` severity mapping if warnings, strict escalation, or recursive phase reporting are inconsistent |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/24-spec-validation-rule-engine.md](../../feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 238
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/238-spec-validation-rule-engine.md`
