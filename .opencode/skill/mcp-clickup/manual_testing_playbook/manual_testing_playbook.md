---
title: "MCP ClickUp: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the mcp-clickup skill."
---

# MCP ClickUp: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `mcp-clickup` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while per-feature files carry the scenario-specific execution truth. ClickUp is the project-management surface for OpenCode; the CLI (`cu`) is the primary interface for fast read/write operations and CLI-only features (sprint, summary), while the MCP `clickup` manual (accessed via Code Mode — see CM-005..CM-008 for the manual-namespace and env-var prefixing contracts, and CM-011..CM-012 for sequential-chain and `Promise.all` parallel patterns) covers enterprise features (documents, goals, webhooks, time tracking) and bulk operations.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-cu-install-and-auth/`
- `02--discovery-and-readonly/`
- `03--task-mutation-cli/`
- `04--mcp-bulk-and-fields/`
- `05--mcp-enterprise/`
- `06--recovery-and-rate-limits/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI CU INSTALL AND AUTH](#7--cli-cu-install-and-auth)
- [8. DISCOVERY AND READONLY](#8--discovery-and-readonly)
- [9. TASK MUTATION CLI](#9--task-mutation-cli)
- [10. MCP BULK AND FIELDS](#10--mcp-bulk-and-fields)
- [11. MCP ENTERPRISE](#11--mcp-enterprise)
- [12. RECOVERY AND RATE LIMITS](#12--recovery-and-rate-limits)
- [13. AUTOMATED TEST CROSS-REFERENCE](#13--automated-test-cross-reference)
- [14. FEATURE FILE INDEX](#14--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 25 deterministic scenarios across 6 categories validating the `mcp-clickup` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and feature-file reference.

### Realistic Test Model

1. A realistic operator request is given to an orchestrator (e.g., "create a ClickUp task and assign it to me").
2. The orchestrator decides whether to call `cu` directly (sequential, faster, lower-overhead) or invoke the `clickup` manual via Code Mode (enterprise features, bulk operations, parallelism).
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned data (task object, doc, time entry) is correct.

---

## 2. GLOBAL PRECONDITIONS

- Working directory is project root containing `.utcp_config.json` and `.env`.
- Node.js >= 22 is installed and resolvable via `node --version` (required by `@krodak/clickup-cli`).
- The `cu` CLI is installed and resolvable: `command -v cu` returns a path under the npm prefix (NOT the system UUCP path).
- `cu --version 2>&1 | head -1` shows ClickUp, NOT "Taylor UUCP". If UUCP is on PATH first, fix per CU-002.
- `clickup_CLICKUP_API_KEY=pk_xxx` and `clickup_CLICKUP_TEAM_ID=xxx` are present in `.env` with the `clickup_` prefix (per CM-008..CM-010 env-var prefixing contract).
- A throwaway test workspace, space, and list ID are available for mutation scenarios; do NOT run mutation scenarios against production data.
- Destructive scenario CU-026 (`cu delete <id> --confirm` guard) MUST run only against a freshly created throwaway task; never against a real task referenced by another team member.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript for CLI scenarios (including `cu` exit codes and full stdout/stderr).
- Tool-call transcript for MCP scenarios including `code` argument when calling `call_tool_chain`.
- The user request that triggered the orchestration flow.
- The exact orchestrator prompt (verbatim).
- Key observable outputs: task IDs (REDACTED if from production), API response status, env-var values (REDACTED), error messages, retry-after headers.
- Final user-facing outcome and PASS / PARTIAL / FAIL verdict.
- For destructive scenarios, evidence of cleanup (deleted-task confirmation, restored config).
- For rate-limit scenarios (CU-025), capture the 429 response and retry-after header value.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands are shown as `cu <subcommand> [args]` (e.g., `cu spaces`, `cu create -n "name" -l <listId>`).
- MCP tool calls are shown as `clickup.clickup_<tool>({ ... })` per the manual-namespace contract (see CM-005..CM-007).
- TypeScript snippets inside `call_tool_chain` shown verbatim within the `code` argument.
- Bash steps shown as `bash: <command>`.
- `->` separates sequential steps.
- Placeholders like `<task_id>`, `<list_id>`, `<space_id>` MUST be resolved before execution and the actual value captured in evidence.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when preconditions, prompt, commands, expected signals, and evidence all line up.
- A feature is PASS only when every mapped scenario is PASS.
- Release is READY only when all critical scenarios pass, coverage is complete, and no blocking triage item remains.
- Critical-path scenarios for ClickUp: CU-001 (install + version with UUCP guard), CU-003 (`cu auth` token works against live API), CU-005 (`cu spaces` smoke), CU-027 (env-var prefix mismatch). A FAIL on any of these blocks release.
- Keep feature-specific caveats in linked feature files instead of duplicating them in the root.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- **Wave 1 (install + auth, parallel-safe)**: CU-001 install + version check, CU-002 system-cu (UUCP) conflict, CU-003 `cu auth` live token, CU-004 `cu init` interactive setup. Run sequentially within the wave because they share PATH and `.cu` config state.
- **Wave 2 (read-only discovery)**: CU-005..CU-010 — listing spaces, lists, tasks, task detail, sprint, summary. Parallel-safe; do not mutate state.
- **Wave 3 (CLI mutation)**: CU-011..CU-016 — create, update status, comment, assign, tag, move. Use a throwaway test list; capture every created task ID for cleanup.
- **Wave 4 (MCP bulk + enterprise + recovery, mixed)**: CU-017..CU-019 (MCP bulk + custom fields), CU-020..CU-023 (MCP-only enterprise: docs, goals, webhooks, time tracking), CU-024..CU-027 (recovery: missing token, 429 retry, destructive delete guard, env-prefix mismatch). Isolate the destructive scenario CU-026 from others; verify cleanup after each.
- After each wave, save evidence and rotate orchestrator context before the next wave.
- Pre-assign explicit scenario IDs to each wave before execution.

---

## 7. CLI CU INSTALL AND AUTH

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-001 | Install + version check (verify ClickUp, not UUCP)

#### Description
Verify `cu` is installed and `cu --version` returns the ClickUp CLI version, NOT "Taylor UUCP".

#### Current Reality
Prompt summary: As a manual-testing orchestrator, confirm cu is installed and reports its version through the cu CLI against the local install. Verify command -v cu returns a path under the npm prefix and cu --version 2>&1 | head -1 shows ClickUp, not Taylor UUCP. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `command -v cu` returns a non-empty path; Step 2: `cu --version 2>&1 | head -1` returns a string mentioning ClickUp (and does NOT contain "Taylor UUCP"); Step 3: the resolved path is under `$(npm config get prefix)/bin`.

#### Test Execution
> **Feature File:** [CU-001](01--cli-cu-install-and-auth/001-install-version-check.md)

### CU-002 | system-cu (UUCP) conflict detection + PATH fix

#### Description
Verify the operator can detect when system `cu` (Taylor UUCP) shadows the ClickUp CLI on PATH and apply the documented PATH fix.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, detect a system-cu (UUCP) conflict and apply the npm-bin-first PATH fix through the shell environment against the local install. Verify the PATH change moves the ClickUp cu ahead of UUCP and a fresh shell sees the ClickUp version. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `which -a cu` lists at least one entry; Step 2: if the first entry is UUCP, `cu --version 2>&1 | head -1` shows "Taylor UUCP"; Step 3: after `export PATH="$(npm config get prefix)/bin:$PATH"` in a fresh shell, `cu --version` shows ClickUp.

#### Test Execution
> **Feature File:** [CU-002](01--cli-cu-install-and-auth/002-system-cu-uucp-conflict.md)

### CU-003 | `cu auth` — verify token works against live API

#### Description
Verify `cu auth` confirms the configured ClickUp token is valid against the live ClickUp API.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, verify the configured ClickUp token works through the cu CLI against the live ClickUp API. Verify cu auth exits 0 and reports authenticated identity. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu auth 2>&1` exits 0; Step 2: stdout names the authenticated user or workspace; Step 3: no "401" or "invalid token" string appears in output.

