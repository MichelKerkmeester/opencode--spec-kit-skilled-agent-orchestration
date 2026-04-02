---
title: "CocoIndex Code: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the CocoIndex Code skill."
---

# CocoIndex Code: Manual Testing Playbook

This document combines the full manual-validation contract for the `mcp-coco-index` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives.

---

This playbook package adopts the Feature Catalog split-document pattern for the `mcp-coco-index` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `MANUAL_TESTING_PLAYBOOK.md`
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

This playbook provides 23 deterministic scenarios across 7 categories validating the `mcp-coco-index` skill surface. Each feature keeps its original ID and links to a dedicated snippet with the full execution contract.

Coverage note (2026-03-18): scenarios validate the upstream doc overhaul and skill advisor `--semantic` and `--semantic-hits` integration.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Feature Files Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome, not just the internal tool output

---

## 2. GLOBAL PRECONDITIONS
1. Working directory is project root (has `.git/`).
2. CocoIndex daemon is running (`ccc` binary available on PATH or at `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`; `ccc status` responds).
3. Project is initialized and indexed (`ccc init && ccc index` completed; `ccc status` shows non-zero file and chunk counts).
4. MCP server configured and accessible (`mcp__cocoindex_code__search` tool available in the current session).
5. Skill advisor script exists at `.opencode/skill/scripts/skill_advisor.py` and is executable with `python3`.
6. **Destructive scenario `CCC-005`** MUST verify index can be rebuilt (non-production data only).

---

## 3. GLOBAL EVIDENCE REQUIREMENTS
1. **Command transcript** -- full tool output or terminal output.
2. **User request** -- the realistic request that triggered the orchestration flow.
3. **Orchestrator prompt** -- the exact coordinator or agent-facing prompt used during execution.
4. **Delegation or runtime-routing notes** -- when the scenario models orchestrator behavior.
2. **Key output snippet** -- file paths, scores, counts, or other observable metrics.
5. **Final user-facing outcome** -- the answer or result a real user would receive.
6. **Scenario verdict** -- `PASS`, `PARTIAL`, or `FAIL` with one-line rationale.

---

