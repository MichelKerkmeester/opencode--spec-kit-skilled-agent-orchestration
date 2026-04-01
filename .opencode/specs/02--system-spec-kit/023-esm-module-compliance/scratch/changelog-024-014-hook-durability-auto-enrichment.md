# Changelog: 024/014-hook-durability-auto-enrichment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 014-hook-durability-auto-enrichment -- 2026-03-31

When context compaction fires, the hook system caches critical session state and replays it later to help the AI recover. But several reliability and security gaps meant that cached payloads could be silently lost, stale data could be injected, and on shared systems, other users could potentially read sensitive session data. This phase fixes six P1 reliability and security bugs -- race conditions, silent disk failures, injection vulnerabilities, session ID collisions, and insecure file permissions -- then adds eight P2 features that make the system automatically load context on every MCP tool call and enrich tool responses with structural code graph information, without any explicit user action.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment/`

---

## What Changed

### Bug Fixes (4 items)

### Cache race condition -- payload deleted before it was read

**Problem:**
When context compaction happened, the system cached a recovery payload so the AI could pick up where it left off. The problem was that this cached payload was deleted from storage *before* the system finished writing it out for injection. If that write to stdout failed for any reason -- a pipe error, a timing issue -- the payload was permanently gone. There was no backup and no retry mechanism. The AI would resume with no recovery context at all, with no indication that anything went wrong.

**Fix:**
Introduced a `readAndClearCompactPrime()` pattern that reverses the order of operations. The system now reads the cached payload first and holds it in memory, then attempts the write. Only after confirming the write succeeded does it clear the stored copy. If the write fails, the cached payload remains intact for a future recovery attempt. This eliminates silent data loss during compaction recovery.

---

### Silent disk failures -- write errors swallowed without notice

**Problem:**
The `saveState()` function, responsible for persisting hook state to disk, returned nothing. Every caller assumed the write succeeded. If the disk was full, if permissions were wrong, or if any other I/O error occurred, the failure was silently swallowed. The system continued operating as if the state had been saved, meaning the next recovery attempt would use stale or missing data without anyone knowing.

**Fix:**
`saveState()` now returns a boolean -- `true` when the write succeeds, `false` when it fails. Callers can detect and handle write failures explicitly instead of silently proceeding with corrupted or missing state. This turns an invisible failure mode into a visible, actionable one.

---

### Stale cache injection -- outdated context replayed during recovery

**Problem:**
When the system recovered from compaction, it loaded whatever cached payload was available, regardless of how old it was. A payload cached hours or even days ago could be injected as current recovery context, delivering outdated information about the session state, file contents, and task progress. The AI would resume working from a stale snapshot with no awareness that the context was no longer accurate.

**Fix:**
Added a 30-minute time-to-live (TTL) check on cached compact payloads. Before using a cached payload for recovery, the system now compares the `cachedAt` timestamp against the current time. If the payload is older than 30 minutes, it is rejected. This ensures recovery always uses reasonably fresh data. The TTL threshold is configurable for environments with different compaction patterns.

---

### Stop-hook field overloading -- two hooks sharing one storage slot

**Problem:**
The stop hook (which fires when the AI finishes a response) needed to save its own data, but instead of using a dedicated storage field, it reused the `pendingCompactPrime` field -- the same slot used by the compaction hook. This created confusion about what the field actually contained at any given moment. Was it compaction recovery data or stop-hook save data? The ambiguity made the code harder to reason about and opened the door to one hook accidentally overwriting the other's data.

**Fix:**
Introduced a dedicated `pendingStopSave` field in the hook state, with clear naming that reflects its purpose. Each hook now stores its data in its own slot, eliminating the ambiguity and preventing cross-hook interference.

---

### Security (3 items)

### Injection fencing -- recovered content treated as trusted input

**Problem:**
During recovery, transcript text from previous sessions was replayed under the label "Recovered Context" and treated as fully trusted content. There were no boundary markers distinguishing this replayed text from fresh, verified context. This meant that malicious or malformed content embedded in a previous transcript -- such as lines resembling system instructions like "You are..." or "SYSTEM:" -- could manipulate the AI's recovery behavior. The system had no way to distinguish between legitimate recovery data and injected instructions.

**Fix:**
Recovered content is now wrapped in provenance markers: `[SOURCE: hook-cache, cachedAt: <timestamp>]...[/SOURCE]`. These markers let any downstream code clearly distinguish hook-recovered content from fresh context. As a defense-in-depth layer, a `sanitizeRecoveredContent()` function strips known instruction-like patterns (lines starting with `You are`, `SYSTEM:`, `ASSISTANT:`, etc.) before the content is injected. Both the `wrapRecoveredCompactPayload()` wrapper and the sanitizer are implemented in a shared helpers module so all hook paths use the same protection.

---

### Session ID collisions -- different sessions sharing the same state file

**Problem:**
Hook state was persisted to files on disk, with filenames derived from the session ID. The filename sanitization logic replaced all special characters with underscores using a simple regex. This meant that two genuinely different session IDs -- for example, `ses/123` and `ses_123` -- would produce the identical filename `ses_123` and map to the same state file. The two sessions would unknowingly share state, causing cross-session interference where one session's recovery data could overwrite or corrupt another's.

**Fix:**
Replaced the character-replacement approach with SHA-256 hashing. The session ID is hashed and the first 16 hexadecimal characters are used as the filename. This provides 2^64 (about 18 quintillion) collision resistance, making it effectively impossible for distinct session IDs to map to the same file. Each session is guaranteed its own isolated state.

---

### Insecure file permissions -- session data readable by other users

**Problem:**
Temporary files containing assistant summaries, transcript snippets, and recovery payloads were created using the operating system's default file permissions. On shared systems (multi-user servers, CI environments), this meant other users on the same machine could read these files, potentially accessing sensitive session data including conversation content and recovery payloads.

**Fix:**
State directories are now created with permission mode `0700` (only the owner can read, write, or list the directory). Individual state files are written with permission mode `0600` (only the owner can read or write the file). These restrictive permissions ensure that session data is accessible only to the user who created it, even on shared systems.

---

### New Features (4 items)

### MCP first-call priming -- automatic context loading on any runtime

**Problem:**
AI sessions running on runtimes without hook support -- OpenCode, Codex CLI, Copilot CLI, and Gemini CLI -- had no way to automatically load context when a session started. Only Claude Code had hooks that could inject context at startup. On all other runtimes, the AI started each session with a blank slate unless the user manually triggered a context-loading tool. This meant critical information like constitutional memories (always-on rules) and code graph status was missing from early interactions.

**Fix:**
A module-level `sessionPrimed` flag now tracks whether the current session has been primed. On the very first MCP tool call in any session, the system automatically detects that priming has not occurred and loads constitutional memories and code graph status. This context is injected into the response via a `meta.sessionPriming` field in the response envelope (the structured wrapper around tool results). The flag resets when the server restarts. This works identically across all five supported runtimes -- Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI -- without requiring any configuration or hook support.

---

### Tool auto-enrichment -- structural code context alongside tool results

**Problem:**
When tools read or referenced files, the AI had no automatic awareness of how those files related to the rest of the codebase. It could see the file contents but not the file's imports, exports, or dependencies. Understanding structural relationships required explicit, separate tool calls to the code graph, which the AI often did not make. This meant the AI frequently operated with an incomplete picture of how changes to one file might affect others.

**Fix:**
Non-memory, non-graph tools that reference file paths in their inputs now automatically receive 1-hop structural graph context -- the file's direct imports, exports, and dependencies -- injected as a `meta.graphContext` field in the response. A `GRAPH_CONTEXT_EXCLUDED_TOOLS` set prevents recursive enrichment (graph tools querying themselves). A 250-millisecond `Promise.race` timeout ensures that if the graph database is slow to respond (for example, during initial database setup), the enrichment attempt is abandoned rather than delaying the primary tool response. The enrichment status is reported as `ok`, `timeout`, or `unavailable` so the AI knows whether graph context was successfully attached.

---

### Stale-on-read detection -- catching outdated code graph entries

**Problem:**
The code graph could serve outdated information about files that had changed on disk since the last indexing pass. If a file was edited by the user, by git, or by another tool after being indexed, the graph data for that file would be stale. Queries would return old import/export relationships, dependency information, and structural data without any indication that the information might be wrong.

**Fix:**
Added a `file_mtime_ms` column to the `code_files` table (implemented as a schema v2 migration that runs automatically on first access). Two new functions power the detection: `isFileStale()` compares a file's stored modification time against its current filesystem modification time, and `ensureFreshFiles()` checks a batch of files before returning results. When 1-2 files are found to be stale, they are reindexed synchronously (immediately, before returning results). When 3 or more are stale, a background asynchronous reindex is triggered and the results are returned with a staleness flag so the AI knows the data may not be fully current.

---

### Constitutional memory survival across compaction

**Problem:**
The Claude hook path -- from `compact-inject.ts` to `session-prime.ts` -- bypassed the `memory-surface.ts` module entirely. This module is responsible for loading constitutional memories (always-on rules that should appear in every interaction) and triggered memories (context-specific knowledge activated by pattern matching). When compaction fired and recovery used the hook path, these memories were simply lost. The AI would resume after compaction without its constitutional rules or any triggered knowledge, potentially violating standing instructions.

**Fix:**
The hook path's merge pipeline now calls `autoSurfaceAtCompaction()`, which loads constitutional and triggered memories through the same `memory-surface.ts` pipeline used by normal tool calls. Constitutional sections are prepended to the recovery output, ensuring they appear at the top of the recovered context. This guarantees that compaction recovery preserves the same always-on rules and triggered knowledge that the AI had before compaction fired.

---

### Architecture (4 items)

### Cache-token accounting -- missing tokens in usage totals

**Problem:**
Token usage totals and cost estimates reported to the user excluded an entire category of tokens: cache bucket tokens. Anthropic's API reports `cache_creation_tokens` (tokens used when writing to the prompt cache) and `cache_read_tokens` (tokens read from the prompt cache) separately from standard input/output tokens. These were not included in the surfaced totals, meaning actual token usage was understated and cost estimates were inaccurate.

**Fix:**
Both `cache_creation_tokens` and `cache_read_tokens` are now included in the token usage totals that are surfaced in response hints. This provides accurate accounting that reflects the full cost of API interactions, including cache operations.

---

### Dead workingSet branch removed -- unreachable code path cleaned up

**Problem:**
`session-prime.ts` contained a code branch that referenced a `workingSet` field. However, this field was never actually persisted to hook state -- it existed in the type definitions but was never written to disk. The branch was dead code: it could never execute at runtime. Its presence added confusion for developers reading the code, suggesting that working set tracking was a feature when it was actually unimplemented scaffolding.

**Fix:**
Removed the unreachable `workingSet` branch and its associated type references. This reduces code noise and eliminates a misleading signal about the system's actual capabilities.

---

### Token-count sync consolidated -- eliminating duplicate calculation logic

**Problem:**
Two files -- `response-hints.ts` and `envelope.ts` -- both independently calculated and synchronized token counts. They used the same iterative convergence approach but with different safety bounds: `response-hints.ts` used 3 iterations while `envelope.ts` used 5. This duplication meant that a bug fix or improvement in one location could easily be missed in the other, leading to divergent behavior over time. The different iteration counts were already evidence of this drift.

**Fix:**
The duplicate implementation in `response-hints.ts` was replaced with an import of the canonical `syncEnvelopeTokenCount()` and `serializeEnvelopeWithTokenCount()` functions from `envelope.ts`. The canonical version uses the 5-iteration safety bound, which is the more conservative (and correct) choice. This establishes a single source of truth for token count synchronization.

---

### Pressure-budget helper unified -- preventing calculation drift

**Problem:**
`session-prime.ts` had its own private `calculatePressureBudget()` function that had drifted from the shared, tested version of the same calculation in `shared.ts`. Over time, the two implementations had diverged, meaning the pressure-budget calculation (which determines how much context to include based on available token space) could produce different results depending on which code path was taken.

**Fix:**
Replaced the private implementation with an import of `calculatePressureAdjustedBudget()` from `shared.ts`. This ensures all code paths use the same tested calculation and prevents further divergence.

---

### Testing

### 226 tests passing across 8 suites

All existing vitest tests continue to pass (226 out of 226). New tests added in this phase cover SHA-256 session hashing, file permission verification (checking that `0700` and `0600` modes are applied), cache token accounting in response hints, and stale-on-read detection with mtime-based freshness checks. Test coverage spans 8 test suites including hook state, session start, pre-compact, dual-scope hooks, edge cases, envelope, UX feedback hooks, and crash recovery.

---

<details>
<summary>Files Changed (10 files)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/hook-state.ts` | readAndClearCompactPrime pattern, saveState boolean return, SHA-256 session hashing, 0700/0600 permissions, pendingStopSave field |
| `mcp_server/hooks/claude/session-prime.ts` | Provenance markers, 30-min TTL check, dead workingSet removal, shared pressure-budget import |
| `mcp_server/hooks/claude/session-stop.ts` | Uses dedicated pendingStopSave field |
| `mcp_server/hooks/claude/compact-inject.ts` | autoSurfaceAtCompaction wiring for constitutional memory survival |
| `mcp_server/hooks/claude/shared.ts` | wrapRecoveredCompactPayload and sanitizeRecoveredContent helpers |
| `mcp_server/hooks/memory-surface.ts` | primeSessionIfNeeded with sessionPrimed flag, code graph status loading |
| `mcp_server/hooks/response-hints.ts` | Imports from envelope.ts, cache token accounting |
| `mcp_server/lib/response/envelope.ts` | Exported syncEnvelopeTokenCount and serializeEnvelopeWithTokenCount |
| `mcp_server/lib/code-graph/code-graph-db.ts` | file_mtime_ms column, schema v2 migration, isFileStale and ensureFreshFiles |
| `mcp_server/context-server.ts` | First-call priming dispatch, graph auto-enrichment with 250ms timeout |

</details>

---

## Upgrade

No migration required. The code graph schema v2 migration (adding `file_mtime_ms` column) runs automatically on first access. Existing hook state temp files from before SHA-256 hashing become inaccessible, which is acceptable since they are ephemeral and regenerated each session.
