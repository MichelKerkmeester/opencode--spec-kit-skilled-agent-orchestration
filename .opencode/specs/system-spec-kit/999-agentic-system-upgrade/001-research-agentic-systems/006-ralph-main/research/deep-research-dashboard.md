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

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no

## Finding Totals
- Must-have: 2
- Should-have: 4
- Nice-to-have: 2
- Rejected: 2
