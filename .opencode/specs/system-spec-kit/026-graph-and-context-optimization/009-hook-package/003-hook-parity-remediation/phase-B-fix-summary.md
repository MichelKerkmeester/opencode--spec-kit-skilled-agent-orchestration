# Phase B Fix Summary

## Findings Addressed

- HOOK-P1-002: Codex `UserPromptSubmit` now uses a native TypeScript scorer path first, extends fallback timeout handling, and returns a prompt-safe stale advisory on timeout instead of empty `{}`.
- HOOK-P1-003: Codex hook-policy detection no longer depends on `codex hooks list`; valid `.codex/settings.json` is the project registration signal and the version probe scrubs Superset/Codex TUI env.

## Files Modified

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/codex-hook-policy.js`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/lib/subprocess.js`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/lib/skill-advisor-brief.js`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/003-hook-parity-remediation/phase-B-fix-summary.md`

## Verification Output

```text
$ cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck
> @spec-kit/mcp-server@1.8.0 typecheck
> tsc --noEmit --composite false -p tsconfig.json
exit 0
```

```text
$ cd .opencode/skill/system-spec-kit/mcp_server && npm run build
> @spec-kit/mcp-server@1.8.0 build
> tsc --build
exit 0
```

```text
$ cd .opencode/skill/system-spec-kit/mcp_server && timeout 80 ../scripts/node_modules/.bin/vitest run tests/codex-hook-policy.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts skill-advisor/tests/legacy/advisor-subprocess.vitest.ts skill-advisor/tests/legacy/advisor-observability.vitest.ts --reporter=default
✓ mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts (9 tests)
✓ mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts (9 tests)
✓ mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts (5 tests)
✓ mcp_server/tests/codex-hook-policy.vitest.ts (6 tests)
Test Files 4 passed (4)
Tests 29 passed (29)
exit 0
```

```text
$ printf '%s\n' '{"prompt":"implement TypeScript hook remediation","cwd":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"}' | SPECKIT_CODEX_HOOK_TIMEOUT_MS=3000 node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
{"timestamp":"2026-04-21T10:59:38.438Z","runtime":"codex","status":"ok","freshness":"stale","durationMs":52,"cacheHit":false,"errorDetails":"SOURCE_NEWER_THAN_SKILL_GRAPH","skillLabel":"sk-code-opencode"}
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: stale; use sk-code-opencode 0.92/0.12 pass."}}
exit 0
```

```text
$ cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default
Result: NOT GREEN. Same baseline blocker as Phase A: scripts/tests/progressive-validation.vitest.ts timed out/fails outside Phase B scope. Targeted Phase B suites pass.
```

## Proposed Commit Message

```text
feat(029/B): Codex advisor hook reliability (HOOK-P1-002 + HOOK-P1-003)
```
