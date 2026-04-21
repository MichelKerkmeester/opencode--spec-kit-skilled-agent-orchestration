# Iteration 005 - Correctness Saturation

## Prior State Read

Read state, registry, and iterations 001-004. Active findings entering this pass: P1=6, P2=2.

## Verification

- Re-ran scoped vitest: 19 files, 155 tests passed.
- Re-read `codex-hook-policy.ts` and `prompt-wrapper.ts`, this time specifically checking all three `CodexHookAvailability` branches.

## Findings

### P1-COR-003 - Codex prompt wrapper also suppresses fallback when hook policy is `partial`

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:16` defines `CodexHookAvailability` as `live | partial | unavailable`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222` returns `partial` when settings JSON is missing or invalid.
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:229` records `CODEX_SETTINGS_MISSING_OR_INVALID` as the reason for that partial state.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116` to `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:119` returns `{}` for any state except `unavailable`.

Expected: `partial` should be handled intentionally. If native hooks are only partial, the wrapper fallback is the safety path that can still inject the advisor brief.

Actual: `partial` behaves the same as `live` in `handleCodexPromptWrapper`, so missing or invalid settings suppress the fallback instead of activating it.

Severity: P1 correctness. This is a second wrong-branch case in the fallback selector and likely affects first-run or unregistered Codex installations.

## Previously Found, Rechecked

- P1-COR-001 remains valid: parser numeric checks still use `Number.isNaN`.
- P1-COR-002 remains valid: valid but hookless settings still report `live`.

## Churn

Net-new findings this iteration: P1=1. Severity-weighted new-findings ratio: 0.13.
