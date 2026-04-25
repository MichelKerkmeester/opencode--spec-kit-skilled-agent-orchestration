# Iteration 033 — Dimension(s): D5

## Scope this iteration
Reviewed the OpenCode plugin freshness path for D5 because iteration 33 rotates back to cross-runtime integration. I focused on whether the plugin's host-side cache still tracks the same source-signature invalidation contract that the native hook surfaces inherit from `buildSkillAdvisorBrief`.

## Evidence read
- .opencode/plugins/spec-kit-skill-advisor.js:74-83 -> the plugin cache key includes only session ID, prompt hash, threshold confidence, and max tokens.
- .opencode/plugins/spec-kit-skill-advisor.js:243-265 -> `getAdvisorContext()` returns any unexpired cached response without consulting bridge freshness or source signature state.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:352-381 -> the shared brief builder invalidates cache entries when `freshness.sourceSignature` changes before using cached recommendations or spawning the advisor subprocess.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-162 -> the native Claude hook calls `buildSkillAdvisorBrief(...)` on each prompt submission, so it inherits source-signature invalidation automatically.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-117 -> plugin tests exercise TTL reuse and hit rate only; they do not cover source-signature invalidation or skill-graph refresh during the TTL window.
- .opencode/skill/skill-advisor/README.md:125-127 -> the published plugin contract says the OpenCode plugin "reuses `buildSkillAdvisorBrief` and `renderAdvisorBrief` without reinvention" while also documenting a separate session cache in the host layer.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-033-01, dimension D5, the shipped OpenCode plugin can serve stale advisor briefs longer than the native hook surfaces because its host-side TTL cache ignores source-signature invalidation. Evidence: the plugin cache key is derived only from session ID, prompt hash, threshold confidence, and max tokens at `.opencode/plugins/spec-kit-skill-advisor.js:74-83`, and `getAdvisorContext()` returns any unexpired cached response directly at `.opencode/plugins/spec-kit-skill-advisor.js:243-265`. By contrast, the shared brief builder invalidates cached entries when `freshness.sourceSignature` changes before reuse at `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:352-381`, and the native hook path shown in Claude calls that builder for every prompt at `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-162`. The current plugin suite only verifies TTL reuse and hit-rate behavior, not freshness invalidation, at `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-117`. Impact: after a skill graph / metadata refresh, Claude/Gemini/Copilot/Codex hook surfaces can pick up the new recommendations immediately while the OpenCode plugin may keep injecting the old brief until its local TTL expires, breaking the intended cross-runtime parity during long-lived sessions. Remediation: thread the shared freshness/source-signature state into the plugin host cache key or bypass the host cache when the bridge reports a changed source signature, and add a regression test that mutates the advisor source signature inside the TTL window.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.06
- cumulative_p0: 0
- cumulative_p1: 18
- cumulative_p2: 16
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Advance D6 by checking whether the plugin and native-hook suites cover freshness/source-signature invalidation regressions instead of only steady-state cache behavior.
