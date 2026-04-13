---
title: "ADV-001 -- Semantic flag routing"
description: "This scenario validates Semantic flag routing for `ADV-001`. It focuses on Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found."
---

# ADV-001 -- Semantic flag routing

## 1. OVERVIEW

This scenario validates Semantic flag routing for `ADV-001`. It focuses on Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `ADV-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found
- Prompt: `As a manual-testing orchestrator, test skill advisor with semantic search for a deployment query against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify JSON output is valid; at least one recommendation entry contains !semantic( in its reason field; CocoIndex search was invoked (visible in processing or reason text). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text)
- Pass/fail: PASS if valid JSON returned AND at least one `reason` contains `!semantic(`; PARTIAL if JSON valid but no `!semantic` (CocoIndex may not have found skill refs); FAIL if command errors or invalid JSON


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ADV-001 | Semantic flag routing | Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found | `As a manual-testing orchestrator, test skill advisor with semantic search for a deployment query against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify JSON output is valid; at least one recommendation entry contains !semantic( in its reason field; CocoIndex search was invoked (visible in processing or reason text). Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "deploy to production" --semantic --show-rejections` -> 2. Inspect JSON output for `reason` fields containing `!semantic(...)` notation | JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text) | Full JSON output of skill_advisor.py; highlighted `reason` fields with `!semantic` notation | PASS if valid JSON returned AND at least one `reason` contains `!semantic(`; PARTIAL if JSON valid but no `!semantic` (CocoIndex may not have found skill refs); FAIL if command errors or invalid JSON | Verify `ccc` binary is on PATH (required for `--semantic`); check daemon is running; try `ccc search "deploy" --limit 3` directly to confirm CocoIndex works |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Skill Advisor Integration
- Playbook ID: ADV-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--skill-advisor-integration/001-semantic-flag-routing.md`
