# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/001-initial-research/002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 3 of 10
Last 2 ratios: 0.55 -> 0.70 | Stuck count: 0
Cumulative tally: ADDRESSED=10, STILL_OPEN=2, SUPERSEDED=5, UNVERIFIED=14 (31 of 242 classified). Remaining: 211.

Research Topic: Delta-review of 015's 242 deduped findings against current main. See iteration-001.md (P0 ADDRESSED) and iteration-002.md (cluster batch) for prior context.

Iteration: 3 of 10
Focus Area: Continue batch-audit of remaining P1 findings (~89 left out of 114), prioritizing:
- **Reconsolidation cluster beyond P0** (lib/storage/reconsolidation.ts, create-record.ts, complement window findings). Likely ADDRESSED by commit 104f534bd0 (P0-B composite).
- **Hook state + durability cluster** (hook-state.ts, session-stop.ts, TOCTOU findings). Likely ADDRESSED by phase 016 Zod HookStateSchema + `.bad` quarantine + predecessor CAS (S2/P0-A composite) + phase 017 caller-context.
- **Post-insert + enrichment cluster** (post-insert.ts enrichmentStatus, retry budget). Likely ADDRESSED by phase 016 M13 refactor + phase 017 retry-budget primitive.
- **Playbook + manual-testing cluster** (manual-playbook-runner.ts Function(...) eval findings, skill-graph compiler findings). Check if addressed.

Target: classify another 30-40 findings this iteration. Prefer batches that reduce UNVERIFIED count — re-audit UNVERIFIED items from iter 1 with the cluster context from iter 2.

Remaining Key Questions:
- Q1 (active): tally progress (need 211 more)
- Q2 ✓
- Q3 (active): 114 P1 classified — partial (cumulative ~21 P1 + 1 P0 = 22 of 115 classified)
- Q4 (blocked): P2 findings
- Q5 (blocked): narrowed residual backlog

Last 3 Iterations Summary: iter 1 P0 + 10 P1 (0.55), iter 2 20 more (0.70)

## STATE FILES

- Config/State/Strategy/Registry: same as prior iterations
- Prior iterations: iteration-001.md, iteration-002.md (read for cluster context)
- Source: `015-deep-review-and-remediation/review/review-report.md`
- Write findings to: `026/review/019-system-hardening-001-initial-research-002-delta-review-015/iterations/iteration-003.md`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Prioritize reducing UNVERIFIED count by re-auditing earlier UNVERIFIED items with cluster context.
- Each classification MUST cite commit hash (ADDRESSED), current file:line (STILL_OPEN), primitive name (SUPERSEDED), or evidence gap (UNVERIFIED).
- If STILL_OPEN finding surfaces, add to a "Residual STILL_OPEN Backlog" section with priority.

## OUTPUT CONTRACT

1. `.../iterations/iteration-003.md` with Focus, Actions, Findings Batch-Audited, Cumulative Tally, Residual Backlog So Far, Questions Answered, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
