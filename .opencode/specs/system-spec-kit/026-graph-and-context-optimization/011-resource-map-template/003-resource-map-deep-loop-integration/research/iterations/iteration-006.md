# Iteration 6: Implementation Sequencing and Rollout Safety

## Focus
Turn the corrected phase-013 contract into the smallest safe implementation order: decide what must land first, which slices can stay decoupled, where the workflow can break if landed in the wrong order, and which verification step should gate each slice.

## Findings
1. The packet-doc rewrite is a hard dependency, not optional prep work. The current packet still promises reducer-local emission, nested `findings[]` extractor inputs, custom `Findings` / `Citations` columns, and new standalone doc/playbook files, while the live workflow/template contract points to workflow-owned synthesis emission, JSONL delta normalization, Note/Summary-only counts, and edits to existing synthesis surfaces. If runtime code lands before the packet rewrite, the implementation will be judged against the wrong contract and the task list will steer changes into the wrong files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/tasks.md:58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/checklist.md:55] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:37]
2. The smallest safe first runtime slice after the packet rewrite is a pure shared extractor/renderer plus unit fixtures, with no workflow wiring yet. The live workflows already pin `packet_dir`, `delta_dir`, and narrative outputs under the resolved `{artifact_dir}`, and post-dispatch validation already guarantees canonical iteration records plus a delta file before reduction. That means the extractor can be built and tested against real delta-file inputs and the locked template shape without risking an intermediate runtime failure. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:98] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:114] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:103] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:39] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:181]
3. Config/CLI plumbing and workflow invocation have to land together after the extractor exists. The command surfaces currently parse only executor-related flags into `config.executor.*`, and none of the four workflow YAMLs expose a `resourceMap.emit` setting or `resource-map.md` output today. If `step_emit_resource_map` lands before `resourceMap.emit`, `--no-resource-map`, and the new `state_paths.resource_map_output` contract are added consistently to both auto and confirm flows, the runtime will either lack the opt-out path or diverge by mode. [SOURCE: .opencode/command/spec_kit/deep-research.md:64] [SOURCE: .opencode/command/spec_kit/deep-research.md:79] [SOURCE: .opencode/command/spec_kit/deep-review.md:62] [SOURCE: .opencode/command/spec_kit/deep-review.md:77] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:98] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:84] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:89]
4. The final wiring slice should be a workflow-owned synthesis emitter that reuses the already-resolved `{artifact_dir}` and only then extend the existing synthesis docs/playbooks plus run manual loop verification. Re-resolving artifact roots inside the emitter is unsafe for child-phase packets because `resolveArtifactRoot()` allocates `{phaseSlug}-pt-{NN}` by counting existing siblings at call time; a late re-resolve can therefore drift into a new sibling packet. The manual testing surfaces already anchor final-synthesis behavior to the existing command/YAML contracts, so the docs and full integration runs belong after the runtime seam is real. [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:19] [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:65] [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:114] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:71] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md:73]

## Ruled Out
- Landing runtime changes before rewriting phase-013 packet docs. This would preserve the wrong acceptance criteria and create avoidable review churn because the packet still points work into reducers, custom columns, and new standalone docs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/checklist.md:55]
- Shipping only one mode (`:auto` or `:confirm`) first. Both modes already resolve packet state from the same `{artifact_dir}` contract, so mode-skew would make the user-facing contract inconsistent and is not a safe intermediate state. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:98] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:84] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:89]
- Re-resolving artifact roots inside the emitter or extractor after workflow setup. Child-phase packet allocation is sequential and late resolution can move writes into a sibling `-pt-NN` directory. [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:31] [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:117]

## Dead Ends
- Using the packet's current reducer-local wording as the rollout plan is now a dead end. The live synthesis boundary and the phase-012 template make that plan structurally incompatible with the shipped contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:81] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:45]

## Sources Consulted
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:50
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/tasks.md:58
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/checklist.md:55
- .opencode/command/spec_kit/deep-research.md:64
- .opencode/command/spec_kit/deep-review.md:62
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:98
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:89
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873
- .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:84
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:89
- .opencode/skill/system-spec-kit/templates/resource-map.md:37
- .opencode/skill/system-spec-kit/templates/resource-map.md:181
- .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:65
- .opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:71
- .opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md:73

## Assessment
- New information ratio: 0.85
- Questions addressed: implementation sequencing, rollout safety, verification order, wrong-sequence breakage risks
- Questions answered: what should land first, what can be isolated as a safe first runtime slice, which slices must ship together, and which checks should gate each slice

## Reflection
- What worked and why: Cross-reading the packet docs with the live workflow state-path contracts and the shared artifact resolver turned an already-known ownership decision into a concrete patch order, because it exposed which intermediate states are harmless and which would produce user-visible contract drift.
- What did not work and why: Re-reading the packet alone no longer helped; it still encodes the old reducer-centric model, so it cannot answer sequencing questions without being checked against the live YAML/template/path sources.
- What I would do differently: If another sequencing iteration were needed, I would inspect the exact config-template JSON assets and any workflow tests next so the rollout order could name the precise parser or snapshot files to update in slice 3.

## Recommended Next Focus
Execute the implementation in four slices:
1. Rewrite `spec.md`, `tasks.md`, and `checklist.md`, then run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration --strict`.
2. Land the shared delta-file extractor/renderer plus fixtures and run targeted vitest for that slice.
3. Add top-level `resourceMap.emit`, `--no-resource-map`, `state_paths.resource_map_output`, and `step_emit_resource_map` together across both deep-loop commands and all four YAMLs, then verify mode parity with focused grep/readback.
4. Wire the synthesis emitter to the pinned `{artifact_dir}`, update the existing synthesis docs/playbooks/SKILL surfaces, and finish with manual deep-review/deep-research runs plus the opt-out path.
