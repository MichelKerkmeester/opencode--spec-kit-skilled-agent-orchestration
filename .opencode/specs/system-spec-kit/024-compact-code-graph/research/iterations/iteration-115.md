# Research Iteration 115: Cache and Event Invalidation Can Amplify the UX Confusion

## Focus

Investigate whether the plugin cache behavior can make the startup problem look worse or more inconsistent than the underlying root cause.

## Findings

1. The plugin keeps a short-lived transport-plan cache keyed by `sessionID` and `specFolder`. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:56-63`] [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:145-193`]

2. The plugin invalidates that cache for any `session.*` or `message.*` event. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:247-275`]

3. The status tool reports runtime state, cache entries, and the last runtime error, but there is no per-hook execution trace showing whether `system.transform`, `messages.transform`, or `session.compacting` most recently ran and what they injected. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:277-300`]

4. Because of that, a runtime that:
   - briefly shows a startup digest,
   - then rejects prompt assembly because of invalid `messages`,
   - then invalidates the transport cache on a message/session event,

   can feel like "the startup hook stopped firing" even when the real issue is later-stage prompt rejection plus ordinary cache turnover. [INFERENCE: based on `.opencode/plugins/spec-kit-compact-code-graph.js:247-275` and the user-observed symptom sequence]

## Recommendation

Treat cache invalidation as a secondary UX amplifier, not the primary defect. The plugin would benefit from per-hook diagnostics, but the first corrective action should still target `messages.transform`. After that, add hook-specific status counters if the UX remains ambiguous.

## Ruled Out Directions

- Treating cache invalidation itself as the most likely source of the invalid prompt error
- Concluding that a missing visible digest proves `system.transform` never executed
