# Iteration 008 - Testing

Dimension: testing

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Finding

### FIMPL-005 - P2 testing

The key-file sanitization tests reject `../spec.md`, commands, bare filenames, and several noisy candidates, but they do not cover internal dot-dot segments such as `nested/../target.ts` or `nested/../../target.ts`.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:386`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:400`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:730`

This is the test gap that lets FIMPL-002 survive. Add a direct assertion for internal traversal segments and, if behavior changes, a derived-metadata fixture showing the candidate is excluded from `derived.key_files`.

Convergence: new testing finding reset low-churn sequence.
