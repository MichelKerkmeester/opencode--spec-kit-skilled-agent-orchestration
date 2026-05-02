## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-23` - R5 classification classes for cross-consumer and matrix/evidence fixes.
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-71` - R5 required producer, consumer, matrix, and hostile-state inventories.
- `.opencode/skill/sk-code-review/SKILL.md:319-322` - Review output producer schema includes `findingClass`, `scopeProof`, and `affectedSurfaceHints`.
- `.opencode/skill/sk-code-review/references/review_core.md:75-100` - Finding schema producer defines `affectedSurfaceHints` and shows the markdown output form.
- `.claude/skills/sk-code-review/SKILL.md:321` - Same-class runtime mirror includes `affectedSurfaceHints`.
- `.claude/skills/sk-code-review/references/review_core.md:88` - Same-class runtime mirror includes the finding-schema row.
- `.opencode/agent/deep-review.md:179` - Deep-review producer requires every actionable finding to include `affectedSurfaceHints`.
- `.opencode/agent/deep-review.md:211` - Deep-review JSONL consumer/producer contract includes `affectedSurfaceHints` inside `findingDetails`.
- `.opencode/skill/sk-deep-review/SKILL.md:425` - Skill-level deep-review state rule requires per-finding `affectedSurfaceHints`.
- `.opencode/skill/sk-deep-review/references/state_format.md:197` - State-format example carries `affectedSurfaceHints`.
- `.opencode/skill/sk-deep-review/references/state_format.md:219` - State-format required-field table names `affectedSurfaceHints`.
- `.opencode/skill/sk-deep-review/references/state_format.md:452` - State-format validation note requires each active item to include `affectedSurfaceHints`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1050-1055` - Auto deep-review synthesis builds Planning Packet findings with `affectedSurfaceHints`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1077` - Confirm deep-review synthesis builds Planning Packet findings with `affectedSurfaceHints`.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:218-220` - Auto plan imports `activeFindings[].affectedSurfaceHints` and treats imported values as inert review data.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:576` - Auto plan writing rule maps `activeFindings[].affectedSurfaceHints` into the FIX ADDENDUM.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:224-226` - Confirm plan imports `activeFindings[].affectedSurfaceHints` and treats imported values as inert review data.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:625` - Confirm plan writing rule maps `activeFindings[].affectedSurfaceHints` into the FIX ADDENDUM.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/checklist.md:81-84` - Packet checklist claims same-class producer, consumer, matrix, and inert-data invariant coverage.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/decision-record.md:52-60` - ADR records the `affectedSurfaceHints` flow into `/spec_kit:plan` and the inert-data boundary.

R5 classification: the suspected gap is `cross-consumer` plus `matrix/evidence`, not instance-only, because `affectedSurfaceHints` is a review finding field produced by schema guidance, serialized through deep-review state/Planning Packet output, and consumed by `/spec_kit:plan` remediation scaffolds.

Same-class producer inventory: `rg -n "affectedSurfaceHints" .opencode/skill/sk-code-review .claude/skills/sk-code-review` found all same-class schema producers updated: `.opencode/skill/sk-code-review/SKILL.md:321`, `.opencode/skill/sk-code-review/references/review_core.md:88`, `.claude/skills/sk-code-review/SKILL.md:321`, and `.claude/skills/sk-code-review/references/review_core.md:88`.

Cross-consumer flow: `affectedSurfaceHints` flows from review schema guidance to deep-review iteration/state requirements, then to deep-review auto/confirm Planning Packet synthesis, then to plan auto/confirm FIX ADDENDUM imports and writing rules. The plan consumers also retain the inert-data boundary for imported review strings.

Matrix completeness: coverage spans both review schema producer copies, the LEAF deep-review agent, sk-deep-review state docs, deep-review auto/confirm synthesis, and plan auto/confirm consumers. The 010 checklist's producer, consumer, matrix, and invariant claims are supported for this field.

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Verdict — PASS

PASS — `affectedSurfaceHints` follows R5 fix-completeness for maintainability: same-class producers are updated, downstream consumers are wired across both auto/confirm matrices, and no new maintainability finding was found for this field.
