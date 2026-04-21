# Iteration 009 - Correctness

Dimension: correctness

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Result

No new correctness finding.

FIMPL-001 remains the only correctness issue. The preference function correctly handles canonical path-like packet docs, but the name-key map is broader than that policy and applies to all file kinds.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:852`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:858`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:872`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:879`

Recommended correctness shape: key canonical packet docs by normalized document name, but key non-canonical files by normalized path or by `kind + path`.

Convergence: low new-finding ratio, no P0.
