# ITERATION 18 — FINAL VALIDATION + V1↔V2 DIFF REPORT (last iter)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 18 of 18 max** — the final iter. Memory save will be done by Claude orchestrator after this.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

iter-17 produced v2 deliverables. This iter validates them rigorously and produces a **comprehensive v1↔v2 diff report** so the user can see exactly what changed and why. After this, the rigor lane is complete.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set. No external reads needed (validation-only).

## Files to validate

### v1 (read-only, baseline)
- `research/research.md`
- `research/findings-registry.json`
- `research/recommendations.md`
- `research/cross-phase-matrix.md`

### v2 (produced in iter-17, validate these)
- `research/research-v2.md`
- `research/findings-registry-v2.json`
- `research/recommendations-v2.md`

### Amendment sources (already-applied)
- `research/iterations/iteration-9-skeptical-review.md`
- `research/iterations/gap-reattempt-iter-10.json`
- `research/iterations/citation-audit-iter-11.json`
- `research/iterations/combo-stress-test-iter-12.md`
- `research/iterations/public-infrastructure-iter-13.md`
- `research/iterations/cost-reality-iter-14.md`
- `research/iterations/cross-phase-patterns-iter-15.md`
- `research/iterations/counter-evidence-iter-16.md`

---

## Iteration 18 mission

### Part A — Validate v2

For each v2 file, run these checks:

| File | Checks |
|---|---|
| `research-v2.md` | (1) 13/13 sections present (1-11 + 12-13 new) (2) `[SOURCE: ...]` count ≥ v1's 125 (3) Word count between 8,000 and 12,000 (4) NO `phase-N/` literal-path citations (5) Combo 3 marked FALSIFIED (6) §12 has the 4 patterns from iter-15 (7) §13 has the 8 moats + 11 prereqs from iter-13 (8) v1→v2 changelog at top |
| `findings-registry-v2.json` | (1) JSON parses (run `jq -e .` mentally or via cat) (2) 80-120 findings (3) Every finding has `evidence` array with at least 1 entry (4) No broken `phase-N/` paths in any evidence pointer (5) New `tag: "new-cross-phase"` count matches iter-15 patterns + iter-13 prereqs |
| `recommendations-v2.md` | (1) Exactly 10 recs (2) Each has Rank, Score, Rationale, Evidence, Depends-on, Effort, Acceptance criterion (3) R10 is the iter-16-replaced trust-axis/freshness contract rec (4) R2/R3/R7/R8 scores are LOWER than v1 (5) R1/R4/R5/R6/R9 scores ≈ v1 (or higher) (6) Every Evidence pointer is in `findings-registry-v2.json` |

For each check, mark `pass` or `fail`. Failures block the iteration.

### Part B — Build comprehensive v1↔v2 diff report

This is the headline output. The user needs to see exactly what changed.

Categories to enumerate:

1. **Findings added** (in v2, not in v1) — count + top 10 by impact
2. **Findings removed** (in v1, not in v2) — count + reasons (broken citation? superseded? falsified?)
3. **Findings amended** (same ID, different content) — count + top 10 with before/after
4. **Recommendations: rank changes** — table showing v1 rank → v2 rank for all 10
5. **Recommendations: content changes** — for KEEP recs, what wording amended; for DOWNGRADE, what caveats added; for REPLACE, full before/after
6. **Sections added** — §12 + §13 with brief content summary
7. **Sections amended** — which sections of research.md changed and why (cite source iter)
8. **Composite score trajectory** — iter-by-iter from 0.17 → 0.94 → 0.62 → ... → final
9. **Falsifications** — Combo 3 details, R10 replacement, any other reversals
10. **Confirmations** — what iter-9 critique tried to break but couldn't (rec stayed = signal of strength)

---

## Output 1 — `research/iterations/v1-v2-diff-iter-18.md`

