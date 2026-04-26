---
title: "MCP Code Mode: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the mcp-code-mode skill."
---

# MCP Code Mode: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `mcp-code-mode` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while per-feature files carry the scenario-specific execution truth. Code Mode is the foundational orchestrator for ALL external MCP tool calls (ClickUp, Figma, Webflow, Chrome DevTools, GitHub, Notion); it defines the manual-namespace contract (`manual.tool` form), the environment-variable prefixing rule, and the `call_tool_chain` execution semantics that other MCP skills cross-reference.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--core-tools/`
- `02--manual-namespace-contract/`
- `03--env-var-prefixing/`
- `04--multi-tool-workflows/`
- `05--clickup-and-chrome-via-cm/`
- `06--third-party-via-cm/`
- `07--recovery-and-config/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CORE TOOLS](#7--core-tools)
- [8. MANUAL NAMESPACE CONTRACT](#8--manual-namespace-contract)
- [9. ENV VAR PREFIXING](#9--env-var-prefixing)
- [10. MULTI-TOOL WORKFLOWS](#10--multi-tool-workflows)
- [11. CLICKUP AND CHROME VIA CM](#11--clickup-and-chrome-via-cm)
- [12. THIRD-PARTY VIA CM](#12--third-party-via-cm)
- [13. RECOVERY AND CONFIG](#13--recovery-and-config)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE FILE INDEX](#15--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 26 deterministic scenarios across 7 categories validating the `mcp-code-mode` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and feature-file reference.

### Realistic Test Model

1. A realistic operator request is given to an orchestrator (e.g., "create a ClickUp task from a Figma design").
2. The orchestrator decides whether to call native tools, delegate via Code Mode, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

---

## 2. GLOBAL PRECONDITIONS

- Working directory is project root containing `.utcp_config.json` and `.env`.
- Node.js >= 18 is installed and resolvable via `node --version`.
- The Code Mode native tools (`call_tool_chain`, `search_tools`, `list_tools`, `tool_info`) are available in the current session.
- At least one external MCP server is configured in `.utcp_config.json` (e.g., `clickup`, `figma`, `chrome_devtools_1`, `webflow`, `github`, `notion`).
- For scenarios that exercise an external MCP, the corresponding API token / credential is set in `.env` with the `{manual_name}_` prefix (see Section 9).
- Destructive scenarios CM-021 (invalid config recovery) and CM-024 (deregister/re-register cycle) MUST run against a backup `.utcp_config.json`; restore the original after execution.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command or tool-call transcript including `code` argument when calling `call_tool_chain`.
- The user request that triggered the orchestration flow.
- The exact orchestrator prompt when the scenario depends on routing behavior.
- Key observable outputs: tool names returned, tool counts, env-var values (REDACTED), error messages, execution timings.
- Final user-facing outcome and a PASS / PARTIAL / FAIL verdict.
- For destructive scenarios, evidence of restore / cleanup state.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Native Code Mode tools shown as `tool_name({ key: value })` (e.g., `list_tools()`, `call_tool_chain({ code: "..." })`).
- External MCP tools shown as `manual.manual_tool({ key: value })` (e.g., `clickup.clickup_create_task({ ... })`).
- TypeScript snippets inside `call_tool_chain` shown verbatim within the `code` argument.
- Bash steps shown as `bash: <command>`.
- `->` separates sequential steps.
- Placeholders like `<task_id>` MUST be resolved before execution and the actual value captured in evidence.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when preconditions, prompt, commands, expected signals, and evidence all line up.
- A feature is PASS only when every mapped scenario is PASS.
- Release is READY only when all critical scenarios pass, coverage is complete, and no blocking triage item remains.
- Critical-path scenarios for Code Mode: CM-005 (manual-namespace contract), CM-008 (env-var prefixing), CM-011 (sequential chain). A FAIL on any of these blocks release.
- Keep feature-specific caveats in linked feature files instead of duplicating them in the root.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- **Wave 1 (parallel-safe)**: Core tools (CM-001..CM-004), Manual namespace (CM-005..CM-007), Env-var prefixing (CM-008..CM-010), Multi-tool workflows non-destructive (CM-011..CM-013).
- **Wave 2 (read-only external MCPs)**: ClickUp/Chrome/third-party via CM read paths (CM-014, CM-015, CM-017, CM-018, CM-019, CM-020) — require credentials but don't mutate state.
- **Wave 3 (writes external state)**: Sibling-pair handover (CM-016) — coordinates ClickUp + Chrome together; isolate from Wave 2.
- **Wave 4 (destructive / config mutation)**: CM-021 (invalid config), CM-022 (disabled server), CM-024 (deregister/re-register), CM-025 (partial-chain rollback). Run last; restore after each.
- After each wave, save evidence and rotate orchestrator context before the next wave.
- Pre-assign explicit scenario IDs to each wave before execution.

---

## 7. CORE TOOLS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-001 | list_tools enumerates available external tools

#### Description
Verify `list_tools()` returns the full set of registered external MCP tools with `manual.manual_tool` namespace.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, enumerate all available external MCP tools through Code Mode against the current Code Mode and `.utcp_config.json` registry. Verify the returned list is non-empty and every entry follows the `manual.manual_tool` naming pattern. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `list_tools()` returns an array of strings; Step 2: every entry contains a `.` separator; Step 3: at least one entry per configured manual in `.utcp_config.json`.

#### Test Execution
> **Feature File:** [CM-001](01--core-tools/001-list-tools-enumeration.md)

### CM-002 | search_tools returns relevant tools for a task description

#### Description
Verify `search_tools({task_description: ...})` returns tools relevant to the described task with non-empty result limited by `limit`.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, search for tools that handle "task management" through Code Mode against the registered ClickUp manual. Verify the search returns ClickUp-related tool names within the `limit` cap. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `search_tools` returns array; Step 2: at least one entry contains `clickup`; Step 3: array length <= specified `limit`.

#### Test Execution
> **Feature File:** [CM-002](01--core-tools/002-search-tools-relevance.md)

### CM-003 | tool_info returns interface schema for a known tool

#### Description
Verify `tool_info({tool_name: "clickup.clickup_create_task"})` returns parameter schema, description, and required fields.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, fetch the parameter schema for `clickup.clickup_create_task` through Code Mode against the live ClickUp MCP server. Verify the response includes parameter names, types, and required-field flags. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response is a non-empty object; Step 2: response contains `parameters` or equivalent schema field; Step 3: at least one required field listed.

#### Test Execution
> **Feature File:** [CM-003](01--core-tools/003-tool-info-schema.md)

### CM-004 | call_tool_chain executes TypeScript with tool access

#### Description
Verify `call_tool_chain({code: ...})` executes a TypeScript snippet that invokes external tools and returns the result.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run a TypeScript snippet that calls `list_tools()` then returns the count of registered tools through Code Mode against the configured `.utcp_config.json`. Verify the snippet executes without compile errors and returns a numeric tool count. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `call_tool_chain` returns a value; Step 2: returned value is a number; Step 3: number > 0.

#### Test Execution
> **Feature File:** [CM-004](01--core-tools/004-call-tool-chain-execution.md)

---

## 8. MANUAL NAMESPACE CONTRACT

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-005 | Correct manual.tool form succeeds

#### Description
Verify calling a tool with the correct `manual.manual_tool` form (e.g., `clickup.clickup_get_teams`) returns the expected result.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, call the ClickUp `get_teams` tool using the canonical `clickup.clickup_get_teams({})` form through Code Mode against the live ClickUp MCP server. Verify the call succeeds and returns workspace team data. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: tool call returns without error; Step 2: response contains team objects with `id` and `name` fields; Step 3: at least one team present.

#### Test Execution
> **Feature File:** [CM-005](02--manual-namespace-contract/001-correct-manual-tool-form.md)

### CM-006 | Wrong-form call returns "tool not found" error

#### Description
Verify calling without the manual prefix (e.g., `clickup.get_teams` instead of `clickup.clickup_get_teams`) returns a deterministic "tool not found" error.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, call ClickUp `get_teams` using the wrong form `clickup.get_teams` through Code Mode against the live registry. Verify the call returns a "tool not found" error containing the wrong name. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: tool call throws or returns an error; Step 2: error message contains "tool" and "not found" or similar; Step 3: error references the wrong-form name.

#### Test Execution
> **Feature File:** [CM-006](02--manual-namespace-contract/002-wrong-form-error.md)

### CM-007 | list_tools returns dot form, calling syntax uses underscore

#### Description
Verify `list_tools()` returns tools in `a.b.c` format (e.g., `clickup.clickup.create_task`) but calling syntax uses underscore form (`clickup.clickup_create_task`).

#### Current Reality
Prompt summary: As a manual-testing orchestrator, enumerate ClickUp tools then translate one entry from list-form to call-form and verify the call works through Code Mode against the live registry. Verify the dot-to-underscore translation is required. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: at least one `list_tools` entry contains 2+ dots; Step 2: dot-form direct call fails with "tool not found"; Step 3: underscore-form call succeeds.

#### Test Execution
> **Feature File:** [CM-007](02--manual-namespace-contract/003-list-tools-dot-vs-underscore.md)

---

## 9. ENV VAR PREFIXING

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-008 | Prefixed env vars load into the wrapped MCP server

#### Description
Verify a `.env` entry like `clickup_CLICKUP_API_KEY=pk_xxx` is visible to the wrapped ClickUp MCP server.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, set `clickup_CLICKUP_API_KEY` in `.env`, restart Code Mode, and call a ClickUp tool that requires auth against the live ClickUp API. Verify the auth succeeds. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: ClickUp auth call returns 200/OK or workspace data; Step 3: no "missing API key" error.

#### Test Execution
> **Feature File:** [CM-008](03--env-var-prefixing/001-prefixed-env-load.md)

### CM-009 | Unprefixed env var returns "credential not found"

#### Description
Verify an unprefixed `CLICKUP_API_KEY` (without `clickup_` prefix) is NOT visible to the wrapped server.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, set only `CLICKUP_API_KEY` (no prefix) in `.env`, restart Code Mode, and call a ClickUp tool against the live ClickUp API. Verify the auth fails with a missing-credential error. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: ClickUp tool returns auth error; Step 3: error message references missing/invalid API key.

#### Test Execution
> **Feature File:** [CM-009](03--env-var-prefixing/002-unprefixed-env-not-found.md)

### CM-010 | validate_config.py reports missing required env vars

#### Description
Verify `python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env` lists missing required env vars.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run the validation script with a `.env` missing one required prefixed key against the current `.utcp_config.json`. Verify the script exits non-zero and names the missing key. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: script exits with non-zero status; Step 2: stderr/stdout contains the missing prefixed key name; Step 3: removing the missing-key scenario and re-running gives exit 0.

#### Test Execution
> **Feature File:** [CM-010](03--env-var-prefixing/003-validate-config-script.md)

---

## 10. MULTI-TOOL WORKFLOWS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-011 | Sequential chain — output of tool A feeds tool B

#### Description
Verify `call_tool_chain` can run two tools sequentially with the second consuming the first's output.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, call `clickup_get_teams` then use the first team's id to call `clickup_get_spaces({team_id})` in a single `call_tool_chain` execution. Verify both calls succeed and the second returns spaces for the first team. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns object with both call results; Step 2: spaces array references the first team id.

#### Test Execution
> **Feature File:** [CM-011](04--multi-tool-workflows/001-sequential-chain.md)

### CM-012 | Promise.all parallelizes independent tool calls

#### Description
Verify `Promise.all([toolA(), toolB(), toolC()])` inside `call_tool_chain` executes the three calls in parallel and returns all three results.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run three independent read-only ClickUp calls (`get_teams`, `get_workspace_views`, `get_user`) via `Promise.all` in a single `call_tool_chain` execution. Verify all three return successfully. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns an array of length 3; Step 2: each entry is a non-error response; Step 3: total wall time < sum of individual times (parallel evidence).

#### Test Execution
> **Feature File:** [CM-012](04--multi-tool-workflows/002-promise-all-parallel.md)

### CM-013 | try/catch catches a tool failure without aborting the chain

#### Description
Verify wrapping a failing call in try/catch lets the chain continue and return both the error and a fallback result.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run a chain where the first call deliberately fails (invalid id) and the second is a fallback `get_user`, with try/catch around the first. Verify the chain returns both the caught error and the fallback success. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns object with `error` and `fallback` keys; Step 2: error is structured (not a runtime exception that aborts the chain).

#### Test Execution
> **Feature File:** [CM-013](04--multi-tool-workflows/003-try-catch-error-path.md)

---

## 11. CLICKUP AND CHROME VIA CM

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-014 | ClickUp via CM — create-then-read round trip

#### Description
Verify `clickup.clickup_create_task` followed by `clickup.clickup_get_task` returns the created task in a single `call_tool_chain` execution.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, create a throwaway test task in a designated test list, then read it back, then delete it through Code Mode against the live ClickUp API. Verify the round-trip values match (name, list_id) and cleanup succeeds. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: create returns task with `id`; Step 2: get returns task with same `id` and matching `name`; Step 3: delete returns success.

#### Test Execution
> **Feature File:** [CM-014](05--clickup-and-chrome-via-cm/001-clickup-create-read-delete.md)

### CM-015 | Chrome DevTools via CM — navigate + screenshot

#### Description
Verify `chrome_devtools_1.chrome_devtools_1_navigate_page` followed by `chrome_devtools_1.chrome_devtools_1_take_screenshot` returns a base64-encoded image.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, navigate Chrome to https://example.com then take a screenshot through Code Mode against the chrome_devtools_1 MCP instance. Verify navigation succeeds and screenshot returns image bytes. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: navigate returns success; Step 2: screenshot returns base64 string of length > 1000; Step 3: decoded bytes start with PNG magic header `89 50 4E 47`.

#### Test Execution
> **Feature File:** [CM-015](05--clickup-and-chrome-via-cm/002-chrome-navigate-screenshot.md)

### CM-016 | Sibling-pair handover — Chrome screenshot triggers ClickUp task

#### Description
Verify a single `call_tool_chain` execution can capture a Chrome screenshot and then create a ClickUp task referencing the screenshot URL.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, navigate Chrome to a target URL, capture a screenshot, then create a ClickUp task in the test list whose description includes a reference to the screenshot through Code Mode against the live ClickUp + Chrome MCP servers. Verify the chain executes both tools and the task contains the screenshot reference. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns object with both `screenshot_id` and `task_id`; Step 2: created task description contains the screenshot reference; Step 3: cleanup deletes both.

#### Test Execution
> **Feature File:** [CM-016](05--clickup-and-chrome-via-cm/003-sibling-pair-handover.md)

---

## 12. THIRD-PARTY VIA CM

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-017 | Figma via CM — file metadata fetch

#### Description
Verify `figma.figma_get_file({file_key})` returns file metadata (name, lastModified, document tree).

#### Current Reality
Prompt summary: As a manual-testing orchestrator, fetch metadata for a public Figma file through Code Mode against the configured Figma MCP server. Verify the response contains `name`, `lastModified`, and a `document` tree. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response is an object; Step 2: response has `name` (string) and `lastModified` (ISO date); Step 3: response has `document` with at least one child.

#### Test Execution
> **Feature File:** [CM-017](06--third-party-via-cm/001-figma-file-metadata.md)

### CM-018 | Webflow via CM — list sites

#### Description
Verify `webflow.webflow_list_sites()` returns the operator's Webflow sites.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list all Webflow sites visible to the configured token through Code Mode against the live Webflow API. Verify the response is a non-empty array (or explicit empty if account has no sites). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response is an array; Step 2: each entry has `id` and `displayName` or equivalent; Step 3: array length >= 0 (empty is valid for fresh accounts).

#### Test Execution
> **Feature File:** [CM-018](06--third-party-via-cm/002-webflow-list-sites.md)

### CM-019 | GitHub via CM — list user repos

#### Description
Verify `github.github_list_user_repos()` returns the authenticated user's repos.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, list repos owned by the authenticated GitHub user through Code Mode against the live GitHub API. Verify the response is a non-empty array of repo objects. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response is an array; Step 2: each entry has `name`, `owner.login`, and `private` fields; Step 3: array length > 0 for accounts with at least one repo.

#### Test Execution
> **Feature File:** [CM-019](06--third-party-via-cm/003-github-list-user-repos.md)

### CM-020 | Notion via CM — search workspace

#### Description
Verify `notion.notion_search({query: ""})` returns workspace pages and databases.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, search the Notion workspace for any page through Code Mode against the configured Notion MCP server. Verify the response is a list of objects with `object` and `id` fields. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response has `results` array; Step 2: each result has `object` (page/database) and `id`; Step 3: array length >= 0.

#### Test Execution
> **Feature File:** [CM-020](06--third-party-via-cm/004-notion-search-workspace.md)

---

## 13. RECOVERY AND CONFIG

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract.

### CM-021 | Invalid .utcp_config.json triggers a structured error **(DESTRUCTIVE)**

#### Description
Verify Code Mode reports a deterministic config-validation error when `.utcp_config.json` has malformed JSON. Restore original after.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, back up `.utcp_config.json`, corrupt it (delete a closing brace), restart Code Mode, observe the error, then restore through Code Mode against the corrupted then-restored config. Verify the error names the config file and the JSON parse failure. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: Code Mode startup fails with JSON parse error referencing `.utcp_config.json`; Step 4: after restore, `list_tools()` succeeds again.

#### Test Execution
> **Feature File:** [CM-021](07--recovery-and-config/001-invalid-config-error.md)

### CM-022 | Disabled server is omitted from list_tools

#### Description
Verify setting `"disabled": true` for a manual in `.utcp_config.json` removes its tools from `list_tools()` output.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, set `disabled: true` for the GitHub manual, restart Code Mode, list tools, then revert through Code Mode against the modified-then-restored config. Verify GitHub tools are absent during the disabled run and present after revert. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: `list_tools()` returns no entries beginning with `github.`; Step 4: after revert, GitHub tools reappear.

#### Test Execution
> **Feature File:** [CM-022](07--recovery-and-config/002-disabled-server-omitted.md)

### CM-023 | Timeout escalation — long-running chain respects timeout argument

#### Description
Verify `call_tool_chain({code, timeout: 5000})` aborts a chain that exceeds 5000ms with a timeout error.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run a deliberately slow chain (sleep 7 seconds) with `timeout: 5000` through Code Mode against the local Code Mode runtime. Verify the chain returns a timeout error in approximately 5 seconds. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: response includes timeout/abort error; Step 2: wall-clock time approximately 5 seconds (within ±1s).

#### Test Execution
> **Feature File:** [CM-023](07--recovery-and-config/003-timeout-escalation.md)

### CM-024 | Deregister manual then re-register cycle **(DESTRUCTIVE)**

#### Description
Verify `deregister_manual({name})` removes a manual from runtime, and `register_manual({...})` restores it.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, deregister the GitHub manual, list tools (verify absent), then re-register it from the saved `.utcp_config.json` entry through Code Mode against the live runtime. Verify the manual is absent during the deregister window and present after re-register. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: deregister returns success; Step 2: `list_tools()` shows no `github.` entries; Step 3: re-register returns success; Step 4: GitHub tools reappear.

#### Test Execution
> **Feature File:** [CM-024](07--recovery-and-config/004-deregister-reregister-cycle.md)

### CM-025 | Partial-chain rollback — failure mid-chain leaves ClickUp clean

#### Description
Verify a chain that creates a ClickUp task then fails on a follow-up call leaves the task created (no automatic rollback) — and the operator can manually delete using the returned id.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, run a chain that creates a ClickUp task then deliberately fails on the next call, then verify the task exists, then delete it through Code Mode against the live ClickUp API. Verify the create succeeded, the follow-up failed, and manual cleanup works. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns object with `created_task_id` and `error`; Step 2: `clickup_get_task({id})` returns the task; Step 3: `clickup_delete_task({id})` succeeds.

#### Test Execution
> **Feature File:** [CM-025](07--recovery-and-config/005-partial-chain-rollback.md)

### CM-026 | Missing manual entry returns "manual not found" on tool call

#### Description
Verify calling a tool whose manual is not in `.utcp_config.json` returns a "manual not found" error referencing the missing manual name.

#### Current Reality
Prompt summary: As a manual-testing orchestrator, call `nonexistent.nonexistent_anything()` through Code Mode against the current registry. Verify the error names the missing manual. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: call returns error; Step 2: error message contains "manual" or "not found" or "registry"; Step 3: error references `nonexistent`.

#### Test Execution
> **Feature File:** [CM-026](07--recovery-and-config/006-missing-manual-entry.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skill/mcp-code-mode/scripts/validate_config.py` | `.utcp_config.json` schema + env-var presence | CM-010 |
| `.opencode/skill/mcp-code-mode/scripts/test/manual_namespace.test.js` (if present) | Manual-namespace contract | CM-005, CM-006, CM-007 |
| Integration smoke (manual): existing `mcp-coco-index` playbook (precedent) | MCP tool surface validation | Cross-skill reference for MCP testing patterns |

