# Checklist: Phase 3 — Stop Hook + Token Tracking

## P0
- [ ] `session-stop.js` created and executable
- [ ] Stop hook registered in settings.local.json
- [ ] Transcript parsed for token usage
- [ ] Token usage stored in SQLite
- [ ] Script completes in < 10 seconds
- [ ] No OOM on large transcripts

## P1
- [ ] Cost estimate calculated per model
- [ ] Incremental parsing with `.stopoffset`
- [ ] Context auto-save when significant work done (>1000 output tokens)

## P2
- [ ] Token usage viewable via `memory_stats` tool
- [ ] Session summary extraction for auto-save
- [ ] Spec folder auto-detection from transcript
