# Iteration 007 - Correctness Extension

## Scope

- Dimension: `correctness`
- Reviewed surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`

## Findings

### P0

- None.

### P1

- None.

### P2

- None.

## Notes

- The reviewed read paths still run the same bounded inline readiness guard before answering and return readiness metadata rather than silently trusting stale graph state [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:318] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:328].
- The public surfaces stay aligned on the four-tool structural interface: `code_graph_query` and `code_graph_context` remain documented in the README and registered in the canonical tool list [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:988] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1003] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:848] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851].
- Dedicated handler tests still cover the extension-specific branches the root packet depends on, including context-readiness metadata and blast-radius traversal behavior [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:48] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:148] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:219].
