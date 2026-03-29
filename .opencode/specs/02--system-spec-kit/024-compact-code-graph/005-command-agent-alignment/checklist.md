# Checklist: Phase 5 — Command & Agent Alignment

## P0
- [ ] `/spec_kit:resume` passes `profile: "resume"` to `memory_context()`
- [ ] Resume command returns compact recovery brief (not raw search results)
- [ ] `/memory:save` checks for Stop hook auto-save before saving
- [ ] No double-save when Stop hook and manual save both trigger
- [ ] Commands function correctly without hooks (Codex, Copilot, Gemini)

## P1
- [ ] Agent definitions in `.claude/agents/` updated for compaction awareness
- [ ] Agent definitions in `.opencode/agent/` updated for compaction awareness
- [ ] Agent definitions in `.codex/agents/` updated for compaction awareness
- [ ] Agent definitions in `.gemini/agents/` updated for compaction awareness
- [ ] `@handover` agent references hook state when available
- [ ] `@context` agent references hook-injected context
- [ ] All spec_kit commands audited (resume, handover, complete, implement)

## P2
- [ ] Memory commands fully audited (search, manage, learn)
- [ ] Agent definitions consistent across all 4 runtime directories
- [ ] Auto-save merge logic when both hook and manual save fire
- [ ] Command help text updated to mention hook integration
