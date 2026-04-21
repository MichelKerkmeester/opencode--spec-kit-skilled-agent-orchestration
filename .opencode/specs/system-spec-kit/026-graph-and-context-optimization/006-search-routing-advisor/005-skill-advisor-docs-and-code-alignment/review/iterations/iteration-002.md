# Iteration 002 - Security

Focus dimension: security

Files reviewed:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/*/user-prompt-submit.ts`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F008 | P2 | `prompt-cache.ts` builds the default HMAC secret from `process.pid`, launch time, and `Math.random()`. Because this key protects prompt-derived cache keys, cryptographic randomness would be a stronger default. |

## Checks With No Finding

- Diagnostics reject prompt-like fields in `metrics.ts` via `FORBIDDEN_DIAGNOSTIC_FIELDS`.
- The Codex prompt wrapper states that prompt rewriting remains in memory and emits no prompt text.
- No hardcoded secret or raw prompt persistence was found in the reviewed hook files.

## Convergence

New findings ratio: 0.16. Continue.
