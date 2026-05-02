# Iteration 1: D1 Reducer Rollup and Resume Drift

## Focus
This iteration investigated D1 runtime gaps in `sk-deep-research` v1.5.0.0, with emphasis on reducer-owned rollups, lifecycle resume semantics, and whether packet-level synchronized surfaces preserve the same state the loop claims to emit.

## Findings
- The reducer drops every non-`iteration` JSONL row by filtering `parseJsonl(...).filter((record) => record.type === 'iteration')`, so documented `resumed`, `guard_violation`, `blocked_stop`, and stuck-recovery events can exist in `deep-research-state.jsonl` without ever surfacing in `findings-registry.json`, `deep-research-strategy.md`, or `deep-research-dashboard.md` (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502; .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84; .opencode/skill/sk-deep-research/references/loop_protocol.md:113-120).
- Dashboard stuck reporting does not match the loop contract: the protocol says stuck count increments whenever `newInfoRatio < config.convergenceThreshold`, but the dashboard only counts `status == "stuck"` or `newInfoRatio === 0`, so low-but-nonzero no-progress passes are invisible in the synchronized packet view (.opencode/skill/sk-deep-research/references/loop_protocol.md:190-198; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444).
- The reducer rollup is materially narrower than the JSONL/state schema. It parses findings, ruled-out bullets, sources, reflection, and next-focus from iteration markdown, but it never promotes `noveltyJustification`, structured `ruledOut.reason/evidence`, `sourceStrength`, or `graphEvents`, which makes those fields effectively write-only unless another consumer reads raw JSONL (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:146-175; .opencode/skill/sk-deep-research/references/state_format.md:145-152; .opencode/skill/sk-deep-research/references/state_format.md:171-177).
- Resume context has a documented side channel that the reducer never reflects. Both the loop protocol and agent contract say `research/research-ideas.md` should be read during resume, but reducer inputs are limited to config, JSONL, strategy, registry/dashboard outputs, and `iterations/`, so synchronized packet surfaces cannot show whether the ideas backlog changed the resumed trajectory (.opencode/skill/sk-deep-research/references/loop_protocol.md:247-255; .opencode/agent/deep-research.md:64-76; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:481-487).
- Deep-research ownership guidance still drifts internally: the skill data flow says the agent writes `strategy.md` during each iteration, while the agent contract says reducer-owned state should be refreshed only from the iteration file plus JSONL append. That mismatch creates a real redundant-pass risk for any runtime or operator following the older skill text literally (.opencode/skill/sk-deep-research/SKILL.md:190-199; .opencode/agent/deep-research.md:159-166).

## Ruled Out
- No evidence that prior iteration findings would make these observations redundant; `research/iterations/` was empty before this run and `deep-research-state.jsonl` only contained the config row (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl:1).
- No evidence that YAML workflow outputs bypass the reducer-owned packet surfaces; both auto and confirm flows still target `findings-registry.json` and `deep-research-dashboard.md` as synchronized outputs (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196-217).

## Dead Ends

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-38
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502
- .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84
- .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198
- .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255
- .opencode/skill/sk-deep-research/references/state_format.md:145-177
- .opencode/skill/sk-deep-research/SKILL.md:190-199
- .opencode/agent/deep-research.md:159-166

## Reflection
- What worked and why: Reading the reducer before broader docs worked because the state rollup code immediately exposed which JSONL fields and lifecycle events are actually consumed.
- What did not work and why: The first asset-path sweep mixed real and nonexistent filenames, which created noise until I narrowed to the actual auto/confirm YAML files.
- What I would do differently: Next time I would inspect the reducer inputs first, then sample only the specific protocol sections that claim those inputs should exist.

## Recommended Next Focus
D5 is the best next turn. This iteration showed that `graphEvents` and lifecycle events are emitted into JSONL but not surfaced by the reducer, so the next productive question is whether any runtime phase actually reads coverage-graph state or `graphEvents` to influence convergence, contradiction handling, or stop gating, or whether the graph is still mostly emitted-and-forgotten.
