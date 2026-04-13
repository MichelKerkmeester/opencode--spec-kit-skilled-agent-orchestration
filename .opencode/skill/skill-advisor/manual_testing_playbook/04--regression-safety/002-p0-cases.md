---
title: "RS-002 -- P0 Cases Untouched"
description: "This scenario validates P0 Cases Untouched for `RS-002`. It focuses on the highest-priority regression cases remaining perfect after graph and routing changes."
---

# RS-002 -- P0 Cases Untouched

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RS-002`.

---

## 1. OVERVIEW

This scenario validates P0 Cases Untouched for `RS-002`. It focuses on the highest-priority regression cases remaining perfect after graph and routing changes.

### Why This Matters

The P0 cases define the no-regression floor for the routing system. If even one fails, the most important user workflows are no longer protected.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RS-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify all P0 regression cases still pass
- Real user request: `"confirm the P0 routing cases are still untouched"`
- Prompt: `As a regression safety validation operator, validate P0 case stability against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify p0_total is 12, p0_passed is 12, and p0_pass_rate is 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `"p0_total": 12`, `"p0_passed": 12`, and `"p0_pass_rate": 1.0` appear in the regression report
- Pass/fail: PASS if all 12 P0 cases pass; FAIL if any P0 case fails because that is a hard blocker

---

## 3. TEST EXECUTION

### Prompt

`As a regression safety validation operator, validate P0 case stability against .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py with the canonical dataset. Verify p0_total is 12, p0_passed is 12, and p0_pass_rate is 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

### Expected

The regression report shows `p0_total` as 12, `p0_passed` as 12, and `p0_pass_rate` as 1.0, confirming that every P0 case remains green.

### Evidence

Capture the full JSON report or a filtered excerpt containing the P0 metrics and any related failures list.

### Pass / Fail

- **Pass**: All 12 P0 cases pass and `p0_pass_rate` remains 1.0
- **Fail**: Any P0 case fails or the P0 metrics drift from the expected values

### Failure Triage

Inspect the P0 rows in `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`. Review the gate calculations in `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py`. Re-run the failing P0 prompt directly through `.opencode/skill/skill-advisor/scripts/skill_advisor.py` to isolate the break.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` | Regression harness that computes the P0 metrics |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Dataset containing the 12 P0 cases under protection |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Routing engine exercised by the P0 prompts |

---

## 5. SOURCE METADATA

- Group: Regression Safety
- Playbook ID: RS-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--regression-safety/002-p0-cases.md`
