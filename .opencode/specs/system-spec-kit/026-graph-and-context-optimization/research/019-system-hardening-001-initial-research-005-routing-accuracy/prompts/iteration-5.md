# Deep-Research Iteration 5 — 005 routing-accuracy

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. Autonomous run.

## STATE

Iteration: 5 of 15
Last Focus: Gate 3 full-corpus P/R/F1 (iter 4)
newInfoRatio trend: 0.92 → 0.85 → 0.70 → (iter 4 TBD)

Focus Area (iter 5): Skill-advisor full-corpus evaluation. (a) Run `skill_advisor.py` on all 200 labeled prompts. Capture top-1 recommendation + confidence + uncertainty per prompt. Write to `corpus/advisor-predictions-iter5.jsonl`. (b) Compute precision/recall/F1 per skill. (c) Compute accuracy by source_type (synthetic-realistic vs synthetic-edge vs paraphrased). (d) Identify false-positive skills that consistently over-fire. (e) Identify false-negative skills that should have fired but didn't.

## STATE FILES

- State Log (APPEND `"type":"iteration"`), Strategy, Registry, iterations/iteration-005.md, deltas/iter-005.jsonl
- corpus/advisor-predictions-iter5.jsonl (new)

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Don't run joint analysis yet (iter 6).
- REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-005.md` — narrative with Per-Skill Accuracy, Source-Type Breakdown, FP Skills, FN Skills, Questions Answered (Q3 fully answered), Next Focus (iter 6: joint Gate3 × advisor error rate).

2. Canonical JSONL: `{"type":"iteration","iteration":5,"newInfoRatio":0.3,"status":"in_progress","focus":"skill-advisor full-corpus evaluation","findingsCount":N,"keyQuestions":8,"answeredQuestions":3,"...":"..."}`

3. `deltas/iter-005.jsonl` — structured delta.
