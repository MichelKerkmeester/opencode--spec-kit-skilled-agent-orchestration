# Iteration 016 — Keep Specialist Agents, Reduce Mirror Tax

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s agent architecture fundamentally over-factored, or is the real problem elsewhere?

## Hypothesis
Babysitter's generic task-and-harness model will look cleaner, but `system-spec-kit` may still be right to preserve a few specialist roles because those roles encode policy, not just personality.

## Method
I compared Babysitter's plugin/harness boundary with `system-spec-kit`'s orchestrator, specialist agent roster, and runtime mirror parity burden.

## Evidence
- Babysitter plugin manifests are intentionally thin: one harness, plus roots for hooks, commands, and skills. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14]
- Harness-local hook wiring is also centralized in compact manifest files instead of duplicated role definitions. [SOURCE: external/plugins/babysitter-codex/hooks.json:1-36]
- `system-spec-kit`'s orchestrator defines a fairly rich specialist roster with hard boundaries such as `@speckit` for spec docs, `@deep-research` for iterative investigation, `@review` for quality, and `@handover` for context preservation. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:95-183]
- The repo then carries multiple runtime mirrors and parity tests to keep those contracts aligned across `.opencode`, `.claude`, `.gemini`, `.codex`, and `.agents`. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:35-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:24-107]

## Analysis
Babysitter does make `system-spec-kit` look heavy, but the external comparison also clarifies that not all complexity is equal. `@speckit`, `@deep-review`, and related roles are not just convenience personas; they carry real policy and artifact-boundary meaning. Replacing them with a purely generic Babysitter-style task model would likely lose important guardrails. [SOURCE: .opencode/agent/orchestrate.md:95-183]

The deeper problem is representational, not conceptual. `system-spec-kit` is paying a large maintenance tax to mirror the same role contracts across runtimes and wrappers. Babysitter's manifest boundary suggests the right response: keep the specialist roles, but stop hand-maintaining so many runtime-specific copies of their contract surface. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:35-100]

## Conclusion
confidence: high

finding: Babysitter does **not** prove that `system-spec-kit` should collapse its specialist agent taxonomy. It instead suggests a more surgical refactor: keep the specialist roles, but generate or centralize their runtime mirrors so the maintenance burden sits in metadata, not in duplicated agent contracts.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Maintain specialized agent roles plus runtime-specific mirrors and parity tests to keep them aligned. [SOURCE: .opencode/agent/orchestrate.md:95-183] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:35-100]
- **External repo's approach:** Keep runtime integration thin and manifest-driven, while core orchestration semantics live in reusable runtime/process primitives. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-14] [SOURCE: external/plugins/babysitter-codex/hooks.json:1-36]
- **Why the external approach might be better:** It lowers maintenance cost and runtime drift without forcing a collapse of higher-level workflow roles.
- **Why system-spec-kit's approach might still be correct:** Some of its specialist roles encode domain policy that a generic task abstraction would not preserve cleanly.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep the role taxonomy, but define each role once in a machine-readable registry and generate runtime mirrors/tests from that source of truth.
- **Blast radius of the change:** medium
- **Migration path:** Start with deep-research and deep-review, where parity-test burden is already explicit, then extend the generation path to `speckit`, `handover`, and `debug`.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/`, runtime mirror directories, `.opencode/skill/system-spec-kit/scripts/tests/`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** agree on a single machine-readable agent contract source
- **Priority:** should-have

## Counter-evidence sought
I looked for proof that the specialist roles are merely cosmetic, but the orchestrator rules show they carry hard policy boundaries, especially for spec documentation and deep-review behavior. [SOURCE: .opencode/agent/orchestrate.md:95-183]

## Follow-up questions for next iteration
- How much operator pain today comes from poor error quality rather than architecture itself?
- Are current deep-loop tests checking the right thing, or are they mostly protecting mirror drift?
- Should time-based runaway protections join convergence logic for long unattended runs?
