# Review Iteration 033
## Dimension: D2 Security
## Focus: WASM loading security, grammar path validation, tree-sitter-wasms trust
## New Findings
### [P2] F029 - Tree-sitter WASM parsing can block the MCP server main thread
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:546-547`
- Evidence: `parserInstance.parse(content)` runs synchronously, and request-driven paths await it directly during indexing/parsing (`structural-indexer.ts:930-941,1048-1065`; `context-server.ts:651-718`). The 100KB cap (`indexer-types.ts:99-106`) reduces blast radius, but a crafted repo can still monopolize the single-threaded server during `code_graph_scan` or related graph operations.
- Fix: Move parsing/indexing into a worker thread or subprocess and enforce per-file wall-clock/CPU budgets; keep the size cap as a secondary guard.

## Remediation Verification
- F009: FIXED — recovered compact payloads are now sanitized and fenced before injection via `sanitizeRecoveredPayload()` and `wrapRecoveredCompactPayload()`, then emitted as `"Recovered Context (Post-Compaction)"` (`mcp_server/hooks/claude/session-prime.ts:52-58`; `mcp_server/hooks/claude/shared.ts:91-110`).
- F010: PARTIAL — most tool modules now call `validateToolArgs(...)`, but live code-graph dispatch still bypasses centralized schemas and forwards raw `args` with only ad hoc checks (`mcp_server/context-server.ts:658-661`; `mcp_server/tools/code-graph-tools.ts:55-80`).
- F027: FIXED — hook-state filenames now use `sha256(sessionId).slice(0, 16)` instead of lossy session-id sanitization (`mcp_server/hooks/claude/hook-state.ts:42-45`).
- F028: FIXED — hook state now creates the temp directory with `0700` and writes temp JSON with `0600` before atomic rename (`mcp_server/hooks/claude/hook-state.ts:48-50`; `67-73`).

## Iteration Summary
- New findings: 0 P0, 0 P1, 1 P2
- Verified fixes: 3
- Remaining active: 2
