---
title: "...and-context-optimization/004-agent-governance-and-commands/research/004-agent-governance-and-commands-pt-01/research]"
description: "This 10-iteration pass found that phase 004 still has active drift across command syntax, runtime agent references, and the deep-research governance contract. The highest-risk i..."
trigger_phrases:
  - "and"
  - "context"
  - "optimization"
  - "004"
  - "agent"
  - "research"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/research/004-agent-governance-and-commands-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 004-agent-governance-and-commands

## Summary

This 10-iteration pass found that phase 004 still has active drift across command syntax, runtime agent references, and the deep-research governance contract. The highest-risk issue is not wording drift but a split artifact layout: current deep-research docs promise phase-local `research/`, while the live resolver routes child-phase state to track-root `research/{phaseSlug}-pt-{NN}` and still leaves prompt files under the phase-local folder. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:24-27] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:124-133] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484-487] Codex-specific runtime docs are the noisiest remaining parity gap, with `.md` references still published inside a `.toml` runtime. [SOURCE: .codex/agents/deep-research.toml:19] [SOURCE: .codex/agents/orchestrate.toml:154-163] The packet-level cleanup story in `002-command-graph-consolidation` is directionally correct, but several runtime-facing surfaces remain stale enough that the completion claim now overstates the live state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/implementation-summary.md:70-71] [SOURCE: .opencode/agent/README.txt:10-20]

## Scope

This investigation covered the phase root packet and both nested child packets, then followed the live command and runtime surfaces that govern:

- agent-definition lookup across `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`
- `/spec_kit:deep-research`, `/spec_kit:deep-review`, `/spec_kit:plan`, `/spec_kit:complete`, and `/spec_kit:resume` command-adjacent guidance
- distributed-governance rules in `AGENTS.md`, `CLAUDE.md`, and `system-spec-kit`
- the shared deep-loop artifact resolver and research state format

## Key Findings

### P0

