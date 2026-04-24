---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable - analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Deeply investigate what needs to be implemented for packet 026/013 to integrate automatic convergence-time resource-map.md emission into sk-deep-review and sk-deep-research in a smart, low-coupling way. Determine the live delta/state schemas, safest integration points, template-fit constraints, workflow/docs/test changes, and the edge-case handling needed for a production-quality implementation.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?
- [x] What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?
- [ ] How should the emitted review and research maps extend the phase-012 resource-map template without creating format drift or brittle template coupling?
- [ ] Which command, YAML, docs, catalog, playbook, and test surfaces must change to satisfy the phase-013 acceptance criteria end-to-end?
- [ ] Which failure modes and edge cases need explicit handling so the feature is idempotent, child-phase-safe, and resilient to malformed or partial evidence?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Do not redesign convergence math, iteration budgets, or the LEAF-agent contracts beyond what phase 013 explicitly needs.
- Do not backfill historical research/review folders.
- Do not broaden this into generic resource-map automation for non-deep-loop commands.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop when the five key questions are either answered or reduced to explicit, bounded implementation decisions.
- Stop early only if later iterations produce diminishing returns and the remaining gaps are minor execution details.
- Hard stop at 7 iterations for this run.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?
- What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the shipped prompt packs, workflow YAML, reducers, and phase-012 template together exposed contract drift quickly because each surface owns a different part of the runtime truth. (iteration 1)
- Reading the live auto YAML, reducer implementations, and protocol/playbook docs together made the ownership split obvious because the same boundary shows up independently in orchestration, code, and operator-facing validation surfaces. (iteration 2)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Relying on the phase-013 packet spec alone would have produced the wrong extractor input model; it describes nested delta arrays that do not match the live JSONL event stream. (iteration 1)
- Looking for an answer in the phase packet alone was insufficient because the packet currently assumes reducer invocation and convergence-time emission happen in the same place, while the shipped workflows still separate reducer refresh from synthesis/report generation. (iteration 2)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29]

### Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171]

### Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873]

### Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128]

### Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308]

### Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171] (iteration 1)
- Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308] (iteration 1)
- Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] (iteration 1)
- Emitting from `step_compile_research` or `step_compile_review_report`. Those steps already own narrative/report assembly, while the template explicitly positions `resource-map.md` as a separate coverage ledger rather than another narrative section. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:857] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:928] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:29] (iteration 2)
- Looking for an existing hidden `resource-map.md` hook in either deep-loop workflow. The live phase declarations enumerate reducer, dashboard, synthesis/report, and save outputs but no current resource-map emission step, so phase 013 needs a new explicit workflow-owned step rather than enabling a dormant path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:827] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:760] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:873] (iteration 2)
- Reducer-local ownership as the primary emission point. Reducers currently guarantee synchronized registry/strategy/dashboard refreshes only; adding convergence-only artifact emission there would widen reducer scope and make every refresh path responsible for template rendering. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:748] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1128] (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Pin the exact implementation contract for the new emitter step across both auto and confirm workflows: target path should be the canonical resolved artifact root (`{artifact_dir}/resource-map.md`), opt-out/config wiring should stay workflow-owned, and the remaining work should map the precise docs/catalog/playbook/test surfaces plus idempotency and child-phase edge cases against that chosen boundary.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The target phase packet already exists at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration/` and is still in Draft / planning state.
- Phase 012 already landed the base `resource-map.md` template and made it discoverable across system-spec-kit surfaces.
- The current live reducers do not yet emit `resource-map.md` for review or research loops.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 7
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-24T10:30:43.408Z
<!-- /ANCHOR:research-boundaries -->
