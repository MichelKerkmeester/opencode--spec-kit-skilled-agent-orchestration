# Iteration 002 - Security

Dimension: security

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Finding

### FIMPL-002 - P1 security

Key-file extraction rejects candidates that start with `../`, but it does not reject internal dot-dot segments before passing the candidate to `path.resolve`-based lookup paths. A spec-controlled markdown reference can therefore use a shape like `nested/../../target.ts`; if the normalized lookup resolves to an existing file, the display path is accepted into derived metadata.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:513`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:521`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:730`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:784`

Impact is metadata pollution and limited file-existence probing, not direct content disclosure: the implementation checks `existsSync`/`statSync` and returns the original display path. Still, for generated graph metadata, traversal-like segments should fail closed before lookup.

Convergence: not reached; second implementation finding opened.
