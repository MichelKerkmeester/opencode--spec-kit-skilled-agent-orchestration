---
title: "RA-002 -- Code Review Routing"
description: "This scenario validates Code Review Routing for `RA-002`. It focuses on correct routing of review prompts to sk-code-review with confidence >= 0.80."
---

# RA-002 -- Code Review Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-002`.

---

## 1. OVERVIEW

This scenario validates Code Review Routing for `RA-002`. It focuses on correct routing of review prompts to sk-code-review with confidence >= 0.80.

### Why This Matters

If review prompts misroute, security audits and merge readiness checks will use the wrong skill -- potentially missing vulnerabilities or applying incorrect review standards.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-002` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing of review prompts to sk-code-review
- Real user request: `"security code review for regressions"`
- Prompt: `As a routing accuracy operator, validate code review routing against skill_advisor.py "security code review for regressions". Verify sk-code-review is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: sk-code-review as top-1, confidence >= 0.80, reason includes code review phrase match
- Pass/fail: PASS if sk-code-review is top-1 with confidence >= 0.80; FAIL if different skill is top-1

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate code review routing against skill_advisor.py "security code review for regressions". Verify sk-code-review is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "security code review for regressions"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "check merge readiness"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "audit this module for vulnerabilities"`

### Expected

sk-code-review is the top-1 result with confidence >= 0.80 and reason includes `!code review(phrase)` or `!review` match for all variants.

### Evidence

Capture the full JSON output showing skill name, confidence score, passes_threshold flag, and match reasons for each command.

### Pass / Fail

- **Pass**: sk-code-review is top-1 with confidence >= 0.80 for all prompts
- **Fail**: Different skill is top-1 for any prompt

### Failure Triage

Check skill_advisor.py phrase matching for review-related terms. Verify sk-code-review graph-metadata.json trigger_phrases. Confirm no competing skill (sk-code-opencode, sk-code-web) overrides via graph boosts.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset with review routing cases |
| `.opencode/skill/sk-code-review/graph-metadata.json` | Graph metadata defining sk-code-review signals and edges |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/002-code-review-routing.md`
