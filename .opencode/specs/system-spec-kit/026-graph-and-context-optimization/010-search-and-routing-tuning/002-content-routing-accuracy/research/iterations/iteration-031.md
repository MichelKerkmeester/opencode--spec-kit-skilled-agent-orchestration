# Iteration 31: save_workflow.md Parity And Wording Nuance

## Focus
Cross-check `save_workflow.md` against the shipped router and save handler, then look for any wording that is functionally correct but stronger than the code can guarantee at runtime.

## Findings
1. `save_workflow.md` matches the shipped category map, Tier flow, soft operational drop split, `routeAs` audit behavior, and metadata-first `packet_kind` derivation. [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:302] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:389] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:858]
2. The same alignment also appears in `ARCHITECTURE.md`, so the deeper design doc, the operator command doc, and the skill entrypoint now tell the same routing story. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:135] [SOURCE: .opencode/command/memory/save.md:89] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549]
3. The one wording nuance is environmental. The docs phrase Tier 3 as if `LLM_REFORMULATION_ENDPOINT` is configured, while the code only checks whether the env var exists and otherwise returns `null` without hard failure. [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:321] [SOURCE: .opencode/command/memory/save.md:93] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:899] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:953]
4. That nuance is not a functional parity break because the same docs also state that unavailable Tier 3 falls back safely to Tier 2 with a penalty or refuses to route. The behavior description is correct even if the "configured" wording is slightly stronger than the code's guarantee. [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569]
5. The documentation surface is therefore functionally aligned, with only one optional hardening opportunity: replace "is configured" with "when configured" or similar availability-aware language. [INFERENCE: parity read across save_workflow.md, save.md, SKILL.md, ARCHITECTURE.md, and the shipped runtime]

## Ruled Out
- Treating the endpoint-availability wording nuance as a substantive documentation mismatch.

## Dead Ends
- Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules.

## Sources Consulted
- `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:302`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md:135`
- `.opencode/command/memory/save.md:93`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:899`

## Assessment
- New information ratio: 0.24
- Questions addressed: RQ-14
- Questions answered: RQ-14

## Reflection
- What worked and why: The workflow reference preserves the same conceptual chunks as the operator docs, so parity checking was fast once the code trace was already in hand.
- What did not work and why: Environmental wording is easy to overread as a hard runtime guarantee when the code intentionally fail-opens instead.
- What I would do differently: Treat environment-dependent claims as a separate wording pass from behavior parity so future doc reviews can distinguish nuance from drift.

## Recommended Next Focus
Measure prototype separation directly and decide whether the refreshed corpus is now well separated or merely "good enough because heuristics rescue the boundary."
