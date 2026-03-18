# Manual Test Playbook -- CocoIndex Code

This playbook package adopts the Feature Catalog split-document pattern for the `mcp-cocoindex-code` skill. The root document acts as the directory and coverage surface, while per-feature execution detail lives in `snippets/`.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `review_protocol.md`
- `subagent_utilization_ledger.md`
- `snippets/`

## TABLE OF CONTENTS

- [OVERVIEW](#1-overview)
- [GLOBAL PRECONDITIONS](#global-preconditions)
- [GLOBAL EVIDENCE REQUIREMENTS](#global-evidence-requirements)
- [DETERMINISTIC COMMAND NOTATION](#deterministic-command-notation)
- [CORE CLI COMMANDS](#core-cli-commands)
- [MCP SEARCH TOOL](#mcp-search-tool)
- [CONFIGURATION](#configuration)
- [DAEMON LIFECYCLE](#daemon-lifecycle)
- [SKILL ADVISOR INTEGRATION](#skill-advisor-integration)
- [ERROR HANDLING](#error-handling)
- [AUTOMATED TEST CROSS-REFERENCE](#automated-test-cross-reference)
- [FEATURE CATALOG CROSS-REFERENCE INDEX](#feature-catalog-cross-reference-index)

## 1. OVERVIEW

This playbook provides 20 deterministic scenarios across 6 categories validating the `mcp-cocoindex-code` skill surface. Each feature keeps its original ID and links to a dedicated snippet with the full execution contract.

Coverage note (2026-03-18): scenarios validate the upstream doc overhaul and skill advisor `--semantic` and `--semantic-hits` integration.

## Global Preconditions
1. Working directory is project root (has `.git/`).
2. CocoIndex daemon is running (`ccc` binary available on PATH or at `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`; `ccc status` responds).
3. Project is initialized and indexed (`ccc init && ccc index` completed; `ccc status` shows non-zero file and chunk counts).
4. MCP server configured and accessible (`mcp__cocoindex_code__search` tool available in the current session).
5. Skill advisor script exists at `.opencode/skill/scripts/skill_advisor.py` and is executable with `python3`.
6. **Destructive scenario `CCC-005`** MUST verify index can be rebuilt (non-production data only).

## Global Evidence Requirements
1. **Command transcript** -- full tool output or terminal output.
2. **Key output snippet** -- file paths, scores, counts, or other observable metrics.
3. **Scenario verdict** -- `PASS`, `PARTIAL`, or `FAIL` with one-line rationale.

## Deterministic Command Notation
- CLI commands shown as `ccc <subcommand> [args]`.
- MCP tool calls shown as `mcp__cocoindex_code__search({ key: value })`.
- Bash commands shown as `bash: <command>`.
- `->` separates sequential steps within a single scenario.
- All paths are relative to project root unless otherwise noted.

## CORE CLI COMMANDS

### CCC-001 | Project initialization

#### Description
Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates.

#### Current Reality
Prompt: `Initialize a new CocoIndex Code project in the current directory`

Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists

#### Test Execution
> **Snippet:** [CCC-001](snippets/01--core-cli-commands/001-project-initialization.md)

### CCC-002 | Full index build

#### Description
Verify `ccc index` reports file count, chunk count, and detected languages.

#### Current Reality
Prompt: `Build the full semantic index for this project`

Output contains numeric counts (e.g., "Files:", "Chunks:", or similar metric lines); output mentions at least one language (e.g., "python", "typescript")

#### Test Execution
> **Snippet:** [CCC-002](snippets/01--core-cli-commands/002-full-index-build.md)

### CCC-003 | Incremental index

#### Description
Verify incremental indexing picks up new content and drops deleted content.

#### Current Reality
Prompt: `Create a temp file, reindex, search for it, delete it, reindex again`

Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file

#### Test Execution
> **Snippet:** [CCC-003](snippets/01--core-cli-commands/003-incremental-index.md)

### CCC-004 | CLI search with filters

#### Description
Verify `--lang` (repeatable) and `--limit` filters work.

#### Current Reality
Prompt: `Search for "function" filtered to Python and TypeScript with limit 3`

Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3

#### Test Execution
> **Snippet:** [CCC-004](snippets/01--core-cli-commands/004-cli-search-with-filters.md)

### CCC-005 | Index reset **(DESTRUCTIVE)**

#### Description
Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds.

#### Current Reality
Prompt: `Reset the CocoIndex Code index completely and rebuild`

Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts

#### Test Execution
> **Snippet:** [CCC-005](snippets/01--core-cli-commands/005-index-reset-destructive.md)

## MCP SEARCH TOOL

### MCP-001 | Basic semantic search

#### Description
Verify MCP search returns results with file paths, scores, and line ranges.

#### Current Reality
Prompt: `Use CocoIndex to search for "fibonacci calculation"`

Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string)

#### Test Execution
> **Snippet:** [MCP-001](snippets/02--mcp-search-tool/001-basic-semantic-search.md)

### MCP-002 | Language filter (single)

#### Description
Verify `languages` parameter restricts results to a single language.

#### Current Reality
Prompt: `Search CocoIndex for "function" filtered to Python only`

All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc.

#### Test Execution
> **Snippet:** [MCP-002](snippets/02--mcp-search-tool/002-language-filter-single.md)

### MCP-003 | Language filter (multi)

#### Description
Verify `languages` parameter accepts multiple languages.

#### Current Reality
Prompt: `Search CocoIndex for "function" in both Python and JavaScript`

Results contain mix of `.py` and `.js` files; no other extensions

#### Test Execution
> **Snippet:** [MCP-003](snippets/02--mcp-search-tool/003-language-filter-multi.md)

### MCP-004 | Path filter

#### Description
Verify `paths` parameter restricts results to a specific directory.

#### Current Reality
Prompt: `Search CocoIndex for "skill" only under .opencode/skill/`

All result paths begin with `.opencode/skill/`; no results from other directories

#### Test Execution
> **Snippet:** [MCP-004](snippets/02--mcp-search-tool/004-path-filter.md)

### MCP-005 | Combined filters

#### Description
Verify `languages`, `paths`, and `num_results` work together.

#### Current Reality
Prompt: `Search CocoIndex for "config" in Python under src/ with 2 results`

Result count <= 2; all files are `.py`; all paths start with `.opencode/`

#### Test Execution
> **Snippet:** [MCP-005](snippets/02--mcp-search-tool/005-combined-filters.md)

### MCP-006 | Result limit

#### Description
Verify `num_results` controls output count.

#### Current Reality
Prompt: `Compare CocoIndex search with 1 result vs 10 results`

Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count

#### Test Execution
> **Snippet:** [MCP-006](snippets/02--mcp-search-tool/006-result-limit.md)

### MCP-007 | No-refresh search

#### Description
Verify `refresh_index: false` skips reindexing and still returns results.

#### Current Reality
Prompt: `Search CocoIndex for "test" without triggering a reindex`

Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice)

#### Test Execution
> **Snippet:** [MCP-007](snippets/02--mcp-search-tool/007-no-refresh-search.md)

## CONFIGURATION

### CFG-001 | Default model verification

#### Description
Verify global settings contain the documented default embedding model.

#### Current Reality
Prompt: `Check the CocoIndex Code global settings for the embedding model`

Settings file exists; `embedding.model` is one of the documented models: `all-MiniLM-L6-v2` (local) or a LiteLLM model like `voyage/voyage-code-3`

#### Test Execution
> **Snippet:** [CFG-001](snippets/03--configuration/001-default-model-verification.md)

### CFG-002 | Project settings inspection

#### Description
Verify project settings contain language extension patterns.

#### Current Reality
Prompt: `Inspect the CocoIndex Code project settings for language coverage`

`include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.)

#### Test Execution
> **Snippet:** [CFG-002](snippets/03--configuration/002-project-settings-inspection.md)

### CFG-003 | Status verification

#### Description
Verify `ccc status` shows indexed file count, chunk count, embedding model, and project root.

#### Current Reality
Prompt: `Check the full CocoIndex Code status`

Output shows numeric file count > 0; numeric chunk count > 0; embedding model name matches `global_settings.yml`; project root matches current directory

#### Test Execution
> **Snippet:** [CFG-003](snippets/03--configuration/003-status-verification.md)

## DAEMON LIFECYCLE

### DMN-001 | Daemon auto-start

#### Description
Verify daemon starts automatically when a CLI command is issued after it has been stopped.

#### Current Reality
Prompt: `Stop the daemon, then search -- verify auto-start`

Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running

#### Test Execution
> **Snippet:** [DMN-001](snippets/04--daemon-lifecycle/001-daemon-auto-start.md)

### DMN-002 | Daemon status inspection

#### Description
Verify `ccc daemon status` shows version and uptime; PID and socket files exist.

#### Current Reality
Prompt: `Check daemon status and verify runtime files`

Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist

#### Test Execution
> **Snippet:** [DMN-002](snippets/04--daemon-lifecycle/002-daemon-status-inspection.md)

## SKILL ADVISOR INTEGRATION

### ADV-001 | Semantic flag routing

#### Description
Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found.

#### Current Reality
Prompt: `Test skill advisor with semantic search for a deployment query`

JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text)

#### Test Execution
> **Snippet:** [ADV-001](snippets/05--skill-advisor-integration/001-semantic-flag-routing.md)

### ADV-002 | Pre-computed hits routing

#### Description
Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill.

#### Current Reality
Prompt: `Test skill advisor with pre-computed CocoIndex hits`

JSON output is valid; `sk-git` appears in recommendations; its confidence is higher than without semantic hits (compare mentally with a plain run); `reason` references semantic boost

#### Test Execution
> **Snippet:** [ADV-002](snippets/05--skill-advisor-integration/002-pre-computed-hits-routing.md)

## ERROR HANDLING

### ERR-001 | No results graceful handling

#### Description
Verify search returns empty results gracefully for a nonsense query (no crash, no error).

#### Current Reality
Prompt: `Search for a completely nonsensical term that has no matches`

Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace

#### Test Execution
> **Snippet:** [ERR-001](snippets/06--error-handling/001-no-results-graceful-handling.md)

## Automated Test Cross-Reference

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

## Feature Catalog Cross-Reference Index

| Feature ID | Feature Name | Category | Snippet |
|---|---|---|---|
| CCC-001 | Project initialization | Core CLI Commands | [CCC-001](snippets/01--core-cli-commands/001-project-initialization.md) |
| CCC-002 | Full index build | Core CLI Commands | [CCC-002](snippets/01--core-cli-commands/002-full-index-build.md) |
| CCC-003 | Incremental index | Core CLI Commands | [CCC-003](snippets/01--core-cli-commands/003-incremental-index.md) |
| CCC-004 | CLI search with filters | Core CLI Commands | [CCC-004](snippets/01--core-cli-commands/004-cli-search-with-filters.md) |
| CCC-005 | Index reset **(DESTRUCTIVE)** | Core CLI Commands | [CCC-005](snippets/01--core-cli-commands/005-index-reset-destructive.md) |
| MCP-001 | Basic semantic search | MCP Search Tool | [MCP-001](snippets/02--mcp-search-tool/001-basic-semantic-search.md) |
| MCP-002 | Language filter (single) | MCP Search Tool | [MCP-002](snippets/02--mcp-search-tool/002-language-filter-single.md) |
| MCP-003 | Language filter (multi) | MCP Search Tool | [MCP-003](snippets/02--mcp-search-tool/003-language-filter-multi.md) |
| MCP-004 | Path filter | MCP Search Tool | [MCP-004](snippets/02--mcp-search-tool/004-path-filter.md) |
| MCP-005 | Combined filters | MCP Search Tool | [MCP-005](snippets/02--mcp-search-tool/005-combined-filters.md) |
| MCP-006 | Result limit | MCP Search Tool | [MCP-006](snippets/02--mcp-search-tool/006-result-limit.md) |
| MCP-007 | No-refresh search | MCP Search Tool | [MCP-007](snippets/02--mcp-search-tool/007-no-refresh-search.md) |
| CFG-001 | Default model verification | Configuration | [CFG-001](snippets/03--configuration/001-default-model-verification.md) |
| CFG-002 | Project settings inspection | Configuration | [CFG-002](snippets/03--configuration/002-project-settings-inspection.md) |
| CFG-003 | Status verification | Configuration | [CFG-003](snippets/03--configuration/003-status-verification.md) |
| DMN-001 | Daemon auto-start | Daemon Lifecycle | [DMN-001](snippets/04--daemon-lifecycle/001-daemon-auto-start.md) |
| DMN-002 | Daemon status inspection | Daemon Lifecycle | [DMN-002](snippets/04--daemon-lifecycle/002-daemon-status-inspection.md) |
| ADV-001 | Semantic flag routing | Skill Advisor Integration | [ADV-001](snippets/05--skill-advisor-integration/001-semantic-flag-routing.md) |
| ADV-002 | Pre-computed hits routing | Skill Advisor Integration | [ADV-002](snippets/05--skill-advisor-integration/002-pre-computed-hits-routing.md) |
| ERR-001 | No results graceful handling | Error Handling | [ERR-001](snippets/06--error-handling/001-no-results-graceful-handling.md) |
