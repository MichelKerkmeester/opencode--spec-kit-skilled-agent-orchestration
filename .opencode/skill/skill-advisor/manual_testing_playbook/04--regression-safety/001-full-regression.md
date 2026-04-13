---
title: "RS-001 -- Full Regression Suite"
description: "This scenario validates Full Regression Suite for `RS-001`. It focuses on the permanent regression harness passing every routing case and safety gate."
---

# RS-001 -- Full Regression Suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RS-001`.

---

## 1. OVERVIEW

This scenario validates Full Regression Suite for `RS-001`. It focuses on the permanent regression harness passing every routing case and safety gate.

### Why This Matters

If the full regression suite no longer passes, routing quality can drift across multiple skill families at once without any single targeted scenario catching the whole blast radius.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RS-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify the full regression harness passes every case and gate
- Real user request: `"run the full skill advisor regression suite"`
- Prompt: `As a regression safety validation operator, validate full regression coverage against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify overall_pass is true, pass_rate is 1.0, failed_cases is 0, and every gate is green. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `"overall_pass": true`, `"pass_rate": 1.0`, `"failed_cases": 0`, and the `top1_accuracy`, `command_bridge_fp_rate`, `p0_pass_rate`, and `all_cases_passed` gates all evaluate true
- Pass/fail: PASS if the report shows zero failures and every gate passes; FAIL if any case fails or any gate is false

---

## 3. TEST EXECUTION

### Prompt

`As a regression safety validation operator, validate full regression coverage against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify overall_pass is true, pass_rate is 1.0, failed_cases is 0, and every gate is green. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

### Expected

The JSON report shows `overall_pass` as true, `pass_rate` as 1.0, `failed_cases` as 0, and every regression gate evaluates true.

### Evidence

Capture the full JSON regression report, including metrics, gate outcomes, and the empty failures list.

### Pass/Fail

- **Pass**: `overall_pass` is true, `failed_cases` is 0, and every gate is green
- **Fail**: Any case fails, any gate is false, or the report exits non-zero

### Failure Triage

Inspect `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` for gate threshold changes. Review `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` for newly failing prompts. Re-run the failing prompt directly through `.opencode/skill/skill-advisor/scripts/skill_advisor.py` to isolate the regression.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` | Regression harness that computes the suite-level gates and verdict |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Canonical regression dataset executed by the harness |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Routing engine exercised by every regression case |

---

## 5. SOURCE METADATA

- Group: Regression Safety
- Playbook ID: RS-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--regression-safety/001-full-regression.md`
