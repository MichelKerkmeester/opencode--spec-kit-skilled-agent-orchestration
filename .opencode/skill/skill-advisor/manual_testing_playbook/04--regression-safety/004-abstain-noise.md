---
title: "RS-004 -- Abstain on Noise"
description: "This scenario validates Abstain on Noise for `RS-004`. It focuses on the advisor returning no recommendation for ambiguous low-signal prompts."
---

# RS-004 -- Abstain on Noise

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RS-004`.

---

## 1. OVERVIEW

This scenario validates Abstain on Noise for `RS-004`. It focuses on the advisor returning no recommendation for ambiguous low-signal prompts.

### Why This Matters

If noise prompts start returning confident recommendations, the advisor becomes unsafe because vague chatter can trigger irrelevant skill invocations.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RS-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify the advisor abstains on ambiguous noise prompts
- Real user request: `"help"`
- Prompt: `As a regression safety validation operator, validate abstain-on-noise behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py with the prompts "help", "hello", and "thanks". Verify each invocation returns an empty result set. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: each prompt returns `[]`, showing the advisor abstains when no skill matches with sufficient confidence
- Pass/fail: PASS if all three prompts return empty results; FAIL if any noise prompt returns a skill recommendation

---

## 3. TEST EXECUTION

### Prompt

`As a regression safety validation operator, validate abstain-on-noise behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py with the prompts "help", "hello", and "thanks". Verify each invocation returns an empty result set. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "help"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "hello"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "thanks"`

### Expected

Each invocation returns an empty JSON array, confirming the advisor abstains instead of fabricating a recommendation from low-signal noise.

### Evidence

Capture the raw JSON output for all three prompts so the evidence clearly shows `[]` on each invocation.

### Pass/Fail

- **Pass**: All three prompts return empty results
- **Fail**: Any one of the noise prompts returns a skill recommendation

### Failure Triage

Review stop-word and confidence-threshold handling in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Compare the observed behavior to the abstain fixtures in `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`. Inspect whether a recent phrase booster or family boost is leaking through on generic chatter.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Routing engine responsible for abstaining on low-signal prompts |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression fixtures containing abstain-oriented prompt cases such as `P1-ABSTAIN-001` |
| `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` | Runtime metadata loader whose discovered skills must not leak through without evidence |

---

## 5. SOURCE METADATA

- Group: Regression Safety
- Playbook ID: RS-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--regression-safety/004-abstain-noise.md`
