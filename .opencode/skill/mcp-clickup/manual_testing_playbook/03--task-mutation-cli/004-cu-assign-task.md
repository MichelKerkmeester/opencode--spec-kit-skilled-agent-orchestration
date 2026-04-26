---
title: "CU-014 -- cu assign --to me assign task"
description: "This scenario validates `cu assign` for `CU-014`. It focuses on assigning a throwaway task to the authenticated user via `--to me`."
---

# CU-014 -- cu assign --to me assign task

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-014`.

---

## 1. OVERVIEW

This scenario validates `cu assign <id> --to me` for `CU-014`. It focuses on the assignment-write path with the special `me` alias that resolves to the authenticated user — the most common assignment operation by far.

### Why This Matters

`--to me` is a CLI ergonomic affordance that depends on the auth context (CU-003) and on the CLI's identity-resolution logic. If `me` resolves to the wrong user (e.g., a stale config or a multi-account `cu_config` mix), assignments end up on phantom users. This scenario locks the contract that `--to me` always equals the identity reported by `cu auth`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu assign <id> --to me` exits 0 AND `cu task <id>` afterwards lists the authenticated user in `assignees`.
- Real user request: `"Assign this task to me."`
- Prompt: `As a manual-testing orchestrator, assign a throwaway task to me through the cu CLI against a designated test list. Verify cu task afterwards lists the authenticated user as assignee. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take a throwaway `<taskId>`; invoke `cu assign`; immediately `cu task <taskId>`.
- Expected signals: assign exits 0; `cu task` lists the authenticated user in `assignees`; no permission error.
- Desired user-visible outcome: A short report confirming the assignee row and a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, assign a throwaway task to me through the cu CLI against a designated test list. Verify cu task afterwards lists the authenticated user as assignee. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu assign <taskId> --to me 2>&1` — invoke
2. `bash: echo $?` — capture exit code
3. `bash: cu task <taskId> 2>&1 | head -10` — verify `assignees` contains the authenticated user
4. Cross-reference `assignees` against the identity from CU-003

### Expected

- Step 1: produces success output
- Step 2: exit code is 0
- Step 3: `assignees` field includes the authenticated user
- Step 4: identity matches CU-003

### Evidence

Capture the verbatim `cu assign` output, exit code, the verbatim `cu task` output focused on `assignees`, and the cross-reference verdict against CU-003.

### Pass / Fail

- **Pass**: Exit 0 AND assignees includes authenticated user AND identity matches CU-003.
- **Fail**: Non-zero exit, permission error, assignees missing the user, or identity mismatch with CU-003.

### Failure Triage

1. If non-zero exit with "permission denied": the configured token may lack write access to that task — confirm via the ClickUp web UI > task > Permissions; if the token is read-only, request a write-scoped token and re-run CU-003 + CU-004 to refresh config.
2. If `--to me` does not resolve: check `cu assign --help` for the exact alias keyword in this CLI version (`me` vs `self` vs `current`); update commands and evidence.
3. If assignee resolves but to a different user than CU-003 reported: the `.cu_config` may point at a stale token — re-run CU-003 + CU-004; capture the discrepancy as a config issue.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu assign --to`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/004-cu-assign-task.md`
