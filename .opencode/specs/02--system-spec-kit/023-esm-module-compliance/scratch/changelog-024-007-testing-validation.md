# Changelog: 024/007-testing-validation

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 007-testing-validation — 2026-03-31

The hook system built across Phases 1-6 had no automated way to verify it actually worked. If someone changed the PreCompact cache format, broke the SessionStart payload parser, or introduced a regression in the Stop hook's transcript reader, nothing would catch it until a user hit a real failure. This phase adds 242 automated tests across 16 files that validate the entire hook lifecycle -- from runtime detection through context compaction to session resume -- for all four supported runtimes (Claude Code, Codex CLI, Copilot CLI, Gemini CLI). The system is now protected against regressions with repeatable, CI-ready test coverage.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/007-testing-validation/`

---

## What Changed

### Testing Infrastructure (1 change)

### Shared test foundation for all runtimes

**Problem:** Each test file was setting up its own runtime environment differently. One test might mock environment variables one way, another would do it differently. This made tests inconsistent -- a test could pass not because the code worked, but because the setup happened to be favorable. It also made writing new tests tedious since authors had to reinvent the setup each time.

**Fix:** Created a shared `RuntimeFixture` interface and `createRuntimeFixture()` factory that provides standardized setup for all 4 runtimes (Claude Code, Codex CLI, Copilot CLI, Gemini CLI). The factory produces a fixture object with pre-configured stdin mocks (simulated input streams), stdout capture (recording what the hook outputs), and temp file management. Every test file now builds on the same foundation, so differences in test behavior reflect real code differences rather than setup inconsistencies.

---

### Unit Tests (4 changes)

### Runtime detection verification

**Problem:** The system needs to identify which AI runtime (Claude Code, Codex CLI, Copilot CLI, or Gemini CLI) is currently active, since each runtime has different capabilities. There was no way to verify this detection logic worked correctly. A bug here would silently disable hooks for a runtime that should have them, or try to activate hooks on a runtime that does not support them.

**Fix:** Added unit tests that confirm environment variable parsing and capability model output work for all 4 runtimes. The tests cover both the "happy path" (correct identification) and edge cases (ambiguous or missing environment variables), catching misidentification before it reaches users.

---

### SessionStart hook verification

**Problem:** The SessionStart hook handles four different trigger sources -- startup (fresh session), resume (continuing a previous session), compact (after context compaction), and clear (after the user clears context). Each source produces a different payload with different content. Without tests, changes to the payload format or source-matching logic could silently break context injection for one trigger source while the others still worked.

**Fix:** Added unit tests covering payload parsing, source matching, and context injection for every source type. If someone changes the hook's format or the logic that selects which context to inject, the tests will fail before the change reaches production.

---

### PreCompact hook verification

