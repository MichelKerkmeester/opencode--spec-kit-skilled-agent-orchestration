# Iteration 012 — Validation Monolith Versus Composable Quality Gates

Date: 2026-04-10

## Research question
Does Agent Lightning's standard-tool validation model suggest that `system-spec-kit`'s validation pipeline is too monolithic and brittle?

## Hypothesis
The external repo likely relies on a smaller set of standard build, type, test, and docs checks, while `system-spec-kit` concentrates too much behavior inside `validate.sh` plus template contracts. If true, Public should refactor its validator architecture without dropping strictness.

## Method
I read the external contributor guide and build/test commands, then compared them to `system-spec-kit`'s level architecture, template contract, and `validate.sh` behavior, especially level detection and recursive phase validation.

## Evidence
- Agent Lightning's verification contract is conventional and narrow: `pytest`, `pyright`, `pre-commit`, and `mkdocs build --strict`. [SOURCE: external/AGENTS.md:11-16]
- The external testing guidance mirrors runtime directories under `tests/`, uses markers for optional surfaces, and prefers real stores or agents over mocks. [SOURCE: external/AGENTS.md:27-31]
- `system-spec-kit`'s level system composes multiple documentation layers and scales from roughly 455 LOC at Level 1 to over 1000 LOC at Levels 3 and 3+. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:50-58]
- Level 3+ adds AI execution protocols, extended checklists, sign-offs, and coordination-root phase requirements. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:385-416] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:512-516]
- `validate.sh` performs template-hash inspection, level detection, all-rule execution, and recursive phase validation from one shell entrypoint. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:202-229] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:611-633]
- The validator auto-enables recursive validation when phase children are detected. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:611-628]
- Public also maintains detailed scenario-level evidence packs for exact verification sequences in the manual testing playbook. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/108-spec-007-finalized-verification-command-suite-evidence.md:16-29]

## Analysis
The external repo shows a healthier layering pattern for verification: standard tools do standard jobs, while project-specific structure lives in docs conventions and targeted tests. `system-spec-kit` has a stronger governance problem to solve, so a richer validator is warranted, but the current architecture still feels overly concentrated. Level detection, template structure, recursive phase traversal, and strictness promotion are all useful; housing them behind one large shell script makes the system harder to evolve, harder to observe, and harder to run selectively.

The most valuable lesson is not to weaken validation. It is to decompose the validator into explicit categories with a stable wrapper on top. Public's strictness should remain, but the implementation should be less monolithic and more like a composed quality pipeline.

## Conclusion
confidence: high

finding: `system-spec-kit` should refactor its validation pipeline into composable validators while keeping a strict wrapper entrypoint. The current validation system is doing the right kinds of checks, but it is too centralized inside `validate.sh` and the surrounding template contract.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- **Change type:** architectural refactor
- **Blast radius:** large
- **Prerequisites:** define stable validator categories, machine-readable result schema, and wrapper compatibility rules
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** One dominant validation wrapper detects levels, traverses phases, applies many rule families, and escalates warnings in strict mode.
- **External repo's approach:** Standard tools handle discrete concerns; contributor guidance composes them rather than hiding everything in one bespoke validator.
- **Why the external approach might be better:** It improves debuggability, targeted reruns, CI composition, and long-term maintainability.
- **Why system-spec-kit's approach might still be correct:** Public validates document structure and packet semantics that standard tools cannot cover out of the box.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep `validate.sh` as the compatibility wrapper, but move core checks into separately invocable validators with explicit categories such as `structure`, `templates`, `phase-links`, `completion`, and `content-minimums`.
- **Blast radius of the change:** large
- **Migration path:** Introduce parallel machine-readable validators under the current wrapper, prove parity in CI, then let the wrapper become a thin orchestrator instead of the primary logic host.

## Counter-evidence sought
I looked for evidence that the monolithic validator is already thin and only delegates to narrower components, but the current entrypoint still owns important orchestration decisions such as level detection and recursive traversal. I also checked whether the external repo solves comparable document-governance needs; it does not, so the recommendation stays "refactor" rather than "replace with pytest only."

## Follow-up questions for next iteration
- Should deep-research and deep-review runtime state be refactored the same way into composable, inspectable stages?
- Which validator categories need first-class JSON output for dashboards and reducer-owned reporting?
- Can strict mode remain behaviorally identical during a staged refactor?
