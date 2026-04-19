# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 5 of 10
Last 2 ratios: 0.64 -> 0.59 | Stuck count: 0
Cumulative tally: ADDRESSED=24, STILL_OPEN=6, SUPERSEDED=53, UNVERIFIED=13 (96 of 242 classified). Remaining: 146. Budget: 5 iterations left. Target ~30 findings/iter.

Iteration: 5 of 10
Focus Area: P2 batch continues. 146 remaining findings (mostly P2 at this point, ~80+ P2 remaining + 13 UNVERIFIED from prior + any P1 still left).

**Priority 1 — Resolve UNVERIFIED (13 items)**:
Re-audit every UNVERIFIED from iter 1-4 with cluster context. These are findings where earlier evidence was insufficient. Now with P0 verdict + 10+ ADDRESSED commits identified + 53 SUPERSEDED primitives cataloged, most UNVERIFIED should now classify.

**Priority 2 — P2 batch continuation**:
Continue P2 clustering. Group by theme:
- Test coverage findings (P2): likely SUPERSEDED by phase 016/017 test migrations (34 test migrations in P0 remediation)
- Documentation drift (P2): check if docs were updated in 016-018 ship
- Code smell / readability (P2): mostly unaddressed but low severity; likely STILL_OPEN but P2 so not release-blocking
- Logging / observability (P2): check phase 017 telemetry additions
- Legacy parser complaints (P2): addressed by phase 014 memory-save rewrite + phase 016 graph-metadata migrated marker

Target: audit 30-40 findings, reducing UNVERIFIED to near-zero.

**Priority 3 — Grow STILL_OPEN list with evidence**:
The 6 STILL_OPEN findings are the actionable residual. Each MUST have:
- current file:line reproduction evidence
- severity (P1/P2)
- proposed remediation cluster (for 015 Workstream 0+ scope)
Add any new STILL_OPEN findings surfaced this iteration.

Remaining Key Questions:
- Q1: tally (146 more needed)
- Q3: P1 should be fully classified this iter
- Q4: P2 continues
- Q5: residual backlog forming (currently 6 STILL_OPEN)

Last 3 Iterations Summary: iter 2 20 cluster batches (0.70), iter 3 34 (0.64), iter 4 31 (0.59)

## STATE FILES

Same as prior iterations. Write to `.../iterations/iteration-005.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Each UNVERIFIED re-audit MUST resolve to ADDRESSED/STILL_OPEN/SUPERSEDED OR stay UNVERIFIED with stronger "evidence gone" rationale.
- STILL_OPEN findings MUST include file:line reproduction — no "probably open" without evidence.

## OUTPUT CONTRACT

1. `.../iterations/iteration-005.md` with Focus, Actions, UNVERIFIED Resolved, Findings Batch-Audited, Cumulative Tally, STILL_OPEN Expanded, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
