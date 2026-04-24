# Iteration 004 - Testing

## Prior State

Read iterations 001-003 and registry. Open findings: `P0-IMPL-001`, `P1-IMPL-002`.

Vitest: PASS, `2 passed` files, `77 passed | 3 skipped`.

## Finding

### P1-IMPL-003 - Focused tests miss the two high-risk negative cases introduced by routing and merge safety

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:405` covers no checklist task line matching the identifier.
- `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:434` covers duplicate checklist task lines with the same own identifier.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1494` covers handler zero-match refusal.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1528` covers handler duplicate-match refusal.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625` starts benign Tier 3 natural-routing coverage with `target_doc: 'implementation-summary.md'`.

Expected: tests include the critical negative cases for this implementation surface: a task id mentioned as dependency text on another checklist line, and a Tier 3 response that tries to route outside the packet.

Actual: the new tests lock the intended refusal strings for zero and duplicate own-task lines, but do not catch incidental mention ambiguity. Tier 3 tests use benign target docs and do not assert containment.

## Delta

New findings: 1. Registry updated with `P1-IMPL-003`.
