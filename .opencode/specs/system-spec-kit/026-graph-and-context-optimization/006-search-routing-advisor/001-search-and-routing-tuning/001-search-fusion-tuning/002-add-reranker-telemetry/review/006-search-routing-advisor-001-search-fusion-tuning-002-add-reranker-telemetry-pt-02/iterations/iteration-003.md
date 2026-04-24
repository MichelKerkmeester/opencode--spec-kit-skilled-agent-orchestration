# Iteration 003 - Robustness

## Inputs Read

- Prior iterations: 001-002
- Registry
- `cross-encoder.ts` provider paths and exported public API

## Verification

- Vitest: PASS, 2 files, 61 tests.
- Git history checked.

## Findings

### DRI-F004 - P2 Robustness

Provider response indices are trusted before validation. The mapping spreads `documents[item.index]` and reads `.id` through the same unchecked index, so malformed provider output can throw instead of being filtered to valid results.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382`

### DRI-F006 - P2 Robustness

`ProviderConfigEntry.maxDocuments` is declared for each provider but `rerankResults()` does not enforce it before dispatching to the selected provider. Direct callers can send more documents than the configured provider limit.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:41`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:57`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458`

## Convergence

New finding ratio: 0.40. Continue.
