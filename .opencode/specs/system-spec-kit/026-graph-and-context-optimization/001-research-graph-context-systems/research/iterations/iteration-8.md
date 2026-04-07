# Iteration 8 — Final assembly

## Method
- Inputs: `research/cross-phase-matrix.md`, `research/iterations/q-a-token-honesty.md`, `research/iterations/q-c-composition-risk.md`, `research/iterations/q-e-license-runtime.md`, `research/iterations/q-d-adoption-sequencing.md`, `research/iterations/q-f-killer-combos.md`, `research/iterations/gap-closure-phases-1-2.json`, `research/iterations/gap-closure-phases-3-4-5.json`, `research/phase-1-inventory.json`, `research/deep-research-state.jsonl`, `research/deep-research-dashboard.md`
- Approach: synthesis-only; no new external reads

## Validation results
| Check | Result |
|---|---|
| research.md sections present | 11/11 |
| Every claim cited | yes (125 `[SOURCE:` citations in `research.md`) |
| findings-registry.json parses | yes |
| findings-registry.json count | 65 |
| recommendations.md count | 10 |
| Each recommendation has ≥2 evidence pointers | yes |

## Word counts
- research.md: 6916 words
- recommendations.md: 1456 words
- findings-registry.json: 65 findings

## Surprises
- The final assembly could stay fully synthesis-only; iter-7 really had already produced every analytical building block the charter required.
- The highest-signal recommendations remain mostly Claudest- and Graphify-derived, even though neither system cleared a clean source-portability gate in this checkout.
- The only remaining UNKNOWNs are both measurement questions, not implementation-shape questions.
- The dashboard already carried the packet-level convergence and token summary needed for the final stop decision.

## Convergence assessment (final)
- Composite score: 0.94
- newInfoRatio: 0.00
- Path satisfied: question-coverage
- Total iterations: 8
- Total tokens (across all 8 iters): ~1600000
- Recommended stop: yes
