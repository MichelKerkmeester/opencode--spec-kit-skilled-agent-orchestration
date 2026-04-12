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
| 021 | 3 | Does the external orchestration surface show that system-spec-kit should stop exposing separate `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete` commands as the primary lifecycle model? | high | should-have | MERGE | `.opencode/command/spec_kit/plan.md` |
| 022 | 3 | Is the current `/memory:*` command family and YAML-asset exposure too parallel to `/spec_kit:*` compared with the external repo's flatter orchestration surface? | high | should-have | SIMPLIFY | `.opencode/command/memory/search.md` |
| 023 | 3 | Is the current Level 1/2/3+ template and validation mental model intuitive enough for operators, or should system-spec-kit redesign that user-facing abstraction? | high | must-have | REDESIGN | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 024 | 3 | Is the current 10+ agent roster the right default granularity for system-spec-kit, or should parts of it be merged to reduce operator and maintainer overhead? | high | should-have | MERGE | `.opencode/agent/orchestrate.md` |
| 025 | 3 | Does the external repo show that system-spec-kit should replace its LEAF deep-research and deep-review iteration model with more generic research and orchestrator roles? | high | rejected | KEEP | `.opencode/agent/deep-research.md` |
| 026 | 3 | Is the current skill system too fragmented for operators, especially across `system-spec-kit`, `sk-code-*`, `sk-doc`, and related workflow skills? | high | should-have | MERGE | `.opencode/skill/sk-code-opencode/SKILL.md` |
| 027 | 3 | Is Gate 2 skill routing too ceremonial for common work, and are niche skills like `sk-improve-prompt` and `sk-improve-agent` too visible by default? | high | nice-to-have | SIMPLIFY | `.opencode/skill/scripts/skill_advisor.py` |
| 028 | 3 | Does the external repo achieve usable autonomy with less gate and rule machinery, and does that mean system-spec-kit should redesign how its gate, hook, and `CLAUDE.md` system is exposed? | high | must-have | REDESIGN | `CLAUDE.md` |
| 029 | 3 | How much end-to-end workflow friction does system-spec-kit impose for a normal feature or continuation flow compared with the external repo, and what is the highest-leverage UX addition? | high | should-have | ADD | `.opencode/command/spec_kit/resume.md` |
| 030 | 3 | Should system-spec-kit broadly delete hooks, memory integration, and spec artifacts just to mimic the external repo's simpler operator surface? | high | rejected | KEEP | `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` |

## Convergence Signal
- Iterations without new signal: 0
- Early-stop rule triggered: no
- Final stop reason: max_iterations
- Semantic-search note: `mcp__cocoindex_code__search` timed out during this phase train, so direct file reads and exact `rg` searches were used for the UX/system pass.

## Finding Totals
- Phase 1 only: Must-have 2 | Should-have 4 | Nice-to-have 2 | Rejected 2
- Phase 2 only: Must-have 2 | Should-have 5 | Nice-to-have 1 | Rejected 2
- Phase 3 only: Must-have 2 | Should-have 5 | Nice-to-have 1 | Rejected 2
- Combined: Must-have 6 | Should-have 14 | Nice-to-have 4 | Rejected 6

## Phase 2 Refactor / Pivot Verdicts
- REFACTOR: 3
- PIVOT: 2
- SIMPLIFY: 2
- KEEP: 3

## Phase 3 UX Verdicts
- SIMPLIFY: 2
- ADD: 1
- MERGE: 3
- KEEP: 2
- REDESIGN: 2

## Priority Queue
1. Redesign the operator shell around named work profiles and a thin gate/hook contract.
2. Merge the public lifecycle and memory surfaces into a smaller profile-driven entry experience.
3. Shrink the default agent and skill roster into core surfaces with internal overlays.
4. Add a fast continuation path once profile boundaries and safety criteria are defined.
5. Preserve the hidden automation core and LEAF evidence loops while simplifying only the shell.
