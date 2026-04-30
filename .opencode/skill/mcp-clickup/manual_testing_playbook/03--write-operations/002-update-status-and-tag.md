---
title: "CLU-007 -- Update status and tag"
description: "This scenario validates CLI task update and tag operations on a disposable task."
---

# CLU-007 -- Update status and tag

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-007`.

---

## 1. OVERVIEW

This scenario validates common day-to-day task mutation commands: update status and add a tag.

### Why This Matters

Create alone does not prove task management is usable. Operators need to update task metadata and verify the changes.

---

## 2. SCENARIO CONTRACT

- Objective: Create a throwaway task, update status, add a tag, verify, and delete.
- Real user request: `Update a ClickUp test task status and tag, then clean it up.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, create a disposable task, update its status, add a playbook tag, verify both changes through cu task, delete the task, and return a concise user-facing pass/fail verdict with cleanup status.`
- Expected execution process: Create test task, update status, add tag, fetch detail, delete.
- Expected signals: update and tag commands exit 0; detail reflects the change before deletion.
- Desired user-visible outcome: A short report naming the task ID, mutation result, and cleanup status.
- Pass/fail: PASS if status/tag update is visible and cleanup succeeds; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create a unique disposable task.
2. Apply metadata mutations.
3. Verify detail output.
4. Delete the task.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-007 | Update status and tag | Confirm status/tag mutations are visible | `As a ClickUp manual-testing orchestrator, create a disposable task, update its status, add a playbook tag, verify both changes through cu task, delete the task, and return a concise user-facing pass/fail verdict with cleanup status.` | 1. `bash: export CLU_TASK_NAME="CLU-007 mutate $(date +%s)"` -> 2. `bash: cu create -n "$CLU_TASK_NAME" -l "$CLICKUP_PLAYBOOK_TEST_LIST_ID" 2>&1 \| tee /tmp/clu-007-create.txt` -> 3. `bash: export CLU_TASK_ID="<copy-created-task-id>"` -> 4. `bash: cu update "$CLU_TASK_ID" --status "in progress" 2>&1 \| tee /tmp/clu-007-update.txt` -> 5. `bash: cu tag "$CLU_TASK_ID" --add "manual-playbook" 2>&1 \| tee /tmp/clu-007-tag.txt` -> 6. `bash: cu task "$CLU_TASK_ID" 2>&1 \| tee /tmp/clu-007-task.txt` -> 7. `bash: cu delete "$CLU_TASK_ID" --confirm` | Create ID exists; update/tag exit 0; detail output shows changed status/tag or equivalent workspace-normalized values; delete exits 0 | Mutation transcripts, detail output, cleanup command | PASS if mutations are observable and cleanup succeeds; FAIL if update/tag/delete fails | 1. Verify the workspace has an `in progress` or equivalent status; 2. If status fuzzy matching fails, rerun with a status from `cu task` output; 3. Manually delete the task if cleanup fails |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI update/tag reference |

---

## 5. SOURCE METADATA

- Group: WRITE OPERATIONS
- Playbook ID: CLU-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--write-operations/002-update-status-and-tag.md`

