# Research Dashboard — 006-ralph-main

| Iteration | Question | Confidence | Priority | Adopt Target |
|-----------|----------|------------|----------|--------------|
| 001 | What concrete benefits does Ralph get from spawning a fresh AI instance every iteration, and where could system-spec-kit reuse that pattern? | high | should-have | `.opencode/command/spec_kit/deep-research.md` |
| 002 | What tradeoffs does Ralph's clean-context loop create, and should system-spec-kit replace its richer continuity stack with the same model? | medium | rejected | `.opencode/skill/system-spec-kit/references/memory/memory_system.md` |
| 003 | How reliable is git history as Ralph's primary memory layer, and what selective git metadata should system-spec-kit capture instead? | medium | should-have | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` |
| 004 | How does Ralph's append-only progress.txt improve iteration continuity, and what analogous artifact could system-spec-kit add? | high | should-have | `.opencode/skill/system-spec-kit/templates/progress-log.md` |
| 005 | How does Ralph's PRD-to-JSON decomposition enforce one-context-window task sizing, and where should system-spec-kit codify equivalent rules? | high | must-have | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 006 | What does Ralph gain from keeping orchestration in Bash, and should system-spec-kit introduce a similarly minimal wrapper? | medium | nice-to-have | `.opencode/skill/system-spec-kit/scripts/spec/fresh-loop.sh` |
| 007 | Should system-spec-kit adopt Ralph's archive rotation and .last-branch tracking literally, or does the existing lineage model already cover that problem better? | high | rejected | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 008 | How do Ralph's AGENTS.md and CLAUDE.md update rules propagate reusable learnings, and how should system-spec-kit promote similar learnings into always-surface guidance? | medium | should-have | `.opencode/agent/deep-research.md` |
| 009 | How much of Ralph's one-story-per-iteration discipline comes from prompt wording versus PRD structure, and where should system-spec-kit enforce equivalent focus during implementation? | high | must-have | `.opencode/command/spec_kit/implement.md` |
| 010 | Which Ralph patterns should system-spec-kit adopt now, prototype later, or reject so the result stays complementary to richer internal orchestration rather than replacing it? | medium | nice-to-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 011 | Should system-spec-kit pivot away from its Level 1/2/3+ classification toward Ralph's PRD-to-json execution lifecycle? | medium | should-have | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 012 | Should system-spec-kit's continuity model be refactored into a lightweight execution bridge plus semantic archival memory? | high | must-have | `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` |
| 013 | Is the current agent-role architecture over-factored compared with Ralph's workflow-local contracts? | medium | should-have | `.opencode/agent/orchestrate.md` |
| 014 | Should validation simplify toward task-local executable acceptance evidence instead of increasingly heavy document-centered checklists? | high | must-have | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| 015 | Does Ralph's developer experience suggest system-spec-kit's command and gate surface is over-exposed for common operator workflows? | medium | should-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 016 | Can Ralph's gitignored run-state pattern be adopted as a lightweight, non-authoritative continuity overlay in system-spec-kit? | medium | nice-to-have | `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` |
| 017 | Should system-spec-kit simplify its deep-loop failure handling toward Ralph's sentinel-and-max-iterations model? | high | rejected | `.opencode/command/spec_kit/deep-research.md` |
| 018 | Should task sizing be defined as one strict context window, or as one independently verifiable unit sized to runtime handoff behavior? | high | should-have | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 019 | Does Ralph's interactive flowchart suggest system-spec-kit needs a more visual lifecycle explanation for operators? | medium | nice-to-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 020 | Should system-spec-kit expose an explicit lightweight workflow lane instead of making every operator path feel like the full governed stack? | medium | should-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 021 | Is system-spec-kit exposing too many operator-facing commands compared with Ralph's much smaller runtime surface? | high | should-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 022 | Does Ralph's compact lifecycle suggest that plan, implement, and complete are too ceremonial as separate front-door commands? | medium | should-have | `.opencode/command/spec_kit/plan.md` |
| 023 | Is the /memory:* command family well-integrated with the /spec_kit:* lifecycle, or is it an awkward parallel surface? | high | must-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 024 | Should system-spec-kit replace spec folders and Level 1/2/3+ templates with a much smaller Ralph-style artifact model? | medium | rejected | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` |
| 025 | Is system-spec-kit's 10+ agent roster the right granularity, or should several roles be merged or hidden? | medium | should-have | `.opencode/agent/orchestrate.md` |
| 026 | Should deep research and deep review replace their LEAF architecture with Ralph's thinner shell loop? | high | rejected | `.opencode/agent/deep-research.md` |
| 027 | Is the skill system too fragmented, and is Gate 2 plus skill_advisor.py adding too much ceremony? | medium | should-have | `.opencode/skill/scripts/skill_advisor.py` |
| 028 | Should the sk-code-* family collapse behind a single coding front door with internal overlays? | medium | nice-to-have | `.opencode/skill/sk-code-opencode/SKILL.md` |
| 029 | Should system-spec-kit redesign its operator-facing automation contract around a smaller visible gate surface? | high | must-have | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` |
| 030 | What does end-to-end feature workflow friction reveal about the right front door for system-spec-kit? | high | should-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no
- Phase 3 stop rule used: max_iterations

## Finding Totals
- Phase 1: must=2 | should=4 | nice=2 | rejected=2
- Phase 2: must=2 | should=5 | nice=2 | rejected=1
- Phase 3: must=2 | should=5 | nice=1 | rejected=2
- Combined: must=6 | should=14 | nice=5 | rejected=5

## UX Verdicts
- SIMPLIFY: 2
- ADD: 1
- MERGE: 3
- KEEP: 2
- REDESIGN: 2
