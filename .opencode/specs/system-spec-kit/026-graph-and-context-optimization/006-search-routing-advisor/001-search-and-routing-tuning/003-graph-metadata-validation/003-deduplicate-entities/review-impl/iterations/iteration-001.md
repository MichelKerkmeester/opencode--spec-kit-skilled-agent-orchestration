# Iteration 001 - Correctness

Dimension: correctness

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default`
- Result: PASS, 22 tests.

## Finding

### FIMPL-001 - P1 correctness

The new entity dedupe key is global lowercased `name`, and key-file entities use only `path.basename(filePath)` as that name. That is correct for canonical packet docs like `spec.md`, but it is wrong for distinct implementation files that naturally share a basename, such as `src/index.ts` and `lib/index.ts`.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:872`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:879`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:884`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:889`

The focused regression test proves canonical doc collisions collapse to one entity, but it does not prove same-basename non-doc files remain distinct.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:461`

Expected: canonical packet docs dedupe by document name, while distinct non-canonical code/test/config file paths can both remain represented.

Actual: all entity candidates share one lowercased-name map, so later same-basename code files are ignored unless the candidate wins the canonical-doc preference branch.

Convergence: not reached; first implementation finding opened.
