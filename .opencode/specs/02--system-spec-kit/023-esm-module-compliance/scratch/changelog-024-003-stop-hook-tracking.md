# Changelog: 024/003-stop-hook-tracking

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 003-stop-hook-tracking -- 2026-03-28

When a Claude Code session ends, the system now automatically captures how many tokens were used and what the session cost. Before this phase, token usage was invisible -- you had no way to know how much a session consumed or what it cost. The new Stop hook runs silently in the background after every session, parses the conversation transcript, calculates costs per model, and saves the results. If a session involved significant work (more than 1,000 output tokens), it also auto-saves the conversation context so nothing is lost even if you forget to save manually.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/`

---

## New Features (4)

### Automatic token tracking

**Problem:** After a Claude Code session ended, there was no record of how many tokens it consumed. Token usage was completely invisible -- you could run a long, expensive session and have no way to see what happened.

**Fix:** Built an async Stop hook that fires in the background when a session closes. It parses the full conversation transcript (a JSONL file that Claude Code writes) and records how many tokens were used, broken down into four categories: input tokens, output tokens, cache reads, and cache writes. The data is stored in the session's hook state so it can be reviewed afterward.

### Per-model cost estimation

**Problem:** Even if you could somehow count tokens, there was no way to translate that into a dollar amount. Different AI models (Opus 4.6, Sonnet 4.6, Haiku 4.5) have very different pricing, and doing the math manually after every session was impractical.

**Fix:** Added model-aware pricing tables covering all three active models. The Stop hook identifies which model was used during the session, applies the correct per-token rates for input, output, cache writes, and cache reads, and produces a USD cost estimate. This lets users understand and manage their spending at a glance.

### Auto-save on significant work

**Problem:** If a session produced meaningful work but the user forgot to save context before closing, that work context was lost. The next session would start from scratch with no memory of what happened.

**Fix:** The Stop hook now automatically triggers a context save (via the existing `generate-context.js` script) when a session produces more than 1,000 output tokens -- a threshold that indicates real work was done rather than a quick question-and-answer. A 5-minute deduplication window prevents double-saves when multiple Stop events fire in quick succession, which can happen under certain session-end conditions.

### Session summary extraction

**Problem:** There was no quick way to see what a session accomplished without re-reading the full conversation. Resume flows (picking up where you left off) had no brief description to work with.

**Fix:** The hook now extracts a brief summary (roughly 200 characters, cut at a sentence boundary for readability) from the last assistant message in the conversation. This summary is stored in hook state and made available to resume flows, so the next session can display a one-liner about what the previous session accomplished.

---

## Architecture (3)

### Streaming transcript parser

**Problem:** Claude Code conversation transcripts are stored as JSONL files (one JSON object per line). For long sessions these files can grow to 10MB or more. Loading an entire file into memory at once risked out-of-memory crashes, especially on resource-constrained machines.

**Fix:** Built a streaming line-by-line JSONL parser (`claude-transcript.ts`) that processes transcripts without loading them entirely into memory. It also supports incremental parsing via byte offsets: if the Stop hook fires multiple times during the same session, each subsequent parse picks up where the last one left off rather than re-processing the entire file. This prevents duplicate token counting and keeps the parser fast regardless of transcript size.

### Token pressure feedback

**Problem:** Token usage data was collected but siloed -- no other system in the codebase could react to how many tokens were being consumed. The code graph system (which manages the project's structural index) had no way to adjust its resource usage based on session cost pressure.

**Fix:** Connected the token tracking to the MCP budget system. A new `getTokenUsageRatio()` function in `code-graph-db.ts` reads the stored token metrics and exposes them as a ratio. A companion function, `calculatePressureAdjustedBudget()` in `shared.ts`, uses that ratio to dynamically adjust how much budget the code graph system receives. High token consumption in a session causes the code graph to operate more conservatively, reducing its resource footprint.

### Stale state cleanup

**Problem:** Every session that triggers the Stop hook creates a state file to track offsets, token counts, and save bookmarks. Over time, old state files from completed sessions would accumulate indefinitely, cluttering the file system.

**Fix:** Added a `--finalize` flag to the Stop hook script. When invoked with this flag, it runs `cleanStaleStates()` which removes session state files older than 24 hours. This can be triggered by a SessionEnd hook reuse, keeping the system tidy without requiring a separate cleanup script.

---

## Bug Fixes (1)

### Recursion guard

**Problem:** The Stop hook listens for session-end events, but its own execution could theoretically generate another Stop event, creating an infinite loop where the hook triggers itself repeatedly.

**Fix:** Added a check for the `stop_hook_active` field in the incoming payload. If this field indicates the hook is already running (meaning this is a recursive invocation), the script exits immediately without doing any work. This prevents infinite loops with zero overhead in the normal case.

---

<details>
<summary><strong>Files Changed (6)</strong></summary>

| File | What changed |
|------|-------------|
| `hooks/claude/session-stop.ts` | New async Stop hook handling token tracking, auto-save, summary extraction, and stale state cleanup |
| `hooks/claude/claude-transcript.ts` | New streaming JSONL transcript parser with incremental byte-offset support |
| `.claude/settings.local.json` | Registered the Stop hook with `async: true` so it runs in the background without blocking |
| `lib/code-graph/code-graph-db.ts` | Added `getTokenUsageRatio()` to feed token usage data into budget pressure logic |
| `lib/shared.ts` | Added `calculatePressureAdjustedBudget()` that adjusts code graph budgets based on token consumption |
| `tests/hook-stop-token-tracking.vitest.ts` | New test suite covering token parsing, cost calculation, snapshot storage, and incremental offset handling |

</details>

---

## Deep Review Fixes (2026-04-01)

### Code Fixes
- **Streaming transcript parser** -- replaced `readFileSync(...).split('\n')` with `createReadStream` + `readline.createInterface` for memory-safe processing of large transcripts
- **Tail-read spec folder detection** -- `detectSpecFolder()` now reads only the last 50KB of the transcript instead of the entire file
- **Dead code removed** -- `pendingStopSave` flag write, `AUTO_SAVE_TOKEN_THRESHOLD`, and `RECENT_SAVE_WINDOW_MS` constants removed (auto-save feature documented as deferred)

### Doc Fixes
- Updated spec to note JSON hook-state files used instead of SQLite `session_token_snapshots` table
- Fixed `lib/shared.ts` path to `hooks/claude/shared.ts` in implementation-summary
- Documented auto-save as partial, cost estimation as input/output only

## Upgrade

No migration required.
