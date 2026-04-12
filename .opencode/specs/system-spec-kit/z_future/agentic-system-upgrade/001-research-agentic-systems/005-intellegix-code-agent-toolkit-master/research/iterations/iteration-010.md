# Iteration 010 — Tests As Runtime Specification

Date: 2026-04-09

## Research question
Do the external repo's tests encode loop-runtime guarantees that `system-spec-kit`'s deep-research contract tests should mirror?

## Hypothesis
Yes. The external tests appear to specify operational behavior more deeply than the current local parity tests.

## Method
I compared external loop, state-tracker, NDJSON, and multi-agent tests with the current `system-spec-kit` deep-research parity and reducer tests to identify missing behavioral guarantees.

## Evidence
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:129-164]` The external loop tests distinct terminal outcomes such as budget stop and max-iterations stop.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1183-1225]` Model fallback behavior is tested as a bounded one-step action with trace evidence.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1231-1413]` Session rotation and context exhaustion are treated as explicit, non-terminal behaviors with dedicated assertions.
- `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2468]` Completion-gate rejection and post-review sequencing are specified in tests, not just docs.
- `[SOURCE: external/automated-loop/tests/test_state_tracker.py:158-168]` State tests cover session continuity rather than only counters and file presence.
- `[SOURCE: external/automated-loop/tests/test_ndjson_parser.py:135-177]` Stream parsing tests verify tool usage, modified files, and session extraction from runtime output.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-57]` Current contract-parity tests focus on documentation/runtime path parity and required artifact mentions.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:43-74]` Reducer tests validate fixture shape and lineage metadata.
- `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-259]` Local tests assert reducer refresh outputs, but not richer runtime stop, session, or fallback semantics.

## Analysis
`system-spec-kit` already uses tests to protect contract parity, which is good. The external repo shows the next step: treat tests as executable documentation for loop runtime behavior. That matters because several recommendations from earlier iterations only become safe once they are pinned down in tests. Without that, the docs would say more than the runtime can prove. The highest-value test additions are the ones that lock in explicit stop reasons, session continuity behavior, and any new fallback or completion-gate semantics.

## Conclusion
confidence: high

finding: The strongest transfer from the external repo is not a single feature but a testing posture. `system-spec-kit` should expand deep-research tests from "artifacts are in sync" to "runtime behavior is specified and provable."

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** finalize any new stop-reason, session-health, or completion-gate semantics before encoding them
- **Priority:** must-have

## Counter-evidence sought
I looked for existing tests covering stop taxonomy, runtime session continuity, completion-gate rejection, or fallback traces. I found parity and reducer coverage, but not those richer guarantees.

## Follow-up questions for next iteration
- Which new behaviors are stable enough to test immediately?
- Should contract tests assert dashboard phrasing, JSONL events, or both?
- How should the final synthesis rank implementation order across these findings?
