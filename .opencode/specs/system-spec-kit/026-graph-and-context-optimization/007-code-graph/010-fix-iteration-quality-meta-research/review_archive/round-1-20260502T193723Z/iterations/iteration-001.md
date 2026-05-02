## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:80-90`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:223-233`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:438-448`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/skill/sk-deep-review/references/convergence.md:381-388`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:214-221`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`
- `.opencode/agent/deep-review.md:146-179`
- `.opencode/agent/deep-review.md:204-224`
- `.opencode/skill/sk-deep-review/references/state_format.md:176-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Planning Packet fields are report-only and do not flow into `/spec_kit:plan`.** The deep-review synthesis contract now requires a `Planning Packet` with `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired`, but the plan command surfaces only add a generic "Generate Affected Surfaces table for fix_bug/remediation packets" activity and do not name or consume those fields. Same-class inventory: `rg -n 'Planning Packet|findingClasses|affectedSurfacesSeed|fixCompletenessRequired|affectedSurfaceHints|scopeProofNeeded|findingClass' .opencode --glob '*.{md,yaml,ts,js,cjs,mjs}'` found the new packet-field requirements in the deep-review synthesis workflow and no matching `/spec_kit:plan` consumer beyond generic affected-surfaces headings. This means a CONDITIONAL/FAIL review report can ask for fix-completeness data, but the follow-on plan flow has no explicit extraction path for the new seed fields. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

2. **The deep-review iteration/state contract does not collect the fields that the final report is required to emit.** R7 requires each active finding in `review-report.md` to include `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints`, but the LEAF agent's finding template only captures title, file:line, description, and claim-adjudication JSON, and the JSONL schema's required/optional fields omit those fix-completeness fields. Cross-consumer impact: synthesis can only infer classes from prose or invent them, so the Planning Packet fields are not grounded in reducer-owned state. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1052-1055`; `.opencode/agent/deep-review.md:146-179`; `.opencode/agent/deep-review.md:204-224`; `.opencode/skill/sk-deep-review/references/state_format.md:190-204`]

3. **The plan command inline scaffold renders only the FIX ADDENDUM heading, not the required body/table/inventories.** R1 correctly adds the full affected-surfaces body to all four manifest plan levels, including the producer/consumer/matrix/invariant inventory prompts; however, the `/spec_kit:plan` YAML inline scaffold used by the command contains only `<!-- ANCHOR:affected-surfaces --> ## FIX ADDENDUM: AFFECTED SURFACES`. Because the plan workflow explicitly says to embed `template_compliance.inline_scaffolds.plan_md`, the command path can produce a bare addendum heading unless the generic activity text is manually expanded. Matrix completeness for R1 passes at the manifest level (4/4 levels present), but cross-consumer rendering is incomplete in the command scaffold. [SOURCE: `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:214-221`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

### P2

None.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

CONDITIONAL — R1/R2/R4/R5/R6/R8 are locally present, but R3/R7 have cross-consumer gaps that can drop or force inference for the new fix-completeness fields in downstream planning and final report synthesis.

## Confidence — 0.0-1.0

0.86
