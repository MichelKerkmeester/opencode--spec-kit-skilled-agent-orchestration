---
title: "CLU-012 -- Env prefix and destructive guards"
description: "This scenario validates Code Mode ClickUp env-prefix failure signals and CLI delete confirmation behavior."
---

# CLU-012 -- Env prefix and destructive guards

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-012`.

---

## 1. OVERVIEW

This scenario validates two safety paths: Code Mode should fail clearly when ClickUp MCP credentials are missing, and CLI delete should refuse destructive deletion without `--confirm`.

### Why This Matters

The historical skill calls out both Code Mode env-prefix configuration and irreversible task deletion. Operators need fast diagnosis without accidentally deleting live work.

---

## 2. SCENARIO CONTRACT

- Objective: Verify env-prefix diagnostics and destructive delete guard.
- Real user request: `Check that ClickUp MCP credentials fail clearly when missing and that CLI delete requires confirmation.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, inspect Code Mode ClickUp env readiness without printing secrets, then create a disposable task and prove cu delete refuses to delete it without --confirm before cleaning it up with --confirm. Return a concise user-facing pass/fail verdict with cleanup status.`
- Expected execution process: Check env presence, run a harmless Code Mode readiness check, create disposable task, attempt delete without confirm, then delete with confirm.
- Expected signals: missing env is reported without secret leakage; delete without `--confirm` fails/refuses; delete with `--confirm` succeeds.
- Desired user-visible outcome: A short safety verdict.
- Pass/fail: PASS if diagnostics are clear and delete guard works; FAIL if secrets leak, delete proceeds without confirm, or cleanup fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Do not print secret values.
2. Create a fresh disposable task for delete guard testing.
3. Treat deletion without `--confirm` succeeding as a failure.
4. Clean up with `--confirm`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-012 | Env prefix and destructive guards | Confirm safe failure and delete confirmation | `As a ClickUp manual-testing orchestrator, inspect Code Mode ClickUp env readiness without printing secrets, then create a disposable task and prove cu delete refuses to delete it without --confirm before cleaning it up with --confirm. Return a concise user-facing pass/fail verdict with cleanup status.` | 1. `bash: test -n "$CODEMODE_CLICKUP_API_KEY"; echo "CODEMODE_CLICKUP_API_KEY present: $?"` -> 2. `bash: test -n "$CODEMODE_CLICKUP_TEAM_ID"; echo "CODEMODE_CLICKUP_TEAM_ID present: $?"` -> 3. `Code Mode: call_tool_chain({ code: "return { has_api_key: Boolean(process.env.CODEMODE_CLICKUP_API_KEY), has_team_id: Boolean(process.env.CODEMODE_CLICKUP_TEAM_ID) };" })` -> 4. `bash: export CLU_TASK_NAME="CLU-012 guard $(date +%s)"` -> 5. `bash: cu create -n "$CLU_TASK_NAME" -l "$CLICKUP_PLAYBOOK_TEST_LIST_ID" 2>&1 \| tee /tmp/clu-012-create.txt` -> 6. `bash: export CLU_TASK_ID="<copy-created-task-id>"` -> 7. `bash: cu delete "$CLU_TASK_ID" 2>&1 \| tee /tmp/clu-012-delete-without-confirm.txt; echo "UnconfirmedDeleteExit: $?"` -> 8. `bash: cu delete "$CLU_TASK_ID" --confirm 2>&1 \| tee /tmp/clu-012-delete-confirm.txt` | Steps 1-3 report presence booleans without values; Step 7 refuses or exits non-zero; Step 8 exits 0 | Env presence transcript, delete refusal output, cleanup output | PASS if no secrets print, unconfirmed delete refuses, and confirmed cleanup succeeds; FAIL if unconfirmed delete succeeds or cleanup fails | 1. If env check prints secrets, discard evidence and rerun with boolean checks only; 2. If unconfirmed delete succeeds, treat as critical regression; 3. If cleanup fails, manually delete the task in ClickUp UI |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Current Code Mode execution surface |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/SKILL.md` | Historical env-prefix and safety guidance |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical destructive delete command reference |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND SAFETY
- Playbook ID: CLU-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-safety/001-env-prefix-and-destructive-guards.md`

