# Spec: Hybrid Context Injection — Hook + Tool Architecture

## Summary

Implement a hybrid context injection system that uses Claude Code hooks (PreCompact, SessionStart, Stop) for automated context preservation at lifecycle boundaries, with tool-based fallback for runtimes without hook support (OpenCode, Codex CLI, Copilot, Gemini CLI).

## Problem

Context compaction in long AI coding sessions causes loss of critical knowledge. Currently, our system relies on AI-driven recovery (CLAUDE.md instructions telling the AI to re-read MEMORY.md after compaction). This approach:
- Depends on the AI remembering to follow instructions after compaction
- Doesn't work proactively — the AI only recovers context AFTER it starts reasoning
- Provides no automated safeguard for non-Claude runtimes

## Solution: Hybrid Approach

**Layer 1 — Hook-based (Claude Code only):**
- PreCompact hook → **precomputes** critical context and caches to file (stdout NOT injected on PreCompact)
- SessionStart(source=compact) hook → **injects** cached context into conversation via stdout
- SessionStart(source=startup|resume) hook → primes session with relevant prior work
- Stop hook → saves session context + tracks token usage
- NOTE: Copilot CLI and Gemini CLI also have hooks — expand in future phases

**Layer 2 — Tool-based (all runtimes):**
- Gate 1 in CLAUDE.md triggers `memory_match_triggers()` on each user message
- After compaction, CLAUDE.md instructions direct AI to call `memory_context({ mode: "resume" })`
- Works on any runtime that reads CLAUDE.md/CODEX.md

## Architecture

```
Claude Code Runtime:
  PreCompact          → compact-precompute.js → precompute + cache to file
  SessionStart(compact) → compact-inject.js → read cache → stdout injection
  SessionStart(startup) → session-prime.js → memory_context(resume) → stdout injection
  Stop                → session-stop.js → save context + log tokens

All Runtimes (including Claude Code):
  User Message → Gate 1 → memory_match_triggers() → auto-surface context
  After Compact → CLAUDE.md rules → memory_context({ mode: "resume" })
```

## Scope

- 4 phases, ~3-4 weeks total
- Builds on existing infrastructure: `autoSurfaceAtCompaction()`, `memory_context()`, `memory_match_triggers()`
- No changes to MCP server core — only new scripts + hook registration + CLAUDE.md updates

## Research

Based on deep research (10+5 iterations) evaluating Codex-CLI-Compact (Dual-Graph):
- Dual-Graph's hook pattern inspired this approach
- Our MCP server already has `autoSurfaceAtCompaction()` (4000 token budget)
- Research artifacts in `research/` directory

## Phases

| Phase | Name | Effort | Priority |
|-------|------|--------|----------|
| 001 | PreCompact Hook | 2-3 days | P0 — highest impact |
| 002 | SessionStart Hook | 1-2 days | P1 — session priming |
| 003 | Stop Hook + Token Tracking | 2-3 days | P2 — observability |
| 004 | Cross-Runtime Fallback | 1-2 days | P1 — universal support |

## Out of Scope

- Code graph channel (tree-sitter integration) — separate spec folder
- Dual-Graph installation or graperoot integration — rejected per research
- Token tracking dashboard UI — future work
- Codex CLI / Gemini CLI hook support — not available in those runtimes
