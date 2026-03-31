# Iteration 57: Automatic AI Utilization — Code Graph + CocoIndex Without Explicit Tool Calls

## Focus
Q14 — How can code graph + CocoIndex be utilized automatically without explicit tool calls? This iteration investigates auto-triggering patterns, proactive context loading, implicit graph queries during Read/Edit operations, MCP server-side auto-enrichment, session-aware preloading, and background indexing strategies.

## Findings

### 1. Existing Auto-Surface Architecture Provides the Blueprint
The MCP server already has a mature auto-surface pattern in `memory-surface.ts` that fires at two lifecycle points: **tool dispatch** (`autoSurfaceAtToolDispatch`) and **compaction** (`autoSurfaceAtCompaction`). Both extract a context hint from the current operation and surface relevant memories. The code graph and CocoIndex can follow this exact same pattern — intercept tool dispatch, extract file paths or symbol names from tool arguments, and inject structural/semantic context alongside the memory auto-surface.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:254-277]

### 2. Tool Dispatch Interception Is Already Wired in context-server.ts
The `context-server.ts` (line ~326-395) already runs auto-surface on every non-memory-aware tool call. The interception happens in the MCP call handler: it extracts a `contextHint` from args, calls `autoSurfaceAtToolDispatch`, and appends results via `appendAutoSurfaceHints`. Adding code graph context here would require a parallel `autoSurfaceCodeGraph(filePath)` call that runs alongside memory auto-surface, with results merged into the same response envelope.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:326-395]

### 3. SessionStart Hook Already Does Stale Index Detection
The `session-prime.ts` hook already imports `code-graph-db.js` dynamically and checks if the code graph index is >24h old (lines 18-24, 101-117). On startup, it warns the AI to run `code_graph_scan`. This pattern can be extended to **auto-trigger** a background incremental scan rather than just warning. The hook could spawn a background `code_graph_scan({ incremental: true })` call and similarly trigger `ccc_reindex({ full: false })` for CocoIndex if available.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18-24, 101-117]

### 4. File-Path-Aware Auto-Enrichment Pattern
When the AI calls Read/Edit/Write tools on a file, the MCP server sees the `file_path` argument in tool dispatch. A code graph auto-enrichment hook could:
- Extract file path from `toolArgs.file_path`
- Query `code_graph_query({ operation: "outline", subject: filePath })` to get the file's symbol structure
- Query `code_graph_query({ operation: "imports_from", subject: filePath })` to get dependencies
- Inject a compact "File Context" section (symbol outline + key imports) into the response metadata
This would give the AI structural understanding of any file it opens, automatically, without it needing to explicitly call code_graph_query.
[INFERENCE: Based on extractContextHint pattern in memory-surface.ts:67-84 which already looks for filePath in args]

### 5. Session Working Set Enables Proactive Preloading
The session-prime hook already tracks a `workingSet` of recently active files (lines 119-132). On session start or compaction recovery, this working set could be fed to code_graph_context in "neighborhood" mode to preload the structural context for files the AI was recently working with. This creates a warm-start effect where the AI re-enters a session with its previous structural neighborhood already in context.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:119-132]

### 6. Three-Tier Auto-Enrichment Architecture
Based on analysis of the existing hooks, a three-tier automatic enrichment system emerges:

**Tier 1 — Session Lifecycle (Background, Zero Latency Cost)**
- SessionStart: auto-trigger incremental `code_graph_scan` + `ccc_reindex` in background
- SessionStart: preload working set neighborhoods from code graph
- Compaction: include structural context in compact payload via 3-source merger (already partially designed in iteration 052)
- Token budget: 300-500 tokens for graph context, 200-400 for CocoIndex snippets

**Tier 2 — Tool Dispatch (Inline, <100ms Budget)**
- On Read/Edit/Write of a file: inject file outline + imports from code graph
- On Grep/Glob results: inject structural context for top-N result files
- Skip for code_graph_* and ccc_* tools (prevent recursive surfacing, same pattern as MEMORY_AWARE_TOOLS set)
- Token budget: 200-400 tokens per enrichment, enforced via `enforceAutoSurfaceTokenBudget` pattern

**Tier 3 — Query-Aware (Deferred, On-Demand)**
- When memory_context or memory_search runs, also query code graph for structural context around the semantic results
- Intent-based routing: "understand" intent triggers graph neighborhood expansion; "fix_bug" triggers reverse callers (impact mode)
- Token budget: shares the main context budget via the 3-source allocator (floors + overflow)

[INFERENCE: Synthesized from memory-surface.ts patterns + session-prime.ts lifecycle + iteration 049 budget allocator design]

