---
title: "RA-005 -- Spec/Memory Routing"
description: "This scenario validates Spec/Memory Routing for `RA-005`. It focuses on correct routing of spec and memory prompts to system-spec-kit with confidence >= 0.80."
---

# RA-005 -- Spec/Memory Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-005`.

---

## 1. OVERVIEW

This scenario validates Spec/Memory Routing for `RA-005`. It focuses on correct routing of spec folder and memory management prompts to system-spec-kit with confidence >= 0.80.

### Why This Matters

If spec and memory prompts misroute, context preservation and spec folder workflows will fail -- operators lose session continuity and documentation compliance degrades.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-005` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing of spec/memory prompts to system-spec-kit
- Real user request: `"save this conversation context to memory"`
- Prompt: `As a routing accuracy operator, validate spec/memory routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "save this conversation context to memory". Verify system-spec-kit is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: system-spec-kit as top-1, confidence >= 0.80
- Pass/fail: PASS if system-spec-kit is top-1 with confidence >= 0.80; FAIL if different skill is top-1 or confidence < 0.80

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate spec/memory routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "save this conversation context to memory". Verify system-spec-kit is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "save this conversation context to memory"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "create a new spec folder with plan"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "memory search for prior work"`

### Expected

system-spec-kit is the top-1 result with confidence >= 0.80 for all variants. Match reasons should include memory/spec-related phrase or keyword signals.

### Evidence

Capture the full JSON output showing skill name, confidence score, passes_threshold flag, and match reasons for each command.

### Pass / Fail

- **Pass**: system-spec-kit is top-1 with confidence >= 0.80 for all prompts
- **Fail**: Different skill is top-1 or confidence < 0.80 for any prompt

### Failure Triage

Check system-spec-kit graph-metadata.json for memory and spec trigger_phrases. Verify intent_signals cover context/memory/spec keywords. Confirm no competing skill overrides via higher confidence.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | Graph metadata defining system-spec-kit signals and edges |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset with spec/memory routing cases |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/005-spec-memory-routing.md`
