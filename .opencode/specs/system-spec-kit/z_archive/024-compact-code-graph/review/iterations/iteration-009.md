# Iteration 009 - Maintainability Extension

## Scope

- Dimension: `maintainability`
- Reviewed surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`

## Findings

### P0

- None.

### P1

- None.

### P2

- None.

## Notes

- Runtime-specific hook policy remains centralized in one detector instead of being re-implemented in each startup surface, which keeps future runtime parity changes localized [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:61] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:84].
- The code-graph handlers still reuse shared payload-building patterns for readiness and structural trust instead of duplicating JSON envelope assembly per branch [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:85] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:94] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:88] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:169].
- Focused handler tests keep the maintenance burden bounded by pinning the specialized extension paths directly, especially readiness metadata, edge enrichment, and blast-radius traversal [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:109] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:148] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:48].
