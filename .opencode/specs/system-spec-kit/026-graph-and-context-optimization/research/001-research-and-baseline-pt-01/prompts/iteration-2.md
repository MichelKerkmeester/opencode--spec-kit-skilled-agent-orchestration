# Deep-Research Iteration 2 — Convergence Quality Audit

You are a LEAF research agent. You MUST follow the Output Contract at the bottom exactly. This is a fresh-context iteration; do NOT assume prior conversation memory — all state is on disk.

## STATE

```
Iteration: 2 of 10
Segment: 1
Questions: 0/5 answered (all 5 still open in findings-registry.json)
Last focus: Gap inventory (iter-1, 67 findings, newInfoRatio 0.92, status insight)
Last 2 ratios: N/A -> 0.92
Stuck count: 0
Next focus: Convergence quality audit (Q2)
```

Research Topic: 026 research-and-baseline — outstanding gaps, convergence quality, and what was left unexplored across 19 prior iterations.

## MISSION (Iteration 2)

Answer Q2: **Was the final composite score of 0.82 a genuine convergence plateau, or an artifact?**

The prior run's final iter-18 recorded `v2_validation: fail, new_info_ratio: 0.08, composite: 0.82`. Composite oscillated non-monotonically across the rigor lane: 0.94 (iter-8) → 0.62 (iter-9) → 0.78 (iter-10) → 0.80 (iter-11) → 0.67 (iter-12) → 0.82 (iter-13) → 0.81 (iter-14) → 0.79 (iter-15) → 0.78 (iter-16) → 0.83 (iter-17) → 0.82 (iter-18).

Investigate THREE sub-questions. For each, produce a numeric verdict + supporting evidence chain:

### Sub-Q2.a — Tag taxonomy over-assignment
- Iter-1 already established that 31 of 88 findings carry `new-cross-phase` tags vs the 15 target (obs-iter001-001).
- Of those 31, how many are GENUINELY cross-phase (span ≥3 phases with evidence) vs how many are mis-tagged (should be `phase-1-extended` or `phase-1-confirmed`)?
- Inspect `findings-registry.json` directly: load all 88 findings and classify each `new-cross-phase`-tagged finding by counting distinct `phase_span` references in its `evidence_sources` / `cross_phase_spans` field (whichever the registry uses).
- Produce a breakdown table: `kept | retag_to_extended | retag_to_confirmed | ambiguous` with counts and rationale per category.

### Sub-Q2.b — Citation audit follow-through
- Iter-11 identified 6 BROKEN citations (plus 3 mostly-solid). Iter-17 claims `citations_fixed: 6`.
- Iter-1's observation (obs-iter001-002) says "6/6 broken citations verified fixed in v2 at the path level". Verify this precisely.
- For EACH of the 6 broken citations: (a) what did iter-11 flag as broken (citation_id, original_source, reason), (b) what did iter-17 actually patch in v2 (quote the new source line), (c) does the new citation ACTUALLY support the claim, or was the citation merely redirected to a different-but-still-weak source?
- Also: for the 3 `mostly-solid` findings, does v2's synthesis still depend on them for load-bearing claims? (If yes, the "6 fixed" number is misleading because the real unreliable-citation count is 9.)

### Sub-Q2.c — Counter-evidence pressure
- Iter-16 tested counter-evidence against the **top 10** recommendations. Result: 5 keep, 4 downgrade, 1 replace.
- But the prior run had **88 findings**, not just 10 load-bearing recs. What about the OTHER 78 findings? Many rank P2/P3 but some may be load-bearing to the surviving recommendations.
- Sample 10 P1 findings NOT covered by iter-16's top-10 pass. Quickly apply the same counter-evidence protocol (1-minute per finding, narrow evidence check): is the finding still defensible under mild adversarial pressure?
- Produce a projection: if iter-16 had tested all 88 findings, what fraction would have been flagged for downgrade or replacement?

### Composite Score Oscillation Analysis
- Pattern: 0.94 (peak at v1 assembly) → 0.62 (after skeptical review identifies 8 must-fix / 10 should-fix / 4 nice-to-fix) → steady 0.78-0.83 band through rigor lane → 0.82 final.
- Was the rigor lane CONVERGENT (actually closing gaps and stabilizing) or was it merely SAWING between new-gap-discovery and patch-application, never truly plateauing below the threshold?
- Compute: (a) std-dev of composite across iters 9-18, (b) mean newInfoRatio across iters 9-18 (target was <0.15), (c) frequency of "new gaps surfaced" events per iteration.
- Verdict: PLATEAU (real convergence), FLOOR (hit a quality ceiling), or OSCILLATING (unconverged but ceilinged by iteration budget).

## REQUIRED READING

