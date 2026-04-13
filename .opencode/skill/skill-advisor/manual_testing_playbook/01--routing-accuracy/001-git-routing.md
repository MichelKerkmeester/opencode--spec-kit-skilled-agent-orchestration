---
title: "RA-001 -- Git Workflow Routing"
description: "This scenario validates Git Workflow Routing for `RA-001`. It focuses on correct routing of git-related prompts to sk-git with confidence >= 0.80."
---

# RA-001 -- Git Workflow Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-001`.

---

## 1. OVERVIEW

This scenario validates Git Workflow Routing for `RA-001`. It focuses on correct routing of git-related prompts to sk-git with confidence >= 0.80.

### Why This Matters

If git workflow prompts route to the wrong skill, operators will receive incorrect guidance for branch management, commits, and PRs -- the most frequent developer workflow in the system.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-001` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing of git prompts to sk-git
- Real user request: `"create a pull request on github"`
- Prompt: `As a routing accuracy operator, validate git workflow routing against skill_advisor.py "create a pull request on github". Verify sk-git is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: sk-git as top-1, confidence >= 0.80, passes_threshold true
- Pass/fail: PASS if sk-git is top-1 with confidence >= 0.80; FAIL if different skill is top-1 or confidence < 0.80

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate git workflow routing against skill_advisor.py "create a pull request on github". Verify sk-git is top-1 with confidence >= 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "create a pull request on github"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "resolve merge conflict and rebase"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "conventional commit for this change"`

### Expected

sk-git is the top-1 result with confidence >= 0.80 and passes_threshold is true for all variants.

### Evidence

Capture the full JSON output showing skill name, confidence score, passes_threshold flag, and match reasons for each command.

### Pass / Fail

- **Pass**: sk-git is top-1 with confidence >= 0.80 for all prompts
- **Fail**: Different skill is top-1, or confidence < 0.80 for any prompt

### Failure Triage

Check skill_advisor.py signal matching for git-related keywords. Verify sk-git graph-metadata.json contains correct trigger_phrases and intent_signals. Review skill-graph.json for unexpected edge boosts overriding the match.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset with git routing cases |
| `.opencode/skill/sk-git/graph-metadata.json` | Graph metadata defining sk-git signals and edges |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/001-git-routing.md`
