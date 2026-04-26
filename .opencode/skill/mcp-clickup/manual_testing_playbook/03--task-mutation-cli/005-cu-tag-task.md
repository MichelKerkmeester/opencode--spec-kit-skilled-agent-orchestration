---
title: "CU-015 -- cu tag --add add tags"
description: "This scenario validates `cu tag --add` for `CU-015`. It focuses on adding a comma-separated tag list to a throwaway task and verifying tags are additive (existing tags preserved)."
---

# CU-015 -- cu tag --add add tags

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-015`.

---

## 1. OVERVIEW

This scenario validates `cu tag <id> --add "label1,label2"` for `CU-015`. It focuses on the tag-write path with the additive semantic — adding new tags should NOT remove pre-existing tags on the task.

### Why This Matters

Operators expect tag operations to compose: adding `bug,frontend` should leave any prior tags intact. If `--add` accidentally replaces, an entire tagging workflow breaks silently. The scenario also covers the parser detail of comma-separated tag lists, which is a common source of CLI bugs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu tag <id> --add "bug,frontend"` exits 0 AND `cu task <id>` afterwards lists `bug` AND `frontend` in `tags` AND any pre-existing tags are preserved.
- Real user request: `"Tag this task as bug and frontend."`
- Prompt: `As a manual-testing orchestrator, add tags to a throwaway task through the cu CLI against a designated test list. Verify cu task afterwards lists the new tags. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: capture pre-existing tags, invoke `cu tag --add`, re-fetch and confirm.
- Expected signals: tag exits 0; new tags appear; pre-existing tags preserved.
- Desired user-visible outcome: A short report quoting pre-existing tags, the additions, and the post-add tag list.
- Pass/fail: PASS if exit 0 AND new tags present AND pre-existing tags preserved; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, add tags to a throwaway task through the cu CLI against a designated test list. Verify cu task afterwards lists the new tags. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu task <taskId> 2>&1 | head -10` — capture pre-existing tags
2. `bash: cu tag <taskId> --add "bug,frontend" 2>&1` — invoke add
3. `bash: echo $?` — capture exit code
4. `bash: cu task <taskId> 2>&1 | head -10` — confirm new + preserved tags

### Expected

- Step 1: produces output with current tag set (possibly empty)
- Step 2: produces success output
- Step 3: exit code is 0
- Step 4: post-add tag list contains both new tags AND every pre-existing tag

### Evidence

Capture the pre-existing tag set, the verbatim `cu tag` output, the exit code, and the post-add tag set with the additive-preservation verdict.

### Pass / Fail

- **Pass**: Exit 0 AND new tags present AND pre-existing tags preserved.
- **Fail**: Non-zero exit, new tags absent, OR pre-existing tags removed (replace semantic instead of additive).

### Failure Triage

1. If new tags absent post-add: check `cu tag --help` for the exact flag (`--add` vs `--set` vs `+`); some CLI versions use a different verb for add-vs-replace.
2. If pre-existing tags removed: this is a critical semantic bug in the CLI's tag handler — capture both pre and post lists and escalate; document the version that exhibits the bug.
3. If only one of the two tags appears: the comma-separated parser may split on whitespace too — re-run with `--add "bug" --add "frontend"` (separate flags) if supported by the CLI version.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (`cu tag --add`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (write commands) |

---

## 5. SOURCE METADATA

- Group: TASK MUTATION CLI
- Playbook ID: CU-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--task-mutation-cli/005-cu-tag-task.md`
