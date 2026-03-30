# Phase 5: Command & Agent Alignment

## Summary
Update commands and agent definitions across all runtimes to work with the new hook system. Commands like `/spec_kit:resume` and `/memory:save` need hook-awareness, and agent definitions referencing compaction recovery must align with hook-injected context.

## Gap Analysis

| Gap | Current State | Target State |
|-----|---------------|--------------|
| `/spec_kit:resume` missing `profile: "resume"` | Calls `memory_context({ mode: "resume" })` without profile param | Pass `profile: "resume"` for compact brief format (iter 012 finding) |
| `/memory:save` double-save risk | Always saves unconditionally | Check if Stop hook already saved context; skip or merge |
| Agent compaction instructions stale | Agents reference manual compaction recovery | Agents reference hook-injected context when available |
| Command memory awareness | Commands unaware of hook-injected context | Commands check for hook context before redundant MCP calls |

## What to Update

### 1. Memory Commands (`.opencode/command/memory/`)

Audit all commands for compaction references:
- `/memory:save` — Must detect if Stop hook has already saved session context (avoid double-save). Check `session_token_snapshots` table or temp state file for recent auto-save.
- `/memory:search`, `/memory:manage` — Likely no changes needed, but verify no compaction-specific assumptions.

### 2. Spec Kit Commands (`.opencode/command/spec_kit/`)

- `/spec_kit:resume` — Must pass `profile: "resume"` to `memory_context()`. Currently missing this parameter, which causes search results instead of a compact recovery brief (iteration 012 gap).
- `/spec_kit:handover` — Verify handover doc creation accounts for hook-based context snapshots.
- `/spec_kit:complete`, `/spec_kit:implement` — Verify no compaction-related assumptions broken by hooks.

### 3. Agent Definitions

Audit and update agent files that reference compaction recovery across all runtimes:

| Runtime | Agent Directory | Files to Check |
|---------|----------------|---------------|
| Claude | `.claude/agents/` | All agent `.md` files referencing compaction |
| OpenCode (Copilot) | `.opencode/agent/` | All agent `.md` files referencing compaction |
| Codex | `.codex/agents/` | All agent `.md` files referencing compaction |
| Gemini | `.gemini/agents/` | All agent `.md` files referencing compaction |

Updates needed:
- Add conditional: "If hook-injected context is present, use it instead of manual recovery calls"
- Keep manual recovery as fallback for runtimes without hooks
- Ensure `@handover` and `@context` agents reference hook state when available

### 4. Query-Intent Routing

Agents should route queries to the appropriate system based on intent:

| Query Intent | Primary Source | Secondary |
|---|---|---|
| "Find code related to X" | CocoIndex (semantic) | Code graph (expand neighbors) |
| "What calls this function?" | Code graph (structural) | — |
| "What imports this file?" | Code graph (structural) | — |
| "How does retry logic work?" | CocoIndex (semantic) | Code graph (trace call chain) |
| "What changed recently?" | Memory (session) | Code graph (impact analysis) |
| "Show file structure/outline" | Code graph (structural) | — |

**Agent update guidance:**
- Use CocoIndex (`mcp__cocoindex_code__search`) for "find code that...", "how is X implemented", semantic discovery
- Use Code Graph (`code_graph_query`, when available) for "what calls/imports/extends...", structural navigation
- Use Memory (`memory_search`, `memory_context`) for session continuity, prior decisions, compaction recovery

### 5. Working-Set Awareness (Iteration 053)

Agents should be aware of the session working set when available:
- After compaction, the working set identifies which files/symbols were actively touched
- Agents receiving compaction-recovery context should prioritize working-set files over generic search results
- The `@context` agent should check for working-set data before doing broad codebase exploration
- Working-set data includes: file paths, symbol names, access type (read/write/reference), structural role

## Acceptance Criteria
- [ ] `/spec_kit:resume` passes `profile: "resume"` to `memory_context()`
- [ ] `/memory:save` detects Stop hook auto-save and avoids double-save
- [ ] Agent definitions updated across all 4 runtime directories
- [ ] Agents reference hook-injected context when available, with tool fallback
- [ ] Commands work correctly both with and without hooks active
- [ ] No regression in command behavior for non-hook runtimes (Codex, Copilot, Gemini)

## Files Modified
- EDIT: `.opencode/command/spec_kit/resume.md` (add `profile: "resume"`)
- EDIT: `.opencode/command/memory/save.md` (add Stop hook double-save check)
- EDIT: `.claude/agents/*.md` (compaction-aware agents)
- EDIT: `.opencode/agent/*.md` (compaction-aware agents)
- EDIT: `.codex/agents/*.md` (compaction-aware agents)
- EDIT: `.gemini/agents/*.md` (compaction-aware agents)

## LOC Estimate
~100-150 lines across command updates + ~80-120 lines across agent definitions
