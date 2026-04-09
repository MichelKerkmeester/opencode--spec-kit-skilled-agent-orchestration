# Iteration 003 — Budget, Cooldown, And Model Fallback Controls

Date: 2026-04-09

## Research question
Would the external repo's budget, cooldown, and fallback configuration improve `system-spec-kit`'s long-running deep-research reliability?

## Hypothesis
Yes. The external loop seems to expose more operational tuning than the current deep-research packet.

## Method
I compared external configuration and runtime enforcement for budgets, timeouts, cooldowns, and model fallbacks against `system-spec-kit`'s current deep-research config template and loop docs.

## Evidence
- `[SOURCE: external/automated-loop/config.py:36-71]` The external limits config includes per-iteration and total budget, timeout, model timeout multipliers, per-model max-turn overrides, cooldown bounds, and model fallback settings.
- `[SOURCE: external/automated-loop/config.py:187-210]` Stagnation config also carries session max-turn and session cost thresholds, tying cost governance to session rotation and stability logic.
- `[SOURCE: external/automated-loop/loop_driver.py:321-365]` Budget checks run after each cycle and can terminate the run with a distinct budget exit.
- `[SOURCE: external/automated-loop/loop_driver.py:367-449]` Repeated timeouts trigger trace logging, session clearing, cooldown calculation, and optional fallback to a more capable model.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1183-1225]` Tests verify fallback happens once, records a trace event, and does not cascade endlessly.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1434-1467]` Cooldown math is tested for base, cap, and zero cases rather than being left implicit.
- `[SOURCE: .opencode/skill/sk-deep-research/assets/deep_research_config.json:3-13]` The current config exposes max iterations, convergence, stuck threshold, duration, and per-iteration tool/time budgets.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:179-189]` The loop protocol treats time and tool-call limits as soft caps, but it does not specify cooldown windows, retry backoff, or model fallback behavior.

## Analysis
The external repo operationalizes failure as a tunable part of the loop rather than a rare exception. That makes sense for overnight autonomous execution where repeated timeouts can silently waste hours. `system-spec-kit` has solid research-state discipline, but its operational controls remain intentionally simple. The gap is not that the current design is wrong; it is that it does not yet encode what to do after repeated slowdowns or model stalls. The external repo's cooldown and one-step fallback pattern offers a bounded, testable middle ground between "keep retrying" and "halt immediately."

## Conclusion
confidence: high

finding: `system-spec-kit` should add optional operational controls for cooldown, retry backoff, and single-step model fallback to its deep-research runtime configuration. Those controls should remain runtime-capability-aware and optional so they do not complicate simple local runs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** capability matrix needs explicit support flags for timeout backoff and model fallback
- **Priority:** should-have

## Counter-evidence sought
I looked for existing cooldown or fallback controls in the current config and loop protocol. I found soft per-iteration budgets only.

## Follow-up questions for next iteration
- Should cooldown triggers live in config, runtime capabilities, or both?
- Can session rotation solve some timeout classes more cleanly than model fallback?
- Which failure modes should stay hard-stop regardless of cooldown availability?
