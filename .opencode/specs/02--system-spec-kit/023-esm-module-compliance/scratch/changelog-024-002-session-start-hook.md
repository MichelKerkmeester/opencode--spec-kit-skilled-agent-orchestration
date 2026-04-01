# Changelog: 024/002-session-start-hook

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 002-session-start-hook — 2026-03-31

Every time you open a Claude Code session, the AI starts with a blank slate -- it doesn't know what you were working on, what decisions you made, or what your project's ground rules are. This phase adds an automatic "session primer" that detects how the session started (fresh launch, resumed session, cleared context, or compacted context) and injects exactly the right amount of prior knowledge so the AI is ready to help immediately, without you having to re-explain everything.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/`

---

## New Features (4)

### Source-aware session routing

**Problem:** When a Claude Code session began, the AI had no way to automatically detect *how* it started or load relevant context for that situation. Whether you launched a fresh session, resumed a prior one, cleared the context, or hit a compaction event, the AI treated every start the same: blank.

**Fix:** A unified SessionStart hook was built that detects four distinct session origins -- startup, resume, clear, and compact -- and routes each to a tailored context injection path. Fresh startups get a project overview with constitutional memories and code structure. Resumed sessions retrieve prior work state, next steps, and blockers. Cleared sessions respect the user's intent and inject only minimal rules. Compacted sessions read from a pre-built cache (Phase 1) for a richer 4000-token payload. The AI now always starts with the right context for the situation.

### Smart token budgeting per source

**Problem:** Different session types need different amounts of context. A fresh startup needs a broad overview, while a compacted session needs deep recovery of what was just lost. But there was no mechanism to control how much context each session type received, risking either too little information (useless) or too much (crowding out the user's actual request).

**Fix:** Each session source now gets a structured token budget. Startup and resume sessions operate within a 2000-token budget, split across constitutional memories (500 tokens), code graph structure (700), semantic code search (400), triggered memories (200), and an overflow pool (200) that reclaims budget from empty sources. Compacted sessions get a larger 4000-token budget using Phase 1's compaction profile. Cleared sessions receive constitutional memories only. This ensures the AI gets useful prior knowledge without overwhelming its context window.

### Token pressure awareness

**Problem:** In long sessions, the AI's context window gradually fills up. When it was already 80% or 90% full, the session hook would still try to inject its full budget -- wasting the limited remaining space on background context instead of leaving room for the user's actual conversation.

**Fix:** A new `calculatePressureBudget()` function was added that monitors how full the context window is and dynamically scales down the injection. Above 70% usage, the budget starts to shrink. Above 90%, it shrinks aggressively. This keeps the AI responsive and leaves room for meaningful interaction even in lengthy sessions where context space is at a premium.

### Spec folder auto-detection

**Problem:** When resuming work, the AI couldn't automatically determine which spec folder (the project's documentation and task-tracking directory) you were working in. You'd have to tell it, or it would start without that context -- losing track of your current task, checklist progress, and implementation decisions.

**Fix:** A `detectSpecFolder()` function was added that identifies the active spec folder from project context at session start. The detected folder is then persisted in hook state as `lastSpecFolder`, which survives across sessions. This means when you resume a session or recover from a compaction, the AI already knows which spec folder you were working in and can load the right task context immediately.

---

## Bug Fixes (1)

### Missing resume profile parameter

**Problem:** When resuming a session, the system called the memory retrieval function with `memory_context({ mode: "resume" })` but omitted a critical `profile: "resume"` parameter. Without it, the function returned raw, unstructured search results instead of a compact brief containing the session's state, next steps, and active blockers. This made resumed sessions feel disoriented -- the AI had information but couldn't present it in an actionable way.

**Fix:** All resume paths -- including the SessionStart hook's resume routing and the `/spec_kit:resume` command -- now pass `profile: "resume"` alongside the mode parameter. This activates the compact brief format that returns a structured `{ state, nextSteps, blockers }` object. Resumed sessions now present a clean, actionable summary of where you left off.

---

## Architecture (2)

### Shared hook script with Phase 1

**Problem:** Phase 1 (compact injection) and Phase 2 (session start priming) both needed to generate context payloads for the AI at different lifecycle moments. Building them as separate scripts would have duplicated significant logic -- budget calculation, constitutional memory retrieval, code graph queries, and output formatting -- creating two codebases that would need to stay in sync.

**Fix:** Both phases were unified into a single `session-prime.ts` script with internal source routing. The script inspects the session source (compact, startup, resume, or clear) and branches to the appropriate handler. Shared utilities like budget calculation and memory retrieval are written once and used by all paths. This eliminates duplication and ensures improvements to one path automatically benefit the others.

### Graceful MCP fallback

**Problem:** The session hook depends on the MCP (Model Context Protocol) server to retrieve memories, code graph data, and semantic search results. If the MCP server was down, slow to connect, or experiencing network issues, the hook could fail entirely -- blocking session startup or producing an error instead of useful context.

**Fix:** Fallback handling was added so the hook degrades gracefully when MCP is unavailable. Each retrieval step (constitutional memories, code graph, semantic search) is independently protected. If one source fails, the hook continues with the remaining sources and still produces whatever context it can. A total failure results in a clean, empty response rather than an error. This prevents infrastructure issues from blocking your work.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/session-prime.ts` | New unified SessionStart handler with 4-source routing, budget profiles, token pressure awareness, and spec folder auto-detection |
| `mcp_server/hooks/claude/shared.ts` | Added session budget profiles for startup, resume, and clear sources with per-category token allocations |
| `mcp_server/hooks/claude/hook-state.ts` | Added `lastSpecFolder` and `workingSet` state persistence for cross-session continuity |
| `.claude/settings.local.json` | Registered the SessionStart hook (no matcher filter, handles all sources internally) |

</details>

---

## Upgrade

No migration required.
