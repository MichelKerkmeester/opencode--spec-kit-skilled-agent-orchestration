# Checklist: Hybrid Context Injection

## P0 — Must Pass

- [ ] PreCompact hook fires and injects context on Claude Code auto-compact
- [ ] SessionStart hook primes new sessions with relevant prior context
- [ ] Hook scripts complete in <2 seconds
- [ ] Hook scripts handle MCP server unavailability gracefully (no crash, no block)
- [ ] Compaction token budget enforced (<=4000 tokens)
- [ ] Cross-runtime tool fallback works (Codex CLI, Copilot tested)
- [ ] Existing Gate system not broken by hook additions
- [ ] `.claude/settings.local.json` hook registration is merge-safe (preserves existing hooks)

## P1 — Should Pass

- [ ] Stop hook saves session context automatically
- [ ] Token usage tracked and stored in SQLite
- [ ] CLAUDE.md compaction recovery section enhanced with explicit tool calls
- [ ] Session priming detects resume vs fresh start
- [ ] Constitutional memories surface on both hook and tool paths

## P2 — Nice to Have

- [ ] Token tracking viewable via `memory_stats` or new tool
- [ ] Session priming respects token pressure (reduces output when context window is filling)
- [ ] Stop hook auto-detects spec folder from transcript
- [ ] PreCompact hook includes brief task summary from working memory