Read these files. Use Read + Grep + one-off Bash with python3 for JSON stats. All paths are relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md` — iter-1 gap inventory (YOUR OWN prior iteration, read to avoid re-deriving).
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/iterations/citation-audit-iter-11.json` — 30-finding audit.
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/iterations/iteration-17.md` — v2 assembly (claims 6 citations fixed).
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/iterations/iteration-16.md` — counter-evidence pass.
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/findings-registry.json` — full 88 findings.
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/research.md` — v2 synthesis (skim only the citations that appear in the top 10 recs).
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/recommendations.md` — top 10 recs referenced by iter-16.
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/deep-research-state.jsonl` — full iter-1..18 timeline for oscillation stats.

## OUTPUT CONTRACT

Three artifacts (absolute paths, no symlinks):

### Artifact 1 — Iteration narrative

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-2.md`

Exact headings:

```md
# Iteration 2 — Convergence Quality Audit

## Focus
[1-2 sentences]

## Actions Taken
[Bulleted list; file:line citations where applicable]

## Findings
### Sub-Q2.a — Tag Taxonomy Over-Assignment
[Breakdown table: kept | retag_to_extended | retag_to_confirmed | ambiguous. Counts + rationale per category. A representative finding-id per category.]

### Sub-Q2.b — Citation Audit Follow-Through
[Table with one row per broken citation (6 rows) — columns: citation_id, iter-11 original_source, iter-11 reason, iter-17 v2 patch, still-supports-claim? (Y/N), residual concern. Plus a paragraph on the 3 mostly-solid findings and their load-bearing status in v2 recs.]

### Sub-Q2.c — Counter-Evidence Pressure Extrapolation
[Sampled 10 P1 findings not in iter-16's top-10 pass. Per-finding verdict (keep/soften/replace). Projection: if iter-16 had tested all 88 findings, N% would have been flagged.]

### Composite Score Oscillation Analysis
[Numeric stats: std-dev of composite iters 9-18, mean newInfoRatio iters 9-18, count of new-gap-discovery events per iter. Final verdict: PLATEAU | FLOOR | OSCILLATING with rationale.]

## Questions Answered
- [x] Q2 — Convergence quality — **answered** with verdict: PLATEAU | FLOOR | OSCILLATING + citations.
- [ ] Q1, Q3, Q4, Q5 unchanged.

## Questions Remaining
- [ ] Q1 (gap severity firming, deferred to iter-3)
- [ ] Q3 (blind-spot audit)
- [ ] Q4 (recommendation survival against current state)
- [ ] Q5 (cheapest next action)

## Next Focus
Iteration 3 — Severity firming + blind-spot audit (Q1 + Q3). Take iter-1's 67 candidate-severity gaps and firm each to P0/P1/P2 with cheapest-remediation. Simultaneously enumerate structural blind spots the prior run never touched (e.g. measurement axes never defined, systems/subsystems/files never inventoried).
```

### Artifact 2 — State-log append

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deep-research-state.jsonl`

Append exactly ONE line of JSON:

```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"Convergence quality audit","findingsCount":<int>,"timestamp":"<ISO 8601 UTC>","sessionId":"dr-026-001-gaps-20260423T200629Z","generation":1,"executor":{"kind":"cli-copilot","model":"gpt-5.4","reasoningEffort":"high","serviceTier":null},"graphEvents":[]}
```

Use `printf '%s\n' '<single-line-json>' >> <path>`.

### Artifact 3 — Per-iteration delta file

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deltas/iter-002.jsonl`

Contents (one JSON object per line):

```json
{"type":"iteration","iteration":2,"newInfoRatio":<same>,"status":"<same>","focus":"Convergence quality audit","findingsCount":<same>}
{"type":"finding","id":"f-iter002-001","severity":"<P0|P1|P2>","label":"<1-line>","iteration":2,"source":"sub-q2a|sub-q2b|sub-q2c|oscillation-analysis"}
... (one record per concrete new finding)
{"type":"observation","id":"obs-iter002-001","label":"Tag taxonomy remediation target: <N> findings need retagging","iteration":2}
{"type":"observation","id":"obs-iter002-002","label":"Citation follow-through verdict: <robust|superficial>","iteration":2}
{"type":"observation","id":"obs-iter002-003","label":"Counter-evidence extrapolation: <N>% of 88 findings likely to fail under full adversarial pass","iteration":2}
{"type":"observation","id":"obs-iter002-004","label":"Oscillation verdict: PLATEAU|FLOOR|OSCILLATING with std-dev=<x> mean-ratio=<y>","iteration":2}
```

## CONSTRAINTS

- LEAF agent — do NOT dispatch sub-agents.
- Max 12 tool calls total. Target 8.
- Write ALL findings to files. Do not hold in context.
- Do NOT modify any file under `001-research-and-baseline/research/` (legacy local dir is READ-ONLY).
- Every numeric claim must be traceable to a file:line citation or a clearly-documented python3 computation.
- All three artifacts must land on disk. The post-dispatch validator checks for them.

## WHAT "DONE" LOOKS LIKE

1. `iterations/iteration-2.md` exists, non-empty, with specified headings and verdicts.
2. `deep-research-state.jsonl` grown by exactly ONE line with `"type":"iteration","iteration":2,...`.
3. `deltas/iter-002.jsonl` exists with `"type":"iteration"` + findings + observations.
