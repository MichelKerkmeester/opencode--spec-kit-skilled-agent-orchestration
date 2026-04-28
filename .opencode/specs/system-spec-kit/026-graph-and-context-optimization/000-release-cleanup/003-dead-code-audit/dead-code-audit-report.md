# Dead-Code & Disconnected-Code Audit Report

## Executive Summary

This audit covered `.opencode/skill/system-spec-kit/` with the hard scope guard intact. I audited 2,648 owned code files after excluding third-party `node_modules` and keeping generated `dist/` artifacts in scope where the packet explicitly called them out. The strongest signal came from `tsc --noEmit --noUnusedLocals --noUnusedParameters`: 13 concrete unused-code diagnostics, all small local deletes. The normal `tsc --noEmit` sanity check passed cleanly.

No disconnected MCP handlers or unwired tool modules were found. The main risk area is not dead code but dynamically reachable runtime hook code: Claude, Gemini, Codex, and Copilot hook entrypoints are invoked by settings files and runtime command strings, so they are classified as `dynamic-only-reference` and should be kept unless a future hook-removal packet proves the runtime wiring is gone.

| Metric | Count | Evidence |
|---|---:|---|
| Owned code files audited | 2,648 | `find .opencode/skill/system-spec-kit -path '*/node_modules' -prune ...` |
| TypeScript files | 1,876 | extension count |
| JavaScript files | 676 | extension count |
| CJS files | 20 | extension count |
| Python files | 10 | extension count |
| Shell files | 66 | extension count |
| MCP tool names enumerated | 52 | `tool-schemas.ts`, `tools/index.ts`, advisor tool descriptors |
| Vitest files walked | 476 | `mcp_server/tests/**/*.vitest.ts` |
| Dead findings | 13 | `tsc --noUnusedLocals --noUnusedParameters` |
| Disconnected findings | 0 | handler/tool registry cross-check |
| Dynamic-only-reference findings | 15 | hook settings and hook docs |
| False-positive findings | 5 | manual classification |
| Stale `scripts/dist` files | 0 / 244 | paired source check |
| Real stale-test imports | 0 | corrected resolver excludes string fixtures and maps `.js` imports to `.ts` |

## Reachability Anchor Enumeration

### 1. MCP Tool Registrations

`mcp_server/context-server.ts` imports `TOOL_DEFINITIONS` and `dispatchTool`; `mcp_server/tools/index.ts:85` builds the dispatcher list and `mcp_server/tools/index.ts:98` routes calls by tool name. The following tool names are alive:

| Dispatcher | Tool names |
|---|---|
| `mcp_server/tools/context-tools.ts` | `memory_context` |
| `mcp_server/tools/memory-tools.ts` | `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`, `memory_list`, `memory_stats`, `memory_health`, `memory_delete`, `memory_update`, `memory_validate`, `memory_bulk_delete` |
| `mcp_server/tools/checkpoint-tools.ts` | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` |
| `mcp_server/tools/causal-tools.ts` | `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` |
| `mcp_server/tools/lifecycle-tools.ts` | `task_preflight`, `task_postflight`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_index_scan`, `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`, `session_health`, `session_resume`, `session_bootstrap` |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `detect_changes`, `ccc_status`, `ccc_reindex`, `ccc_feedback` |
| `mcp_server/tools/skill-graph-tools.ts` | `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` |
| `mcp_server/tools/index.ts` advisor dispatch | `advisor_recommend`, `advisor_status`, `advisor_validate` |
| `mcp_server/tools/index.ts` coverage graph dispatch | `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`, `deep_loop_graph_convergence` |

### 2. CLI Scripts

CLI scripts under `scripts/**/*.{ts,cjs,js,sh}` are reachable through a mix of package scripts, command markdown, and documented operator commands. Key anchors include `scripts/dist/memory/generate-context.js`, `scripts/spec/validate.sh`, `scripts/spec/create.sh`, `scripts/dist/graph/backfill-graph-metadata.js`, and `scripts/evals/*.ts`. The full state file records the script anchor as a counted set because there are 783 owned script files when `scripts/dist`, test helpers, and shell utilities are included.

### 3. Hook Registries

Hook loading is not a directory glob inside the MCP server. It is external runtime command registration plus static imports between hook modules. Evidence:

| Runtime | Evidence | Reachability result |
|---|---|---|
| Claude | `.claude/settings.local.json:31`, `:43`, `:55`, `:67` | `dist/hooks/claude/*.js` entrypoints are runtime-reachable |
| Codex | `.codex/settings.json:8`, `:19`, `:30` | `dist/hooks/codex/*.js` entrypoints are runtime-reachable |
| Gemini | `.gemini/settings.json:77`, `:89`, `:101`, `:107`, `:119` | `dist/hooks/gemini/*.js` entrypoints are runtime-reachable |
| Copilot | `mcp_server/hooks/copilot/README.md:18` and `references/hooks/skill-advisor-hook.md:60` | hook helpers update managed custom instructions |

