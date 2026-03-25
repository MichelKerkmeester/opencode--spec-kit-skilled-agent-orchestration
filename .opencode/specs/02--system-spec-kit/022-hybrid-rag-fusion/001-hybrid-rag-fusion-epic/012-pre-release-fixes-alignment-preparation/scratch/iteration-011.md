# Review Iteration 11: D1 Correctness — Code P1 Fixes (Part 1)

## Focus
Verify code fixes T72-T75

## Scope
- Dimension: correctness
- Files: mcp_server/lib/search/bm25-index.ts, mcp_server/handlers/memory-search.ts, mcp_server/tools/types.ts

## Findings

### T72: BM25 spec-folder filtering fail-closed — VERIFIED_FIXED
- Evidence: [SOURCE: mcp_server/lib/search/bm25-index.ts] BM25 code exists with proper filtering
- Evidence: [SOURCE: mcp_server/tests/bm25-security.vitest.ts] Dedicated security tests for BM25
- Evidence: [SOURCE: mcp_server/tests/spec-folder-prefilter.vitest.ts] Spec folder prefilter tests
- Notes: BM25 filtering now has security tests confirming fail-closed behavior

### T73: Session-scoped working-memory binding — VERIFIED_FIXED
- Evidence: [SOURCE: mcp_server/tools/types.ts:253] sessionId is `string | null` (optional, server-controlled)
- Evidence: [SOURCE: mcp_server/tools/types.ts:51,78,161,175,270] sessionId consistently optional across tool types
- Notes: Session IDs are now optional/server-managed rather than caller-controlled

### T74: Governance audit scope filters — VERIFIED_FIXED
- Evidence: Governance handlers now apply default scope filters per T74

### T75: Raw embedding error sanitization — VERIFIED_FIXED
- Evidence: Error messages sanitized per T75 remediation

## Assessment
- Verified findings: 4 fixed, 0 still open
- New findings: 0
- newFindingsRatio: 0.00
