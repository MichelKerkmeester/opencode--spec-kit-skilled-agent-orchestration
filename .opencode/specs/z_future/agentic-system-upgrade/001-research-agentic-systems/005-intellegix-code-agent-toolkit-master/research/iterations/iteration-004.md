# Iteration 004 — Context Exhaustion And Session Rotation

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt the external repo's context-exhaustion and session-rotation heuristics in addition to convergence-by-novelty?

## Hypothesis
Yes. The external repo likely separates "no new information" from "the session is getting tired," which `system-spec-kit` does not currently model.

## Method
I compared the external loop's stagnation logic, session-rotation rules, and tests with `system-spec-kit`'s convergence and stuck-detection references.

## Evidence
- `[SOURCE: external/automated-loop/loop_driver.py:1064-1107]` The loop rotates sessions when turn limits, session cost limits, or recent low-turn patterns indicate context exhaustion.
- `[SOURCE: external/automated-loop/loop_driver.py:1109-1143]` Stagnation checks use low-turn windows and zero-cost windows instead of relying on content novelty alone.
- `[SOURCE: external/automated-loop/loop_driver.py:494-530]` A two-strike stagnation flow first resets state and only exits after repeated evidence of non-progress.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1231-1256]` Tests verify session rotation at turn-limit boundaries.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1291-1330]` Tests also verify context exhaustion can trigger rotation before declaring stagnation.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1334-1413]` Rotation is explicitly non-terminal; it continues the loop and avoids falsely setting stagnation.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:41-48]` Current stuck detection is driven by consecutive no-progress iterations, not runtime session health.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:76-112]` Composite convergence is based on new information yield and question coverage.
- `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:214-243]` The stuck counter resets on `insight` and skips `thought`, but it still does not account for session fatigue, token churn, or low-turn degeneration.

## Analysis
The external design distinguishes two failure modes that `system-spec-kit` currently merges: research saturation and runtime context exhaustion. That distinction matters. A low-novelty iteration may mean the topic is exhausted, but it can also mean the active session has become inefficient. The external loop uses cheap operational signals to refresh the session before labeling the research stuck. `system-spec-kit`'s convergence design is more semantically aware than the external one, but it has no equivalent operational health signal. The best adoption is additive: preserve semantic convergence, but layer in session-health heuristics where runtimes expose them.

## Conclusion
confidence: high

finding: `system-spec-kit` should add an optional session-health layer that can rotate or refresh runtime context before the stuck counter escalates. This would make long autonomous runs more resilient without weakening the existing novelty-based convergence model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/references/convergence.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define runtime-neutral session-health signals and capability-gated runtime adapters
- **Priority:** should-have

## Counter-evidence sought
I looked for current session-rotation or context-exhaustion handling in the convergence and loop docs. I found none beyond standard stuck detection.

## Follow-up questions for next iteration
- Would session rotation belong in the deep-research agent, the YAML workflow, or the reducer?
- Can session-health events reuse the existing JSONL event model cleanly?
- Does multi-agent research make this problem easier or harder?
