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
- Iteration: 7 of 7
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
| 3 | Pin the exact implementation contract for a workflow-owned emitter step at `{artifact_dir}/resource-map.md`, then map the required auto/confirm YAML, command/docs, playbook/catalog, and edge-case updates. | implementation-contract | 0.90 | 5 | complete |
| 4 | Turn this contract into an implementation-ready delta list: pin the exact config/CLI plumbing for the opt-out flag, define the extractor input/output API around event-stream delta files plus template-faithful Note-column counts, and revise the phase-013 packet acceptance criteria/tasks so they point at the workflow-owned synthesis step and the existing synthesis docs/playbooks instead of reducer-local hooks and custom output columns. | implementation-delta | 0.88 | 4 | complete |
| 5 | Audit the current phase-013 packet docs against the live contract and produce an explicit rewrite list with file/requirement/task drift called out precisely. | packet-rewrite-audit | 0.85 | 4 | insight |
| undefined | Produce the implementation sequencing plan for the corrected contract: safest patch order, coupled slices, verification gates, and wrong-sequence breakage risks. | - | 0.85 | 0 | complete |
| 7 | Final guardrail sweep. Look for hidden blockers, contradictions, or rollout traps that could still surprise implementation after the contract and sequencing are understood. | guardrail-sweep | 0.85 | 4 | complete |

- iterationsCompleted: 7
- keyFindings: 29
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?
- [x] What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?
- [x] How should the emitted review and research maps extend the phase-012 resource-map template without creating format drift or brittle template coupling?
- [x] Which command, YAML, docs, catalog, playbook, and test surfaces must change to satisfy the phase-013 acceptance criteria end-to-end?
- [x] Which failure modes and edge cases need explicit handling so the feature is idempotent, child-phase-safe, and resilient to malformed or partial evidence?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.85 -> 0.85 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":92}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171] (iteration 1)
- Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308] (iteration 1)
- Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] (iteration 1)
- Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29] (iteration 2)
- Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873] (iteration 2)
- Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128] (iteration 2)
- Extending the emitted maps with custom `Findings (P0/P1/P2)` or `Citations` table columns. The locked phase-012 template already standardizes the table shape and drift rules, so custom columns would make deep-loop maps a template fork instead of a template reuse. [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:55] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:181] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:136] (iteration 3)
- Re-resolving artifact roots inside the emitter or extractor. Child-phase packet allocation is not stable across repeated fresh resolves, so the emitter must inherit the already-resolved `{artifact_dir}` from workflow state instead. [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:31] [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:117] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:823] (iteration 3)
- Treating the packet's current file list as "new standalone feature/playbook docs everywhere" without first updating the existing synthesis docs. The shipped synthesis feature files and finalization playbooks are already the authoritative contract surface, so ignoring them would leave the main operator-facing sources stale even if new helper docs were added. [SOURCE: .opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/04-synthesis.md:24] [SOURCE: .opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/04-synthesis.md:31] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:60] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md:60] (iteration 3)
- Adding the opt-out switch to `executor-config.ts` or `config.executor.*`. That schema only governs executor selection and executor-specific validation, so a resource-map flag there would conflate dispatch concerns with synthesis artifact policy. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21] [SOURCE: .opencode/command/spec_kit/deep-research.md:79] (iteration 4)
- Preserving phase-013's custom `Findings` / `Citations` columns or special summary headers like `created_at` as part of the shipped contract. The phase-012 template already fixes the column set and summary structure, so these are template forks rather than edge-case handling. [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:39] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:80] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:220] (iteration 4)
- Treating the extractor input as the packet's current `findings[]`-style pseudo-schema. The live deltas are line-oriented event streams, so any implementation that skips a normalization stage will drift from real workflow data immediately. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] (iteration 4)
- No new dead ends beyond the previously blocked directions. This iteration reaffirmed that reducer-local emission, nested `findings[]` extractor inputs, and custom `Findings` / `Citations` columns must stay out of the implementation packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:136] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:181] (iteration 5)
- Preserving the packet's wildcard “create new feature/playbook entry” approach as the primary docs plan. The live operator-facing synthesis contract already lives in the existing synthesis pages and finalization scenarios, so leaving those unchanged would keep the canonical docs stale. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/tasks.md:73] [SOURCE: .opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/04-synthesis.md:18] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md:66] (iteration 5)
- Treating the current phase-013 packet as implementation-ready without first rewriting `spec.md`, `tasks.md`, and `checklist.md`. The current packet would route work back into reducers and custom table columns that the live workflow/template contract does not support. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:55] (iteration 5)
- Landing runtime changes before rewriting phase-013 packet docs. This would preserve the wrong acceptance criteria and create avoidable review churn because the packet still points work into reducers, custom columns, and new standalone docs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/checklist.md:55] (iteration 6)
- Re-resolving artifact roots inside the emitter or extractor after workflow setup. Child-phase packet allocation is sequential and late resolution can move writes into a sibling `-pt-NN` directory. [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:31] [SOURCE: .opencode/skill/system-spec-kit/shared/review-research-paths.cjs:117] (iteration 6)
- Shipping only one mode (`:auto` or `:confirm`) first. Both modes already resolve packet state from the same `{artifact_dir}` contract, so mode-skew would make the user-facing contract inconsistent and is not a safe intermediate state. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:98] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:84] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:89] (iteration 6)
- Using the packet's current reducer-local wording as the rollout plan is now a dead end. The live synthesis boundary and the phase-012 template make that plan structurally incompatible with the shipped contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:81] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:45] (iteration 6)
- Accepting `{spec_folder}/review/` as the only documented output location for child-phase runs is no longer viable; the live workflow resolves root-level packet directories and phase-013 must not reinforce the older child-local wording. [SOURCE: .opencode/command/spec_kit/deep-review.md:194] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:113] (iteration 7)
- Designing one extractor API around the packet's nested `findings[]` prose shape. The live template and workflow stages still demand normalized, loop-specific inputs first. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:55] (iteration 7)
- Emitting the deep-review map at the first generic synthesis boundary before `step_build_finding_registry` and `step_adversarial_selfcheck`. That would create map/report disagreement on active severities. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:915] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] (iteration 7)
- Treating missing canonical iteration/delta artifacts as degradable warnings is structurally incompatible with the workflow's post-dispatch validation contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:109] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:799] (iteration 7)
- Treating phase-013 as "add a resource-map mention and move on." The command/output/completion surfaces around deep review still carry child-local artifact wording that has to be corrected together. [SOURCE: .opencode/command/spec_kit/deep-review.md:193] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1014] (iteration 7)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Start implementation, but keep four guardrails explicit in the patch plan: rewrite the packet docs first, keep the renderer/template shared but normalize inputs per loop, place the deep-review emitter after registry + self-check, and update the command/completion/output surfaces that still point operators at the wrong artifact location for child-phase runs.

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
