# Changelog: 024/001-precompact-hook

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 001-precompact-hook — 2026-03-31

This phase gave compacted Claude Code sessions a real memory handoff instead of a full reset. It precomputes a compaction brief before compression, caches it safely, and restores it on the next compact-triggered session start so the AI keeps its active spec-folder context, relevant memories, and recent working signals inside the 4,000-token recovery budget.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/`

---

## New Features (3)

### PreCompact context rescue

**Problem:** Claude compaction cleared the session context before the AI could preserve what it was doing, which spec folder it was in, or which decisions mattered.

**Fix:** Added `compact-inject.ts` to build a compact recovery payload before compaction. It gathers constitutional memories, relevant memories, attention signals, and detected spec-folder context, then caches that payload for the post-compact restart.

### SessionStart compact recovery

**Problem:** Even with a saved cache, there was no post-compaction path to inject that context back into the next session.

**Fix:** Extended `session-prime.ts` to read `pendingCompactPrime` when Claude starts with `source=compact`, emit the saved context on stdout, and fall back cleanly when the cache is missing or stale.

### Shared hook state and budget utilities

**Problem:** Compaction recovery needed a safe handoff layer and common budget logic, otherwise every hook script would duplicate fragile state handling.

**Fix:** Added `hook-state.ts` and `shared.ts` for cache lifecycle management, token-budget constants, formatting helpers, and cleanup rules. The cache now has freshness checks and gets deleted after successful injection.

---

## Bug Fixes (2)

### MCP unavailability no longer breaks compaction

**Problem:** The precompute path depended on Memory MCP calls and could fail noisily if the server was down.

**Fix:** Wrapped retrieval in graceful fallbacks so compaction still succeeds even when memory lookups are unavailable.

### Debug logs no longer pollute injected context

**Problem:** Anything written to stdout during SessionStart was treated as user-facing recovery context.

**Fix:** Reserved stdout for the actual injected payload and pushed logs and errors to stderr.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/compact-inject.ts` | Added PreCompact payload building, attention-signal extraction, and compact cache writes. |
| `mcp_server/hooks/claude/session-prime.ts` | Added `source=compact` cache restoration path and fallback resume guidance. |
| `mcp_server/hooks/claude/shared.ts` | Added shared compaction budget constants, formatting helpers, and error handling. |
| `mcp_server/hooks/claude/hook-state.ts` | Added `pendingCompactPrime` lifecycle management with TTL checks and cleanup. |

</details>

---

## Upgrade

No migration required.
