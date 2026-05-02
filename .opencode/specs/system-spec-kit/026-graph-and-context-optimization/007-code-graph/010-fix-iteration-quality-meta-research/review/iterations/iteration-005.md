## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:80-90`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:223-233`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:438-448`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-code-review/references/review_core.md:76-99`
- `.opencode/skill/sk-deep-review/references/convergence.md:80-104`
- `.opencode/skill/sk-deep-review/references/convergence.md:380-425`
- `.opencode/command/spec_kit/plan.md:13-21`
- `.opencode/command/spec_kit/plan.md:120-151`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:520-568`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:570-617`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1036-1082`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1058-1085`
- `.opencode/agent/deep-review.md:145-184`
- `.opencode/skill/sk-deep-review/references/state_format.md:170-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Planning Packet fix-completeness fields remain report-only before `/spec_kit:plan`.** R5 classification: `cross-consumer`. A sample R4 finding can now carry `findingClass` and `scopeProof` in the code-review schema (`sk-code-review/SKILL.md:288-320`; `review_core.md:76-99`). R7's synthesis contract requires a Planning Packet containing `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired`, and its active registry asks for `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints` (`spec_kit_deep-review_auto.yaml:1047-1055`; `spec_kit_deep-review_confirm.yaml:1069-1077`). R3's planner, however, only says to "Generate Affected Surfaces table for fix_bug/remediation packets" and score affected-surface coverage (`spec_kit_plan_auto.yaml:554-568`; `spec_kit_plan_confirm.yaml:603-617`); it does not name or consume `affectedSurfacesSeed`, `findingClasses`, `fixCompletenessRequired`, `scopeProof`, or `scopeProofNeeded`. End-to-end result: the review report can emit the new fields, but the follow-on planner has no explicit import/mapping step that guarantees those fields populate the FIX ADDENDUM table.

   Scope proof: same-class producer inventory with `rg -n 'affectedSurfacesSeed' .opencode` found only the deep-review synthesis contract and prior review/research artifacts, not a planner consumer; `rg -n 'findingClasses' .opencode` and `rg -n 'fixCompletenessRequired' .opencode` showed the same pattern. Cross-consumer inventory with `rg -n 'scopeProofNeeded|scopeProof|findingClass|affectedSurfaceHints' .opencode/command/spec_kit` found the deep-review synthesis contract but no `/spec_kit:plan` consumer. Matrix check: R1's FIX ADDENDUM is present in all four plan template levels and R2's CHK-FIX gates are present in L2/L3/L3+, so the gap is not missing template rows; it is the R7-to-R3 handoff.

### P2

None.

R5 dogfood notes: this is not eligible for the instance-only opt-out because it is a cross-consumer contract path spanning review output, deep-review synthesis, planner YAML, and plan templates. The same-class producer and consumer inventories above were required. R6's security-sensitive STOP gate is stricter (`fixCompletenessReplay` requires producer/consumer/matrix coverage), but it does not repair the report-to-plan mapping gap.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

FAIL — The central R4 -> R7 -> R3 correctness link is still broken: Planning Packet fields are emitted by deep-review synthesis but are not explicitly consumed by `/spec_kit:plan` when generating Affected Surfaces.

## Confidence — 0.0-1.0

0.90
