# Deep-Research Iteration 4 — Recommendation Survival Audit

You are a LEAF research agent. Fresh-context iteration; all state is on disk.

## STATE

```
Iteration: 4 of 10
Segment: 1
Questions: 3/5 answered (Q1=firmed, Q2=OSCILLATING, Q3=6 blind spots)
Last focus: Severity firming + blind-spot audit (iter-3, 73 findings, newInfoRatio 0.39, status insight)
Last 3 ratios: 0.92, 0.47, 0.39
Rolling-3 avg: 0.593
Stuck count: 0
Next focus: Q4 recommendation survival audit
```

Research Topic: 026 research-and-baseline — outstanding gaps, convergence quality, and what was left unexplored across 19 prior iterations.

## MISSION (Iteration 4)

Answer Q4: **Do the surviving recommendations (5 kept + 4 downgraded + R10 replacement + surviving Combo 2 + weakened Combo 1 on freshness/lossiness) withstand a fresh adversarial audit against Public's current code state (as of 2026-04-23), or has the ground shifted since 2026-04-07?**

The prior run produced 10 recommendations (`research/recommendations.md`). After iter-16 counter-evidence: 5 KEPT, 4 DOWNGRADED, 1 REPLACED (R10). Iter-12 combo stress test: Combo 1 weakened, Combo 2 survived, Combo 3 falsified.

This iteration applies TWO pressure vectors:

### Pressure 1 — Temporal drift

Between 2026-04-07 (end of prior run) and 2026-04-23 (today), Public's substrate has moved. Check for RELEVANT changes that could invalidate any surviving rec:

1. `git log --since=2026-04-07 --pretty=format:"%h %s" .opencode/skill/system-spec-kit/mcp_server` — what shipped in the memory substrate?
2. `git log --since=2026-04-07 --pretty=format:"%h %s" .opencode/skill/sk-deep-research` — has the deep-research stack itself changed in ways that invalidate its own research?
3. `git log --since=2026-04-07 --pretty=format:"%h %s" .opencode/specs/system-spec-kit/026-graph-and-context-optimization` — have the 001/002/003/... child phases shifted the landscape?
4. `git log --since=2026-04-07 --oneline --stat` (top 30 recent commits summary) — macro picture of what's moved.

For each of the 10 recommendations, ask: does any of these recent commits make the rec STRONGER (already done), WEAKER (assumption invalidated), or NEUTRAL (unaffected)?

### Pressure 2 — Blind-spot-informed adversarial test

Iter-3 produced 6 blind spots (see iteration-3.md Part B). For EACH surviving recommendation, check whether any blind spot would materially downgrade it:

- R1-R10 (see recommendations.md)
- Combo 1 (weakened)
- Combo 2 (survived iter-12)

The adversarial test is simple: "Given blind spot BS-ID, does this recommendation still hold, or does the absence of evidence on that dimension leave the rec indefensible?" Use a 1-sentence verdict per (rec, blind-spot) pair.

## REQUIRED READING

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/recommendations.md` — the 10 surviving recs.
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/iterations/iteration-12.md` — combo stress test (Combo 2 survived, Combo 1 weakened, Combo 3 falsified).
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/iterations/iteration-16.md` — counter-evidence (5 keep, 4 downgrade, 1 replace).
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-3.md` — YOUR iter-3 Part B blind-spot table.
5. `git log` for the 4 paths above + top-30 repo commits since 2026-04-07.

## OUTPUT CONTRACT

Three artifacts (absolute paths).

### Artifact 1 — Iteration narrative

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-4.md`

Exact headings:

```md
# Iteration 4 — Recommendation Survival Audit

## Focus
[1-2 sentences]

## Actions Taken
[Bulleted list: git log calls, file reads]

## Findings

### Pressure 1 — Temporal Drift (since 2026-04-07)

| Path | Commits since 2026-04-07 | Net effect on surviving recs |
|------|--------------------------|------------------------------|
| system-spec-kit/mcp_server | <count> | [summary] |
| sk-deep-research | <count> | [summary] |
| specs/.../026-graph-and-context-optimization | <count> | [summary] |
| repo top-30 | <count> | [summary] |

