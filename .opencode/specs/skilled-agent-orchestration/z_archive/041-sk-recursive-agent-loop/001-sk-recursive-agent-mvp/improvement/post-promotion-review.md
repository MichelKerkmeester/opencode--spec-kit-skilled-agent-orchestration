# Post-Promotion Review

## First Promoted Run

- Accepted candidate: `candidate-003.md`
- Baseline score: 95
- Accepted score: 100
- Delta: 5
- Promoted target: `.opencode/agent/handover.md`

## T072 Re-evaluation

`.opencode/agent/handover.md` remains the right first target.

Why:
- it produced a measurable score improvement
- it was narrow enough for safe promotion
- rollback was easy to test

## T081 Second Target Evaluation

Recommended second target:
- `.opencode/agent/context-prime.md`

Reason:
- still structured
- lower ambiguity than orchestration-heavy agents
- better suited for the next evaluator after handover

## T082 No-Go Conditions

Do not expand beyond the current boundary if:
- infra failures rise above candidate-quality failures
- mirror drift is undocumented
- promotions happen without explicit approval
- the scorer stops cleanly separating weak and strong candidates
