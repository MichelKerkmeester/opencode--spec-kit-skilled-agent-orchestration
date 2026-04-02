# Review Iteration 034
## Dimension: D3 Traceability
## Focus: F001-F010 remediation verification

## New Findings
None.

## Remediation Verification
- F001: STILL_ACTIVE — `handleCompact()` still consumes `readAndClearCompactPrime()` before output is written, and `readAndClearCompactPrime()` persists `pendingCompactPrime: null` immediately; the hook only calls `process.stdout.write(output)` afterward with no completion/error guard. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:31-32,201-205`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:89-98`

- F002: PARTIAL — persistence failures are now detected and logged (`saveState()` returns `boolean`, `updateState()` warns on failed save), but `compact-inject.ts` still ignores that result and logs `Cached compact context...` unconditionally after `updateState(...)`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:67-78,102-121`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:281-288`

- F003: FIXED — compact recovery now rejects stale cache entries using `cachedAt` plus a 30-minute TTL before injection. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18,41-49`

- F004: FIXED — the dead `workingSet` path has been removed rather than left half-persisted: `HookState` no longer defines `workingSet`, and `session-prime.ts` only restores `lastSpecFolder`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-29`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:64-72,128-140`

- F005: FIXED — symbol ranges now span full bodies instead of one line: the regex parser computes end lines with `findBraceBlockEndLine()` for functions/arrows/methods, tree-sitter captures use `node.endPosition.row + 1`, and CALL extraction scans `caller.startLine..caller.endLine`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:36-56,262-304,323-352,829-846`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:368-380`

- F006: FIXED — provider-typed seed identity is preserved through normalization and reattached to resolved anchors via `source`/`provider` matching logic. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:43-83,92-145,159-166`

- F007: FIXED — reindex now deletes edges referencing old symbol IDs before reinserting nodes, and scan execution always runs `replaceNodes()` followed by `replaceEdges()` for indexed files, which addresses stale-edge churn without relying on the orphan sweeper. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:221-233,247-265`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:108-116`

- F008: FIXED — JS/TS method nodes are now emitted in both parser paths: regex parsing captures class methods explicitly, and tree-sitter maps `method_definition` to `method` and also promotes class-scoped functions to methods. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:323-353`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:91-99,359-365`

- F009: FIXED — recovered compact text is now fenced and sanitized before injection: system-like lines are stripped and the payload is wrapped in `[SOURCE: ...] ... [/SOURCE]` markers before being emitted as recovered context. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-109`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:52-57`

- F010: PARTIAL — live dispatch now uses shared schema validation for many tool families (`memory_context`, memory, causal, lifecycle), but code-graph dispatch still bypasses `validateToolArgs()` and no `code_graph_*` / `ccc_*` schemas are present in `TOOL_SCHEMAS`, so validator coverage is not universal. Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:658-661`; `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:14-17`; `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:76-107`; `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:35-84`; `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:396-451`

## Iteration Summary
- New findings: P0 0, P1 0, P2 0
- Verified fixes: 7
- Remaining active: 3
