# Iteration 003 - Robustness

Dimension: robustness

Code files read:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Verification:

- Git log checked for the parser/test files.
- Scoped vitest result: PASS, 22 tests.

## Finding

### FIMPL-003 - P2 robustness

Fresh graph-metadata derivation caps `derived.trigger_phrases` at 12, but the legacy migration fallback does not apply the same cap. The schema stays permissive, so a legacy payload with many trigger phrases/key topics can still return a migrated metadata object with more than 12 trigger phrases.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:262`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:289`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1053`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:37`

Expected: all parser-produced graph metadata respects the same derived trigger phrase budget.

Actual: only the fresh derivation path slices to 12; legacy fallback builds an uncapped array.

Convergence: not reached; third implementation finding opened.
