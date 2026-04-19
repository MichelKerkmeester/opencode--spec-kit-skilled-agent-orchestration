# Deep-Research Iteration Prompt Pack — 005 routing-accuracy iter 3

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/research/019-system-hardening-001-initial-research-005-routing-accuracy/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 3 of 15
Last Focus: corpus design + 60 seeded labeled prompts (iter 2 complete)
newInfoRatio trend: 0.92 → 0.85

Focus Area (iter 3): Populate corpus to full 200 prompts (add remaining ~140 across 6 buckets to reach per-bucket targets). Then run Gate 3 classifier (`.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` / `classifyPrompt()`) on first 100 prompts and record predictions in `corpus/gate3-predictions-iter3.jsonl`. Compute initial confusion matrix (TP/FP/FN/TN by `gate3_triggers` label). Don't yet run skill-advisor.

Remaining Key Questions: 8 total. Progress on Q1 (corpus complete), initial progress on Q2 (Gate 3 first 100 predictions).

## STATE FILES

- Config, State Log (APPEND `"type":"iteration"`), Strategy, Registry, iterations/iteration-003.md, deltas/iter-003.jsonl
- NEW: `corpus/labeled-prompts.jsonl` (extend from 60 to 200)
- NEW: `corpus/gate3-predictions-iter3.jsonl` (first 100 prompts)

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Don't run skill-advisor this iter — Gate 3 only.
- REQUIRED canonical JSONL iteration record + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-003.md` — narrative: Focus, Actions, Corpus Total (200 target), Gate 3 First-100 Confusion Matrix, Initial Error Classes, Questions Answered, Next Focus (iter 4: full-corpus Gate 3 P/R/F1 per class).

2. Canonical JSONL record APPENDED to state log: `{"type":"iteration","iteration":3,"newInfoRatio":0.70,"status":"in_progress","focus":"corpus full population + Gate 3 first 100","findingsCount":N,"keyQuestions":8,"answeredQuestions":1,"timestamp":"...","durationMs":NNN,"graphEvents":[]}`

3. `deltas/iter-003.jsonl` — structured delta (iteration record + observations + any finding records if Gate 3 fires false positives/negatives).

All three required.
