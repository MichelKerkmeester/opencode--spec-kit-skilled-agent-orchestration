# Iteration 013 — Dedicated Loop Controller Contract

Date: 2026-04-10

## Research question
Does the external repo's explicit runtime controller suggest that `system-spec-kit` should replace its current documentation-driven deep-loop orchestration with a dedicated typed loop engine for research and review workflows?

## Hypothesis
Yes. The external repo centralizes runtime behavior in executable code and typed config, while `system-spec-kit` distributes core loop semantics across command docs, YAML, state references, and convergence references. That makes the local system powerful but harder to reason about and harder to keep behaviorally aligned.

## Method
I compared the external loop's config and persisted state models with the local deep-research command contract, loop protocol, state-format reference, and convergence reference. I looked for how many independent surfaces currently define runtime behavior in `system-spec-kit`.

## Evidence
- `[SOURCE: external/automated-loop/config.py:36-71]` The external loop's timeouts, budgets, cooldowns, turn caps, model fallback, and trace limits live in one typed config surface.
- `[SOURCE: external/automated-loop/config.py:102-110]` Completion-gate behavior is also defined in the same executable configuration model.
- `[SOURCE: external/automated-loop/config.py:178-250]` Stagnation, validation, verification, and multi-agent controls stay in that same controller-owned config hierarchy.
- `[SOURCE: external/automated-loop/state_tracker.py:65-77]` Persisted runtime state is also centralized in one typed model.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:166-173]` The local command delegates the actual workflow to YAML assets rather than a single engine surface.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:15-16]` The loop protocol says the YAML manages lifecycle while the agent and reducer handle other responsibilities.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:46-70]` Initialization rules and charter validation are defined in prose.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:101-123]` Stop decisions and quality-guard behavior are also specified in prose.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-198]` Dispatch context, per-iteration budgets, and reducer expectations are defined in yet another reference layer.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]` The local state model spans six primary files plus a reducer-owned registry.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:39-110]` Config and file-protection semantics are specified separately from the runtime controller.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:21-39]` Hard stops are defined in the convergence reference.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:50-150]` Composite convergence and quality guards are also defined there.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:176-185]` Decision priority is documented textually rather than emitted from a single executable state machine.

## Analysis
The local system is impressively explicit, but it is explicit in many places at once. Phase 1 already showed why this is dangerous for behavior drift. Phase 2 adds the architectural version of the same critique: the loop has a command surface, YAML assets, protocol docs, a state spec, a convergence spec, and reducer assumptions. That is enough surface area for semantic mismatch even when everyone is acting in good faith.

The external repo's advantage is not simply "it has Python." It is that one controller owns the state machine. Config, persisted state, budget checks, and stop reasons are all executable concepts. That makes it easier to test, easier to inspect, and easier to evolve. `system-spec-kit` should preserve its fresh-context leaf iteration model and packet-local artifacts, but move the authoritative loop contract into a dedicated typed controller shared by deep-research and deep-review. Docs should describe that engine, not replace it.

## Conclusion
confidence: high

finding: `system-spec-kit` should build a first-class deep-loop controller that owns lifecycle transitions, stop reasons, state writes, and reducer handoff semantics for both research and review. The current doc-and-YAML distribution is too diffuse for a core runtime contract.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/references/convergence.md`
- **Change type:** new module
- **Blast radius:** architectural
- **Prerequisites:** define a typed state machine and event schema that can be shared by research and review
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The loop contract is split across command docs, YAML assets, state references, convergence references, and reducer expectations.
- **External repo's approach:** A single executable controller owns config, lifecycle, persistence, and stop behavior.
- **Why the external approach might be better:** It lowers drift risk, makes runtime behavior easier to test, and provides one place to evolve lifecycle semantics.
- **Why system-spec-kit's approach might still be correct:** Documentation-first specifications are easier to audit and can be edited without runtime code changes.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce a typed deep-loop engine that emits canonical JSONL events and reducer inputs, then regenerate command docs and references from that engine contract.
- **Blast radius of the change:** architectural
- **Migration path:** Start by implementing the engine as a contract-checking shim around the current YAML flow, then gradually migrate stop logic, state updates, and dashboard generation into the shared runtime.

## Counter-evidence sought
I looked for a single local source of truth that already owned lifecycle, state semantics, and convergence rules together. I found strong documentation, but not one authoritative controller surface.

## Follow-up questions for next iteration
- Should research and review share one engine with mode-specific adapters, or separate engines with a common core?
- Which parts of the current YAML assets remain valuable after a controller exists?
- How much of the current reducer logic is actually runtime logic in disguise?
