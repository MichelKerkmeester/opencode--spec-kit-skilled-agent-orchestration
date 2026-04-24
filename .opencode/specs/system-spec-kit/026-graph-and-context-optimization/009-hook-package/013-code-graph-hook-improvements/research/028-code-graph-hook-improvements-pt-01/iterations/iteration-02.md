## Iteration 02
### Focus
Manual `code_graph_scan(rootDir=...)` scope safety and destructive cleanup behavior.

### Findings
- `handleCodeGraphScan()` accepts any `rootDir` inside the workspace and feeds that directory directly into `getDefaultConfig(rootDir)`, so a caller can request a scan rooted at a subtree instead of the repository root [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:128-172; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:112-120].
- On the non-incremental/full-reindex path, the handler removes every tracked file whose path is missing from the current `results` set, with no guard that the scan covered the whole workspace; a subtree scan therefore has the same cleanup semantics as a workspace scan [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:196-205].
- The scan tests only exercise `rootDir: process.cwd()` and never cover a nested-root invocation, so the current test suite would not catch subtree-triggered graph shrinkage [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:85-167].

### New Questions
- Should subtree scans be forbidden outright, or allowed only with explicit scope metadata and isolated cleanup?
- Does the current DB/status model retain any hint that the last successful scan covered only part of the workspace?
- Would a nested-root full scan also poison startup highlights by making the reduced graph look complete?
- Is `specificFiles` a safer operator escape hatch than exposing arbitrary `rootDir` scans?

### Status
new-territory
