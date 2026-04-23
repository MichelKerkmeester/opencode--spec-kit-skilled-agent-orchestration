# Deep-Research Iteration 5 — Cheapest-Next-Action Synthesis (Q5)

You are a LEAF research agent. Fresh-context iteration; all state is on disk.

## STATE

```
Iteration: 5 of 10
Segment: 1
Questions: 4/5 answered
 - Q1 = 67 gaps firmed (P0=5, P1=27, P2=35) per iter-3
 - Q2 = OSCILLATING (not genuine plateau) per iter-2
 - Q3 = 6 blind spots per iter-3
 - Q4 = FINAL: 6 KEEP, 4 DOWNGRADE, 1 REPLACE, 1 WITHDRAW (Combo 1) per iter-4
Last focus: Recommendation survival audit (iter-4, findings, newInfoRatio ~0.?, status insight)
Last 3 ratios: 0.47, 0.39, ???
Stuck count: 0
Next focus: Q5 cheapest-next-action synthesis
```

Research Topic: 026 research-and-baseline — outstanding gaps, convergence quality, and what was left unexplored across 19 prior iterations.

## MISSION (Iteration 5)

Answer Q5: **What concrete follow-up research OR implementation work would most cheaply reduce the remaining uncertainty — i.e. which single next action delivers the highest marginal convergence per unit effort?**

Produce a RANKED top-5 candidate list spanning three lanes. Each lane enters candidates:

### Lane 1 — P0 gap remediations (from iter-3)

Take the 5 P0 gaps from iter-3 and score each as (impact_on_convergence / effort_hours).

### Lane 2 — Tag-taxonomy cleanup (Q2a)

Iter-2 identified 16/31 `new-cross-phase` tags needing retagging. Cleaning this passes v2 validation and fixes the ONLY hard-failure from iter-18.

### Lane 3 — Recommendation-rescue investments

From iter-4: Combo 1 WITHDRAWN (newly). From iter-4 + iter-16: R2, R3, R7, R8 DOWNGRADED. Which DOWNGRADED recs have cheapest paths to re-promotion?

### Lane 4 — Blind-spot deep-dives

From iter-3 Part B, which blind spot is cheapest to CLOSE (i.e., produce evidence on)? Top-materiality blind spot was rollback/corruption recovery behavior. Others in iter-3.

### Scoring Formula

For each candidate, compute:

- **IMPACT** (1-10 scale): how much does this reduce residual uncertainty? Base it on:
  - Does it flip ANY surviving rec from KEEP ↔ DOWNGRADE ↔ WITHDRAW? (major)
  - Does it close a P0 gap? (major)
  - Does it remove a tag-taxonomy validation failure? (moderate)
  - Does it close a blind spot that currently weakens ≥2 recs? (moderate)
  - Does it firm a probability estimate from "likely" to "measured"? (minor)
- **EFFORT** (hours estimate): realistic single-operator time budget. Include reading, writing, re-running audits.
- **SCORE** = IMPACT / EFFORT

Produce at least 10 candidates across the 4 lanes, then rank and pick the top 5.

## REQUIRED READING

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md` — gap inventory source.
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-2.md` — convergence quality (tag taxonomy remediation).
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-3.md` — P0/P1/P2 severity firming + blind spots.
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-4.md` — survival audit + withdrawn Combo 1.

## OUTPUT CONTRACT

Three artifacts.

### Artifact 1 — Iteration narrative

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-5.md`

```md
# Iteration 5 — Cheapest-Next-Action Synthesis (Q5)

## Focus
[1-2 sentences]

## Actions Taken
[Bulleted list]

## Findings

### Candidate Pool (all lanes)

| Cand-ID | Lane | Label | Source | IMPACT (1-10) | EFFORT (hours) | SCORE | Rationale |
|---------|------|-------|--------|---------------|----------------|-------|-----------|
| C-01 | P0-Gap | ... | GAP-ID | ... | ... | ... | ... |
| ... (at least 10 rows across all lanes) ... |

### Top-5 Ranked

| Rank | Cand-ID | Label | Score | Why it wins |
|------|---------|-------|-------|-------------|
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... |
| 4 | ... | ... | ... | ... |
| 5 | ... | ... | ... | ... |

### The Single Best Next Action

[1 paragraph: name Rank-1 candidate. State exactly what to do, target artifact, expected convergence gain, expected effort.]

### Diminishing-returns inflection

[1 short paragraph: after top-5, what's the SCORE drop-off look like? Is there a natural stopping point where additional investments return less than a day of convergence gain?]

## Questions Answered
- [x] Q1, Q2, Q3, Q4 unchanged.
- [x] Q5 — top-5 ranked candidate list with single-best-next-action produced.

## Questions Remaining
- None remaining. All 5 key questions are answered.

## Next Focus
SYNTHESIS — compile research/001-research-and-baseline-pt-01/research.md consolidating all iter-1..5 findings, plus convergence report. No more iterations needed unless new evidence emerges during synthesis.
```

### Artifact 2 — State-log append

One line appended:

```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"Cheapest-next-action synthesis (Q5)","findingsCount":<int>,"timestamp":"<ISO 8601 UTC>","sessionId":"dr-026-001-gaps-20260423T200629Z","generation":1,"executor":{"kind":"cli-copilot","model":"gpt-5.4","reasoningEffort":"high","serviceTier":null},"graphEvents":[]}
```

### Artifact 3 — Delta file

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deltas/iter-005.jsonl`

```json
{"type":"iteration","iteration":5,"newInfoRatio":<same>,"status":"<same>","focus":"Cheapest-next-action synthesis","findingsCount":<same>}
{"type":"finding","id":"f-iter005-001","severity":"P0|P1|P2","label":"<candidate label> (IMPACT=x, EFFORT=y, SCORE=z)","iteration":5,"source":"lane-1|lane-2|lane-3|lane-4"}
... (one record per candidate, ≥10)
{"type":"observation","id":"obs-iter005-001","label":"Top-5 score range: <min> to <max>; diminishing-returns inflection at rank <N>","iteration":5}
{"type":"observation","id":"obs-iter005-002","label":"Single best next action: <C-ID> — <label>","iteration":5}
```

## CONSTRAINTS

- LEAF agent — do NOT dispatch sub-agents.
- Max 12 tool calls total. Target 6 (this is synthesis from prior iters; minimal new I/O needed).
- Do NOT modify any file under `001-research-and-baseline/research/` (legacy local dir is READ-ONLY).
- Every IMPACT score must cite specific artifact impact (e.g., "flips R7 from DOWNGRADE to KEEP"); no generic scoring.
- Every EFFORT estimate must be justified by scope (file count, line count, audit runtime).
- All three artifacts must land on disk.
