# Deep Review Strategy: Template v2.2 + validator ruleset joint audit (SSK-DR-1)

Review Target: `.opencode/skill/system-spec-kit/templates/level_{1,2,3}/` (CORE + ADDENDUM) × `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` strict-mode rules.

## Dimensions

- correctness (does template produce valid output the validator accepts?)
- contracts (do templates expose fields the validator expects?)
- documentation (are rule semantics documented in rule-ids, anchors, and error messages?)
- maintainability (can the coverage matrix survive future template edits?)

## Non-Goals

- Editing templates or validator during review (findings only)
- Proposing new validator rules unsupported by evidence
- Re-architecting template numbering schemes

## Stop Conditions

- Converges via severity-weighted newFindingsRatio < 0.05 (rolling avg)
- Maximum 12 iterations reached
- Coverage matrix + finding classifications + ranked proposals written to `review-report.md`

## Key Questions
<!-- REDUCER_ANCHOR:key-questions -->

- [ ] What fields and anchors does each level template (CORE + ADDENDUM) expose?
- [ ] What rules does strict-mode validator enforce? What files do they target?
- [ ] What is the rule × field coverage matrix?
- [ ] Which rules are orphan (enforce nothing templates produce)?
- [ ] Which fields are orphan (no rule enforces them)?
- [ ] Which coverage overlaps (duplicate rules for same invariant)?
- [ ] Which invariants are unenforced but should be?
- [ ] Which proposed changes rank highest by affected-packet count × noise reduction?
<!-- /REDUCER_ANCHOR:key-questions -->

## Answered Questions
<!-- REDUCER_ANCHOR:answered-questions -->
- Iteration 4 ranked the existing remediation proposals by packet coverage and estimated audit-noise reduction. Highest payoff comes from shared-frontmatter semantic validation and from separating operational-only rules from template-coverage reporting.
<!-- /REDUCER_ANCHOR:answered-questions -->

## Known Context

- Template v2.2 uses CORE + ADDENDUM split (per phase 018 R4 research).
- Validator strict mode includes rules listed in the dispatch topic.
- Prior 015 findings flagged inconsistencies between validator rule names and template field names.
- GRAPH_METADATA_PRESENT is the most frequent warning on new sub-packets.

## Next Focus
<!-- REDUCER_ANCHOR:next-focus -->

Iteration 5: traceability pass. Verify the maintainability ranking against representative packet evidence, especially whether operational/template surface separation and shared-frontmatter validation would suppress the largest warning clusters without hiding real regressions.
<!-- /REDUCER_ANCHOR:next-focus -->

## What Worked
<!-- REDUCER_ANCHOR:what-worked -->
- Using the live dispatcher as the authority before comparing help/README/prompt surfaces kept the taxonomy stable across iterations 2 through 4.
- Packet-type counts plus orphan-rule/orphan-field counts were enough to rank proposals without inventing speculative new rule families.
<!-- /REDUCER_ANCHOR:what-worked -->

## What Failed
<!-- REDUCER_ANCHOR:what-failed -->
- The findings registry never got backfilled during the earlier iterations, which made the packet-local state less useful than the JSONL/delta trail.
<!-- /REDUCER_ANCHOR:what-failed -->

## Exhausted Approaches
<!-- REDUCER_ANCHOR:exhausted-approaches -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:exhausted-approaches -->

## Ruled Out Directions
<!-- REDUCER_ANCHOR:ruled-out-directions -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:ruled-out-directions -->
