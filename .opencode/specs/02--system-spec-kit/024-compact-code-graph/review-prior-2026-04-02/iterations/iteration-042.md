# Review Iteration 042
## Dimension: D1 Correctness
## Focus: Phase 018 auto-priming (memory-surface.ts, session-health.ts, context-metrics.ts)

## Findings

### [P2] F045 - primeSessionIfNeeded sets sessionPrimed=true before try block, preventing retry on failure
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:373
- Evidence: `sessionPrimed = true` is set at line 373, before the `try` block at line 377. If `getConstitutionalMemories()` or `getCodeGraphStatusSnapshot()` throws, the flag remains true and no future tool call will attempt priming again. The catch block returns null but the flag is permanently set.
- Fix: Move `sessionPrimed = true` inside the try block, after successful prime package construction, or reset it in the catch block.

### [P2] F046 - buildPrimePackage cocoIndex path is hard-coded and fragile
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:347
- Evidence: `const cccBin = resolve(process.cwd(), '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc')` — uses process.cwd() which could be any directory, and the path assumes a specific venv layout. If the MCP server cwd differs from the project root, this check always returns false.
- Fix: Use the project root directory (from config or environment) instead of process.cwd(). Consider a more robust check (e.g., env var or config flag).

### [P2] F047 - Dual lastToolCallAt state: memory-surface.ts and context-metrics.ts both track independently
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:98, .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:58
- Evidence: `memory-surface.ts` has `let lastToolCallAt = Date.now()` (line 98) with `recordToolCall()` (line 101), and `context-metrics.ts` has `let lastToolCallAt: number | null = null` (line 58) with its own `recordMetricEvent()`. These are independent counters that can drift. The session-health handler may use one while quality scoring uses the other.
- Fix: Consolidate tool-call tracking into a single module (context-metrics.ts) and have memory-surface.ts import from it.

## Verified Correct
- primeSessionIfNeeded() correctly builds PrimePackage with specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls
- sessionPrimed boolean flag prevents double-priming (design correct, edge case noted above)
- Token budget enforcement via enforceAutoSurfaceTokenBudget() is properly applied to prime output
- Error handling: prime failure returns null and does NOT block the actual tool call (catch returns null)
- recordToolCall/getSessionTimestamps/isSessionPrimed exports are correct and used by session-health handler
- Constitutional memory caching with TTL works correctly
- extractContextHint correctly extracts from input/query/prompt/specFolder/filePath/concepts fields

## Iteration Summary
- New findings: 3 (P2)
- Items verified correct: 7
- Reviewer: Claude Opus 4.6 (1M context)
