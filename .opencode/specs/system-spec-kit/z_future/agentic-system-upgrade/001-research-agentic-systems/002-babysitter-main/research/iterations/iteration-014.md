# Iteration 014 — Replace Parallel Loop Stacks With One Iteration Engine

Date: 2026-04-10

## Research question
Are `system-spec-kit`'s deep-research and deep-review loops the right abstraction, or does Babysitter suggest a more general execution engine?

## Hypothesis
Babysitter's generic runtime plus process-specific definitions will expose avoidable duplication in `system-spec-kit`'s two autonomous loop stacks.

## Method
I compared the structure of the deep-research and deep-review YAML workflows, runtime mirrors, and parity tests with Babysitter's generic runtime and methodology patterns.

## Evidence
- Deep research and deep review each define their own agent configuration, state paths, initialization flow, loop phase, convergence logic, reducer sync, dashboard generation, and synthesis mechanics. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:99-207] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:69-90] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:100-220] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:294-390]
- The repo carries dedicated parity tests to keep those workflows, runtime mirrors, and supporting docs aligned across multiple runtimes. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-107] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-110]
- Babysitter's generic state machine and its Spec Kit methodology both reuse the same runtime primitives while specializing only the task graph, guards, and breakpoints. [SOURCE: external/library/methodologies/state-machine-orchestration.js:13-21] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170]

## Analysis
The current `system-spec-kit` deep loops are thoughtful and powerful, but they have become product lines of their own: separate YAML engines, separate agent mirrors, separate reducer contracts, and a growing parity-test matrix to hold it together. Babysitter suggests a different factoring. Keep one orchestration engine, and parameterize the mode-specific parts: state schema, iteration artifact template, convergence reducer, and synthesis template. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:294-390] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-235]

This is not merely about deduplicating text. It is about reducing architectural surface area. Today, adding a lifecycle feature such as restart/fork/completed-continue, runtime mirrors, or new reducer outputs means touching both deep systems and their test scaffolding. A generic iteration engine would collapse that maintenance burden. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:35-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:24-107]

## Conclusion
confidence: high

finding: Babysitter's architecture suggests `system-spec-kit` should refactor deep research and deep review into one generic iterative workflow engine with mode-specific schemas, reducers, and report templates. The current split is effective but too expensive to evolve.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Deep research and deep review are separate workflow families with parallel runtime assets, contracts, reducers, mirrors, and tests. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:69-90] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-107]
- **External repo's approach:** Babysitter keeps one runtime and one process execution model, then specializes through process definitions and task graphs. [SOURCE: external/library/methodologies/state-machine-orchestration.js:13-21] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:114-170]
- **Why the external approach might be better:** New lifecycle features land once, state handling becomes uniform, and report/reducer behavior becomes pluggable instead of duplicated.
- **Why system-spec-kit's approach might still be correct:** Research and review have genuinely different evidence rules, output artifacts, and convergence semantics; a forced unification could blur those distinctions.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Build a shared iteration engine that accepts a mode descriptor (`research`, `review`) for state file names, reducer script, convergence thresholds, and synthesis template; keep the mode-specific report schemas on top.
- **Blast radius of the change:** architectural
- **Migration path:** First extract shared lifecycle steps into a common engine while leaving the current command entry points intact; once parity tests prove the shared engine stable, shrink the mode-specific YAMLs to thin wrappers.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/skill/system-spec-kit/scripts/tests/`
- **Change type:** architectural refactor
- **Blast radius:** architectural
- **Prerequisites:** define the mode descriptor contract and shared lifecycle hooks before moving reducer logic
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing generic iterative workflow engine already shared by deep research and deep review and instead found separate YAML lifecycles plus explicit parity tests whose job is to keep the two ecosystems synchronized. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-107]

## Follow-up questions for next iteration
- If deep loops unify, which validation responsibilities should remain global versus mode-specific?
- Does the current validator try to do too much that a workflow-owned gate could handle more cleanly?
- Are specialist agents themselves over-factored, or is the real problem the mirror and runtime duplication around them?
