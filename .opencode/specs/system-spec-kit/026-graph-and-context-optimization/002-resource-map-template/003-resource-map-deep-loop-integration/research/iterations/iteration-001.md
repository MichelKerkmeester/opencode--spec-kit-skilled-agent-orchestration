# Iteration 1: Live Deep-Loop Data Contracts

## Focus
Validate the live deep-loop data contracts first by inspecting shipped reducer inputs, JSONL iteration records, delta expectations, and the phase-012 `resource-map.md` template so phase 013 can target real evidence shapes instead of packet assumptions.

## Findings
1. The shipped iteration prompt packs define a minimal canonical append contract, but the live reducers and review-mode contract still depend on richer run-based records. Deep research dispatch tells the agent to append only `type`, `iteration`, `newInfoRatio`, `status`, and `focus`, while the reducer dashboard renders `record.run` and `record.findingsCount`; deep review likewise advertises a minimal `iteration` schema in the prompt pack, but the review-mode contract requires `mode`, `run`, `dimensions`, `filesReviewed`, `findingsCount`, lineage fields, and timestamps. This means phase 013 cannot treat the prompt-pack JSON example as the whole truth and should normalize from richer evidence streams or reducer-normalized state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:699] [SOURCE: .opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:67] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308]
2. The reducer boundary already owns synchronized derived outputs and sits after strict post-dispatch artifact validation. The deep research workflow validates the iteration markdown, the state-log append, and the per-iteration delta file before it runs `reduce-state.cjs`; the reducer then reads config, state log, strategy, and iteration files and rewrites registry, strategy, and dashboard. That makes the safest low-coupling emission point a convergence-aware step adjacent to or immediately after reducer execution, not inside the leaf-agent contract and not as a per-iteration side effect. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:823] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1136]
3. The live delta contract is event-stream JSONL, not a nested per-iteration array payload. Deep research delta files are documented as one `type:"iteration"` row plus one row per `graphEvent`, `finding`, `invariant`, `observation`, `edge`, and `ruled_out`; deep review uses one row per `graphEvent`, `finding`, `classification`, `traceability-check`, and `ruled_out`. Phase 013's current spec assumes an extractor input like `review deltas (with findings[])` and `research deltas (with source_paths[] / citations[])`, which is already underspecified against the shipped stream format and therefore needs an adapter layer before any shared extractor can exist. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50] [SOURCE: .opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78]
4. The phase-012 template is stricter than the packet currently implies: emitted maps must preserve the ten-category skeleton, omit empty categories without renumbering, stay repo-root relative, and honor category precedence rules (`Specs > Config`, `Meta > READMEs`, `Skills > Documents`, `Tests > Scripts`). Because deep-loop evidence spans command YAML, reducer scripts, skill docs, packet artifacts, and tests, the eventual emitter should be template-driven with shared category classification logic rather than skill-specific markdown assembly. [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:21] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:111] [SOURCE: .opencode/skill/system-spec-kit/templates/resource-map.md:171]

## Ruled Out
- Using the packet spec's proposed `findings[]` delta shape as the implementation baseline. The shipped delta format is line-oriented event JSONL, so direct extractor input from packet prose would be misleading. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:78] [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:50]
- Emitting from the leaf agent or per-iteration prompt contract. Post-dispatch validation and reducer synchronization already define the stable workflow boundary, so pushing resource-map generation into the agent would increase coupling to executor/prompt drift. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724] [SOURCE: .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1171]

## Dead Ends
- Treating prompt-pack JSON examples as the sole authoritative schema. They are necessary for dispatch validation, but insufficient for downstream aggregation because the reducer and review-mode contracts consume richer fields and lineage state. [SOURCE: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308]

## Sources Consulted
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/spec.md:50
- .opencode/skill/system-spec-kit/templates/resource-map.md:21
- .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:40
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:823
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:724
- .opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:67
- .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:308
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1136

## Assessment
- New information ratio: 1.00
- Questions addressed:
  - What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?
  - What is the smartest minimal-coupling integration point for resource-map emission: inside the reducers, as a post-reducer workflow step, or during synthesis?
  - How should the emitted review and research maps extend the phase-012 resource-map template without creating format drift or brittle template coupling?
- Questions answered:
  - What are the real reducer inputs and per-iteration evidence shapes in sk-deep-review and sk-deep-research today, and what normalization is actually required?

## Reflection
- What worked and why: Reading the shipped prompt packs, workflow YAML, reducers, and phase-012 template together exposed contract drift quickly because each surface owns a different part of the runtime truth.
- What did not work and why: Relying on the phase-013 packet spec alone would have produced the wrong extractor input model; it describes nested delta arrays that do not match the live JSONL event stream.
- What I would do differently: In the next iteration, trace the exact convergence path and synthesis/report writers in both loops so the resource-map emission step can be placed on the lowest-coupling finalization hook instead of guessed from specs.

## Recommended Next Focus
Trace the live convergence/finalization path in both deep-loop workflows and reducers: determine whether resource-map emission should run inside reducer finalization, in a dedicated post-reducer workflow step, or alongside synthesis/report generation, and catalog the docs/tests/YAML surfaces that already describe that boundary.
