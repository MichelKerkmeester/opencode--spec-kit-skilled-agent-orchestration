---
title: "CM-025 -- Partial-chain rollback"
description: "This scenario validates the partial-chain rollback contract for `CM-025`. It focuses on confirming a chain that creates a ClickUp task then fails on a follow-up call leaves the task created (no automatic rollback) and is recoverable via manual cleanup."
---

# CM-025 -- Partial-chain rollback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-025`.

---

## 1. OVERVIEW

This scenario validates the partial-chain rollback contract for `CM-025`. It focuses on confirming the actual contract: Code Mode does NOT auto-rollback completed tool calls when a later call in the chain fails. Operators get the failure error AND any partial state created — and must clean up explicitly.

### Why This Matters

Operators new to chains often assume transactional semantics ("if step 3 fails, steps 1-2 are rolled back"). This is false; chains are best-effort sequential, not atomic. Documenting the actual behavior with a recovery pattern (catch the failure, get the partial-state id, delete) is the only way to make this safe.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-025` and confirm the expected signals without contradictory evidence.

- Objective: Verify that a chain creating a ClickUp task then deliberately failing on the next call (a) returns the failure error, (b) leaves the task created (verifiable by `clickup_get_task`), and (c) the task can be deleted manually.
- Real user request: `"What happens if my chain partially fails — does it roll back?"` (educational scenario)
- Prompt: `As a manual-testing orchestrator, run a chain that creates a ClickUp task then deliberately fails on the next call, then verify the task exists, then delete it through Code Mode against the live ClickUp API. Verify the create succeeded, the follow-up failed, and manual cleanup works. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: chain with create + deliberately-failing call (e.g., invalid task_id update); separate verify call; explicit delete.
- Expected signals: chain returns object with `created_task_id` and `error`; `clickup_get_task({id})` returns the task; `clickup_delete_task({id})` succeeds.
- Desired user-visible outcome: A short report stating the contract (no auto-rollback) and confirming explicit cleanup with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the create was rolled back automatically (contract changed; documentation needs update), or cleanup fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run a chain that creates a ClickUp task then deliberately fails on the next call, then verify the task exists, then delete it through Code Mode against the live ClickUp API. Verify the create succeeded, the follow-up failed, and manual cleanup works. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Confirm `TEST_LIST_ID` is set
2. `call_tool_chain({ code: "const created = await clickup.clickup_create_task({ list_id: '${TEST_LIST_ID}', name: 'CM-025 partial-rollback test' }); let error = null; try { await clickup.clickup_update_task({ task_id: 'INVALID_ID', status: 'done' }); } catch (e) { error = e.message; } return { created_task_id: created.id, error };" })`
3. `call_tool_chain({ code: "return await clickup.clickup_get_task({ task_id: '${created_task_id}' });" })` (substitute `created_task_id` from step 2)
4. `call_tool_chain({ code: "return await clickup.clickup_delete_task({ task_id: '${created_task_id}' });" })`

### Expected

- Step 2: returns object with `created_task_id` (non-empty) and `error` (non-null)
- Step 3: returns task object whose `id` matches the created id (proves task survived failure)
- Step 4: delete succeeds

### Evidence

Capture step 2's `created_task_id` + `error`, step 3's task object, step 4's delete confirmation.

### Pass / Fail

- **Pass**: Task created, follow-up failed, task exists in step 3, cleanup succeeds.
- **Fail**: Task auto-rolled-back (no longer in step 3 — contract changed); cleanup fails (orphaned task).

### Failure Triage

1. If task missing in step 3: Code Mode added auto-rollback semantics — update playbook to reflect new contract.
2. If cleanup fails: manually delete via ClickUp web UI; check token has delete-task permission.
3. If `error` is null: the deliberately-failing call somehow succeeded (`INVALID_ID` may have matched an actual id); choose a more clearly-invalid pattern.

### Optional Supplemental Checks

- Add 3 creates before the failing call; verify all 3 survive — confirms cumulative non-rollback behavior.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | call_tool_chain semantics |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/005-partial-chain-rollback.md`
