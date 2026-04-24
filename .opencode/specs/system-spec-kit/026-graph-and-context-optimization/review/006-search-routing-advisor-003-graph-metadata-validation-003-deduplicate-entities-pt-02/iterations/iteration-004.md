# Iteration 004 - Testing

Dimension: testing

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Finding

### FIMPL-004 - P2 testing

The regression suite validates the intended canonical-doc collision behavior, but it does not cover the negative case: two distinct non-canonical key files with the same basename should not disappear merely because their basenames match.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:461`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:872`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:889`

Missing assertion: a fixture with references such as `packages/a/index.ts` and `packages/b/index.ts` should prove both paths survive as graph entities or that the entity key includes enough path context for non-canonical collisions.

Convergence: all four dimensions have now been covered once, but new-finding ratio remains above the stop threshold.
