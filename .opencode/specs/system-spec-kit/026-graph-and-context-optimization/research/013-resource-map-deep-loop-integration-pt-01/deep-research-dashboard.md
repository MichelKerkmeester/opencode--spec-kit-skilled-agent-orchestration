---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Deeply investigate what needs to be implemented for packet 026/013 to integrate automatic convergence-time resource-map.md emission into sk-deep-review and sk-deep-research in a smart, low-coupling way. Determine the live delta/state schemas, safest integration points, template-fit constraints, workflow/docs/test changes, and the edge-case handling needed for a production-quality implementation.
- Started: 2026-04-24T10:30:43.408Z
- Status: INITIALIZED
- Iteration: 2 of 7
- Session ID: dr-2026-04-24T10-30-43-408Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Validate the live deep-loop data contracts first: inspect real reducer inputs, JSONL records, and delta expectations in both sk-deep-review and sk-deep-research so the resource-map design is grounded in shipped shapes rather than packet assumptions. | - | 1.00 | 4 | complete |
| 2 | Trace the live convergence/finalization path in both deep-loop workflows and reducers: determine whether resource-map emission should run inside reducer finalization, in a dedicated post-reducer workflow step, or alongside synthesis/report generation, and catalog the docs/tests/YAML surfaces that already describe that boundary. | integration-boundary | 0.75 | 4 | complete |

- iterationsCompleted: 2
- keyFindings: 8
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?
- [x] What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?
- [ ] How should the emitted review and research maps extend the phase-012 resource-map template without creating format drift or brittle template coupling?
- [ ] Which command, YAML, docs, catalog, playbook, and test surfaces must change to satisfy the phase-013 acceptance criteria end-to-end?
- [ ] Which failure modes and edge cases need explicit handling so the feature is idempotent, child-phase-safe, and resilient to malformed or partial evidence?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 1.00 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":18}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171] (iteration 1)
- Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308] (iteration 1)
- Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] (iteration 1)
- Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29] (iteration 2)
- Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873] (iteration 2)
- Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128] (iteration 2)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Pin the exact implementation contract for the new emitter step across both auto and confirm workflows: target path should be the canonical resolved artifact root (`{artifact_dir}/resource-map.md`), opt-out/config wiring should stay workflow-owned, and the remaining work should map the precise docs/catalog/playbook/test surfaces plus idempotency and child-phase edge cases against that chosen boundary.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
