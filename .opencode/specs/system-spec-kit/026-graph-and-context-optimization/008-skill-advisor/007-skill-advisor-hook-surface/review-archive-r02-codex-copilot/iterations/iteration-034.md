# Iteration 034 — Dimension(s): D6

## Scope this iteration
Reviewed the D6 regression surface around the canonical advisor test suites because iteration 34 rotates to test coverage. I focused on whether the shipped parity and plugin tests exercise real cache-invalidation and cross-runtime build paths, not just render-only happy paths.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:69-76 → the plugin harness resets state with `onSessionEnd()` in `beforeEach`, but does not assert session-end invalidation behavior as a user-visible contract.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-117 → plugin coverage exercises TTL reuse and hit-rate math for repeated prompts, not freshness/source-signature invalidation.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161-194 → plugin negative-path coverage checks timeout and spawn-error fail-open behavior only.
- .opencode/plugins/spec-kit-skill-advisor.js:243-264 → the shipped plugin caches successful bridge responses in a host-side TTL map before returning `additionalContext`.
- .opencode/plugins/spec-kit-skill-advisor.js:323-331 → the plugin also implements a distinct `onSessionEnd()` invalidation path that deletes session-scoped cache entries.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:78-88 → the canonical runtime-parity harness replaces the shared brief builder with `vi.fn(async () => result)` for every runtime variant.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-135 → the parity assertion then checks identical visible brief text only, across the stubbed outputs.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-171 → the real Claude hook passes runtime/workspace context into `buildBrief(...)` and emits diagnostics from the returned freshness/result metadata.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-211 → the Copilot hook likewise depends on the real `buildBrief(...)` result for runtime-specific diagnostics and brief emission.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:194-208 → freshness invalidation is covered at the helper layer (`getAdvisorFreshness`) when the source signature changes, not through a hook/runtime integration path.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-034-01, dimension D6, the canonical cross-runtime parity suite is still render-only because it stubs the shared brief builder instead of exercising the real hook-to-builder path. Evidence: `advisor-runtime-parity.vitest.ts` injects `buildBrief = vi.fn(async () => result)` into every runtime at `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:78-88`, then asserts identical visible brief text only at `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-135`. The real Claude and Copilot hooks both depend on runtime-specific `buildBrief(...)` inputs and returned freshness/diagnostic metadata at `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-171` and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-211`, while `advisor-freshness.vitest.ts` covers source-signature invalidation only at the helper layer at `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:194-208`. Impact: the headline parity suite can pass even if a runtime starts forwarding the wrong workspace/session context into the real builder or diverges in freshness-driven diagnostics, so regressions in the actual hook/build integration could ship without tripping the canonical parity guard. Remediation: add one end-to-end parity case that uses the real `buildSkillAdvisorBrief` path against a temporary workspace and asserts both emitted brief text and freshness/diagnostic metadata across the four runtime hooks.

### Re-verified (no new severity)
- P1-033-01 remains under-covered by tests: the OpenCode plugin still has explicit TTL-cache and fail-open coverage at `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-117` and `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161-194`, while the source still keeps separate host-cache reuse and `onSessionEnd()` invalidation paths at `.opencode/plugins/spec-kit-skill-advisor.js:243-264` and `.opencode/plugins/spec-kit-skill-advisor.js:323-331`. Fresh D6 evidence shows the suite still does not pin either source-signature invalidation or session-end cache flush as a regression contract, so the iteration-033 stale-brief parity risk remains credible without increasing severity.

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 18
- cumulative_p2: 17
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 by re-checking whether the published hook and playbook docs still point to command paths and parity claims that match the now-expanded runtime and plugin surfaces.
