# Phase 021: Cross-Runtime Instruction Parity

## What This Is

The instruction files that tell AI assistants how to use Spec Kit Memory are inconsistent across runtimes. Claude's CLAUDE.md is comprehensive; CODEX.md, AGENTS.md, and GEMINI.md are missing key lifecycle instructions. This phase brings them all to parity.

## Plain-English Summary

**Problem:** When you use Codex CLI, the instruction file doesn't tell the AI to load context on startup, check code graph freshness, or recover after compaction. Claude Code has all of this because it has hooks + well-written CLAUDE.md. Other runtimes are left guessing.

**Solution:** Add a standard "No Hook Transport" section to every runtime's instruction file with explicit trigger tables. Also create an `@context-prime` agent for OpenCode.

## What to Build

### Part 1: Instruction File Updates (from research iter 100)

Add a **"No Hook Transport"** section to `CODEX.md`, `AGENTS.md`, and `GEMINI.md` with a trigger table:

| When | What to Call |
|------|-------------|
| Fresh session start | `session_resume()` with optional `session_health()` follow-up |
| After resume/reconnect | `session_resume()` |
| After compaction/long gap | `session_resume()`; optionally `session_health()` when drift is suspected |
| After `/clear` | Same as fresh session |
| Before structural search | `code_graph_context({ subject: "..." })` |
| Before memory save | `memory_save()` via generate-context.js |

Also reduce Claude-hook-specific wording in non-Claude instruction files, but record the remaining references as a known residual gap until the follow-up cleanup lands.

**Files to change:**
- `CODEX.md` — add No Hook Transport section
- `AGENTS.md` — define `@context-prime` and add No Hook Transport session lifecycle guidance
- `GEMINI.md` — add No Hook Transport section
- `.codex/agents/orchestrate.toml` — reduce Claude-hook references where possible
- `.gemini/agents/orchestrate.md` — reduce Claude-hook references where possible

### Part 2: OpenCode @context-prime Agent (from research iter 104)

Create a new lightweight agent at `.opencode/agent/context-prime.md` that:
1. Calls `session_resume()` to recover prior session state plus graph/CocoIndex availability
2. Optionally calls `session_health()` when session quality scoring is useful
3. Returns a compact "Prime Package" with: spec folder, task status, system health, and recommended next steps

This agent is invoked on first turn or after `/clear` by the orchestrator.

**Files to change:**
- New `.opencode/agent/context-prime.md`
- `.opencode/agent/orchestrate.md` — delegate to `@context-prime` on first turn or after `/clear`

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | 100% | 100% |
| OpenCode | 60% | 80% |
| Codex CLI | 55% | 80-85% |
| Copilot CLI | 50% | 80% |
| Gemini CLI | 50% | 80% |

## Estimated LOC: 140-350
## Risk: LOW — documentation and config changes only
## Dependencies: Phases 018-020 should land first (the instructions reference those tools)

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| Part 1: No Hook Transport section in CODEX.md | DONE | Trigger table added |
| Part 1: No Hook Transport section in AGENTS.md | DONE | Trigger table added |
| Part 1: No Hook Transport section in GEMINI.md | DONE | Trigger table added |
| Part 2: @context-prime agent | DONE | `.opencode/agent/context-prime.md` uses `session_resume()` plus optional `session_health()` |
| Orchestrator delegation to @context-prime | VERIFIED/DONE | F059 closed — `.opencode/agent/orchestrate.md` lines 18-21 delegate on first turn or after `/clear` |
| Claude-hook wording removed from non-Claude agent files | KNOWN GAP | Residual wording still exists in `.codex/agents/*.toml` and `.gemini/agents/*.md`; follow-up cleanup remains |

### Review Findings (iter 047)
- F059 (P2): CLOSED. `.opencode/agent/orchestrate.md` lines 18-21 wire first-turn and post-`/clear` delegation to `@context-prime`.
- Residual gap: Claude Code SessionStart hook wording still appears in `.codex/agents/orchestrate.toml` (827-835), `.codex/agents/deep-research.toml` (425-429), `.codex/agents/speckit.toml` (557-561), plus `.gemini/agents/orchestrate.md` and related Gemini agent docs. Do not treat that cleanup as complete in this phase.
