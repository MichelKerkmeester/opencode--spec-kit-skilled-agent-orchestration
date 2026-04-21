# Iteration 004 - Testing

## Verification

- Scoped vitest: PASS, 22 tests.
- Git log: checked for both audited files.

## Findings

### DRI-004 - P1 Testing - Tests do not cover traversal-in-path or legacy fallback sanitizer parity

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:225` tests legacy fallback with valid-looking `spec.md, plan.md` key files only.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:386` starts key-file filter tests.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:400` covers leading `../spec.md`, but not embedded `..` segments.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:425` covers derived cleanup for obsolete and missing paths, not legacy fallback cleanup.

Expected: the regression suite should pin the exact security/correctness edges introduced by the resolver: embedded traversal rejection and legacy fallback parity.

Actual: the suite passes while both DRI-001 and DRI-002 remain possible.

## Delta

New findings: 1. Registry total: P0=0, P1=3, P2=1.
