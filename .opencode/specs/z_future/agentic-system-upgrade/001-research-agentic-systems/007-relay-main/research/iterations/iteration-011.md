# Iteration 011 — Shared Deep-Loop Kernel

Date: 2026-04-10

## Research question
Should `system-spec-kit` refactor `deep-research` and `deep-review` into one generic loop kernel instead of maintaining two parallel command+skill stacks?

## Hypothesis
Relay's workflow layer is generic enough that it exposes duplication in Public's current deep-loop architecture.

## Method
Read Relay's workflow README, builder, coordinator, and run helper, then compared them with Public's `deep-research` and `deep-review` commands plus both skills' architecture sections.

## Evidence
- Relay explicitly separates three layers: user-facing app, communicate mode, and generic workflows for multi-step execution, verification, and handoffs. [SOURCE: external/packages/sdk/src/workflows/README.md:70-77]
- Relay's workflow runner documents one shared completion pipeline, one shared swarm-pattern vocabulary, and one shared pause/resume surface for many workflow shapes rather than creating separate command families per use case. [SOURCE: external/packages/sdk/src/workflows/README.md:210-254] [SOURCE: external/packages/sdk/src/workflows/README.md:530-537] [SOURCE: external/packages/sdk/src/workflows/README.md:731-742]
- The builder exposes common options such as `verification`, `startFrom`, `previousRunId`, `coordination`, `state`, and `trajectories` as reusable workflow primitives. [SOURCE: external/packages/sdk/src/workflows/builder.ts:50-92] [SOURCE: external/packages/sdk/src/workflows/builder.ts:94-129] [SOURCE: external/packages/sdk/src/workflows/builder.ts:218-239] [SOURCE: external/packages/sdk/src/workflows/builder.ts:334-373]
- The coordinator auto-selects patterns from workflow shape and resolves topology from one common config rather than duplicating separate engines for review and research. [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:47-65] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:148-164] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:206-240]
- Public's `deep-research` and `deep-review` commands each define their own setup phase, lifecycle, output contract, memory save instructions, and loop workflow prose even though the init/iterate/synthesize/save skeleton is nearly identical. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-186] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-228]
- The `sk-deep-research` and `sk-deep-review` skills each describe a separate three-layer architecture with fresh-context iterations, JSONL state, strategy files, synthesis, and memory save, again with domain-specific differences layered on top of the same loop shape. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137-176] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179-222] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:155-198] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:216-285]

## Analysis
Phase 1 already showed that Relay should not replace Public's orchestrator wholesale. What Phase 2 adds is a sharper internal design critique: Public has two parallel deep-loop products that differ mostly in leaf-agent behavior and synthesis schema, not in loop mechanics. Relay's workflow engine is broader than Public should copy directly, but it demonstrates the payoff of one reusable execution kernel with thin domain wrappers instead of duplicating setup contracts, convergence language, pause/recovery behavior, and state management twice.

## Conclusion
confidence: high
finding: Public should refactor deep research and deep review onto one shared deep-loop kernel with pluggable domain contracts. Keep separate user-facing commands and specialist leaf agents, but stop maintaining two near-duplicate orchestration stacks.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/sk-deep-research/`, `.opencode/skill/sk-deep-review/`
- **Change type:** architectural refactor
- **Blast radius:** architectural
- **Prerequisites:** define a shared loop schema for setup, lifecycle, convergence, state packet naming, and synthesis hooks
- **Priority:** should-have (prototype later)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Two separate deep-loop command surfaces and two separate skills each re-describe nearly the same init -> iterate -> synthesize -> save lifecycle.
- **External repo's approach:** One reusable workflow engine handles many execution shapes through shared primitives such as verification, topology, state, and resume/start-from controls.
- **Why the external approach might be better:** It concentrates lifecycle complexity in one place, which lowers drift and makes later recovery/resume/validation changes cheaper to roll out consistently.
- **Why system-spec-kit's approach might still be correct:** Research and review do have materially different synthesis outputs, guardrails, and leaf-agent behavior, so over-generalizing too early could produce a leaky abstraction.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce a generic deep-loop core that owns setup parsing, state packet conventions, convergence bookkeeping, lineage, and memory-save hooks; keep `deep-research` and `deep-review` as thin wrappers that inject domain config, artifact names, and leaf-agent instructions.
- **Blast radius of the change:** architectural
- **Migration path:** First extract shared lifecycle text and shared reducer/state helpers, then move command YAML/assets onto one internal kernel, then migrate each skill to domain-specific overlays without changing user-facing command names.

## Counter-evidence sought
Looked for strong evidence that Public's research and review loops intentionally diverge at the orchestration layer rather than only at the domain layer; the major differences were mostly payload schema and review-specific severity handling, not loop mechanics.

## Follow-up questions for next iteration
- Should a shared kernel also cover future iterative modes beyond research and review?
- Which current loop differences are true domain requirements versus documentation drift?
- How much of deep-review's lineage model should become the default for deep-research?
