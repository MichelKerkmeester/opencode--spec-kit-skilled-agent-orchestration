## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-85`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-state.jsonl:1-4`
- `.opencode/skill/sk-code-review/SKILL.md:281-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-99`
- `.opencode/agent/deep-review.md:172-184`
- `.opencode/agent/deep-review.md:185-211`
- `.opencode/skill/sk-deep-review/references/state_format.md:185-221`
- `.opencode/skill/sk-deep-review/references/state_format.md:448-452`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1036-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1058-1077`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-230`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:570-576`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-237`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:619-625`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/spec.md:109-115`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/plan.md:41-49`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/plan.md:116-122`

## Findings by Severity

### P0

None.

### P1

1. **R4 still cannot provide the affected-surface hints that R7 and R3 now depend on.** R5 classification: `cross-consumer` plus `matrix/evidence`. Cycle 2 fixes the R7 -> R3 handoff: both deep-review synthesis workflows require a Planning Packet with `activeFindings`, `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired`, and both plan workflows now map `activeFindings[].findingClass`, `activeFindings[].scopeProof`, and `activeFindings[].affectedSurfaceHints` into the FIX ADDENDUM before drafting phases. However, the R4 same-class producer inventory is still incomplete: `sk-code-review` findings require `findingClass` and `scopeProof`, but neither the required output contract nor the shared finding schema requires `affectedSurfaceHints`. A sample R4 finding therefore reaches R7 without the field R7 is instructed to use for `affectedSurfacesSeed`; by the R7 contract, missing fields become `UNKNOWN`, so R3 can emit an Affected Surfaces section but cannot populate it from the sample R4 finding's affected surfaces. [SOURCE: `.opencode/skill/sk-code-review/SKILL.md:315-320`; `.opencode/skill/sk-code-review/references/review_core.md:75-99`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-230`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-237`]

   Scope proof: same-class producer inventory for `affectedSurfaceHints` found the field in deep-review agent/state and in R7/R3 workflow contracts, but not in `sk-code-review`'s finding output contract or `review_core.md` schema. Cross-consumer flow check: R4 `findingClass`/`scopeProof` -> R7 Planning Packet works, R7 `affectedSurfaceHints`/`affectedSurfacesSeed` -> R3 Affected Surfaces works, but R4 -> R7 for affected surfaces is still absent. Matrix completeness check covered R4 producer docs, R7 auto/confirm synthesis, R3 auto/confirm planner consumers, and the plan template Affected Surfaces section; the missing row is the R4 producer row for `affectedSurfaceHints`.

   Recommended fix: update `sk-code-review`'s required finding schema/output contract to include `affectedSurfaceHints` for actionable findings, aligned with the deep-review agent/state contract, so R7 can build `affectedSurfacesSeed` from reducer-owned finding details without falling back to `UNKNOWN`.

### P2

None.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

FAIL — R7 -> R3 is now wired and the planner can emit the FIX ADDENDUM, but the R4 producer still omits `affectedSurfaceHints`, so a sample finding does not fully flow end-to-end into populated Affected Surfaces.
