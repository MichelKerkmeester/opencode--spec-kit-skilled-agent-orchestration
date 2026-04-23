# Iteration 6: Q5 transcript identity + replay coverage

## Focus

Audit **Q5**: whether packet `001-cache-warning-hooks` actually honors the documented transcript-identity and cache-token carry-forward contract, and whether the replay harness covers real-world stop-hook transcript shapes and resume paths. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/spec.md:123-125,202-204`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/implementation-summary.md:45-55`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/research.md:45-50`]

## Actions Taken

1. Read the packet contract docs (`spec.md`, `implementation-summary.md`, `research.md`) to extract the stated identity and idempotency invariants for producer metadata, cache-token carry-forward, and replay proof obligations. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/spec.md:121-125,201-204,275-276`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/implementation-summary.md:45-55`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/research.md:45-50,82-87`]
2. Read the persisted hook-state schema and storage helpers to map what actually identifies a cached producer state on disk and what fields are merely payload. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215-225,332-335,391-410,424-452`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:667-767`]
3. Read the Stop-hook producer path to trace fingerprint generation, transcript parsing, packet retargeting, and the single atomic state patch. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:167-185,243-265,318-395,420-451,463-511`] 
4. Read the replay harness, its sole fixture, and the replay/autosave tests to enumerate what transcript and session shapes are exercised versus omitted. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts:66-117`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl:1-3`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:26-100,118-224`]
5. Read the resume-side cached-summary consumer and the resume/token tests to determine whether cache-token carry-forward survives beyond the original stop event and how candidates are selected on warm resume. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:246-255,317-375,423-441,460-505,567-579`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19-53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:23-108`]

## Findings

| Invariant | Documented | Code enforcer (file:line or "none") | Replay coverage (file:line or "none") | Verdict |
| --- | --- | --- | --- | --- |
| `claudeSessionId` remains primary, `speckitSessionId` nullable | `research.md:48-50`; `spec.md:123-124` | `hook-state.ts:217-225,392-400` | `session-token-resume.vitest.ts:19-29,47-53` | **honored, but session-scoped not transcript-scoped** |
| Producer metadata must persist transcript reference + cache-token fields | `spec.md:123-125,202-204`; `implementation-summary.md:45-55` | `session-stop.ts:243-265,375-382`; `session-resume.ts:317-346` | `hook-session-stop-replay.vitest.ts:26-54` | **honored narrowly** |
| Cached resume must reject stale or mismatched transcript identity | implied by `implementation-summary.md:45-55` continuity seam | `session-resume.ts:246-255,349-375` | **none** | **honored for same-path stat match only** |
| Packet retarget should keep scope and producer metadata aligned | `spec.md:124,131-133`; `research.md:84-87` | `session-stop.ts:428-451`; `hook-state.ts:391-399` | **none** | **drift** |
| Replay must prove same-transcript idempotency | `spec.md:125,204`; `research.md:50` | `session-stop.ts:386-395,477-498` | `hook-session-stop-replay.vitest.ts:56-100` | **honored for one fixture** |
| Replay should cover real resume/retarget lifecycle edges before downstream trust | `spec.md:122,125`; `implementation-summary.md:53-55` | **none** | `hook-session-stop-replay.vitest.ts:26-100,118-224` only | **unenforced** |

### P1