## 4. DETERMINISTIC COMMAND NOTATION
- CLI commands shown as `ccc <subcommand> [args]`.
- MCP tool calls shown as `mcp__cocoindex_code__search({ key: value })`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps within a single scenario.
- All paths are relative to project root unless otherwise noted.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `MANUAL_TESTING_PLAYBOOK.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (logs, tool outputs, artifacts)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Wave Planning

| Wave | Scenarios | Worker Count | Notes |
|---|---|---|---|
| Wave 1 (parallel-safe) | CCC-001..CCC-004, MCP-001..MCP-007, CFG-001..CFG-003, ADV-001..ADV-002, ERR-001 | 1-5 | Safe to parallelize when each worker gets explicit scenario ownership |
| Wave 2 (shared-daemon) | DMN-001..DMN-002 | 1 | Run serially because these scenarios mutate or inspect shared daemon state |
| Wave 3 (destructive) | CCC-005 | 1 | Must run in isolation because it resets the index |
| Wave 4 (integration) | INT-001..INT-003 | 1-2 | Requires both CocoIndex daemon and Spec Kit Memory MCP server running |

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run daemon lifecycle scenarios in a dedicated serialized wave; do not mix them with parallel CLI or MCP checks.
6. Run destructive scenario `CCC-005` in a dedicated sandbox-only wave.
7. After each wave, save context and evidence, then begin the next wave.
8. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Orchestrator prompt
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. CORE CLI COMMANDS

### CCC-001 | Project initialization

#### Description
Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates.

#### Current Reality
Prompt: `Initialize a new CocoIndex Code project in the current directory. Capture the evidence needed to prove Step 2: output contains "Initialized" or creates .cocoindex_code/; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists. Return a concise user-facing pass/fail verdict with the main reason.`

Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists

#### Test Execution
> **Feature File:** [CCC-001](01--core-cli-commands/001-project-initialization.md)

### CCC-002 | Full index build

#### Description
Verify `ccc index` reports file count and chunk count.

#### Current Reality
Prompt: `Build the full semantic index for this project. Capture the evidence needed to prove Output contains numeric file and chunk counts (for example "Files:" and "Chunks:" or similar metric lines). Return a concise user-facing pass/fail verdict with the main reason.`

Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines)

#### Test Execution
> **Feature File:** [CCC-002](01--core-cli-commands/002-full-index-build.md)

### CCC-003 | Incremental index

#### Description
Verify incremental indexing picks up new content and drops deleted content.

#### Current Reality
Prompt: `Create a temp file, reindex, search for it, delete it, reindex again. Capture the evidence needed to prove Step 3: search returns at least 1 result referencing ccc_test_incremental.py; Step 6: search returns 0 results for that file. Return a concise user-facing pass/fail verdict with the main reason.`

Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file

#### Test Execution
> **Feature File:** [CCC-003](01--core-cli-commands/003-incremental-index.md)

### CCC-004 | CLI search with filters

#### Description
Verify `--lang` (repeatable) and `--limit` filters work.

#### Current Reality
Prompt: `Search for "function" filtered to Python and TypeScript with limit 3. Capture the evidence needed to prove Step 1: returns results; Step 2: all file extensions are .py, .ts, or .tsx; Step 3: result count <= 3. Return a concise user-facing pass/fail verdict with the main reason.`

Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3

#### Test Execution
> **Feature File:** [CCC-004](01--core-cli-commands/004-cli-search-with-filters.md)

### CCC-005 | Index reset **(DESTRUCTIVE)**

#### Description
Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds.

#### Current Reality
Prompt: `Reset the CocoIndex Code index completely and rebuild. Capture the evidence needed to prove Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts. Return a concise user-facing pass/fail verdict with the main reason.`

Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts

#### Test Execution
> **Feature File:** [CCC-005](01--core-cli-commands/005-index-reset-destructive.md)

---

## 8. MCP SEARCH TOOL

### MCP-001 | Basic semantic search

#### Description
Verify MCP search returns results with file paths, scores, and line ranges.

#### Current Reality
Prompt: `Use CocoIndex to search for "fibonacci calculation". Capture the evidence needed to prove Results array with at least 1 entry; each entry contains file (string), score (float 0.0-1.0), lines (start/end), snippet (string), language (string). Return a concise user-facing pass/fail verdict with the main reason.`

Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string)

#### Test Execution
> **Feature File:** [MCP-001](02--mcp-search-tool/001-basic-semantic-search.md)

### MCP-002 | Language filter (single)

#### Description
Verify `languages` parameter restricts results to a single language.

#### Current Reality
Prompt: `Search CocoIndex for "function" filtered to Python only. Capture the evidence needed to prove All result file paths end in .py; no .ts, .js, .go, etc. Return a concise user-facing pass/fail verdict with the main reason.`

All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc.

#### Test Execution
> **Feature File:** [MCP-002](02--mcp-search-tool/002-language-filter-single.md)

### MCP-003 | Language filter (multi)

#### Description
Verify `languages` parameter accepts multiple languages.

#### Current Reality
Prompt: `Search CocoIndex for "function" in both Python and JavaScript. Capture the evidence needed to prove Results contain mix of .py and .js files; no other extensions. Return a concise user-facing pass/fail verdict with the main reason.`

Results contain mix of `.py` and `.js` files; no other extensions

#### Test Execution
> **Feature File:** [MCP-003](02--mcp-search-tool/003-language-filter-multi.md)

### MCP-004 | Path filter

#### Description
Verify `paths` parameter restricts results to a specific directory.

#### Current Reality
Prompt: `Search CocoIndex for "skill" only under .opencode/skill/. Capture the evidence needed to prove All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-facing pass/fail verdict with the main reason.`

All result paths begin with `.opencode/skill/`; no results from other directories

#### Test Execution
> **Feature File:** [MCP-004](02--mcp-search-tool/004-path-filter.md)

### MCP-005 | Combined filters

#### Description
Verify `languages`, `paths`, and `limit` work together.

#### Current Reality
Prompt: `Search CocoIndex for "config" in Python under .opencode/ with 2 results. Capture the evidence needed to prove Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-facing pass/fail verdict with the main reason.`

Result count <= 2; all files are `.py`; all paths start with `.opencode/`

#### Test Execution
> **Feature File:** [MCP-005](02--mcp-search-tool/005-combined-filters.md)

### MCP-006 | Result limit

#### Description
Verify `limit` controls output count.

#### Current Reality
Prompt: `Compare CocoIndex search with 1 result vs 10 results. Capture the evidence needed to prove Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count. Return a concise user-facing pass/fail verdict with the main reason.`

Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count

#### Test Execution
> **Feature File:** [MCP-006](02--mcp-search-tool/006-result-limit.md)

### MCP-007 | No-refresh search

#### Description
Verify `refresh_index: false` skips reindexing and still returns results.

#### Current Reality
Prompt: `Search CocoIndex for "test" without triggering a reindex. Capture the evidence needed to prove Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice). Return a concise user-facing pass/fail verdict with the main reason.`

Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice)

#### Test Execution
> **Feature File:** [MCP-007](02--mcp-search-tool/007-no-refresh-search.md)

---

## 9. CONFIGURATION

### CFG-001 | Default model verification

#### Description
Verify global settings contain the documented default embedding model.

#### Current Reality
Prompt: `Check the CocoIndex Code global settings for the embedding model. Capture the evidence needed to prove Settings file exists; embedding.model matches a documented model such as the default local sentence-transformers/all-MiniLM-L6-v2 or a LiteLLM model like voyage/voyage-code-3. Return a concise user-facing pass/fail verdict with the main reason.`

Settings file exists; `embedding.model` matches a documented model such as `sentence-transformers/all-MiniLM-L6-v2` or `voyage/voyage-code-3`

#### Test Execution
> **Feature File:** [CFG-001](03--configuration/001-default-model-verification.md)

### CFG-002 | Project settings inspection

#### Description
Verify project settings contain language extension patterns.

#### Current Reality
Prompt: `Inspect the CocoIndex Code project settings for language coverage. Capture the evidence needed to prove include_patterns. Return a concise user-facing pass/fail verdict with the main reason.`

`include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.)

