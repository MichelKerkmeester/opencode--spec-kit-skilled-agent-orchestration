---
title: "Tasks: Command & Agent Alignment [024/005]"
description: "Task tracking for command updates and agent definition alignment across all runtimes."
---
# Tasks: Phase 005 — Command & Agent Alignment

## Completed

- [x] Audit memory commands (`.opencode/command/memory/`) for compaction references — search, manage, learn all hook-compatible; no changes needed
- [x] Update `/spec_kit:resume` to pass `profile: "resume"` to `memory_context()` — fixes iter 012 gap; compact recovery brief now returned
- [x] Update `/memory:save` for Stop hook awareness — detects recent auto-save via `pendingStopSave.cachedAt`; prompts merge/skip
- [x] Audit spec_kit commands (resume, handover, complete, implement) — all have hook integration paths
- [x] Audit agent definitions across all 4 runtime directories for compaction recovery references
- [x] Update `.claude/agents/*.md` with hook-injected context awareness and tool fallback
- [x] Update `.opencode/agent/*.md` with hook-injected context awareness and tool fallback
- [x] Update `.codex/agents/*.toml` with hook-injected context awareness and tool fallback
- [x] Update `.gemini/agents/*.md` with hook-injected context awareness and tool fallback
- [x] Update `@handover` agent to reference hook state when available
- [x] Update `@context` agent to reference hook-injected context before broad exploration
- [x] Verify commands function correctly without hooks active (Codex, Copilot, Gemini) — manual recovery fallback preserved
- [x] Auto-save merge logic when both hook and manual save fire — `session-stop.ts` checks `pendingStopSave.cachedAt` before saving
- [x] Agent definitions consistent across all 4 runtime directories
- [x] SKILL.md updated with Hook System and Code Graph sections covering command help text
