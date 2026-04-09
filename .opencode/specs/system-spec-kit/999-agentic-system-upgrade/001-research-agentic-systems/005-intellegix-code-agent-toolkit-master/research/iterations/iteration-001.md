# Iteration 001 — Completion Gates And Stop Semantics

Date: 2026-04-09

## Research question
Does the external loop's explicit completion-gate and exit-code contract give `system-spec-kit` a clearer autonomous stop model than the current deep-research surfaces?

## Hypothesis
Yes. The external repo appears to expose stop reasons as runtime contracts, while `system-spec-kit` mostly describes convergence conceptually.

## Method
I compared the external loop driver, completion-gate config, and tests with the current `system-spec-kit` deep-research command docs and YAML workflow assets. I looked specifically for explicit stop reasons, machine-checkable completion rules, and post-stop validation behavior.

## Evidence
- `[SOURCE: external/automated-loop/loop_driver.py:33-37]` The loop exposes four terminal exit codes: complete, max iterations, budget exhausted, and stagnation.
- `[SOURCE: external/automated-loop/config.py:102-110]` Completion gating is configurable through a dedicated section marker and a maximum rejection count.
- `[SOURCE: external/automated-loop/loop_driver.py:541-587]` Completion is not accepted on a plain "done" message; the driver checks completion markers, validates a completion gate, caps repeated rejections, and runs post-review before final success.
- `[SOURCE: external/automated-loop/loop_driver.py:1152-1188]` The loop extracts a `## Completion Gate` checklist from `CLAUDE.md`, turning policy text into a runtime contract.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2272]` Tests prove unchecked completion-gate items block success and checked items unblock it.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]` The current command overview names loop and synthesis phases, but its output contract only reports `converged|max_iterations|all_answered`.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:252-259]` Failure handling is broad-grained: retry timeout, reconstruct missing state, halt after repeated failures, and use scratch fallback for memory save.
- `[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-286]` The YAML makes stop decisions from max iterations, answered questions, and composite convergence, but it does not surface a dedicated completion gate or a richer stop taxonomy.

## Analysis
The external repo treats "completion" as something that must be proven twice: once by the agent's output and once by a machine-checkable gate loaded from policy text. That produces predictable stop codes, auditability, and recovery paths when the agent declares success too early. `system-spec-kit` already has a thoughtful convergence model, but its stop conditions remain mostly about novelty and question coverage. That is strong for research saturation and weaker for "is the output packet actually ready to close?" The gap matters because long autonomous runs can satisfy convergence while still leaving the packet in a low-confidence final state.

## Conclusion
confidence: high

finding: The external repo's completion-gate model is a stronger closeout contract than the current `system-spec-kit` deep-research stop surface. `system-spec-kit` should keep its composite convergence logic, but add a final packet-level completion gate and explicit stop-reason enumeration so automated runs can distinguish "research saturated," "packet complete," "budget stop," and "stagnation stop."

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a canonical research completion checklist shape and stop-reason vocabulary
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing packet-level completion gate in the deep-research command docs and YAML. I found convergence and quality guards, but no separate final completion contract.

## Follow-up questions for next iteration
- Where should `system-spec-kit` persist completion-gate results: JSONL events, strategy state, or dashboard only?
- Can session continuity support this richer stop model without introducing stale state?
- Which current tests would need to become stop-reason assertions?