### 7. GRAPH_AWARE_TOOLS Set Prevents Recursive Auto-Surface
Following the existing `MEMORY_AWARE_TOOLS` pattern, a `GRAPH_AWARE_TOOLS` set should be defined to prevent recursive auto-surface loops when the AI explicitly calls code graph or CocoIndex tools:
```
GRAPH_AWARE_TOOLS = new Set([
  'code_graph_scan', 'code_graph_query', 'code_graph_context', 'code_graph_status',
  'ccc_status', 'ccc_reindex', 'ccc_feedback'
])
```
Tool dispatch auto-enrichment should skip both MEMORY_AWARE_TOOLS and GRAPH_AWARE_TOOLS.
[INFERENCE: Direct analogy from MEMORY_AWARE_TOOLS in memory-surface.ts:42-50]

### 8. Background Indexing Strategy: Watch-and-Refresh
For automatic re-indexing without explicit tool calls:
- **File watcher approach**: Use `fs.watch` on workspace directories to detect file changes, then batch incremental re-index after a debounce period (e.g., 5 seconds of no changes). This is how LSP servers typically work.
- **Hook-triggered approach**: The session-stop hook (`session-stop.ts`) could trigger an incremental scan as a background task when the session ends, ensuring the index is fresh for the next session.
- **Lazy validation approach**: On each tool dispatch that touches a file path, check if that file's mtime is newer than its last-indexed timestamp. If stale, queue a micro re-index of just that file.
- Recommendation: Lazy validation (per-file staleness check at tool dispatch time) is most practical for MVP, with watch-based full incremental scan deferred to a later phase.
[INFERENCE: Based on code_graph_scan incremental mode which already uses mtime + content hash; session-stop.ts exists as lifecycle hook point]

### 9. Token Budget Integration with Existing Allocator
The 3-source budget allocator designed in iteration 049 already has slots for code graph (floor: 1200 tokens) and CocoIndex (floor: 900 tokens). Auto-enrichment at tool dispatch should use a separate, smaller budget (200-400 tokens) to avoid stealing from the main context pipeline. The enrichment budget should be configurable via environment variable (e.g., `SPECKIT_AUTO_ENRICH_BUDGET=400`) and respect the same pressure-aware scaling that session-prime.ts already implements (lines 28-36 of session-prime.ts).
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:28-36]
[SOURCE: iteration-049.md — 3-source allocator design]

### 10. Non-Hook Runtime Fallback: MCP-Native Auto-Enrichment
For runtimes without hook support (OpenCode, Codex, Copilot, Gemini), the auto-enrichment must happen entirely within the MCP server's tool call handler. The `context-server.ts` already intercepts every tool call and can inject enrichment into the response metadata. This means the three-tier architecture degrades gracefully:
- **Tier 1 (session lifecycle)**: Falls back to CLAUDE.md / CODEX.md instructions telling the AI to call `code_graph_scan` on session start
- **Tier 2 (tool dispatch)**: Works identically — MCP server intercepts calls regardless of runtime
- **Tier 3 (query-aware)**: Works identically — happens inside the MCP handler

The MCP-native path (Tier 2 + 3) provides ~70% of the auto-enrichment value without any runtime-specific hooks.
[INFERENCE: Based on context-server.ts interception being runtime-agnostic + CLAUDE.md instructions pattern]

## Ruled Out
- **Full LSP integration for auto-enrichment**: Already ruled out in strategy.md exhausted approaches (per-language server overhead). Auto-enrichment via MCP tool dispatch is sufficient.
- **Client-side file watchers**: MCP servers run server-side; client-side file watchers would require runtime-specific integrations that defeat the purpose of automatic utilization.

## Dead Ends
None identified this iteration — the approaches investigated are all viable and build on proven patterns.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` (full file, auto-surface patterns)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (full file, session lifecycle hooks)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:326-395` (tool dispatch interception)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` (exports)
- Prior iterations 049 (budget allocator), 052 (3-source merger), 053 (working set tracking)

## Assessment
- New information ratio: 0.75
- Questions addressed: Q14 (automatic AI utilization)
- Questions answered: Q14 (fully answered with three-tier architecture + implementation patterns)

## Reflection
- What worked and why: Direct codebase analysis of existing auto-surface patterns (memory-surface.ts, session-prime.ts, context-server.ts) yielded the highest-quality findings because the patterns already exist and just need extension. The code graph auto-enrichment is not a new invention — it is a direct analogy of the proven memory auto-surface system.
- What did not work and why: N/A — all approaches were productive this iteration.
- What I would do differently: Could have also checked CocoIndex MCP server code for similar auto-trigger patterns, but the focus on the Spec Kit Memory server was sufficient since that is where the integration point lives.

## Recommended Next Focus
Q15 — Non-hook CLI runtime UX (OpenCode, Codex, Copilot, Gemini). Finding 10 already establishes that Tier 2+3 auto-enrichment works for non-hook runtimes. The next iteration should investigate Tier 1 fallbacks: CLAUDE.md patterns, CODEX.md instructions, MCP auto-invocation on first tool call, and how to detect session lifecycle events without native hooks.
