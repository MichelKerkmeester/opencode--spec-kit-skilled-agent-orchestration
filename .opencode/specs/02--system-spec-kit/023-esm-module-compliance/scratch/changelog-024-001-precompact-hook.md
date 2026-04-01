# Changelog: 024/001-precompact-hook

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 001-precompact-hook — 2026-03-31

When Claude Code runs out of context and auto-compacts, the AI previously lost track of what it was working on -- active spec folders, constitutional rules, relevant prior work. This phase adds a two-step "memory rescue" system: a PreCompact hook that precomputes critical context and caches it, followed by a SessionStart hook that injects that cached context into the fresh compacted conversation. The result is that compaction no longer causes amnesia -- the AI picks up where it left off with its most important context intact, all within a 4000-token budget and a 2-second time limit.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/`

---

## New Features (4)

### Compaction context precomputation

**Problem:** When Claude Code ran out of context window and triggered auto-compaction, all session context was wiped clean. The AI had no memory of what it was working on, which spec folder was active, or what decisions had been made. Every compaction was a hard reset that forced the AI (and the user) to start over from scratch.

**Fix:** Added a PreCompact hook (`compact-inject.ts`) that fires automatically just before compaction occurs. It gathers the three most valuable types of context -- constitutional memories (always-on rules), triggered memories (session-relevant knowledge), and working memory signals (what the AI was actively coding) -- then caches them to a local file. This precomputation step ensures the AI's most important context is captured and preserved before compaction erases the conversation.

### Post-compaction context injection

**Problem:** Even if context could be saved before compaction, there was no mechanism to get it back into the new conversation afterward. After compaction, the AI started with a blank slate and no awareness of prior work.

**Fix:** Added a SessionStart hook that only fires when the session source is `"compact"` (not on normal startups or resumes). It reads the cached context file that the PreCompact hook wrote, outputs it to stdout where Claude Code automatically injects it into the new compacted conversation, then cleans up the cache file. The AI now resumes with awareness of its active work, rules, and prior decisions without the user needing to do anything.

### Working memory attention signals

**Problem:** The system had no way to detect what specific code the AI was actively working with at the moment of compaction. Generic memory retrieval could return broadly relevant context, but it missed the immediate coding focus -- the specific functions, variables, and classes that were front of mind.

**Fix:** Added `extractAttentionSignals()`, which scans the recent conversation for camelCase and PascalCase identifiers (naming patterns used in code, like `autoSurfaceMemories` or `TokenBudget`). These identifiers serve as signals of what the AI was actively coding with, so the rescued context focuses on what was actually in progress rather than just general project knowledge.

### Spec folder auto-detection

**Problem:** The precomputation step needed to know which spec folder the AI was working in so it could include the right project documentation in the rescued context. But there was no automated way to determine this -- it would have required the AI to explicitly declare it, which does not happen during an unexpected compaction.

**Fix:** Added `detectSpecFolder()` to automatically identify the current spec folder from session context clues. This ensures that when compaction recovery fires, the injected context includes pointers to the correct spec folder documentation so the AI can resume within the right project scope.

---

## Architecture (3)

### Token budget allocator with floors and overflow

**Problem:** Without explicit budget control, the rescued context could either exceed the 4000-token limit (causing truncation or rejection) or waste space by giving too much room to one source and too little to another. A naive equal split would not work because constitutional rules are always present but triggered memories may be empty.

**Fix:** Implemented a "floors + overflow pool" allocation model. The 4000-token budget is divided across four sources, each with a guaranteed minimum floor: Constitutional Memory (700 tokens), Code Graph (1200 tokens), CocoIndex semantic search (900 tokens), and Triggered Memory (400 tokens). An additional 800 tokens form an overflow pool. If any source returns nothing (for example, CocoIndex is unavailable), its floor flows back into the overflow pool and is redistributed to sources that need more space. A defined trim order (second-hop graph first, constitutional last) determines what gets cut if the total still exceeds the budget.

### Shared hook utilities

**Problem:** The two-step hook system (PreCompact and SessionStart) plus planned future hooks (Phase 2) would each need the same token budget constants, text formatting helpers, and error handling patterns. Without shared infrastructure, these would be duplicated across every hook script, making them harder to maintain and more likely to drift out of sync.

**Fix:** Created `shared.ts` as a common utility module for all hook scripts. It exports the token budget constants (the 4000-token total and individual source floors), formatting helpers for structuring the injected context, and standardized error handling patterns. Both Phase 1 hooks import from this module, and Phase 2 hooks are designed to do the same.

### Inter-hook cache state management

**Problem:** The PreCompact hook and the SessionStart hook are two separate scripts that run at different times -- one before compaction and one after. They need a reliable way to pass data between them. The cache file must be fresh (not stale from a previous compaction), and it must be cleaned up after use so it does not accumulate or cause a future compaction to inject outdated context.

**Fix:** Created `hook-state.ts` to manage the `pendingCompactPrime` cache with explicit lifecycle rules. It enforces a 5-minute freshness TTL (time-to-live): if the SessionStart hook fires more than 5 minutes after the PreCompact hook wrote the cache, the cache is treated as stale and discarded. After successful injection, the cache file is automatically deleted. This prevents stale context from being injected and ensures cache files do not accumulate on disk.

---

## Bug Fixes (2)

### Graceful degradation when MCP server is unavailable

**Problem:** The PreCompact hook relies on the Memory MCP server to retrieve constitutional and triggered memories. If that server was not running at the moment compaction triggered (it could be down, restarting, or not yet started), the hook would have crashed entirely, potentially blocking or disrupting the compaction process itself.

**Fix:** Wrapped all MCP calls in try/catch blocks with fallback behavior. If the Memory MCP server is unreachable, the hook completes cleanly without the MCP-sourced context rather than failing. The compaction proceeds normally, and whatever context can be gathered from local sources (attention signals, spec folder detection) is still included. This ensures the hook never makes compaction worse than it would be without the hook.

### Error output isolation from context injection

**Problem:** Claude Code's injection mechanism works by capturing stdout -- whatever the hook prints to stdout becomes part of the AI's new conversation context. If debug logging, error messages, or stack traces were accidentally written to stdout, they would be injected into the conversation as if they were real context, confusing the AI with noise like `[DEBUG] Loading cache...` or `Error: connection timeout`.

**Fix:** Ensured all error and debug logging is routed to stderr instead of stdout. Stdout is reserved exclusively for the formatted context payload that should be injected into the conversation. This clean separation means debugging information is still available in logs for developers but never pollutes the AI's recovered context.

---

## Security (1)

### Merge-safe hook registration

**Problem:** The hook system is registered in `.claude/settings.local.json`, which may already contain other hook configurations set up by the user or other tools. A naive write to this file would overwrite everything, silently deleting existing hooks without warning.

**Fix:** The registration process reads the existing `settings.local.json` file first, then merges the new PreCompact and SessionStart hook entries into the existing configuration without removing anything. Other hooks remain untouched. This protects users and other tools from having their hook configurations silently destroyed during installation.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/compact-inject.ts` | New file -- PreCompact precomputation and SessionStart compact injection logic, including `extractAttentionSignals()` and `detectSpecFolder()` |
| `mcp_server/hooks/claude/shared.ts` | New file -- Common hook utilities, token budget constants (4000 total, per-source floors), formatting helpers |
| `mcp_server/hooks/claude/hook-state.ts` | New file -- Cache state management with 5-minute TTL, freshness checks, and automatic cleanup after injection |
| `.claude/settings.local.json` | Modified -- Added PreCompact (empty matcher) and SessionStart (`"compact"` matcher) hook registrations, merge-safe |

</details>

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **Triggered memories now rendered in compact payload** -- `autoSurfaceAtCompaction()` returns both constitutional and triggered memories. Previously only constitutional were rendered; triggered were silently discarded. New `renderTriggeredMemories()` function renders them as a "Relevant Memories" section (+32 lines).

### Doc Fixes
- Updated spec.md file paths from `scripts/hooks/` to `hooks/claude/`
- Added `session-prime.ts` to implementation-summary Files Changed table
- Fixed consolidated file structure documentation (2 scripts → 1)

---

## Upgrade

No migration required.
