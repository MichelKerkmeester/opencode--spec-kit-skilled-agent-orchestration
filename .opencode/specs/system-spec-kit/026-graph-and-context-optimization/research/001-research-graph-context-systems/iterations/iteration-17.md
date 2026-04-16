# Iteration 17 — V2 Assembly

## Method
- Read v1 plus amendment iters 9-16
- Folded each iter's findings into the appropriate section of v2
- Re-rendered `research-v2.md` as the source-of-truth narrative, then aligned the registry and recommendations to it
- Fixed literal-path citation grammar so v2 uses `00N-folder/` paths instead of `phase-N/`

## V1 -> V2 changelog (high-level)
| File | Change | Source iter |
|---|---|---|
| `research-v2.md` | Combo 3 dropped from survivors and marked FALSIFIED | iter-12 |
| `research-v2.md` | Combo 1 reframed as a conditional bundle with freshness/lossiness caveats | iter-12, iter-16 |
| `research-v2.md` | Section 6 statuses updated with 4 closures, 4 tightened partials, 2 UNKNOWN-confirmed | iter-10 |
| `research-v2.md` | New §12 on cross-phase patterns | iter-15 |
| `research-v2.md` | New §13 on Public moats and hidden prerequisites | iter-13 |
| `research-v2.md` | Section 11 confidence downgraded and UNKNOWN classes clarified | iter-9, iter-10, iter-12 |
| `recommendations-v2.md` | R10 replaced with trust-axis / freshness-authority contract | iter-16 |
| `recommendations-v2.md` | R2, R3, R7, and R8 downgraded; R1, R4, R5, R6, and R9 kept with reframing | iter-16 |
| `recommendations-v2.md` | Effort corrections applied to wording and ordering | iter-14 |
| `findings-registry-v2.json` | Broken `phase-N/` citations normalized to literal folder paths | iter-11 |
| `findings-registry-v2.json` | Added 4 pattern findings, 8 moat findings, and 11 hidden-prerequisite findings | iter-13, iter-15 |
| `findings-registry-v2.json` | Added effort field and updated risk/effort on corrected candidate lanes | iter-14 |

## Validation results
| Check | Result |
|---|---|
| `research-v2.md` sections present | 13/13 |
| Every claim cited | yes (`229` `[SOURCE: ...]` markers in `research-v2.md`) |
| `findings-registry-v2.json` parses | yes |
| `findings-registry-v2.json` count | 88 |
| `recommendations-v2.md` count | 10 |
| Citation grammar (literal paths, no `phase-N/`) | yes |

## Word counts
- `research-v2.md`: 8576
- `recommendations-v2.md`: 1185
- `findings-registry-v2.json`: 88 findings

## Surprises
- The strongest v2 change was not a new recommendation but the reframing from “missing substrate” to “missing seam contracts.”
- Combo 3 did not merely weaken under stress; its trust-vocabulary premise broke cleanly enough to require replacement rather than caveating.
- Iter-13 made several v1 “adoption” ideas look more like substrate-ready hardening over already-shipped Public behavior.
- The recommendation IDs had to stay tied to v1 semantics even though the ranking order changed materially.

## Handoff to iter-18 (final validation + memory v2)
- Iter-18 must validate all 3 v2 deliverables again, including spot-checking recommendation IDs against registry IDs.
- Iter-18 should re-check `research-v2.md` and `findings-registry-v2.json` for any residual wording drift after this assembly pass.
- Iter-18 must save memory v2 using the v2 conclusions, not the superseded v1 combo/recommendation framing.