#### Test Execution
> **Feature File:** [CU-003](01--cli-cu-install-and-auth/003-cu-auth-live-token.md)

### CU-004 | `cu init` — interactive setup walkthrough

#### Description
Verify `cu init` walks the operator through ClickUp token + team-ID configuration and writes a usable config file.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, walk through cu init with a fresh config slot through the cu CLI against the local config directory. Verify the resulting config lets a follow-up cu spaces succeed. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu init` prompts for token and team ID; Step 2: after completion, the config file (per CLI docs) exists and contains the supplied values (REDACTED in evidence); Step 3: `cu spaces` immediately after exits 0.

#### Test Execution
> **Feature File:** [CU-004](01--cli-cu-install-and-auth/004-cu-init-interactive-setup.md)

---

## 8. DISCOVERY AND READONLY

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-005 | `cu spaces` — list workspace spaces

#### Description
Verify `cu spaces` returns the spaces in the configured workspace.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list workspace spaces through the cu CLI against the configured ClickUp workspace. Verify the response is non-empty and each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu spaces` exits 0; Step 2: output contains one or more space rows with `id` and `name`; Step 3: at least one space ID can be used as the input to CU-006.

#### Test Execution
> **Feature File:** [CU-005](02--discovery-and-readonly/001-cu-spaces.md)

