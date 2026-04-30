---
title: "CLU-008 -- CLI comment round trip"
description: "This scenario validates `cu comment` followed by `cu comments` on a disposable task."
---

# CLU-008 -- CLI comment round trip

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-008`.

---

## 1. OVERVIEW

This scenario validates the common comment path through the ClickUp CLI. It creates a disposable task, posts a uniquely marked comment, verifies the comment appears, and deletes the task.

### Why This Matters

Comment workflows are user-visible collaboration features. The round trip proves both write and read sides work.

---

## 2. SCENARIO CONTRACT

- Objective: Add a CLI comment to a disposable task and verify it with `cu comments`.
- Real user request: `Add a test comment to a ClickUp task and confirm it appears.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, create a disposable task, add a uniquely marked comment with cu comment, verify the marker appears in cu comments, clean up the task, and return a concise user-facing pass/fail verdict with cleanup status.`
- Expected execution process: Create task, comment, list comments, verify marker, delete task.
- Expected signals: comment command exits 0; comments output includes exact marker; cleanup succeeds.
- Desired user-visible outcome: A short report confirming comment write/read and cleanup.
- Pass/fail: PASS if marker is visible in comment output and task cleanup succeeds; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create a disposable task.
2. Generate a unique comment marker.
3. Add and verify comment.
4. Delete task.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-008 | CLI comment round trip | Confirm CLI comment write/read path | `As a ClickUp manual-testing orchestrator, create a disposable task, add a uniquely marked comment with cu comment, verify the marker appears in cu comments, clean up the task, and return a concise user-facing pass/fail verdict with cleanup status.` | 1. `bash: export CLU_TASK_NAME="CLU-008 comment $(date +%s)"` -> 2. `bash: cu create -n "$CLU_TASK_NAME" -l "$CLICKUP_PLAYBOOK_TEST_LIST_ID" 2>&1 \| tee /tmp/clu-008-create.txt` -> 3. `bash: export CLU_TASK_ID="<copy-created-task-id>"` -> 4. `bash: export CLU_COMMENT_MARKER="CLU-008 marker $(date +%s)"` -> 5. `bash: cu comment "$CLU_TASK_ID" -m "$CLU_COMMENT_MARKER" 2>&1 \| tee /tmp/clu-008-comment.txt` -> 6. `bash: cu comments "$CLU_TASK_ID" 2>&1 \| tee /tmp/clu-008-comments.txt` -> 7. `bash: grep -F "$CLU_COMMENT_MARKER" /tmp/clu-008-comments.txt` -> 8. `bash: cu delete "$CLU_TASK_ID" --confirm` | Create ID exists; comment exits 0; comments output contains marker; delete exits 0 | Create/comment/comments/delete transcript | PASS if marker appears and cleanup succeeds; FAIL if comment not visible or cleanup fails | 1. Verify the copied task ID is correct; 2. Check whether workspace comments are permission-restricted; 3. Manually delete the task if cleanup fails |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI comment reference |

---

## 5. SOURCE METADATA

- Group: COMMENTS AND THREADS
- Playbook ID: CLU-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--comments-and-threads/001-cli-comment-round-trip.md`

