# Iteration 61: Q14 DEEP DIVE — Auto-Enrichment Interceptor Architecture from Source Code

## Focus
Deep dive into the actual implementation of tool dispatch, auto-surface, session priming, and working set tracking to design the GRAPH_AWARE_TOOLS interceptor and auto-enrichment pipeline. This extends iteration 057's conceptual three-tier architecture with concrete implementation details derived from reading the actual source code.

## Findings

### 1. Tool Dispatch Is a Simple Sequential Scanner — Interception Must Happen Pre-Dispatch

The `tools/index.ts` module exports `dispatchTool(name, args)` which iterates an ordered array `ALL_DISPATCHERS = [contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, codeGraphTools]` and calls `handleTool` on the first module whose `TOOL_NAMES` set contains the tool name. This dispatch is a pure pass-through with no hooks, middleware, or pre/post-processing. The auto-surface interception happens **before** `dispatchTool` is called, in `context-server.ts:325-352`. This means graph auto-enrichment cannot be injected at the dispatch layer itself — it must be wired into `context-server.ts` alongside the existing memory auto-surface, not inside `tools/index.ts`.

**Design implication**: A new function `autoSurfaceCodeGraph(toolName, toolArgs)` must be called in `context-server.ts` in the same pre-dispatch block where `autoSurfaceAtToolDispatch` runs (lines 326-352), running in parallel via `Promise.allSettled`.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:17-37]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-366]

### 2. The MEMORY_AWARE_TOOLS Gate Has an Inverted Logic Pattern

The existing auto-surface logic in `context-server.ts:331-352` has a subtle design: `MEMORY_AWARE_TOOLS` is checked first, and if the tool IS in that set, it extracts a contextHint and runs `autoSurfaceMemories` (or `autoSurfaceAtCompaction` for resume calls). If the tool is NOT in MEMORY_AWARE_TOOLS, it runs `autoSurfaceAtToolDispatch` which itself checks the set again (memory-surface.ts:265) and returns early if the tool is memory-aware. This double-check pattern is defensive but means the GRAPH_AWARE_TOOLS set must follow the same inverted pattern:

```
if (MEMORY_AWARE_TOOLS.has(name)) {
  // Memory-specific auto-surface (contextHint extraction)
} else {
  // Generic tool dispatch auto-surface (includes graph enrichment)
  // Inside autoSurfaceAtToolDispatch, it ALSO skips MEMORY_AWARE_TOOLS
}
```

For graph enrichment, the new `GRAPH_AWARE_TOOLS` set should be checked inside `autoSurfaceAtToolDispatch` (or its parallel graph equivalent), not in the outer `context-server.ts` block. This keeps the same two-layer pattern and avoids complicating the top-level flow.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:331-352]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:42-50, 254-276]

### 3. extractContextHint Already Extracts File Paths — Graph Enrichment Can Reuse It

The `extractContextHint` function (memory-surface.ts:67-84) checks args for fields `['input', 'query', 'prompt', 'specFolder', 'filePath']` in that priority order, returning the first string >= 3 chars. For code graph auto-enrichment, the `filePath` field is the primary signal. However, `extractContextHint` returns the **first match**, which for memory_context calls would be `input` (a query string), not `filePath`. A dedicated `extractFilePathHint(args)` function should be created for graph enrichment that specifically looks for file-path-shaped arguments:

```typescript
function extractFilePathHint(args: Record<string, unknown>): string | null {
  const fileFields = ['file_path', 'filePath', 'path', 'subject'];
  for (const field of fileFields) {
    const val = args[field];
    if (val && typeof val === 'string' && (val.endsWith('.ts') || val.endsWith('.js') || val.includes('/'))) {
      return val;
    }
  }
  return null;
}
```

This ensures graph enrichment fires on file operations (Read, Edit, Write, Grep results) but not on text queries.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:67-84]
[INFERENCE: Based on the different signal requirements — memory needs semantic context from query strings, graph needs structural context from file paths]

