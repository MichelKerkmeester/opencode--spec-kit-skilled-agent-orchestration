---
title: "ADV-002 -- Pre-computed hits routing"
description: "This scenario validates Pre-computed hits routing for `ADV-002`. It focuses on Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill."
---

# ADV-002 -- Pre-computed hits routing

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Pre-computed hits routing for `ADV-002`. It focuses on Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ADV-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill
- Prompt: `As a manual-testing orchestrator, run skill advisor twice for the same deployment query: first without semantic hits, then with pre-computed CocoIndex hits against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify sk-git appears in the semantic-hits run, its confidence is higher than in the baseline run, and the boosted reason references semantic input. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Both JSON outputs are valid; `sk-git` appears in the semantic-hits run; its confidence is higher than in the baseline run; boosted `reason` references semantic input
- Pass/fail: PASS if `sk-git` appears in the semantic-hits run with confidence higher than the baseline run; PARTIAL if `sk-git` appears but confidence is unchanged; FAIL if command errors or `sk-git` is absent from the semantic-hits run


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ADV-002 | Pre-computed hits routing | Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill | `As a manual-testing orchestrator, run skill advisor twice for the same deployment query: first without semantic hits, then with pre-computed CocoIndex hits against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify sk-git appears in the semantic-hits run, its confidence is higher than in the baseline run, and the boosted reason references semantic input. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deploy to production" --show-rejections` -> 2. Capture baseline JSON output and `sk-git` confidence if present -> 3. `bash: python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deploy to production" --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]' --show-rejections` -> 4. Capture semantic-hits JSON output and compare the `sk-git` confidence against the baseline run | Both JSON outputs are valid; `sk-git` appears in the semantic-hits run; its confidence is higher than in the baseline run; boosted `reason` references semantic input | Baseline and semantic-hits JSON outputs with the `sk-git` entries highlighted | PASS if `sk-git` appears in the semantic-hits run with confidence higher than the baseline run; PARTIAL if `sk-git` appears but confidence is unchanged; FAIL if command errors or `sk-git` is absent from the semantic-hits run | Verify `--semantic-hits` JSON is valid (must be array of objects with `path` and `score`); check skill_advisor.py `SEMANTIC_BOOST_MULTIPLIER` config; confirm the same query string is used in both runs |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Skill Advisor Integration
- Playbook ID: ADV-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--skill-advisor-integration/002-pre-computed-hits-routing.md`
