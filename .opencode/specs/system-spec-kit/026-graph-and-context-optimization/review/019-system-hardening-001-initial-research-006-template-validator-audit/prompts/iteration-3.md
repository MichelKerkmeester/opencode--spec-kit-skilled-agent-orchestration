# Deep-Review Iteration Prompt Pack — 006 template-validator-audit iter 3

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/review/019-system-hardening-001-initial-research-006-template-validator-audit/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 3 of 12 | Dimension: contracts → documentation
Mode: review
Prior Findings: P0=0 P1=1 P2=2 (P1-001 help vs dispatch surface mismatch; P2-001 decision-record malformed desc; P2-002 iter 2 new)
newFindingsRatio trend: 1.0 → 0.67

Focus Area (iter 3, dimension=documentation): Finalize coverage matrix from iter 2. (a) Map every validator rule → template field it enforces → packet types affected. (b) Classify mismatches explicitly: `orphan_rule` (rule has no template target), `orphan_field` (field has no rule), `duplicate_coverage` (2+ rules enforce same invariant), `unenforced_invariant` (real contract missing rule). (c) Enumerate affected-packet counts per proposed change. (d) Document rule semantics gaps (help text vs actual behavior). Focus: correctness + documentation dimensions.

## STATE FILES

- Config, State Log (APPEND `"type":"iteration"`), Strategy, Registry, iterations/iteration-003.md, deltas/iter-003.jsonl

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Review target READ-ONLY.
- REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-003.md` — narrative with: Dimension, Files Reviewed, Coverage Matrix (rule × field × packet-type), Mismatch Classification (orphan_rule / orphan_field / duplicate_coverage / unenforced_invariant with counts), New Findings (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. Canonical JSONL record APPENDED to state log: `{"type":"iteration","iteration":3,"dimensions":["documentation"],"filesReviewed":N,"findingsSummary":{...},"findingsNew":[...],"traceabilityChecks":{...},"newFindingsRatio":0.5,"graphEvents":[]}`

3. `deltas/iter-003.jsonl` — structured delta.

All three required.
