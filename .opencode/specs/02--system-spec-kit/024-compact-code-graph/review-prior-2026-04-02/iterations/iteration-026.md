# Iteration 026: D3 Traceability Hook Registration Audit

## Focus

Fresh D3 traceability pass on Claude hook registration. This iteration compares `.claude/settings.local.json` against the parent spec's hook architecture section and the live Claude hook entrypoints for `PreCompact`, `SessionStart`, and `Stop`.

## Verified Healthy

- `.claude/settings.local.json` does register all three lifecycle hooks named in the parent spec: `PreCompact`, `SessionStart`, and `Stop`.[SOURCE: .claude/settings.local.json:5-39][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:37-45]
- Each registered command points at a real compiled entrypoint under `mcp_server/dist/hooks/claude/`, and the corresponding built files exist for all three hooks.[SOURCE: .claude/settings.local.json:10-12][SOURCE: .claude/settings.local.json:21-23][SOURCE: .claude/settings.local.json:32-35][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js:1-14][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js:1-20][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:1-16]
- The live `SessionStart` handler still implements source-specific behavior for `compact`, `startup`, `resume`, and `clear`; that behavior is real, but it is implemented inside `session-prime.ts`, not expressed as separate registrations in the settings file.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:38-72][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-166][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:184-204]

## Re-confirmed Existing Drift

- The parent spec's hook layout block still points readers at the obsolete `.opencode/skill/system-spec-kit/scripts/hooks/claude/` and `scripts/dist/hooks/claude/*.js` locations instead of the live `mcp_server/hooks/claude/` and `mcp_server/dist/hooks/claude/` layout. This remains the earlier stale-path issue, not a new finding in this pass.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:98-110][SOURCE: .claude/settings.local.json:10-12][SOURCE: .claude/settings.local.json:21-23][SOURCE: .claude/settings.local.json:32-35]

## New Findings

### [P2] F030 - The parent spec describes source-scoped `SessionStart(...)` matcher wiring, but the shipped Claude settings register a single unscoped `SessionStart` hook

- **Finding:** The parent spec documents `SessionStart(source=compact)` and `SessionStart(source=startup|resume)` as if those source-specific flows are directly represented in the hook architecture, and it explicitly calls out `source` matcher support on `SessionStart`.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:40-44]
- **Evidence:** `.claude/settings.local.json` contains only one `SessionStart` registration with a single command pointing at `session-prime.js`; it does not declare any registration-level `matcher`, `source`, or multiple `SessionStart` entries for different startup modes.[SOURCE: .claude/settings.local.json:17-26]
- **Counterevidence checked:** The runtime does still branch on `input.source`, but that routing lives only inside `session-prime.ts`'s internal `switch (source)` over `compact`, `startup`, `resume`, and `clear`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177-204]
- **Impact:** A reviewer can verify that the three lifecycle hooks are registered, but cannot verify the spec's source-scoped `SessionStart` architecture from the settings file alone. The registration surface and the documented architecture no longer line up one-to-one.
- **Fix:** Either update the parent spec to describe one unscoped `SessionStart` registration with in-script `source` branching, or add explicit matcher-scoped `SessionStart` registrations if that registration granularity is intended to be canonical.
- **Severity:** P2

## Summary

- All three Claude lifecycle hooks described in the parent spec are registered in `.claude/settings.local.json`.
- The registered command paths match live compiled hook files under `mcp_server/dist/hooks/claude/`.
- No hook described in the parent spec is missing from the settings file.
- The remaining registration-level traceability drift is narrower: the parent spec still describes `SessionStart(source=...)` matcher-style wiring that the shipped settings file does not declare, because source dispatch now happens inside `session-prime.ts`.
- New findings delta: **+0 P0, +0 P1, +1 P2 (`F030`)**.
