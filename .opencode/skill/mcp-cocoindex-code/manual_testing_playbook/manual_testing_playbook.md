# Manual Test Playbook -- CocoIndex Code

This playbook is the operator-facing manual validation matrix for the mcp-cocoindex-code skill. It covers CLI commands, MCP tool, configuration, daemon lifecycle, skill advisor integration, and error handling with deterministic prompts, exact execution sequences, expected signals, and pass/fail triage guidance.

Canonical source artifacts:
- `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/review_protocol.md`
- `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/subagent_utilization_ledger.md`

## TABLE OF CONTENTS

- [OVERVIEW](#1-overview)
- [GLOBAL PRECONDITIONS](#global-preconditions)
- [GLOBAL EVIDENCE REQUIREMENTS](#global-evidence-requirements)
- [DETERMINISTIC COMMAND NOTATION](#deterministic-command-notation)
- [CORE CLI COMMANDS (`CCC-001..CCC-005`)](#core-cli-commands-ccc-001ccc-005)
- [MCP SEARCH TOOL (`MCP-001..MCP-007`)](#mcp-search-tool-mcp-001mcp-007)
- [CONFIGURATION (`CFG-001..CFG-003`)](#configuration-cfg-001cfg-003)
- [DAEMON LIFECYCLE (`DMN-001..DMN-002`)](#daemon-lifecycle-dmn-001dmn-002)
- [SKILL ADVISOR INTEGRATION (`ADV-001..ADV-002`)](#skill-advisor-integration-adv-001adv-002)
- [ERROR HANDLING (`ERR-001`)](#error-handling-err-001)
- [AUTOMATED TEST CROSS-REFERENCE](#automated-test-cross-reference)
- [FEATURE CATALOG CROSS-REFERENCE INDEX](#feature-catalog-cross-reference-index)

## 1. OVERVIEW

This playbook provides 20 deterministic scenarios across 6 categories validating the mcp-cocoindex-code skill surface: 1 MCP tool (`search`), 6 CLI commands (`init`, `index`, `search`, `status`, `reset`, `daemon`), settings/configuration, daemon lifecycle, skill advisor semantic integration, and error handling.

Coverage note (2026-03-18): scenarios validate the upstream doc overhaul and skill advisor `--semantic`/`--semantic-hits` integration.

## Global Preconditions
1. Working directory is project root (has `.git/`).
2. CocoIndex daemon is running (`ccc` binary available on PATH or at `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`; `ccc status` responds).
3. Project is initialized and indexed (`ccc init && ccc index` completed; `ccc status` shows non-zero file and chunk counts).
4. MCP server configured and accessible (`mcp__cocoindex_code__search` tool available in the current session).
5. Skill advisor script exists at `.opencode/skill/scripts/skill_advisor.py` and is executable with `python3`.
6. **Destructive scenario CCC-005** MUST verify index can be rebuilt (non-production data only).

## Global Evidence Requirements
For every scenario, capture:
1. **Command transcript** -- full tool output or terminal output.
2. **Key output snippet** -- file paths, scores, counts, or other observable metrics.
3. **Scenario verdict** -- `PASS`, `PARTIAL`, or `FAIL` with one-line rationale.

## Deterministic Command Notation
- CLI commands shown as `ccc <subcommand> [args]`.
- MCP tool calls shown as `mcp__cocoindex_code__search({ key: value })`.
- Bash commands shown as `bash: <command>`.
- `->` separates sequential steps within a single scenario.
- All paths are relative to project root unless otherwise noted.

---

## Core CLI Commands (`CCC-001..CCC-005`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-001 | Project initialization | Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates | `Initialize a new CocoIndex Code project in the current directory` | 1. `bash: rm -rf .cocoindex_code/` -> 2. `bash: ccc init` -> 3. Verify `.cocoindex_code/settings.yml` exists: `bash: ls .cocoindex_code/settings.yml` -> 4. `bash: ccc init` (second call, expect "already initialized" or similar) -> 5. `bash: ccc init -f` (force re-create) -> 6. `bash: ls .cocoindex_code/settings.yml` | Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists | Terminal transcript of all 6 steps with timestamps | PASS if all 6 steps produce expected signals; FAIL if `settings.yml` missing after init or `--force` errors | Check `ccc` binary path; verify Python 3.11+; check write permissions on project root |
| CCC-002 | Full index build | Verify `ccc index` reports file count, chunk count, and detected languages | `Build the full semantic index for this project` | 1. `bash: ccc index` -> 2. Capture output containing file count, chunk count, language detection | Output contains numeric counts (e.g., "Files:", "Chunks:", or similar metric lines); output mentions at least one language (e.g., "python", "typescript") | Index build transcript with file/chunk counts highlighted | PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing | Check `.cocoindex_code/settings.yml` include_patterns; verify project has indexable source files; check daemon connectivity |
| CCC-003 | Incremental index | Verify incremental indexing picks up new content and drops deleted content | `Create a temp file, reindex, search for it, delete it, reindex again` | 1. `bash: echo '# Temporary test: xyzzy_incremental_test_marker' > /tmp/ccc_test_incremental.py && cp /tmp/ccc_test_incremental.py ./ccc_test_incremental.py` -> 2. `bash: ccc index` -> 3. `bash: ccc search "xyzzy_incremental_test_marker" --limit 3` -> 4. `bash: rm ./ccc_test_incremental.py` -> 5. `bash: ccc index` -> 6. `bash: ccc search "xyzzy_incremental_test_marker" --limit 3` | Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file | Transcript of all 6 steps; search output from steps 3 and 6 | PASS if step 3 finds the temp file AND step 6 does not; PARTIAL if step 3 finds it but step 6 still returns stale results; FAIL if step 3 does not find the temp file | Force refresh with `ccc index --refresh`; check if daemon cached stale data; verify `.gitignore` is not excluding the temp file |
| CCC-004 | CLI search with filters | Verify `--lang` (repeatable) and `--limit` filters work | `Search for "function" filtered to Python and TypeScript with limit 3` | 1. `bash: ccc search "function" --lang python --lang typescript --limit 3` -> 2. Verify all returned file paths end in `.py` or `.ts`/`.tsx` -> 3. Verify result count is at most 3 | Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3 | Search output with file paths and count | PASS if all results match language filter AND count <= 3; PARTIAL if count correct but one result has wrong extension; FAIL if filter is ignored | Check `--lang` values against supported language code values in tool_reference.md; verify index contains Python/TypeScript files |
| CCC-005 | Index reset **(DESTRUCTIVE)** | Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds | `Reset the CocoIndex Code index completely and rebuild` | 1. `bash: ccc reset --all -f` -> 2. `bash: ccc status` (expect zero/empty counts) -> 3. `bash: ccc init` -> 4. `bash: ccc index` -> 5. `bash: ccc status` (expect non-zero counts) | Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts | Full transcript of all 5 steps; before/after status output | PASS if reset clears index AND rebuild restores non-zero counts; FAIL if reset errors or rebuild produces zero counts | Check `ccc reset` flags; verify `-f` bypasses confirmation; check disk space for rebuild |

---

## MCP Search Tool (`MCP-001..MCP-007`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-001 | Basic semantic search | Verify MCP search returns results with file paths, scores, and line ranges | `Use CocoIndex to search for "fibonacci calculation"` | 1. `mcp__cocoindex_code__search({ "query": "fibonacci calculation" })` | Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string) | MCP tool output showing result structure | PASS if results non-empty AND each result has all 5 fields (file, score, lines, snippet, language); FAIL if empty results or missing fields | Check index status with `ccc status`; verify index is non-empty; try broader query like "math calculation" |
| MCP-002 | Language filter (single) | Verify `languages` parameter restricts results to a single language | `Search CocoIndex for "function" filtered to Python only` | 1. `mcp__cocoindex_code__search({ "query": "function definition", "languages": ["python"] })` -> 2. Verify all returned `file` paths end in `.py` | All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc. | MCP output with file paths highlighted | PASS if all results are `.py` files; FAIL if any non-Python file appears | Verify `languages` parameter accepts list format; check index has Python files with `ccc status` |
| MCP-003 | Language filter (multi) | Verify `languages` parameter accepts multiple languages | `Search CocoIndex for "function" in both Python and JavaScript` | 1. `mcp__cocoindex_code__search({ "query": "function definition", "languages": ["python", "javascript"] })` -> 2. Verify returned files are `.py` or `.js`/`.mjs`/`.cjs` only | Results contain mix of `.py` and `.js` files; no other extensions | MCP output with file extensions annotated | PASS if all results are Python or JavaScript files AND at least one of each appears; PARTIAL if all results are one language only but correct; FAIL if wrong language appears | Check language code values (use "python", "javascript"); verify index has both file types |
| MCP-004 | Path filter | Verify `paths` parameter restricts results to a specific directory | `Search CocoIndex for "skill" only under .opencode/skill/` | 1. `mcp__cocoindex_code__search({ "query": "skill configuration", "paths": [".opencode/skill/"] })` -> 2. Verify all returned file paths start with `.opencode/skill/` | All result paths begin with `.opencode/skill/`; no results from other directories | MCP output with file paths | PASS if all results are under `.opencode/skill/`; FAIL if any result is outside that path | Verify path format (relative, with trailing slash); check if path is indexed |
| MCP-005 | Combined filters | Verify `languages`, `paths`, and `num_results` work together | `Search CocoIndex for "config" in Python under src/ with 2 results` | 1. `mcp__cocoindex_code__search({ "query": "configuration loading", "languages": ["python"], "paths": [".opencode/"], "num_results": 2 })` -> 2. Verify results are Python files under `.opencode/` and count <= 2 | Result count <= 2; all files are `.py`; all paths start with `.opencode/` | MCP output showing filtered results | PASS if count <= 2 AND all filters satisfied; FAIL if any filter is ignored | Test filters individually to isolate which one fails; check parameter types (list vs string) |
| MCP-006 | Result limit | Verify `num_results` controls output count | `Compare CocoIndex search with 1 result vs 10 results` | 1. `mcp__cocoindex_code__search({ "query": "error handling", "num_results": 1 })` -> 2. Count results (expect exactly 1) -> 3. `mcp__cocoindex_code__search({ "query": "error handling", "num_results": 10 })` -> 4. Count results (expect up to 10) | Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count | Side-by-side result counts from both calls | PASS if step 2 returns exactly 1 AND step 4 returns more than 1 (up to 10); FAIL if `num_results` is ignored | Verify `num_results` parameter type is integer; check default (5) if parameter omitted |
| MCP-007 | No-refresh search | Verify `refresh_index: false` skips reindexing and still returns results | `Search CocoIndex for "test" without triggering a reindex` | 1. `mcp__cocoindex_code__search({ "query": "test utilities", "refresh_index": false })` -> 2. Verify results are returned AND no reindex was triggered | Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice) | MCP output with timing noted; absence of `IndexWaitingNotice` in output | PASS if results returned without reindex delay; PARTIAL if results returned but unclear whether reindex was skipped; FAIL if no results or explicit reindex triggered | Compare timing with `refresh_index: true`; check daemon logs at `~/.cocoindex_code/daemon.log` for index activity |

---

## Configuration (`CFG-001..CFG-003`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-001 | Default model verification | Verify global settings contain the documented default embedding model | `Check the CocoIndex Code global settings for the embedding model` | 1. `bash: cat ~/.cocoindex_code/global_settings.yml` -> 2. Locate `embedding.provider` and `embedding.model` fields | Settings file exists; `embedding.model` is one of the documented models: `all-MiniLM-L6-v2` (local) or a LiteLLM model like `voyage/voyage-code-3` | Contents of `global_settings.yml` with embedding fields highlighted | PASS if embedding model field exists and matches a documented model; FAIL if file missing or model field absent | Check `COCOINDEX_CODE_DIR` env var; verify `~/.cocoindex_code/` directory exists; run `ccc init` if needed |
| CFG-002 | Project settings inspection | Verify project settings contain language extension patterns | `Inspect the CocoIndex Code project settings for language coverage` | 1. `bash: cat .cocoindex_code/settings.yml` -> 2. Locate `include_patterns` field -> 3. Count unique file extension patterns | `include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.) | Contents of `settings.yml` with include_patterns section; count of extension patterns | PASS if `include_patterns` contains patterns for 28+ language extensions (matching supported languages list); PARTIAL if patterns present but fewer than 28; FAIL if `include_patterns` missing | Run `ccc init -f` to regenerate defaults; compare against supported languages in tool_reference.md |
| CFG-003 | Status verification | Verify `ccc status` shows indexed file count, chunk count, embedding model, and project root | `Check the full CocoIndex Code status` | 1. `bash: ccc status` -> 2. Verify output contains: file count, chunk count, embedding model name, project root path | Output shows numeric file count > 0; numeric chunk count > 0; embedding model name matches `global_settings.yml`; project root matches current directory | Full `ccc status` output | PASS if all 4 fields present and non-zero/non-empty; PARTIAL if some fields present but others missing; FAIL if status command errors or shows zero counts | Run `ccc index` to populate index; check daemon connectivity; verify `.cocoindex_code/` exists |

---

## Daemon Lifecycle (`DMN-001..DMN-002`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-001 | Daemon auto-start | Verify daemon starts automatically when a CLI command is issued after it has been stopped | `Stop the daemon, then search -- verify auto-start` | 1. `bash: ccc daemon stop` -> 2. `bash: sleep 2` -> 3. `bash: ccc search "test" --limit 1` -> 4. Verify search returns results (daemon restarted) -> 5. `bash: ccc daemon status` (confirm running) | Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running | Transcript of all 5 steps; daemon status output | PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped | Check `~/.cocoindex_code/daemon.pid` for stale PID; check `daemon.log` for startup errors; verify port/socket availability |
| DMN-002 | Daemon status inspection | Verify `ccc daemon status` shows version and uptime; PID and socket files exist | `Check daemon status and verify runtime files` | 1. `bash: ccc daemon status` -> 2. `bash: ls ~/.cocoindex_code/daemon.pid ~/.cocoindex_code/daemon.sock` | Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist | Daemon status output; file listing | PASS if daemon status reports running AND both PID/socket files exist; PARTIAL if status reports running but one file missing; FAIL if daemon not running or both files missing | Start daemon with `ccc daemon start`; check `daemon.log` for errors; verify `~/.cocoindex_code/` permissions |

---

## Skill Advisor Integration (`ADV-001..ADV-002`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ADV-001 | Semantic flag routing | Verify `--semantic` triggers CocoIndex search and `!semantic(...)` appears in reason field when skill references found | `Test skill advisor with semantic search for a deployment query` | 1. `bash: python3 .opencode/skill/scripts/skill_advisor.py "deploy to production" --semantic --show-rejections` -> 2. Inspect JSON output for `reason` fields containing `!semantic(...)` notation | JSON output is valid; at least one recommendation entry contains `!semantic(` in its `reason` field; CocoIndex search was invoked (visible in processing or reason text) | Full JSON output of skill_advisor.py; highlighted `reason` fields with `!semantic` notation | PASS if valid JSON returned AND at least one `reason` contains `!semantic(`; PARTIAL if JSON valid but no `!semantic` (CocoIndex may not have found skill refs); FAIL if command errors or invalid JSON | Verify `ccc` binary is on PATH (required for `--semantic`); check daemon is running; try `ccc search "deploy" --limit 3` directly to confirm CocoIndex works |
| ADV-002 | Pre-computed hits routing | Verify `--semantic-hits` with JSON array boosts confidence for the referenced skill | `Test skill advisor with pre-computed CocoIndex hits` | 1. `bash: python3 .opencode/skill/scripts/skill_advisor.py "deploy to production" --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]' --show-rejections` -> 2. Inspect JSON output: `sk-git` should appear with boosted confidence | JSON output is valid; `sk-git` appears in recommendations; its confidence is higher than without semantic hits (compare mentally with a plain run); `reason` references semantic boost | Full JSON output; `sk-git` recommendation entry with confidence score | PASS if `sk-git` appears in recommendations with confidence reflecting semantic boost; PARTIAL if `sk-git` appears but confidence unchanged from baseline; FAIL if command errors or `sk-git` absent | Verify `--semantic-hits` JSON is valid (must be array of objects with `path` and `score`); check skill_advisor.py `SEMANTIC_BOOST_MULTIPLIER` config; run without `--semantic-hits` to compare baseline |

---

## Error Handling (`ERR-001`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ERR-001 | No results graceful handling | Verify search returns empty results gracefully for a nonsense query (no crash, no error) | `Search for a completely nonsensical term that has no matches` | 1. `mcp__cocoindex_code__search({ "query": "xyzzy_nonexistent_symbol_99999" })` -> 2. Verify response is a valid empty result (empty array or "no results" message, NOT an error or crash) | Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace | MCP tool output showing empty/zero results | PASS if empty results returned with no error; FAIL if tool throws an exception, crashes, or returns an error message | Check daemon logs for unhandled exceptions; verify index exists; test with `ccc search "xyzzy_nonexistent_symbol_99999" --limit 1` via CLI for comparison |

---

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

---

## Feature Catalog Cross-Reference Index

| Feature ID | Feature Name | Category |
|---|---|---|
| CCC-001 | Project initialization | Core CLI Commands |
| CCC-002 | Full index build | Core CLI Commands |
| CCC-003 | Incremental index | Core CLI Commands |
| CCC-004 | CLI search with filters | Core CLI Commands |
| CCC-005 | Index reset (DESTRUCTIVE) | Core CLI Commands |
| MCP-001 | Basic semantic search | MCP Search Tool |
| MCP-002 | Language filter (single) | MCP Search Tool |
| MCP-003 | Language filter (multi) | MCP Search Tool |
| MCP-004 | Path filter | MCP Search Tool |
| MCP-005 | Combined filters | MCP Search Tool |
| MCP-006 | Result limit | MCP Search Tool |
| MCP-007 | No-refresh search | MCP Search Tool |
| CFG-001 | Default model verification | Configuration |
| CFG-002 | Project settings inspection | Configuration |
| CFG-003 | Status verification | Configuration |
| DMN-001 | Daemon auto-start | Daemon Lifecycle |
| DMN-002 | Daemon status inspection | Daemon Lifecycle |
| ADV-001 | Semantic flag routing | Skill Advisor Integration |
| ADV-002 | Pre-computed hits routing | Skill Advisor Integration |
| ERR-001 | No results graceful handling | Error Handling |
