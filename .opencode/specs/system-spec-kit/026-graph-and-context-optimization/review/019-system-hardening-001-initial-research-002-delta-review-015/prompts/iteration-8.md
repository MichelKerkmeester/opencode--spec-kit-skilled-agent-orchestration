# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 8 of 10
Last 3 ratios: 0.52 -> 0.41 -> 0.33 | Stuck count: 0 | Rolling avg last 3: 0.42
Cumulative tally: ADDRESSED=41, STILL_OPEN=19, SUPERSEDED=141, UNVERIFIED=0 (201 of 242 classified). Remaining: 41. Budget: 2 iterations left. Target: finish classification in this iter, reserve iter 9 for synthesis draft + iter 10 polish.

Iteration: 8 of 10
Focus Area: **Close the remaining 41 classifications** and prepare for synthesis.

**Priority 1 — Classify remaining 41 findings**:
Most are P2 tail items. Quickly batch by theme, classify with evidence. Focus on the last unknown cluster surfaces:
- Any P2 findings in graph-metadata-parser edge cases
- Remaining reducer / dashboard drift findings
- Any deferred schema leniency findings
- Test-coverage gaps that 015 identified but phase 016 test migration may not have addressed
- Minor doc drift that may have been addressed by phase 017-018 doc commits

**Priority 2 — Finalize STILL_OPEN backlog**:
The 19 STILL_OPEN findings should be organized into:
- severity clusters (P1 STILL_OPEN vs P2 STILL_OPEN)
- proposed remediation cluster names for 015 Workstream 0+ scope
- estimated effort per cluster (small/medium/large)
- dependencies (which STILL_OPEN blocks which)

**Priority 3 — Pre-stage synthesis**:
After this iter, iter 9 writes `review-report.md` + `015/review/delta-report-2026-04.md`. Pre-stage by ensuring all STILL_OPEN have enough evidence captured.

Remaining Key Questions:
- Q1 (finish this iter): 41 remaining classifications
- Q3/Q4 (mostly done): final cleanup
- Q5 (staging): STILL_OPEN backlog organized for 015 W0 restart

Last 3 Iterations Summary: iter 5 24 + UNVERIFIED cleared (0.52), iter 6 38 + STILL_OPEN 14 (0.41), iter 7 43 + STILL_OPEN 19 (0.33)

## STATE FILES

Same as prior iterations. Write to `.../iterations/iteration-008.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- This iter SHOULD close remaining 41. Final tally should sum to 242.
- Every STILL_OPEN must have current file:line + severity + cluster + effort.

## OUTPUT CONTRACT

1. `.../iterations/iteration-008.md` with Focus, Actions, Final Batch, Completed Cumulative Tally (must sum to 242), STILL_OPEN Organized by Cluster+Effort, Synthesis Readiness, Next Focus.
2. JSONL delta APPENDED to state log (use `echo '...' >> ...jsonl`):
```json
{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
