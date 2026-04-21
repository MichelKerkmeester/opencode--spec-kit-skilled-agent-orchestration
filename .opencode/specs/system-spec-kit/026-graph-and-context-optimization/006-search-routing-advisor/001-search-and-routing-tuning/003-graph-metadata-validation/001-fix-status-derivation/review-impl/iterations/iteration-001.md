# Iteration 001 - Correctness

## Scope

- Dimension: correctness.
- Code files reviewed:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Prior registry: empty.

## Verification

- Git history checked for the two scoped files.
- Vitest: `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default`
- Result: PASS, 1 file, 22 tests.

## Findings

### IMPL-F001 - P1 - Deferred or not-applicable checklist items keep implementation-summary-backed packets in_progress

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1017`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1022`

The fallback classifies checklist completion by collecting every markdown task list item and requiring every one to be checked. That means an implementation-summary-backed packet with explicit unchecked deferred or not-applicable rows still derives `in_progress`, even when the checklist policy treats those rows as intentionally deferred rather than unfinished delivery work.

### IMPL-F002 - P2 - Ordered markdown task lists are invisible to checklist completion

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1018`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1020`

The task-list matcher accepts only `-` and `*` bullets. Ordered markdown items such as `1. [x] verified` produce zero recognized checklist items and therefore derive `INCOMPLETE`.

## Ruled Out

- Explicit frontmatter precedence is intentional and covered at `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:346`.
