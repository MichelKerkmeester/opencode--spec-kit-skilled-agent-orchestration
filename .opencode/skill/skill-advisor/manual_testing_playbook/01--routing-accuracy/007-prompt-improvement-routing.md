---
title: "RA-007 -- Prompt Improvement Routing"
description: "This scenario validates Prompt Improvement Routing for `RA-007`. It focuses on correct routing of prompt improvement requests to sk-improve-prompt with confidence >= 0.80."
---

# RA-007 -- Prompt Improvement Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-007`.

---

## 1. OVERVIEW

This scenario validates Prompt Improvement Routing for `RA-007`. It focuses on correct routing of prompt improvement and framework selection requests to sk-improve-prompt with confidence >= 0.80.

### Why This Matters

If prompt improvement requests misroute, operators will not receive structured prompt engineering guidance (RCAF, COSTAR, CRISPE) -- resulting in lower quality prompts and degraded downstream AI output.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-007` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing to sk-improve-prompt
- Real user request: `"improve this prompt with COSTAR framework"`
- Prompt: `As a routing accuracy operator, validate prompt improvement routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "improve this prompt with COSTAR framework". Verify sk-improve-prompt is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: sk-improve-prompt as top-1, confidence >= 0.80
- Pass/fail: PASS if sk-improve-prompt is top-1 with confidence >= 0.80; FAIL if different skill is top-1 or confidence < 0.80

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate prompt improvement routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "improve this prompt with COSTAR framework". Verify sk-improve-prompt is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "improve this prompt with COSTAR framework"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "enhance my prompt using CRISPE"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "prompt framework selection"`

### Expected

sk-improve-prompt is the top-1 result with confidence >= 0.80 for all variants. Match reasons should include prompt framework keyword or phrase signals.

### Evidence

Capture the full JSON output showing skill name, confidence score, passes_threshold flag, and match reasons for each command.

### Pass / Fail

- **Pass**: sk-improve-prompt is top-1 with confidence >= 0.80 for all prompts
- **Fail**: Different skill is top-1 or confidence < 0.80 for any prompt

### Failure Triage

Check sk-improve-prompt graph-metadata.json for COSTAR/CRISPE/RCAF trigger_phrases. Verify intent_signals cover prompt engineering keywords. Confirm no competing skill captures "improve" or "framework" generically.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/sk-improve-prompt/graph-metadata.json` | Graph metadata defining sk-improve-prompt signals and edges |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset with prompt routing cases |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/007-prompt-improvement-routing.md`
