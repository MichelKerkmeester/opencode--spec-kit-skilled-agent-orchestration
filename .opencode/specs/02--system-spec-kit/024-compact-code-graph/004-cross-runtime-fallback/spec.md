---
title: "Phase 4: Cross-Runtime Fallback [02--system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec]"
description: "Ensure all runtimes (OpenCode, Codex CLI, Copilot, Gemini CLI) get context injection via tool-based approach in CLAUDE.md/CODEX.md, complementing the hook-based approach for Cla..."
trigger_phrases:
  - "phase"
  - "cross"
  - "runtime"
  - "fallback"
  - "spec"
  - "004"
importance_tier: "important"
contextType: "implementation"
---
# Phase 4: Cross-Runtime Fallback

## Summary
Ensure all runtimes (OpenCode, Codex CLI, Copilot, Gemini CLI) get context injection via tool-based approach in CLAUDE.md/CODEX.md, complementing the hook-based approach for Claude Code.

## Gap Analysis (iteration 012)

Five gaps identified in current compaction handling:

| Gap | Description | Fix |
|-----|-------------|-----|
| A. No provider lifecycle hook | `autoSurfaceAtCompaction()` only runs when AI calls `memory_context(resume)` | Phases 1-2 fix for Claude; this phase fixes for others |
| B. No private Claude recovery layer | `.claude/CLAUDE.md` doesn't exist | Create it with Claude-specific recovery |
| C. Envelope metadata < prompt injection | Auto-surface adds hints, not prompt-state restoration | Use `profile: "resume"` for brief format |
| D. Session-start is generic | Startup instructions only announce stats | Phase 2 adds context priming |
| E. Archived hook design never graduated | `pre_compact.py` in `z_archive` only | Phases 1-3 implement the real version |

## Runtime Detection (iteration 015)

Introduce a capability-based runtime model with two outputs:

```typescript
interface RuntimeCapability {
  runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli' | 'unknown';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
}
```

**Current evidence (iteration 011):**

| Runtime | Hook Support | v1 Policy |
|---------|-------------|-----------|
| Claude Code | 25 events, 4 handler types | `enabled` |
| Codex CLI | None confirmed | `unavailable` |
| Copilot CLI | Has hooks (guardrails focus) | `disabled_by_scope` (v1 policy) |
| Gemini CLI | Has hooks (v0.33.1+, `/hooks` UI) | `disabled_by_scope` (v1 policy) |

**Note:** CocoIndex Code MCP is available across all runtimes as a shared semantic search capability.

**Key finding (iter 015):** Don't hardcode "all other runtimes lack hooks" — frame as v1 policy, not ecosystem truth. Copilot and Gemini hook adapters can be added later by updating the fixture.

## Shared Cross-Runtime Capabilities

CocoIndex Code MCP is available across **all runtimes** as an MCP server, providing a shared semantic search capability regardless of hook support:

| Capability | Availability | Notes |
|------------|-------------|-------|
| CocoIndex semantic search | All runtimes | MCP server, not runtime-specific |
| Memory MCP (auto-surface, triggers) | All runtimes | MCP server, not runtime-specific |
| Hook-based injection | Claude Code only (v1) | Runtime-specific |
| Tool-based fallback | All runtimes | Via CLAUDE.md/CODEX.md instructions |

This means the semantic code search layer works identically whether the session uses hooks (Claude Code) or tool-based fallback (Codex, Copilot, Gemini). The structural code graph (planned, phases 008+) will similarly be MCP-based and runtime-agnostic.

**Query-Intent Routing** (Iteration 048): All runtimes benefit from intent-based routing regardless of hook support:
- Structural queries → `code_graph_query` / `code_graph_context` (MCP, runtime-agnostic)
- Semantic queries → `mcp__cocoindex_code__search` (MCP, runtime-agnostic)
- Session queries → `memory_context` / `memory_match_triggers` (MCP, runtime-agnostic)
- The router is an MCP-level concern, not a hook-level concern — works identically across all runtimes

## What to Update

### 1. CLAUDE.md Compaction Recovery Enhancement

Current approach: "use `/spec_kit:resume` or `memory_context({ mode: "resume" })`"
Enhanced approach — add explicit, immediate tool call instruction:

```markdown
## Context Compaction Behavior
After any context compaction event:
1. IMMEDIATELY call `memory_context({ mode: "resume", profile: "resume", input: "context compaction recovery" })`
2. Read the response — it contains state, next steps, and blockers
3. Re-read this CLAUDE.md file
4. Summarize and WAIT for user confirmation
```

**NOTE (iter 012):** Must pass `profile: "resume"` — without it, you get search results instead of a compact brief.

### 2. Create `.claude/CLAUDE.md` (Gap B fix)

Claude-specific private instructions with:
- Explicit compaction recovery steps
- Reference to hook-based injection (when hooks are active)
- Instruction to check `autoSurface` hints in MCP responses

### 3. Runtime-Specific Instruction Files

Update instruction files for each runtime:
- `CODEX.md` — Add compaction recovery (explicit `memory_context(resume)` call)
- Runtime docs should reference the same two primitives: `memory_match_triggers` + `memory_context(resume)`

### 4. MCP-Level Compaction Detection (Optional)

Add time-gap based compaction detection inside the MCP server:
- Track timestamps of tool calls in working memory
- If gap > configurable threshold (suggesting compaction occurred): auto-inject compaction context in next response
- Makes recovery runtime-agnostic at the MCP level
- Flag: `SPECKIT_AUTO_COMPACT_DETECT` (default off for v1)

## Test Strategy (iteration 015)

7-scenario matrix with runtime fixture contract:

| Scenario | Path | Assertions |
|----------|------|------------|
| Claude with hooks | SessionStart + PreCompact + Stop | Hook fires, correct MCP calls, budget enforced |
| Codex without hooks | Tool fallback | Runtime=codex-cli, hookPolicy=unavailable, Gate 1 works |
| Copilot without hooks (v1) | Tool fallback by policy | Runtime=copilot-cli, hooks suppressed by policy |
| Gemini without hooks (v1) | Tool fallback by policy | Runtime=gemini-cli, hooks suppressed by policy |
| Compaction recovery | PreCompact → SessionStart(compact) | Surfaced payload truncates, constitutional ordering stable |
| Session resume after crash | resetInterruptedSessions + resume | Interrupted sessions recoverable, session IDs reused |
| Multi-session continuity | Session lifecycle + working memory | Event counters continue, no cross-session bleed |

## Acceptance Criteria
- [ ] CLAUDE.md compaction section updated with explicit `memory_context({ mode: "resume", profile: "resume" })` call
- [ ] `.claude/CLAUDE.md` created with Claude-specific recovery instructions
- [ ] CODEX.md updated with recovery instructions
- [ ] Runtime detection produces both `runtime` and `hookPolicy`
- [ ] Codex CLI sessions recover context via tool calls (tested)
- [ ] Gate 1 fires `memory_match_triggers` reliably post-compaction
- [ ] No regression in existing Gate system behavior

## Files Modified
- EDIT: `CLAUDE.md` (compaction recovery section)
- NEW: `.claude/CLAUDE.md` (Claude-specific recovery)
- EDIT: `CODEX.md` or equivalent runtime instruction files
- OPTIONAL: MCP server compaction detection logic

## LOC Estimate
~50-80 lines (instruction updates) + optional ~80 lines (MCP detection)
