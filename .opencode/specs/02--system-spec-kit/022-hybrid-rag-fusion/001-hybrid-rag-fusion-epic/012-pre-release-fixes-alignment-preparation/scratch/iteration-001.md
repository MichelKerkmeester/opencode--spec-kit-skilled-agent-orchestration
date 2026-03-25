# Iteration 001: MCP Server Core Correctness

## Findings

Reviewed surface note: `mcp_server` has no project-owned source `.js` files outside generated output, so the runtime review focused on the compiled server bundle in `mcp_server/dist/` (especially `context-server.js`, `tools/*.js`, and supporting runtime parsers). The tool dispatchers themselves are thin wrappers and did not produce standalone correctness findings.

### P1-001-T79
- Severity: P1
- Title: Completed `nextSteps` are still treated as unresolved, so the T79 completion bug is not fixed
- File: `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:275-282`
- Evidence: `hasUnresolvedNextSteps` is computed as `Array.isArray(collectedData.nextSteps) && collectedData.nextSteps.length > 0` or the presence of a `Next Steps` observation title, with no filtering for completed checkbox items. The subsequent branch immediately returns `IN_PROGRESS` whenever any `nextSteps` entries exist. The TypeScript source shows the same logic at `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:363-373`.
- Impact: Sessions whose `nextSteps` are fully completed (`[x]`, `[X]`, `✓`, `✔`) are still downgraded to `IN_PROGRESS` instead of `COMPLETED`. That keeps continuation state, completion percentage, and downstream resume guidance wrong even after work is actually done.
- Recommendation: Normalize `nextSteps` into pending vs completed items before computing `hasUnresolvedNextSteps`. The completion gate should only block `COMPLETED` when at least one unresolved step remains, not when the array is merely non-empty.

### P1-002-SCAN-SCOPE
- Severity: P1
- Title: Startup indexing and file watching ignore allowed roots and constitutional memory locations, leaving part of the memory corpus stale
- File: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:447-450`
- Evidence: Startup recovery expands across `basePath`, `MEMORY_BASE_PATH`, and `ALLOWED_BASE_PATHS`, and explicitly adds constitutional directories (`context-server.js:373-380`). But the actual background indexing step only calls `memoryParser.findMemoryFiles(basePath)` (`context-server.js:449-450`). That parser scans only `<workspace>/specs` and `<workspace>/.opencode/specs` (`mcp_server/dist/lib/parsing/memory-parser.js:657-660`) and only returns files under `/memory/` directories (`mcp_server/dist/lib/parsing/memory-parser.js:687-718`). The watcher has the same narrowing: it only watches `getSpecsBasePaths(DEFAULT_BASE_PATH)` (`context-server.js:959-963`), while `ALLOWED_BASE_PATHS` also includes `~/.claude` and other resolved roots (`mcp_server/dist/core/config.js:90-97`).
- Impact: On startup, memories stored in constitutional directories and any non-default allowed root are not automatically indexed or watched, even though they are part of the allowed runtime surface. Searches can therefore start with a silently incomplete corpus until a manual `memory_index_scan` happens.
- Recommendation: Derive startup scan roots and watcher paths from the same resolved root set used by recovery/allowed-root logic, and include constitutional directories in the indexed startup surface instead of limiting the scan to `findMemoryFiles(basePath)`.

## Summary

Total findings: 2

Breakdown:
- P0: 0
- P1: 2
- P2: 0

High-confidence outcome: the thin `dist/tools/*.js` dispatch modules are structurally sound for correctness, but the review found two real behavior issues in the surrounding runtime flow: one in T79 completion-state classification and one in startup/watch indexing scope.

## JSONL

{"type":"iteration","run":1,"mode":"review","dimensions":["correctness"],"findingsCount":2,"findingsSummary":{"P0":0,"P1":2,"P2":0},"findingsNew":{"P0":0,"P1":2,"P2":0},"newFindingsRatio":1.0,"status":"insight"}
