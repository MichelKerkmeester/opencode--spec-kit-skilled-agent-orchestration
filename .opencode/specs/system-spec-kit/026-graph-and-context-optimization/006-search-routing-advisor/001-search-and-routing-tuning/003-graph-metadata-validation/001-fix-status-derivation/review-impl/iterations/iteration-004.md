# Iteration 004 - Testing

## Scope

- Dimension: testing.
- Code files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Prior findings: IMPL-F001, IMPL-F002, IMPL-F003.

## Verification

- Git history checked for the two scoped files.
- Vitest: PASS, 1 file, 22 tests.

## Findings

### IMPL-F004 - P1 - Status fallback tests miss deferred/not-applicable checklist semantics

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:275`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:292`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:309`

The targeted regression cases cover all checked, one unchecked, and no checklist. They do not cover deferred/not-applicable unchecked rows, which are common in packet checklists and are the exact semantics that decide whether implementation-summary presence is a safe completion signal.

## Testing Notes

- The suite also lacks ordered-list coverage for IMPL-F002.
- Existing coverage for explicit frontmatter precedence and status normalization is useful and should be retained.
