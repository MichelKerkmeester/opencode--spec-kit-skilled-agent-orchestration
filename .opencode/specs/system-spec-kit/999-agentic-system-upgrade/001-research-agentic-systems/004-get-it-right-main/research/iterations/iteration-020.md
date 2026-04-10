# Iteration 020 — Extract A Generic Loop Kernel Shared By Retry, Deep Research, And Deep Review

Date: 2026-04-10

## Research question
Does Get It Right point toward a broader architecture refactor where `system-spec-kit`'s iterative workflows share a common loop kernel instead of each encoding its own orchestration logic?

## Hypothesis
Yes. The strongest Phase 2 architecture signal is not just "build retry-mode," but "stop building each loop as a bespoke stack."

## Method
I compared the external retry workflow with `system-spec-kit`'s deep-research and deep-review loop contracts to see whether the same architectural primitives are being reimplemented under different names.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:26-40] Get It Right defines a loop entry, retry budget, and compact output contract.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] The external loop computes iteration outputs, strategy fallback, and stop conditions inside one controller.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:183-323] The same controller then dispatches a leaf, branches on strategy, and exposes a final outputs block.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-207] `system-spec-kit` deep research has the same broad phases: initialize state, classify session, create files, and enter a loop.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] Deep research then reads state, checks convergence, dispatches a leaf, reduces state, updates tracking, and loops.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:385-487] It finally synthesizes a report, marks completion, saves memory, and emits a completion message.
- [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243] Deep review uses the same three-layer pattern: command, YAML loop engine, leaf agent, and disk-backed state packet.

## Analysis
By the end of Phase 2, the largest architecture signal is repetition. Get It Right, deep research, and deep review all have the same skeleton: initialize state, dispatch a fresh leaf, evaluate objective signals, record one iteration, decide whether to continue, then synthesize and save. Today those ideas are expressed through separate workflow assets and partially duplicated loop contracts. That duplication makes each new loop expensive to author and hard to evolve consistently. A generic loop kernel with pluggable roles, state packet shape, objective checks, and synthesis hooks would let `system-spec-kit` add retry-mode without creating yet another bespoke orchestration stack.

## Conclusion
confidence: high
finding: `system-spec-kit` should extract a generic loop kernel that can back retry, deep-research, and deep-review workflows with pluggable leaf roles, gates, state views, and synthesis policies.

## Adoption recommendation for system-spec-kit
- **Target file or module:** loop orchestration architecture across command YAMLs and supporting scripts
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** inventory common loop primitives and define the smallest shared kernel API
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** each iterative workflow owns its own command assets, state files, convergence logic, and synthesis wiring.
- **External repo's approach:** one focused loop expresses the full lifecycle in a single controller with a small leaf-role vocabulary.
- **Why the external approach might be better:** it highlights how much of loop orchestration is generic and therefore extractable.
- **Why system-spec-kit's approach might still be correct:** research, review, and implementation loops do have domain-specific constraints and outputs.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** extract a shared loop kernel with pluggable modules for leaf dispatch, objective gates, branch strategy, reducer/view generation, synthesis, and memory-save policy; keep `/spec_kit:deep-research` and `/spec_kit:deep-review` as branded wrappers over that kernel.
- **Blast radius of the change:** architectural
- **Migration path:** begin by formalizing the common loop contract between deep-research and deep-review, then introduce retry-mode as the first new consumer of the shared kernel rather than as another standalone stack.

## Counter-evidence sought
I looked for evidence that existing iterative workflows are fundamentally incomparable. Instead, the sources describe very similar command -> loop engine -> leaf agent -> state packet architectures.

## Follow-up questions for next iteration
- What is the minimal shared kernel API across retry, research, and review?
- Which loop features should remain per-workflow plugins rather than kernel responsibilities?
- Should convergence, synthesis, and memory-save policies be shared or pluggable?
