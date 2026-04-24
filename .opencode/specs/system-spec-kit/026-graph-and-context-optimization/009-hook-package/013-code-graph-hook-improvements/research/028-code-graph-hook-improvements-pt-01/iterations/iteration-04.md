## Iteration 04
### Focus
Freshness invalidation gaps in the bounded inline refresh path.

### Findings
- `ensureCodeGraphReady()` caches `ReadyResult` entries for five seconds in a process-local `readinessDebounce` map keyed only by `rootDir` plus inline-index options [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-294].
- That debounce cache is populated for success, skip, and failure cases alike, but the module exposes no invalidation helper and no other file references the debounce map, so post-scan or post-mutation callers have no way to clear stale readiness decisions early [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:276-380; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-262].
- `handleCodeGraphScan()` performs persistence and metadata writes, yet never clears or refreshes the cached readiness entry for the same workspace, which means a stale/failing inline-read result can survive a successful manual scan until the debounce window expires [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:186-259; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:291-294].

### New Questions
- Should manual scans invalidate readiness cache globally, or only for the affected root/options tuple?
- Should failed inline refresh attempts be cached for the same five-second window as successes?
- Is there already a broader post-mutation invalidation bus that code-graph could plug into?
- Would exposing `checkedAt` in status/startup help operators understand when a stale readiness result is cached rather than recomputed?

### Status
new-territory
