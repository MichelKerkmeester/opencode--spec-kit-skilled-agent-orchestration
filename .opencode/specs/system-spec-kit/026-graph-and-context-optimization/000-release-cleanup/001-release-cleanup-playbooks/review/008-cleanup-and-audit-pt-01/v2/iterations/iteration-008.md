# Iteration 008

- Dimension: Maintainability
- Focus: Dead references, stale mocks, and repo hygiene after the retirement cleanup
- State read first: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`

## Findings

### P2

- **NF003 - `context-server.vitest.ts` still mocks the removed `findMemoryFiles` export.** The test harness sets up `vi.doMock()` for `findMemoryFiles` on both import specifiers even though the parsing README now documents that the retired discovery surface was removed and discovery moved to `memory-index-discovery.ts`. The stale mock does not revive runtime behavior, but it leaves dead test scaffolding behind the remediation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:907-908] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:46-46]

## Notes

- This finding is maintainability-only. The active parser tests already enforce rejection of legacy `memory/` paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:328-330] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:265-286]

## Next Focus

Iteration 009 will re-check the correctness lane to separate the closed runtime F001 path from the new command-workflow drift found in NF001/NF002.
