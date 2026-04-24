# Iteration 035 — Dimension(s): D7

## Scope this iteration
This iteration followed the default D7 rotation and performed a fresh spot-check of the runtime-registration and observability-reference docs. The goal was to confirm the Phase 025 documentation fixes for workspace-safe build guidance, Codex registration status, and Copilot callback wording still match the shipped repo surfaces without reopening already-tracked late-cycle D7 drift.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:26,30-34,79-81` → D7 remains the documentation-accuracy dimension, with explicit emphasis on verifying post-025 fixes and checking fresh evidence instead of recycling earlier iterations.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:36` → cumulative state entering iteration 35 was P0=0, P1=8, P2=4.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-034.md:41-42` → prior iteration handed focus to a D7 documentation re-check around commands, artifact names, and runtime-status claims.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-93` → the hook reference still tells operators to build from repo root with `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` before enabling runtime hooks.
- `.opencode/skill/skill-advisor/README.md:94-103` → the README still mirrors the same workspace-safe build command and positions the runtime hook registration flow around the shared producer.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:203-256` → the Codex section still documents shipped `.codex/settings.json` and `.codex/policy.json` registration surfaces and the current runtime rules.
- `.codex/settings.json:1-26` → the repo still ships Codex `UserPromptSubmit` and `PreToolUse` registrations pointing at the compiled Phase 020 hook adapters.
- `.codex/policy.json:1-42` → the repo still ships the Codex Bash denylist policy surface alongside the registered adapter.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:37-44,115-126,183-191` → the Codex PreToolUse implementation still accepts denylist entries from the repo-local policy file and applies them only to Bash commands.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:40-44` → the live-session wrapper guide still documents an explicit runnable analyzer command via `npx tsx`.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124` → Copilot integration is still documented as callback-style `onToolInvoked(...)` wiring.
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:649-658` → the feature catalog still points operators at the wrapper setup doc and explicitly states that Copilot uses callback-style integration rather than a generic settings-file model.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-005 remains closed for the workspace-safe build command.** The hook reference and package README still use the repo-root-safe `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` command instead of the previously incorrect workspace form (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-93`, `.opencode/skill/skill-advisor/README.md:94-103`).
- **DR-P1-005 remains closed for Codex status alignment.** The documentation still describes shipped Codex registration surfaces, and the repo still contains matching `.codex/settings.json` and `.codex/policy.json` files wired to the compiled hook adapters and deny-policy path (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:203-256`, `.codex/settings.json:1-26`, `.codex/policy.json:1-42`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:37-44,115-126,183-191`).
- **DR-P1-005 remains closed for the Copilot callback-model docs.** Both the wrapper setup guide and the feature catalog still document Copilot integration via callback-style `onToolInvoked(...)` wiring rather than a generic settings-file model (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124`, `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:649-658`).

## Metrics
- newInfoRatio: 0.01
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Rotate to D1 and re-check the post-025 prompt-handling and privacy surfaces for any residual gaps outside the already-verified stdin and disable-flag fixes.
