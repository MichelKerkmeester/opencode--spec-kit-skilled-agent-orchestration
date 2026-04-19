# Iteration 010 — Dimension(s): D3

## Scope this iteration
Reviewed D3 Performance + Observability because the default rotation for iteration 10 selects D3, and iteration 009 explicitly queued D3 as the next focus. I focused on fresh live-session telemetry evidence around under-load observability, avoiding the prior static-measurement pollution and prompt-cache hygiene findings.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-003.md:41 -> prior D3 required finding already covered static measurement polluting the live telemetry stream.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-003.md:44 -> prior D3 suggestion already covered unbounded exact-prompt cache hygiene.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:152 -> `classifyCompliance` is the central compliance classifier for telemetry records.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:171 -> the classifier builds `actualSet` from the record's actual reads.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:172 -> an empty `actualSet` is the branch used to detect missing expected reads.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:173 -> that empty-read branch returns `missing_expected`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:89 -> test coverage confirms unread predicted resources classify as `missing_expected`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:90 -> the test calls `classifyCompliance` directly.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:91 -> the test passes predicted resources to the classifier.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:96 -> the test simulates only a partial actual-read list.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:98 -> the expected class is `missing_expected`.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128 -> live telemetry is recorded only from `onToolCall`.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:130 -> non-`Read` tool calls return without recording.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:133 -> the wrapper extracts a path only from the current `Read` call arguments.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146 -> each observed read calls `recordSmartRouterCompliance`.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:153 -> each live record contains only the single observed `read.resource` in `actualReads`.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:160 -> the wrapper object exposes `configure`, `getState`, and `onToolCall`.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:177 -> the module-level live hook export is only `onToolCall`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:144 -> the analyzer computes under-load rate from `missing_expected` records.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:252 -> the report explains under-load as sessions missing predicted required resources.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-010-01, dimension D3, live-session telemetry cannot observe zero-read under-load sessions because the wrapper emits compliance records only when a `Read` tool call occurs. Evidence: the classifier has a real `missing_expected` signal for empty actual reads at .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:171 through .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:173, and tests lock that behavior at .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:89 through .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:98. The live wrapper, however, records only inside `onToolCall` at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128, returns for non-`Read` calls at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:130, and writes records with only the single observed read at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146 through .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:154. The exported wrapper surface is `configure`, `getState`, and `onToolCall` at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:160 through .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:164, with the module-level export likewise limited to `onToolCall` at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:177 through .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:178. Impact: if a live session configures a predicted route but never reads any predicted resource, no record is emitted, so the analyzer's under-load rate at .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:144 through .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:147 and report claim at .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:251 through .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:254 silently miss the most important under-load case. Remediation: add an observe-only session finalization/flush API that records one `actualReads: []` compliance event when a configured prompt completes without any matching `Read`, and add a regression test for no-read and read-aggregation behavior.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.28 (fresh D3 evidence found a separate live-session under-load observability gap; prior D3 cache and static-measurement issues were read only to avoid duplication)
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 6
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 Maintainability + sk-code-opencode alignment with fresh TypeScript strictness and comment-discipline evidence from the skill-advisor modules.
