# Iteration 002 - Security

## Verification

- Scoped vitest: PASS, 22 tests.
- Git log: checked for both audited files.

## Findings

### DRI-002 - P1 Security - Internal traversal segments can resolve and persist as key-file paths

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557` rejects only paths beginning with `../`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:727` strips `./` but does not reject embedded `..` segments.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:730` resolves the candidate against the spec folder.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:785` returns the original display path when any lookup exists.

Expected: path-shaped candidates containing traversal segments should be rejected or canonicalized and bounded before they are stored as `derived.key_files`.

Actual: a candidate such as `subdir/../../../../skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` can pass `keepKeyFile`, resolve to an existing file through `path.resolve`, and be returned unchanged.

## Delta

New findings: 1. Registry total: P0=0, P1=2, P2=0.
