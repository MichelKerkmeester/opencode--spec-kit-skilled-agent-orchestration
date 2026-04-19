# Iteration 16 — Per-iter report

## Method
- Steel-manned counters for `R1`-`R10` against `research/recommendations.md`.
- Reused iter-9 critique, iter-12 combo stress test, iter-13 Public inventory, iter-14 cost reality, iter-15 pattern surfacing, and the roadmap dependency edges to test whether each recommendation survives the strongest dissent.
- New external reads: 0

## Verdict summary
| Verdict | Count |
|---|---:|
| keep | 5 |
| downgrade | 4 |
| replace | 1 |
| remove | 0 |

## Top 3 counter-arguments by severity
- `R10` is the only fatal hit: Combo 3 already falsified the "trustworthy structural artifacts + overlays" story because provenance, evidence confidence, and freshness are still collapsed or conflicting. [SOURCE: research/iterations/combo-stress-test-iter-12.md:82-116]
- `R8` is a strong weakening case: the warm-start combo can start warm but wrong because summaries are lossy, session choice is heuristic, the hook is narrow, and freshness can diverge across the handoff. [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-44]
- `R2` weakens because Stop summaries are not just a cheap rail; they are cross-surface contract work that can create stale authority unless bootstrap remains the primary recovery owner. [SOURCE: research/iterations/cost-reality-iter-14.md:42-57] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75]

## Handoff to iter-17 (v2 assembly)
- All amendments queued: iter-9 critique + iter-10 closures + iter-11 citation fixes + iter-12 combo verdicts + iter-13 moats/prereqs + iter-14 cost corrections + iter-15 new patterns + iter-16 counter-evidence.
- Iter-17 must produce `research-v2.md`, `findings-registry-v2.json`, and `recommendations-v2.md`.
- Immediate v2 implications: keep `R1`, `R4`, `R5`, `R6`, `R9`; downgrade `R2`, `R3`, `R7`, `R8`; replace `R10` with a prerequisite trust-axis/freshness contract recommendation.
