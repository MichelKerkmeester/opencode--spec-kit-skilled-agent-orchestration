## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/sk-code-review/SKILL.md:286-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/skill/sk-deep-review/references/convergence.md:88-104`
- `.opencode/skill/sk-deep-review/references/convergence.md:381-388`
- `.opencode/skill/sk-deep-review/references/convergence.md:417-420`
- `.opencode/skill/sk-deep-review/references/convergence.md:438-442`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480-490`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:500-548`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1054`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:508-556`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:548-560`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`
- `.opencode/agent/deep-review.md:146-179`
- `.opencode/agent/deep-review.md:204-224`
- `.opencode/skill/sk-deep-review/references/state_format.md:176-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Fix-completeness proof field names drift between `scopeProof` and `scopeProofNeeded`.** R5 classification: `cross-consumer`. The sk-code-review finding schema defines the proof field as `scopeProof`, and the public output contract renders the same concept as "Scope proof"; the deep-review Planning Packet active-finding contract instead requires `scopeProofNeeded`. Same-class producer inventory: `rg -n 'scopeProof|scopeProofNeeded|affectedSurfaceHints|findingClass|findingClasses|requiredFixCompletenessGate|fixCompletenessRequired|fixCompletenessReplay|fix_completeness_replay_gate_pass' .opencode/skill/sk-code-review .opencode/skill/sk-deep-review .opencode/command/spec_kit .opencode/agent` found `scopeProof` only in sk-code-review and `scopeProofNeeded` only in the deep-review synthesis contract. Cross-consumer check: the LEAF agent finding template and JSONL state schema still do not collect either field, and `/spec_kit:plan` only names generic affected-surfaces generation, so a downstream consumer cannot reliably map R4's `scopeProof` evidence to R7's `scopeProofNeeded` field without convention-specific inference. Matrix completeness: the `findingClass` enum values are consistent where explicitly listed (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`), but the paired proof field is not spelled consistently across the three surfaces. [SOURCE: `.opencode/skill/sk-code-review/SKILL.md:319-320`; `.opencode/skill/sk-code-review/references/review_core.md:86-87`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1050-1054`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`; `.opencode/agent/deep-review.md:146-179`; `.opencode/skill/sk-deep-review/references/state_format.md:176-204`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

### P2

1. **`fixCompletenessRequired` has no explicit vocabulary bridge to the convergence gate names.** R5 classification: `cross-consumer`. The Planning Packet requires a camelCase boolean named `fixCompletenessRequired`, while convergence documentation and workflow state use `requiredFixCompletenessGate`, `fixCompletenessReplay`, `fixCompletenessReplayGate`, and snake_case metrics such as `fix_completeness_replay_gate_pass`. Same-class producer inventory: the same `rg` command above found no canonical row that states `fixCompletenessRequired` is the planning-facing projection of `requiredFixCompletenessGate` or `fixCompletenessReplayGate`. Cross-consumer check: convergence correctly blocks STOP for security-sensitive reruns, but the report-to-plan contract has to infer whether the planning boolean means "run full R5 checklist", "closed-gate replay required", or "security-sensitive replay gate failed". This is lower severity because it is documentation/contract maintainability drift rather than an immediate local contradiction. [SOURCE: `.opencode/skill/sk-deep-review/references/convergence.md:43-53`; `.opencode/skill/sk-deep-review/references/convergence.md:88-104`; `.opencode/skill/sk-deep-review/references/convergence.md:381-388`; `.opencode/skill/sk-deep-review/references/convergence.md:417-420`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480-490`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:500-548`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1050`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:508-556`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`]

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

CONDITIONAL — The `findingClass` enum itself is consistent, but adjacent fix-completeness proof and planning/gate field names drift enough to require inference across sk-code-review, sk-deep-review convergence, and Planning Packet consumers.

## Confidence — 0.0-1.0

0.87
