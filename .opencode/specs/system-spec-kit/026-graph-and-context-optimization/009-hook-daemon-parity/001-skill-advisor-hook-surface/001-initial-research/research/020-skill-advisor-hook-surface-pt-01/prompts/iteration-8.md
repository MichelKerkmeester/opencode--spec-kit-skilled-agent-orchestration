# Deep-Research Iteration 8 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 8 of 10.

Focus Area (iter 8): **Ranked proposal synthesis + validation plan.** Pull together iters 1-7 into:
- Ranked implementation proposals ordered by (blast radius × lift × risk)
- Go/no-go recommendations per cluster child (must-ship vs defer vs drop)
- Validation plan: how each child proves success (regression fixtures, perf budgets, snapshot tests)
- Cross-cutting risks + global mitigations
- Open questions that remain unresolved (document explicitly — these become research follow-ups)

Begin drafting research.md synthesis outline (don't write the final yet — that's iter 9 or iter 10).

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-008.md`: ranked proposals + go/no-go table + validation plan + draft synthesis outline.
2. Canonical JSONL — if newInfoRatio is trending toward < 0.05 for 3 consecutive, flag this iteration as near-converged.
3. `deltas/iter-008.jsonl`.
