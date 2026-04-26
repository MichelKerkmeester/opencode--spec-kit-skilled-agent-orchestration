---
title: "CU-008 -- cu task <id> task detail JSON"
description: "This scenario validates `cu task <id>` for `CU-008`. It focuses on retrieving the full task detail (name, status, assignees, list_id) for a known task."
---

# CU-008 -- cu task <id> task detail JSON

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-008`.

---

## 1. OVERVIEW

This scenario validates `cu task <id>` for `CU-008`. It focuses on confirming the CLI returns a complete task detail object (name, status, assignees, list_id) for a known task ID.

### Why This Matters

`cu task <id>` is the verification step relied on by every Wave 3 mutation scenario (CU-012..CU-016) to confirm a write succeeded. If the detail view drops fields or returns stale data, the entire mutation wave loses its observability surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu task <id>` exits 0 and returns `name`, `status`, `assignees`, `list_id` for the supplied task.
- Real user request: `"Show me everything about this task."`
- Prompt: `As a manual-testing orchestrator, fetch task detail for a known task id through the cu CLI against the configured workspace. Verify the response includes name, status, assignees, and list_id. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take `<taskId>` from CU-007 evidence, invoke `cu task <taskId>`; do not delegate.
- Expected signals: exit 0; output exposes name, status, assignees, list_id; the returned id matches the requested id.
- Desired user-visible outcome: A short report quoting the four key fields and a PASS verdict.
- Pass/fail: PASS if exit 0 and all four fields present and the id matches; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, fetch task detail for a known task id through the cu CLI against the configured workspace. Verify the response includes name, status, assignees, and list_id. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu task <taskId> 2>&1` — invoke with `<taskId>` from CU-007 evidence
2. `bash: echo $?` — capture exit code
3. Parse output: confirm `name`, `status`, `assignees`, `list_id`, and that the returned `id` matches `<taskId>`

### Expected

- Step 1: produces non-empty output
- Step 2: exit code is 0
- Step 3: all four fields present and id matches

### Evidence

Capture the resolved `<taskId>` (REDACTED if sensitive), the verbatim `cu task <id>` output, and the exit code. Note the rendered `list_id` for cross-checks against CU-016 (`cu move`).

### Pass / Fail

- **Pass**: Exit 0, all four required fields present, returned id matches the request.
- **Fail**: Non-zero exit, any required field absent, or returned id does not match.

### Failure Triage

1. If non-zero exit with "task not found": verify the `<taskId>` was captured verbatim from CU-007; some CLI builds support short IDs that fuzzy-match — prefer the full long ID.
2. If a field is missing: check `cu task --help` for output-format flags (e.g., `--full`, `--json`); record gap if the CLI does not surface the field by default.
3. If the returned id does not match: this is a CLI-side bug — capture both the requested and returned ids and escalate.

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
- Playbook ID: CU-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/004-cu-task-detail.md`