### 4. Agent/Command Markdown References

I searched `.opencode/agent/`, `.opencode/command/spec_kit/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` for symbol/path references. Notable alive-by-markdown paths include `generate-context.js`, `validate.sh`, `context-server.js`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, and `dist/hooks/*`.

### 5. API Barrel Exports

`mcp_server/api/*.ts` exists and is an intentional public surface. `mcp_server/api/index.ts:4` states the API is public, and `mcp_server/package.json` exports `./api` and `./api/*`. Barrel exports are therefore alive unless a later package-boundary audit removes the package export.

### 6. Test Imports

I walked 476 `mcp_server/tests/**/*.vitest.ts` files. Relative `.js` imports were resolved to paired `.ts` sources because this package compiles ESM TypeScript that imports `.js` at runtime. After that correction, the only apparent broken imports were string fixtures in test contents, not actual import statements; real stale-test imports found: none.

## Category: `dead`

These are high-confidence local deletes. All were emitted by `tsc --noEmit --noUnusedLocals --noUnusedParameters`; normal `tsc --noEmit` passes, so the diagnostics are unused-code noise rather than compile breakage.

| Finding | Evidence | Recommended action | Safety |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:97` `memoryParser` | The namespace import is declared but never read in `context-server.ts`. Other files legitimately import `memory-parser`, so only this import is dead. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:89` `DEFAULT_TOKEN_CAP` | Local constant is not referenced in the Codex hook file; similar constants in advisor renderer files are separate live declarations. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:950` `isMarkdownOrTextFile` | Private helper has no callers in the parser module or wider audit tree. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:624` `deleteCausalEdgesForMemoryIds` | Private helper is not invoked; nearby cleanup now delegates through other causal-edge deletion paths. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:416` `failedCount` | The local count is computed after the P0 check array but never read; the returned response uses `regressionSuite.failedCount` instead. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:6` `SkillGraphLease` | Type import is unused; `acquireSkillGraphLease` remains live. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:6` `statSync` | `statSync` is imported from `node:fs` but unused in this file. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts:6` `dirname` | `dirname` is imported from `node:path` but unused; other path helpers in the same import remain live. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts:45` `SOURCE_CATEGORIES` | Constant is declared but no later code reads it. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/generation.ts:12` `join` | `join` is imported from `node:path` but unused; `dirname` and `resolve` remain live. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:876` `content` | Test-local variable is declared but never read. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts:8` `vi` | `vi` is imported from Vitest but unused in this test file. | delete | high-confidence-delete |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:5` `existsSync` | `existsSync` is imported from `node:fs` but unused in this test file. | delete | high-confidence-delete |

## Category: `disconnected`

None found.

I did not find a handler/tool/hook source file that has the correct exported shape but is missing from the relevant dispatcher or runtime registration. Coverage graph handlers are registered in `mcp_server/tools/index.ts`; memory, checkpoint, lifecycle, causal, code graph, skill graph, advisor, and session handlers all have registry or test-import anchors.

## Category: `dynamic-only-reference`

These are intentionally not deletion candidates. They are reachable by runtime command strings, generated `dist` paths, wrapper configuration, or hook docs rather than normal static imports.

| Finding | Evidence | Recommended action | Safety |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1` | Runtime command references compiled `dist/hooks/claude/user-prompt-submit.js` in `.claude/settings.local.json:31`; source is the paired TypeScript. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:1` | Runtime command references compiled `dist/hooks/claude/compact-inject.js` in `.claude/settings.local.json:43`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:1` | Runtime command references compiled `dist/hooks/claude/session-prime.js` in `.claude/settings.local.json:55`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:1` | Runtime command references compiled `dist/hooks/claude/session-stop.js` in `.claude/settings.local.json:67`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:1` | Runtime command references compiled `dist/hooks/codex/session-start.js` in `.codex/settings.json:8`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1` | Runtime command references compiled `dist/hooks/codex/user-prompt-submit.js` in `.codex/settings.json:19`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:1` | Runtime command references compiled `dist/hooks/codex/pre-tool-use.js` in `.codex/settings.json:30`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:1` | Hook reference documents this as the Codex fallback when native hooks are unavailable. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:1` | Runtime command references compiled `dist/hooks/gemini/session-prime.js` in `.gemini/settings.json:77`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:1` | Runtime command references compiled `dist/hooks/gemini/compact-cache.js` in `.gemini/settings.json:89`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:1` | Runtime command references compiled `dist/hooks/gemini/compact-inject.js` in `.gemini/settings.json:101`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:1` | Runtime command references compiled `dist/hooks/gemini/user-prompt-submit.js` in `.gemini/settings.json:107`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:1` | Runtime command references compiled `dist/hooks/gemini/session-stop.js` in `.gemini/settings.json:119`. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:1` | Copilot README documents this helper as the startup managed-instructions writer. | keep-with-rationale | needs-investigation |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1` | Copilot README documents this helper as the prompt-time managed-instructions writer. | keep-with-rationale | needs-investigation |

