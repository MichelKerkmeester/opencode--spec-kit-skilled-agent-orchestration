# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 4 of 10
Last 2 ratios: 0.70 -> 0.64 | Stuck count: 0
Cumulative tally: ADDRESSED=10, STILL_OPEN=2, SUPERSEDED=35, UNVERIFIED=18 (65 of 242 classified). Remaining: 177. Budget: 6 iterations left. Target ~30 findings/iter.

Iteration: 4 of 10
Focus Area: Complete remaining P1 audit then transition to P2 batch. Priorities:

**Remaining P1 clusters** (~49 P1 left, excluding the 65 classified from P0+P1 batch):
- Graph-metadata laundering + packet-search boost (graph-metadata-parser.ts). Likely SUPERSEDED by phase 016 graph-metadata migrated marker + S3/P0-C composite.
- Reconsolidation remainder (lib/storage/reconsolidation.ts complement + duplicate window findings). Likely ADDRESSED by commit 104f534bd0.
- Skill advisor findings (skill_advisor.py invisible-discard + prefix-collapse). Check phase 014 + 017 for addressing.
- Memory-save validation findings not yet covered. Check phase 016 predecessor CAS.

**P2 batch start**: after P1 complete, begin P2 batch. 133 P2 findings total. Most are noise/suggestion-level and likely ADDRESSED or SUPERSEDED by downstream refactoring. Target: audit 20-30 P2s this iteration. Prioritize P2s that share clusters with already-classified P1s (easy SUPERSEDED/ADDRESSED propagation).

**Re-audit UNVERIFIED (18 items)**: any UNVERIFIED from iter 1-3 should be re-examined with the cluster context accumulated. Many may now be classifiable.

Remaining Key Questions:
- Q1 (active): tally (177 more)
- Q3 (active): P1 remaining (~49)
- Q4 (active): P2 begin (133)
- Q5 (blocked on Q3+Q4 complete)

Last 3 Iterations Summary: iter 1 P0+10 P1 (0.55), iter 2 20 more (0.70), iter 3 34 cluster batches (0.64)

## STATE FILES

Same as prior iterations. Write to `.../iterations/iteration-004.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Target 30+ findings classified this iteration.
- Reduce UNVERIFIED count — each UNVERIFIED re-audit reduces the residual backlog.
- For P2 batch: cluster by theme (test coverage, doc drift, code smell) to batch-classify efficiently.

## OUTPUT CONTRACT

1. `.../iterations/iteration-004.md` with Focus, Actions, Findings Batch-Audited, Cumulative Tally, UNVERIFIED Re-Audited, Questions Answered, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
