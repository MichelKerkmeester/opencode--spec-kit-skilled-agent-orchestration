# ITERATION 15 — New cross-phase patterns hunt

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 15 of 18 max**. Rigor lane iter 7 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

Iters 4-7 surfaced 6 cross-phase questions (Q-A through Q-F). But the question set was set BEFORE the gap closures and stress-tests landed. Iters 9-14 surfaced new evidence about what Public already has, what's actually broken in the synthesis, and what costs more than expected. **This iter explicitly hunts for patterns that span 3+ phases that the original question set missed.**

## Prior outputs (READ before starting)

ALL the iter outputs to date — this iter needs the full picture:
- `research/findings-registry.json`
- `research/iterations/q-a-token-honesty.md`
- `research/iterations/q-c-composition-risk.md`
- `research/iterations/q-d-adoption-sequencing.md`
- `research/iterations/q-e-license-runtime.md`
- `research/iterations/q-f-killer-combos.md`
- `research/iterations/iteration-9-skeptical-review.md`
- `research/iterations/gap-reattempt-iter-10.json`
- `research/iterations/citation-audit-iter-11.json`
- `research/iterations/combo-stress-test-iter-12.md`
- `research/iterations/public-infrastructure-iter-13.md`
- `research/iterations/cost-reality-iter-14.md`

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set, `--add-dir .opencode/`. New external reads allowed if needed to verify a pattern.

---

## Iteration 15 mission: Hunt for patterns spanning 3+ phases that Q-A through Q-F missed

### What counts as a "new cross-phase pattern"

A pattern that:
- **Spans at least 3 of the 5 phases** (phases 001-005)
- Was NOT already surfaced in Q-A, Q-B, Q-C, Q-D, Q-E, or Q-F
- Has source-grounded evidence (not just intuition)
- Is **actionable** for Public (gives a specific design direction or measurement insight)

### Anti-patterns (do NOT submit these)

- Restatements of Q-A through Q-F under different framing
- Patterns that only span 2 phases (2-phase patterns are within Q-C/Q-D scope)
- Generalizations without per-phase evidence
- "All systems should X" claims

### How to hunt

Try these search strategies:
1. **Failure-mode patterns**: are there 3+ phases where the same KIND of failure appears (e.g. "all systems that ship a hook get the hook trigger wrong in the same way")?
2. **Producer-consumer asymmetries**: 3+ phases where the producer is overdesigned and the consumer is underdesigned, or vice versa
3. **Implicit type signatures**: 3+ phases where implicit data shapes drift between modules
4. **Test-coverage anti-patterns**: 3+ phases that under-test the same type of thing (e.g. cross-language extraction parity)
5. **Naming/labeling drift**: 3+ phases where labels promise more than the implementation delivers (e.g. "AST" labels covering regex paths)
6. **Trust/observability gaps**: 3+ phases where observability is missing in the same lane (e.g. cache hit rates, queue completion rates)
7. **Configuration sprawl**: 3+ phases where the same configuration concept exists under different names
8. **Synthetic constants**: 3+ phases that hard-code constants for "real" measurements (we already covered this in Q-A but can deepen with iter-13's evidence)

Aim for **3-7 patterns** total. Don't pad. Don't force.

---

## Output 1 — `research/iterations/cross-phase-patterns-iter-15.md`

```markdown
# Iteration 15 — New Cross-Phase Patterns

> Patterns spanning 3+ phases that were NOT surfaced by Q-A through Q-F.

## TL;DR
- ≤6 bullets

## Pattern 1 — <name>

### Span
| Phase | Evidence | Citation |
| 001 | brief | [SOURCE: ...] |
| 002 | ... | ... |
| 003 | ... | ... |

### Why it's not Q-A through Q-F
- (which question came closest, and why it's distinct)

### What it implies for Public
- 1-3 actionable bullets

### Falsification test
- (one-line: what evidence would prove this pattern wrong)

## Pattern 2 — <name>
...

## Pattern N — <name>
...

## Patterns considered but rejected
- (≤5 bullets, with one-line reason each)

## Recommendations for v2

- Which patterns should iter-17 add as new finding-registry entries
- Which patterns should iter-17 add as a new research.md section (e.g. §12 "New cross-phase patterns")
```

---

## Output 2 — `research/iterations/iteration-15.md` (≤200 lines)

```markdown
# Iteration 15 — Per-iter report

## Method
- Cross-iter pattern search across all iter-1..14 outputs
- New external reads: <count>

## Patterns surfaced
| # | Name | Span (phases) | Implication |

## Top 3 by impact
- ...

## Handoff to iter-16
- iter-16 will counter-evidence search for top 10 recommendations
- Patterns surfaced here may inform counter-evidence direction
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":15,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"new_cross_phase_patterns","patterns_surfaced":<int>,"patterns_rejected":<int>,"max_phase_span":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_15_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_15_COMPLETE patterns=<n> rejected=<n> max_span=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables
- Patterns MUST span 3+ phases (no 2-phase patterns)
- Patterns MUST NOT be Q-A/B/C/D/E/F restatements
- Use literal `00N-folder/` paths
- Be willing to find ZERO new patterns and report `patterns=0` if the original 6 questions were exhaustive
- Don't pad: 3-7 patterns is the target, not the floor

## When done

Exit. Do NOT start iter-16.
