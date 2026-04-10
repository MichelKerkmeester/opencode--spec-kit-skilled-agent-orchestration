# Research Dashboard — 004-get-it-right-main

| Iteration | Phase | Question | Confidence | Priority | Verdict | Adopt Target |
|-----------|-------|----------|------------|----------|---------|--------------|
| 001 | 1 | Does Get It Right's explicit implement-check-review-refactor loop fill a control-plane gap that system-spec-kit's current implementation workflow does not yet cover? | high | should-have | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 002 | 1 | Why does Get It Right pass only reviewer feedback between attempts, and should system-spec-kit copy that compressed feedback bridge instead of carrying full attempt history? | high | should-have | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 003 | 1 | Are Get It Right's memo:false fresh forks a portable pattern that system-spec-kit should reuse for any future implementation retry loop? | high | must-have | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 004 | 1 | What are the practical benefits and costs of Get It Right's rule that review is skipped whenever lint, test, or build fails, and should system-spec-kit adopt the same gate? | high | must-have | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 005 | 1 | How different is Get It Right's reviewer from system-spec-kit's current review agent, and should system-spec-kit add the external pass-continue-refactor strategy contract? | high | should-have | - | `.opencode/agent/review.md` |
| 006 | 1 | What problem does Get It Right's undo-only refactorer solve, and should system-spec-kit adopt that path or reject it for normal use? | medium | rejected | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 007 | 1 | How much of Get It Right is truly Reliant-specific, and which parts are portable enough for system-spec-kit to adopt without inheriting platform lock-in? | high | must-have | - | `.opencode/command/spec_kit/implement.md` |
| 008 | 1 | Should Get It Right-style retry feedback be persisted into system-spec-kit's durable memory system, or should it remain packet-local and disposable? | high | should-have | - | `.opencode/skill/system-spec-kit/SKILL.md` |
| 009 | 1 | Which parallel verification patterns from Get It Right are worth copying directly into system-spec-kit? | high | must-have | - | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` |
| 010 | 1 | When should a Get It Right-style retry loop be used inside system-spec-kit, and how should that stay separate from phase 001's optimization research? | high | must-have | - | `.opencode/command/spec_kit/implement.md` |
| 011 | 2 | Should a Get It Right-style retry loop be embedded inside /spec_kit:implement or exposed as a separate controller? | high | must-have | REFACTOR | `.opencode/command/spec_kit/retry.md` |
| 012 | 2 | Should retry-mode reuse Level 1/2/3 packet classification, or use a fixed artifact set? | high | should-have | SIMPLIFY | `retry packet conventions + create/validate routing` |
| 013 | 2 | Does Get It Right's operator surface suggest retry-mode UX should use a few explicit knobs instead of the full setup questionnaire? | high | should-have | SIMPLIFY | `retry command surface` |
| 014 | 2 | Does the external loop imply that durable memory is the wrong substrate for loop-critical state? | high | must-have | PIVOT | `memory save architecture` |
| 015 | 2 | Does the external three-role loop imply that execution workflows need a smaller reusable runtime role set? | medium | should-have | REFACTOR | `agent architecture + orchestrator routing` |
| 016 | 2 | Does system-spec-kit's deep-loop infrastructure make too many observability surfaces mandatory? | high | should-have | SIMPLIFY | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 017 | 2 | Should system-spec-kit collapse its broader specialist roster into the external three-role model? | medium | rejected | KEEP | `overall agent architecture` |
| 018 | 2 | Is system-spec-kit's validation philosophy too document-centric for implementation retries? | high | must-have | REFACTOR | `retry workflow + completion contracts` |
| 019 | 2 | Does the external repo's minimal documentation posture justify replacing the durable spec-folder lifecycle? | high | rejected | KEEP | `spec lifecycle architecture` |
| 020 | 2 | Should retry, deep-research, and deep-review share a generic loop kernel instead of each re-implementing orchestration? | high | should-have | REFACTOR | `loop orchestration architecture` |

## Convergence Signal
- Iterations without new signal: 0
- Stop reason: max_iterations
- Stop rule triggered: yes

## Finding Totals
- Must-have: 8
- Should-have: 9
- Nice-to-have: 0
- Rejected: 3

## Refactor / Pivot Verdict Totals
- REFACTOR: 4
- PIVOT: 1
- SIMPLIFY: 3
- KEEP: 2