### 4. The 250ms Latency Budget Is Already Strained — Graph Enrichment Must Be Async-Parallel

`context-server.ts:354-355` has a performance warning that fires when auto-surface exceeds 250ms. The existing memory auto-surface already approaches this budget. Adding synchronous graph queries on top would blow the budget. The solution is `Promise.allSettled` parallel execution:

```typescript
const [memoryResult, graphResult] = await Promise.allSettled([
  autoSurfaceAtToolDispatch(name, args),
  autoSurfaceCodeGraph(name, args),
]);
```

If graph enrichment takes too long, `allSettled` still returns the memory result. The graph result can be attached as supplementary metadata without blocking the tool response. A per-enrichment timeout of 150ms (configurable via `SPECKIT_GRAPH_ENRICH_TIMEOUT`) with `Promise.race` would cap worst-case latency.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:353-356]
[INFERENCE: Standard async concurrency pattern applied to the observed latency constraint]

### 5. Session Working Set Is Already Tracked but Not Leveraged for Graph Preloading

`session-prime.ts:119-132` reads `state.workingSet` from hook state and renders it as a list of file paths in the startup output. But this data is only displayed — it is never fed back into the code graph for structural preloading. The design gap is clear:

**Current flow**: SessionStart -> load workingSet -> display as text "Recently active files: [list]"

**Proposed flow**: SessionStart -> load workingSet -> for each file in workingSet, call `code_graph_query({ operation: "outline", subject: file })` -> merge outlines into a compact "Structural Context" section -> inject into startup output alongside the working set list

This would give the AI not just a list of recently-used files but their structural signatures (exported functions, classes, imports) on every session start. The implementation adds ~3 lines to `handleStartup`:

```typescript
if (getStats && workingSet.length > 0) {
  const outlines = workingSet.slice(0, 5).map(f => getOutline(f)).filter(Boolean);
  sections.push({ title: 'Structural Context', content: outlines.join('\n\n') });
}
```

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:119-132]
[INFERENCE: Gap analysis between current data availability and utilization]

### 6. appendAutoSurfaceHints Merges Into Existing JSON Envelope — Graph Context Can Piggyback

The `appendAutoSurfaceHints` function (response-hints.ts:59-113) takes a tool result and an AutoSurfaceResult, then injects `meta.autoSurface` into the response JSON envelope. This same pattern can be extended for graph context by adding a `meta.graphContext` field:

```typescript
function appendGraphContextHints(result: MCPResponse, graphContext: GraphContextResult): void {
  // Same JSON envelope injection pattern as appendAutoSurfaceHints
  const envelope = JSON.parse(result.content[0].text);
  envelope.meta.graphContext = {
    fileOutline: graphContext.outline,
    imports: graphContext.imports,
    enrichedAt: new Date().toISOString(),
    latencyMs: graphContext.latencyMs,
  };
  result.content[0].text = JSON.stringify(envelope);
}
```

The existing `syncEnvelopeTokenCount` (line 399 of context-server.ts) would automatically account for the added graph context in the token budget calculation.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-113]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:397-399]

### 7. Code Graph Tools Dispatch Is Isolated — No Cross-Contamination Risk

`code-graph-tools.ts` defines a self-contained dispatch with 7 tool names (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `ccc_status`, `ccc_reindex`, `ccc_feedback`) handled by a switch statement that delegates to handlers in `handlers/code-graph/index.js`. These handlers return plain `{ content: [{ type, text }] }` results that get wrapped by `toMCP()`. The auto-enrichment interceptor can safely call these handlers directly (bypassing MCP dispatch) for lightweight outline/import queries, avoiding the overhead of full tool dispatch and token budget enforcement:

