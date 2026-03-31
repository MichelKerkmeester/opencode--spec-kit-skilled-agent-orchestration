---
title: "Plan: Phase 1 — PreCompact Hook [02--system-spec-kit/024-compact-code-graph/001-precompact-hook/plan]"
description: "1. Create hook script directory — mkdir -p mcp_server/scripts/hooks/"
trigger_phrases:
  - "plan"
  - "phase"
  - "precompact"
  - "hook"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Plan: Phase 1 — PreCompact Hook

## Steps

1. **Create hook script directory** — `mkdir -p mcp_server/scripts/hooks/`
2. **Implement `compact-inject.js`:**
   - Import `autoSurfaceAtCompaction` from compiled dist
   - Parse stdin JSON for transcript path
   - Extract recent context from transcript (tail ~50 lines)
   - Call `autoSurfaceAtCompaction(context)`
   - Optionally query CocoIndex for semantic neighbors of active files/symbols (if MCP available)
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

<!-- ANCHOR:dependencies -->
## Dependencies
- Compiled dist of memory-surface.ts must be up to date
- `.claude/settings.local.json` must be writable
<!-- /ANCHOR:dependencies -->

## Budget Allocation (from iteration 049)
- Implement floors + overflow pool allocator
- Constitutional: 700 tokens floor
- Code graph: 1200 tokens floor
- CocoIndex: 900 tokens floor (snippets trimmed to ≤600 chars)
- Triggered: 400 tokens floor
- Overflow: 800 tokens redistributed from empty sources
- Make allocator observable in metadata (per-source requested/granted/dropped)
