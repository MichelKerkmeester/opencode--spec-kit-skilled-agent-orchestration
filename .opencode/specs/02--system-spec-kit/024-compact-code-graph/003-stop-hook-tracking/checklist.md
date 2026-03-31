---
title: "Checklist: Phase 3 — Stop Hook + Token [02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/checklist]"
description: "checklist document for 003-stop-hook-tracking."
trigger_phrases:
  - "checklist"
  - "phase"
  - "stop"
  - "hook"
  - "token"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 3 — Stop Hook + Token Tracking

## P0
- [x] `session-stop.ts` created with async execution
- [x] `claude-transcript.ts` parses JSONL incrementally
- [x] Stop hook registered with `async: true`
- [x] Token snapshot stored in hook state metrics
- [x] `stop_hook_active` guard prevents recursion
- [x] No OOM on large transcripts (streaming parse)
- [x] Cost estimate calculated per model

## P1
- [x] Incremental parsing with byte offset (only new lines)
- [x] Context auto-save when >1000 output tokens — AUTO_SAVE_TOKEN_THRESHOLD in session-stop.ts
- [x] Hook-state updated with save bookmark
- [x] Spec folder auto-detected from transcript or hook-state — detectSpecFolder() in session-stop.ts
- [x] Append-only snapshots (multiple Stop fires handled)

## P2
- [x] Token usage viewable via `memory_stats` tool — hook state stores estimatedPromptTokens/estimatedCompletionTokens; code_graph_status exposes graph metrics
- [x] `token_usage_ratio` fed back into MCP pressure logic — getTokenUsageRatio() in code-graph-db.ts + calculatePressureAdjustedBudget() in shared.ts
- [x] Session summary extraction for auto-save — extractSessionSummary() in session-stop.ts stores to hook state sessionSummary
- [x] `SessionEnd` hook reuses `session-stop.ts --finalize` for cleanup — --finalize argv flag triggers cleanStaleStates()
