# Iteration 005 - Correctness

## Focus
- Dimension: `correctness`
- Goal: run a stabilization pass to confirm the open findings stay documentary and do not hide runtime breakage.

## Files reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Findings

No new correctness finding.

- The public API contract still exports the helper surface, which confirms DR-P1-002 is documentation drift rather than a code-removal regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577]
- The tests now assert that retired `lp` option bits do not change cache keys and that length does not change reranker scores. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:147-151] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:75-137]

## Iteration outcome
- Severity delta: `+0 P0 / +0 P1 / +0 P2`
- Refinement: `DR-P1-002`
- `newFindingsRatio`: `0.06`
- Next focus: `security`
