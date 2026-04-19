# Deep-Research Iteration 6 — 005 routing-accuracy

**Gate 3 pre-answered**: Option **E** (phase folder). Autonomous run, no gates.

## STATE

Iteration: 6 of 15. Last focus: skill-advisor evaluation. 

Focus Area (iter 6): Joint Gate3 × skill-advisor error analysis + rule-change proposal synthesis.
(a) Compute joint error rate: for each prompt, label `(gate3_correct, advisor_correct)` → tabulate (TT, TF, FT, FF). 
(b) Identify prompts where Gate 3 right but advisor wrong (skill mismatch despite correct gate) vs Gate 3 wrong but advisor right (gate miss but downstream ok). 
(c) Start drafting rule-change proposals: threshold adjustments, positive-trigger additions/removals, negative-trigger additions. 
(d) For each proposal, estimate before/after delta on the labeled corpus (dry-run simulation).

## STATE FILES

Append canonical `"type":"iteration"` to state log. Write iteration-006.md + deltas/iter-006.jsonl.

## CONSTRAINTS

Soft 9 / hard 13 tool calls. 

## OUTPUT CONTRACT

1. iteration-006.md with joint error matrix, TF/FT sub-populations, rule-change proposals (draft), simulated before/after per proposal.

2. Canonical JSONL record.

3. deltas/iter-006.jsonl with structured delta + finding records for any confirmed routing defects.
