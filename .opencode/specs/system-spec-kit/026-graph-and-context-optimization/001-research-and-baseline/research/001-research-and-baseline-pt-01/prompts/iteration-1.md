# Deep-Research Iteration 1 — Gap Inventory

You are a LEAF research agent. You MUST follow the Output Contract at the bottom of this file exactly.

## STATE

```
Iteration: 1 of 10
Segment: 1
Questions: 0/5 answered
Last focus: none yet (fresh session)
Last 2 ratios: N/A -> N/A
Stuck count: 0
Next focus: Iteration 1 — Gap Inventory
```

Research Topic: 026 research-and-baseline — outstanding gaps, convergence quality, and what was left unexplored across 19 prior iterations.

## MISSION (Iteration 1)

The prior 18-iteration (+1 skeptical-review artifact) master-consolidation deep-research packet already exists at the **legacy local artifact dir** (READ-ONLY for this run):

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/`

Produce a **consolidated gap inventory** spanning every gap the prior run either:
- Self-identified in the original charter (26 first-pass exit gaps × 5 phases)
- Surfaced during the rigor lane (iter-9 skeptical review: 8 must-fix / 10 should-fix / 4 nice-to-fix)
- Flagged in the citation audit (iter-11: 6 broken, 3 mostly solid)
- Falsified / weakened in the combo stress test (iter-12: Combo 3 falsified, Combo 1 weakened)
- Failed validation (iter-18: v2 new-cross-phase tag over-assignment, 31 vs 15 target)
- Left `UNKNOWN` or `partial` in the final findings registry (iter-18: 2 confirmed UNKNOWN, 4 partial)

## REQUIRED READING (in order)

Read these files thoroughly before writing the iteration narrative. Use the Read / Grep tools; do not dispatch sub-agents.

1. `001-research-and-baseline/research/deep-research-strategy.md` (the original charter + 26 exit gaps)
2. `001-research-and-baseline/research/deep-research-state.jsonl` (full iteration timeline)
3. `001-research-and-baseline/research/research.md` (v2 canonical synthesis, 85KB — skim structure first, then read targeted sections)
4. `001-research-and-baseline/research/recommendations.md` (ranked recs, 17KB)
5. `001-research-and-baseline/research/findings-registry.json` (88 findings, 70KB — inspect schema and tag distribution)
6. `001-research-and-baseline/research/cross-phase-matrix.md` (capability matrix from iter-4)
7. `001-research-and-baseline/research/iterations/iteration-9-skeptical-review.md` (critique of v1)
8. `001-research-and-baseline/research/iterations/iteration-10.md` (UNKNOWN + partial re-attempt)
9. `001-research-and-baseline/research/iterations/citation-audit-iter-11.json` (20% fail rate)
10. `001-research-and-baseline/research/iterations/iteration-12.md` (combo stress test)
11. `001-research-and-baseline/research/iterations/iteration-16.md` (counter-evidence top 10 recs)
12. `001-research-and-baseline/research/iterations/iteration-18.md` (final validation fail)
13. `001-research-and-baseline/research/archive/v1-v2-diff-iter-18.md` (final v1→v2 diff)

Skim iterations 1-8, 13-15, 17 only if needed to disambiguate a specific gap.

## OUTPUT CONTRACT

You MUST produce THREE artifacts. Absolute paths, no symlinks:

### Artifact 1 — Iteration narrative

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md`

Structure (exact headings):

