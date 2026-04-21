# Iteration 005 - Correctness

Dimension: correctness

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Result

No new correctness finding.

FIMPL-001 was rechecked against the entity cap and insertion order. `deriveKeyFiles()` caps key files at 20, then `deriveEntities()` inserts key-file entities before extracted doc entities and returns the first 24 entity values.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:884`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:912`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`

This confirms the finding is not only theoretical: same-basename key-file loss happens before the 24-entity cap is applied.

Convergence: weighted new-findings ratio dropped below 0.10, but the fixed 10-iteration request continued.
