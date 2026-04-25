# Vitest Triage Phase 2: Architecture + Fixture Drift

## Fixed Tests

- `mcp_server/tests/graph-payload-validator.vitest.ts`: updated code-graph DB mocks for `resolveSubjectFilePath` and post-027 graph metadata provenance.
- `mcp_server/tests/context-server.vitest.ts`: expanded dispatch coverage to code-graph tools and accepted wrapped dispatch callbacks.
- `mcp_server/tests/layer-definitions.vitest.ts`: modeled L8 advisor tools as virtual exceptions instead of forcing them into the 7-layer map.
- `mcp_server/tests/deep-loop/prompt-pack.vitest.ts`: aligned prompt-pack expectations with `state_paths_delta_pattern`.
- `mcp_server/tests/integration-138-pipeline.vitest.ts`: updated expected intent count to the current post-migration classifier total.
- `mcp_server/tests/review-fixes.vitest.ts`: updated tool-count assertion for the current MCP surface.
- `mcp_server/tests/search-archival.vitest.ts`: removed obsolete `includeArchived` expectations from vector search aliases.
- `scripts/tests/template-structure.vitest.ts`: converted the template-structure helper import path to current ESM exports.

## Files Modified

- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`

## Verification

- `vitest run tests/context-server.vitest.ts --reporter=default` passed: 416 tests.
- `vitest run tests/layer-definitions.vitest.ts --reporter=default` passed: 41 tests.
- Batch reruns for graph payload, deep-loop prompt pack, integration 138, review fixes, search archival, and template structure passed after the targeted updates.

## Proposed Commit Message

`test(system-spec-kit): align vitest fixtures with post-migration architecture`
