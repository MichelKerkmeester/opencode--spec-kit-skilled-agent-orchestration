# Deep-Review Iteration 4 — 006 template-validator-audit

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/review/019-system-hardening-001-initial-research-006-template-validator-audit/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

Iteration: 4 of 12 | Dimension: maintainability
Mode: review
Prior Findings: P0=0 P1=1 P2=3
newFindingsRatio trend: 1.0 → 0.67 → 0.5 (descending — approaching convergence but not yet <0.05)

Focus Area (iter 4, dimension=maintainability): (a) Rank the mismatches from iter 3's taxonomy by affected-packet count × noise reduction. Estimate packet coverage for each proposed rule change. (b) Classify each proposal as `quick-win` (low LoC, low churn), `medium` (requires template or script edit), `major` (requires workflow redesign). (c) Identify dependency chains between proposals (which must land first). (d) Surface any P0 findings if evidence supports elevation.

## STATE FILES

- State Log (APPEND `"type":"iteration"`), Strategy, Registry, iterations/iteration-004.md, deltas/iter-004.jsonl

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Review target READ-ONLY.
- REQUIRED canonical JSONL + delta file with `type="iteration"` records.

## OUTPUT CONTRACT

1. `iterations/iteration-004.md` — narrative: Dimension, Files Reviewed, Ranked Proposals (affected-packet count × noise reduction), Proposal Classification (quick-win / medium / major), Dependency Chains, New Findings, Verdict, Next Dimension.

2. Canonical JSONL record APPENDED: `{"type":"iteration","iteration":4,"dimensions":["maintainability"],"filesReviewed":N,"findingsSummary":{...},"findingsNew":[...],"traceabilityChecks":{...},"newFindingsRatio":0.3,"graphEvents":[]}`

3. `deltas/iter-004.jsonl` — structured delta.
