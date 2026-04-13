# Iteration 11: Delivery Versus Progress Cue Audit

## Focus
Read the exact delivery and progress cue definitions and identify which phrases currently force delivery-shaped content into `narrative_progress`.

## Findings
1. `narrative_progress` has both broader verb coverage and a stronger default path than `narrative_delivery`. Its cue table matches `refactor`, `implemented`, `merged`, `added`, `built`, `fixed`, `updated`, `shipped`, and verification phrases such as `tests pass`, while `scoreCategories()` also forces progress to at least `0.72` for any `observations` chunk containing those implementation verbs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:341] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842]
2. Delivery only gets two narrow regex rows plus one floor boost. Today those patterns mainly recognize explicit rollout vocabulary such as `feature flag`, `shadow`, `rollout`, `canary`, `dual-write`, `staging`, `sequenced`, and `awaiting runtime verification`. They do not cover common delivery phrasing from the shipped prototypes such as `updated together`, `only then`, `kept pending until`, `same runtime truth`, `auditable`, or `deliberately avoided shipping first`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37]
3. The strongest delivery prototypes already describe the missing language the cue table should learn. `ND-01`, `ND-02`, and `ND-04` use sequencing markers (`first`, `then`, `only then`), same-pass alignment language (`updated together`), and verification-order language (`verification stayed intentionally narrow`, `docs synchronized`) that do not map to any current delivery-specific floor. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:45]
4. Phase `001-fix-delivery-progress-confusion` is pointed at the correct file but is too coarse about the change. The concrete implementation seam is not only the delivery regex block at `RULE_CUES.narrative_delivery`; it is also the progress-specific override at `scoreCategories()` lines `853-860`, because that floor lets implementation verbs beat delivery cues before Tier2 can correct the route. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/spec.md:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853]

## Ruled Out
- Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug.

## Dead Ends
- Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:341`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/spec.md:10`

## Assessment
- New information ratio: 0.72
- Questions addressed: RQ-7
- Questions answered: none

## Reflection
- What worked and why: Reading the regex table beside the score floors made it obvious that delivery is under-specified in two separate places.
- What did not work and why: Prototype labels alone hid the real issue because the live heuristics never read those labels.
- What I would do differently: Compare the prototype language to the cue table immediately, rather than treating them as separate phases of analysis.

## Recommended Next Focus
Inspect delivery and progress prototypes as a distribution problem, not just a regex problem, to see whether the prototype corpus reinforces the same confusion.
