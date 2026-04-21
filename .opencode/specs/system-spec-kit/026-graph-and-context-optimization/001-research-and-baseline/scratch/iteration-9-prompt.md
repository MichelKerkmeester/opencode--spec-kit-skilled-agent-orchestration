# ITERATION 9 — Skeptical review pass (rigor lane begins)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 9 of 18 max** (extended ceiling). Iter-8 already converged; iters 9-18 are a **rigor + amendment lane** to strengthen the v1 deliverables. **Do NOT modify v1 deliverables.** Iters 9-16 collect evidence for amendments; iter-17 will produce v2.

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout

```
research/
├── deep-research-{config.json, state.jsonl, strategy.md, dashboard.md}  # state (root)
├── phase-1-inventory.json                                                # foundation (root)
├── research.md                                                            # v1 (read; do NOT modify)
├── findings-registry.json                                                 # v1 (read; do NOT modify)
├── recommendations.md                                                     # v1 (read; do NOT modify)
├── cross-phase-matrix.md                                                  # v1 (read; do NOT modify)
├── iterations/
│   ├── iteration-{1..8}.md
│   ├── gap-closure-phases-{1-2,3-4-5}.json
│   ├── q-a-token-honesty.md, q-c-composition-risk.md, q-d-adoption-sequencing.md, q-e-license-runtime.md, q-f-killer-combos.md
│   └── (iter-9 outputs land here)
└── (v2 deliverables — iter-17 will produce these in root: research-v2.md, findings-registry-v2.json, recommendations-v2.md)
```

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. No external reads needed for iter-9 (this is critique-only of internal v1 deliverables).

---

## Iteration 9 mission: Skeptical review of all 4 v1 deliverables

Read **adversarially** as if you were a peer reviewer trying to find weakness:

1. `research/research.md`
2. `research/findings-registry.json`
3. `research/recommendations.md`
4. `research/cross-phase-matrix.md`

For each, identify **specific** weak spots. Be concrete (line numbers, finding IDs, recommendation IDs). Don't generalize.

### Categories of weakness to look for

| Category | What to look for |
|---|---|
| **Weak claims** | Statements that can't be defended from the cited source (citation drift) |
| **Missing citations** | Claims that have no `[SOURCE: ...]` pointer |
| **Internal contradictions** | research.md §X says A, §Y says ¬A (or registry vs research.md disagree) |
| **Overgeneralizations** | "All systems do X" claims that have a counter-example |
| **Unjustified confidence** | High-confidence findings with thin evidence |
| **Stale citation lines** | Cited line ranges that don't actually contain the claim (note: don't verify yet — iter-11 does that. Just FLAG suspicious-looking citations.) |
| **Ranking inversions** | R3 depends on R2 but is ranked higher, etc. |
| **Effort estimate gaps** | S/M/L without concrete justification |
| **UNKNOWN handling** | UNKNOWNs that should be "partial" or vice versa |
| **Missing dependency edges** | recommendations that should depends-on other recs but don't |
| **Q-D phase mis-assignment** | P0 candidates that actually depend on P1 work |
| **Killer-combo composition risk drift** | Combo composition risk doesn't equal max(component risks) |
| **Token-honesty self-application** | research.md / recs / matrix making any unjustified savings claims |

---

## Output 1 — `research/iterations/iteration-9-skeptical-review.md` (the critique)

```markdown
# Iteration 9 — Skeptical Review of v1 Deliverables

> Iter-9 of 18. Critique-only. Does not modify v1 deliverables. Findings here feed iter-17 (v2 re-render).

## TL;DR
- (≤8 bullets: top weaknesses, critical contradictions, must-fix items)

## research.md weaknesses

### Section 1 (Executive summary)
- (line N) [WEAK | CONTRADICTION | OVERREACH | CITATION-DRIFT] Quote: "..." Issue: ... Suggested fix: ...

(repeat per section 1-11; if a section has zero issues, write "No issues found")

## findings-registry.json weaknesses

### Schema-level
- (any structural issues)

### Per-finding (top 30 issues only)
- F-CROSS-NNN (line N): [category] Issue: ... Suggested fix: ...

## recommendations.md weaknesses

### Per-recommendation
- R1: [category | None] Issue: ... Suggested fix: ...
- R2: ...
- ...
- R10: ...

## cross-phase-matrix.md weaknesses

### Score weaknesses
- (capability X, system Y): score = N. Issue: ... (e.g. "scored 2 but cited evidence only proves 1")

### Dominance weaknesses
- (capability X): dominant = Y. Issue: ... (e.g. "tied with Z but Z has stronger evidence")

## Cross-deliverable contradictions

(things research.md says vs registry vs recs vs matrix that don't line up)

## Severity classification

| Severity | Count | Examples |
|---|---|---|
| MUST-FIX (factually wrong / contradiction / missing citation) | <int> | (top 3) |
| SHOULD-FIX (weak claim / overreach / drift) | <int> | (top 3) |
| NICE-TO-FIX (style / clarity / phrasing) | <int> | (top 3) |

## Net assessment

≤300 words on overall v1 quality. Is the v1 packet defensible as-is? What would v2 most need?
```

---

## Output 2 — `research/iterations/iteration-9.md` (≤200 lines, the per-iter report)

```markdown
# Iteration 9 — Per-iter report

## Method
- Read: research.md, findings-registry.json, recommendations.md, cross-phase-matrix.md
- Adversarial reading mode

## Critique counts
| Category | Count |
| MUST-FIX | <int> |
| SHOULD-FIX | <int> |
| NICE-TO-FIX | <int> |

## Top 5 critical findings
- (one line each)

## Handoff to iter-10
- iter-10 will re-attempt the 2 UNKNOWN + 8 PARTIAL gaps; this critique tells iter-10 if any gap status was wrong
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":9,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"skeptical_review","deliverables_reviewed":4,"must_fix":<int>,"should_fix":<int>,"nice_to_fix":<int>,"v1_defensibility":"defensible | needs_v2 | partially_defensible","composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_9_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_9_COMPLETE must_fix=<n> should_fix=<n> nice_to_fix=<n> v1_defensibility=<verdict>
```

---

## Constraints

- **LEAF-only**
- **DO NOT modify v1 deliverables** (research.md, findings-registry.json, recommendations.md, cross-phase-matrix.md)
- DO NOT modify any phase folder, iteration files from iter-1..8, or state files except via append-line
- Per-iter outputs in `research/iterations/`
- Be specific: every critique entry must have a line/finding/rec ID and a quoted phrase
- Don't be polite — be a peer reviewer trying to break the work
- Don't fabricate weaknesses; if a section is solid, say "No issues found"
- Do NOT verify citation accuracy by reading source files (that's iter-11's job; just FLAG suspicious-looking citations)

## When done

Exit. Do NOT start iter-10. Claude orchestrator will dispatch iter-10 (gap re-attempt).
