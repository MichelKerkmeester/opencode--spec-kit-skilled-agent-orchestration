# Iteration 002 — Dimension(s): D2

## Scope this iteration
Reviewed the correctness contract for the advisor brief producer and the four runtime adapters. Focused on envelope typing, freshness state handling, fail-open semantics, and cross-runtime output parity for live/null/fail-open cases.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:180-217` → producer builds a typed shared-payload envelope with sanitized metadata and freshness-derived trust state.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:268-349` → `absent` freshness maps to `status: skipped`, `unavailable` maps to `status: degraded`, and both avoid model-visible brief output.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:214-255` → freshness resolves `absent | stale | live` from source presence and mtime ordering; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:288-318` adds generation-aware `unavailable` and recovered-generation handling.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:16-40` and `:42-140` → advisor payload contract round-trips and rejects unknown producer names, unknown metadata keys, prompt-derived refs, multiline skill labels, and out-of-range scores.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:83-166` → producer tests cover work-intent success, fail-open timeout, stale/json fallback, absent, and unavailable freshness cases.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-182` → Claude emits `hookSpecificOutput.additionalContext` only when renderer returns a brief.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-196` → Gemini mirrors the same behavior and normalizes to `hookEventName: 'UserPromptSubmit'`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-236` → Copilot shares the same producer/renderer path and wrapper fallback preserves the same brief string.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-279` → Codex follows the same success/null/fail-open branching.
- `.opencode/skill/system-spec-kit/mcp_server/tests/{claude,gemini,copilot,codex}-user-prompt-submit-hook.vitest.ts` → adapter suites normalize all four runtimes to the same visible brief for live output and `{}` for null/fail-open paths.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.44 (new D2 evidence, no new defect beyond the existing D1 privacy finding)
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 0
- dimensions_advanced: [D2]
- stuck_counter: 1

## Next iteration focus
Advance D3 performance and observability by checking cache behavior, metric namespace coverage, and the shipped measurement/analyzer scripts against the claimed performance gates.
