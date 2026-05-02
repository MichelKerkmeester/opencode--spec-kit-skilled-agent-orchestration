## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-004.md:7-34`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/decision-record.md:52-60`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/decision-record.md:101-105`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/implementation-summary.md:52-67`
- `.opencode/agent/deep-review.md:152-184`
- `.opencode/skill/sk-deep-review/references/state_format.md:188-221`
- `.opencode/skill/sk-deep-review/references/state_format.md:448-452`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-230`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:570-576`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-232`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:620-625`

## Findings by Severity

### P0

None.

### P1

1. **Planner inert-data boundary still allows untrusted Planning Packet command text to become executable verification work.** R5 classification: `cross-consumer` plus `algorithmic` command-safety boundary. Cycle 2 correctly treats imported Planning Packet values as inert review data and rejects instruction-like, absolute-path-only, or unverifiable values, but both plan workflows still permit deriving actions from "commands rerun locally" / "locally rerun commands" in the same rule that imports `activeFindings[].scopeProof` and related fields. The producer inventory shows `scopeProof` is a free-form string emitted by deep-review finding state and then copied into the synthesized Planning Packet; the consumer inventory shows both `/spec_kit:plan` variants import that string before phase drafting. A hostile or compromised review value can therefore smuggle shell-shaped text as "scope proof" and steer the planner to run it locally, bypassing the intended "inert data" boundary.

   Scope proof: same-class producer inventory found `findingClass`, `scopeProof`, and `affectedSurfaceHints` produced in `.opencode/agent/deep-review.md:152-184` and `.opencode/skill/sk-deep-review/references/state_format.md:188-221,448-452`, then emitted through Planning Packet synthesis in `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`. Cross-consumer flow found both plan consumers importing those fields at `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215-230` and `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221-232`, with writing rules at `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:570-576` and `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:620-625` preserving the command-rerun allowance. Matrix completeness checked auto/confirm producers, auto/confirm consumers, inline scaffold, writing rule, instruction-like values, absolute-path-only values, and command-shaped values; the command-shaped hostile row remains uncovered.

   Recommended fix: change both plan workflow inert-data rules to forbid executing or rerunning commands copied from Planning Packet fields. Allow only independently selected safe local verification commands, preferably static audit commands already chosen by the planner from repo-relative paths/symbols after verification; copied command text should be rendered as quoted evidence or replaced with `UNKNOWN` plus a verification row.

### P2

None.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

FAIL — cycle 2 reduces path-leak and prompt-instruction risk, but the remaining "commands rerun locally" allowance keeps a P1 command-injection path open across the deep-review Planning Packet to `/spec_kit:plan` consumer flow.
