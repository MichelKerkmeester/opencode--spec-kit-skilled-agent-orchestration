# Deep-Research Iteration 7 — 005 routing-accuracy

**Gate 3 pre-answered**: Option **E** (phase folder). Autonomous run, no gates.

## STATE

Iteration: 7 of 15.

Focus Area (iter 7): Finalize ranked proposals + synthesis pre-work.
(a) Rank rule-change proposals by (accuracy-gain × simplicity × reversibility).
(b) Cost/latency analysis per proposal (trigger-list size impact, advisor scoring overhead).
(c) Identify any remaining open questions. 
(d) Begin drafting the executive summary for research.md (don't write research.md yet — that's iter 8+ if converged).

## STATE FILES

Standard state-log append + iteration-007.md + deltas/iter-007.jsonl.

## CONSTRAINTS

Soft 9 / hard 13.

## OUTPUT CONTRACT

1. iteration-007.md: ranked proposal list, cost/latency table, open questions, draft exec summary.
2. Canonical JSONL record.
3. deltas/iter-007.jsonl.

If newInfoRatio < 0.05 for the last 3 iters after this one, also write the final `research.md` with complete synthesis (executive summary + corpus design + per-surface accuracy results + error-class analysis + ranked proposals + implementation handoff recommendation) and set status:"converged" in the iteration record.
