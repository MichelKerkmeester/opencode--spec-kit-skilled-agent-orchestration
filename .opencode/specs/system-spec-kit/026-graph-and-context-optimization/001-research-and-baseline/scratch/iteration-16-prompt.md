# ITERATION 16 — Counter-evidence search for top 10 recommendations

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 16 of 18 max**. Rigor lane iter 8 of 10. Last critique iter before v2 assembly.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

For each of the top 10 recommendations, find the **strongest argument *against* adopting it**. The goal is to harden the recommendation language in v2 by anticipating dissent. If a counter-argument is fatal, the recommendation should be downgraded or removed in v2.

## Prior outputs (READ before starting)

- `research/recommendations.md` — the 10 recommendations
- `research/iterations/iteration-9-skeptical-review.md` — has critique on the recs
- `research/iterations/cost-reality-iter-14.md` — cost reality may falsify some "S" claims
- `research/iterations/combo-stress-test-iter-12.md` — Combo 3 falsification implications
- `research/iterations/cross-phase-patterns-iter-15.md` — 4 new patterns may inform counter-arguments
- `research/iterations/public-infrastructure-iter-13.md` — Public's actual infrastructure
- `research/iterations/gap-reattempt-iter-10.json` — closures may add or invalidate evidence

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set, `--add-dir .opencode/`. Read external/ if you need source-grounded counter-arguments.

---

## Iteration 16 mission: Find the strongest counter-argument for each of the top 10 recommendations

For R1 through R10, generate a **steel-manned** counter-argument:

| Field | What to find |
|---|---|
| **R# title** | (from recommendations.md) |
| **Synergy hypothesis (rec's claim)** | One-line restatement |
| **Steel-manned counter-argument** | The strongest argument against — not strawman |
| **Counter-evidence** | At least 1 `[SOURCE: ...]` citation supporting the counter |
| **Severity** | `fatal`, `weakening`, or `bounded` |
| **What would defeat the counter** | What would make the original recommendation correct anyway |
| **v2 verdict** | `keep`, `downgrade`, `replace`, or `remove` |
| **v2 reframing** | If keep/downgrade, how iter-17 should re-word the rec to address the counter |

### Severity rubric

- **fatal**: counter-argument kills the rec entirely; v2 should remove
- **weakening**: counter-argument exists but rec is still net-positive; v2 should keep with caveat
- **bounded**: counter-argument is real but only applies in narrow conditions; v2 can keep with conditional language

### Honesty calibration

Most recs should land at `bounded` or `weakening`. A `fatal` is rare and significant. A `keep` with no caveat means the counter is genuinely weak. Don't soften to be polite, don't over-attack to seem rigorous.

---

## Output 1 — `research/iterations/counter-evidence-iter-16.md`

```markdown
# Iteration 16 — Counter-Evidence for Top 10 Recommendations

> Steel-manned counter-arguments for v2 hardening.

## TL;DR
- ≤8 bullets: how many fatal/weakening/bounded; biggest surprises

## R1 — <title>
**Original claim:** ...
**Counter-argument:** ...
**Counter-evidence:** [SOURCE: ...]
**Severity:** bounded | weakening | fatal
**What defeats the counter:** ...
**v2 verdict:** keep | downgrade | replace | remove
**v2 reframing:** ...

## R2 — <title>
...

(repeat through R10)

## Severity distribution
| Severity | Count | R IDs |
| fatal | <n> | ... |
| weakening | <n> | ... |
| bounded | <n> | ... |

## v2 verdict distribution
| Verdict | Count | R IDs |
| keep | <n> | ... |
| downgrade | <n> | ... |
| replace | <n> | ... |
| remove | <n> | ... |

## Patterns observed
- ≤4 bullets

## Recommendations for iter-17 (v2 assembly)
- Specific re-wording suggestions per R
- Whether the top 10 ranking should change
```

---

## Output 2 — `research/iterations/iteration-16.md` (≤200 lines)

```markdown
# Iteration 16 — Per-iter report

## Method
- Steel-manned counters for R1-R10
- New external reads: <count>

## Verdict summary
| Verdict | Count |
| keep | <n> |
| downgrade | <n> |
| replace | <n> |
| remove | <n> |

## Top 3 counter-arguments by severity
- ...

## Handoff to iter-17 (v2 assembly)
- All amendments queued: iter-9 critique + iter-10 closures + iter-11 citation fixes + iter-12 combo verdicts + iter-13 moats/prereqs + iter-14 cost corrections + iter-15 new patterns + iter-16 counter-evidence
- Iter-17 must produce research-v2.md, findings-registry-v2.json, recommendations-v2.md
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":16,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"counter_evidence_top_10","recommendations_evaluated":10,"keep":<int>,"downgrade":<int>,"replace":<int>,"remove":<int>,"fatal_counters":<int>,"weakening_counters":<int>,"bounded_counters":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_16_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_16_COMPLETE keep=<n> downgrade=<n> replace=<n> remove=<n> fatal=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables (recommendations.md is read-only here)
- Steel-man, don't strawman
- Every counter must have at least 1 `[SOURCE: ...]` citation
- Use literal `00N-folder/` paths
- Most recs should be `bounded` or `weakening`; reserve `fatal` for genuine kills
- If a rec has no defensible counter, mark `keep` and explain why the counter is weak

## When done

Exit. Iter-17 (v2 assembly) is next — do NOT start it.