- `FIND-iter006-state-key-is-claude-session-not-transcript`  
  The persisted hook-state identity is still keyed by **hashed `claudeSessionId` + cwd/project hash**, not by transcript identity. `producerMetadata.transcript` is stored inside the state blob, but the file path on disk is derived solely from `sessionId`, which means multiple transcript generations inside one Claude session collapse into a single state identity before any transcript-level check happens. Resume-side fallback likewise enumerates states by `specFolder` or `claudeSessionId`, not by transcript fingerprint. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:321-335`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:667-767`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:466-505,567-579`]

- `FIND-iter006-fingerprint-is-stat-derived-and-path-sensitive`  
  The code's notion of transcript identity is the 16-char SHA-256 prefix of **`${transcriptPath}:${size}:${mtimeMs}`**, both when the Stop hook writes producer metadata and when session resume re-validates it. That protects against same-path drift, but it also means a moved, rotated, compacted, or archived transcript becomes a brand-new identity even if the content is semantically the same, while the formula itself carries no content hash or producer/session salt. The implementation therefore honors only a **same-path, same-stat generation identity**, not a stable transcript lineage identity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:243-265`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:246-255,361-375`]

- `FIND-iter006-retarget-can-preserve-stale-producer-metadata`  
  `processStopHook()` updates `lastSpecFolder` independently from producer metadata. When `parseTranscript()` reports `no_new_messages`, the handler skips `patch.producerMetadata`, but a later packet retarget can still patch `lastSpecFolder`; `prepareStateForPersist()` then merges that patch over the existing state and preserves the old `producerMetadata`. That creates a cross-packet leak mode where the autosave target moves to a new packet while transcript identity and cache-token carry-forward still describe the previous transcript generation. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:386-395,428-451,477-488`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:391-410`]

### P2

- `FIND-iter006-replay-harness-is-single-session-single-fixture`  
  The replay harness always copies **one fixture file** into a new sandbox, injects **one session ID**, and calls `processStopHook(..., { autosaveMode: 'disabled' })`. The main replay spec then exercises only one three-line JSONL fixture, same-transcript double replay, and one autosave failure-injection path. There is no coverage for multi-session transcripts, transcript-path rotation, in-flight compaction, archive restore, cold-start versus warm-resume on different transcript files, or any mixed producer metadata history. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts:66-117`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl:1-3`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:26-100,118-224`]

- `FIND-iter006-carry-forward-tests-stop-at-parse-or-load`  
  The token and resume tests do not actually verify **semantic cache-token carry-forward across lifecycle boundaries**. `hook-stop-token-tracking.vitest.ts` stops at raw `parseTranscript()` behavior, and `session-token-resume.vitest.ts` only checks generic state reload plus `pendingCompactPrime`, not producer metadata, transcript identity, or cache-token reuse after restart. So the repo proves that cache-token fields can be parsed and that state can be reloaded, but not that producer metadata remains correct across session kill, crash, archive restore, or compaction/fork boundaries. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:23-108`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19-53`]

- `FIND-iter006-warm-resume-selects-newest-acceptable-scope-peer-not-same-lineage`  
  Cached resume does consume `producerMetadata`, but it chooses candidates from **all recent states matching the requested `specFolder` or `claudeSessionId`**, then accepts the first state that passes freshness/fidelity checks. That means the warm-resume contract is effectively "newest acceptable cached state in scope," not "the same transcript lineage that produced the current session." This is safer than blind reuse because transcript mismatches fail closed, but it still permits one logical packet scope to split into multiple independently acceptable identities rather than one canonical transcript lineage. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:667-767`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:445-505,567-579`]

## Questions Answered

Q5 is **partially answered**.

1. **Documented identity fields** in live code are `claudeSessionId`, nullable `speckitSessionId`, `lastSpecFolder`, `producerMetadata.lastClaudeTurnAt`, `producerMetadata.transcript.{path,fingerprint,sizeBytes,modifiedAt}`, and `producerMetadata.cacheTokens`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215-225`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:243-265`]
2. **Different transcripts can still be conflated** at the storage layer because the persisted state file is session-keyed, not transcript-keyed. Resume recovers from that partially by rechecking transcript stats before reuse. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:332-335,667-767`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:349-375`]
3. **One transcript can split into a new identity on move/rotate/archive** because the fingerprint depends on path and file stats rather than stable content identity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:248-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:246-255`]
4. **Replay/idempotency is only proven for one fixture and same-session double replay.** The harness does not cover compaction, transcript retargeting, archive restore, or cross-session warm resume. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts:66-117`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:56-100`]

## Questions Remaining (Q6, Q7)

1. **Q6** — whether `reduce-state.cjs`, prompt-pack output, and the live deep-research JSONL/state schema still agree after the packet-local artifact-root drift already found in iteration 1.
2. **Q7** — whether the documented JSONL audit taxonomy matches the events actually emitted by live runtime code and reducers.

## Next Focus

Move to **Q6**: reducer/state rehydration schema agreement, especially the active-session artifact-root drift, lineage field handling, and typed JSONL event coverage across the continuity runtime.
