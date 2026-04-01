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
| Fresh session start | `memory_context({ mode: "resume" })` + `code_graph_status()` |
| After resume/reconnect | `session_resume()` (phase 020) or manual equivalent |
| After compaction/long gap | `session_health()` → if stale, call `memory_context({ mode: "resume" })` |
| After `/clear` | Same as fresh session |
| Before structural search | `code_graph_context({ subject: "..." })` |
| Before memory save | `memory_save()` via generate-context.js |

Also remove Claude-hook-specific wording from non-Claude instruction files.

**Files to change:**
- `CODEX.md` — add No Hook Transport section
- `AGENTS.md` — add No Hook Transport section
- `GEMINI.md` — add No Hook Transport section
- `.codex/agents/orchestrate.toml` — remove Claude-hook references
- `.gemini/agents/orchestrate.md` — remove Claude-hook references

### Part 2: OpenCode @context-prime Agent (from research iter 104)

Create a new lightweight agent at `.opencode/agent/context-prime.md` that:
1. Calls `memory_context({ mode: "resume" })`
2. Calls `code_graph_status()`
3. Calls `ccc_status()`
4. Returns a compact "Prime Package" with: spec folder, task, blockers, next steps, graph status

This agent is invoked on first turn or after `/clear` by the orchestrator.

**Files to change:**
- New `.opencode/agent/context-prime.md`
- `.opencode/agent/orchestrate.md` — delegate to `@context-prime` on first turn

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
| Part 2: @context-prime agent | DONE | .opencode/agent/context-prime.md created |
| Orchestrator delegation to @context-prime | PARTIAL | F059 — needs verification of orchestrate.md wiring |

### Review Findings (iter 047)
- F059 (P2): @context-prime agent may not be wired into orchestrator. NEEDS VERIFICATION
