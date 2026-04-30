---
title: "CLU-006 -- Create read delete round trip"
description: "This scenario validates a disposable CLI task create, read, and delete cycle."
---

# CLU-006 -- Create read delete round trip

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-006`.

---

## 1. OVERVIEW

This scenario validates the core ClickUp CLI write path using a throwaway task in a designated test list.

### Why This Matters

It proves task creation works and that cleanup can remove the test artifact.

---

## 2. SCENARIO CONTRACT

- Objective: Create a throwaway task, read it back, and delete it with `--confirm`.
- Real user request: `Create a ClickUp smoke-test task, verify it exists, then clean it up.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, create a uniquely named disposable task in CLICKUP_PLAYBOOK_TEST_LIST_ID using cu, read it back, then delete it with --confirm. Capture the task ID and cleanup proof, and return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Generate unique name, run create, extract task ID, read detail, delete.
- Expected signals: create returns a task ID; detail contains the unique name; delete exits 0.
- Desired user-visible outcome: A short report with sanitized task ID and cleanup status.
- Pass/fail: PASS if create/read/delete all succeed; FAIL if any step fails or cleanup is uncertain.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use only a disposable test list.
2. Generate a unique task name.
3. Create, inspect, delete, and record cleanup proof.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-006 | Create read delete round trip | Confirm CLI task CRUD and cleanup | `As a ClickUp manual-testing orchestrator, create a uniquely named disposable task in CLICKUP_PLAYBOOK_TEST_LIST_ID using cu, read it back, then delete it with --confirm. Capture the task ID and cleanup proof, and return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: test -n "$CLICKUP_PLAYBOOK_TEST_LIST_ID"` -> 2. `bash: export CLU_TASK_NAME="CLU-006 smoke $(date +%s)"` -> 3. `bash: cu create -n "$CLU_TASK_NAME" -l "$CLICKUP_PLAYBOOK_TEST_LIST_ID" 2>&1 \| tee /tmp/clu-006-create.txt` -> 4. `bash: export CLU_TASK_ID="<copy-created-task-id>"` -> 5. `bash: cu task "$CLU_TASK_ID" 2>&1 \| tee /tmp/clu-006-task.txt` -> 6. `bash: cu delete "$CLU_TASK_ID" --confirm 2>&1 \| tee /tmp/clu-006-delete.txt` | Create output includes ID; detail output includes unique name; delete exits 0 | Create/detail/delete transcripts and copied task ID | PASS if all three operations succeed and cleanup is confirmed; FAIL if create/read/delete fails | 1. If create fails, verify list ID and permissions; 2. If ID extraction is unclear, copy ID from ClickUp UI output; 3. If delete fails, manually delete the orphan before rerun |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI create/delete command reference |

---

## 5. SOURCE METADATA

- Group: WRITE OPERATIONS
- Playbook ID: CLU-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--write-operations/001-create-read-delete-round-trip.md`

