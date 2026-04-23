## Iteration 04
### Focus
`ensureCodeGraphReady()` debounce behavior and stale reader risk across roots and option sets.

### Findings
- `ensureCodeGraphReady()` caches a single `lastCheckResult` for 5 seconds and returns it before inspecting either `rootDir` or the current `allowInlineIndex` / `allowInlineFullScan` options. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:256-268`.
- That cache is process-global, so a recent call for one workspace or a read-only path can suppress a materially different follow-up call in another workspace or with more permissive options. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:256-268`.
- Query and context handlers both call `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`, so any future caller that wants a different root or different inline-scan policy shares the same cache slot. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:618-623`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:101-106`.
- The ensure-ready test suite exercises full scans, selective scans, and disabled inline refresh, but it never validates cache keying across different roots or option combinations. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:129-269`.

### New Questions
- Should the debounce cache key include `rootDir`, `allowInlineIndex`, and `allowInlineFullScan`?
- Is a 5-second global cache still needed now that read paths already block inline full scans?
- Could a lightweight cache invalidation on Git HEAD or tracked-file count eliminate the current cross-call bleed-through?

### Status
converging
