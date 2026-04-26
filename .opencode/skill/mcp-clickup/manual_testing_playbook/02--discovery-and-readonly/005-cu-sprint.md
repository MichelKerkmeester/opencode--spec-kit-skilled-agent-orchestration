---
title: "CU-009 -- cu sprint current sprint tasks"
description: "This scenario validates `cu sprint` for `CU-009`. It focuses on listing the tasks in the current sprint or returning an explicit no-active-sprint message."
---

# CU-009 -- cu sprint current sprint tasks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-009`.

---

## 1. OVERVIEW

This scenario validates `cu sprint` for `CU-009`. It focuses on retrieving the tasks in the current sprint (or producing an explicit "no active sprint" message) — a CLI-first feature that complements `cu tasks` for sprint-driven teams.

### Why This Matters

Sprint-driven teams use `cu sprint` to scope the daily standup view. The scenario locks the contract that either a populated sprint OR a clearly-empty no-sprint message is acceptable; it should never silently return an empty list with exit 0 (which would conflate "no sprint configured" with "sprint is empty").

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu sprint` exits 0 against the configured workspace and either lists sprint tasks (each with id, name, status) OR returns an explicit no-active-sprint message.
- Real user request: `"What tasks are in the current sprint?"`
- Prompt: `As a manual-testing orchestrator, list tasks in the current sprint through the cu CLI against the configured workspace. Verify the response is either a non-empty task list or an explicit no-active-sprint message. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `cu sprint`; do not delegate.
- Expected signals: exit 0; output is either populated sprint rows OR an explicit no-active-sprint message; no auth error.
- Desired user-visible outcome: A short report stating which branch was observed (populated vs no-active-sprint) and a PASS verdict.
- Pass/fail: PASS if exit 0 and one of the two branches; FAIL on non-zero exit, silent empty result, or auth error.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, list tasks in the current sprint through the cu CLI against the configured workspace. Verify the response is either a non-empty task list or an explicit no-active-sprint message. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu sprint 2>&1` — invoke and capture output
2. `bash: echo $?` — capture exit code
3. Inspect output: classify as populated sprint OR explicit no-active-sprint message

### Expected

- Step 1: produces output
- Step 2: exit code is 0
- Step 3: output classifies cleanly as populated OR no-active-sprint

### Evidence

Capture the verbatim `cu sprint` output, the exit code, and the classification (populated vs no-active-sprint). If populated, pin a sprint task ID (REDACTED if sensitive).

### Pass / Fail

- **Pass**: Exit 0 and either populated sprint rows OR explicit no-active-sprint message.
- **Fail**: Non-zero exit, silent empty result without a no-active-sprint message, or auth error.

### Failure Triage

1. If non-zero exit with "no sprint configured": this is the explicit message branch — record as PASS, not fail.
2. If silent empty result: check `cu sprint --help` to confirm the no-sprint message exists in this CLI version; if missing, record as a CLI gap.
3. If auth error: route to CU-003 + CU-024 to recover the auth context.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: sprint CLI-only) |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND READONLY
- Playbook ID: CU-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/005-cu-sprint.md`