**Per-rec drift verdict:**

| Rec | Temporal drift verdict | Rationale |
|-----|------------------------|-----------|
| R1 | STRONGER/WEAKER/NEUTRAL | [1-line + commit hash if any] |
| R2..R10 | ... | ... |
| Combo 1 | ... | ... |
| Combo 2 | ... | ... |

### Pressure 2 — Blind-Spot-Informed Adversarial Test

Matrix of recs × blind spots (from iter-3 Part B). Each cell: "holds" / "weakens" / "invalidates" + 1-sentence rationale.

|       | BS-1 | BS-2 | BS-3 | BS-4 | BS-5 | BS-6 |
|-------|------|------|------|------|------|------|
| R1    | holds/weakens/invalidates [rationale] | ... | ... | ... | ... | ... |
| R2..R10 | ... | ... | ... | ... | ... | ... |
| Combo 1 | ... | ... | ... | ... | ... | ... |
| Combo 2 | ... | ... | ... | ... | ... | ... |

### Combined Verdict

| Rec | v2 counter-evidence verdict | + Temporal | + Blind-spot | FINAL verdict |
|-----|----------------------------|-----------|--------------|---------------|
| R1 | KEEP/DOWNGRADE/REPLACE | ... | ... | KEEP/DOWNGRADE/REPLACE/WITHDRAW |
| R2..R10, Combo 1, Combo 2 | ... | ... | ... | ... |

Summary counts: KEEP=<n>, DOWNGRADE=<n>, REPLACE=<n>, WITHDRAW=<n>.

## Questions Answered
- [x] Q1, Q2, Q3 unchanged.
- [x] Q4 — survival verdict produced per rec with temporal + blind-spot pressure. KEEP=<n>, WITHDRAW=<n>.
- [ ] Q5 remains.

## Questions Remaining
- [ ] Q5: cheapest next action for marginal convergence.

## Next Focus
Iteration 5 — Q5 cheapest-next-action synthesis. Rank the P0/P1 remediations from iter-3 plus the newly-WITHDRAWN recs from this iteration by (impact_on_convergence / effort_hours). Produce the top-5 candidates as "do this single thing and the v2 deliverables become materially more defensible".
```

### Artifact 2 — State-log append

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deep-research-state.jsonl`

```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"Recommendation survival audit","findingsCount":<int>,"timestamp":"<ISO 8601 UTC>","sessionId":"dr-026-001-gaps-20260423T200629Z","generation":1,"executor":{"kind":"cli-copilot","model":"gpt-5.4","reasoningEffort":"high","serviceTier":null},"graphEvents":[]}
```

### Artifact 3 — Delta file

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deltas/iter-004.jsonl`

```json
{"type":"iteration","iteration":4,"newInfoRatio":<same>,"status":"<same>","focus":"Recommendation survival audit","findingsCount":<same>}
{"type":"finding","id":"f-iter004-001","severity":"P0|P1|P2","label":"<rec survival verdict>","iteration":4,"source":"temporal-drift|blind-spot-pressure|combined"}
... (one record per rec with material status change)
{"type":"observation","id":"obs-iter004-001","label":"Temporal-drift: <n> recs affected by recent commits","iteration":4}
{"type":"observation","id":"obs-iter004-002","label":"Blind-spot pressure: <n> recs weakened, <n> invalidated","iteration":4}
{"type":"observation","id":"obs-iter004-003","label":"FINAL: KEEP=<n>, DOWNGRADE=<n>, REPLACE=<n>, WITHDRAW=<n>","iteration":4}
```

## CONSTRAINTS

- LEAF agent — do NOT dispatch sub-agents.
- Max 12 tool calls total. Target 8.
- Do NOT modify any file under `001-research-and-baseline/research/` (legacy local dir is READ-ONLY).
- Every temporal-drift claim must cite a commit hash.
- Every blind-spot pressure verdict must reference a specific BS-ID from iter-3.
- All three artifacts must land on disk.
