# Checklist: Phase 2 — SessionStart Hook

## P0
- [ ] `session-prime.js` created and executable
- [ ] SessionStart hook registered in settings.local.json
- [ ] Output includes constitutional memories
- [ ] Output includes relevant prior context
- [ ] Output ≤ 2000 tokens
- [ ] Script completes in < 3 seconds
- [ ] Graceful fallback when MCP unavailable

## P1
- [ ] Resume vs fresh start correctly detected
- [ ] Shared utilities extracted from Phase 1
- [ ] Recent work surfaced when resuming

## P2
- [ ] Token pressure awareness (reduce output when context window is filling)
- [ ] Spec folder detection from project context