### CU-006 | `cu lists <spaceId>` — list space lists

#### Description
Verify `cu lists <spaceId>` returns the lists inside the supplied space.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list the lists inside a known space through the cu CLI against the configured ClickUp workspace. Verify each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu lists <spaceId>` exits 0; Step 2: output contains zero or more list rows with `id` and `name`; Step 3: an empty result is acceptable for empty spaces, not a failure.

#### Test Execution
> **Feature File:** [CU-006](02--discovery-and-readonly/002-cu-lists-space.md)

### CU-007 | `cu tasks` — my open tasks

#### Description
Verify `cu tasks` returns the operator's open tasks across the configured workspace.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list my open ClickUp tasks through the cu CLI against the configured workspace. Verify the response lists task ids, names, and statuses. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu tasks` exits 0; Step 2: output rows include task `id`, `name`, and `status`; Step 3: at least one open task or an explicit "no open tasks" message.

#### Test Execution
> **Feature File:** [CU-007](02--discovery-and-readonly/003-cu-tasks-my-open.md)

### CU-008 | `cu task <id>` — task detail JSON

#### Description
Verify `cu task <id>` returns the full task detail for a known task ID.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, fetch task detail for a known task id through the cu CLI against the configured workspace. Verify the response includes name, status, assignees, and list_id. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu task <id>` exits 0; Step 2: output includes `name`, `status`, `assignees`, `list_id`; Step 3: the returned `id` matches the requested id.

#### Test Execution
> **Feature File:** [CU-008](02--discovery-and-readonly/004-cu-task-detail.md)

### CU-009 | `cu sprint` — current sprint tasks

#### Description
Verify `cu sprint` returns the tasks in the active sprint (if a sprint is configured).

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list tasks in the current sprint through the cu CLI against the configured workspace. Verify the response is either a non-empty task list or an explicit no-active-sprint message. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu sprint` exits 0; Step 2: output is either a list of sprint tasks (each with `id`, `name`, `status`) or an explicit "no active sprint" message; Step 3: no auth error.

#### Test Execution
> **Feature File:** [CU-009](02--discovery-and-readonly/005-cu-sprint.md)

### CU-010 | `cu summary` — sprint standup summary (CLI-only feature)

#### Description
Verify `cu summary` produces a sprint standup summary. This is a CLI-only feature — there is no MCP equivalent.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, generate a sprint standup summary through the cu CLI against the configured workspace. Verify the response groups tasks by status or assignee in a standup-friendly form. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu summary` exits 0; Step 2: output is non-empty and groups tasks by status, assignee, or sprint section; Step 3: this functionality is absent from the `clickup` MCP tool list (CLI-exclusive feature).

#### Test Execution
> **Feature File:** [CU-010](02--discovery-and-readonly/006-cu-summary-standup.md)

---

## 9. TASK MUTATION CLI

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract. Every scenario in this category MUST run against a throwaway test list and capture the created task IDs for cleanup.

### CU-011 | `cu create -n "name" -l <listId>` — create task

#### Description
Verify `cu create -n "name" -l <listId>` creates a new task in the named list and returns the task id.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create a throwaway test task through the cu CLI against a designated test list. Verify the returned task id can be re-fetched with cu task. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu create -n "CU-011 throwaway" -l <listId>` exits 0; Step 2: output includes a new task `id`; Step 3: `cu task <id>` immediately after returns the same name.

