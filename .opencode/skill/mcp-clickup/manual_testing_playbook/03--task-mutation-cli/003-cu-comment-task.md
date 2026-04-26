---
title: "CU-013 -- cu comment -m post task comment"
description: "This scenario validates `cu comment` for `CU-013`. It focuses on posting a comment on a throwaway task and confirming it appears in `cu comments <id>`."
---

# CU-013 -- cu comment -m post task comment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-013`.

---

## 1. OVERVIEW

This scenario validates `cu comment <id> -m "text"` for `CU-013`. It focuses on the comment-write path: posting a new comment on a throwaway task and confirming it appears via `cu comments <id>` with the correct body and author.

### Why This Matters

Comments are the primary collaboration surface in ClickUp. A reliable CLI write path for comments is the difference between "operator updates ClickUp from the terminal" and "operator switches to the web UI". The author check is non-trivial — the CLI auth context determines which user is recorded as the comment author, which doubles as a smoke test for CU-003.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu comment <id> -m "CU-013 comment"` exits 0 AND `cu comments <id>` includes a comment whose body matches AND whose author matches the authenticated identity.
- Real user request: `"Post a comment on this task."`
- Prompt: `As a manual-testing orchestrator, post a comment on a throwaway task through the cu CLI against a designated test list. Verify cu comments <id> shows the new comment. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take a throwaway `<taskId>` from CU-011; invoke `cu comment`; immediately `cu comments <taskId>`.
- Expected signals: post exits 0; comments listing shows the new body; author matches the authenticated identity from CU-003.
- Desired user-visible outcome: A short report quoting the new comment body and the recorded author.
- Pass/fail: PASS if all three signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, post a comment on a throwaway task through the cu CLI against a designated test list. Verify cu comments <id> shows the new comment. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu comment <taskId> -m "CU-013 comment" 2>&1` — invoke
2. `bash: echo $?` — capture exit code
3. `bash: cu comments <taskId> 2>&1 | head -20` — list comments and confirm the new one is present
4. Inspect the new comment row for body match and author match

### Expected

- Step 1: produces success output
- Step 2: exit code is 0
- Step 3: comments listing contains a row with body "CU-013 comment"
- Step 4: that row's author matches the authenticated identity from CU-003

### Evidence

Capture the verbatim `cu comment` output, exit code, the verbatim `cu comments` listing (truncated to first 20 lines), and the body+author match verdict.

### Pass / Fail

- **Pass**: Exit 0, body matches, author matches.
- **Fail**: Non-zero exit, body mismatch, OR author does not match the authenticated identity.

### Failure Triage

1. If non-zero exit with "task not found": confirm `<taskId>` was captured verbatim from CU-011 and the task still exists (`cu task <id>`).
2. If body matches but author wrong: the auth context may have changed since CU-003 — re-run CU-003 to confirm the current identity, and check whether a different `.cu_config` is active in this shell.
3. If `cu comments <id>` does not exist as a subcommand: check `cu --version` and consult `cu --help` for the equivalent (e.g., `cu task <id> --comments`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu comment -m`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands, read commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/003-cu-comment-task.md`
