---
title: "CLU-004 -- Task search and detail"
description: "This scenario validates `cu search <query>` followed by `cu task <id>` for read-only task lookup."
---

# CLU-004 -- Task search and detail

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-004`.

---

## 1. OVERVIEW

This scenario validates that the CLI can find a known task by query and fetch detail for the returned or configured task ID.

### Why This Matters

Most operator workflows begin with a fuzzy lookup. The detail fetch confirms the found ID is actionable.

---

## 2. SCENARIO CONTRACT

- Objective: Search for a known test task and fetch its detail.
- Real user request: `Find my ClickUp test task and show me the details.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, search for a known disposable ClickUp test task, select one returned task ID or use CLICKUP_PLAYBOOK_TEST_TASK_ID, fetch task detail, and verify the name/status fields match the search intent. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Run search, choose a task ID, run detail lookup, compare task identity.
- Expected signals: search output contains task rows; detail output contains matching task name or ID.
- Desired user-visible outcome: A short report naming the task found and whether detail lookup matched.
- Pass/fail: PASS if search/detail both succeed and point to the same task; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Set `CLICKUP_PLAYBOOK_TEST_QUERY` to a unique disposable task marker.
2. Run search.
3. Use `CLICKUP_PLAYBOOK_TEST_TASK_ID` if provided, otherwise copy a returned test task ID.
4. Fetch detail.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-004 | Task search and detail | Confirm search result can be fetched by ID | `As a ClickUp manual-testing orchestrator, search for a known disposable ClickUp test task, select one returned task ID or use CLICKUP_PLAYBOOK_TEST_TASK_ID, fetch task detail, and verify the name/status fields match the search intent. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: : "${CLICKUP_PLAYBOOK_TEST_QUERY:=manual-test}"` -> 2. `bash: cu search "$CLICKUP_PLAYBOOK_TEST_QUERY" 2>&1 \| tee /tmp/clu-004-search.txt` -> 3. `bash: test -n "$CLICKUP_PLAYBOOK_TEST_TASK_ID"` -> 4. `bash: cu task "$CLICKUP_PLAYBOOK_TEST_TASK_ID" 2>&1 \| tee /tmp/clu-004-task.txt` | Step 2 exits 0 with non-empty output; Step 3 confirms a task ID is available; Step 4 exits 0 and includes task fields | Search output, task detail output, selected task ID | PASS if selected task appears in detail output; FAIL if search is empty, ID is missing, or detail lookup fails | 1. Create a disposable task in the test list; 2. Use a more unique query marker; 3. Verify the token can read the target list |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI search/detail reference |

---

## 5. SOURCE METADATA

- Group: READ OPERATIONS
- Playbook ID: CLU-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--read-operations/002-task-search-and-detail.md`