> Note: most Code Mode behavior is exercised through the live MCP servers it wraps, not through dedicated unit tests in the skill itself. The playbook scenarios serve as the primary regression surface.

---

## 15. FEATURE FILE INDEX

### CORE TOOLS

- CM-001: [list_tools enumeration](01--core-tools/001-list-tools-enumeration.md)
- CM-002: [search_tools relevance](01--core-tools/002-search-tools-relevance.md)
- CM-003: [tool_info schema](01--core-tools/003-tool-info-schema.md)
- CM-004: [call_tool_chain execution](01--core-tools/004-call-tool-chain-execution.md)

### MANUAL NAMESPACE CONTRACT

- CM-005: [Correct manual.tool form](02--manual-namespace-contract/001-correct-manual-tool-form.md)
- CM-006: [Wrong-form error](02--manual-namespace-contract/002-wrong-form-error.md)
- CM-007: [list_tools dot vs underscore](02--manual-namespace-contract/003-list-tools-dot-vs-underscore.md)

### ENV VAR PREFIXING

- CM-008: [Prefixed env load](03--env-var-prefixing/001-prefixed-env-load.md)
- CM-009: [Unprefixed env not found](03--env-var-prefixing/002-unprefixed-env-not-found.md)
- CM-010: [validate_config script](03--env-var-prefixing/003-validate-config-script.md)