#### Test Execution
> **Feature File:** [CFG-002](03--configuration/002-project-settings-inspection.md)

### CFG-003 | Status verification

#### Description
Verify `ccc status` shows indexed file count and chunk count.

#### Current Reality
Prompt: `Check the CocoIndex Code status for this initialized project. Capture the evidence needed to prove Output shows numeric file count > 0 and numeric chunk count > 0. Return a concise user-facing pass/fail verdict with the main reason.`

Output shows numeric file count > 0 and numeric chunk count > 0

#### Test Execution
> **Feature File:** [CFG-003](03--configuration/003-status-verification.md)

---

## 10. DAEMON LIFECYCLE

### DMN-001 | Daemon auto-start

#### Description
Verify daemon starts automatically when a CLI command is issued after it has been stopped.

#### Current Reality
Prompt: `Stop the daemon, then search -- verify auto-start. Capture the evidence needed to prove Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running. Return a concise user-facing pass/fail verdict with the main reason.`

Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running

#### Test Execution
> **Feature File:** [DMN-001](04--daemon-lifecycle/001-daemon-auto-start.md)

### DMN-002 | Daemon status inspection

#### Description
Verify `ccc daemon status` shows version and uptime; PID and socket files exist.

#### Current Reality
Prompt: `Check daemon status and verify runtime files. Capture the evidence needed to prove Step 1: output includes version or uptime information; Step 2: both daemon.pid and daemon.sock files exist. Return a concise user-facing pass/fail verdict with the main reason.`

Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist

#### Test Execution
> **Feature File:** [DMN-002](04--daemon-lifecycle/002-daemon-status-inspection.md)

---

## 11. SKILL ADVISOR INTEGRATION

### ADV-001 | Semantic flag routing

#### Description
Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found.

