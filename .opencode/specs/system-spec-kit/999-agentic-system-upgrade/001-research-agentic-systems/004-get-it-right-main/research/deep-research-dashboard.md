# Research Dashboard — 004-get-it-right-main

| Iteration | Question | Confidence | Priority | Adopt Target |
|-----------|----------|------------|----------|--------------|
| 001 | Does Get It Right's explicit implement-check-review-refactor loop fill a control-plane gap that system-spec-kit's current implementation workflow does not yet cover? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 002 | Why does Get It Right pass only reviewer feedback between attempts, and should system-spec-kit copy that compressed feedback bridge instead of carrying full attempt history? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 003 | Are Get It Right's memo:false fresh forks a portable pattern that system-spec-kit should reuse for any future implementation retry loop? | high | must-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 004 | What are the practical benefits and costs of Get It Right's rule that review is skipped whenever lint, test, or build fails, and should system-spec-kit adopt the same gate? | high | must-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 005 | How different is Get It Right's reviewer from system-spec-kit's current review agent, and should system-spec-kit add the external pass-continue-refactor strategy contract? | high | should-have | `.opencode/agent/review.md` |
| 006 | What problem does Get It Right's undo-only refactorer solve, and should system-spec-kit adopt that path or reject it for normal use? | medium | rejected | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 007 | How much of Get It Right is truly Reliant-specific, and which parts are portable enough for system-spec-kit to adopt without inheriting platform lock-in? | high | must-have | `.opencode/command/spec_kit/implement.md` |
| 008 | Should Get It Right-style retry feedback be persisted into system-spec-kit's durable memory system, or should it remain packet-local and disposable? | high | should-have | `.opencode/skill/system-spec-kit/SKILL.md` |
| 009 | Which parallel verification patterns from Get It Right are worth copying directly into system-spec-kit? | high | must-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 010 | When should a Get It Right-style retry loop be used inside system-spec-kit, and how should that stay separate from phase 001's optimization research? | high | must-have | `.opencode/command/spec_kit/implement.md` |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no

## Finding Totals
- Must-have: 5
- Should-have: 4
- Nice-to-have: 0
- Rejected: 1