### MULTI-TOOL WORKFLOWS

- CM-011: [Sequential chain](04--multi-tool-workflows/001-sequential-chain.md)
- CM-012: [Promise.all parallel](04--multi-tool-workflows/002-promise-all-parallel.md)
- CM-013: [try/catch error path](04--multi-tool-workflows/003-try-catch-error-path.md)

### CLICKUP AND CHROME VIA CM

- CM-014: [ClickUp create-read-delete](05--clickup-and-chrome-via-cm/001-clickup-create-read-delete.md)
- CM-015: [Chrome navigate + screenshot](05--clickup-and-chrome-via-cm/002-chrome-navigate-screenshot.md)
- CM-016: [Sibling-pair handover](05--clickup-and-chrome-via-cm/003-sibling-pair-handover.md)

### THIRD-PARTY VIA CM

- CM-017: [Figma file metadata](06--third-party-via-cm/001-figma-file-metadata.md)
- CM-018: [Webflow list sites](06--third-party-via-cm/002-webflow-list-sites.md)
- CM-019: [GitHub list user repos](06--third-party-via-cm/003-github-list-user-repos.md)
- CM-020: [Notion search workspace](06--third-party-via-cm/004-notion-search-workspace.md)

### RECOVERY AND CONFIG

- CM-021: [Invalid config error **(DESTRUCTIVE)**](07--recovery-and-config/001-invalid-config-error.md)
- CM-022: [Disabled server omitted](07--recovery-and-config/002-disabled-server-omitted.md)
- CM-023: [Timeout escalation](07--recovery-and-config/003-timeout-escalation.md)
- CM-024: [Deregister/re-register cycle **(DESTRUCTIVE)**](07--recovery-and-config/004-deregister-reregister-cycle.md)
- CM-025: [Partial-chain rollback](07--recovery-and-config/005-partial-chain-rollback.md)
- CM-026: [Missing manual entry](07--recovery-and-config/006-missing-manual-entry.md)
