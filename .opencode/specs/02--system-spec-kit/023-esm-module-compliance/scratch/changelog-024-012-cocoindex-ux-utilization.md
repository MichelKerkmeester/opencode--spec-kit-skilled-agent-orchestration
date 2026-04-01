# Changelog: 024/012-cocoindex-ux-utilization

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 012-cocoindex-ux-utilization -- 2026-03-31

CocoIndex Code is a powerful semantic code search tool that understands 28+ programming languages, but it was barely used in practice. The hooks that run at session startup failed because the TypeScript source files were never compiled to JavaScript. The CocoIndex MCP server was not registered for Claude Code sessions. There was only one MCP tool (search), so managing the index required dropping to the command line. And despite documentation saying "use CocoIndex first," AI agents routinely skipped it in favor of simpler text search. This phase fixes the compilation blocker, registers CocoIndex for automatic loading, adds three new MCP tools for index management and quality feedback, enforces CocoIndex-first routing across all four AI runtimes, and wires semantic search results into the compaction pipeline so they survive context window resets.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/`

---

## What Changed

### Bug Fixes (1)

#### Hook compilation blocker

**Problem:** The three Claude Code hook scripts (session-prime, compact-inject, session-stop) and their three shared library files were written in TypeScript, but the build pipeline never compiled them to JavaScript. Every time a Claude Code session started, it tried to run the registered JavaScript files, found nothing at those paths, and threw a "SessionStart:startup hook error." This meant the entire hook system -- session priming, context compaction, and session tracking -- was silently broken for all Claude Code users.

**Fix:** Verified the TypeScript compiler configuration (`tsconfig.json`) to confirm the hook source files were in scope, then fixed the build pipeline so `npm run build` reliably produces JavaScript output for all six hook files: the three executable scripts (`session-prime.js`, `compact-inject.js`, `session-stop.js`) and the three shared libraries (`shared.js`, `hook-state.js`, `claude-transcript.js`). Each executable hook was smoke-tested by piping empty input through it and confirming a clean exit. Sessions now start without errors.

---

### New Features (6)

#### CocoIndex auto-loads in Claude Code

**Problem:** CocoIndex was configured for the OpenCode runtime but missing from `.claude/mcp.json`, the configuration file that tells Claude Code which MCP servers (tool providers that AI assistants can call) to load automatically. Claude Code users had no automatic access to semantic code search -- they would have had to set it up manually, which nobody did.

**Fix:** Added the `cocoindex_code` server entry to `.claude/mcp.json` so the CocoIndex MCP server loads automatically in every Claude Code session. No manual setup required.

#### Startup health check with stale index warning

**Problem:** There was no way to know at session start whether CocoIndex was working or whether its search index (the pre-built database of code embeddings that powers semantic search) was outdated. A stale index means search results miss recent code changes, and users had no signal that this was happening until they got bad results.

**Fix:** The SessionStart hook (`session-prime.ts`) now checks CocoIndex availability and reports its status in the startup output. If the index is older than 24 hours, a warning section prompts the user to re-index, catching staleness before it causes misleading search results. If CocoIndex is not running at all, the status line says so clearly instead of failing silently.

#### `ccc_status` MCP tool

**Problem:** Checking the health of the CocoIndex search index -- how many files are indexed, how many text chunks exist, which embedding model is in use, when the index was last updated -- required dropping out of the AI conversation and running command-line tools. This friction meant index problems often went unnoticed.

**Fix:** A new MCP tool called `ccc_status` exposes those index statistics directly within the conversation. The AI assistant or the user can inspect index state without leaving the chat. If the CocoIndex daemon (the background process that serves the index) is not running, the tool returns a clear error instead of hanging.

#### `ccc_reindex` MCP tool

**Problem:** Refreshing the search index after code changes required either running the CLI manually or using the `refresh_index: true` flag on search queries. That flag triggered a re-index inline during search, which caused `ComponentContext` concurrency errors when multiple queries ran at the same time -- a common scenario since AI assistants often issue parallel tool calls.

**Fix:** A new MCP tool called `ccc_reindex` provides a safe, explicit way to trigger an incremental re-index (updating only changed files rather than rebuilding from scratch) from within the MCP workflow. Because it runs outside the search path, it avoids the concurrency problem entirely. The `refresh_index` flag now defaults to `false` everywhere.

#### `ccc_feedback` MCP tool

**Problem:** There was no way to tell CocoIndex which search results were actually useful and which were noise. Without this feedback signal, the system could not learn from usage patterns, and embedding quality (how well the system understands code similarity) could not improve over time.

**Fix:** A new MCP tool called `ccc_feedback` accepts quality feedback -- whether a result was useful or not, its rank in the results list, and the query terms that produced it. This data is stored for future retrieval tuning, following the same feedback pattern already used by the memory validation system (`memory_validate`). Over time, this creates a feedback loop that can inform better search ranking.

#### Reverse semantic augmentation in code graph

**Problem:** The code graph (a structural map of how code files relate through imports, exports, and function calls) could expand outward from a starting point to find related files, but it had no awareness of code that was semantically related without being directly linked. Two files solving similar problems in different parts of the codebase would never appear together unless they happened to import each other.

**Fix:** The `code_graph_context` tool now suggests CocoIndex follow-up queries in its `nextActions` output after expanding graph neighborhoods. Instead of calling CocoIndex inline (which would slow down every graph query), the tool emits suggestions that the caller can choose to execute based on remaining time budget. If fewer than 400 milliseconds remain, the suggestions are skipped. This keeps the core tool fast while enabling richer, cross-cutting results when time allows.

---

### Architecture (3)

#### CocoIndex-first agent routing

**Problem:** Despite documentation across all runtimes saying "prefer CocoIndex for semantic search," AI agents consistently skipped it and went straight to Grep and Glob (text-matching tools that search for exact strings). This happened because the routing guidance was advisory -- a suggestion the agent could ignore -- rather than a structured decision rule. The result was that semantic queries (like "find error handling patterns") were answered with brittle text matches instead of meaning-aware search.

**Fix:** Updated the `@context` agent definition (the agent responsible for all codebase exploration and file search) in all five runtime configurations -- OpenCode, Claude, Codex, Gemini, and the shared Agents directory -- to enforce explicit routing rules. Semantic intent (searching by concept or meaning) goes to CocoIndex first. Structural intent (finding imports, call sites, file relationships) goes to the code graph. Session intent (recovering prior work context) goes to Memory. Agents now use the right tool for the right query type instead of defaulting to text matching.

#### Semantic neighbors in compaction

**Problem:** When the AI's context window fills up and compacts (a process where older conversation content is summarized and compressed to free space), the system preserved memories and code structure but discarded any semantic search results from the session. After compaction, the AI lost awareness of semantically related code it had previously discovered, potentially re-searching for the same things or missing relevant context.

**Fix:** Extended the PreCompact hook (`compact-inject.ts`) to query CocoIndex for semantic neighbors of the top working-set files (the files the AI has been actively reading or editing). Those results now appear in the cached compaction payload under a "Semantic Neighbors" section. After a context reset, the AI retains awareness of code that is semantically related to its current work, even if that code was never explicitly opened in the session.

#### Concurrency-safe defaults

**Problem:** The `refresh_index: true` parameter on CocoIndex search queries triggered an inline index refresh during the search itself. When multiple MCP queries executed in parallel -- which happens routinely because AI assistants optimize for speed by issuing concurrent tool calls -- this caused `ComponentContext` errors, crashing the affected queries and returning no results.

**Fix:** Set `refresh_index: false` as the default across all documentation and routing guidance. Index refreshes now go exclusively through the dedicated `ccc_reindex` tool, which runs as a standalone operation outside the search path. This eliminates the concurrency problem entirely because search and indexing no longer compete for the same internal resources.

---

### Documentation (2)

#### CocoIndex skill docs updated

**Problem:** The CocoIndex skill documentation (`SKILL.md`) only covered the original `search` tool. The three new MCP tools had no documentation, meaning AI agents and users would not know they exist or how to use them.

**Fix:** The MCP Tool Summary section in `SKILL.md` now covers all three new tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) with usage examples and parameter descriptions.

#### Freshness strategy documented

**Problem:** There was no documented guidance on when to re-index, why `refresh_index` defaults to false, how to read freshness signals, or how the feedback loop connects to retrieval quality. Users and agents had to guess.

**Fix:** Added section 8b to `search_patterns.md` covering the complete freshness lifecycle: when to re-index, why the default changed, how to interpret the stale-index warning from the startup health check, and how quality feedback submitted through `ccc_feedback` feeds back into retrieval improvement.

---

### Testing (1)

#### Runtime routing test suite

**Problem:** There were no automated tests verifying that the CocoIndex-first routing rules were correctly configured across all agent definitions. A future edit to any agent file could silently break the routing without anyone noticing.

**Fix:** Added 12 new tests across 5 groups (semantic queries, structural queries, session queries, ambiguous queries, and case-insensitive matching) that validate CocoIndex-first routing is correctly enforced in all agent definitions. The tests check that semantic intent routes to CocoIndex, structural intent routes to code graph, and session intent routes to Memory.

---

<details>
<summary><strong>Files Changed (17)</strong></summary>

| File | What changed |
|------|-------------|
| `mcp_server/tsconfig.json` | Verified hooks/claude/*.ts included in build scope |
| `.claude/mcp.json` | Added `cocoindex_code` server entry for auto-loading |
| `mcp_server/hooks/claude/session-prime.ts` | CocoIndex availability check and stale index warning on startup |
| `mcp_server/hooks/claude/compact-inject.ts` | Queries CocoIndex for semantic neighbors of working-set files |
| `mcp_server/handlers/code-graph/ccc-status.ts` | New -- index stats MCP tool |
| `mcp_server/handlers/code-graph/ccc-reindex.ts` | New -- incremental re-index MCP tool |
| `mcp_server/handlers/code-graph/ccc-feedback.ts` | New -- result quality feedback MCP tool |
| `mcp_server/handlers/code-graph/index.ts` | Registered new `ccc_*` handlers |
| `mcp_server/lib/code-graph/code-graph-context.ts` | Reverse semantic augmentation via `nextActions` |
| `.opencode/agent/context.md` | CocoIndex-first routing enforcement |
| `.claude/agents/context.md` | CocoIndex-first routing enforcement |
| `.codex/agents/context.toml` | CocoIndex-first routing enforcement |
| `.gemini/agents/context.md` | CocoIndex-first routing enforcement |
| `.agents/agents/context.md` | CocoIndex-first routing enforcement |
| `mcp-coco-index/SKILL.md` | New MCP tool documentation |
| `mcp-coco-index/references/search_patterns.md` | Freshness strategy (section 8b) |
| `mcp_server/tests/runtime-routing.vitest.ts` | New -- 12 routing tests across 5 groups |

</details>

---

## Upgrade

No migration required. The new MCP tools and routing changes are additive. If CocoIndex is not running, all hooks and tools degrade gracefully -- they skip CocoIndex sections and return informative errors without blocking other functionality.
