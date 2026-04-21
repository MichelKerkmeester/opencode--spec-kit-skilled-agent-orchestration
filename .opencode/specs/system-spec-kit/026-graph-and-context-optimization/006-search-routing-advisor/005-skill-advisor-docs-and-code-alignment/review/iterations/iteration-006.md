# Iteration 006 - Security

Focus dimension: security

Files reviewed:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`

## Findings

No new findings.

## Refinements

- F008 remains P2 only. The cache is process-local and no persisted prompt text was found, so the `Math.random()` HMAC secret source is a hardening recommendation rather than a release blocker.
- The diagnostic schema in `metrics.ts` excludes `prompt`, `promptFingerprint`, `promptExcerpt`, `stdout`, and `stderr`.

## Convergence

New findings ratio: 0.12. Continue.
