## Dimension: security

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
- `.opencode/skill/sk-code-review/SKILL.md:315-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:514-548`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-568`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:562-598`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-617`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1038-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1060-1077`
- `.opencode/command/spec_kit/plan.md:320-351`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

None.

### P2

None.

R5 dogfood notes: the suspected path-disclosure/injection concern was classified as `cross-consumer` plus `algorithmic` because it would require a report field or findings artifact to flow into `/spec_kit:plan` and then be rendered into `plan.md`. Same-class producer inventory with `rg -n 'Affected Surfaces|affectedSurfacesSeed|findingClasses|fixCompletenessRequired|findingClass|scopeProof|FIX ADDENDUM' .opencode/command/spec_kit/assets .opencode/skill/sk-code-review .opencode/skill/sk-deep-review .opencode/skill/system-spec-kit/templates/manifest --glob '*.{md,tmpl,yaml,yml}'` found `affectedSurfacesSeed` only in the deep-review synthesis packet contract, while `/spec_kit:plan` adds the static affected-surfaces scaffold, activity label, and confidence scoring but does not name or consume that packet field. Cross-consumer check found no planner parser/import path for a malicious findings file; the plan flow's file-path enumeration comes from context-agent discovery and required `rg` inventories, not from blindly replaying `affectedSurfacesSeed`. Matrix completeness is adequate for this security pass: the addendum asks for same-class producers, consumers, matrix axes, and path/redaction/parser/security invariants, and security-sensitive convergence requires fix-completeness gates before STOP.

Security caveat: context-agent prompts still ask for "Full file paths"; this can expose local absolute paths if an agent chooses absolute rather than repo-relative paths, but that wording was not introduced by the affected-surfaces seed path and is not an exploitable malicious-findings-file echo in the R1-R8 change set reviewed here.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

PASS — No R3 security issue found: affected-surface data is scaffolded and inventoried, but malicious findings-file paths are not consumed by `/spec_kit:plan` or automatically echoed into planner output.

## Confidence — 0.0-1.0

0.86
