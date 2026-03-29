# Checklist: Phase 3 — Stop Hook + Token Tracking

## P0
- [ ] `session-stop.ts` created with async execution
- [ ] `claude-transcript.ts` parses JSONL incrementally
- [ ] Stop hook registered with `async: true`
- [ ] Token snapshot stored in `session_token_snapshots` table
- [ ] `stop_hook_active` guard prevents recursion
- [ ] No OOM on large transcripts (streaming parse)
- [ ] Cost estimate calculated per model

## P1
- [ ] Incremental parsing with `.stopoffset` (only new lines)
- [ ] Context auto-save when >1000 output tokens
- [ ] Hook-state updated with save bookmark
- [ ] Spec folder auto-detected from transcript or hook-state
- [ ] Append-only snapshots (multiple Stop fires handled)

## P2
- [ ] Token usage viewable via `memory_stats` tool
- [ ] `token_usage_ratio` fed back into MCP pressure logic
- [ ] Session summary extraction for auto-save
- [ ] `SessionEnd` hook reuses `session-stop.ts --finalize` for cleanup
