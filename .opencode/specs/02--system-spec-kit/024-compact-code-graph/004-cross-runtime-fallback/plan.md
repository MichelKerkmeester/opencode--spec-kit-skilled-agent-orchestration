# Plan: Phase 4 — Cross-Runtime Fallback

## Steps

1. **Update CLAUDE.md compaction recovery:**
   - Replace current "STOP, re-read MEMORY.md" with explicit `memory_context({ mode: "resume" })` call
   - Add instruction to call immediately after compaction, before any other action
2. **Update CODEX.md:**
   - Add equivalent compaction recovery instructions
   - Adapt language for Codex CLI context
3. **Test cross-runtime:**
   - Claude Code: Verify hooks fire AND tool-based fallback works
   - Codex CLI: Verify tool-based recovery works without hooks
   - Copilot: Verify tool-based recovery works
4. **Optional: MCP compaction detection:**
   - Track tool call timestamps in working memory
   - If gap > 30s between calls, assume compaction occurred
   - Auto-inject compaction context in next tool response

## Dependencies
- Phase 1 (validates hook pattern works)
- Can run in parallel with Phases 2-3
