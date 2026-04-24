# Iteration 005 - Correctness

## Inputs Read

- Prior iterations: 001-004
- Registry
- `cross-encoder.ts` cache lookup, set, and status paths

## Verification

- Vitest: PASS, 2 files, 61 tests.
- Git history checked.

## Findings

No new correctness findings.

Confirmed DRI-F001 remains the only correctness finding. I checked whether the pipeline remaps rows after reranking; that reduces stale object leakage for the main stage-3 caller, but it does not fix stale scores because `rerankResults()` can still reuse scores computed against prior document text.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:434`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:439`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485`

## Convergence

New finding ratio: 0.00. Churn: 0.08 due scope refinement. Continue.
