---
title: "CU-007 -- cu tasks my open tasks"
description: "This scenario validates `cu tasks` for `CU-007`. It focuses on listing the operator's open tasks across the configured workspace."
---

# CU-007 -- cu tasks my open tasks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-007`.

---

## 1. OVERVIEW

This scenario validates `cu tasks` for `CU-007`. It focuses on the operator's "what is on my plate" view — the open tasks assigned to the authenticated user across the configured workspace.

### Why This Matters

`cu tasks` is the daily-driver command for the CLI primary stance. If it does not return assigned-to-me tasks, the CLI value proposition collapses (operators fall back to the web UI). It is also one of the most common commands to mis-render across CLI versions, which is why this scenario locks the row contract (id, name, status).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu tasks` exits 0 and returns rows with `id`, `name`, `status` for the operator's open tasks.
- Real user request: `"What ClickUp tasks do I have open right now?"`
- Prompt: `As a manual-testing orchestrator, list my open ClickUp tasks through the cu CLI against the configured workspace. Verify the response lists task ids, names, and statuses. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `cu tasks`; do not delegate; rendering is CLI-default.
- Expected signals: exit 0; rows expose id, name, status; an empty result with an explicit "no open tasks" message is acceptable.
- Desired user-visible outcome: A short report counting open tasks and quoting the first row's id+name+status.
- Pass/fail: PASS if exit 0 and rows expose required fields (or known-zero result); FAIL on non-zero exit, malformed rows, or unexpected empty result on an account with open tasks.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, list my open ClickUp tasks through the cu CLI against the configured workspace. Verify the response lists task ids, names, and statuses. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu tasks 2>&1` — invoke and capture output
2. `bash: echo $?` — capture exit code
3. Parse rows: confirm `id`, `name`, `status`; record task count

### Expected

- Step 1: produces output
- Step 2: exit code is 0
- Step 3: every present row exposes `id`, `name`, `status`

### Evidence

Capture the verbatim `cu tasks` output and exit code. Pin one task ID (REDACTED if sensitive) as `<taskId>` input for CU-008.

### Pass / Fail

- **Pass**: Exit 0, rows expose id+name+status (or known-empty with explicit message).
- **Fail**: Non-zero exit, malformed rows missing required fields, or unexpected empty result on an account known to have open tasks.

### Failure Triage

1. If non-zero exit with auth error: route to CU-003 (`cu auth` live token); the auth context may have expired since CU-004.
2. If empty unexpectedly: confirm the authenticated user has open tasks via the ClickUp web UI; the CLI may filter by assignee + status by default — check `cu tasks --help` for filter flags.
3. If missing `status` in rows: check `cu --version` and consult `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` §3 for the surface inventory; record gap if the CLI does not surface status.

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
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Surfaces under test) |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND READONLY
- Playbook ID: CU-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/003-cu-tasks-my-open.md`
