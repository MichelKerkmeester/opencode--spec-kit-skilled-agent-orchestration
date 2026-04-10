# Research Dashboard — 003-claude-code-mastery-project-starter-kit-main

| Iteration | Theme | Confidence | Priority | Verdict | Adopt Target |
|-----------|-------|------------|----------|---------|--------------|
| 001 | Claude-facing quick-reference layer | high | should-have | KEEP | `.claude/CLAUDE.md` |
| 002 | Guided doc-first front door | high | should-have | KEEP | `.opencode/command/spec_kit/README.txt` |
| 003 | Compressed-brief pattern | high | nice-to-have | KEEP | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` |
| 004 | Lightweight working-brief template | high | should-have | KEEP | `.opencode/skill/system-spec-kit/templates/` |
| 005 | Thin enforcement layer on top of recovery hooks | high | should-have | KEEP | `.claude/settings.local.json` |
| 006 | Secret guardrails first | high | must-have | KEEP | `.claude/settings.local.json` |
| 007 | Branch/port/E2E hook transplant | medium | rejected | KEEP | `none` |
| 008 | Command audience and distribution metadata | high | should-have | KEEP | `.opencode/command/README.txt` |
| 009 | Operator-facing observability | medium | nice-to-have | KEEP | `.opencode/command/memory/manage.md` |
| 010 | Import external mini-agent architecture | high | rejected | KEEP | `none` |
| 011 | Instruction layering and personal overrides | high | should-have | SIMPLIFY | `CLAUDE.md`, `.claude/CLAUDE.md` |
| 012 | Working-brief stage before full packet depth | high | should-have | SIMPLIFY | `.opencode/skill/system-spec-kit/templates/` |
| 013 | Split session digests from promoted memories | high | must-have | REFACTOR | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` |
| 014 | Move deterministic gates into executable policy | high | should-have | REFACTOR | `CLAUDE.md`, `.claude/settings.local.json` |
| 015 | Reduce deep-research primary state surfaces | high | should-have | SIMPLIFY | `.opencode/agent/deep-research.md` |
| 016 | Validation core versus generated readiness views | high | must-have | SIMPLIFY | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| 017 | Manifest-driven command architecture | high | should-have | PIVOT | `.opencode/command/README.txt` |
| 018 | Rebuild runtime around starter-kit app architecture | high | rejected | KEEP | `none` |
| 019 | Human-readable readiness and progress UX | medium | nice-to-have | KEEP | `command/reporting surfaces` |
| 020 | Replace governance levels with starter-kit profiles | high | rejected | KEEP | `none` |

## Convergence Signal
- Iterations executed: 20 of 20
- Iterations without new signal: 0
- Stop rule triggered: no
- Stop reason: max_iterations

## Phase 2 Totals
- Must-have: 2
- Should-have: 5
- Nice-to-have: 1
- Rejected: 2

## Combined Totals
- Must-have: 3
- Should-have: 10
- Nice-to-have: 3
- Rejected: 4

## Refactor / Pivot Verdicts
- REFACTOR: 2
- PIVOT: 1
- SIMPLIFY: 4
- KEEP: 13
