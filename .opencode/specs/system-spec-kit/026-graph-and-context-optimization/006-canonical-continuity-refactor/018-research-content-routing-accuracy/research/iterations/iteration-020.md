# Iteration 20: Remediation Synthesis And Sequencing

## Focus
Fold the new remediation-design evidence back into the original accuracy research and produce the final implementation-ready recommendation set.

## Findings
1. The original baseline still holds: the router is broadly strong, the current thresholds are defensible, and the remaining accuracy problems are concentrated in two confusion seams. The new work explains how to fix those seams without changing the overall tier architecture. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:8] [INFERENCE: synthesis across iterations 1-20]
2. Delivery/progress confusion is primarily caused by cue asymmetry, not by threshold tuning. Progress has broad implementation verbs plus an `observations` floor, while delivery lacks enough sequencing and verification-order language in both `RULE_CUES` and `scoreCategories()`. Prototype refreshes should support that fix, not replace it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:341] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853]
3. Handover/drop confusion is primarily caused by over-aggressive drop dominance. The router currently treats `git diff`-style operational commands too much like transcript wrappers. Splitting hard drop wrappers from soft operational cues is the smallest effective fix, and it stays inside the explicit scope of phase `002`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877]
4. Tier3 wiring is worthwhile only as a targeted ambiguity resolver. The contract is already bounded and cache-aware, but the production classifier implementation is missing. Phase `003` should reuse the existing OpenAI-compatible fetch pattern, add audit visibility, and stay fail-open so canonical saves never depend on an LLM being available. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185]
5. The prototype library and tests are good enough to support a narrow remediation wave, but not good enough to verify it without new regression cases. The highest-value sequence is: phase `001` cue plus prototype tuning, phase `002` drop relaxation plus state-first handover examples, and phase `003` Tier3 wiring only after the heuristic fixes are benchmarked. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/001-fix-delivery-progress-confusion/spec.md:10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/003-wire-tier3-llm-classifier/spec.md:10]

## Ruled Out
- Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land.

## Dead Ends
- Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:341`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185`

## Assessment
- New information ratio: 0.38
- Questions addressed: RQ-7, RQ-8, RQ-9, RQ-10, RQ-11
- Questions answered: RQ-7, RQ-8, RQ-9, RQ-10, RQ-11

## Reflection
- What worked and why: The second wave stayed tightly scoped to fix design, so every iteration produced directly actionable implementation guidance.
- What did not work and why: The research packet did not start with explicit remediation questions, which forced the second wave to retrofit them after the first synthesis.
- What I would do differently: Seed future deep-research packets with a built-in "what should change" follow-up section once baseline measurement converges.

## Recommended Next Focus
Implement phases `001`, `002`, and `003` in that order, then rerun the same synthetic corpus and regression suite as an explicit before/after benchmark.
