# Review Iteration 1: Correctness - Hook Scripts

## Focus

D1 Correctness for the Claude hook scripts, with emphasis on cache lifecycle, persisted-state invariants, fallback behavior, and edge-case handling in `compact-inject.ts`, `session-prime.ts`, and `hook-state.ts`.

## Scope

- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- Cross-checked `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md`
- Cross-checked `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md`
- Cross-checked `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md`
- Cross-checked hook playbook coverage in `248-precompact-hook.md`, `249-session-start-compact.md`, and `250-session-start-startup.md`
- Spot-checked supporting runtime helpers in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts`

## Scorecard

- Verdict: CONDITIONAL
- Findings: 0 P0, 2 P1, 2 P2
- Verification:
  - `TMPDIR="$PWD/.tmp/vitest-tmp" node .opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run .opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts --root .opencode/skill/system-spec-kit/mcp_server`
  - Result: PASS (4 files, 24 tests)
- Confidence: High

## Findings

### [P1] `SessionStart(source=compact)` clears the only recovery payload before stdout injection succeeds

- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-53`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:212-215`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:49-52`, `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:16-27`
- **Issue:** `handleCompact()` deletes `pendingCompactPrime` immediately after reading it, but the actual injection does not happen until `main()` later formats the sections, truncates the output, and writes to stdout. Any failure between those two points drops the only cached recovery payload and degrades the next startup to the generic fallback.
- **Impact:** Compact recovery becomes one-shot and fragile. A transient output failure permanently discards the only cached context the hook was meant to preserve.
- **Hunter:** I traced the exact control flow: read cache, clear cache, return sections, then only later format and emit to stdout. There is no retry or restore path if the post-clear path fails.
- **Skeptic:** The post-clear path is short and mostly synchronous, so failures here may be uncommon in normal local runs.
- **Referee:** The invariant is still broken. This cache exists specifically to survive compaction; deleting it before confirmed injection turns any rare output failure into permanent data loss. The phase contract and manual playbook both describe cleanup after successful injection, not before it.

### [P1] State persistence failures are silently converted into false-positive success

- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:66-95`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:234-241`, `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/248-precompact-hook.md:16-29`
- **Issue:** `saveState()` logs write/rename failures but does not signal them back to callers. `updateState()` always returns the in-memory object as if persistence succeeded, and `compact-inject.ts` logs "Cached compact context" unconditionally right after calling it. If the temp directory is unwritable or the atomic rename fails, PreCompact reports success but SessionStart has no cached payload to recover from.
- **Impact:** Operators and later hooks receive a false success signal precisely when the compact-recovery bridge has failed, which makes the failure mode both user-visible and harder to debug.
- **Hunter:** I verified that `saveState()` swallows errors, `updateState()` does not inspect the result of persistence, and `compact-inject.ts` has no read-after-write or boolean success check before logging the cache success message.
- **Skeptic:** The temp directory may be reliably writable in the intended runtime, making this mostly a degraded-path concern.
- **Referee:** Hooks are explicitly designed to fail soft rather than crash, so degraded-path honesty matters. Reporting a successful cache when nothing was persisted violates the recovery contract and will mislead anyone debugging compact recovery.

### [P2] Compact recovery never validates cache freshness, so stale payloads remain injectable indefinitely

- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-50`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:98-117`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:113-119`
- **Issue:** The compact path reads `cachedAt` only for logging and never checks whether the payload is still fresh before injecting it. `cleanStaleStates()` exists, but it only runs in the manual `--finalize` path and is not part of normal SessionStart reads.
- **Impact:** An old compact payload can be injected into a later session even when the cached recovery state is no longer trustworthy.

### [P2] The startup "Working Memory" section is unreachable because `workingSet` is not part of hook state and has no producer

- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:119-128`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-28`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:82-88`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:31-35`
- **Issue:** `handleStartup()` tries to render a `workingSet` array from hook state, but `HookState` does not define that field, the default state initializer does not allocate it, and the reviewed hook-state paths do not populate it.
- **Impact:** The startup output contains a dead branch that can never produce real-session output, which quietly narrows the context the feature appears to promise.

## Cross-Reference Results

- The two-step transport model from DR-006 is present: `PreCompact` caches state and `SessionStart(source=compact)` injects it.
- The D1 failure modes above show that the transport is not yet robust: cache cleanup happens too early, persistence failures are over-reported as success, and freshness is never checked on read.
- The reviewed recovery copy does correctly include `profile: "resume"` alongside `mode: "resume"` in the resume instructions, so the earlier DR-007 regression is not present in these target files.
- `compact-inject.ts` still does not retrieve real Memory / Code Graph / CocoIndex content; it merges transcript-derived strings and hints. I am not scoring that as a D1 finding in this pass, but it should stay in play for the packet's traceability review because the implementation claims a stronger hybrid merge than the hook currently performs.

## Ruled Out

- I did not find a crash-on-empty-stdin defect in these three files. Both reviewed hook entrypoints degrade to clean exit behavior when stdin parsing fails or returns no data.
- I did not find an atomic-write bug in the happy-path `hook-state.ts` save routine; the temp-file + rename pattern is correct within one directory.
- I did not find a wrong-return-type or obvious sync/async mismatch in the reviewed hook entrypoints.

## Sources Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/248-precompact-hook.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts`

## Assessment

This hook slice is stable enough to build and pass the existing targeted tests, but the recovery contract is still brittle in the places where persistence and reinjection matter most. The main risk is not a crash; it is silent recovery degradation that leaves Claude with less context than the hook layer claims it preserved.

## Reflection

The current tests validate helper behavior and happy-path file fixtures, but they do not execute end-to-end failure paths around cache deletion, save failures, or stale reads. That gap explains why the reviewed D1 defects can coexist with a green targeted hook test slice. The next security and traceability passes should keep treating temp-state handling and claimed hybrid-recovery behavior as first-class review surfaces.
