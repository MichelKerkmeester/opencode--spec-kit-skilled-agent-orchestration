# Iteration 3: Promoted 001 root review report versus current Stage 3 runtime

## Focus
Cross-checked the promoted `001-search-fusion-tuning` root review report against the live Stage 3 MMR implementation, the targeted regression test, and the promoted root task list to verify whether the carried-forward review packet still reflects current runtime reality.

## Findings

### P0

### P1
- **F002**: Promoted root deep-review artifacts still preserve pre-promotion 017/018/019 verdicts instead of current 010 reality — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md:11` — The promoted `001` root review report still says the live runtime ignores `adaptiveFusionIntent` in Stage 3 and still frames the tree as old packet `017`, but the current Stage 3 code already prefers `config.adaptiveFusionIntent ?? config.detectedIntent`, the regression suite asserts the continuity lambda path, and the promoted root tasks record that fix as complete. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md:11`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/deep-review-dashboard.md:18`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/tasks.md:11`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:244`]

{"type":"claim-adjudication","findingId":"F002","claim":"At least one promoted root review packet was not regenerated after the move and now contradicts current runtime truth.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md:11",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/deep-review-dashboard.md:18",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/tasks.md:11",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209",".opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:244"],"counterevidenceSought":"I checked whether the old review report might still be correct and the current code/test only cover a narrower case.","alternativeExplanation":"The report could have been intentionally preserved as historical context, but it is stored as the live root review packet under the promoted tree and is not marked archival.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the promoted root review packet is clearly marked historical-only or regenerated to the current 010 lineage and runtime state."}

### P2

## Ruled Out
- A live Stage 3 continuity regression still exists in the promoted runtime. The code and regression now both prefer the continuity handoff.

## Dead Ends
- The old root review report contains plenty of historical detail, but it does not establish the current promoted runtime state by itself.

## Recommended Next Focus
Check whether the promoted `002-content-routing-accuracy` root review packet shows the same stale-lineage problem, especially around metadata-only host selection and the old 018 verdict.

## Assessment
- New findings ratio: 0.34
- Dimensions addressed: correctness, traceability
- Novelty justification: This pass converted an initial suspicion about stale review lineage into a concrete cross-check against current code and test evidence.