- `F-006` Artifact routing is internally contradictory for child-phase deep-research runs. The state-format reference says the runtime packet lives under `{spec_folder}/research/`, but the live resolver writes child-phase packet state into `{root}/research/{phaseSlug}-pt-{NN}` while prompt files still land under `{spec_folder}/research/prompts/`. This split can break phase-local consumers and makes one run span two directories. Evidence: `iterations/iteration-06.md`, `iterations/iteration-07.md`; `.opencode/skill/sk-deep-research/references/state_format.md:24-27`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-117`, `124-133`, `484-487`, `523-555`; `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:45-100`. Recommended fix: pick one artifact-root contract for child phases, then route prompts, state, and synthesis through that same path.

### P1

- `F-001` Codex runtime agent tables still point to `.md` files even though Codex agent docs declare `.toml` as canonical. This is present in both the orchestrator and context docs and is isolated to the Codex runtime. Evidence: `iterations/iteration-01.md`; `.codex/agents/deep-research.toml:19`; `.codex/agents/context.toml:15`, `364-372`; `.codex/agents/orchestrate.toml:154-163`. Recommended fix: sweep active Codex runtime docs for `.codex/agents/*.md` references and normalize them to `.toml`.
- `F-004` Command invocation syntax is inconsistent across governance surfaces. AGENTS and the skill router require `/spec_kit:deep-research :auto`, while the command cards and quick reference publish `/spec_kit:deep-research:auto` and `/spec_kit:deep-review:auto`. Evidence: `iterations/iteration-04.md`; `AGENTS.md:196-205`; `.opencode/skill/sk-deep-research/SKILL.md:54-56`; `.opencode/command/spec_kit/deep-research.md:196-200`; `.opencode/command/spec_kit/deep-review.md:205-211`; `.opencode/skill/sk-deep-research/references/quick_reference.md:19-23`. Recommended fix: choose one syntax in the parser contract, then update all gate docs, quick references, and command cards together.
- `F-005` Deep-research convergence math is documented two different ways. The quick reference uses weights `0.45/0.30/0.25`, while the detailed convergence reference uses `0.30/0.35/0.35`. Evidence: `iterations/iteration-05.md`; `.opencode/skill/sk-deep-research/references/quick_reference.md:128-136`; `.opencode/skill/sk-deep-research/references/convergence.md:146-154`. Recommended fix: designate one file as the normative convergence surface and regenerate the other from it.
- `F-007` The distributed-governance rule is stronger in policy than in workflow enforcement. Governance requires `templates/level_N/` plus `validate.sh --strict` after each spec-folder markdown write, but the deep-research workflow uses research-specific assets and exposes no comparable validation step around `research/research.md`. Evidence: `iterations/iteration-08.md`; `AGENTS.md:325-327`; `.opencode/skill/system-spec-kit/SKILL.md:61-63`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:213-240`, `728-739`; `.opencode/command/spec_kit/deep-research.md:189-192`. Recommended fix: either codify a deep-research-specific exemption in governance docs or add explicit validation hooks to the workflow.
- `F-010` The cleanup packet's completion story is ahead of the live runtime tree. Phase 002 claims the deprecated wrapper cleanup is complete, but active runtime READMEs and Codex tables still expose stale surfaces. Evidence: `iterations/iteration-10.md`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/spec.md:49-55`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/implementation-summary.md:70-71`, `88-93`; `.opencode/agent/README.txt:10-20`; `.codex/agents/README.txt:10-20`; `.gemini/agents/README.txt:10-20`; `.codex/agents/orchestrate.toml:154-163`. Recommended fix: reopen the packet or create a successor packet specifically for remaining runtime-surface parity corrections.

### P2

- `F-002` Runtime README cleanup is incomplete: OpenCode, Codex, and Gemini still advertise deleted `handover` and `speckit` agents while Claude does not. Evidence: `iterations/iteration-02.md`; `.opencode/agent/README.txt:10-20`; `.codex/agents/README.txt:10-20`; `.gemini/agents/README.txt:10-20`; `.claude/agents/README.txt:10-20`. Recommended fix: regenerate or hand-edit the three stale runtime README indexes from the live directory contents.
- `F-003` `@general` sits in a contract gap between file-backed and built-in agents. AGENTS lists it in the directory-routed agent section, but live runtime docs treat it as built-in and omit it from file tables. Evidence: `iterations/iteration-03.md`; `AGENTS.md:300-316`; `.codex/agents/context.toml:370-374`; `.opencode/agent/orchestrate.md:162-171`; `.codex/agents/orchestrate.toml:154-163`. Recommended fix: explicitly mark `@general` as built-in in AGENTS and runtime docs, or add a dedicated runtime-backed definition file.
- `F-009` Deep-loop workflow assets use the OpenCode agent copy as canonical source, while AGENTS says callers should stay inside the active runtime directory. Evidence: `iterations/iteration-09.md`; `AGENTS.md:300-311`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81-84`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:69-72`. Recommended fix: document whether workflow-owned agents are source-generated from OpenCode or runtime-local, then update AGENTS to reflect that exception or remove the exception.

## Evidence Trail

- Iteration 01 established the Codex path mismatch by pairing the runtime's own convention with stale table entries: `.toml` is canonical in `.codex/agents/deep-research.toml:19`, but the table still names `.codex/agents/context.md` in `.codex/agents/orchestrate.toml:158`.
- Iteration 04 isolated syntax drift with two competing published forms: `"/spec_kit:deep-research :auto"` in `AGENTS.md:200` versus `"/spec_kit:deep-research:auto \"topic\""` in `.opencode/command/spec_kit/deep-research.md:198`.
- Iterations 06 and 07 produced the strongest correctness signal by pairing `"Research mode stores its runtime packet under {spec_folder}/research/"` (`state_format.md:27`) with `"research/ folders are always resolved at the spec tree root"` (`spec_kit_deep-research_auto.yaml:126`) and then showing prompt writes still target `{spec_folder}/research/prompts` (`spec_kit_deep-research_auto.yaml:487`).
- Iteration 08 tied the governance gap to explicit rule language: `templates/level_N/` plus `validate.sh --strict` are required in `AGENTS.md:327`, while deep-research creates and compiles research artifacts through dedicated research assets in `spec_kit_deep-research_auto.yaml:213-240` and `728-739`.
- Iteration 10 showed that packet closeout and live runtime surfaces diverged: the implementation summary says the deprecated wrappers "are gone" (`implementation-summary.md:70`), but current runtime READMEs still publish `handover` and `speckit` (`.opencode/agent/README.txt:15-18`, `.codex/agents/README.txt:15-18`, `.gemini/agents/README.txt:15-18`).

## Recommended Fixes

- `[P0][workflow]` Unify child-phase artifact routing. Either keep all deep-research artifacts in `{spec_folder}/research/` or move every artifact, including `prompts/`, to `{artifact_dir}`. Do not keep a split model.
- `[P1][codex-runtime]` Normalize every active `.codex/agents/*.toml` reference to `.toml` paths and add a targeted parity check for `.codex/agents/*.md` regressions.
- `[P1][command-surface]` Choose one mode-suffix syntax and publish it across AGENTS, skill docs, quick references, command cards, and runtime mirrors in a single patch.
- `[P1][research-protocol]` Regenerate quick-reference convergence weights from the authoritative convergence contract or delete duplicated weights from the quick reference.
- `[P1][governance]` Reconcile distributed governance with workflow-owned research outputs by either adding an explicit exemption for `research/research.md` and related research assets or wiring validation hooks into the deep-research workflow.
- `[P1][packet-closeout]` Reopen phase 002 or create a successor packet for remaining runtime-surface cleanup so completion evidence matches the current tree.
- `[P2][runtime-index]` Refresh OpenCode, Codex, and Gemini `README.txt` agent indexes from live directories and explicitly label built-in agents such as `@general`.
- `[P2][docs-contract]` Document whether deep-loop workflows use OpenCode agent files as the single editable source or whether each runtime directory is authoritative during execution.

## Convergence Report

The investigation did not hit the early-stop rule because `newInfoRatio` stayed above `0.05` across all 10 iterations, but the work clearly converged by the final third of the loop. Iterations 01, 04, 06, and 08 contributed the highest novelty because they exposed the main runtime-path, syntax, artifact-layout, and governance-enforcement contradictions. Iterations 07, 09, and 10 mainly refined severity and linked the contradictions back to workflow ownership and packet closeout evidence. The strongest convergence signal was that later iterations kept reinforcing the same core pattern: the live system has two competing sources of truth, one in governance prose and one in workflow/runtime assets.

## Open Questions

- Which parser form is actually canonical for mode suffixes: `command:auto` or `command :auto`?
- Is the OpenCode agent directory intentionally the source generator for runtime mirrors, or is that only an implementation shortcut in the current YAML assets?
- Should `research/research.md` and `review/review-report.md` be explicit exemptions from the `templates/level_N/` rule, or should governance enforce a stronger validation contract for those workflow-owned outputs?
- Is the remaining runtime drift small enough for a closeout patch, or should phase 002 be reopened so its completion claims remain trustworthy?

## References

- `AGENTS.md`
- `CLAUDE.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs`
- `.opencode/agent/README.txt`
- `.claude/agents/README.txt`
- `.codex/agents/README.txt`
- `.gemini/agents/README.txt`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/implementation-summary.md`
