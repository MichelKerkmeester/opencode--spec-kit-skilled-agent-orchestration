---
title: "CocoIndex Code: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the CocoIndex Code skill."
---

# CocoIndex Code: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.


This document combines the full manual-validation contract for the `mcp-coco-index` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--core-cli-commands/`
- `02--mcp-search-tool/`
- `03--configuration/`
- `04--daemon-lifecycle/`
- `05--skill-advisor-integration/`
- `06--error-handling/`
- `07--code-graph-integration/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CORE CLI COMMANDS](#7--core-cli-commands)
- [8. MCP SEARCH TOOL](#8--mcp-search-tool)
- [9. CONFIGURATION](#9--configuration)
- [10. DAEMON LIFECYCLE](#10--daemon-lifecycle)
- [11. SKILL ADVISOR INTEGRATION](#11--skill-advisor-integration)
- [12. ERROR HANDLING](#12--error-handling)
- [13. CODE GRAPH INTEGRATION](#13--code-graph-integration)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE CATALOG CROSS-REFERENCE INDEX](#15--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 23 deterministic scenarios across 7 categories validating the `mcp-coco-index` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and feature-file reference.

### REALISTIC TEST MODEL

1. Start from a realistic operator request rather than a synthetic command list.
2. Validate the user-facing workflow before drilling into daemon or MCP internals when that order matters.
3. Capture enough evidence that another operator can replay the verdict without guessing.
4. Return a concise user-facing result, not just raw command output.

---

## 2. GLOBAL PRECONDITIONS

- Working directory is project root and has `.git/`.
- CocoIndex daemon is available via `ccc` and `ccc status` responds.
- Project is initialized and indexed so `ccc status` reports non-zero file and chunk counts.
- The MCP search tool is available in the current session.
- The shared skill advisor exists at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.
- Destructive scenario `CCC-005` runs only against rebuildable, non-production data.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command or tool transcript.
- The user request that triggered the orchestration flow.
- The exact orchestrator prompt when the scenario depends on routing behavior.
- Key observable outputs such as paths, scores, counts, or zero-result states.
- The final user-facing outcome and a PASS, PARTIAL, or FAIL verdict.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands are shown as `ccc <subcommand> [args]`.
- MCP calls are shown as `mcp__cocoindex_code__search({ ... })`.
- Bash steps are written as `bash: <command>` inside the feature files.
- Resolve placeholders before execution and capture the actual command that ran.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when preconditions, prompt, commands, expected signals, and evidence all line up.
- A feature is PASS only when every mapped scenario is PASS.
- Release is READY only when all critical scenarios pass, coverage is complete, and no blocking triage item remains.
- Keep feature-specific caveats in the linked feature files instead of duplicating them in the root.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1 covers the parallel-safe CLI, MCP, configuration, advisor, and no-result scenarios.
- Wave 2 isolates daemon lifecycle checks because they mutate or inspect shared daemon state.
- Wave 3 isolates destructive reset behavior in `CCC-005`.
- Wave 4 covers code-graph integration scenarios that need both CocoIndex and Spec Kit Memory surfaces healthy.

---

## 7. CORE CLI COMMANDS

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract.

### CCC-001 | Project initialization

#### Description
Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, initialize a new CocoIndex Code project in the current directory against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: output contains "Initialized" or creates .cocoindex_code/; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists

#### Test Execution
> **Feature File:** [CCC-001](01--core-cli-commands/001-project-initialization.md)

### CCC-002 | Full index build

#### Description
Verify `ccc index` reports file count and chunk count.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, build the full semantic index for this project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output contains numeric file and chunk counts (for example "Files:" and "Chunks:" or similar metric lines). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines)

#### Test Execution
> **Feature File:** [CCC-002](01--core-cli-commands/002-full-index-build.md)

### CCC-003 | Incremental index

#### Description
Verify incremental indexing picks up new content and drops deleted content.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, create a temp file, reindex, search for it, delete it, reindex again against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 3: search returns at least 1 result referencing ccc_test_incremental.py; Step 6: search returns 0 results for that file. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file

#### Test Execution
> **Feature File:** [CCC-003](01--core-cli-commands/003-incremental-index.md)

### CCC-004 | CLI search with filters

#### Description
Verify `--lang` (repeatable) and `--limit` filters work.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search for "function" filtered to Python and TypeScript with limit 3 against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: returns results; Step 2: all file extensions are .py, .ts, or .tsx; Step 3: result count <= 3. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3

#### Test Execution
> **Feature File:** [CCC-004](01--core-cli-commands/004-cli-search-with-filters.md)

### CCC-005 | Index reset **(DESTRUCTIVE)**

#### Description
Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, reset the CocoIndex Code index completely and rebuild against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts

#### Test Execution
> **Feature File:** [CCC-005](01--core-cli-commands/005-index-reset-destructive.md)


---

## 8. MCP SEARCH TOOL

This category covers 7 scenario summaries while the linked feature files remain the canonical execution contract.

### MCP-001 | Basic semantic search

#### Description
Verify MCP search returns results with file paths, scores, and line ranges.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, use CocoIndex to search for "fibonacci calculation" against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array with at least 1 entry; each entry contains file (string), score (float 0.0-1.0), lines (start/end), snippet (string), language (string). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string)

#### Test Execution
> **Feature File:** [MCP-001](02--mcp-search-tool/001-basic-semantic-search.md)

### MCP-002 | Language filter (single)

#### Description
Verify `languages` parameter restricts results to a single language.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CocoIndex for "function" filtered to Python only against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result file paths end in .py; no .ts, .js, .go, etc. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc.

#### Test Execution
> **Feature File:** [MCP-002](02--mcp-search-tool/002-language-filter-single.md)

### MCP-003 | Language filter (multi)

#### Description
Verify `languages` parameter accepts multiple languages.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CocoIndex for "function" in both Python and JavaScript against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results contain mix of .py and .js files; no other extensions. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Results contain mix of `.py` and `.js` files; no other extensions

#### Test Execution
> **Feature File:** [MCP-003](02--mcp-search-tool/003-language-filter-multi.md)

### MCP-004 | Path filter

#### Description
Verify `paths` parameter restricts results to a specific directory.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CocoIndex for "skill" only under .opencode/skill/ against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: All result paths begin with `.opencode/skill/`; no results from other directories

#### Test Execution
> **Feature File:** [MCP-004](02--mcp-search-tool/004-path-filter.md)

### MCP-005 | Combined filters

#### Description
Verify `languages`, `paths`, and `limit` work together.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CocoIndex for "config" in Python under .opencode/ with 2 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Result count <= 2; all files are `.py`; all paths start with `.opencode/`

#### Test Execution
> **Feature File:** [MCP-005](02--mcp-search-tool/005-combined-filters.md)

### MCP-006 | Result limit

#### Description
Verify `limit` controls output count.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, compare CocoIndex search with 1 result vs 10 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count

#### Test Execution
> **Feature File:** [MCP-006](02--mcp-search-tool/006-result-limit.md)

### MCP-007 | No-refresh search

#### Description
Verify `refresh_index: false` skips reindexing and still returns results.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CocoIndex for "test" without triggering a reindex against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice)

#### Test Execution
> **Feature File:** [MCP-007](02--mcp-search-tool/007-no-refresh-search.md)

### MCP-008 | Concurrent refresh_index race

#### Description
Verify two concurrent `refresh_index=true` calls either both succeed or surface the documented `ComponentContext` race; confirm `refresh_index=false` fallback works.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, fire two MCP CocoIndex searches concurrently with refresh_index=true against the current CocoIndex daemon in this repository. Verify either both responses are valid result arrays OR at least one response surfaces a ComponentContext error string (acceptable failure mode per SKILL.md §4). Confirm that switching the second call to refresh_index=false eliminates the error. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Both calls return JSON; at most one contains `ComponentContext`; the `refresh_index=false` follow-up returns a non-empty result array

#### Test Execution
> **Feature File:** [MCP-008](02--mcp-search-tool/008-concurrent-refresh-race.md)


---

## 9. CONFIGURATION

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CFG-001 | Default model verification

#### Description
Verify global settings contain the documented default embedding model.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, check the CocoIndex Code global settings for the embedding model against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Settings file exists; embedding.model matches a documented model such as the default local sentence-transformers/all-MiniLM-L6-v2 or a LiteLLM model like voyage/voyage-code-3. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Settings file exists; `embedding.model` matches a documented model such as `sentence-transformers/all-MiniLM-L6-v2` or `voyage/voyage-code-3`

#### Test Execution
> **Feature File:** [CFG-001](03--configuration/001-default-model-verification.md)

### CFG-002 | Project settings inspection

#### Description
Verify project settings contain language extension patterns.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, inspect the CocoIndex Code project settings for language coverage against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify include_patterns. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: `include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.)

#### Test Execution
> **Feature File:** [CFG-002](03--configuration/002-project-settings-inspection.md)

### CFG-003 | Status verification

#### Description
Verify `ccc status` shows indexed file count and chunk count.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, check the CocoIndex Code status for this initialized project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output shows numeric file count > 0 and numeric chunk count > 0. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Output shows numeric file count > 0 and numeric chunk count > 0

#### Test Execution
> **Feature File:** [CFG-003](03--configuration/003-status-verification.md)

### CFG-004 | Root-path env-var override

#### Description
Verify `COCOINDEX_CODE_ROOT_PATH` overrides marker-directory discovery in the documented 4-priority root resolution chain.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, set COCOINDEX_CODE_ROOT_PATH to an explicit project root path, then invoke ccc status from a subdirectory containing project markers (.git, package.json, etc.) and confirm the reported root matches the env var, not the subdirectory. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: `ccc status` invoked from the subdirectory with the env var set reports the same file/chunk counts as `ccc status` invoked at the env-var-pinned root; `ccc search --limit 1` returns a path under the env-var-pinned root

#### Test Execution
> **Feature File:** [CFG-004](03--configuration/004-root-path-env-var-override.md)


---

## 10. DAEMON LIFECYCLE

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### DMN-001 | Daemon auto-start

#### Description
Verify daemon starts automatically when a CLI command is issued after it has been stopped.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, stop the daemon, then search -- against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify auto-start against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running

#### Test Execution
> **Feature File:** [DMN-001](04--daemon-lifecycle/001-daemon-auto-start.md)

### DMN-002 | Daemon status inspection

#### Description
Verify `ccc daemon status` shows version and uptime; PID and socket files exist.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, check daemon status and against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify runtime files against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: output includes version or uptime information; Step 2: both daemon.pid and daemon.sock files exist. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist

#### Test Execution
> **Feature File:** [DMN-002](04--daemon-lifecycle/002-daemon-status-inspection.md)

### DMN-003 | Helper-script readiness (doctor.sh + ensure_ready.sh)

#### Description
Verify `doctor.sh --strict --require-config` and `ensure_ready.sh --strict --require-config` enforce the SKILL.md §4 ALWAYS rule #7 readiness contract on positive and negative paths.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, run doctor.sh --json --strict --require-config followed by ensure_ready.sh --json --strict --require-config against the current CocoIndex install in this repository. Verify both scripts exit 0 with healthy JSON; rerun ensure_ready.sh and confirm idempotency; then run both scripts from a temp directory with no .cocoindex_code/ to confirm --require-config makes them exit non-zero with an explicit reason. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: doctor exit=0 with valid JSON; ensure_ready exit=0 first call AND idempotent on second call; both scripts exit non-zero with explicit reason when run from a directory without `.cocoindex_code/` and `--require-config` is set

#### Test Execution
> **Feature File:** [DMN-003](04--daemon-lifecycle/003-helper-script-readiness.md)


---

## 11. SKILL ADVISOR INTEGRATION

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### ADV-001 | Semantic flag routing

#### Description
Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, test skill advisor with semantic search for a deployment query against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify JSON output is valid; at least one recommendation entry contains !semantic( in its reason field; CocoIndex search was invoked (visible in processing or reason text). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text)

#### Test Execution
> **Feature File:** [ADV-001](05--skill-advisor-integration/001-semantic-flag-routing.md)

### ADV-002 | Pre-computed hits routing

#### Description
Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, run skill advisor twice for the same deployment query: first without semantic hits, then with pre-computed CocoIndex hits against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify sk-git appears in the semantic-hits run, its confidence is higher than in the baseline run, and the boosted reason references semantic input. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Both JSON outputs are valid; `sk-git` appears in the semantic-hits run; its confidence is higher than in the baseline run; boosted `reason` references semantic input

#### Test Execution
> **Feature File:** [ADV-002](05--skill-advisor-integration/002-pre-computed-hits-routing.md)


---

## 12. ERROR HANDLING

This category covers 1 scenario summaries while the linked feature files remain the canonical execution contract.

### ERR-001 | No results graceful handling

#### Description
Verify search returns empty results gracefully for a nonsense query (no crash, no error).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search for a completely nonsensical term that has no matches against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace

#### Test Execution
> **Feature File:** [ERR-001](06--error-handling/001-no-results-graceful-handling.md)


---

## 13. CODE GRAPH INTEGRATION

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### INT-001 | Semantic queries stay on the semantic path via query-intent classifier

#### Description
Verify that semantic queries (containing keywords like "find examples", "how to", "similar to", "explain") are classified as semantic and do not trigger structural graph augmentation in `memory_context`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, send a semantic query like "find examples of error handling patterns in this codebase" to memory_context against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Intent classified as 'semantic', routedBackend is semantic when present, no graphContext block in the response, no structural graph data injected into primary results. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Intent classified as 'semantic', routedBackend is `semantic` when present, no `graphContext` block in the response, no structural graph data injected into primary results

#### Test Execution
> **Feature File:** [INT-001](07--code-graph-integration/001-query-intent-semantic-routing.md)

### INT-002 | Hybrid intent queries add graph context on top of semantic retrieval

#### Description
Verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") are classified as hybrid and append `graphContext` metadata to the normal `memory_context` response.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Intent classified as hybrid, response contains queryIntentRouting, graphContext appears when graph seeds resolve, and the normal semantic response body remains present. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Intent classified as `hybrid`, response contains `queryIntentRouting`, `graphContext` appears when graph seeds resolve, and the normal semantic response body remains present

#### Test Execution
> **Feature File:** [INT-002](07--code-graph-integration/002-hybrid-query-merges-results.md)

### INT-003 | Session recovery surfaces include CocoIndex availability status

#### Description
Verify that `session_bootstrap` exposes CocoIndex status through `resume.cocoIndex`, that `session_resume` still exposes the direct `cocoIndex` field, and that both surfaces degrade gracefully when the CocoIndex binary is unavailable. `available` reflects whether the `ccc` binary exists at the expected install path, not whether the daemon is currently running. The `binaryPath` must point to the expected `ccc` binary location.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, call session_bootstrap and session_resume, then examine the CocoIndex status fields against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify session_bootstrap.resume.cocoIndex.available and session_resume.cocoIndex.available match binary presence on disk; both binaryPath values are non-empty strings; session_bootstrap includes structuralContext; both calls complete without error regardless of binary availability. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: `session_bootstrap.resume.cocoIndex.available` and `session_resume.cocoIndex.available` match binary presence on disk; both `binaryPath` values are non-empty strings; `session_bootstrap` includes `structuralContext`; both calls complete without error regardless of binary availability

#### Test Execution
> **Feature File:** [INT-003](07--code-graph-integration/003-session-resume-includes-cocoindex.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

- `test_protocol.py`: binary serialization round-trips.
- `test_config.py`: default model and configuration coverage.
- `test_settings.py`: settings save/load and language overrides.
- `test_cli_helpers.py`: root detection and init helpers.
- `test_client.py` and `test_daemon.py`: connection and daemon lifecycle coverage.
- `test_e2e.py` and `test_e2e_daemon.py`: full CLI, search, and daemon workflow coverage.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

### CORE CLI COMMANDS

- CCC-001: [Project initialization](01--core-cli-commands/001-project-initialization.md)
- CCC-002: [Full index build](01--core-cli-commands/002-full-index-build.md)
- CCC-003: [Incremental index](01--core-cli-commands/003-incremental-index.md)
- CCC-004: [CLI search with filters](01--core-cli-commands/004-cli-search-with-filters.md)
- CCC-005: [Index reset **(DESTRUCTIVE)**](01--core-cli-commands/005-index-reset-destructive.md)

### MCP SEARCH TOOL

- MCP-001: [Basic semantic search](02--mcp-search-tool/001-basic-semantic-search.md)
- MCP-002: [Language filter (single)](02--mcp-search-tool/002-language-filter-single.md)
- MCP-003: [Language filter (multi)](02--mcp-search-tool/003-language-filter-multi.md)
- MCP-004: [Path filter](02--mcp-search-tool/004-path-filter.md)
- MCP-005: [Combined filters](02--mcp-search-tool/005-combined-filters.md)
- MCP-006: [Result limit](02--mcp-search-tool/006-result-limit.md)
- MCP-007: [No-refresh search](02--mcp-search-tool/007-no-refresh-search.md)
- MCP-008: [Concurrent refresh_index race](02--mcp-search-tool/008-concurrent-refresh-race.md)

### CONFIGURATION

- CFG-001: [Default model verification](03--configuration/001-default-model-verification.md)
- CFG-002: [Project settings inspection](03--configuration/002-project-settings-inspection.md)
- CFG-003: [Status verification](03--configuration/003-status-verification.md)
- CFG-004: [Root-path env-var override](03--configuration/004-root-path-env-var-override.md)

### DAEMON LIFECYCLE

- DMN-001: [Daemon auto-start](04--daemon-lifecycle/001-daemon-auto-start.md)
- DMN-002: [Daemon status inspection](04--daemon-lifecycle/002-daemon-status-inspection.md)
- DMN-003: [Helper-script readiness (doctor.sh + ensure_ready.sh)](04--daemon-lifecycle/003-helper-script-readiness.md)

### SKILL ADVISOR INTEGRATION

- ADV-001: [Semantic flag routing](05--skill-advisor-integration/001-semantic-flag-routing.md)
- ADV-002: [Pre-computed hits routing](05--skill-advisor-integration/002-pre-computed-hits-routing.md)

### ERROR HANDLING

- ERR-001: [No results graceful handling](06--error-handling/001-no-results-graceful-handling.md)

### CODE GRAPH INTEGRATION

- INT-001: [Semantic queries stay on the semantic path via query-intent classifier](07--code-graph-integration/001-query-intent-semantic-routing.md)
- INT-002: [Hybrid intent queries add graph context on top of semantic retrieval](07--code-graph-integration/002-hybrid-query-merges-results.md)
- INT-003: [Session recovery surfaces include CocoIndex availability status](07--code-graph-integration/003-session-resume-includes-cocoindex.md)
