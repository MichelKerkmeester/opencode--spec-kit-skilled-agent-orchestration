# Deep-Research Iteration 4 — 005 routing-accuracy

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/research/019-system-hardening-001-initial-research-005-routing-accuracy/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

Iteration: 4 of 15
Last Focus: corpus full population (200) + Gate 3 first 100 predictions (iter 3 complete)
newInfoRatio trend: 0.92 → 0.85 → 0.70

Focus Area (iter 4): Full-corpus Gate 3 classifier evaluation. (a) Run `classifyPrompt()` on ALL 200 labeled prompts (if not already done). (b) Compute precision/recall/F1 per reason category (file_write, read_only, memory_save, resume_write, mixed_ambiguous, deep_loop_write, skill_routing_only). (c) Build confusion matrix and error-class table. (d) Examine false positives: isolate the `analyze`, `decompose`, `phase` false-positive rates specifically (per CLAUDE.md known issue). (e) Examine false negatives: which write-intent prompts slip through?

## STATE FILES

- State Log (APPEND `"type":"iteration"`), Strategy, Registry, iterations/iteration-004.md, deltas/iter-004.jsonl
- corpus/labeled-prompts.jsonl (should be 200 now)
- corpus/gate3-predictions-iter4.jsonl (full corpus)

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Don't run skill-advisor yet (iter 5).
- REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-004.md` — narrative: Focus, Actions, Full Gate 3 Confusion Matrix, Per-Category P/R/F1, False-Positive Analysis (analyze/decompose/phase rates), False-Negative Analysis, Questions Answered (Q2 fully answered?), Next Focus (iter 5: skill-advisor evaluation).

2. Canonical JSONL: `{"type":"iteration","iteration":4,"newInfoRatio":0.45,"status":"in_progress","focus":"Gate 3 full-corpus P/R/F1","findingsCount":N,"keyQuestions":8,"answeredQuestions":2,"timestamp":"...","durationMs":NNN,"graphEvents":[]}`

3. `deltas/iter-004.jsonl` — structured delta including finding records for any surfaced P1/P2 routing accuracy issues.
