## Iteration 01
### Focus
Manual `code_graph_scan` persistence safety versus the staged write discipline already implemented in `ensure-ready`.

### Findings
- `ensure-ready` explicitly stages `file_mtime_ms=0`, writes nodes and edges, and only then commits the real mtime so failed persistence leaves the file stale for retry; `handleCodeGraphScan` does not reuse that pattern and writes the real mtime before `replaceNodes()` / `replaceEdges()`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:198-233`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:213-221`.
- Because `handleCodeGraphScan` catches persistence exceptions after `upsertFile()`, a node or edge write failure can leave `code_files.file_mtime_ms` looking current while structural rows are partial or missing. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:213-228`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:270-303`.
- The scan response readiness block is derived from `lastPersistedAt` truthiness, not from per-file write success or residual errors, so partial failures can still emit `canonicalReadiness: ready` / `trustState: live`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:250-287`.
- Existing scan tests only cover the happy path and deleted-file cleanup; they do not exercise write failure after `upsertFile()`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:56-167`.

### New Questions
- Should `handleCodeGraphScan()` delegate persistence to the same staged writer used by `indexWithTimeout()`?
- Should scan readiness downgrade to `stale` or `unavailable` when `errors.length > 0` includes DB-write failures?
- Is there already a regression test outside `code-graph-scan.vitest.ts` that covers `upsertFile()` succeeding while `replaceNodes()` fails?

### Status
new-territory
