# Iteration 18 — Final validation + diff report

## Method
- Validated `research-v2.md`, `findings-registry-v2.json`, and `recommendations-v2.md` against the iteration-18 checklist.
- Built a comprehensive v1↔v2 diff across findings, recommendations, sections, composite trajectory, falsifications, and surviving confirmations.

## Validation summary
| File | Pass | Fail |
|---|---:|---:|
| `research-v2.md` | 8 | 0 |
| `findings-registry-v2.json` | 4 | 1 |
| `recommendations-v2.md` | 6 | 0 |

## Validation detail
- `research-v2.md`: pass. `13` core sections present, `229` citations, `8698` words, no `phase-N/` literals, Combo 3 is `FALSIFIED`, §12 has `4` patterns, and §13 has `8` moats plus `11` prerequisites.
- `findings-registry-v2.json`: fail. JSON parses, count is `88`, all findings have evidence, and no broken literal paths remain, but `tag: "new-cross-phase"` is over-assigned: `31` total tags and `23` newly added tags versus the requested iter-15 patterns + iter-13 prerequisites target of `15`.
- `recommendations-v2.md`: pass. Exactly `10` recs, all required fields present, `R10` is the iter-16 replacement, `R2/R3/R7/R8` are downgraded, `R1/R4/R5/R6/R9` are kept, and every evidence ID resolves in `findings-registry-v2.json`.

## Diff summary
- Findings: `+23 / -0 / amended 65`
- Recommendations: `5 keep / 4 downgrade / 1 replace`
- Sections: `+2` new core sections (`§12`, `§13`) plus `2` appendices
- Falsifications: `2` significant reversals (`Combo 3`, old `R10`)

## Outputs
- Detailed report written to `research/iterations/v1-v2-diff-iter-18.md`
- Iteration summary written to `research/iterations/iteration-18.md`
- `deep-research-state.jsonl` appended with `iteration_complete` and `convergence_v2` events

## Next step
Memory save v2 to be done by Claude orchestrator (not codex).
