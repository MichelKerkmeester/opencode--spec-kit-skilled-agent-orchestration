# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 9 of 10
Last 3 ratios: 0.41 -> 0.33 -> 0.18 | Stuck count: 0 | Rolling avg last 3: 0.307
**All 242 findings classified.** Final tally: ADDRESSED=61, STILL_OPEN=19, SUPERSEDED=162, UNVERIFIED=0.

Iteration: 9 of 10
Focus Area: **Synthesis iteration**. Write the final review-report + delta-report.

**Deliverable 1 — review-report.md**:
Write at `026/review/019-system-hardening-001-initial-research-002-delta-review-015/review-report.md` with sections:

1. **Executive Summary** (250-350 words): delta-review approach, final tally, 015 P0 verdict (ADDRESSED by 104f534bd0), key STILL_OPEN themes, recommended 015 Workstream 0+ restart scope.

2. **Classification Methodology**: how ADDRESSED/STILL_OPEN/SUPERSEDED/UNVERIFIED were decided. Note how 016/017/018 architectural primitives (4-state TrustState, predecessor CAS, shared-provenance, readiness-contract, retry-budget, caller-context) drove the SUPERSEDED surge.

3. **Final Tally** (table): 242 findings across 4 classifications with severity breakdown (P0/P1/P2 per class).

4. **015 P0 Verification** (verdict section): reconsolidation-bridge.ts:208-250 cross-scope merge — ADDRESSED by commit 104f534bd0. Include current-main evidence (findScopeFilteredCandidates at reconsolidation-bridge.ts:342-387, reconsolidation-bridge.vitest.ts:390-400).

5. **STILL_OPEN Backlog** (organized by proposed 015 Workstream 0+ cluster): the 19 STILL_OPEN findings grouped by:
   - Cluster name (e.g., session-resume-leak, startup-brief-silent-drop, ...)
   - Severity (P1/P2)
   - File:line evidence per finding
   - Proposed remediation effort (S/M/L)
   - Dependencies between clusters

6. **ADDRESSED & SUPERSEDED Index** (summary tables — not every finding, but each cluster):
   - ADDRESSED clusters with addressing commit hashes
   - SUPERSEDED clusters with replacing primitive names

7. **Recommendations for 015 W0+ Restart**: narrowed scope (19 STILL_OPEN instead of 243 original), recommended phasing, interaction with 019/002+ implementation children.

**Deliverable 2 — 015/review/delta-report-2026-04.md**:
Write an abbreviated delta-report in the 015 packet's review folder at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/review/delta-report-2026-04.md` with:
- Front-matter linking back to this sub-packet
- Tally summary (242 total, ADDRESSED/STILL_OPEN/SUPERSEDED/UNVERIFIED counts)
- 015 P0 verdict (ADDRESSED by 104f534bd0)
- STILL_OPEN backlog list (abbreviated)
- Link to full review-report.md for details

Remaining Key Questions:
- All 5 questions answered. Iter 9 synthesizes. Iter 10 polish or skip to convergence.

Last 3 Iterations Summary: iter 6 38 + STILL_OPEN 14 (0.41), iter 7 43 + STILL_OPEN 19 (0.33), iter 8 41 closing + cluster-ready (0.18)

## STATE FILES

Same as prior iterations. Write to:
- `.../review-report.md` (NEW canonical review synthesis)
- `.../001-deep-review-and-remediation/review/delta-report-2026-04.md` (NEW cross-packet reference)
- `.../iterations/iteration-009.md` (iteration delta)

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- review-report.md is the canonical synthesis output.
- delta-report-2026-04.md MUST reference the canonical review-report for details.
- IMPORTANT: Append JSONL delta to state log (use `echo ... >> ...jsonl`).

## OUTPUT CONTRACT

1. `.../review-report.md` (NEW, canonical synthesis)
2. `.../001-deep-review-and-remediation/review/delta-report-2026-04.md` (NEW, cross-packet)
3. `.../iterations/iteration-009.md` (iteration delta)
4. JSONL delta APPENDED:
```json
{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
