## Dimension: security

## Files Reviewed

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-85`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/agent/deep-review.md:147-184`
- `.opencode/skill/sk-deep-review/references/state_format.md:185-219`
- `.opencode/skill/sk-deep-review/references/state_format.md:448-452`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-229`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:568-574`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-235`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:617-623`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-state.jsonl:1-4`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-001.md:29-31`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-002.md:29-31`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-003.md:29-31`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-004.md:29-31`
- `git diff --name-status` and `git diff --stat`

Applied R5 fix-completeness protocol:

- Classification: the suspected security issue is `cross-consumer` plus `matrix/evidence`, because R4 findings are produced as structured `findingDetails`, R7 compiles those fields into a Planning Packet, and R3 imports them into the `FIX ADDENDUM: AFFECTED SURFACES` table.
- Same-class producer inventory: `findingClass`, `scopeProof`, and `affectedSurfaceHints` are produced by `sk-code-review`/`@deep-review`, persisted in deep-review state guidance, compiled by both deep-review report workflows, and consumed by both `/spec_kit:plan` modes.
- Cross-consumer flow: a sample R4 finding with `findingClass` plus `scopeProof` now has a complete handoff path from review guidance -> `findingDetails` JSONL -> R7 Planning Packet -> R3 plan workflow -> plan template `FIX ADDENDUM` body.
- Matrix completeness: both plan modes and both deep-review synthesis modes were inspected. The matrix is complete for field presence and naming, but incomplete for hostile Planning Packet content: there is no instruction to treat imported `activeFindings[]`, `scopeProof`, or `affectedSurfaceHints` as untrusted data, quote them, or reject instruction-looking content before rendering planner context.

Confirmed closed:

- `scopeProofNeeded` is not part of the live R3/R7 field path inspected; the shared field name is `scopeProof`.
- The `FIX ADDENDUM` render surface exists in the plan template, and both R3 plan modes explicitly import Planning Packet fields before drafting phases.
- I did not find direct shell/eval execution of `affectedSurfacesSeed`, `activeFindings`, `findingClass`, `scopeProof`, or `affectedSurfaceHints` in the plan workflow, so the injection risk is prompt/context steering rather than immediate command execution.

## Findings by Severity

### P0

None.

### P1

1. **Planning Packet fields are imported into planner context without a data-only boundary.** R7 requires the Planning Packet to build `activeFindings`, `findingClasses`, and `affectedSurfacesSeed` from reducer-owned state plus iteration JSONL `findingDetails`, and R3 then maps `activeFindings[].findingClass`, `activeFindings[].scopeProof`, and `activeFindings[].affectedSurfaceHints` into the FIX ADDENDUM before drafting phases. Those fields can contain evidence, recommendations, path-like text, grep commands, or markdown copied from reviewed code/reports, but the planner prompt does not require quoting, escaping, truncating, or treating those values as inert data. This leaves a prompt-injection path where a hostile finding payload can influence later planning output even though no direct shell execution was found. Finding class: `cross-consumer`. Scope proof: same-class producer and consumer inventory covered `sk-code-review`, `@deep-review`, deep-review state docs, both R7 synthesis workflows, both R3 plan workflows, and the plan template; the flow is wired, but only field presence is specified, not hostile-content handling. Affected surface hints: R7 Planning Packet synthesis, R3 `/spec_kit:plan` FIX ADDENDUM import, `plan.md` affected-surfaces table, future remediation task generation. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1049-1051`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1071-1073`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:218`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:574`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:224`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:623`; `.opencode/skill/sk-deep-review/references/state_format.md:185-219`]

### P2

1. **Review prompt artifacts retain absolute local workspace paths.** The R3/R7 prompt templates inspected use relative repository paths, but the active 010 review prompt artifacts store absolute `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/...` write targets for iterations 001-004. This is a path disclosure in persisted review prompts, not a direct execution vector and not specific to the FIX ADDENDUM field import. Finding class: `matrix/evidence`. Scope proof: `rg -n '/Users/michelkerkmeester|/Users/|MEGA/Development|Code_Environment'` found no absolute path matches in the R3/R7 command templates or deep-review agent/state surfaces inspected, but found the same absolute output paths in 010 review prompt artifacts for iterations 001-004. Affected surface hints: `review/prompts/iteration-001.md` through `review/prompts/iteration-004.md`, review packet publication/export. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-001.md:29-31`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-002.md:29-31`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-003.md:29-31`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-004.md:29-31`]

## Verdict - CONDITIONAL

CONDITIONAL - the R4 -> R7 -> R3 field handoff is now wired, but R3 consumes Planning Packet fields without an explicit data-only boundary and the 010 prompt artifacts still disclose absolute local paths.
