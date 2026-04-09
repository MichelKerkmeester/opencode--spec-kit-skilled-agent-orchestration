# Research Dashboard — 003-claude-code-mastery-project-starter-kit-main

| Iteration | Question | Confidence | Priority | Adopt Target |
|-----------|----------|------------|----------|--------------|
| 001 | Does the starter kit's single-file `CLAUDE.md` rulebook provide a better Claude-facing control surface than this repo's split root `CLAUDE.md` plus `.claude/CLAUDE.md` supplement? | high | should-have | `.claude/CLAUDE.md` |
| 002 | Does the external `/mdd` workflow offer a simpler front-door experience than the current `system-spec-kit` research-plus-plan lifecycle, without replacing Spec Kit governance? | high | should-have | `.opencode/command/spec_kit/README.txt` |
| 003 | Which parts of the starter kit's `20K -> 200` context-compression story are actual workflow primitives that `system-spec-kit` could adopt? | high | nice-to-have | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 004 | How do the starter kit's `.mdd` artifacts compare to `system-spec-kit` research, handover, and auto-save artifacts, and what should be adopted or rejected? | high | should-have | `.opencode/skill/system-spec-kit/templates/` |
| 005 | Is the starter kit's deterministic enforcement-hook architecture a better default than this repo's current recovery-first hook stack? | high | should-have | `.claude/settings.local.json` |
| 006 | Are secret-blocking and env-sync hooks strong low-risk adoption candidates for this repo's Claude hook layer? | high | must-have | `.claude/settings.local.json` |
| 007 | Should the starter kit's branch-protection, port-conflict, and E2E gate hooks be transplanted into this repo's Claude workflow? | medium | rejected | `.claude/settings.local.json` |
| 008 | What lessons from the starter kit's `scope:` command metadata and dynamic help behavior should be applied to `.opencode/command/`? | high | should-have | `.opencode/command/README.txt` |
| 009 | Does the starter kit's AI monitor reveal a user-facing observability gap in `system-spec-kit`? | medium | nice-to-have | `.opencode/command/memory/manage.md` |
| 010 | Do the starter kit's tiny specialist agents and MCP packaging patterns outperform this repo's broader agent and skill-routing system? | high | rejected | `.opencode/agent/` |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no

## Finding Totals
- Must-have: 1
- Should-have: 5
- Nice-to-have: 2
- Rejected: 2
