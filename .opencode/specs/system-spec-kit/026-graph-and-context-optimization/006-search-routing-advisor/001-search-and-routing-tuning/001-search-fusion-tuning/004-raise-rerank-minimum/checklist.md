---
title: "Raise Minimum Rerank Candidate Threshold - Checklist"
status: complete
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321` uses `MIN_RESULTS_FOR_RERANK = 4`. Evidence: `stage3-rerank.ts` now sets `MIN_RESULTS_FOR_RERANK = 4`.
- [x] Stage 3 regression tests prove the new boundary with explicit 3-result and 4-result assertions. Evidence: `stage3-rerank-regression.vitest.ts` now checks both `3 => skip` and `4 => apply`.
- [x] Local reranker coverage confirms the policy shift applies to GGUF reranking as well as remote providers. Evidence: `stage3-rerank-regression.vitest.ts` includes the local GGUF reranker path, and the current targeted Vitest run passed.
## P1 (Should Fix)
- [x] The phase keeps the change localized to Stage 3 and does not rewrite direct `crossEncoder.rerankResults()` tests unnecessarily. Evidence: the runtime change is isolated to `stage3-rerank.ts`, with threshold coverage added in `stage3-rerank-regression.vitest.ts`.
- [x] Verification notes state clearly that 2-result and 3-result sets now skip reranking by design. Evidence: the regression suite names and assertions explicitly encode the `3 => false` and `4 => true` boundary.
- [x] The implementation record keeps the `4` cutoff as shipped behavior without claiming packet-local research-line evidence. Evidence: `implementation-summary.md:37-48` documents the Stage 3 threshold, 3-row/4-row boundary tests, and targeted Vitest command.
## P2 (Advisory)
- [x] Future metrics capture whether the new threshold should stay at `4` once live telemetry exists. Evidence: `implementation-summary.md` sets the next safe action to watch continuity-query telemetry before considering `5`.
- [x] Any user-facing documentation that mentions rerank thresholds is updated after runtime verification. Evidence: the `005-doc-surface-alignment` child packet closed the README, architecture, command, and config-doc threshold wording against the shipped runtime.
