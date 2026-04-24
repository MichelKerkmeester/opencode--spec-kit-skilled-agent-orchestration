# Iteration 7: Final Guardrail Sweep

## Focus
Final blocker and contradiction sweep for phase 013 after the contract and rollout order were already pinned. The goal of this pass was to catch the last non-obvious implementation traps before work starts.

## Findings
1. In deep review, `step_emit_resource_map` cannot be inserted at the generic "before report compile" boundary. It has to run after `step_build_finding_registry` and `step_adversarial_selfcheck`, because those steps settle the active P0/P1/P2 registry that the final report uses. Emitting earlier would let `resource-map.md` preserve pre-adjudication counts while `review-report.md` shows post-adjudication counts. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:915] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:919] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1004] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1024] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1033]
2. The rollout still has an operator-facing path-contract trap on the deep-review side. The command overview says the review packet lives under `{spec_folder}/review/` and outputs `{spec_folder}/review/review-report.md`, while the live YAML resolves a root-level `{artifact_dir}` packet for child phases and the completion message still summarizes artifacts as `review/review-report.md` plus `review/` state files. If phase 013 only adds a `resource-map.md` mention without fixing those surrounding output descriptions, users and manual tests will keep checking the wrong location for child-phase runs. [SOURCE: .opencode/command/spec_kit/deep-review.md:187] [SOURCE: .opencode/command/spec_kit/deep-review.md:202] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:113] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1014]
3. The packet still encodes the wrong failure boundary in a way that could leak into implementation tests. `spec.md` treats malformed or missing delta conditions as degradable map-generation cases, but the live workflow already treats missing canonical iteration/delta outputs as post-dispatch hard failures before reduction. The "degraded but continue" behavior should stay limited to malformed non-canonical evidence rows that a renderer chooses to skip after the workflow contract has already been satisfied. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:219] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:225] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:109] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:787] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:799]
4. The safest shared implementation seam is not "one raw-input extractor for both loops"; it is "shared path classifier/renderer plus loop-specific normalizers." The template only permits the generic `Path | Action | Status | Note` shape, but deep review's final trustworthy counts emerge after registry/self-check adjudication while deep research synthesis consumes iteration artifacts and strategy data directly. A single raw payload contract would either duplicate review adjudication logic or lose fidelity. [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:55] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:67] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:919] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:831] [INFERENCE: based on the differing synthesis inputs in the review and research workflows]

## Ruled Out
- Emitting the deep-review map at the first generic synthesis boundary before `step_build_finding_registry` and `step_adversarial_selfcheck`. That would create map/report disagreement on active severities. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:915] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928]
- Treating phase-013 as "add a resource-map mention and move on." The command/output/completion surfaces around deep review still carry child-local artifact wording that has to be corrected together. [SOURCE: .opencode/command/spec_kit/deep-review.md:193] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1014]
- Designing one extractor API around the packet's nested `findings[]` prose shape. The live template and workflow stages still demand normalized, loop-specific inputs first. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:55]

## Dead Ends
- Accepting `{spec_folder}/review/` as the only documented output location for child-phase runs is no longer viable; the live workflow resolves root-level packet directories and phase-013 must not reinforce the older child-local wording. [SOURCE: .opencode/command/spec_kit/deep-review.md:194] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:113]
- Treating missing canonical iteration/delta artifacts as degradable warnings is structurally incompatible with the workflow's post-dispatch validation contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:109] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:799]

## Sources Consulted
- .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:18
- .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:77
- .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:117
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:823
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1141
- .opencode/skill/system-spec-kit/templates/resource-map.md:21
- .opencode/skill/system-spec-kit/templates/resource-map.md:55
- .opencode/skill/system-spec-kit/templates/resource-map.md:67
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:787
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:915
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1014
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:975
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1004
- .opencode/command/spec_kit/deep-review.md:187
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:219

## Assessment
- New information ratio: 0.85
- Questions addressed: final blocker sweep; review synthesis ordering; operator-facing path drift; degraded-vs-hard-fail boundary
- Questions answered: review ordering trap; deep-review output-path drift surfaces; failure-boundary cleanup for degraded handling

## Reflection
- What worked and why: Reading the live synthesis ordering, completion summaries, and packet edge-case prose together worked because the remaining risk was no longer "where should the feature live?" but "where could adjacent surfaces silently disagree after implementation?"
- What did not work and why: Re-reading the packet alone was not enough; it still encodes reducer-local and custom-column assumptions, so it cannot expose runtime ordering traps without the YAML and command surfaces beside it.
- What I would do differently: If this packet had more iterations left, I would run one implementation dry-run checklist against the exact files in the planned patch order to confirm every user-facing artifact summary that needs a `resource-map.md` mention.

## Recommended Next Focus
Start implementation, but keep four guardrails explicit in the patch plan: rewrite the packet docs first, keep the renderer/template shared but normalize inputs per loop, place the deep-review emitter after registry + self-check, and update the command/completion/output surfaces that still point operators at the wrong artifact location for child-phase runs.
