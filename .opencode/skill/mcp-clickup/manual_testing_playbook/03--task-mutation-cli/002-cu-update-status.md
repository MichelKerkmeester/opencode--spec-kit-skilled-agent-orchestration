---
title: "CU-012 -- cu update --status update task status"
description: "This scenario validates `cu update --status` for `CU-012`. It focuses on changing a throwaway task's status to a list-valid value and confirming the change persists."
---

# CU-012 -- cu update --status update task status

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-012`.

---

## 1. OVERVIEW

This scenario validates `cu update <id> --status "<value>"` for `CU-012`. It focuses on the most common task-mutation operation — moving a task between statuses — and confirms the change persists via a follow-up `cu task <id>`.

### Why This Matters

Status updates are the bulk of operator workflow on a real ClickUp account. The scenario locks two contracts: status updates use the `--status` flag with a list-valid status string (which varies per list), and the change is visible immediately in `cu task <id>`. A FAIL exposes either a CLI bug or a list-status configuration error that operators need to know about.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-012` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu update <id> --status "<list-valid-status>"` exits 0 AND `cu task <id>` afterwards shows the new status.
- Real user request: `"Mark this task as in progress."`
- Prompt: `As a manual-testing orchestrator, update a throwaway task's status through the cu CLI against a designated test list. Verify cu task afterwards shows the new status. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take a throwaway `<taskId>` from CU-011, look up a list-valid status name, invoke `cu update`, then re-fetch with `cu task`.
- Expected signals: update exits 0; follow-up `cu task <id>` shows the new status; no "invalid status" error.
- Desired user-visible outcome: A short report quoting the old status, the new status, and a PASS verdict.
- Pass/fail: PASS if both steps succeed; FAIL on non-zero exit, "invalid status" error, or status not reflected in re-fetch.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, update a throwaway task's status through the cu CLI against a designated test list. Verify cu task afterwards shows the new status. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu task <taskId> 2>&1 | head -10` — capture current status
2. `bash: cu update <taskId> --status "<list-valid-status>" 2>&1` — invoke update (replace `<list-valid-status>` with a value confirmed valid for the list)
3. `bash: echo $?` — capture exit code
4. `bash: cu task <taskId> 2>&1 | head -10` — confirm new status

### Expected

- Step 1: produces output naming the current status
- Step 2: produces output indicating success (no "invalid status" error)
- Step 3: exit code is 0
- Step 4: returned status matches the requested status

### Evidence

Capture the pre-update status, the verbatim `cu update` output, the exit code, and the post-update status from `cu task`.

### Pass / Fail

- **Pass**: Exit 0 AND post-update status equals the requested status.
- **Fail**: Non-zero exit, "invalid status" error, OR post-update status does not match.

### Failure Triage

1. If "invalid status" error: list-valid statuses vary per list; check `cu list <listId> --statuses` (or open the list in the ClickUp web UI > Settings > Statuses) to find a valid name; re-run with the corrected value.
2. If exit 0 but status unchanged: this is a CLI-side bug or eventual-consistency issue — wait 2 seconds and re-fetch; if still unchanged, capture both the request and re-fetch and escalate.
3. If `cu update --help` does not show `--status`: check `cu --version` and consult `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` §3 for the documented surface.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu update --status`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/002-cu-update-status.md`
