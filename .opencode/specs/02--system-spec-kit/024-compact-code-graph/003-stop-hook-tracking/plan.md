# Plan: Phase 3 — Stop Hook + Token Tracking

## Steps

1. **Design token usage schema:**
   - Add `token_usage` table to existing SQLite database
   - Define cost calculation per model (Opus, Sonnet, Haiku pricing)
2. **Implement `session-stop.js`:**
   - Parse transcript JSONL with streaming/line-by-line approach
   - Use `.stopoffset` pattern from Dual-Graph (incremental parsing)
   - Extract usage from assistant message objects
   - Calculate cost estimate
   - Insert into token_usage table
3. **Add optional context save:**
   - Check output token count (threshold: >1000 tokens)
   - Extract brief session summary
   - Call `generate-context.js` with summary
4. **Register Stop hook in settings.local.json**
5. **Test:**
   - End a session → verify token tracking
   - Verify cost calculation accuracy
   - Test with large transcripts (>10MB)

## Dependencies
- Phases 1-2 (shared utilities)
- SQLite database access from hook script
