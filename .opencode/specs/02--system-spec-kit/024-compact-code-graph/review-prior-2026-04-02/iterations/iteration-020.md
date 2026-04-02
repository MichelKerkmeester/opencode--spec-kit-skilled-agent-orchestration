# Iteration 020: D2 Security Fresh Hook-State Temp File Deep Dive

## Focus

Fresh D2 deep dive on `hook-state.ts` temp-file security, specifically permissions, concurrent session collision behavior, project-hash isolation, and whether sensitive recovery state is persisted safely. I read the current review state first, then traced the live hook-state read/write consumers in `compact-inject.ts`, `session-prime.ts`, and `session-stop.ts`.

## New Findings

### [P1] F027 - lossy `session_id` filename sanitization lets distinct hook sessions alias the same state file and replay each other's recovery state

- `session_id` enters the hook layer directly from parsed stdin JSON, with no allowlist or canonicalization beyond whatever each consumer does later.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:13-21][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:30-40]
- `getStatePath()` derives the filename by replacing every non-`[a-zA-Z0-9_-]` character with `_`, so distinct IDs can collapse onto the same JSON path instead of remaining injective.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:40-43]
- `updateState()` loads whatever record already lives at that aliased path and blindly spreads `...existing` back into the new state before writing, with no exact-match check that `existing.claudeSessionId` still equals the current `sessionId`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:78-95]
- `session-prime.ts` later trusts the loaded `pendingCompactPrime` from that same file and emits it as `Recovered Context (Post-Compaction)`, so an aliased session can replay another session's cached compact payload, `lastSpecFolder`, and related recovery metadata.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:38-71]
- Local sanitizer spot-check confirmed the collision shape directly: `a/b`, `a?b`, `a.b`, `a b`, `a:b`, and `a_b` all normalize to `a_b`.
- **Impact:** session isolation is enforced only by a lossy filename transform, not by exact session identity. Distinct hook sessions that normalize to the same basename can overwrite each other's `pendingCompactPrime`, `sessionSummary`, `metrics`, and `lastSpecFolder`, and the read path can surface another session's cached recovery payload back into Claude.
- **Fix:** use a collision-resistant reversible encoding or a keyed hash of the full `session_id` for filenames, and reject any loaded state whose stored `claudeSessionId` does not exactly match the current session before reading or merging.

### [P2] F028 - hook-state persists assistant summaries and recovery payloads to disk without explicit restrictive permissions

- The persisted `HookState` schema includes both `sessionSummary` and `pendingCompactPrime.payload`, so the temp JSON is not just bookkeeping; it stores compact-recovery text and assistant-derived session content at rest.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:14-28]
- `session-stop.ts` writes a summary extracted from `last_assistant_message`, and `compact-inject.ts` writes the compact recovery payload that SessionStart later replays.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:137-143][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:223-239]
- `ensureStateDir()` creates the hook-state directory with `mkdirSync(..., { recursive: true })`, and `saveState()` writes the `.tmp` JSON with `writeFileSync(..., 'utf-8')`; neither call sets a restrictive mode or hardens permissions after create.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:46-53][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:65-75]
- **Impact:** confidentiality depends entirely on ambient `os.tmpdir()` policy and process umask rather than on the hook layer's own controls. On POSIX hosts with a shared/traversable temp root and the common `022` umask, these JSON files are created as readable plain-text recovery state (`0755` directory / `0644` file in local spot-checks when no stricter parent policy is present).
- **Fix:** create the state directory with `0700`, write both the temp file and final file as `0600`, and consider minimizing or encrypting transcript-derived recovery content at rest.

## Verified Healthy / Narrowed Non-Findings

- `session_id` path traversal remains ruled out: `getStatePath()` sanitizes the filename before `join(...)`, so this slice does not allow `../` escape through the session ID itself.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:40-43]
- I did **not** add a separate project-hash collision finding in this pass. `getProjectHash()` is only a 12-hex (48-bit) prefix, but the high-signal practical issue in the live code is the much easier per-session filename aliasing above; this pass did not demonstrate a concrete cross-project bucket collision.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:30-37]

## Notes

- The hook-state write path is still an unlocked read/merge/write sequence (`loadState()` -> merge -> `saveState()`), and `session-stop.ts` performs several such cycles in one hook run.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:55-95][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:137-167]
- I did not split that TOCTOU shape into a separate net-new finding here because, in this slice, it mainly amplifies the stronger concrete integrity break already captured by `F027`: once two sessions can alias the same path, the unlocked merge/write flow makes their state clobbering easier and less deterministic.

## Summary

- New findings: **`F027` [P1]**, **`F028` [P2]**
- New findings delta: **`+0 P0`, `+1 P1`, `+1 P2`**
- Reconfirmed non-finding: `session_id` path traversal remains ruled out
- Recommended next focus: harden hook-state identity and confidentiality together — make filenames collision-resistant, verify exact `claudeSessionId` on read, and enforce `0700`/`0600` temp-state permissions before the next D2 closure pass.