```typescript
import { handleCodeGraphQuery } from '../handlers/code-graph/index.js';

async function autoSurfaceCodeGraph(toolName: string, toolArgs: Record<string, unknown>): Promise<GraphContextResult | null> {
  if (GRAPH_AWARE_TOOLS.has(toolName)) return null;
  const filePath = extractFilePathHint(toolArgs);
  if (!filePath) return null;
  
  const outline = await handleCodeGraphQuery({ operation: 'outline', subject: filePath, limit: 20 });
  return { outline: outline.content[0]?.text, latencyMs: 0 };
}
```

Calling handlers directly (not through `dispatchTool`) avoids recursive auto-surface triggering entirely, making the `GRAPH_AWARE_TOOLS` check more of a safety net than a primary guard.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-55]

### 8. Stale Index Detection Already Exists — Can Be Upgraded to Auto-Refresh

`session-prime.ts:103-117` checks `getStats().lastScanTimestamp` and warns if >24h old. The `getStats` function is dynamically imported from `code-graph-db.js`. Currently this only produces a warning text. Upgrading to auto-refresh requires:

1. Import `handleCodeGraphScan` from handlers (already available since session-prime is in the hooks directory)
2. Call `handleCodeGraphScan({ incremental: true })` as a fire-and-forget background task
3. Similarly check CocoIndex staleness and trigger `handleCccReindex({ full: false })`

The key constraint is that hook scripts must exit quickly (HOOK_TIMEOUT_MS). A background `setTimeout(() => scan(), 0)` after writing stdout would allow the scan to run after the hook output is delivered, but only if the process stays alive. Since `session-prime.ts:222` calls `process.exit(0)` in the finally block, the background scan would be killed. Solution: the scan trigger must be a message passed to the main MCP server process (which is long-lived), not executed in the hook process itself.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:103-117, 220-224]
[INFERENCE: Process lifecycle constraint analysis — hooks are short-lived scripts, not long-lived servers]

## Ruled Out
- **Injecting graph enrichment inside `dispatchTool` itself**: The dispatch function is a pure pass-through scanner with no middleware concept. Enrichment must happen in `context-server.ts` where the auto-surface pattern already lives.
- **Synchronous graph enrichment blocking tool dispatch**: The existing 250ms latency budget is already strained. Must use async parallel execution.
- **Background auto-scan in hook process**: Hooks call `process.exit(0)` and cannot sustain background work. Must delegate to the long-lived MCP server process.

## Dead Ends
None — all investigated patterns are viable and build directly on proven existing architecture.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` (full file, 37 lines — dispatch architecture)
- `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts` (full file, 55 lines — graph tool dispatch)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:310-410` (auto-surface interception block)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:30-84, 136-276` (MEMORY_AWARE_TOOLS, extractContextHint, autoSurfaceAtToolDispatch)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-113` (appendAutoSurfaceHints envelope injection)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (full file, 224 lines — session lifecycle)
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-057.md` (prior iteration conceptual architecture)

## Assessment
- New information ratio: 0.72
- Questions addressed: Q14 (automatic AI utilization — implementation deep dive)
- Questions answered: Q14 (implementation-level design now fully specified with concrete code patterns and integration points)

## Reflection
- What worked and why: Reading the actual source code of context-server.ts, memory-surface.ts, and session-prime.ts revealed critical implementation constraints (250ms latency budget, process.exit in hooks, inverted MEMORY_AWARE_TOOLS double-check pattern) that the conceptual architecture in iteration 057 did not capture. Direct source reading is essential for implementation-ready designs.
- What did not work and why: N/A — all source files were available and readable, yielding actionable findings.
- What I would do differently: Could have also read the `response-hints.ts` full file to understand the envelope serialization more deeply, but the Grep results provided sufficient context for the JSON injection pattern.

## Recommended Next Focus
Consolidation iteration — synthesize the complete Segment 6 research (iterations 056-061) into a coherent feature improvement and auto-utilization specification. All four questions (Q13-Q16) are answered with both conceptual architecture and implementation-level details. A synthesis iteration would produce a final prioritized implementation roadmap with LOC estimates and dependency ordering.
