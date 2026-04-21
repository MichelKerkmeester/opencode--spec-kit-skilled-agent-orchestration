# ITERATION 17 — V2 ASSEMBLY (research-v2.md + findings-registry-v2.json + recommendations-v2.md)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 17 of 18 max**. This is the **v2 re-render**, folding in all amendments from iters 9-16.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

V1 was assembled in iter-8. Iters 9-16 were the rigor lane: skeptical review, gap re-attempts, citation audit, combo stress-test, infra inventory, cost reality check, pattern hunt, counter-evidence search. This iter folds **all** their findings into a v2 re-render that strengthens v1.

**v1 deliverables remain unchanged.** v2 lives alongside v1 with `-v2` suffix so you can diff.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set, `--add-dir .opencode/`. Synthesis-mostly; only open external/ if iter-9 critique pointed to a specific evidence weakness.

## Amendment sources (READ ALL of these — this iter is the great fold-in)

| File | What it contributes |
|---|---|
| `research/research.md` | v1 to amend |
| `research/findings-registry.json` | v1 registry |
| `research/recommendations.md` | v1 recs |
| `research/cross-phase-matrix.md` | v1 matrix (DO NOT recreate; reference) |
| `research/iterations/iteration-9-skeptical-review.md` | 8 MUST-FIX + 10 SHOULD-FIX + 4 NICE-TO-FIX |
| `research/iterations/gap-reattempt-iter-10.json` | 4 new closures + 4 tightened partials + 2 UNKNOWN-confirmed |
| `research/iterations/citation-audit-iter-11.json` | 6 broken `phase-N/...` literal-path citations to fix |
| `research/iterations/combo-stress-test-iter-12.md` | Combo 1 weakened / Combo 2 survives / Combo 3 FALSIFIED |
| `research/iterations/public-infrastructure-iter-13.md` | 11 hidden prereqs + 8 Public moats |
| `research/iterations/cost-reality-iter-14.md` | 5 under-sized + 1 over-sized + 2 speculative effort corrections |
| `research/iterations/cross-phase-patterns-iter-15.md` | 4 new patterns (precision laundering, seam-early validation, freshness-authority debt, contract-seam cost concentration) |
| `research/iterations/counter-evidence-iter-16.md` | keep 5 / downgrade 4 / replace R10; specific reframings |

---

## Iteration 17 mission: Fold all amendments into a v2 re-render

### Output 1 — `research/research-v2.md`

Same 11 sections as v1 (charter §4.1), but:
- Section 1 (Executive summary): tighten with iter-9 fixes and add 1-2 bullets reflecting the rigor lane discoveries (specifically: that iter-12 falsified one combo, iter-13 found 11 hidden prereqs, iter-14 reality-checked S/M/L)
- Section 5.6 (Q-F killer combos): mark Combo 3 as FALSIFIED; reframe Combo 1 with the freshness/lossiness caveat; keep Combo 2 unchanged
- Section 6 (gap closure log): update with iter-10 closures; show new statuses
- Section 7 (composition risk): add the iter-13 hidden-prereqs lens
- Section 8 (adoption roadmap): apply iter-14 effort corrections; re-tier P0/P1 if needed
- Section 10 (killer combos): drop Combo 3 from "top combos", add it as "considered but rejected", surface a replacement combo if iter-13/15/16 evidence supports one
- Section 11 (confidence + open questions): downgrade overall confidence to reflect rigor-lane findings; list the 2 UNKNOWN-confirmed
- **NEW Section 12 (added at end before appendices): "New cross-phase patterns surfaced after iter-8"** — embed iter-15's 4 patterns
- **NEW Section 13 (added at end before appendices): "Public's moats and hidden prerequisites"** — embed iter-13's 8 moats and 11 missing prereqs
- Citation grammar: use **literal `00N-folder/`** paths everywhere, NOT `phase-N/`
- Add a v1→v2 changelog at the very top