```md
# Iteration 1 — Gap Inventory

## Focus
[1-2 sentence restatement of the iteration's purpose]

## Actions Taken
[Bulleted list of files read and tools used, with file:line citations where relevant]

## Findings
### Gap Inventory Table
| GAP-ID | Source | Phase | Prior Status (v2) | Evidence Chain v1→v2 | Candidate Severity | Cheapest Remediation |
|--------|--------|-------|-------------------|----------------------|--------------------|-----------------------|
| GAP-001 | first-pass-exit | 001 | partial | [source:line] → [source:line] | P1 | [1-line plan] |
| ...     | ...   | ...   | ...           | ...                  | ...                | ...                   |

[Include EVERY gap discovered across ALL sources. Expected count: 40-60+ gaps. Group by source where helpful.]

### Tag Taxonomy Analysis
[1-2 paragraphs on the 31-vs-15 `new-cross-phase` tag over-assignment. What fraction of the 88 findings are
incorrectly tagged? Which should be retagged as `phase-1-extended` or `phase-1-confirmed`?]

### Citation Audit Status
[1 paragraph: of the 6 broken citations identified in iter-11, how many were actually fixed by v2 (iter-17)? Inspect iter-17 assembly log + v2 research.md + findings-registry for evidence. Produce a list of those that remain unverified.]

### Non-Monotonic Convergence Observation
[1-2 paragraphs: composite oscillated 0.94 → 0.62 → 0.80 → 0.67 → 0.82 across iters 8-18. Is 0.82 a stable
plateau or a local fluctuation? Cite specific iter-record evidence.]

## Questions Answered
- [ ] Q1: Outstanding gaps — **partially answered** (inventory complete; severity column is candidate-only until iter-3 validates)
- [ ] Q2, Q3, Q4, Q5: unchanged

## Questions Remaining
- [ ] Q2. Convergence quality
- [ ] Q3. Blind spots (beyond gaps already self-identified)
- [ ] Q4. Recommendation survival
- [ ] Q5. Cheapest next research/implementation action

## Next Focus
[Recommend: "Iteration 2 — Convergence quality audit (score + evidence + tag taxonomy remediation)". Defer severity firming to iter-3.]
```

### Artifact 2 — State-log append

Append ONE line of JSON to:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deep-research-state.jsonl`

Exact schema (no pretty-print, no stdout-only — must land in the file):

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"Gap inventory","findingsCount":<int>,"timestamp":"<ISO 8601 UTC>","sessionId":"dr-026-001-gaps-20260423T200629Z","generation":1,"executor":{"kind":"cli-copilot","model":"gpt-5.4","reasoningEffort":"high","serviceTier":null},"graphEvents":[/* optional array of {type, id, label, ...} */]}
```

Use `printf '%s\n' '<single-line-json>' >> <path>` to append (avoid echo quoting pitfalls). Set `newInfoRatio` to a numeric estimate reflecting that this is the FIRST iteration of a META-research (expected high, 0.80-1.00). Set `findingsCount` to the number of gaps in your table.

### Artifact 3 — Per-iteration delta file

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/deltas/iter-001.jsonl`

Contents (one JSON object per line):

```json
{"type":"iteration","iteration":1,"newInfoRatio":<same as above>,"status":"<same>","focus":"Gap inventory","findingsCount":<same>}
{"type":"finding","id":"f-iter001-001","severity":"<P0|P1|P2>","label":"<1-line gap summary>","iteration":1,"source":"<first-pass-exit|iter-9|iter-11|iter-12|iter-16|iter-18|registry>"}
... (one record per gap in the inventory table)
{"type":"observation","id":"obs-iter001-001","label":"Tag taxonomy: <N>/88 findings are `new-cross-phase` vs 15 target","iteration":1}
{"type":"observation","id":"obs-iter001-002","label":"Citations: <N>/6 broken citations verified fixed in v2","iteration":1}
{"type":"observation","id":"obs-iter001-003","label":"Convergence: 0.94→0.62→0.80→0.67→0.82 non-monotonic; final plateau disputed","iteration":1}
```

## CONSTRAINTS

- LEAF agent — do NOT dispatch sub-agents.
- Max 12 tool calls total. Target 8.
- Write ALL findings to files. Do not hold in context.
- Do NOT modify any file under the legacy local artifact dir (`001-research-and-baseline/research/`). Read-only.
- Do NOT modify `research.md`, `recommendations.md`, `findings-registry.json`, or `cross-phase-matrix.md` in the legacy dir.
- Every gap in the inventory must cite `[SOURCE: <file>:<line>]` from the legacy packet.
- All three artifacts must land on disk. The post-dispatch validator checks for them and fails the iteration if missing.

## WHAT "DONE" LOOKS LIKE

When you finish, the orchestrator should see:

1. `iteration-1.md` exists, non-empty, with the specified headings.
2. `deep-research-state.jsonl` has grown by exactly ONE line with `"type":"iteration","iteration":1,...`.
3. `deltas/iter-001.jsonl` exists, non-empty, with at least one `"type":"iteration"` record plus the finding / observation records.

If any artifact fails to write, the validator will emit a `schema_mismatch` event and the next iteration will be scheduled as a retry.
