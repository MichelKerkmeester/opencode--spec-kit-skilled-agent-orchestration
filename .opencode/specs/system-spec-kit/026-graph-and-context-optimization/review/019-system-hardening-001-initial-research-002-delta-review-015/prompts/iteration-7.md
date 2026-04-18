# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 7 of 10
Last 3 ratios: 0.59 -> 0.52 -> 0.41 | Stuck count: 0 | Rolling avg last 3: 0.507
Cumulative tally: ADDRESSED=35, STILL_OPEN=14, SUPERSEDED=109, UNVERIFIED=0 (158 of 242 classified). Remaining: 84. Budget: 3 iterations left. Pace: ~28-38/iter. Full coverage achievable in ~3 iters.

Iteration: 7 of 10
Focus Area: Final push to full classification. 84 findings remaining (mostly P2). Goal: complete the classification matrix in this iteration OR next.

**Priority 1 — Remaining P2 clusters**:
- Test-fixture drift (P2): SUPERSEDED likely by 34-test migration in phase 016
- Documentation / comment drift (P2): may be STILL_OPEN but P2
- Error-message normalization (P2): check phase 017 error-enum additions
- Schema validation leniency (P2): check phase 016 Zod schema hardening
- Reducer output stability (P2): check phase 017 reducer refactors
- Any remaining standalone P1/P2 findings not yet in a named cluster

**Priority 2 — Consolidate STILL_OPEN (currently 14)**:
- Each STILL_OPEN must have: severity, file:line evidence, proposed 015 Workstream 0+ cluster.
- Dedup any overlapping STILL_OPEN findings that share root cause.
- Classify each STILL_OPEN by proposed remediation effort: small (<1 day), medium (1-3 days), large (>3 days).

**Priority 3 — Prep for synthesis**:
After this iter, 1-2 iters left. If classification reaches 100%, next iter is synthesis (`review-report.md` / `delta-report-2026-04.md` writeup). Pre-stage by drafting the narrowed STILL_OPEN backlog structure that will feed the 015 Workstream 0+ restart.

Remaining Key Questions:
- Q1 (nearly complete): 84 more to classify
- Q3 (complete for P1)
- Q4 (P2 continues)
- Q5 (forming): narrowed STILL_OPEN backlog structure

Last 3 Iterations Summary: iter 4 31 batches (0.59), iter 5 24 + UNVERIFIED cleared (0.52), iter 6 38 + STILL_OPEN grown (0.41)

## STATE FILES

Same as prior iterations. Write to `.../iterations/iteration-007.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Target: 40+ findings this iteration to close most of the remaining 84.
- Each new STILL_OPEN MUST have current file:line reproduction evidence + proposed cluster.

## OUTPUT CONTRACT

1. `.../iterations/iteration-007.md` with Focus, Actions, Findings Batch-Audited, Cumulative Tally, STILL_OPEN Consolidated (with severity + cluster + effort), Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
