# Iteration 15 - correctness - server_core

## Dispatcher
- iteration: 15 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:42:36.449Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- .opencode/skill/system-spec-kit/mcp_server/core/config.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/unit-path-security.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### 1. Compact recovery can drop the recovered payload while still clearing the cache
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:257-271` (`main`), `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:190-215`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:111-137`
- `main()` writes the compact/startup output with `process.stdout.write(output)` and immediately clears `pendingCompactPrime`, then the CLI entry path forces `process.exit(0)`. That is not an acknowledged/awaited write. On piped stdout, Node can terminate before buffered output is flushed, which means the recovered context can be truncated or lost while the one-shot compact cache is already deleted.

```json
{
  "claim": "session-prime can acknowledge and clear the compact cache before the recovered payload is durably written to stdout, causing intermittent loss of post-compaction recovery context.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:257-271",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:190-215",
    ".opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:111-137"
  ],
  "counterevidenceSought": "Looked for a stdout write callback/await, a drain/finish wait, or an integration test that spawns the hook and asserts the full emitted payload before cache clearing; none were present in the reviewed code.",
  "alternativeExplanation": "This may appear stable on local TTY-backed runs where stdout is effectively synchronous and the payload is small.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the actual hook runtime guarantees synchronous stdout flush before process exit, or if another wrapper outside this file waits for write completion before terminating the process."
}
```

#### 2. `resolveDatabasePaths()` does not actually enforce its documented realpath-based escape check
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:54-79`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:91-101`
- The comment says the DB directory check uses `realpathSync` to reject paths that escape the project root/home, but the implementation only `realpathSync`s `os.tmpdir()`. The user-controlled `databaseDir` is checked with `path.resolve(...)` only, so a symlink such as `<repo>/db-link -> /outside/allowed/root` still passes the prefix check and returns a `databasePath` that writes through the symlink outside the intended boundary.

```json
{
  "claim": "A symlinked SPEC_KIT_DB_DIR can escape the allowed project/home/tmp roots because config.ts validates the lexical path, not the real target path.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/core/config.ts:54-79",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:91-101"
  ],
  "counterevidenceSought": "Looked for a later realpath-based revalidation of DATABASE_DIR/DATABASE_PATH or a dedicated symlink escape test for resolveDatabasePaths(); the reviewed coverage only checks the unset-env fallback.",
  "alternativeExplanation": "If deployments always provide a concrete, non-symlinked DB directory from a trusted launcher, the bug may stay latent.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if database initialization or a lower-level path-security helper resolves and rejects symlink targets before any filesystem writes occur."
}
```

### P2 Findings
- **False-positive hook coverage:** `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:28-50` and `:90-137` mostly assert serialized hook-state helpers and local string literals; they never execute `session-prime.ts`'s `handleCompact()`/`main()` path, so the stdout-flush/cache-clear failure above can ship with green tests.

## Traceability Checks
- `session-prime.ts` says it clears the compact payload only **after stdout write succeeds** (`session-prime.ts:257-258`), but the implementation uses a fire-and-forget `process.stdout.write(...)` and exits immediately afterward. The code does not meet its own fail-closed/data-loss comment.
- `core/config.ts` documents a `realpathSync`-based escape guard (`config.ts:54-56`), but the actual validation is lexical for the caller-supplied DB directory. The implementation is weaker than the stated intent.

## Confirmed-Clean Surfaces
- **`context-server.ts` startup scan single-flight guard:** `startupScan()` correctly prevents overlapping scans with `startupScanInProgress` and resets the guard in `finally` (`context-server.ts:1243-1344`), so repeated startup-triggered scans do not pile up.
- **`context-server.ts` shutdown path:** `fatalShutdown()` closes both file watchers, the local reranker, vector DB, skill graph DB, and MCP transport under a bounded deadline (`context-server.ts:1525-1584`). In the reviewed range, the cleanup ordering and idempotence look correct.
- **`session-prime.ts` startup fallback path:** `handleStartup()` cleanly degrades when cached summary reuse is rejected and still emits a startup surface plus recovery-tool guidance instead of throwing (`session-prime.ts:112-173`).

## Next Focus
- Check runtime-parity and integration coverage for the sibling hook surfaces (`hooks/gemini/*`) and for end-to-end hook execution, especially any other places that write to stdio and exit immediately.
