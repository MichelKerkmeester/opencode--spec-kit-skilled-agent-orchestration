# Phase 4: Cross-Runtime Fallback

## Summary
Ensure all runtimes (OpenCode, Codex CLI, Copilot, Gemini CLI) get context injection via tool-based approach in CLAUDE.md/CODEX.md, complementing the hook-based approach for Claude Code.

## What Exists
- CLAUDE.md Gate 1 triggers `memory_match_triggers()` on each user message
- CLAUDE.md compaction recovery section (manual AI-driven)
- `memory_context({ mode: "resume" })` for session recovery
- `autoSurfaceAtCompaction()` called internally at tool dispatch time

## What to Update

### 1. CLAUDE.md Compaction Recovery Enhancement
Current approach: "STOP, re-read MEMORY.md, summarize..."
Enhanced approach: Add explicit tool call instruction:

```markdown
## Context Compaction Behavior
After any context compaction event:
1. IMMEDIATELY call `memory_context({ mode: "resume", input: "context compaction recovery" })`
2. Read the response — it contains your critical context
3. Re-read CLAUDE.md
4. Summarize and WAIT for user confirmation
```

### 2. Gate 1 Enhancement
Add compaction detection to Gate 1:
- If the first tool call after compaction, prioritize `memory_context({ mode: "resume" })`
- Use `autoSurfaceAtCompaction` path internally when compaction detected

### 3. Runtime-Specific Instruction Files
Update instruction files for each runtime:
- `CODEX.md` — Add compaction recovery instructions for Codex CLI
- `CLAUDE.md` — Enhanced (as above)
- Other runtime instruction files as needed

### 4. MCP Server Enhancement (Optional)
Add compaction detection to the MCP server itself:
- Track time between tool calls
- If gap > threshold (suggesting compaction occurred), auto-inject compaction context
- This makes compaction recovery runtime-agnostic at the MCP level

## Acceptance Criteria
- [ ] CLAUDE.md compaction section updated with explicit `memory_context` call
- [ ] Codex CLI sessions recover context after compaction via tool calls
- [ ] Copilot sessions recover context after compaction via tool calls
- [ ] Gate 1 fires `memory_match_triggers` reliably post-compaction
- [ ] No regression in existing Gate system behavior

## Files Modified
- EDIT: `CLAUDE.md` (compaction recovery section)
- EDIT: `CODEX.md` or equivalent runtime instruction files
- OPTIONAL: MCP server compaction detection logic

## LOC Estimate
~30-50 lines (instruction file updates) + optional ~50 lines (MCP detection)
