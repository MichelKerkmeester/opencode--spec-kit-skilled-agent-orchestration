---
title: "ClickUp MCP Orchestrator: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the mcp-clickup skill."
---

# ClickUp MCP Orchestrator: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real against ClickUp CLI or ClickUp MCP via Code Mode. The only acceptable classifications are PASS, FAIL, or SKIP with a specific blocker such as missing credentials, missing ClickUp CLI, or no disposable test workspace.

This document combines the manual-validation contract for the `mcp-clickup` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while the per-feature files carry scenario-specific execution truth.

Current-tree source note: `.opencode/skill/mcp-clickup/SKILL.md` is absent in this checkout. Scenario behavior is grounded in the historical skill and references from commit `7cead37e64c9fa25bf5b734d0549bddb416e84b2`, plus the current `mcp-code-mode` skill for Code Mode invocation syntax.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--authentication-and-setup/`
- `02--read-operations/`
- `03--write-operations/`
- `04--comments-and-threads/`
- `05--integration-patterns/`
- `06--recovery-and-safety/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. AUTHENTICATION AND SETUP](#7--authentication-and-setup)
- [8. READ OPERATIONS](#8--read-operations)
- [9. WRITE OPERATIONS](#9--write-operations)
- [10. COMMENTS AND THREADS](#10--comments-and-threads)
- [11. INTEGRATION PATTERNS](#11--integration-patterns)
- [12. RECOVERY AND SAFETY](#12--recovery-and-safety)
- [13. AUTOMATED TEST CROSS-REFERENCE](#13--automated-test-cross-reference)
- [14. FEATURE CATALOG CROSS-REFERENCE INDEX](#14--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 12 deterministic scenarios across 6 categories validating the documented `mcp-clickup` surface: ClickUp CLI (`cu`) for daily task operations, and ClickUp MCP via Code Mode for bulk, comments, custom fields, and enterprise workflows.

Coverage note (2026-04-30): the current checkout does not contain the parent `mcp-clickup` skill or feature catalog. The scenario set therefore uses documented historical skill behavior and current `mcp-code-mode` invocation rules, and marks the missing current parent skill as a release blocker.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator chooses `cu` for single task, sprint, standup, and normal CRUD operations.
3. The orchestrator chooses Code Mode for ClickUp MCP operations that require bulk, comments lifecycle, custom fields, docs, goals, webhooks, or time entries.
4. The operator captures command transcripts, sanitized IDs, expected signals, cleanup proof, and a PASS/FAIL/SKIP verdict.

### What Each Feature File Explains

- The realistic user request that should trigger the behavior
- The RCAF prompt that should drive the manual execution
- The exact command sequence and expected signals
- The evidence required for a reproducible verdict
- The source anchors used to justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root.
2. A disposable ClickUp workspace, space, and list are available. Never run mutation scenarios against production-only lists.
3. `CLICKUP_PLAYBOOK_TEST_SPACE_ID` and `CLICKUP_PLAYBOOK_TEST_LIST_ID` are set for scenarios that require live IDs.
4. ClickUp CLI is installed for CLI scenarios: `npm install -g @krodak/clickup-cli`; Node.js is version 22 or newer.
5. ClickUp CLI is initialized with `cu init` and `cu auth` succeeds.
6. Code Mode is configured for MCP scenarios and can discover the `clickup` manual.
7. ClickUp MCP credentials are available using the documented Code Mode prefix: `CODEMODE_CLICKUP_API_KEY` and `CODEMODE_CLICKUP_TEAM_ID`.
8. Destructive scenarios CLU-006, CLU-007, CLU-011, and CLU-012 MUST create fresh throwaway tasks and prove cleanup.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript with timestamps where available
- User request used
- RCAF prompt used
- Environment preflight with secrets redacted
- Output snippets showing task IDs, list IDs, or object IDs with sensitive values redacted
- Cleanup proof for mutation and destructive scenarios
- Final user-facing response or outcome summary
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- CLI commands shown as `cu <subcommand> [args]`.
- MCP tool calls shown through Code Mode as `call_tool_chain({ code: "..." })`.
- ClickUp MCP calls use the documented Code Mode pattern: `clickup.clickup_<tool_name>({...})`.
- `->` separates sequential steps.
- Operators may replace environment variable values, but must not change scenario intent.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete, readable, and redacted.
5. Cleanup proof exists for every mutation scenario.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence is incomplete
- `FAIL`: expected behavior missing, contradictory output, cleanup failed, or a critical check failed
- `SKIP`: external dependency missing, with exact blocker documented

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. CLU-001, CLU-002, CLU-003, CLU-006, and CLU-010 are `PASS` or have documented external SKIP blockers.
3. `COVERED_FEATURES == TOTAL_FEATURES == 12`.
4. No unresolved cleanup item remains in ClickUp.
5. The parent skill exists in the current tree or the release explicitly accepts the current-tree absence.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Operational Rules

1. Run read-only CLI checks before any mutation scenarios.
2. Reserve one operator to track live ClickUp IDs and cleanup status.
3. Run mutation scenarios serially unless each worker has a distinct test list.
4. Run MCP scenarios through Code Mode rather than direct MCP calls.
5. Save transcripts outside the repository unless a spec folder explicitly requests evidence artifacts.

### Recommended Wave Plan

- **Wave 1, setup and reads**: CLU-001..CLU-005.
- **Wave 2, CLI mutations**: CLU-006..CLU-008.
- **Wave 3, Code Mode MCP**: CLU-009..CLU-011.
- **Wave 4, recovery and safety**: CLU-012.

---

## 7. AUTHENTICATION AND SETUP

This category validates install health, `cu` identity, and ClickUp authentication.

### CLU-001 | CLI INSTALL AND VERSION

Prompt summary: As a ClickUp manual-testing orchestrator, verify the `cu` binary is the ClickUp CLI, not system UUCP, and confirm the installed CLI can print version/help output.

Expected signals: `command -v cu` resolves, `cu --version` does not mention Taylor UUCP, and `cu --help` exits 0.

> **Feature File:** [CLU-001](01--authentication-and-setup/001-cli-install-and-version.md)

### CLU-002 | CLI AUTHENTICATION

Prompt summary: As a ClickUp manual-testing orchestrator, verify `cu auth` can reach ClickUp with the configured token and returns an authenticated workspace/user signal.

Expected signals: `cu auth` exits 0 and does not print token, 401, or missing configuration errors.

> **Feature File:** [CLU-002](01--authentication-and-setup/002-cli-authentication.md)

---

## 8. READ OPERATIONS

This category validates workspace discovery and read-only task views.

### CLU-003 | SPACE AND LIST DISCOVERY

Prompt summary: As a ClickUp manual-testing orchestrator, list spaces, then list lists inside a known test space, and verify the configured test list is present.

Expected signals: `cu spaces` returns a non-empty space table and `cu lists "$CLICKUP_PLAYBOOK_TEST_SPACE_ID"` includes the test list.

> **Feature File:** [CLU-003](02--read-operations/001-space-and-list-discovery.md)

### CLU-004 | TASK SEARCH AND DETAIL

Prompt summary: As a ClickUp manual-testing orchestrator, search for a known test task and fetch its task detail using the returned task ID.

Expected signals: `cu search` returns at least one task and `cu task <id>` returns matching name/status fields.

> **Feature File:** [CLU-004](02--read-operations/002-task-search-and-detail.md)

### CLU-005 | SPRINT AND STANDUP SUMMARY

Prompt summary: As a ClickUp manual-testing orchestrator, run the sprint and summary commands and verify they return readable current-work signals or an explicit no-sprint message.

Expected signals: `cu sprint` and `cu summary` exit cleanly with task rows, standup text, or a clear no-active-sprint response.

> **Feature File:** [CLU-005](02--read-operations/003-sprint-and-standup-summary.md)

---

## 9. WRITE OPERATIONS

This category validates CLI task creation, update, and cleanup using disposable tasks only.

### CLU-006 | CREATE READ DELETE ROUND TRIP

Prompt summary: As a ClickUp manual-testing orchestrator, create a throwaway CLI task in the test list, read it back, then delete it with `--confirm`.

Expected signals: create returns a task ID, task detail returns the same name, and delete exits 0 with cleanup proof.

> **Feature File:** [CLU-006](03--write-operations/001-create-read-delete-round-trip.md)

### CLU-007 | UPDATE STATUS AND TAG

Prompt summary: As a ClickUp manual-testing orchestrator, create a throwaway task, update its status and tags, verify the updates, then delete it.

Expected signals: `cu update` and `cu tag` exit 0 and `cu task <id>` reflects the updated status/tag before cleanup.

> **Feature File:** [CLU-007](03--write-operations/002-update-status-and-tag.md)

---

## 10. COMMENTS AND THREADS

This category validates CLI comments and MCP comment lifecycle behavior.

### CLU-008 | CLI COMMENT ROUND TRIP

Prompt summary: As a ClickUp manual-testing orchestrator, add a comment to a throwaway task with `cu comment`, then verify it appears in `cu comments`.

Expected signals: comment command exits 0 and comments output includes the exact test marker.

> **Feature File:** [CLU-008](04--comments-and-threads/001-cli-comment-round-trip.md)

### CLU-009 | MCP COMMENT LIFECYCLE

Prompt summary: As a ClickUp manual-testing orchestrator, use Code Mode to create, read, update, and delete a ClickUp comment through `clickup_manage_comments`.

Expected signals: Code Mode returns a created comment ID, updated text, and delete success for the same comment.

> **Feature File:** [CLU-009](04--comments-and-threads/002-mcp-comment-lifecycle.md)

---

## 11. INTEGRATION PATTERNS

This category validates Code Mode discovery, naming, and multi-step MCP workflows.

### CLU-010 | CODE MODE TOOL DISCOVERY

Prompt summary: As a ClickUp manual-testing orchestrator, discover ClickUp MCP tools through Code Mode and verify the calling syntax uses `clickup.clickup_<tool_name>`.

Expected signals: discovery returns ClickUp task tools and tool info confirms callable names like `clickup.clickup_create_task`.

> **Feature File:** [CLU-010](05--integration-patterns/001-code-mode-tool-discovery.md)

### CLU-011 | MCP BULK TASK WORKFLOW

Prompt summary: As a ClickUp manual-testing orchestrator, use Code Mode to bulk-create two throwaway tasks, read them back, and delete them.

Expected signals: bulk create returns two task IDs, both tasks are readable, and both are cleaned up.

> **Feature File:** [CLU-011](05--integration-patterns/002-mcp-bulk-task-workflow.md)

---

## 12. RECOVERY AND SAFETY

This category validates documented recovery behavior and destructive-operation guard rails.

### CLU-012 | ENV PREFIX AND DESTRUCTIVE GUARDS

Prompt summary: As a ClickUp manual-testing orchestrator, verify missing Code Mode ClickUp env vars fail clearly and verify CLI delete refuses to run without `--confirm`.

Expected signals: MCP preflight reports missing `CODEMODE_CLICKUP_*` values when absent and `cu delete <id>` without `--confirm` refuses destructive deletion.

> **Feature File:** [CLU-012](06--recovery-and-safety/001-env-prefix-and-destructive-guards.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

No automated tests are currently attached to the `mcp-clickup` skill in this checkout because the parent skill directory is absent. Manual coverage is the current source of truth for CLU-001..CLU-012.

| Scenario | Automated Coverage |
|---|---|
| CLU-001..CLU-012 | Manual only |

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

No current-tree `.opencode/skill/mcp-clickup/feature_catalog/` directory exists. The scenarios map to documented historical skill capabilities instead.

| Scenario | Capability Source |
|---|---|
| CLU-001..CLU-002 | Historical `SKILL.md` install/auth and `references/cli_reference.md` |
| CLU-003..CLU-008 | Historical `references/cli_reference.md` |
| CLU-009..CLU-011 | Historical `references/tool_reference.md` plus current `mcp-code-mode/SKILL.md` |
| CLU-012 | Historical `SKILL.md` recovery notes and CLI delete contract |
