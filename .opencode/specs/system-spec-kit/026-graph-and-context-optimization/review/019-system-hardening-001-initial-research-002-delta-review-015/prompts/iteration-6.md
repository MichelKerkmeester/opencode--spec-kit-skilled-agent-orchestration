# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 6 of 10
Last 3 ratios: 0.70 -> 0.64 -> 0.59 -> 0.52 | Stuck count: 0 | Rolling avg last 3: 0.583
Cumulative tally: ADDRESSED=29, STILL_OPEN=8, SUPERSEDED=81, UNVERIFIED=2 (120 of 242 classified). Remaining: 122. Budget: 4 iterations left. Target 30+ findings/iter to complete.

Iteration: 6 of 10
Focus Area: Remaining 122 findings are mostly P2 across several themes. Continue clustering:

**Priority 1 — Clear remaining UNVERIFIED (2 left)**: quick win.

**Priority 2 — Remaining P2 batches**:
- Skill-graph compiler findings (2-node-only cycle check, warning amnesia). Check phase 014/017 addressing.
- Session-bootstrap/resume findings. Check phase 017 session-resume auth binding (T-SRS-BND-01) + caller-context.
- Coverage-graph runtime drift findings. Check phase 016 6-sibling readiness (Cluster D).
- Memory-save payload schema findings (not yet covered). Check phase 016 HookStateSchema + predecessor CAS.
- Test fixture drift findings. Most SUPERSEDED by phase 016 34-test migration.
- YAML predicate grammar findings. Check phase 016 S7 grammar contract.
- Documentation / README drift. Check phase 017-018 doc commits.

Target: audit 35-45 findings this iteration. Narrow residual STILL_OPEN backlog to ~10-15 final items with evidence.

**Priority 3 — STILL_OPEN residual consolidation**:
The 8 current STILL_OPEN findings need:
- severity cluster
- proposed 015 Workstream 0+ remediation scope
- cross-ref to any related 016/017/018 primitives that partially addressed them
Add any new STILL_OPEN from this iter's batch.

Remaining Key Questions:
- Q1 (active): tally (122 more)
- Q3 (near complete)
- Q4 (active): P2 remainder
- Q5 (starting): residual backlog forming

Last 3 Iterations Summary: iter 3 34 batches (0.64), iter 4 31 batches (0.59), iter 5 24 + UNVERIFIED resolved (0.52)

## STATE FILES

Same as prior iterations. Write to `.../iterations/iteration-006.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- STILL_OPEN discipline: no "probably open" — each one needs current file:line.
- At this pace, 3 more iters × 30-40 classifications = full coverage. Budget 4 iters left is tight but achievable.

## OUTPUT CONTRACT

1. `.../iterations/iteration-006.md` with Focus, Actions, Findings Batch-Audited, Cumulative Tally, STILL_OPEN Expanded With Evidence, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
