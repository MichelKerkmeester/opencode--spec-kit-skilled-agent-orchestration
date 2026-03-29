# Plan: Phase 2 — SessionStart Hook

## Steps

1. **Implement `session-prime.js`:**
   - Reuse shared utilities from Phase 1 (error handling, MCP connection)
   - Import `memory_context` equivalent from compiled dist or call via MCP CLI
   - Detect resume vs fresh start (check recent memory saves)
   - Format output with constitutional memories + context
2. **Register SessionStart hook in settings.local.json:**
   - Extend Phase 1's merge-safe registration
3. **Test:**
   - Start new Claude Code session → verify priming output
   - Resume after recent work → verify resume context
   - Cold start (no prior work) → verify minimal but useful output
4. **Shared utilities:**
   - Extract common code between compact-inject.js and session-prime.js
   - Create `scripts/hooks/lib/mcp-client.js` for shared MCP communication

## Dependencies
- Phase 1 (shared patterns and utilities)
- Compiled dist of memory hooks
