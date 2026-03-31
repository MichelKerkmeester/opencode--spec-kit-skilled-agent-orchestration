---
title: "Checklist: Phase 5 — Command & [02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/checklist]"
description: "checklist document for 005-command-agent-alignment."
trigger_phrases:
  - "checklist"
  - "phase"
  - "command"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 5 — Command & Agent Alignment

## P0
- [x] `/spec_kit:resume` passes `profile: "resume"` to `memory_context()`
- [x] Resume command returns compact recovery brief (not raw search results)
- [x] `/memory:save` checks for Stop hook auto-save before saving
- [x] No double-save when Stop hook and manual save both trigger
- [x] Commands function correctly without hooks (Codex, Copilot, Gemini)

## P1
- [x] Agent definitions in `.claude/agents/` updated for compaction awareness
- [x] Agent definitions in `.opencode/agent/` updated for compaction awareness
- [x] Agent definitions in `.codex/agents/` updated for compaction awareness
- [x] Agent definitions in `.gemini/agents/` updated for compaction awareness
- [x] `@handover` agent references hook state when available
- [x] `@context` agent references hook-injected context
- [x] All spec_kit commands audited (resume, handover, complete, implement) — resume, handover, implement, complete all have hook integration

## P2
- [ ] Memory commands fully audited (search, manage, learn)
- [x] Agent definitions consistent across all 4 runtime directories
- [ ] Auto-save merge logic when both hook and manual save fire
- [ ] Command help text updated to mention hook integration