```markdown
# Iteration 18 — V1↔V2 Diff Report (final iter)

> Comprehensive change log of what the rigor lane (iters 9-16) and v2 assembly (iter-17) produced.

## TL;DR (≤8 bullets)
- Top 3 most important deltas
- Composite trajectory (one line)
- What v2 reader should know first

## Validation results

### research-v2.md
| Check | Result |
| 13 sections present | pass/fail |
| Citation count ≥ 125 | pass (count: <int>) |
| Word count 8000-12000 | pass (count: <int>) |
| No phase-N/ literal paths | pass/fail |
| Combo 3 marked FALSIFIED | pass/fail |
| §12 has 4 patterns | pass/fail |
| §13 has 8 moats + 11 prereqs | pass/fail |
| v1→v2 changelog at top | pass/fail |

### findings-registry-v2.json
| Check | Result |
| Parses | pass/fail |
| Count 80-120 | pass (<int>) |
| All have evidence | pass/fail |
| No broken paths | pass/fail |
| new-cross-phase count matches | pass/fail |

### recommendations-v2.md
| Check | Result |
| 10 recs | pass/fail |
| All fields present | pass/fail |
| R10 = iter-16 replacement | pass/fail |
| R2/R3/R7/R8 downgraded | pass/fail |
| R1/R4/R5/R6/R9 kept | pass/fail |
| All evidence in registry | pass/fail |

## Findings delta

### Added in v2 (from iter-15 patterns + iter-13 moats/prereqs)
| Finding ID | Tag | Title | Source iter |
| F-CROSS-066 | new-cross-phase | Precision laundering | iter-15 |
| ... |

**Total added:** <int>

### Removed in v2 (broken citations / superseded)
| v1 ID | Reason removed | Source iter |
| ... |

**Total removed:** <int>

### Amended in v2 (same ID, different content)
| ID | What changed | Source iter |
| ... |

**Total amended:** <int>

## Recommendations delta

### Rank changes
| Rec | v1 rank | v2 rank | Change | Verdict |
| R1  | 1 | 1 | — | KEEP |
| R2  | 2 | <new> | <delta> | DOWNGRADE |
| ... |

### Content changes per rec
- **R1 (KEEP):** wording change: "..." Reason: ...
- **R2 (DOWNGRADE):** new caveat: "..." Reason: iter-16 counter-arg ...
- ...
- **R10 (REPLACE):** old: "..." new: "..." Reason: Combo 3 falsified

## Sections added/changed in research.md → research-v2.md

| v2 section | Status | Source iter |
| §1 Executive summary | amended | iter-9, iter-12, iter-13, iter-14 |
| §5.6 Q-F killer combos | amended (Combo 3 falsified) | iter-12 |
| §6 Gap closure log | amended (iter-10 closures) | iter-10 |
| §7 Composition risk | amended (hidden prereqs lens) | iter-13 |
| §8 Adoption roadmap | amended (effort corrections) | iter-14 |
| §10 Killer combos | amended (Combo 3 dropped, replacement?) | iter-12 |
| §11 Confidence + open questions | amended (downgraded) | iter-9, iter-12 |
| §12 NEW: Cross-phase patterns | added | iter-15 |
| §13 NEW: Public moats + hidden prereqs | added | iter-13 |

## Composite score trajectory

| Iter | Mission | Composite | NewInfoRatio | Direction |
| 1 | Inventory | 0.17 | 1.00 | baseline |
| 2 | Gap closure 1+2 | 0.64 | 0.42 | ↑ |
| 3 | Gap closure 3+4+5 | 0.81 | 0.31 | ↑ |
| 4 | Q-B Capability matrix | 0.84 | 0.27 | ↑ |
| 5 | Q-A Token honesty | 0.88 | 0.24 | ↑ |
| 6 | Q-E + Q-C | 0.91 | 0.21 | ↑ |
| 7 | Q-D + Q-F | 0.94 | 0.13 | ↑ |
| 8 | Final assembly v1 | 0.94 | 0.00 | converged |
| 9 | Skeptical review | 0.62 | 0.18 | ↓↓ (honest) |
| 10 | Gap re-attempt | 0.78 | 0.40 | ↑ |
| 11 | Citation audit | 0.80 | 0.30 | ↑ |
| 12 | Combo stress-test | 0.67 | 0.34 | ↓ (Combo 3 falsified) |
| 13 | Public infra inventory | 0.82 | 0.58 | ↑↑ |
| 14 | Cost reality check | 0.81 | 0.38 | ≈ |
| 15 | Pattern hunt | 0.79 | 0.33 | ≈ |
| 16 | Counter-evidence | 0.78 | 0.27 | ≈ |
| 17 | V2 assembly | 0.83 | 0.29 | ↑ |
| 18 | This iter | <final> | <final> | final |

## Falsifications (rare and significant)

- **Combo 3** (q-f-killer-combos.md): iter-12 stress-test found incompatible confidence semantics. iter-17 dropped from "top combos", added to "considered but rejected"
- **R10**: replaced (iter-16 fatal counter)
- (any others?)

## Confirmations (recs that survived adversarial review)

- **R1** (token-measurement rule): iter-16 found NO defensible counter; rec stays at 10/10
- **R5** (graph payload validation): iter-12 stress-test couldn't break it; iter-16 marked KEEP
- ...

## Open questions remaining (UNKNOWN-confirmed from iter-10)

| Gap ID | Original UNKNOWN | iter-10 verdict | Reason |
| ... |

## Final verdict

Is v2 the production deliverable Public should use? <yes | with-caveats | no>

≤300-word justification.
```

