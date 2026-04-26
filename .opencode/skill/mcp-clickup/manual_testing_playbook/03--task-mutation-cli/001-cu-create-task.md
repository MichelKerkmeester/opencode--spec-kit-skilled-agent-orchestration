---
title: "CU-011 -- cu create -n -l create task"
description: "This scenario validates `cu create` for `CU-011`. It focuses on creating a throwaway task in a designated test list and confirming the task id is re-fetchable."
---

# CU-011 -- cu create -n -l create task

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-011`.

---

## 1. OVERVIEW

This scenario validates `cu create -n "<name>" -l <listId>` for `CU-011`. It focuses on the foundational write path of the CLI — creating a new task in a list and confirming the returned id refers to a real, fetchable task.

### Why This Matters

`cu create` is the entry point for every later mutation scenario in this category (CU-012..CU-016) — they all need a throwaway task to mutate. If create is broken, the entire Wave 3 mutation suite is blocked. It is also the simplest possible round-trip test of the CLI's write surface and the auth context.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu create -n "CU-011 throwaway" -l <listId>` exits 0 and returns a task id that `cu task <id>` re-fetches with the same name.
- Real user request: `"Create a throwaway test task in my test list."`
- Prompt: `As a manual-testing orchestrator, create a throwaway test task through the cu CLI against a designated test list. Verify the returned task id can be re-fetched with cu task. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take `<listId>` from CU-006 evidence, invoke `cu create`, capture the returned id, immediately `cu task <id>`.
- Expected signals: create exits 0; output includes a new task id; `cu task <id>` returns the same name.
- Desired user-visible outcome: A short report quoting the new task id and the round-trip name match.
- Pass/fail: PASS if create exits 0 AND round-trip name matches; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create a throwaway test task through the cu CLI against a designated test list. Verify the returned task id can be re-fetched with cu task. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu create -n "CU-011 throwaway" -l <listId> 2>&1` — invoke against the test `<listId>` from CU-006
2. `bash: echo $?` — capture exit code
3. Parse stdout to extract the new task `id`
4. `bash: cu task <newTaskId> 2>&1 | head -10` — confirm name matches "CU-011 throwaway"

### Expected

- Step 1: produces output containing a new task id
- Step 2: exit code is 0
- Step 3: id extraction succeeds
- Step 4: returned name matches the supplied name

### Evidence

Capture the resolved `<listId>`, the verbatim `cu create` output, the extracted task id, the exit code, and the verbatim `cu task <id>` round-trip.

### Pass / Fail

- **Pass**: Exit 0, id present, round-trip name matches.
- **Fail**: Non-zero exit, id absent or unparseable, OR round-trip name mismatch.

### Failure Triage

1. If non-zero exit with "list not found": confirm `<listId>` is a list (not a folder or space) and visible to the authenticated user; re-run CU-006 to capture a current list id.
2. If id present but `cu task <id>` returns "not found": this is a CLI-side bug or eventual-consistency issue — wait 2 seconds and retry once; if still failing, capture the id and escalate.
3. If create exits 0 but no id in stdout: check `cu create --help` for output-format flags (e.g., `--json`); the default rendering may suppress the id in some versions.

### Optional Supplemental Checks

- After PASS, retain the new task id; reuse it as `<taskId>` for CU-012..CU-016 to avoid creating five different throwaway tasks.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu create -n -l`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Surfaces under test, write commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/001-cu-create-task.md`
