# Iteration 002 — Session Continuity And Resume Semantics

Date: 2026-04-09

## Research question
Does the external repo's session-resume path preserve loop continuity better than `system-spec-kit`'s current lineage-oriented deep-research state?

## Hypothesis
Yes. The external repo likely records transport-level session identity more directly than `system-spec-kit`.

## Method
I compared how the external loop captures and reuses session IDs with how `system-spec-kit` records lineage and resume information in its deep-research config, state format, and YAML workflow.

## Evidence
- `[SOURCE: external/automated-loop/state_tracker.py:65-76]` Workflow state persists `last_session_id` alongside iteration counters, status, and cycle history in `.workflow/state.json`.
- `[SOURCE: external/automated-loop/state_tracker.py:137-178]` Each completed cycle can update `last_session_id`, linking a loop iteration to the concrete runtime session that produced it.
- `[SOURCE: external/automated-loop/loop_driver.py:265-289]` The driver validates the prior `last_session_id`, passes it back into the next run as `session_id`, and refreshes it from the parsed NDJSON stream.
- `[SOURCE: external/automated-loop/loop_driver.py:676-723]` The actual CLI dispatch includes `--resume <session_id>` when a validated prior session exists.
- `[SOURCE: external/automated-loop/tests/test_state_tracker.py:158-168]` Tests assert that new cycles overwrite `last_session_id`, proving resume always points at the most recent usable session.
- `[SOURCE: external/automated-loop/tests/test_ndjson_parser.py:135-149]` Tests verify the parser extracts the session ID from stream JSON and threads it into result objects.
- `[SOURCE: .opencode/skill/sk-deep-research/assets/deep_research_config.json:14-27]` `system-spec-kit` tracks lineage session IDs, parent linkage, and generation counts, but not a runtime transport session handle for the live model/tool session.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:55-81]` The config spec defines lineage state in detail, but its continuity model is lineage-centric rather than runtime-session-centric.
- `[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-175]` Session classification in the YAML checks config, JSONL, and strategy agreement, then resumes based on artifact consistency rather than any preserved model-session handle.

## Analysis
`system-spec-kit` already thinks carefully about lineage: restart, fork, resume, and completed-continue are all explicit. What it lacks is the external repo's narrower but valuable concept of "the exact runtime session that can continue this thread without re-priming." Those are different layers. The external model is stronger for practical continuity across long loops because it allows the engine to reuse a validated session handle, not just infer continuity from files. For Codex/Copilot/Claude runtimes this will not always be available, but the external pattern still suggests a capability-aware seam: record transport session IDs when a runtime exposes them, and fall back cleanly when it does not.

## Conclusion
confidence: high

finding: `system-spec-kit` should not replace lineage state with runtime session state, but it would benefit from adding an optional transport-session field and event model. That would let compatible runtimes resume more efficiently while preserving today's artifact-based resume path as the universal fallback.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** runtime-capability matrix must distinguish "supports resumable transport session" from "artifact-only resume"
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing `runtimeSessionId`-style field or event in the state docs and YAML flow. I found lineage metadata and resume events, but no runtime-session seam.

## Follow-up questions for next iteration
- How should optional runtime-session handles interact with budgets and cooldowns?
- Can transport session continuity help detect context exhaustion before convergence fails?
- Which runtimes in the current capability matrix can actually honor resumed sessions?