#### Test Execution
> **Feature File:** [CU-011](03--task-mutation-cli/001-cu-create-task.md)

### CU-012 | `cu update <id> --status "done"` — update status

#### Description
Verify `cu update <id> --status "done"` (or a list-valid status) updates a task's status.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, update a throwaway task's status through the cu CLI against a designated test list. Verify cu task afterwards shows the new status. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu update <id> --status "<list-valid-status>"` exits 0; Step 2: `cu task <id>` shows the new status string; Step 3: no "invalid status" error.

#### Test Execution
> **Feature File:** [CU-012](03--task-mutation-cli/002-cu-update-status.md)

### CU-013 | `cu comment <id> -m "text"` — post comment

#### Description
Verify `cu comment <id> -m "text"` posts a comment to the named task.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, post a comment on a throwaway task through the cu CLI against a designated test list. Verify cu comments <id> shows the new comment. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu comment <id> -m "CU-013 comment"` exits 0; Step 2: `cu comments <id>` includes a comment whose body contains "CU-013 comment"; Step 3: comment author matches the authenticated identity.

#### Test Execution
> **Feature File:** [CU-013](03--task-mutation-cli/003-cu-comment-task.md)

### CU-014 | `cu assign <id> --to me` — assign task

#### Description
Verify `cu assign <id> --to me` assigns the task to the authenticated user.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, assign a throwaway task to me through the cu CLI against a designated test list. Verify cu task afterwards lists the authenticated user as assignee. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu assign <id> --to me` exits 0; Step 2: `cu task <id>` lists the authenticated user in `assignees`; Step 3: no permission error.

#### Test Execution
> **Feature File:** [CU-014](03--task-mutation-cli/004-cu-assign-task.md)

### CU-015 | `cu tag <id> --add "label1,label2"` — add tags

#### Description
Verify `cu tag <id> --add "label1,label2"` adds the comma-separated tag list to the task.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, add tags to a throwaway task through the cu CLI against a designated test list. Verify cu task afterwards lists the new tags. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu tag <id> --add "bug,frontend"` exits 0; Step 2: `cu task <id>` lists `bug` and `frontend` in `tags`; Step 3: pre-existing tags are preserved (additive).

#### Test Execution
> **Feature File:** [CU-015](03--task-mutation-cli/005-cu-tag-task.md)

### CU-016 | `cu move <id> --to <listId>` — move task

