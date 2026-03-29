# Checklist: Phase 1 — PreCompact Hook

## P0
- [ ] `compact-inject.js` created and executable
- [ ] Hook registered in `.claude/settings.local.json`
- [ ] PreCompact event triggers the hook script
- [ ] `autoSurfaceAtCompaction()` called with session context
- [ ] Output contains surfaced memories (constitutional + relevant)
- [ ] Output ≤ 4000 tokens
- [ ] Script completes in < 2 seconds
- [ ] Graceful fallback when MCP server unavailable

## P1
- [ ] Existing settings.local.json hooks preserved (merge-safe)
- [ ] Transcript tail parsing extracts meaningful context
- [ ] Error logging for debugging (stderr, not stdout)

## P2
- [ ] Working memory attention signals included in context extraction
- [ ] Hook output format matches CLAUDE.md compaction recovery expectations
