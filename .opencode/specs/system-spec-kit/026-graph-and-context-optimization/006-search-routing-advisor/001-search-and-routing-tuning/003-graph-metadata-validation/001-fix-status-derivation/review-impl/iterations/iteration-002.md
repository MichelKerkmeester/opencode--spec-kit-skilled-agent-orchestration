# Iteration 002 - Security

## Scope

- Dimension: security.
- Code files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Prior findings: IMPL-F001, IMPL-F002.

## Verification

- Git history checked for the two scoped files.
- Vitest: PASS, 1 file, 22 tests.

## Findings

No new security findings.

## Security Checks

- Canonical doc reads are bounded to fixed packet-doc names via `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:596` and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:597`.
- Absolute key-file candidates are rejected before lookup at `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:769`.
- Graph metadata writes realpath the parent directory and reject unsupported specs roots at `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1131` and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1139`.

## Ruled Out

- I did not find injection, traversal, secret exposure, auth bypass, or denial-of-service evidence in the scoped status-derivation change.
