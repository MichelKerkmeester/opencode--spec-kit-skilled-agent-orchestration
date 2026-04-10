# Research Dashboard — 005-intellegix-code-agent-toolkit-master

| Iteration | Phase | Question | Confidence | Priority | Verdict | Adopt Target |
|-----------|-------|----------|------------|----------|---------|--------------|
| 001 | 1 | Does the external loop's explicit completion-gate and exit-code contract give system-spec-kit a clearer autonomous stop model? | high | must-have | - | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 002 | 1 | Does the external repo's session-resume path preserve loop continuity better than system-spec-kit's current lineage-only state? | high | should-have | - | `.opencode/skill/sk-deep-research/references/state_format.md` |
| 003 | 1 | Would the external repo's budget, cooldown, and fallback configuration improve system-spec-kit's long-running deep-research reliability? | high | should-have | - | `.opencode/skill/sk-deep-research/assets/deep_research_config.json` |
| 004 | 1 | Should system-spec-kit adopt the external repo's context-exhaustion and session-rotation heuristics in addition to convergence-by-novelty? | high | should-have | - | `.opencode/skill/sk-deep-research/references/convergence.md` |
| 005 | 1 | Are the external repo's multi-agent manifests and Dropbox-safe file locks appropriate for system-spec-kit's deep-research loop? | high | rejected | - | `.opencode/skill/sk-deep-research/references/loop_protocol.md` |
| 006 | 1 | Would the external repo's orchestrator guard and sentinel-enforced role boundaries strengthen system-spec-kit's orchestration safety? | high | should-have | - | `.opencode/agent/orchestrate.md` |
| 007 | 1 | Is the external repo's council-style multi-model synthesis worth formalizing as an optional system-spec-kit research mode? | medium | nice-to-have | - | `.opencode/command/spec_kit/deep-research.md` |
| 008 | 1 | Should system-spec-kit treat browser-backed exploration as a first-class deep-research runtime capability? | medium | rejected | - | `.opencode/skill/sk-deep-research/references/capability_matrix.md` |
| 009 | 1 | Can the external repo's portfolio-tier anti-overbuilding rules be adapted into system-spec-kit guidance without distorting the spec-folder model? | medium | nice-to-have | - | `.opencode/skill/system-spec-kit/templates/decision-record.md` |
| 010 | 1 | Do the external repo's tests encode loop-runtime guarantees that system-spec-kit's deep-research contract tests should mirror? | high | must-have | - | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` |
| 011 | 2 | Should system-spec-kit formalize a lighter research-packet profile instead of routing research-only work through the full general level ladder? | high | should-have | SIMPLIFY | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 012 | 2 | Should system-spec-kit separate operational deep-loop state from archival memory and stop treating memory export as part of the loop's core completion contract? | high | should-have | REFACTOR | `.opencode/command/spec_kit/deep-research.md` |
| 013 | 2 | Does system-spec-kit need a dedicated typed deep-loop engine instead of a runtime contract spread across command docs, YAML, and reference files? | high | must-have | REFACTOR | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 014 | 2 | Is the current Gate 1/2/3 choreography overbuilt for packet-bound continuation work, and should system-spec-kit move toward gate profiles? | high | should-have | PIVOT | `AGENTS.md` |
| 015 | 2 | Does the external separation of orchestrator prompt, command workflow, and guard hook indicate that system-spec-kit's orchestrator profile is too monolithic? | high | should-have | REFACTOR | `.opencode/agent/orchestrate.md` |
| 016 | 2 | Does the external repo's behavior-first CI posture show that system-spec-kit's validation pipeline is aimed at the wrong source of truth for automation-heavy workflows? | high | must-have | PIVOT | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| 017 | 2 | Does the external repo's operator-first command UX suggest that system-spec-kit exposes too much internal layering to users? | medium | nice-to-have | SIMPLIFY | `.opencode/command/spec_kit/deep-research.md` |
| 018 | 2 | Should system-spec-kit add a machine-readable runtime summary for deep loops, complementing the markdown dashboard with a compact operational snapshot? | high | should-have | KEEP | `.opencode/skill/sk-deep-research/references/state_format.md` |
| 019 | 2 | Does the external repo's simpler `.workflow` state plus handoff model prove that system-spec-kit should replace its broader semantic memory platform? | high | rejected | KEEP | `.opencode/skill/system-spec-kit/references/memory/memory_system.md` |
| 020 | 2 | Should system-spec-kit replace its fresh-context deep-research/deep-review loops with an external-style single-loop manager? | high | rejected | KEEP | `.opencode/command/spec_kit/deep-research.md` |

## Convergence Signal
- Iterations without new signal: 0
- Early-stop rule triggered: no
- Final stop reason: max_iterations
- Phase 2 semantic-search note: `mcp__cocoindex_code__search` timed out during this run, so direct file reads and exact `rg` searches were used for the external repo pass.

## Finding Totals
- Phase 1 only: Must-have 2 | Should-have 4 | Nice-to-have 2 | Rejected 2
- Phase 2 only: Must-have 2 | Should-have 5 | Nice-to-have 1 | Rejected 2
- Combined: Must-have 4 | Should-have 9 | Nice-to-have 3 | Rejected 4

## Refactor / Pivot Verdicts
- REFACTOR: 3
- PIVOT: 2
- SIMPLIFY: 2
- KEEP: 3

## Priority Queue
1. Build a typed deep-loop controller and pair it immediately with behavior-first contract tests.
2. Formalize the lighter research-packet profile and make packet-local research artifacts the canonical completion boundary.
3. Introduce gate profiles and extract orchestration policy out of the monolithic orchestrator prompt.
4. Add a machine-readable runtime summary after the controller contract is stable.
5. Leave operator-surface flattening until command-system ownership in phase `003` is ready to absorb it.