**Problem:** The PreCompact hook caches important context before a compaction event (when the AI's conversation history is compressed to free up space). This is time-sensitive work -- if the hook takes too long, it gets killed. There was no test coverage for the precompute logic, the cache file writing and reading, or the timeout handling, meaning a slow external service or a filesystem error could silently lose context.

**Fix:** Added unit tests for the precompute logic (what gets selected for caching), cache file write/read (data integrity), and timeout handling with graceful degradation (the hook saves what it can within the time limit rather than crashing). This ensures context is never lost during compaction, even under slow conditions.

---

### Stop hook verification

**Problem:** The Stop hook parses JSONL transcripts (log files where each line is a separate JSON object) that can be very large -- sometimes thousands of lines. The streaming parser that processes these files had no test coverage. A subtle parsing bug could miscalculate token usage, produce corrupt snapshots, or silently drop transcript data.

**Fix:** Added unit tests for transcript parsing (handling real-world JSONL formats), token counting (accurate tallying across large transcripts), and snapshot creation (correct data structure for storage). The tests verify that the streaming parser handles edge cases in the transcript format correctly.

---

### Integration Tests (5 changes)

### Cross-runtime fallback verification

**Problem:** Runtimes that do not support hooks (Codex CLI, Copilot CLI, Gemini CLI) rely on a tool-based fallback mechanism instead -- they recover context through MCP tool calls rather than automatic hook injection. If this fallback path broke, users on those runtimes would lose context recovery entirely with no warning.

**Fix:** Added integration tests with fixture-driven assertions (test data that represents each runtime's specific environment) confirming that non-hook runtimes recover context through MCP tools. The tests verify the complete fallback pipeline: detection of hook unavailability, switch to tool-based recovery, and successful context injection.

---

### Token snapshot storage verification

**Problem:** The SQLite table `session_token_snapshots` stores token usage data for each session. This table had no dedicated test coverage. Bugs in the database operations (writing, reading, querying snapshots) would only surface when a user tried to resume a session and got incorrect or missing data.

**Fix:** Added in-memory SQLite CRUD tests (Create, Read, Update, Delete operations) for the `session_token_snapshots` table. Using in-memory SQLite means the tests run fast and leave no files behind. The tests verify that writes persist correctly, reads return accurate data, and queries filter as expected.

---

### Session resume verification

**Problem:** Resuming a session after a crash or unexpected exit requires reconstructing state from a token snapshot combined with a memory search. This multi-step reconstruction pipeline had no integration test coverage, so a failure in any step would leave the user with an incomplete or broken session state.

**Fix:** Added integration tests that verify the full reconstruction pipeline -- from loading the token snapshot, through memory search, to final session state assembly. The tests confirm that sessions can be reliably recovered even after unclean exits.

---

### Compaction fixture extensions

**Problem:** The existing `dual-scope-hooks.vitest.ts` test file lacked coverage for the PreCompact-to-SessionStart compaction flow -- the critical round-trip where context is cached before compaction and then re-injected when the session resumes. Without these tests, the most important hook interaction had a gap in coverage.

**Fix:** Added 3 new tests to the existing file: mergeCompactBrief validation (ensuring the compressed context summary is well-formed), 3-source merge (combining context from memory, code graph, and CocoIndex), and pipeline timeout enforcement (verifying the system respects the 2-second hard cap). These ensure the full compaction round-trip works end to end.

---

### Crash recovery extensions

**Problem:** The existing `crash-recovery.vitest.ts` test file had no SQLite-backed fixtures. Its tests used mocked data rather than real database operations, meaning it could not catch bugs in actual database interactions like WAL mode initialization, schema version mismatches, or corrupted database recovery.

**Fix:** Added 4 new tests using real in-memory SQLite: WAL mode initialization (verifying the database uses Write-Ahead Logging for crash safety), schema versioning (ensuring migrations run correctly), corrupted database recovery (the system rebuilds from scratch when the database is damaged), and orphan cleanup (removing leftover data from sessions that were never properly closed).

---

### Edge Cases & Performance (2 changes)

### Edge case coverage

**Problem:** Corner cases like empty transcripts, unavailable MCP servers, expired caches, and concurrent sessions could cause silent failures. These scenarios are uncommon in normal use but devastating when they occur -- the system would either crash or silently produce incorrect results with no indication of what went wrong.

**Fix:** Added 13 dedicated edge-case tests covering these scenarios. The tests verify that the system fails gracefully (provides a clear error or uses a safe default) instead of breaking unpredictably. For example, an empty transcript returns zero tokens rather than throwing an error, and an unavailable MCP server triggers the fallback path rather than hanging.

---

### Performance regression detection

**Problem:** Hook scripts that take too long block the user experience. The hooks run during time-sensitive operations (context compaction, session start), and a performance regression could make the AI feel sluggish or even trigger timeout kills that lose data. There was no automated way to catch these slowdowns.

**Fix:** Added timing assertions verifying all hooks complete within 1,800ms, providing a safety margin under the 2-second hard cap. If a code change makes any hook slower than this threshold, the test fails immediately, catching performance regressions before they reach users.

---

<details>
<summary>Files Changed (11 files)</summary>

| File | What changed |
|------|-------------|
| `tests/fixtures/runtime-fixtures.ts` | New shared RuntimeFixture contract, factory for all 4 runtimes, stdin mock, stdout capture, temp file helpers |
| `tests/runtime-routing.vitest.ts` | New unit tests for runtime detection from environment variables and capability model output |
| `tests/hook-session-start.vitest.ts` | New unit tests for SessionStart payload parsing, source matching, and context injection |
| `tests/hook-precompact.vitest.ts` | New unit tests for PreCompact precompute logic, cache write/read, and timeout handling |
| `tests/hook-stop-token-tracking.vitest.ts` | New unit tests for Stop hook transcript parsing, token counting, and snapshot creation |
| `tests/cross-runtime-fallback.vitest.ts` | New integration tests for tool-based recovery on non-hook runtimes |
| `tests/token-snapshot-store.vitest.ts` | New integration tests for SQLite CRUD on `session_token_snapshots` table |
| `tests/session-token-resume.vitest.ts` | New integration tests for session state reconstruction from token snapshots |
| `tests/edge-cases.vitest.ts` | New edge-case tests (13 tests) covering empty transcripts, MCP unavailable, expired caches, concurrent sessions |
| `tests/dual-scope-hooks.vitest.ts` | Extended with 3 compaction fixture tests (mergeCompactBrief, 3-source merge, timeout enforcement) |
| `tests/crash-recovery.vitest.ts` | Extended with 4 SQLite fixture tests (WAL mode, schema versioning, corrupted DB, orphan cleanup) |

</details>

## Upgrade

No migration required.
