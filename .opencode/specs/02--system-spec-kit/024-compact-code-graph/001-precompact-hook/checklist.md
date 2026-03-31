---
title: "Checklist: Phase 1 — PreCompact Hook [02--system-spec-kit/024-compact-code-graph/001-precompact-hook/checklist]"
description: "checklist document for 001-precompact-hook."
trigger_phrases:
  - "checklist"
  - "phase"
  - "precompact"
  - "hook"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 1 — PreCompact Hook

## P0
- [x] `compact-inject.js` created and executable
- [x] Hook registered in `.claude/settings.local.json`
- [x] PreCompact event triggers the hook script
- [x] `autoSurfaceAtCompaction()` called with session context
- [x] Output contains surfaced memories (constitutional + relevant)
- [x] Output ≤ 4000 tokens
- [x] Script completes in < 2 seconds
- [x] Graceful fallback when MCP server unavailable

## P1
- [x] Existing settings.local.json hooks preserved (merge-safe)
- [x] Transcript tail parsing extracts meaningful context
- [x] Error logging for debugging (stderr, not stdout)

## P2
- [x] Working memory attention signals included in context extraction — extractAttentionSignals() in compact-inject.ts scans for camelCase/PascalCase identifiers
- [x] Hook output format matches CLAUDE.md compaction recovery expectations
