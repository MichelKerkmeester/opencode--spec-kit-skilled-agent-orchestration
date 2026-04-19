# Iteration 9 — Per-iter report

## Method
- Read: `research.md`, `findings-registry.json`, `recommendations.md`, `cross-phase-matrix.md`
- Adversarial reading mode
- Checked cross-file consistency against existing iter-4 to iter-7 synthesis artifacts only where needed to test ranking, dependency, and schema claims

## Critique counts
| Category | Count |
|---|---:|
| MUST-FIX | 8 |
| SHOULD-FIX | 10 |
| NICE-TO-FIX | 4 |

## Top 5 critical findings
- `research.md:169` is factually wrong: the packet says both remaining UNKNOWNs are measurement gaps, but `G1.Q8` is an evidence-granularity gap.
- `cross-phase-matrix.md` scores CodeSight, Graphify, and Claudest as full `2` on license compatibility, while `research.md` Q-E says all three remain `mixed`.
- `findings-registry.json` misclassifies `F-CROSS-005` and `F-CROSS-026`: both are tagged `new-cross-phase` but still use numeric `source_phase`.
- `recommendations.md:R4` omits the scaffold dependency that the roadmap itself requires for the graph-first hook.
- `recommendations.md:R10` omits the overlay-packaging prerequisite even though its cited static-artifact finding depends on it.

## Handoff to iter-10
- Iter-10 is still the gap re-attempt lane for the 2 `UNKNOWN` + 8 `partial` gaps.
- This iter-9 critique suggests one status sentence in v1 is wrong, but it does not itself reclassify any gap.
- The main caution for iter-10 is semantic, not evidentiary: do not treat `G1.Q8` as a "measurement gap" in future wording unless new per-chain examples actually appear.