Target word count: 8,000-12,000 words (longer than v1's 6,015 because of new sections + amendments).

### Output 2 — `research/findings-registry-v2.json`

Same schema as v1. But:
- Remove findings whose evidence was `broken` and not fixable
- Update findings whose status changed (iter-10 closures)
- Add new findings for iter-15 patterns (tagged `new-cross-phase`)
- Add new findings for iter-13 moats and missing prereqs
- Update composition_risk and effort fields with iter-14 corrections
- Fix citation grammar (literal `00N-folder/` paths)

Target: 80-120 findings (up from 65).

### Output 3 — `research/recommendations-v2.md`

Same format as v1. But:
- **Apply iter-16 verdicts:**
  - KEEP: R1, R4, R5, R6, R9 (with iter-16's reframings)
  - DOWNGRADE: R2, R3, R7, R8 (lower scores + add caveats)
  - REPLACE: R10 → new "trust-axis / freshness contract" recommendation per iter-16 guidance
- Apply iter-14 effort corrections (S/M/L)
- Re-rank if iter-16 verdicts shift priorities
- Update finding-ID references to point to v2 registry

Target: 10 recommendations (same count, different rankings/contents).

### Output 4 — `research/iterations/iteration-17.md` (≤500 lines)

```markdown
# Iteration 17 — V2 Assembly

## Method
- Read v1 + 8 amendment iters (9-16)
- Folded each iter's findings into the appropriate section of v2

## V1 → V2 changelog (high-level)
| File | Change | Source iter |
| research-v2.md | Combo 3 dropped, marked FALSIFIED | iter-12 |
| research-v2.md | New §12 cross-phase patterns | iter-15 |
| research-v2.md | New §13 Public moats + hidden prereqs | iter-13 |
| research-v2.md | Section 11 confidence downgraded | iter-9, iter-12 |
| recommendations-v2.md | R10 replaced with trust-axis contract | iter-16 |
| recommendations-v2.md | R2/R3/R7/R8 downgraded | iter-16 |
| recommendations-v2.md | Effort corrections applied | iter-14 |
| findings-registry-v2.json | 6 broken citations removed | iter-11 |
| findings-registry-v2.json | 4 new patterns added as findings | iter-15 |
| findings-registry-v2.json | 8 moats added as findings | iter-13 |
| findings-registry-v2.json | 11 hidden prereqs added as findings | iter-13 |

## Validation results
| Check | Result |
| research-v2.md sections present | 13/13 (added §12, §13) |
| Every claim cited | yes (count) |
| findings-registry-v2.json parses | yes/no |
| findings-registry-v2.json count | <int> |
| recommendations-v2.md count | 10 |
| Citation grammar (literal paths) | yes/no |

## Word counts
- research-v2.md: <int>
- recommendations-v2.md: <int>
- findings-registry-v2.json: <int> findings

## Surprises
- ≤4 bullets

## Handoff to iter-18 (final validation + memory v2)
- iter-18 must validate all 3 v2 deliverables
- iter-18 must save memory v2 with the v2 conclusions
```

### Output 5 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":17,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"v2_assembly","files_assembled":3,"research_v2_words":<int>,"findings_v2_count":<int>,"recommendations_v2_count":10,"sections_added":2,"citations_fixed":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_17_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_17_COMPLETE research_v2_words=<int> findings_v2=<int> recommendations_v2=10 v1_v2_diff=<short>
```

---

## Constraints

- **LEAF-only**
- **DO NOT modify v1 deliverables** (research.md, findings-registry.json, recommendations.md, cross-phase-matrix.md). v2 lives alongside.
- DO NOT modify any iter-1 to iter-16 outputs
- v2 deliverables in `research/` ROOT (not iterations/)
- Per-iter report in `research/iterations/iteration-17.md`
- Use **literal `00N-folder/`** paths in all citations (NOT `phase-N/`)
- Every claim must trace to a `[SOURCE: ...]` citation
- v2 must be self-contained — readers should be able to use v2 alone, not both v1 and v2
- The v1→v2 changelog at the top of research-v2.md should be the FIRST thing readers see
- When folding iter-9 critiques, address EVERY MUST-FIX item
- When folding iter-11 broken citations, fix or remove the broken evidence pointers
- Combo 3 must be marked FALSIFIED in v2 (iter-12 verdict); don't soften this
- R10 must be REPLACED in v2 (iter-16 verdict)
- New sections §12 and §13 should each be 500-1500 words

## When done

Exit. iter-18 (final validation + memory save v2) is next — do NOT start it.
