# Iteration 004: Maintainability pass on persisted key_files output

## Focus
Maintainability review of the packet's regenerated `key_files` surface and downstream reviewer ergonomics.

## Findings
### P1 - Required
- **F005**: `graph-metadata.json` still stores duplicate aliases for the same parser/test files (`.opencode/skill/...` and `mcp_server/...`), even though the packet summary says the list now behaves like a clean file surface. [SOURCE: `graph-metadata.json:33-40`] [SOURCE: `implementation-summary.md:53-57`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:717-789`]

## Ruled Out
- Derived entity dedupe is already more canonical than the persisted `key_files` list because the tests explicitly prefer path-like entity paths over basename duplicates. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445-463`]

## Dead Ends
- Re-reading the packet's source-doc tables did not reveal a second maintainability issue beyond the alias-duplicate `key_files` output.

## Recommended Next Focus
Return to correctness and verify whether the stale lineage surface is contradicted by the canonical description-generation contract or only by the stored artifact.

## Assessment
- New findings ratio: 0.18
- Cumulative findings: 0 P0, 5 P1, 0 P2
