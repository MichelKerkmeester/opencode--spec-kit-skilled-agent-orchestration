---
title: "CU-016 -- cu move --to move task to a different list"
description: "This scenario validates `cu move` for `CU-016`. It focuses on relocating a throwaway task between two test lists and confirming the new list_id is recorded."
---

# CU-016 -- cu move --to move task to a different list

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-016`.

---

## 1. OVERVIEW

This scenario validates `cu move <id> --to <listId>` for `CU-016`. It focuses on relocating a throwaway task from one list to another and confirming both the destination `list_id` is recorded AND the source list no longer references the task.

### Why This Matters

Move is the only mutation in this category that touches two lists. It is also the operation most likely to fail silently — a CLI that updates the destination but does not remove the task from the source produces ghost references. The scenario verifies both halves explicitly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu move <id> --to <destListId>` exits 0 AND `cu task <id>` afterwards shows `list_id` equal to `<destListId>` AND the task is no longer present in the source list.
- Real user request: `"Move this task to the other list."`
- Prompt: `As a manual-testing orchestrator, move a throwaway task between two test lists through the cu CLI against a designated test space. Verify cu task afterwards shows the new list_id. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: have two test list IDs available; capture the source `list_id` from CU-008; invoke `cu move`; verify both halves.
- Expected signals: move exits 0; `cu task <id>` shows new `list_id`; source list no longer references the task.
- Desired user-visible outcome: A short report quoting source `list_id`, destination `list_id`, and the post-move verdict for both halves.
- Pass/fail: PASS if both halves verified; FAIL if either fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, move a throwaway task between two test lists through the cu CLI against a designated test space. Verify cu task afterwards shows the new list_id. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu task <taskId> 2>&1 | head -10` — capture current `list_id` (this is `<sourceListId>`)
2. `bash: cu move <taskId> --to <destListId> 2>&1` — invoke move (must be a different test list)
3. `bash: echo $?` — capture exit code
4. `bash: cu task <taskId> 2>&1 | head -10` — verify new `list_id` equals `<destListId>`
5. `bash: cu lists <spaceId>` (or list-specific tasks command if the CLI provides one) — verify the task is no longer in `<sourceListId>` (best-effort check)

### Expected

- Step 1: returns the current `list_id`
- Step 2: produces success output
- Step 3: exit code is 0
- Step 4: `list_id` now equals `<destListId>`
- Step 5: source list no longer references the task

### Evidence

Capture the source `list_id`, the verbatim `cu move` output, the exit code, the post-move `list_id`, and the source-list-membership verdict.

### Pass / Fail

- **Pass**: Exit 0 AND new `list_id` matches AND source list no longer references the task.
- **Fail**: Non-zero exit, `list_id` unchanged, OR task still in source list (ghost reference).

### Failure Triage

1. If non-zero exit with "destination list not found": confirm `<destListId>` is a valid list visible to the authenticated user; pull a fresh value from CU-006.
2. If `list_id` updated but source list still references the task: this is a CLI-side bug — capture both halves and escalate; document the CLI version.
3. If source-list membership is hard to verify (no per-list task command): rely on `cu task <id>` showing the new `list_id` only and document the partial verification — this is a known CLI inventory limit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu move --to`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/006-cu-move-task.md`
