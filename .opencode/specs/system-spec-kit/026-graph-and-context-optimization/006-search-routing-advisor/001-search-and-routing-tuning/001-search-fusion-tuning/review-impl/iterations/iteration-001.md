# Iteration 001 - Correctness

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## Checks

- Confirmed `calculateLengthPenalty()` is a score no-op at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230`.
- Confirmed `applyLengthPenalty()` preserves scores/order and returns a shallow copy at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`.
- Confirmed cache lookup/storage now ignores the retired length-penalty flag at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485`.

## Findings

### F-IMPL-P2-001 [P2] generateCacheKey keeps a generic optionBits parameter but silently ignores it

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:252`
- Evidence: The helper still accepts `optionBits?: string`, and the nearby comment still says cache keys include "option bits" at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246`, but the actual key at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257` contains only provider, query, and document ids. The packet-linked test intentionally locks ignored `lp` behavior at `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:147`.
- Risk: Current length-penalty compatibility is fine, but future callers can pass non-length option bits and silently collide in the cache.
- Recommendation: Rename the parameter to make the compatibility behavior explicit, or remove/constrain the argument in a dedicated cleanup phase.

## Verification

- Scoped vitest command: PASS, 4 files, 128 tests.

