# Iteration 30: ARCHITECTURE and Configs Doc Alignment

## Focus
Read `ARCHITECTURE.md` and `mcp_server/configs/README.md` against the shipped code and identify any post-implementation drift.

## Findings
1. Both docs correctly describe the implemented continuity weight profile, the `MIN_RESULTS_FOR_RERANK = 4` gate, the no-op length-penalty behavior, and the existence of cache telemetry on `getRerankerStatus()`. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:150] [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:152] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:53]
2. The same two docs overstate the Stage 3 continuity story. They present the continuity lambda as if continuity-oriented reranking is live, but the code still drives Stage 3 MMR from `config.detectedIntent`, not from the continuity-specific `adaptiveFusionIntent`. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:150] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209]
3. The wording gap is larger than it first appears because the canonical resume surface bypasses `handleMemorySearch()` entirely. So the docs are not just slightly optimistic; they currently blur a search-profile hint with the operator-facing resume ladder. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6]

## Ruled Out
- Treating `ARCHITECTURE.md` and `configs/README.md` as fully aligned just because the constants and weight values match the code.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`

## Assessment
- New information ratio: 0.21
- Questions addressed: `RQ-13`
- Questions answered: none fully; this pass isolated doc drift in two of the three target docs

## Reflection
- What worked and why: Comparing prose claims directly against the exact code paths kept the doc audit concrete.
- What did not work and why: Matching constants can make a paragraph look correct even when the control-flow claim behind those constants is still wrong.
- What I would do differently: Treat operator-surface wording and internal search-path wording as separate alignment checks from the start.

## Recommended Next Focus
Check whether `SKILL.md` has the same overstatement or whether its shorter summary surface stayed aligned.
