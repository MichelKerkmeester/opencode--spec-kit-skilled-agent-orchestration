# Plan: Phase 1 — PreCompact Hook

## Steps

1. **Create hook script directory** — `mkdir -p mcp_server/scripts/hooks/`
2. **Implement `compact-inject.js`:**
   - Import `autoSurfaceAtCompaction` from compiled dist
   - Parse stdin JSON for transcript path
   - Extract recent context from transcript (tail ~50 lines)
   - Call `autoSurfaceAtCompaction(context)`
   - Format and output to stdout
   - Add error handling (try/catch, timeout, fallback)
3. **Register hook in settings.local.json:**
   - Read existing file
   - Merge PreCompact hook entry
   - Write back without destroying existing config
4. **Test manually:**
   - Trigger compaction in Claude Code
   - Verify hook fires and outputs context
   - Verify output stays within token budget
5. **Test edge cases:**
   - MCP server not running → graceful fallback
   - Empty transcript → minimal output
   - Large transcript → stays within 2s timeout

## Dependencies
- Compiled dist of memory-surface.ts must be up to date
- `.claude/settings.local.json` must be writable