## Category: `false-positive`

| Finding | Evidence | Recommended action | Safety |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:11` API barrel exports | `mcp_server/api/index.ts:4` marks the file as public, and package exports expose `./api`; scripts import from this surface instead of internals. | keep-with-rationale | keep |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:85` dispatcher array | The array is consumed by `dispatchTool` at `tools/index.ts:98`; static export detectors can misread dispatch tables as unused. | keep-with-rationale | keep |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4` hook barrel | `context-server.ts` imports from `./hooks/index.js`; this is an active runtime barrel, not orphan code. | keep-with-rationale | keep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:265` `./types` | The apparent import is a string inside a markdown/code fixture, not a module import. | keep-with-rationale | keep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/lazy-loading.vitest.ts:85` `./memory-search` | The apparent import is an expected source string asserted by the lazy-loading test, not a broken import. | keep-with-rationale | keep |

## Per-Directory Summary

| Directory | Files audited | Dead | Disconnected | Dynamic-only | False-positive |
|---|---:|---:|---:|---:|---:|
| `mcp_server/handlers/` | 57 | 0 | 0 | 0 | 0 |
| `mcp_server/lib/` | 211 | 2 | 0 | 0 | 0 |
| `mcp_server/code_graph/` | 46 | 1 | 0 | 0 | 0 |
| `mcp_server/hooks/` | 27 | 1 | 0 | 15 | 1 |
| `mcp_server/tools/` | 8 | 0 | 0 | 0 | 1 |
| `mcp_server/skill_advisor/` | 113 | 7 | 0 | 0 | 0 |
| `mcp_server/api/` | 6 | 0 | 0 | 0 | 1 |
| `mcp_server/tests/` | 481 | 3 | 0 | 0 | 2 |
| `scripts/` | 783 | 0 | 0 | 0 | 0 |
| `shared/` | 92 | 0 | 0 | 0 | 0 |
| `skill-root/` | 2 | 0 | 0 | 0 | 0 |

## Tooling And Replication Appendix

Run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

| Purpose | Command | Result |
|---|---|---|
| ts-prune version | `cd .opencode/skill/system-spec-kit/mcp_server && npx ts-prune --version` | failed: package not installed locally; network blocked with `ENOTFOUND registry.npmjs.org` |
| knip fallback version | `cd .opencode/skill/system-spec-kit/mcp_server && npx knip --version` | failed: package not installed locally; network blocked with `ENOTFOUND registry.npmjs.org` |
| TypeScript version | `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --version` | `Version 5.9.3` |
| ripgrep version | `rg --version` | `ripgrep 15.1.0`, PCRE2 10.45 |
| normal typecheck | `../node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json` from `mcp_server/` | exit 0 |
| unused-code scan | `../node_modules/.bin/tsc --noEmit --composite false --noUnusedLocals --noUnusedParameters -p tsconfig.json` from `mcp_server/` | exit 2 with 13 unused-code diagnostics |
| stale dist | Node script: for each `scripts/dist/*.{js,d.ts}`, require paired `scripts/*.ts` source | 244 checked, 0 stale |
| stale tests | Node script: parse `*.vitest.ts` import specifiers, map relative `.js` to paired `.ts`, exclude fixture strings | 476 tests, 0 real broken imports |
| markdown refs | `rg -n "context-server\|generate-context\|validate\.sh\|dist/hooks" .opencode/agent .opencode/command/spec_kit .claude/agents .codex/agents .gemini/agents ...` | found markdown and settings anchors for scripts and hooks |

### Limitations

`ts-prune` and `knip` could not run because they were not locally installed and network fetches are blocked in this session. I compensated with TypeScript unused diagnostics, registry reads, import/path greps, stale-dist pairing, stale-test import resolution, and markdown/runtime hook searches. That is strong enough for the 13 local dead-code findings, but it is deliberately conservative for any runtime-loaded hook or public barrel surface.
