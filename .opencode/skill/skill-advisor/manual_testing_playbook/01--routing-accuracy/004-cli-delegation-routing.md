---
title: "RA-004 -- CLI Delegation Routing"
description: "This scenario validates CLI Delegation Routing for `RA-004`. It focuses on each CLI skill routing correctly when explicitly named without ghost sibling contamination."
---

# RA-004 -- CLI Delegation Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-004`.

---

## 1. OVERVIEW

This scenario validates CLI Delegation Routing for `RA-004`. It focuses on each CLI skill routing correctly when explicitly named, with no ghost sibling candidates appearing from graph family boosts alone.

### Why This Matters

If explicit CLI delegation misroutes, operators will invoke the wrong CLI runtime (e.g., Gemini instead of Codex), executing tasks with the wrong model and capabilities -- potentially producing incorrect output or wasting resources.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-004` and confirm the expected signals without contradictory evidence.

- Objective: Each CLI skill routes correctly when explicitly named
- Real user request: `"delegate to codex for code generation"`
- Prompt: `As a routing accuracy operator, validate CLI delegation routing against skill_advisor.py with 4 CLI-specific prompts. Verify each routes to its named CLI skill with explicit match and no ghost sibling candidates. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: each prompt routes to its named CLI skill, explicit reason present, no ghost siblings
- Pass/fail: PASS if each prompt routes to its named CLI skill with no ghost siblings; FAIL if wrong skill is top-1 or siblings appear with only graph:family evidence

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate CLI delegation routing against skill_advisor.py with 4 CLI-specific prompts. Verify each routes to its named CLI skill with explicit match and no ghost sibling candidates. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "delegate to codex for code generation"`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "use gemini cli for second opinion"`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "use claude code cli for extended thinking"`
4. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "delegate to copilot cli in cloud mode"`

### Expected

Each command routes to its named CLI skill (cli-codex, cli-gemini, cli-claude-code, cli-copilot). Explicit name match appears in reasons. Other CLI siblings do NOT appear with only `!graph:family` evidence.

### Evidence

Capture the full JSON output for each command showing the top-1 skill, confidence, match reasons (confirming explicit match), and verify no sibling CLI skills appear with graph-only evidence.

### Pass / Fail

- **Pass**: Each prompt routes to its named CLI skill; no ghost sibling candidates appear
- **Fail**: Wrong skill is top-1 for any prompt, or sibling CLIs appear with only `!graph:family(cli)` evidence

### Failure Triage

Check skill_advisor.py explicit name matching logic. Verify ghost guard is filtering candidates with only graph reasons. Review CLI skill graph-metadata.json files for unintended family boost configurations.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/cli-codex/graph-metadata.json` | Graph metadata for cli-codex skill |
| `.opencode/skill/cli-gemini/graph-metadata.json` | Graph metadata for cli-gemini skill |
| `.opencode/skill/cli-claude-code/graph-metadata.json` | Graph metadata for cli-claude-code skill |
| `.opencode/skill/cli-copilot/graph-metadata.json` | Graph metadata for cli-copilot skill |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/004-cli-delegation-routing.md`