---

## Output 2 — `research/iterations/iteration-18.md` (≤300 lines)

```markdown
# Iteration 18 — Final validation + diff report

## Method
- Validated v2 deliverables against checklist
- Built comprehensive v1↔v2 diff

## Validation summary
| File | Pass | Fail |

## Diff summary
- Findings: +<n> / -<n> / amended <n>
- Recommendations: <verdict counts>
- Sections: +<n> new
- Falsifications: <count>

## Next step
Memory save v2 to be done by Claude orchestrator (not codex).
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":18,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"final_validation_and_diff","v2_validation":"pass | fail","findings_added":<int>,"findings_removed":<int>,"findings_amended":<int>,"recommendations_keep":<int>,"recommendations_downgrade":<int>,"recommendations_replace":<int>,"falsifications":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_18_done_rigor_lane_complete","next_iteration_ready":false,"notes":"<≤200 chars>"}
```

Also append a `convergence_v2` event:

```json
{"event":"convergence_v2","timestamp":"<ISO-8601-UTC>","total_iterations":18,"v1_iterations":8,"rigor_lane_iterations":10,"v1_v2_diff_summary":"<short>","final_composite":<float>,"deliverables_v1":["research.md","findings-registry.json","recommendations.md","cross-phase-matrix.md"],"deliverables_v2":["research-v2.md","findings-registry-v2.json","recommendations-v2.md"],"notes":"Rigor lane complete; v2 strengthens v1 with iter-9..16 amendments."}
```

---

## Final stdout line (mandatory)

```
ITERATION_18_COMPLETE validation=<pass|fail> findings_delta=+<n>/-<n>/~<n> falsifications=<n> RIGOR_LANE_COMPLETE=true
```

---

## Constraints

- **LEAF-only**
- DO NOT modify any file (validation-only)
- DO NOT save memory (Claude orchestrator does that)
- Use literal `00N-folder/` paths in citations (validation should detect any v2 violations)
- If v2 fails validation, list the specific failures — don't soften

## When done

Exit. Claude orchestrator will:
1. Read iter-18's validation + diff report
2. Update strategy + dashboard with `rigor_lane_complete`
3. Save memory v2 via `generate-context.js`
4. Final summary to user
