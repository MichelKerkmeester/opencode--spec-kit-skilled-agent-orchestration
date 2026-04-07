# ITERATION 14 — Adoption-cost reality check (S/M/L effort estimates)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 14 of 18 max**. Rigor lane iter 6 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

Iter-7 assigned S/M/L effort estimates to candidates and combos based on "feel". Iter-13 just inventoried Public's actual code. This iter cross-references the two: for each top adoption candidate, estimate effort using **real evidence** from Public's codebase (line counts, hook touchpoints, schema changes needed, test scaffolding required, integration points).

## Prior outputs (READ before starting)

- `research/iterations/q-d-adoption-sequencing.md` — phase P0/P1/P2/P3 with current S/M/L
- `research/iterations/q-c-composition-risk.md` — 28 candidates with risk + touches
- `research/iterations/q-f-killer-combos.md` — combos with current effort estimates
- `research/iterations/combo-stress-test-iter-12.md` — stress-test verdicts (especially Combo 3 falsified)
- `research/iterations/public-infrastructure-iter-13.md` — Public's actual infrastructure inventory + 11 missing prereqs

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set, `--add-dir .opencode/`. Read Public's actual code to ground every effort estimate.

---

## Iteration 14 mission: Reality-check effort estimates against Public's actual codebase

### Step 1 — Pick the candidates
For each P0 + P1 candidate from `q-d-adoption-sequencing.md` (19 candidates total: 9 P0 + 10 P1), estimate adoption effort using **concrete evidence**. Skip P2 and P3 (too speculative for now).

Plus the top 10 recommendations from `recommendations.md`.

### Step 2 — Effort dimensions to count

For each candidate, count or estimate:

| Dimension | Method |
|---|---|
| New files needed | List specific paths (e.g. `mcp_server/handlers/X.ts`) |
| Existing files modified | List + LOC delta estimate |
| New schema/migration | yes/no + scope |
| New hooks added | hook name + path |
| Test scaffolding needed | yes/no + frameworks |
| External library deps | yes/no + names |
| Documentation updates | which docs |
| Memory triggers / constitutional rules | yes/no |
| Integration points to existing surfaces | which surfaces touched |

### Step 3 — Compute realistic S/M/L

| Range | Definition (REAL definitions, not feels) |
|---|---|
| **S (1-7 days)** | <500 LOC total, <3 files modified, no new schema, no new external deps, fits in one Code Graph handler or Spec Kit Memory module |
| **M (1-4 weeks)** | 500-2000 LOC total, 3-10 files modified, may include new schema or new MCP tool, may require new test scaffolding |
| **L (1-3 months)** | >2000 LOC total, 10+ files modified, includes architectural change (new surface, new module, schema migration), requires multi-iteration design |

Compare iter-14 estimate to iter-7 estimate. Note the deltas.

### Step 4 — Identify mis-sized candidates

For each candidate where iter-7's estimate was wrong:
- `under-sized`: iter-7 said S, reality is M; iter-7 said M, reality is L
- `over-sized`: iter-7 said L, reality is M; iter-7 said M, reality is S
- `accurate`: estimate holds

For each mis-sized candidate, surface concrete evidence (file count, missing prereq from iter-13, etc.).

---

## Output 1 — `research/iterations/cost-reality-iter-14.md`

```markdown
# Iteration 14 — Adoption-Cost Reality Check

> Effort estimates grounded in Public's actual code, not feel.

## TL;DR
- ≤8 bullets: how many under-sized / over-sized / accurate; biggest surprises

## Effort definitions (this iter's rubric)
| Tier | Definition | Boundary signals |
|---|---|---|
| S | <500 LOC, <3 files, no new schema/dep | ... |
| M | 500-2000 LOC, 3-10 files, may include new schema | ... |
| L | >2000 LOC, 10+ files, architectural change | ... |

## Per-candidate cost reality

### Group P0 (9 candidates)

#### Candidate <name>
**Iter-7 estimate:** S
**Iter-14 estimate:** S | M | L
**Delta:** accurate | under-sized | over-sized
**Concrete evidence:**
- New files: <list>
- Modified files: <list with LOC delta>
- New schema: yes/no
- Hooks: <name>
- Tests: <scope>
- Deps: <list>
- Integration points: <surfaces>
- Missing iter-13 prereqs: <list>
**Justification:** ≤200 chars

(repeat for all 9 P0)

### Group P1 (10 candidates)
(repeat structure for all 10 P1)

### Group: Top 10 recommendations
(if not already covered above)

### Group: 3 killer combos
(combo-level effort, accounting for combo-stress-test verdicts)

## Mis-sized candidates summary

| Candidate | Iter-7 | Iter-14 | Delta | Why |
| ... | S | M | under-sized | needs schema migration not in iter-7 estimate |

## Recommendations for v2

- iter-17 should re-tier P0/P1 sequencing based on these corrections
- Specific candidates to demote/promote
```

---

## Output 2 — `research/iterations/iteration-14.md` (≤200 lines)

```markdown
# Iteration 14 — Per-iter report

## Method
- Cross-referenced q-d-adoption-sequencing.md candidates against .opencode/ files
- Counted new files, modified files, schema, hooks, tests, deps

## Sizing accuracy
| Tier | Accurate | Under-sized | Over-sized |
| S→? | ... |
| M→? | ... |
| L→? | ... |

## Top mis-sizing surprises
- ...

## Handoff to iter-15
- iter-15 will hunt for new cross-phase patterns
- Mis-sized candidates may signal patterns iter-7 missed
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":14,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"adoption_cost_reality_check","candidates_evaluated":<int>,"accurate":<int>,"under_sized":<int>,"over_sized":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_14_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_14_COMPLETE evaluated=<n> accurate=<n> under=<n> over=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables
- DO NOT modify q-d-adoption-sequencing.md
- Every effort estimate must cite concrete evidence (file paths, LOC counts, missing prereqs)
- Use literal `00N-folder/` paths (NOT `phase-N/`)
- Be honest if iter-7 was wrong — that's the point of this iter
- If a candidate is wholly speculative (no clear path through Public's stack), mark it `Speculative` and skip the S/M/L

## When done

Exit. Do NOT start iter-15.
