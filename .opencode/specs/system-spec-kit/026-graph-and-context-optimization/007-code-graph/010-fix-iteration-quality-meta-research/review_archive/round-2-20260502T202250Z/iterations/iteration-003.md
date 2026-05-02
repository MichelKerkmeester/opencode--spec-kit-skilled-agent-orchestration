## Dimension: maintainability

## Files Reviewed

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-85`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-87`
- `.opencode/agent/deep-review.md:147-184`
- `.opencode/skill/sk-deep-review/references/state_format.md:185-219`
- `.opencode/skill/sk-deep-review/references/state_format.md:448-452`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:312-323`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-226`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:568-574`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-224`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:617-623`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:70-79`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:187-192`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-state.jsonl:1-3`
- `git diff --name-only` and `git diff --name-status -- .../review`

Applied R5 fix-completeness protocol:

- Classification: the maintainability check is `cross-consumer` plus `matrix/evidence`, because the field contract is produced by `sk-code-review`/`@deep-review`, stored in `findingDetails`, synthesized into the R7 Planning Packet, and consumed by both R3 `/spec_kit:plan` modes and the plan template.
- Same-class producer inventory: `rg -n 'scopeProofNeeded'` across active `sk-code-review`, `sk-deep-review`, deep-review agent, and `/spec_kit:plan` surfaces returned no matches. Live surfaces consistently use `findingClass`, `scopeProof`, `affectedSurfaceHints`, and `findingDetails`.
- Cross-consumer flow: a sample R4 finding with `findingClass` plus `scopeProof` can be carried from `review_core.md` into deep-review JSONL `findingDetails`; both deep-review synthesis modes require Planning Packet fields; both plan modes map `activeFindings[].findingClass`, `activeFindings[].scopeProof`, and `activeFindings[].affectedSurfaceHints` into the FIX ADDENDUM; the plan template renders `## FIX ADDENDUM: AFFECTED SURFACES`.
- Matrix completeness: both deep-review auto/confirm and plan auto/confirm surfaces were checked. Template rendering is present in the manifest plan template. Validation currently checks `findingDetails` exists as an array, but does not validate per-item field names or enum values.

Maintained/closed:

- `scopeProof` vs `scopeProofNeeded` is now consistent on the active producer and consumer surfaces inspected.
- The R4 -> R7 -> R3 names are aligned: `findingClass`, `scopeProof`, and `affectedSurfaceHints` are the shared names used by sk-code-review, sk-deep-review state guidance, Planning Packet synthesis, and `/spec_kit:plan` import guidance.
- The current state records iteration-001 and iteration-002 under session `2026-05-02T19:37:23Z`; iteration-002's two P1 traceability findings remain active and are not reclassified by this maintainability pass.

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. **Finding-class enum is documented upstream but not centralized or enforced at the deep-review/plan boundary.** The canonical enum values are explicit in `sk-code-review` and the R5 checklist (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`), and the active state uses in-enum values. However, deep-review state guidance only requires a `findingClass` field and gives one example value, review-mode contract only requires `findingDetails`, post-dispatch validation only checks that `findingDetails` is an array, and `/spec_kit:plan` imports the field without restating or validating the enum. This is not a live naming mismatch, but it leaves future producer drift harder to detect. Finding class: `cross-consumer`. Scope proof: same-class producer inventory found enum definitions in `sk-code-review` and the checklist, field propagation in `@deep-review`, state docs, R7 synthesis, and R3 plan prompts, and no `scopeProofNeeded` occurrences on active surfaces; validation reads only the array shape. Affected surface hints: `sk-code-review` finding schema, `sk-deep-review` state schema, `post-dispatch-validate.ts`, `/spec_kit:plan` Planning Packet import. [SOURCE: `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:18-23`; `.opencode/skill/sk-code-review/references/review_core.md:86-87`; `.opencode/agent/deep-review.md:152-184`; `.opencode/skill/sk-deep-review/references/state_format.md:195-219`; `.opencode/skill/sk-deep-review/references/state_format.md:448-452`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:187-192`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:218`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:224`]

## Verdict - CONDITIONAL

CONDITIONAL - maintainability naming is consistent, but the active review still carries iteration-002 P1 state gaps and this pass adds one P2 enum-contract centralization advisory.