#### Current Reality
Prompt: `Test skill advisor with semantic search for a deployment query. Capture the evidence needed to prove JSON output is valid; at least one recommendation entry contains !semantic( in its reason field; CocoIndex search was invoked (visible in processing or reason text). Return a concise user-facing pass/fail verdict with the main reason.`

JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text)

#### Test Execution
> **Feature File:** [ADV-001](05--skill-advisor-integration/001-semantic-flag-routing.md)

### ADV-002 | Pre-computed hits routing

#### Description
Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill.

#### Current Reality
Prompt: `Run skill advisor twice for the same deployment query: first without semantic hits, then with pre-computed CocoIndex hits. Capture both JSON outputs and prove sk-git appears in the semantic-hits run, its confidence is higher than in the baseline run, and the boosted reason references semantic input. Return a concise user-facing pass/fail verdict with the main reason.`

Both JSON outputs are valid; `sk-git` appears in the semantic-hits run; its confidence is higher than in the baseline run; boosted `reason` references semantic input

#### Test Execution
> **Feature File:** [ADV-002](05--skill-advisor-integration/002-pre-computed-hits-routing.md)

---

## 12. ERROR HANDLING

### ERR-001 | No results graceful handling

#### Description
Verify search returns empty results gracefully for a nonsense query (no crash, no error).

#### Current Reality
Prompt: `Search for a completely nonsensical term that has no matches. Capture the evidence needed to prove Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace. Return a concise user-facing pass/fail verdict with the main reason.`

Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace

#### Test Execution
> **Feature File:** [ERR-001](06--error-handling/001-no-results-graceful-handling.md)

---

## 13. CODE GRAPH INTEGRATION

These scenarios validate CocoIndex-related behavior when the Spec Kit Memory query-intent classifier, code graph, and recovery surfaces are active. They ensure semantic queries stay on the semantic path without unexpected graph augmentation, hybrid queries append graph context when structural anchors resolve, and the recovery flow exposes CocoIndex status through `session_bootstrap` first and `session_resume` as the detailed follow-up surface.

### INT-001 | Semantic queries route to CocoIndex

#### Description
Verify that semantic/conceptual queries are classified as intent=semantic and stay on the semantic path rather than the structural code graph path.

#### Current Reality
Prompt: `Send "find examples of error handling patterns in this codebase" to memory_context. Confirm intent is classified as semantic, routedBackend is semantic when present, and no graphContext is injected.`

Intent classified as 'semantic', semantic response shape preserved, no structural graph data injected via graphContext.

#### Test Execution
> **Feature File:** [INT-001](07--code-graph-integration/001-query-intent-semantic-routing.md)

### INT-002 | Hybrid queries merge code graph and CocoIndex

#### Description
Verify that hybrid intent queries append structural graph context to the normal semantic response when graph anchors resolve.

#### Current Reality
Prompt: `Send "find all validation functions and explain their error handling approach" to memory_context. Confirm intent=hybrid, routing metadata is present, and graphContext is appended when the graph resolves anchors.`

Intent classified as 'hybrid', response contains routing metadata plus graphContext when graph anchors resolve.

#### Test Execution
> **Feature File:** [INT-002](07--code-graph-integration/002-hybrid-query-merges-results.md)

### INT-003 | Session recovery surfaces include CocoIndex status

#### Description
Verify that `session_bootstrap` exposes CocoIndex availability on the canonical first-call recovery path, and that `session_resume` still exposes the direct CocoIndex field on the detailed resume surface.

#### Current Reality
Prompt: `Call session_bootstrap and session_resume, verify the CocoIndex availability fields on both surfaces, then validate graceful degradation in an environment where the ccc binary is absent.`

Bootstrap exposes `resume.cocoIndex` plus structural context, direct resume exposes `cocoIndex`, and both calls succeed even when the `ccc` binary is unavailable.

