# Iteration 2: Convergence / Finalization Ownership Boundary

## Focus
Trace the live convergence/finalization path in both deep-loop workflows and reducers to determine whether `resource-map.md` emission should run inside reducers, in a dedicated post-reducer workflow step, or alongside synthesis/report generation, and catalog the docs/tests/YAML surfaces that already describe that boundary.

## Findings
1. The smartest minimal-coupling owner is a dedicated workflow step that runs after reducer synchronization and before final narrative synthesis, not reducer-local emission and not report-writing itself. Deep research ends each iteration with post-dispatch validation, `step_reduce_state`, graph upsert, evaluation, and dashboard refresh, then switches into a separate `phase_synthesis` that hydrates summary metrics and compiles `research.md`; deep review follows the same split between `step_reduce_review_state` and a later synthesis phase that builds `review-report.md`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873]
2. Reducers are intentionally scoped to synchronized derived state, not convergence-only authored artifacts. The research reducer reads config/state/strategy/iterations, derives registry + strategy + dashboard, and writes only those three outputs; the review reducer does the same for review registry + strategy + dashboard, and both reducers explicitly promise idempotence for identical inputs. Putting `resource-map.md` generation inside reducers would mix template rendering and convergence-time file policy into a component that currently just refreshes deterministic state views. [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:855] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:872] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1179]
3. Synthesis/report compilation is the wrong primary owner because those steps already assemble narrative products, while the phase-012 template defines `resource-map.md` as a non-narrative path ledger. Research synthesis consolidates findings into `research.md`; review synthesis builds a deduplicated registry and a nine-section `review-report.md`; the template explicitly says the map should provide blast-radius coverage and should not duplicate narrative, decisions, or test evidence. That makes synthesis the natural trigger boundary for the emitter, but not the place to inline template assembly logic. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:23] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:31]
4. The existing boundary is already documented across multiple runtime surfaces, so phase 013 must change more than reducer code. Research `state_format.md` defines reducer-owned registry/dashboard outputs, workflow-owned `research.md`, and child-phase packet rooting under canonical `{artifact_dir}`; review `loop_protocol.md` describes the four-phase lifecycle plus the reducer contract; and research manual test `DR-033` tells operators to run the reducer first, inspect reducer-owned artifacts second, and workflow YAML third. This means the production-quality implementation needs coordinated YAML, reference-doc, playbook, and packet-spec updates so the new emitter step remains discoverable and testable. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:27] [SOURCE: .opencode/skill/sk-deep-review/references/loop_protocol.md:15] [SOURCE: .opencode/skill/sk-deep-review/references/loop_protocol.md:150] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md:28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:50]

## Ruled Out
- Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128]
- Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29]

## Dead Ends
- Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873]

## Sources Consulted
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:855
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128
- .opencode/skill/sk-deep-research/references/state_format.md:15
- .opencode/skill/sk-deep-review/references/loop_protocol.md:150
- .opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md:28
- .opencode/skill/system-spec-kit/templates/resource-map.md:23
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:50

## Assessment
- New information ratio: 0.75
- Questions addressed: What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?; Which command, YAML, docs, catalog, playbook, and test surfaces must change to satisfy the phase-013 acceptance criteria end-to-end?
- Questions answered: What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?

## Reflection
- What worked and why: Reading the live auto YAML, reducer implementations, and protocol/playbook docs together made the ownership split obvious because the same boundary shows up independently in orchestration, code, and operator-facing validation surfaces.
- What did not work and why: Looking for an answer in the phase packet alone was insufficient because the packet currently assumes reducer invocation and convergence-time emission happen in the same place, while the shipped workflows still separate reducer refresh from synthesis/report generation.
- What I would do differently: Next time I would inspect the confirm workflows in the same pass so the auto/confirm drift matrix can be captured alongside the ownership decision instead of in a later iteration.

## Recommended Next Focus
Pin the exact implementation contract for the new emitter step across both auto and confirm workflows: target path should be the canonical resolved artifact root (`{artifact_dir}/resource-map.md`), opt-out/config wiring should stay workflow-owned, and the remaining work should map the precise docs/catalog/playbook/test surfaces plus idempotency and child-phase edge cases against that chosen boundary.
