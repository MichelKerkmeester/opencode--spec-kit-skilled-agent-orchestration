# Iteration 009 — Parallel Verification Matrix

Date: 2026-04-09

## Research question
Which parallel verification patterns from Get It Right are worth copying directly into `system-spec-kit`?

## Hypothesis
The strongest directly reusable pattern is a configurable verification matrix that runs objective checks in parallel before semantic review.

## Method
I isolated the external check runners and join behavior, then compared them with `system-spec-kit`'s current validation and completion commands.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:165-181] Lint, test, and build are separate optional run nodes, followed by a `join_checks` barrier.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:22-33] The external check stage is intentionally parallel, optional by command presence, and logged to dedicated files.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:110-131] The workflow expects projects to configure only the checks they need, which makes the pattern portable across stacks.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472] Internal completion already expects validation and test evidence, but the checks are described as end-of-phase activities rather than a reusable per-attempt matrix.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:83-99] `validate.sh` exposes a stable CLI surface and exit codes that could participate in the same kind of objective gate as lint/test/build.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:419-431] The internal implementation workflow already reasons about confidence and validation before significant changes, so parallel objective checks would complement, not contradict, current doctrine.

## Analysis
This pattern is especially attractive because it is stack-agnostic and already aligned with internal habits. `validate.sh --strict` can act as a packet-quality check, while repo-native lint/test/build commands can supply code-quality checks. The external repo's real contribution is packaging those checks into a reusable pre-review matrix instead of leaving them as informal expectations. That can be adopted without importing any other controversial part of the loop.

## Conclusion
confidence: high
finding: A configurable, parallel verification matrix is one of the safest and most immediately useful adoptions from Get It Right. `system-spec-kit` already has the underlying commands; it lacks the reusable orchestration pattern that groups them into a pre-review gate.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** define a standard field set for optional per-attempt commands, including packet validation and repo-native lint/test/build hooks
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing internal step that already runs the relevant checks in parallel before review. I found strong validation requirements, but not a reusable parallel-attempt matrix.

## Follow-up questions for next iteration
- Should `validate.sh --strict` always be part of the matrix, or only when spec docs changed?
- How should failed check output be summarized for the next attempt without dumping raw logs into context?
- Can this matrix be used outside a retry loop as a standalone pre-review controller?
