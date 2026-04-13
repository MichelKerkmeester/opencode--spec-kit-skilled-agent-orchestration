---
title: "Raise Minimum Rerank Candidate Threshold - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321` uses `MIN_RESULTS_FOR_RERANK = 4`.
- [ ] Stage 3 regression tests prove the new boundary with explicit 3-result and 4-result assertions.
- [ ] Local reranker coverage confirms the policy shift applies to GGUF reranking as well as remote providers.
## P1 (Should Fix)
- [ ] The phase keeps the change localized to Stage 3 and does not rewrite direct `crossEncoder.rerankResults()` tests unnecessarily.
- [ ] Verification notes state clearly that 2-result and 3-result sets now skip reranking by design.
- [ ] The implementation record cites `../research/research.md:167-184,247-248` rather than reopening the `4 vs 5` decision.
## P2 (Advisory)
- [ ] Future metrics capture whether the new threshold should stay at `4` once live telemetry exists.
- [ ] Any user-facing documentation that mentions rerank thresholds is updated after runtime verification.
