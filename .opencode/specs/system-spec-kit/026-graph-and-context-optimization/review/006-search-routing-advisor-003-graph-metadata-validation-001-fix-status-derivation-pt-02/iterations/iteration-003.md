# Iteration 003 - Robustness

## Scope

- Dimension: robustness.
- Code files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Prior findings: IMPL-F001, IMPL-F002.

## Verification

- Git history checked for the two scoped files.
- Vitest: PASS, 1 file, 22 tests.

## Findings

### IMPL-F003 - P2 - Non-canonical status strings can be persisted as derived status

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:153`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:174`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:40`

`normalizeDerivedStatus()` maps known status synonyms, but falls through by returning the normalized unknown string. The graph metadata schema then accepts any non-empty status. A typo or local custom status can therefore escape into derived metadata instead of becoming `unknown`, `planned`, `in_progress`, or `complete`.

## Robustness Notes

- I/O errors on canonical docs are handled fail-closed as `unknown` at `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:407` and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:998`.
- Temp-file collision handling was separately hardened at `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1145`.