#### Description
Verify `cu move <id> --to <listId>` moves the task to a different list.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, move a throwaway task between two test lists through the cu CLI against a designated test space. Verify cu task afterwards shows the new list_id. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu move <id> --to <destListId>` exits 0; Step 2: `cu task <id>` shows `list_id` equal to `<destListId>`; Step 3: the task no longer appears in the source list (`cu lists <spaceId>` follow-up confirms).

#### Test Execution
> **Feature File:** [CU-016](03--task-mutation-cli/006-cu-move-task.md)

---

## 10. MCP BULK AND FIELDS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. Every scenario routes via Code Mode `call_tool_chain` and references CM-011 (sequential chain) and CM-012 (`Promise.all` parallel) for the orchestration patterns.

### CU-017 | `clickup.clickup_create_bulk_tasks` — bulk create 5 tasks

#### Description
Verify `clickup.clickup_create_bulk_tasks` creates 5 throwaway tasks in a single tool call. Cross-references CM-011 (sequential chain) and CM-012 (Promise.all parallel) when used as part of a wider workflow.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create 5 throwaway test tasks in a designated test list using clickup.clickup_create_bulk_tasks through Code Mode against the live ClickUp API. Verify the response contains 5 task ids and each can be re-fetched. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for the multi-tool workflow patterns this builds on. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: tool call returns an array of 5 task objects with `id`; Step 2: each task is fetchable via `clickup.clickup_get_task({task_id})`; Step 3: all 5 are deletable in a follow-up cleanup call.

#### Test Execution
> **Feature File:** [CU-017](04--mcp-bulk-and-fields/001-mcp-bulk-create-tasks.md)

### CU-018 | `clickup.clickup_update_bulk_tasks` — bulk update

#### Description
Verify `clickup.clickup_update_bulk_tasks` updates the status of multiple throwaway tasks in one tool call. Cross-references CM-011 (sequential chain) and CM-012 (Promise.all parallel).

#### Current Reality
Prompt summary: As a manual-testing orchestrator, bulk-update the status of 5 throwaway tasks (created by CU-017) using clickup.clickup_update_bulk_tasks through Code Mode against the live ClickUp API. Verify each task's status reflects the new value. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for orchestration of multi-task updates. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: tool call returns success for all 5; Step 2: `clickup.clickup_get_task({task_id})` for each shows the new status; Step 3: no partial-failure silent skip — any failure must be enumerated in the response.

#### Test Execution
> **Feature File:** [CU-018](04--mcp-bulk-and-fields/002-mcp-bulk-update-tasks.md)

### CU-019 | `clickup.clickup_manage_custom_fields` — custom field CRUD

#### Description
Verify `clickup.clickup_manage_custom_fields` can create, read, update, and delete a custom field on a list.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create then update then delete a custom field on a designated test list using clickup.clickup_manage_custom_fields through Code Mode against the live ClickUp API. Verify all four operations succeed. Cross-reference: CM-011 (sequential chain) for the chained CRUD pattern. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: create returns a field `id`; Step 2: read returns the same field with the supplied name and type; Step 3: update reflects the change on subsequent read; Step 4: delete returns success and field is no longer listed.

#### Test Execution
> **Feature File:** [CU-019](04--mcp-bulk-and-fields/003-mcp-custom-fields-crud.md)

---

## 11. MCP ENTERPRISE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract. All four scenarios test MCP-only features that have no CLI equivalent.

### CU-020 | `clickup.clickup_create_document` — create doc with markdown body (MCP-only feature)

#### Description
Verify `clickup.clickup_create_document` creates a ClickUp document with a markdown body. This is an MCP-only feature with no `cu` CLI equivalent.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create a throwaway ClickUp document with a markdown body using clickup.clickup_create_document through Code Mode against the live ClickUp API. Verify the doc id can be re-fetched and the body matches. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: tool call returns a doc `id` and `name`; Step 2: a follow-up read returns the same body markdown; Step 3: this functionality is absent from the `cu` CLI command list (MCP-exclusive feature).

#### Test Execution
> **Feature File:** [CU-020](05--mcp-enterprise/001-mcp-create-document.md)

### CU-021 | `clickup.clickup_manage_goals` — goal CRUD (MCP-only)

#### Description
Verify `clickup.clickup_manage_goals` can create, read, and delete a ClickUp goal. This is an MCP-only feature with no `cu` CLI equivalent.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create then read then delete a throwaway ClickUp goal using clickup.clickup_manage_goals through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: create returns a goal `id`; Step 2: read returns the same goal with supplied name and target; Step 3: delete returns success and goal is no longer listed; Step 4: this functionality is absent from the `cu` CLI command list (MCP-exclusive feature).

#### Test Execution
> **Feature File:** [CU-021](05--mcp-enterprise/002-mcp-manage-goals.md)

### CU-022 | `clickup.clickup_manage_webhooks` — webhook CRUD (MCP-only)

#### Description
Verify `clickup.clickup_manage_webhooks` can register, read, and delete a webhook. This is an MCP-only feature with no `cu` CLI equivalent.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, register then read then delete a throwaway webhook using clickup.clickup_manage_webhooks through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: register returns a webhook `id` and `endpoint`; Step 2: read returns the same webhook; Step 3: delete returns success and webhook is no longer listed; Step 4: this functionality is absent from the `cu` CLI command list (MCP-exclusive feature).

#### Test Execution
> **Feature File:** [CU-022](05--mcp-enterprise/003-mcp-manage-webhooks.md)

### CU-023 | `clickup.clickup_manage_time_entries` — time tracking CRUD (MCP-only)

#### Description
Verify `clickup.clickup_manage_time_entries` can create, read, and delete a time entry on a task. This is an MCP-only feature with no `cu` CLI equivalent.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create then read then delete a throwaway time entry on a test task using clickup.clickup_manage_time_entries through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: create returns a time entry `id` referencing the task; Step 2: read returns the same time entry with supplied duration; Step 3: delete returns success and entry is no longer listed for that task; Step 4: this functionality is absent from the `cu` CLI command list (MCP-exclusive feature).

#### Test Execution
> **Feature File:** [CU-023](05--mcp-enterprise/004-mcp-manage-time-entries.md)

---

## 12. RECOVERY AND RATE LIMITS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-024 | Missing token → 401 auth error path

#### Description
Verify that an unset / invalid ClickUp token produces a clear 401 auth error from `cu`.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, deliberately invalidate the configured ClickUp token then call cu spaces through the cu CLI against the live ClickUp API. Verify the error names auth or 401. Restore the token after. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: `cu spaces 2>&1` exits non-zero; Step 2: stderr contains "401" or "auth" or "invalid token"; Step 4: after restoring the valid token, `cu spaces` succeeds again.

#### Test Execution
> **Feature File:** [CU-024](06--recovery-and-rate-limits/001-missing-token-401.md)

### CU-025 | 429 rate-limit retry behavior

#### Description
Verify that hitting the ClickUp rate limit (429) produces a clear error with the retry-after header surfaced.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, drive the ClickUp API to a 429 by issuing rapid back-to-back requests through Code Mode against the live ClickUp API. Verify the response surfaces the 429 status and the retry-after header value. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: a tight loop of `clickup.clickup_get_teams({})` calls eventually returns a 429 response; Step 2: response includes a retry-after-seconds value; Step 3: waiting for the retry-after window and re-issuing succeeds.

#### Test Execution
> **Feature File:** [CU-025](06--recovery-and-rate-limits/002-rate-limit-429-retry.md)

### CU-026 | Destructive `cu delete <id> --confirm` guard **(DESTRUCTIVE)**

#### Description
Verify `cu delete <id>` without `--confirm` refuses to delete and that `cu delete <id> --confirm` actually deletes a throwaway task. MUST run only against a freshly created throwaway task.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, attempt cu delete <id> first without --confirm and then with --confirm against a freshly created throwaway task through the cu CLI against the live ClickUp API. Verify the unconfirmed call refuses and the confirmed call deletes. NEVER run this scenario against real data. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `cu create -n "CU-026 throwaway" -l <testListId>` returns a new task `id`; Step 2: `cu delete <id>` without `--confirm` exits non-zero or refuses; Step 3: `cu delete <id> --confirm` exits 0; Step 4: `cu task <id>` after deletion returns "not found" or 404.

#### Test Execution
> **Feature File:** [CU-026](06--recovery-and-rate-limits/003-destructive-delete-confirm.md)

### CU-027 | Env-prefix mismatch (`CLICKUP_API_KEY` vs `clickup_CLICKUP_API_KEY`)

#### Description
Verify that an unprefixed `CLICKUP_API_KEY` is NOT visible to the wrapped MCP server, while the prefixed `clickup_CLICKUP_API_KEY` is. Cross-references CM-008..CM-010 for the env-var prefixing contract.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, set only the unprefixed CLICKUP_API_KEY in .env, restart Code Mode, and call clickup.clickup_get_teams({}) through Code Mode against the live ClickUp API. Verify the call fails with a missing-credential error. Then add the prefixed clickup_CLICKUP_API_KEY and verify it succeeds. Cross-reference: CM-008 (prefixed env load), CM-009 (unprefixed env not found), CM-010 (validate_config script). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: with only `CLICKUP_API_KEY`, `clickup.clickup_get_teams({})` returns an auth error referencing missing/invalid API key; Step 4: after adding `clickup_CLICKUP_API_KEY` and restarting Code Mode, the same tool call returns workspace data; Step 5: `validate_config.py --check-env .env` (per CM-010) flags the missing prefixed key in the failing run.

#### Test Execution
> **Feature File:** [CU-027](06--recovery-and-rate-limits/004-env-prefix-mismatch.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `cu --version` (built-in CLI) | Install verification + UUCP guard | CU-001, CU-002 |
| `cu auth` (built-in CLI) | Live token validation | CU-003 |
| `.opencode/skill/mcp-code-mode/scripts/validate_config.py --check-env .env` | Env-var prefix presence | CU-027 (cross-references CM-010) |
| ClickUp API live (no dedicated unit harness) | Tool surface validation | All MCP scenarios |

> Note: most ClickUp behavior is exercised through the live ClickUp API (CLI or MCP), not through dedicated unit tests in the skill itself. The playbook scenarios serve as the primary regression surface. Cross-skill scenarios (CU-017..CU-019, CU-020..CU-023, CU-027) depend on the CM playbook for the manual-namespace, env-var-prefixing, and `call_tool_chain` contracts.

---

## 14. FEATURE FILE INDEX

### CLI CU INSTALL AND AUTH

- CU-001: [Install + version check](01--cli-cu-install-and-auth/001-install-version-check.md)
- CU-002: [system-cu (UUCP) conflict + PATH fix](01--cli-cu-install-and-auth/002-system-cu-uucp-conflict.md)
- CU-003: [`cu auth` live token](01--cli-cu-install-and-auth/003-cu-auth-live-token.md)
- CU-004: [`cu init` interactive setup](01--cli-cu-install-and-auth/004-cu-init-interactive-setup.md)

### DISCOVERY AND READONLY

- CU-005: [`cu spaces`](02--discovery-and-readonly/001-cu-spaces.md)
- CU-006: [`cu lists <spaceId>`](02--discovery-and-readonly/002-cu-lists-space.md)
- CU-007: [`cu tasks` my open](02--discovery-and-readonly/003-cu-tasks-my-open.md)
- CU-008: [`cu task <id>` detail](02--discovery-and-readonly/004-cu-task-detail.md)
- CU-009: [`cu sprint`](02--discovery-and-readonly/005-cu-sprint.md)
- CU-010: [`cu summary` standup (CLI-only)](02--discovery-and-readonly/006-cu-summary-standup.md)

### TASK MUTATION CLI

- CU-011: [`cu create` task](03--task-mutation-cli/001-cu-create-task.md)
- CU-012: [`cu update --status`](03--task-mutation-cli/002-cu-update-status.md)
- CU-013: [`cu comment`](03--task-mutation-cli/003-cu-comment-task.md)
- CU-014: [`cu assign --to me`](03--task-mutation-cli/004-cu-assign-task.md)
- CU-015: [`cu tag --add`](03--task-mutation-cli/005-cu-tag-task.md)
- CU-016: [`cu move --to`](03--task-mutation-cli/006-cu-move-task.md)

### MCP BULK AND FIELDS

- CU-017: [Bulk create 5 tasks](04--mcp-bulk-and-fields/001-mcp-bulk-create-tasks.md)
- CU-018: [Bulk update tasks](04--mcp-bulk-and-fields/002-mcp-bulk-update-tasks.md)
- CU-019: [Custom fields CRUD](04--mcp-bulk-and-fields/003-mcp-custom-fields-crud.md)

### MCP ENTERPRISE

- CU-020: [Create document (MCP-only)](05--mcp-enterprise/001-mcp-create-document.md)
- CU-021: [Manage goals (MCP-only)](05--mcp-enterprise/002-mcp-manage-goals.md)
- CU-022: [Manage webhooks (MCP-only)](05--mcp-enterprise/003-mcp-manage-webhooks.md)
- CU-023: [Manage time entries (MCP-only)](05--mcp-enterprise/004-mcp-manage-time-entries.md)

### RECOVERY AND RATE LIMITS

- CU-024: [Missing token → 401](06--recovery-and-rate-limits/001-missing-token-401.md)
- CU-025: [429 rate-limit retry](06--recovery-and-rate-limits/002-rate-limit-429-retry.md)
- CU-026: [Destructive delete --confirm guard **(DESTRUCTIVE)**](06--recovery-and-rate-limits/003-destructive-delete-confirm.md)
- CU-027: [Env-prefix mismatch](06--recovery-and-rate-limits/004-env-prefix-mismatch.md)
