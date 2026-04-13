# Iteration 35: Reconverged Synthesis And 95%+ Path

## Focus
Close the post-implementation verification wave by stating what improved, what remains, and what the smallest next moves are if the goal is robust 95%+ behavior on abbreviated fragments.

## Findings
1. The reproducible portion of the old corpus is now above the original bar. The preserved replay scores `95.65%`, which means the shipped fixes cleared the prior `87.88%` baseline on the exact subset we can replay without reconstruction drift. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
2. To keep a 95%+ story on abbreviated fragments, the next gains need to target short-form `research_finding` versus `metadata_only` and short telemetry `drop` cues, not the already-fixed delivery or handover mechanics. [INFERENCE: synthesis across iterations 26-34]
3. The highest-leverage small changes are: stronger short-form drop wrappers for phrases like `captured file count`, `tool executions`, and `repository state`; a clearer research-versus-metadata distinction when `_memory.continuity` vocabulary appears inside analytical finding prose; and one additional guard so spec-doc nouns do not automatically push progress text into `research_finding`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:385] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:417] [INFERENCE: synthesis across preserved replay and residual error cases]
4. If the team wants even more headroom without a broad corpus rewrite, the next experimental lever is to let prototype `negativeHints` influence Tier 2 tie-breaking or fallback penalties. Those hints exist in the library today, but they do not participate in the live scoring path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:11] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:802] [INFERENCE: packet-local code inspection]
5. Research is reconverged after iteration 35. No unanswered packet questions remain, and any further progress now depends on whether the team wants to optimize short-fragment robustness beyond the already-fixed core routing boundaries. [INFERENCE: synthesis across the full 35-iteration packet]

## Ruled Out
- Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass.

## Dead Ends
- Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:385`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:417`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:11`

## Assessment
- New information ratio: 0.15
- Questions addressed: RQ-16
- Questions answered: RQ-16

## Reflection
- What worked and why: The post-implementation wave answered the right follow-up questions instead of simply restating the pre-implementation research.
- What did not work and why: The original compact-generator gap prevents one neat single-number story across all 132 prior samples.
- What I would do differently: Preserve compact-fragment fixtures as packet artifacts before the next routing tune-up so future replays can stay fully reproducible.

## Recommended Next Focus
No further research needed unless the team chooses to pursue short-fragment robustness as a separate targeted refinement wave.
