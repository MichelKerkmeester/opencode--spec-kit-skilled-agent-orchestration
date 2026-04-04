# Changelog: 024/020-query-routing-integration

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 020-query-routing-integration — 2026-03-31

When a user asked a question about their codebase, they had to know which tool to call: `code_graph_context` for structural questions ("who calls this function?") and `memory_search` for semantic ones ("find code similar to X"). Most users do not know the difference and should not have to. This phase makes `memory_context` smart enough to figure it out automatically. It classifies every incoming query by intent, routes it to the correct backend, and falls back gracefully if the first choice returns nothing. A new `session_resume` composite tool eliminates the 3-4 separate calls users previously needed when resuming a session, replacing them with a single call that merges memory, code graph, and cache status into one response. Finally, a passive enrichment pipeline was added so that every tool response can be lightly annotated with nearby code symbols, session staleness warnings, and triggered memories -- all within strict latency and token budgets.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/020-query-routing-integration/`

---

## What Changed

### Search (3 changes)

#### Automatic query-intent routing

**Problem:** Users had to manually pick the right tool for each question. If they wanted to know "who calls this function?" they needed `code_graph_context`. If they wanted "find code similar to X" they needed `memory_search`. Choosing the wrong tool meant getting irrelevant or empty results. This forced users to understand internal system architecture just to ask a question.

**Fix:** A classification step called `classifyQueryIntent()` was added at the top of the `memory_context` handler. Every incoming query is now automatically sorted into one of three categories: structural (about code relationships like calls, imports, and inheritance), semantic (about meaning, similarity, or explanation), or hybrid (ambiguous queries that could go either way). Structural queries route to the code graph, semantic queries route to the memory search path, and hybrid queries run both backends and merge the results. Users simply ask their question in plain language and the system determines where to look.

---

#### Structural-to-semantic fallback

**Problem:** When the system classified a query as structural but the code graph had no matching nodes -- for example, because the symbol had not been indexed yet -- the user received an empty response with no recourse. The classification was correct in theory, but the backend had no data to return.

**Fix:** The routing logic now detects when the structural backend returns zero nodes and automatically retries the query through the semantic search path instead. This means a query that targets an under-indexed or newly-added symbol still returns useful results from semantic memory rather than returning nothing.

---

#### Query intent metadata in responses

**Problem:** There was no way for the AI agent (or a debugging developer) to understand why a particular backend was chosen for a given query, or whether a fallback from structural to semantic search had occurred. Routing decisions were invisible, making it difficult to diagnose unexpected results.

**Fix:** Every `memory_context` response now includes a `queryIntentMetadata` block. This block shows three things: the detected intent (structural, semantic, or hybrid), the backend that was actually used to produce the response, and a flag indicating whether fallback was applied. This makes the routing pipeline fully transparent and debuggable.

---

### New Features (1 change)

#### session_resume composite tool

**Problem:** Resuming a previous work session required 3-4 separate tool calls: load the memory context, check the code graph's freshness, check the constitutional cache status, and sometimes additional calls. Each call consumed tokens (the currency of AI context windows) and a network round trip. This overhead was especially painful on runtimes that still depended on manual recovery at the time, such as Codex CLI, Copilot CLI, OpenCode, and Gemini before the later hook/startup-surface follow-ons landed.

**Fix:** A new `session_resume` tool was created as a single composite call that performs all of these steps internally. It calls `memory_context` in resume mode, checks the code graph status, and checks the constitutional cache status, then merges everything into one consolidated response. This saves approximately 400-900 tokens and 2-3 network round trips per session resume.

---

### Architecture (1 change)

#### Passive context enrichment pipeline

**Problem:** Tool responses were returned exactly as-is, with no additional context, even when the system had obviously relevant information sitting nearby. For example, if a response mentioned a file, the system knew about code symbols defined in that file but did not include them. If a session was getting stale (meaning the cached context might be outdated), no warning was shown. Useful information existed in the system but was not surfaced unless explicitly requested.

**Fix:** A `runPassiveEnrichment()` pipeline was added that can annotate any tool response with three types of supplementary context: nearby code graph symbols (functions, classes, and variables defined near files mentioned in the response), session continuity warnings (alerts when cached context may be outdated), and high-confidence triggered memories (previously saved knowledge that closely matches the current context). Hard performance guards prevent this enrichment from degrading response speed: a maximum of 250 milliseconds of latency, a maximum of 200 tokens added to the response, and a rule preventing recursive enrichment (enrichment cannot trigger further enrichment).

---

### Bug Fixes (3 changes)

#### Prose-as-symbol-name extraction

**Problem:** When routing a structural query, the system was passing the user's full natural language input as the symbol name to search for. For example, if a user asked "who calls the parse function in memory-parser," the system would search the code graph for a symbol literally named "who calls the parse function in memory-parser" -- a string that could never match any real code identifier. This meant that many structural queries silently failed.

**Fix:** A code-identifier heuristic was added that extracts the actual symbol name (in this example, "parse") from the surrounding prose before passing it to the structural backend. The heuristic identifies code identifiers by looking for patterns typical of function names, class names, and variable names within natural language sentences.

---

#### Duplicated CocoIndex path check

**Problem:** The new `session_resume` handler contained a copy of the same CocoIndex path-discovery logic (code that locates where the CocoIndex search index is stored on disk) that already existed in other handlers. This duplication created a maintenance risk: if a bug was fixed in one copy, the other copy would remain broken.

**Fix:** The duplicated logic was extracted into a shared helper at `lib/utils/cocoindex-path.ts`. Both the session-resume handler and the existing handlers now call this single shared function, ensuring that any future fix or change is applied in one place and takes effect everywhere.

---

#### Missing metric event on session_resume

**Problem:** The `session_resume` tool was not recording a metric event when it ran. All other tools in the system record usage metrics for analytics and monitoring. Because `session_resume` was missing this call, its usage was invisible in dashboards and could not be tracked or analyzed.

**Fix:** A `recordMetricEvent` call was added to the `session_resume` handler so that every invocation is now tracked alongside all other tool usage, restoring full visibility in analytics.

---

<details>
<summary><strong>Files Changed (13 files)</strong></summary>

| File | What changed |
|------|-------------|
| `mcp_server/handlers/memory-context.ts` | `classifyQueryIntent` routing logic at lines 1087-1145; `queryIntentMetadata` appended at line 1391; code-identifier heuristic for subject extraction |
| `mcp_server/handlers/session-resume.ts` | New composite tool (130 lines) combining `memory_context`, `code_graph_status`, and `ccc_status` into one response |
| `mcp_server/handlers/index.ts` | Export for the new session-resume handler |
| `mcp_server/handlers/code-graph/context.ts` | Accepts routed requests from the query-intent classifier |
| `mcp_server/lib/code-graph/code-graph-context.ts` | Handles routed queries from the auto-routing path |
| `mcp_server/lib/enrichment/passive-enrichment.ts` | New passive enrichment pipeline (180 lines) with latency and token guards |
| `mcp_server/lib/enrichment/code-graph-enricher.ts` | New enricher that adds nearby code graph symbols to tool responses |
| `mcp_server/lib/utils/cocoindex-path.ts` | New shared helper for CocoIndex path discovery, replacing duplicated checks |
| `mcp_server/tool-schemas.ts` | `session_resume` tool registration and classification metadata added to response schema |
| `mcp_server/schemas/tool-input-schemas.ts` | `session_resume` input schema definition |
| `mcp_server/tools/lifecycle-tools.ts` | `session_resume` dispatch wiring |
| `mcp_server/tools/types.ts` | `session_resume` type definitions |
| `mcp_server/context-server.ts` | Wired passive enrichment pipeline into the response path |

</details>

---

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- memory_context routing documented as additive (not selective backend routing)
- Routing metadata contract aligned: confidence + matchedKeywords (removed stale fallbackApplied)
- session_resume documented as slim (no ccc_status, just isCocoIndexAvailable)
- Part 3 passive enrichment resolved: IS wired, no longer marked deferred
- code-graph-enricher documented as inlined into passive-enrichment.ts
- session_resume schema claims corrected

## Upgrade

No migration required.
