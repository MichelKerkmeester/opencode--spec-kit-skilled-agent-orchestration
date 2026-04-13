# Iteration 19: Phase-By-Phase Implementation Guidance

## Focus
Convert the remediation evidence into exact code-change guidance for implementation sub-phases `001`, `002`, and `003`.

## Findings
1. Phase `001-fix-delivery-progress-confusion` should touch three places. In `content-router.ts`, expand `RULE_CUES.narrative_delivery` around lines `345-348` with sequencing and gating phrases drawn from the delivery prototypes, then add a delivery-biased floor in `scoreCategories()` near lines `859-860` for phrases such as `only then`, `updated together`, `kept pending until`, `same pass`, and `awaiting runtime verification`. Also gate the progress floor at lines `853-857` so strong delivery cues can outrank raw implementation verbs when both are present. Finally, refresh the most ambiguous delivery/progress prototypes in `routing-prototypes.json`, especially `ND-03`, `ND-04`, and `NP-05`, to sharpen the boundary without rewriting the whole corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:45]
2. Phase `002-fix-handover-drop-confusion` should split hard and soft drop cues. In `content-router.ts`, keep transcript/table-of-contents/recovery-wrapper evidence in the hard drop branch, but move `git diff`, `list memories`, and similar operational commands into a softer path that cannot beat a strong handover state by default. Add a stronger handover floor for `current state`, `next session`, `active files`, `remaining effort`, `next safe action`, and `resume` near lines `868-869`, then preserve `extractHardNegativeFlags()` for true wrappers only. Prototype work should focus on making handover examples more state-first, not on weakening correct drop examples. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:353] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83]
3. Phase `003-wire-tier3-llm-classifier` should add a real classifier adapter and then inject it. The missing constructor seam is `memory-save.ts` line `1008`; the existing call graph is already ready to receive `classifyWithTier3` and `cache`. Reuse the fail-open, timeout-bounded `fetch()` pattern from `lib/search/llm-reformulation.ts`, but build the request from `buildTier3Prompt()` and return validated `Tier3RawResponse` objects. Then add handler coverage for natural routing without `routeAs`, plus router coverage for cache hits, timeouts, and unavailable-provider fallbacks in the live save path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:203]
4. Test work should follow the same phase boundaries. `content-router.vitest.ts` needs explicit regression samples for delivery-plus-implementation language, handover-plus-command language, and metadata-versus-research ambiguity. `handler-memory-save.vitest.ts` needs at least one naturally ambiguous atomic-save fixture that reaches Tier3 and proves safe fallback when the classifier returns `null` or times out. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076]

## Ruled Out
- Treating the implementation phases as independent. The code and test changes need to move together.

## Dead Ends
- Deferring the regression tests until after the cue/prototype fixes land.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076`

## Assessment
- New information ratio: 0.46
- Questions addressed: RQ-7, RQ-8, RQ-9, RQ-11
- Questions answered: RQ-7, RQ-8

## Reflection
- What worked and why: Mapping each phase spec directly onto the exact lines and fixtures kept the guidance concrete.
- What did not work and why: The original phase specs were accurate at the theme level but too compressed to drive implementation without this extra pass.
- What I would do differently: Add exact target line ranges and named prototype IDs directly into future implementation specs.

## Recommended Next Focus
Close the loop with a final synthesis that combines the original accuracy findings with the new remediation design and implementation sequencing.