#### Test Execution
> **Feature File:** [INT-003](07--code-graph-integration/003-session-resume-includes-cocoindex.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

The playbook complements (not replaces) the upstream pytest modules in `tests/`:

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `test_protocol.py` | Binary serialization round-trips | None (unit-level) |
| `test_config.py` | Device config, defaults, extensions | CFG-001 |
| `test_settings.py` | Settings save/load, language overrides | CFG-002 |
| `test_backward_compat.py` | Legacy env var migration | None (unit-level) |
| `test_cli_helpers.py` | Root detection, .gitignore | CCC-001 |
| `test_client.py` | Connection management, handshake | DMN-001 |
| `test_daemon.py` | Daemon lifecycle, concurrency | DMN-001, DMN-002 |
| `test_e2e.py` | Full CLI workflow (init/index/search) | CCC-001..CCC-005, MCP-001..MCP-007 |
| `test_e2e_daemon.py` | Daemon subprocess lifecycle | DMN-001, DMN-002 |

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CCC-001 | Project initialization | Core CLI Commands | [CCC-001](01--core-cli-commands/001-project-initialization.md) |
| CCC-002 | Full index build | Core CLI Commands | [CCC-002](01--core-cli-commands/002-full-index-build.md) |
| CCC-003 | Incremental index | Core CLI Commands | [CCC-003](01--core-cli-commands/003-incremental-index.md) |
| CCC-004 | CLI search with filters | Core CLI Commands | [CCC-004](01--core-cli-commands/004-cli-search-with-filters.md) |
| CCC-005 | Index reset **(DESTRUCTIVE)** | Core CLI Commands | [CCC-005](01--core-cli-commands/005-index-reset-destructive.md) |
| MCP-001 | Basic semantic search | MCP Search Tool | [MCP-001](02--mcp-search-tool/001-basic-semantic-search.md) |
| MCP-002 | Language filter (single) | MCP Search Tool | [MCP-002](02--mcp-search-tool/002-language-filter-single.md) |
| MCP-003 | Language filter (multi) | MCP Search Tool | [MCP-003](02--mcp-search-tool/003-language-filter-multi.md) |
| MCP-004 | Path filter | MCP Search Tool | [MCP-004](02--mcp-search-tool/004-path-filter.md) |
| MCP-005 | Combined filters | MCP Search Tool | [MCP-005](02--mcp-search-tool/005-combined-filters.md) |
| MCP-006 | Result limit | MCP Search Tool | [MCP-006](02--mcp-search-tool/006-result-limit.md) |
| MCP-007 | No-refresh search | MCP Search Tool | [MCP-007](02--mcp-search-tool/007-no-refresh-search.md) |
| CFG-001 | Default model verification | Configuration | [CFG-001](03--configuration/001-default-model-verification.md) |
| CFG-002 | Project settings inspection | Configuration | [CFG-002](03--configuration/002-project-settings-inspection.md) |
| CFG-003 | Status verification | Configuration | [CFG-003](03--configuration/003-status-verification.md) |
| DMN-001 | Daemon auto-start | Daemon Lifecycle | [DMN-001](04--daemon-lifecycle/001-daemon-auto-start.md) |
| DMN-002 | Daemon status inspection | Daemon Lifecycle | [DMN-002](04--daemon-lifecycle/002-daemon-status-inspection.md) |
| ADV-001 | Semantic flag routing | Skill Advisor Integration | [ADV-001](05--skill-advisor-integration/001-semantic-flag-routing.md) |
| ADV-002 | Pre-computed hits routing | Skill Advisor Integration | [ADV-002](05--skill-advisor-integration/002-pre-computed-hits-routing.md) |
| ERR-001 | No results graceful handling | Error Handling | [ERR-001](06--error-handling/001-no-results-graceful-handling.md) |
| INT-001 | Semantic queries route to CocoIndex | Code Graph Integration | [INT-001](07--code-graph-integration/001-query-intent-semantic-routing.md) |
| INT-002 | Hybrid query result merging | Code Graph Integration | [INT-002](07--code-graph-integration/002-hybrid-query-merges-results.md) |
| INT-003 | Session resume CocoIndex status | Code Graph Integration | [INT-003](07--code-graph-integration/003-session-resume-includes-cocoindex.md) |
